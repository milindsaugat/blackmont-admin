import React, { useState, useEffect, useCallback, Component } from 'react';
import { AlertCircle, Check, Clock, ExternalLink, Loader2, Save } from 'lucide-react';
import SectionForm from '../../components/SectionForm';

import AboutEditor from './sections/AboutEditor';
import WhyBlackmontEditor from './sections/WhyBlackmontEditor';
import WhoWeServeEditor from './sections/WhoWeServeEditor';
import MarketEditor from './sections/MarketEditor';
import ContactCTAEditor from './sections/ContactCTAEditor';
import HeroEditor from './sections/HeroEditor';
import { storage } from '../../utils/storage';

import {
  getAdminHomeHero,
  updateHomeHero,
} from '../../services/homeHeroService';

import {
  getAdminHomeAbout,
  updateHomeAbout,
  getAdminWhyBlackmont,
  updateWhyBlackmont,
  getAdminContactCta,
  updateContactCta,
} from '../../services/homeService';
import {
  getAdminWhoWeServe,
  updateWhoWeServe,
} from '../../services/whoWeServeService';

import {
  getAdminHomeMarket,
  updateHomeMarket,
} from '../../services/homeMarketService';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', background: '#ffebee', borderRadius: 8 }}>
          <h3>Something went wrong.</h3>
          <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 300 }}>
            {this.state.error?.stack}
          </pre>
          <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 300 }}>
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const homeSections = [
  { key: 'hero', label: 'Hero', fields: [] },
  { key: 'about', label: 'HomeAboutPreview', fields: [] },
  { key: 'whyBlackmont', label: 'Why Blackmont', fields: [] },
  { key: 'whoWeServe', label: 'Who We Serve', fields: [] },
  { key: 'market', label: 'HomeMarketPreview', fields: [] },
  { key: 'contactCta', label: 'Contact CTA', fields: [] },
];

const mapHeroToEditor = (doc = {}) => ({
  eyebrow: doc.eyebrow || '',
  heading: doc.heading || '',
  description: doc.description || '',
  primaryButtonText: doc.primaryButtonText || '',
  primaryButtonLink: doc.primaryButtonLink || '',
  secondaryButtonText: doc.secondaryButtonText || '',
  secondaryButtonLink: doc.secondaryButtonLink || '',
  isActive: doc.isActive !== false,
});

const mapBackendToEditor = (doc = {}) => ({
  title: doc.title || '',
  description: doc.description || '',
  isActive: doc.isActive !== false,
  images: (doc.images || []).map((img) => ({
    _id: img._id,
    imageUrl: img.imageUrl || '',
    altText: img.altText || '',
  })),
  cards: (doc.cards || []).map((c) => ({
    _id: c._id,
    title: c.title || '',
    description: c.description || '',
  })),
});

const mapWhyBlackmontToEditor = (doc = {}) => ({
  eyebrowLabel: doc.eyebrowLabel || '',
  mainHeading: doc.mainHeading || '',
  subHeading: doc.subHeading || '',
  isActive: doc.isActive !== false,
  featureColumns: (doc.featureColumns?.length ? doc.featureColumns : doc.features || []).map((c) => ({
    _id: c._id,
    number: c.number || '',
    title: c.title || '',
    description: c.description || '',
    order: c.order || 0,
  })),
});

const mapWhoWeServeToEditor = (doc = {}) => ({
  eyebrow: doc.eyebrow || 'WHO WE SERVE',
  heading: doc.heading || 'Who We Serve',
  subtitle: doc.subtitle || '',
  cards: (doc.cards || []).map((card, index) => ({
    _id: card._id,
    icon: card.icon || 'users',
    title: card.title || '',
    description: card.description || '',
    sortOrder: card.sortOrder || index + 1,
    isActive: card.isActive !== false,
  })),
});

const mapMarketToEditor = (doc = {}) => ({
  eyebrowLabel: doc.eyebrowLabel || '',
  mainHeading: doc.mainHeading || '',
  description: doc.description || '',
  isActive: doc.isActive !== false,
  chartTitle: doc.chartTitle || '',
  chartSubtitle: doc.chartSubtitle || '',
  chartBadge: doc.chartBadge || '',
  tags: (doc.tags || []).map((t, i) => ({ label: t, __localId: i })),
  chartData: (doc.chartData || []).map((d) => ({
    _id: d._id,
    year: d.year || d.label || '',
    label: d.label,
    value: d.value,
    growthPercent: d.growthPercent ?? d.previousYearChange ?? '',
    previousYearChange: d.previousYearChange ?? d.growthPercent ?? '',
    unit: d.unit || d.currency || 'USD',
    currency: d.currency || d.unit || 'USD',
  })),
});

const mapContactCtaToEditor = (doc = {}) => ({
  eyebrowLabel: doc.eyebrowLabel || '',
  mainHeading: doc.mainHeading || '',
  description: doc.description || '',
  buttonLabel: doc.buttonLabel || '',
  buttonHref: doc.buttonHref || '/contact',
  isActive: doc.isActive !== false,
});

const syncHeroWithBackend = async (current) => {
  await updateHomeHero({
    eyebrow: current.eyebrow,
    heading: current.heading,
    description: current.description,
    primaryButtonText: current.primaryButtonText,
    primaryButtonLink: current.primaryButtonLink,
    secondaryButtonText: current.secondaryButtonText,
    secondaryButtonLink: current.secondaryButtonLink,
    isActive: current.isActive !== false,
  });
  return await getAdminHomeHero();
};

const syncAboutWithBackend = async (current) => {
  await updateHomeAbout({
    title: current.title,
    description: current.description,
    isActive: current.isActive !== false,
    images: current.images || [],
    cards: current.cards || [],
  });

  return await getAdminHomeAbout();
};

const syncWhyBlackmontWithBackend = async (current) => {
  await updateWhyBlackmont({
    eyebrowLabel: current.eyebrowLabel,
    mainHeading: current.mainHeading,
    subHeading: current.subHeading,
    isActive: current.isActive !== false,
    featureColumns: (current.featureColumns || []).map((col, index) => ({
      _id: col._id,
      number: col.number || '',
      title: col.title || '',
      description: col.description || '',
      order: col.order || index + 1,
    })),
    features: (current.featureColumns || []).map((col, index) => ({
      _id: col._id,
      number: col.number || '',
      title: col.title || '',
      description: col.description || '',
      order: col.order || index + 1,
    })),
  });

  return await getAdminWhyBlackmont();
};

const syncWhoWeServeWithBackend = async (current) => {
  await updateWhoWeServe({
    eyebrow: current.eyebrow,
    heading: current.heading,
    subtitle: current.subtitle,
    cards: (current.cards || []).map((card, index) => ({
      icon: card.icon || 'users',
      title: card.title || '',
      description: card.description || '',
      sortOrder: card.sortOrder || index + 1,
      isActive: card.isActive !== false,
    })),
  });

  return await getAdminWhoWeServe();
};

const syncMarketWithBackend = async (_original, current) => {
  const currTagsStr = (current.tags || []).map((t) => (typeof t === 'string' ? t : t.label));

  await updateHomeMarket({
    eyebrowLabel: current.eyebrowLabel,
    mainHeading: current.mainHeading,
    description: current.description,
    isActive: current.isActive !== false,
    chartTitle: current.chartTitle,
    chartSubtitle: current.chartSubtitle,
    chartBadge: current.chartBadge,
    tags: currTagsStr,
    chartData: (current.chartData || []).map((point) => ({
      year: point.year || point.label,
      value: Number(point.value),
      label: point.label || 'Year High USD',
      growthPercent:
        point.growthPercent === '' || point.growthPercent === undefined
          ? undefined
          : Number(point.growthPercent),
      previousYearChange:
        point.growthPercent === '' || point.growthPercent === undefined
          ? undefined
          : Number(point.growthPercent),
      unit: point.unit || 'USD',
      currency: point.currency || 'USD',
    })),
  });

  return await getAdminHomeMarket();
};

export default function StandaloneHomeEditor({ addToast }) {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState({});

  const [heroData, setHeroData] = useState({});
  const [loadingHero, setLoadingHero] = useState(true);

  const [aboutData, setAboutData] = useState({});
  const [loadingAbout, setLoadingAbout] = useState(true);

  const [whyBlackmontData, setWhyBlackmontData] = useState({});
  const [loadingWhyBlackmont, setLoadingWhyBlackmont] = useState(true);

  const [whoWeServeData, setWhoWeServeData] = useState({});
  const [loadingWhoWeServe, setLoadingWhoWeServe] = useState(true);

  const [marketData, setMarketData] = useState({});
  const [marketOriginal, setMarketOriginal] = useState({});
  const [loadingMarket, setLoadingMarket] = useState(true);

  const [contactCtaData, setContactCtaData] = useState({});
  const [loadingContactCta, setLoadingContactCta] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const existing = storage.getPageContent('home_cms') || {};
    const defaults = {};

    homeSections.forEach((sec) => {
      if (!['hero', 'about', 'whyBlackmont', 'whoWeServe', 'market', 'contactCta'].includes(sec.key)) {
        defaults[sec.key] = existing[sec.key] || {};
      }
    });

    setData(defaults);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingHero(true);

      try {
        const doc = await getAdminHomeHero();

        if (!cancelled) {
          setHeroData(mapHeroToEditor(doc));
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Failed to load Hero data.');
          addToast?.(err.message || 'Failed to load Hero data.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingHero(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingAbout(true);

      try {
        const doc = await getAdminHomeAbout();

        if (!cancelled) {
          setAboutData(mapBackendToEditor(doc));
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Failed to load HomeAboutPreview data.');
          addToast?.(err.message || 'Failed to load HomeAboutPreview data.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingAbout(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingWhyBlackmont(true);

      try {
        const doc = await getAdminWhyBlackmont();

        if (!cancelled) {
          setWhyBlackmontData(mapWhyBlackmontToEditor(doc));
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Failed to load Why Blackmont data.');
          addToast?.(err.message || 'Failed to load Why Blackmont data.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingWhyBlackmont(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingWhoWeServe(true);

      try {
        const doc = await getAdminWhoWeServe();

        if (!cancelled) {
          setWhoWeServeData(mapWhoWeServeToEditor(doc));
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Failed to load Who We Serve data.');
          addToast?.(err.message || 'Failed to load Who We Serve data.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingWhoWeServe(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingMarket(true);

      try {
        const doc = await getAdminHomeMarket();

        if (!cancelled) {
          const mapped = mapMarketToEditor(doc);
          setMarketData(mapped);
          setMarketOriginal(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Failed to load HomeMarket data.');
          addToast?.(err.message || 'Failed to load HomeMarket data.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingMarket(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingContactCta(true);

      try {
        const doc = await getAdminContactCta();

        if (!cancelled) {
          setContactCtaData(mapContactCtaToEditor(doc));
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Failed to load Contact CTA data.');
          addToast?.(err.message || 'Failed to load Contact CTA data.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingContactCta(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const onChange = useCallback((sectionKey, sectionData) => {
    setData((prev) => ({ ...prev, [sectionKey]: sectionData }));
    setDirty(true);
  }, []);

  const onHeroChange = useCallback((newHero) => {
    setHeroData(newHero);
    setDirty(true);
  }, []);

  const onAboutChange = useCallback((newAbout) => {
    setAboutData(newAbout);
    setDirty(true);
  }, []);

  const onWhyBlackmontChange = useCallback((newWhyBlackmont) => {
    setWhyBlackmontData(newWhyBlackmont);
    setDirty(true);
  }, []);

  const onWhoWeServeChange = useCallback((newWhoWeServe) => {
    setWhoWeServeData(newWhoWeServe);
    setDirty(true);
  }, []);

  const onMarketChange = useCallback((newMarket) => {
    setMarketData(newMarket);
    setDirty(true);
  }, []);

  const onContactCtaChange = useCallback((newContactCta) => {
    setContactCtaData(newContactCta);
    setDirty(true);
  }, []);

  const safeTab = tab < homeSections.length ? tab : 0;
  const cur = homeSections[safeTab];

  const save = async () => {
    setSaving(true);
    setErrorMsg('');

    try {
      if (cur.key === 'hero') {
        const freshDoc = await syncHeroWithBackend(heroData);
        setHeroData(mapHeroToEditor(freshDoc));
        addToast?.('Hero saved successfully.', 'success');
      } else if (cur.key === 'about') {
        const freshDoc = await syncAboutWithBackend(aboutData);
        setAboutData(mapBackendToEditor(freshDoc));
        addToast?.('HomeAboutPreview saved successfully.', 'success');
      } else if (cur.key === 'whyBlackmont') {
        const freshDoc = await syncWhyBlackmontWithBackend(whyBlackmontData);
        setWhyBlackmontData(mapWhyBlackmontToEditor(freshDoc));
        addToast?.('Why Blackmont saved successfully.', 'success');
      } else if (cur.key === 'whoWeServe') {
        const freshDoc = await syncWhoWeServeWithBackend(whoWeServeData);
        setWhoWeServeData(mapWhoWeServeToEditor(freshDoc));
        addToast?.('Who We Serve saved successfully.', 'success');
      } else if (cur.key === 'market') {
        const freshDoc = await syncMarketWithBackend(marketOriginal, marketData);
        const mapped = mapMarketToEditor(freshDoc);
        setMarketData(mapped);
        setMarketOriginal(mapped);
        addToast?.('HomeMarketPreview saved successfully.', 'success');
      } else if (cur.key === 'contactCta') {
        const freshDoc = await updateContactCta({
          eyebrowLabel: contactCtaData.eyebrowLabel,
          mainHeading: contactCtaData.mainHeading,
          description: contactCtaData.description,
          buttonLabel: contactCtaData.buttonLabel,
          buttonHref: contactCtaData.buttonHref,
          isActive: contactCtaData.isActive !== false,
        });

        setContactCtaData(mapContactCtaToEditor(freshDoc));
        addToast?.('Contact CTA saved successfully.', 'success');
      } else {
        const currentStorage = storage.getPageContent('home_cms') || {};
        storage.setPageContent('home_cms', { ...currentStorage, ...data });
        addToast?.(`${cur.label} saved successfully.`, 'success');
      }

      setSaved(true);
      setDirty(false);
      setLastSaved(new Date());
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setErrorMsg(err.message || 'Save failed. Please try again.');
      addToast?.(err.message || 'Save failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const ago = () => {
    if (!lastSaved) return null;

    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  const isHeroTab = cur.key === 'hero';
  const isAboutTab = cur.key === 'about';
  const isWhyBlackmontTab = cur.key === 'whyBlackmont';
  const isWhoWeServeTab = cur.key === 'whoWeServe';
  const isMarketTab = cur.key === 'market';
  const isContactCtaTab = cur.key === 'contactCta';

  const isLoadingCurrent =
    (isHeroTab && loadingHero) ||
    (isAboutTab && loadingAbout) ||
    (isWhyBlackmontTab && loadingWhyBlackmont) ||
    (isWhoWeServeTab && loadingWhoWeServe) ||
    (isMarketTab && loadingMarket) ||
    (isContactCtaTab && loadingContactCta);

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - var(--header-h))',
      }}
    >
      <div
        style={{
          height: 56,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--gold)',
            }}
          />

          <span className="typo-h1" style={{ fontSize: 18 }}>
            Home Page CMS
          </span>

          <span style={{ color: '#333', margin: '0 2px' }}>/</span>

          <span className="typo-body" style={{ fontSize: 13 }}>
            {cur.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && (
            <span
              className="typo-caption"
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Clock size={12} />
              Saved: {ago()}
            </span>
          )}

          <a
            href="http://localhost:5173/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: 'rgba(212,175,55,0.1)',
              color: 'var(--gold)',
              borderRadius: 4,
              textDecoration: 'none',
              fontSize: 11,
              fontWeight: 500,
              border: '1px solid var(--gold-20)',
            }}
          >
            <ExternalLink size={12} />
            LIVE PREVIEW
          </a>
        </div>
      </div>

      <div
        style={{
          height: 46,
          background: 'var(--bg-inset)',
          borderBottom: '1px solid var(--border-default)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {homeSections.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(i)}
            style={{
              height: 46,
              padding: '0 16px',
              fontSize: 13,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: tab === i ? 500 : 400,
              color: tab === i ? '#D4AF37' : '#666',
              background: tab === i ? 'rgba(212,175,55,0.04)' : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${tab === i ? '#D4AF37' : 'transparent'}`,
              borderRadius: tab === i ? '6px 6px 0 0' : 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 150ms',
            }}
          >
            {t.label}

            {dirty && tab === i && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#D4AF37',
                  display: 'inline-block',
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg-root)',
          padding: '28px 24px 100px',
        }}
      >
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>
          {cur.label}
        </h2>

        <p className="typo-small">
          Edit {cur.label} section content for the Home Page
        </p>

        <div
          style={{
            width: 36,
            height: 1,
            background: 'var(--gold)',
            margin: '10px 0 24px',
          }}
        />

        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,85,85,0.18)',
              background: 'rgba(255,85,85,0.06)',
              color: '#ff7777',
              fontSize: 13,
            }}
          >
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {cur.key === 'hero' && (
          loadingHero ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              <Loader2 size={18} className="animate-spin" />
              Loading Hero data…
            </div>
          ) : (
            <HeroEditor data={heroData} onChange={onHeroChange} />
          )
        )}

        {cur.key === 'about' && (
          loadingAbout ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              <Loader2 size={18} className="animate-spin" />
              Loading HomeAboutPreview data…
            </div>
          ) : (
            <AboutEditor data={aboutData} onChange={onAboutChange} />
          )
        )}

        {cur.key === 'whyBlackmont' && (
          loadingWhyBlackmont ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              <Loader2 size={18} className="animate-spin" />
              Loading Why Blackmont data…
            </div>
          ) : (
            <WhyBlackmontEditor
              data={whyBlackmontData}
              onChange={onWhyBlackmontChange}
            />
          )
        )}

        {cur.key === 'whoWeServe' && (
          loadingWhoWeServe ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              <Loader2 size={18} className="animate-spin" />
              Loading Who We Serve data...
            </div>
          ) : (
            <WhoWeServeEditor
              data={whoWeServeData}
              onChange={onWhoWeServeChange}
            />
          )
        )}

        {cur.key === 'market' && (
          loadingMarket ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              <Loader2 size={18} className="animate-spin" />
              Loading HomeMarketPreview data…
            </div>
          ) : (
            <ErrorBoundary>
              <MarketEditor data={marketData} onChange={onMarketChange} />
            </ErrorBoundary>
          )
        )}

        {cur.key === 'contactCta' && (
          loadingContactCta ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
              <Loader2 size={18} className="animate-spin" />
              Loading Contact CTA data…
            </div>
          ) : (
            <ContactCTAEditor
              data={contactCtaData}
              onChange={onContactCtaChange}
            />
          )
        )}

        {!['hero', 'about', 'whyBlackmont', 'whoWeServe', 'market', 'contactCta'].includes(cur.key) && (
          <SectionForm
            key={cur.key}
            fields={cur.fields}
            data={data[cur.key] || {}}
            onChange={(d) => onChange(cur.key, d)}
          />
        )}
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'rgba(8,8,8,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-default)',
          padding: '14px 24px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {dirty && (
            <span
              className="animate-fade-in typo-caption"
              style={{
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#D4AF37',
                  display: 'inline-block',
                }}
              />
              Unsaved changes
            </span>
          )}

          <button
            onClick={save}
            disabled={saving || isLoadingCurrent}
            className="gold-btn"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : saved ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}

            {saving ? 'SAVING…' : saved ? 'SAVED!' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
