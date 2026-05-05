/* ── localStorage helpers ──────────────────────── */

const PREFIX = 'bm_admin_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  getAuth() {
    return localStorage.getItem(PREFIX + 'auth') === 'true';
  },

  setAuth(val) {
    localStorage.setItem(PREFIX + 'auth', val ? 'true' : 'false');
  },

  /* Page content helpers */
  getPageContent(pageKey) {
    return storage.get(`page_${pageKey}`, null);
  },

  setPageContent(pageKey, data) {
    storage.set(`page_${pageKey}`, data);
  },

  /* Settings */
  getSettings() {
    return storage.get('settings', {
      siteName: 'Blackmont Capital',
      contactEmail: ' info@blackmontcap.com',
      location: 'Blackmont Capital Sdn Bhd B-09-03 , Jalan 19/1 3 Two Square, Petaling Jaya 46300 Selangor Malaysia',
      footerTagline: 'Institutional wealth and precious metals stewardship.',
      goldIntensity: 50,
      sidebarCollapsed: false,
      linkedinUrl: 'https://linkedin.com/company/blackmont-capital',
      twitterUrl: 'https://twitter.com/blackmont',
      instagramUrl: 'https://instagram.com/blackmontcapital',
      facebookUrl: 'https://facebook.com/blackmontcapital',
      youtubeUrl: 'https://youtube.com/blackmontcapital',
    });
  },

  setSettings(settings) {
    storage.set('settings', settings);
  },
};
