import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Save, Loader2, Check, Clock } from 'lucide-react';
import BlogEditor from './sections/BlogEditor';
import NewsroomEditor from './sections/NewsroomEditor';
import {
  createInsight,
  deleteInsight,
  getAdminInsights,
  updateInsight,
  getAdminInsightHeader,
  updateInsightHeader,
} from '../../services/insightService';
import {
  createNewsroomArticle,
  deleteNewsroomArticle,
  getAdminNewsroom,
  updateNewsroomArticle,
  updateNewsroomHeader,
} from '../../services/newsroomService';

const insightsTabs = [
  { key: 'blog', label: 'Blog' },
  { key: 'newsroom', label: 'Newsroom' },
];

export default function StandaloneInsightsEditor() {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const [data, setData] = useState({ blog: {}, newsroom: {} });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [blogDirty, setBlogDirty] = useState(false);
  const [newsroomDirty, setNewsroomDirty] = useState(false);
  const [originalBlogIds, setOriginalBlogIds] = useState([]);
  const [originalNewsroomIds, setOriginalNewsroomIds] = useState([]);
  const [error, setError] = useState(null);

  const mapInsightToArticle = (insight) => ({
    id: insight._id,
    _id: insight._id,
    title: insight.title || '',
    categoryTag: insight.categoryTag || '',
    excerpt: insight.excerpt || '',
    date: insight.date || '',
    readTime: insight.readTime || '',
    slug: insight.slug || '',
    readMoreLink: insight.readMoreLink || '',
    thumbnail: insight.thumbnailUrl || '',
    thumbnailUrl: insight.thumbnailUrl || '',
    isFeatured: !!insight.isFeatured,
    isPublished: insight.isPublished !== false,
    order: insight.order || 0,
  });

  const isBlankArticle = (article) =>
    !article.title?.trim() &&
    !article.categoryTag?.trim() &&
    !article.excerpt?.trim() &&
    !article.thumbnail;

  const isBlankNewsroomArticle = (article) =>
    !article.title?.trim() &&
    !article.categoryPrefix?.trim() &&
    !article.excerpt?.trim() &&
    !article.thumbnail;

  const dataUrlToFile = async (dataUrl, fallbackName) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const extension = blob.type?.split('/')[1] || 'png';
    return new File([blob], `${fallbackName}.${extension}`, { type: blob.type });
  };

  const buildInsightFormData = async (article, index) => {
    const formData = new FormData();
    const slug = article.slug?.replace(/^\/insights\//, '').trim();

    formData.append('title', article.title.trim());
    formData.append('categoryTag', article.categoryTag.trim());
    formData.append('excerpt', article.excerpt.trim());
    formData.append('date', article.date || '');
    formData.append('readTime', article.readTime || '');
    formData.append('isFeatured', String(!!article.isFeatured));
    formData.append('isPublished', String(article.isPublished !== false));
    formData.append('order', String(index + 1));

    if (slug) formData.append('slug', slug);

    if (article.thumbnail?.startsWith('data:')) {
      const file = await dataUrlToFile(article.thumbnail, `insight-thumbnail-${index + 1}`);
      formData.append('thumbnail', file);
    }

    return formData;
  };

  const mapNewsroomToState = (newsroom = {}) => ({
    sectionEyebrowLabel: newsroom.sectionEyebrowLabel || '',
    sectionHeading: newsroom.sectionHeading || '',
    sectionDescription: newsroom.sectionDescription || '',
    disclaimerText: newsroom.disclaimerText || '',
    articles: (newsroom.articles || []).map((article) => ({
      id: article._id,
      _id: article._id,
      title: article.title || '',
      categoryPrefix: article.categoryPrefix || '',
      date: article.date || '',
      excerpt: article.excerpt || '',
      readMoreLink: article.readMoreLink || '',
      slug: article.slug || '',
      thumbnail: article.thumbnail || article.thumbnailUrl || '',
      thumbnailUrl: article.thumbnailUrl || '',
      isPublished: article.isPublished !== false,
      order: article.order || 0,
    })),
  });

  const buildNewsroomArticleFormData = async (article, index) => {
    const formData = new FormData();
    const slug = article.slug?.replace(/^\/newsroom\//, '').trim();

    formData.append('title', article.title.trim());
    formData.append('categoryPrefix', article.categoryPrefix.trim());
    formData.append('excerpt', article.excerpt.trim());
    formData.append('date', article.date || '');
    formData.append('isPublished', String(article.isPublished !== false));
    formData.append('order', String(index + 1));

    if (slug) formData.append('slug', slug);

    if (article.thumbnail?.startsWith('data:')) {
      const file = await dataUrlToFile(article.thumbnail, `newsroom-thumbnail-${index + 1}`);
      formData.append('thumbnail', file);
    }

    return formData;
  };

  const loadBlogInsights = useCallback(async () => {
    const insights = await getAdminInsights();
    const articles = insights.map(mapInsightToArticle);
    
    // Fetch insight header
    const header = await getAdminInsightHeader();
    
    setData(prev => ({
      ...prev,
      blog: {
        articles,
        sectionEyebrowLabel: header?.sectionEyebrowLabel || '',
        sectionHeading: header?.sectionHeading || '',
        sectionDescription: header?.sectionDescription || '',
      },
    }));
    setOriginalBlogIds(articles.map(article => article._id).filter(Boolean));
  }, []);

  const loadNewsroom = useCallback(async () => {
    const newsroom = await getAdminNewsroom();
    const nextNewsroom = mapNewsroomToState(newsroom);
    setData(prev => ({
      ...prev,
      newsroom: nextNewsroom,
    }));
    setOriginalNewsroomIds(
      nextNewsroom.articles.map(article => article._id).filter(Boolean)
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const idx = insightsTabs.findIndex(s => s.key === tabParam);
      if (idx !== -1) setTab(idx);
    }
  }, [location.search]);

  useEffect(() => {
    loadBlogInsights().catch(error => {
      console.error('Failed to load admin insights:', error);
      setError(error.message || 'Failed to load blog articles');
    });

    loadNewsroom().catch(error => {
      console.error('Failed to load admin newsroom:', error);
      setError(error.message || 'Failed to load newsroom content');
    });
  }, [loadBlogInsights, loadNewsroom]);

  const onChange = useCallback((tabKey, tabData) => {
    setData(prev => ({ ...prev, [tabKey]: tabData }));
    setDirty(true);
    if (tabKey === 'blog') {
      setBlogDirty(true);
    } else if (tabKey === 'newsroom') {
      setNewsroomDirty(true);
    }
  }, []);

  const saveBlogArticles = async () => {
    const articles = data.blog?.articles || [];
    const nonBlankArticles = articles.filter(article => !isBlankArticle(article));
    const invalidArticle = nonBlankArticles.find(article =>
      !article.title?.trim() || !article.categoryTag?.trim() || !article.excerpt?.trim()
    );

    if (invalidArticle) {
      throw new Error('Please fill title, category and description before saving.');
    }

    // Save header
    await updateInsightHeader({
      sectionEyebrowLabel: data.blog?.sectionEyebrowLabel || '',
      sectionHeading: data.blog?.sectionHeading || '',
      sectionDescription: data.blog?.sectionDescription || '',
    });

    const currentIds = nonBlankArticles.map(article => article._id).filter(Boolean);
    const deletedIds = originalBlogIds.filter(id => !currentIds.includes(id));

    await Promise.all(deletedIds.map(id => deleteInsight(id)));

    // Save articles in parallel
    const savedArticles = await Promise.all(
      nonBlankArticles.map(async (article, index) => {
        const formData = await buildInsightFormData(article, index);
        if (article._id) {
          return updateInsight(article._id, formData);
        } else {
          return createInsight(formData);
        }
      })
    );

    await loadBlogInsights();
  };

  const saveNewsroom = async () => {
    const newsroom = data.newsroom || {};
    const articles = newsroom.articles || [];
    const nonBlankArticles = articles.filter(article => !isBlankNewsroomArticle(article));
    const invalidArticle = nonBlankArticles.find(article =>
      !article.title?.trim() || !article.categoryPrefix?.trim() || !article.excerpt?.trim()
    );

    if (invalidArticle) {
      throw new Error('Please fill title, category and description before saving.');
    }

    await updateNewsroomHeader({
      sectionEyebrowLabel: newsroom.sectionEyebrowLabel || '',
      sectionHeading: newsroom.sectionHeading || '',
      sectionDescription: newsroom.sectionDescription || '',
      disclaimerText: newsroom.disclaimerText || '',
    });

    const currentIds = nonBlankArticles.map(article => article._id).filter(Boolean);
    const deletedIds = originalNewsroomIds.filter(id => !currentIds.includes(id));

    await Promise.all(deletedIds.map(id => deleteNewsroomArticle(id)));

    // Save articles in parallel
    const savedArticles = await Promise.all(
      nonBlankArticles.map(async (article, index) => {
        const formData = await buildNewsroomArticleFormData(article, index);
        if (article._id) {
          return updateNewsroomArticle(article._id, formData);
        } else {
          return createNewsroomArticle(formData);
        }
      })
    );

    await loadNewsroom();
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      // Run dirty sections in parallel
      const tasks = [];
      if (blogDirty) tasks.push(saveBlogArticles());
      if (newsroomDirty) tasks.push(saveNewsroom());
      await Promise.all(tasks);

      setSaved(true);
      setDirty(false);
      setBlogDirty(false);
      setNewsroomDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save insights:', error);
      setError(error.message || 'Failed to save insights');
      alert(error.message || 'Failed to save insights');
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };



  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  const safeTab = tab < insightsTabs.length ? tab : 0;
  const cur = insightsTabs[safeTab];

  // Helper to get total featured count across both tabs
  const getFeaturedCount = () => {
    const blogFeatured = (data.blog?.articles || []).filter(a => a.isFeatured).length;
    return blogFeatured;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>

      {/* ── Header ── */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>Insights CMS</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>Content Editor</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && (
            <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} />Saved: {ago()}
            </span>
          )}
          <a
            href={cur.key === 'blog' ? 'http://localhost:5173/insights' : 'http://localhost:5173/newsroom'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontWeight: 500, border: '1px solid var(--gold-20)' }}
          >
            <ExternalLink size={12} />
            VIEW LIVE PAGE
          </a>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ height: 46, background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flexShrink: 0 }}>
        {insightsTabs.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(i)}
            style={{
              height: 46, padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: tab === i ? 500 : 400,
              color: tab === i ? '#D4AF37' : '#666',
              background: tab === i ? 'rgba(212,175,55,0.04)' : 'transparent',
              border: 'none', borderBottom: `2px solid ${tab === i ? '#D4AF37' : 'transparent'}`,
              borderRadius: tab === i ? '6px 6px 0 0' : 0,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 150ms',
            }}
            onMouseEnter={e => { if (tab !== i) e.currentTarget.style.color = '#999'; }}
            onMouseLeave={e => { if (tab !== i) e.currentTarget.style.color = '#666'; }}
          >
            {t.label}
            {dirty && tab === i && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>{cur.label}</h2>
        <p className="typo-small">Edit {cur.label} content</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 8, color: '#ff5555', marginBottom: 20, fontSize: 13 }}>
            {error}
          </div>
        )}

        {cur.key === 'blog' ? (
          <BlogEditor
            data={data.blog}
            onChange={(newData) => onChange('blog', newData)}
            globalFeaturedCount={getFeaturedCount()}
          />
        ) : cur.key === 'newsroom' ? (
          <NewsroomEditor
            data={data.newsroom}
            onChange={(newData) => onChange('newsroom', newData)}
          />
        ) : null}
      </div>

      {/* ── Bottom ── */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-default)', padding: '14px 24px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {dirty && (
            <span className="animate-fade-in typo-caption" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
              Unsaved changes
            </span>
          )}
          <button onClick={save} disabled={saving} className="gold-btn">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? `SAVING ${[blogDirty && 'Blog', newsroomDirty && 'Newsroom'].filter(Boolean).length} section${[blogDirty && 'Blog', newsroomDirty && 'Newsroom'].filter(Boolean).length > 1 ? 's' : ''}...` : saved ? 'SAVED!' : 'SAVE ALL'}
          </button>
        </div>
      </div>
    </div>
  );
}
