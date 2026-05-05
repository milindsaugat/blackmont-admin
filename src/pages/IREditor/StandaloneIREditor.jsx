import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Save, Loader2, Check, Clock } from 'lucide-react';

import IRFrameworkCardsEditor from './sections/IRFrameworkCardsEditor';
import IRReportsEditor from './sections/IRReportsEditor';
import IRStockInfoEditor from './sections/IRStockInfoEditor';
import IRGovernanceEditor from './sections/IRGovernanceEditor';
import IREventsEditor from './sections/IREventsEditor';
import { storage } from '../../utils/storage';
import { investorOverviewService } from '../../services/investorOverviewService';
import { investorReportsService } from '../../services/investorReportsService';
import { investorStockService } from '../../services/investorStockService';
import { investorEventsService } from '../../services/investorEventsService';

const irTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'reports', label: 'Reports' },
  { key: 'stockInfo', label: 'Stock Information' },
  { key: 'events', label: 'Event or Presentation' },
  { key: 'governance', label: 'Corporate Governance' },
];

export default function StandaloneIREditor() {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const [data, setData] = useState({ hero: {}, framework: { cards: [] }, reports: {}, stockInfo: {}, governance: {}, events: {} });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [savingCardId, setSavingCardId] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [error, setError] = useState(null);
  const [overviewDirty, setOverviewDirty] = useState(false);
  const [reportsDirty, setReportsDirty] = useState(false);
  const [stockDirty, setStockDirty] = useState(false);
  const [eventsDirty, setEventsDirty] = useState(false);
  const [governanceDirty, setGovernanceDirty] = useState(false);
  // Track which individual items have been edited
  const [dirtyItemIds, setDirtyItemIds] = useState(new Set());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const idx = irTabs.findIndex(s => s.key === tabParam);
      if (idx !== -1) setTab(idx);
    }
  }, [location.search]);

  // Fetch investor overview data from API on mount
  useEffect(() => {
    const loadData = async () => {
      setLoadingOverview(true);
      setError(null);
      try {
        const [overviewRes, reportsRes, stockRes, eventsRes] = await Promise.all([
          investorOverviewService.getAdminInvestorOverview().catch(e => {
            console.error('Failed to load investor overview:', e);
            return null;
          }),
          investorReportsService.getAdminInvestorReports().catch(e => {
            console.error('Failed to load investor reports:', e);
            return [];
          }),
          investorStockService.getAdminStockInfo().catch(e => {
            console.error('Failed to load stock info:', e);
            return null;
          }),
          investorEventsService.getAdminInvestorEvents().catch(e => {
            console.error('Failed to load investor events:', e);
            return [];
          })
        ]);

        setData(prev => {
          const newData = { ...prev };
          if (overviewRes && overviewRes.frameworkCards) {
            newData.framework = { cards: overviewRes.frameworkCards };
          }
          if (reportsRes) {
            newData.reports = { reports: reportsRes };
          }
          if (stockRes) {
            newData.stockInfo = stockRes;
          }
          if (eventsRes) {
            newData.events = { eventCards: eventsRes };
          }
          return newData;
        });
      } catch (err) {
        console.error('Failed to load data:', err);
        const existing = storage.getPageContent('ir_overview_cms');
        if (existing) {
          setData(prev => ({
            ...prev,
            framework: existing.framework || { cards: [] },
            reports: existing.reports || { reports: [] },
            stockInfo: existing.stockInfo || {},
            events: existing.events || { eventCards: [] }
          }));
        }
      } finally {
        setLoadingOverview(false);
      }
    };

    loadData();
  }, []);

  // Keep loading existing data from storage for other tabs
  useEffect(() => {
    const existing = storage.getPageContent('ir_overview_cms');
    if (existing) {
      setData(prev => ({
        ...prev,
        hero: existing.hero || {},
        reports: existing.reports || {},
        stockInfo: existing.stockInfo || {},
        governance: existing.governance || {},
        events: existing.events || {}
      }));
    }
  }, []);

  const onChange = useCallback((tabKey, tabData) => {
    setData(prev => {
      // Track which items changed
      const prevItems = tabKey === 'framework' ? prev.framework?.cards
        : tabKey === 'reports' ? prev.reports?.reports
        : tabKey === 'stockInfo' ? [...(prev.stockInfo?.leftCards || []), ...(prev.stockInfo?.stockInfoItems || [])]
        : tabKey === 'events' ? prev.events?.eventCards
        : tabKey === 'governance' ? prev.governance?.pillars
        : [];
      const newItems = tabKey === 'framework' ? tabData?.cards
        : tabKey === 'reports' ? tabData?.reports
        : tabKey === 'stockInfo' ? [...(tabData?.leftCards || []), ...(tabData?.stockInfoItems || [])]
        : tabKey === 'events' ? tabData?.eventCards
        : tabKey === 'governance' ? tabData?.pillars
        : [];
      if (Array.isArray(prevItems) && Array.isArray(newItems)) {
        const changedIds = new Set();
        newItems.forEach((item, i) => {
          const itemId = item?._id || item?.id;
          if (!itemId) { changedIds.add(itemId || `new_${i}`); return; }
          const prev = prevItems.find(p => (p._id || p.id) === itemId);
          if (!prev || JSON.stringify(prev) !== JSON.stringify(item)) changedIds.add(itemId);
        });
        if (changedIds.size > 0) setDirtyItemIds(prev => new Set([...prev, ...changedIds]));
      }
      return { ...prev, [tabKey]: tabData };
    });
    setDirty(true);
    if (tabKey === 'framework') {
      setOverviewDirty(true);
    } else if (tabKey === 'reports') {
      setReportsDirty(true);
    } else if (tabKey === 'stockInfo') {
      setStockDirty(true);
    } else if (tabKey === 'events') {
      setEventsDirty(true);
    } else if (tabKey === 'governance') {
      setGovernanceDirty(true);
    }
  }, []);

  // API callback: Add new card
  const handleAddCard = useCallback(async (newCard) => {
    setSavingCardId(newCard.id);
    try {
      const formData = new FormData();
      formData.append('cardTitle', newCard.cardTitle);
      formData.append('cardDescription', newCard.cardDescription);
      formData.append('downloadButtonType', newCard.downloadButtonType);
      formData.append('showTopGoldDividerLine', newCard.showTopGoldDividerLine);
      formData.append('order', newCard.order);

      const response = await investorOverviewService.addFrameworkCard(formData);

      // Update local state with server response (includes _id)
      setData(prev => {
        const cards = prev.framework.cards.map(c => c.id === newCard.id ? response : c);
        return { ...prev, framework: { cards } };
      });

      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to add card:', err);
      setError(err.message || 'Failed to add card');
      // Remove the card from local state if API fails
      setData(prev => ({
        ...prev,
        framework: { cards: prev.framework.cards.filter(c => c.id !== newCard.id) }
      }));
    } finally {
      setSavingCardId(null);
    }
  }, []);

  // API callback: Delete card
  const handleDeleteCard = useCallback(async (cardId, index) => {
    setSavingCardId(cardId);
    try {
      await investorOverviewService.deleteFrameworkCard(cardId);

      // Update local state by removing the card
      setData(prev => ({
        ...prev,
        framework: { cards: prev.framework.cards.filter((_, i) => i !== index) }
      }));

      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to delete card:', err);
      setError(err.message || 'Failed to delete card');
    } finally {
      setSavingCardId(null);
    }
  }, []);

  const handleDeleteReport = useCallback(async (reportId, index) => {
    setSavingCardId(reportId);
    try {
      if (typeof reportId === 'string' && reportId.length > 10) {
        await investorReportsService.deleteReport(reportId);
      }
      setData(prev => ({
        ...prev,
        reports: { reports: prev.reports.reports.filter((_, i) => i !== index) }
      }));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to delete report:', err);
      setError(err.message || 'Failed to delete report');
    } finally {
      setSavingCardId(null);
    }
  }, []);

  const handleDeleteLeftCard = useCallback(async (cardId, index) => {
    setSavingCardId(cardId);
    try {
      if (typeof cardId === 'string' && cardId.length > 10) {
        await investorStockService.deleteLeftCard(cardId);
      }
      setData(prev => ({
        ...prev,
        stockInfo: { ...prev.stockInfo, leftCards: (prev.stockInfo.leftCards || []).filter((_, i) => i !== index) }
      }));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to delete left card:', err);
      setError(err.message || 'Failed to delete left card');
    } finally {
      setSavingCardId(null);
    }
  }, []);

  const handleDeleteInfoItem = useCallback(async (itemId, index) => {
    setSavingCardId(itemId);
    try {
      if (typeof itemId === 'string' && itemId.length > 10) {
        await investorStockService.deleteInfoItem(itemId);
      }
      setData(prev => ({
        ...prev,
        stockInfo: { ...prev.stockInfo, stockInfoItems: (prev.stockInfo.stockInfoItems || []).filter((_, i) => i !== index) }
      }));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to delete info item:', err);
      setError(err.message || 'Failed to delete info item');
    } finally {
      setSavingCardId(null);
    }
  }, []);

  const handleDeleteEvent = useCallback(async (eventId, index) => {
    setSavingCardId(eventId);
    try {
      if (typeof eventId === 'string' && eventId.length > 10) {
        await investorEventsService.deleteEvent(eventId);
      }
      setData(prev => ({
        ...prev,
        events: { eventCards: (prev.events.eventCards || []).filter((_, i) => i !== index) }
      }));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError(err.message || 'Failed to delete event');
    } finally {
      setSavingCardId(null);
    }
  }, []);

  const handleToggleEventPublished = useCallback(async (eventId, index, isPublished) => {
    if (!(typeof eventId === 'string' && eventId.length > 10)) {
      setData(prev => {
        const eventCards = [...(prev.events.eventCards || [])];
        eventCards[index] = { ...eventCards[index], isPublished };
        return { ...prev, events: { eventCards } };
      });
      setDirty(true);
      setEventsDirty(true);
      return;
    }

    setSavingCardId(eventId);
    try {
      const response = await investorEventsService.updatePublishStatus(eventId, isPublished);
      setData(prev => {
        const eventCards = [...(prev.events.eventCards || [])];
        eventCards[index] = {
          ...eventCards[index],
          isPublished: response.isPublished,
        };
        return { ...prev, events: { eventCards } };
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to update event publish status:', err);
      setError(err.message || 'Failed to update event publish status');
    } finally {
      setSavingCardId(null);
    }
  }, []);

  const buildFrameworkCardFormData = (card) => {
    const formData = new FormData();
    formData.append('cardTitle', card.cardTitle || '');
    formData.append('cardDescription', card.cardDescription || '');
    formData.append('downloadButtonType', card.downloadButtonType || 'noButton');
    formData.append('showTopGoldDividerLine', card.showTopGoldDividerLine !== false);
    formData.append('order', card.order || 0);

    if (card.downloadButtonType === 'externalUrl') {
      formData.append('externalUrl', card.externalUrl || '');
    } else {
      formData.append('externalUrl', '');
    }

    if (card.downloadButtonType === 'uploadFile' && card.cardFile) {
      formData.append('cardFile', card.cardFile);
    }

    return formData;
  };

  const saveFrameworkCards = async () => {
    const cards = data.framework?.cards || [];
    const savedCards = await Promise.all(
      cards.map(async (card, index) => {
        const cardId = card._id || card.id;
        // Skip unchanged existing cards
        if (card._id && !dirtyItemIds.has(cardId)) return card;
        const formData = buildFrameworkCardFormData({ ...card, order: index + 1 });
        return card._id
          ? await investorOverviewService.updateFrameworkCard(card._id, formData)
          : await investorOverviewService.addFrameworkCard(formData);
      })
    );
    setSavingCardId(null);
    setData(prev => ({ ...prev, framework: { cards: savedCards } }));
    return { cards: savedCards };
  };

  const saveReports = async () => {
    const reportsList = data.reports?.reports || [];
    const savedReports = await Promise.all(
      reportsList.map(async (report, index) => {
        const reportId = report._id || report.id;
        // Skip unchanged existing reports (unless they have a new file or removeFile)
        if (report._id && !dirtyItemIds.has(reportId) && !report.reportFile && !report.removeFile) return report;
        const formData = new FormData();
        formData.append('categoryTag', report.categoryTag || '');
        formData.append('reportTitle', report.reportTitle || '');
        formData.append('date', report.date || '');
        formData.append('downloadButtonLabel', report.downloadButtonLabel || 'Download PDF');
        formData.append('fileSource', report.fileSource || 'externalUrl');
        formData.append('isPublished', report.isPublished !== false);
        formData.append('order', index + 1);
        if (report.fileSource === 'externalUrl') {
          formData.append('externalUrl', report.externalUrl || '');
        }
        if (report.fileSource === 'uploadFile') {
          if (report.reportFile) {
            formData.append('reportFile', report.reportFile);
          } else if (report.removeFile) {
            formData.append('removeFile', 'true');
          }
        }
        return report._id
          ? await investorReportsService.updateReport(report._id, formData)
          : await investorReportsService.addReport(formData);
      })
    );
    setSavingCardId(null);
    setData(prev => ({ ...prev, reports: { reports: savedReports } }));
    return { reports: savedReports };
  };

  const saveStockInfo = async () => {
    const sInfo = data.stockInfo || {};
    const lCards = sInfo.leftCards || [];
    const iItems = sInfo.stockInfoItems || [];

    const [savedCards, savedItems] = await Promise.all([
      Promise.all(lCards.map(async (card, index) => {
        const cardId = card._id || card.id;
        if (card._id && !dirtyItemIds.has(cardId)) return card;
        const payload = { badgePrefixText: card.badgePrefixText || '', cardTitle: card.cardTitle || '', cardDescription: card.cardDescription || '', order: index + 1 };
        return card._id ? await investorStockService.updateLeftCard(card._id, payload) : await investorStockService.addLeftCard(payload);
      })),
      Promise.all(iItems.map(async (item, index) => {
        const itemId = item._id || item.id;
        if (item._id && !dirtyItemIds.has(itemId)) return item;
        const payload = { label: item.label || '', value: item.value || '', order: index + 1 };
        return item._id ? await investorStockService.updateInfoItem(item._id, payload) : await investorStockService.addInfoItem(payload);
      }))
    ]);

    setSavingCardId(null);
    const newStockInfo = { ...sInfo, leftCards: savedCards, stockInfoItems: savedItems };
    setData(prev => ({ ...prev, stockInfo: newStockInfo }));
    return newStockInfo;
  };

  const saveEvents = async () => {
    const eventCards = data.events?.eventCards || [];
    const savedEvents = await Promise.all(
      eventCards.map(async (event, index) => {
        const eventId = event._id || event.id;
        if (event._id && !dirtyItemIds.has(eventId) && !event.eventFile && !event.removeFile) return event;
        const formData = new FormData();
        formData.append('categoryTag', event.categoryTag || '');
        formData.append('eventTitle', event.eventTitle || '');
        formData.append('date', event.date || '');
        formData.append('buttonLabel', event.buttonLabel || 'View Presentation');
        formData.append('description', event.description || '');
        formData.append('fileSource', event.fileSource || 'externalUrl');
        formData.append('status', event.status || 'outlined');
        formData.append('isPublished', event.isPublished !== false);
        formData.append('order', index + 1);
        if (event.fileSource === 'externalUrl') {
          formData.append('externalUrl', event.externalUrl || '');
        }
        if (event.fileSource === 'uploadFile') {
          if (event.eventFile) {
            formData.append('eventFile', event.eventFile);
          } else if (event.removeFile) {
            formData.append('removeFile', 'true');
          }
        }
        return event._id
          ? await investorEventsService.updateEvent(event._id, formData)
          : await investorEventsService.addEvent(formData);
      })
    );
    setSavingCardId(null);
    setData(prev => ({ ...prev, events: { eventCards: savedEvents } }));
    return { eventCards: savedEvents };
  };

  const saveGovernance = async () => {
    const governanceData = data.governance || {};
    const updatedGovernance = await investorOverviewService.updateCorporateGovernance(data.governance);
    let savedGovernance = updatedGovernance;

    if (Array.isArray(governanceData.pillars)) {
      const pillarResults = await Promise.all(
        governanceData.pillars.map(async (pillar, index) => {
          const pillarId = pillar._id || pillar.id;
          if (pillar._id && !dirtyItemIds.has(pillarId)) return pillar;
          const payload = { number: pillar.number || '', title: pillar.title || '', description: pillar.description || '', order: pillar.order ?? index + 1, isActive: pillar.isActive !== false };
          return pillar._id
            ? await investorOverviewService.updateGovernancePillar(pillar._id, payload)
            : await investorOverviewService.addGovernancePillar(payload);
        })
      );
      savedGovernance = { ...savedGovernance, pillars: pillarResults };
    }

    setData(prev => ({ ...prev, governance: savedGovernance }));
    return savedGovernance;
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const sections = [overviewDirty && 'Overview', reportsDirty && 'Reports', stockDirty && 'Stock', eventsDirty && 'Events', governanceDirty && 'Governance'].filter(Boolean);
    const changeCount = sections.length;
    setSaveStatus(changeCount > 0 ? `Saving ${changeCount} section${changeCount > 1 ? 's' : ''}...` : 'Saving...');
    try {
      // Run all dirty sections in parallel
      const [savedFramework, savedReportsData, savedStockInfo, savedEventsData, savedGovernance] = await Promise.all([
        overviewDirty ? saveFrameworkCards() : data.framework,
        reportsDirty ? saveReports() : data.reports,
        stockDirty ? saveStockInfo() : data.stockInfo,
        eventsDirty ? saveEvents() : data.events,
        governanceDirty ? saveGovernance() : data.governance,
      ]);

      // Only save legacy/non-API data to localStorage
      const storageData = {
        hero: data.hero || {},
        framework: savedFramework || data.framework || {},
        reports: savedReportsData || data.reports || {},
        stockInfo: savedStockInfo || data.stockInfo || {},
        governance: savedGovernance || data.governance || {},
        events: savedEventsData || data.events || {}
      };
      storage.setPageContent('ir_overview_cms', storageData);
      setSaved(true);
      setDirty(false);
      setOverviewDirty(false);
      setReportsDirty(false);
      setStockDirty(false);
      setEventsDirty(false);
      setGovernanceDirty(false);
      setDirtyItemIds(new Set());
      setSaveStatus('');
      setLastSaved(new Date());
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
      setSavingCardId(null);
      setTimeout(() => setSaved(false), 2500);
    }
  };



  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  const safeTab = tab < irTabs.length ? tab : 0;
  const cur = irTabs[safeTab];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>
      {/* Header */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>Investor Relations</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>Overview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} />Saved: {ago()}</span>}
          <a href="http://localhost:5173/investor-relations" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontWeight: 500, border: '1px solid var(--gold-20)' }}>
            <ExternalLink size={12} /> VIEW LIVE PAGE
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ height: 46, background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flexShrink: 0 }}>
        {irTabs.map((t, i) => (
          <button key={t.key} onClick={() => setTab(i)}
            style={{ height: 46, padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: tab === i ? 500 : 400, color: tab === i ? '#D4AF37' : '#666', background: tab === i ? 'rgba(212,175,55,0.04)' : 'transparent', border: 'none', borderBottom: `2px solid ${tab === i ? '#D4AF37' : 'transparent'}`, borderRadius: tab === i ? '6px 6px 0 0' : 0, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 150ms' }}
            onMouseEnter={e => { if (tab !== i) e.currentTarget.style.color = '#999'; }}
            onMouseLeave={e => { if (tab !== i) e.currentTarget.style.color = '#666'; }}>
            {t.label}
            {dirty && tab === i && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>{cur.label}</h2>
        <p className="typo-small">Edit {cur.label.toLowerCase()} content</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 8, color: '#ff5555', marginBottom: 20, fontSize: 13 }}>
            {error}
          </div>
        )}

        {cur.key === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 className="typo-h1" style={{ fontSize: 16, marginBottom: 0, color: 'var(--gold)' }}>Framework Cards {loadingOverview && <Loader2 size={14} className="animate-spin" style={{ display: 'inline-block', marginLeft: 8 }} />}</h3>
            <IRFrameworkCardsEditor
              data={data.framework}
              onChange={d => onChange('framework', d)}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              savingCardId={savingCardId}
            />
          </div>
        )}
        {cur.key === 'reports' && <IRReportsEditor data={data.reports} onChange={d => onChange('reports', d)} onDeleteReport={handleDeleteReport} savingReportId={savingCardId} />}
        {cur.key === 'stockInfo' && <IRStockInfoEditor data={data.stockInfo} onChange={d => onChange('stockInfo', d)} onDeleteLeftCard={handleDeleteLeftCard} onDeleteInfoItem={handleDeleteInfoItem} savingStockId={savingCardId} />}
        {cur.key === 'events' && <IREventsEditor data={data.events} onChange={d => onChange('events', d)} onDeleteEvent={handleDeleteEvent} onTogglePublished={handleToggleEventPublished} savingEventId={savingCardId} />}
        {cur.key === 'governance' && (
          <IRGovernanceEditor
            data={data.governance}
            onChange={d => onChange('governance', d)}
          />
        )}
      </div>

      {/* Bottom */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-default)', padding: '14px 24px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {dirty && <span className="animate-fade-in typo-caption" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />Unsaved changes</span>}
          <button onClick={save} disabled={saving} className="gold-btn">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? (saveStatus || 'SAVING...') : saved ? 'SAVED!' : 'SAVE ALL'}
          </button>
        </div>
      </div>
    </div>
  );
}
