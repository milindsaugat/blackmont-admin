/* ── Page structure config: defines tabs & fields per page ── */

// Field types: 'text', 'textarea', 'array'
// Array items have their own fields

export const pageStructure = {
  home: {
    label: 'Home',
    tabs: [

      {
        key: 'about',
        label: 'About Preview',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'paragraphs', label: 'Paragraphs', type: 'array', fields: [{ key: 'value', label: 'Paragraph', type: 'textarea' }] },
          {
            key: 'highlights', label: 'Highlights', type: 'array',
            fields: [
              { key: 'title', label: 'Highlight Title', type: 'text' },
              { key: 'text', label: 'Highlight Text', type: 'textarea' },
            ],
          },
          {
            key: 'stats', label: 'Stats', type: 'array',
            fields: [
              { key: 'value', label: 'Value', type: 'text' },
              { key: 'label', label: 'Label', type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'whyBlackmont',
        label: 'Why Blackmont',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
          {
            key: 'features', label: 'Features', type: 'array',
            fields: [
              { key: 'title', label: 'Feature Title', type: 'text' },
              { key: 'text', label: 'Feature Text', type: 'textarea' },
              { key: 'icon', label: 'Icon Name', type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'blog',
        label: 'Market Preview',
        fields: [
          { key: 'eyebrow', label: 'Section Eyebrow', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'featuredGraphTitle', label: 'Featured Graph Title', type: 'text' },
          { key: 'featuredGraphDescription', label: 'Featured Graph Description', type: 'textarea' },
          { key: 'themes', label: 'Themes', type: 'array', fields: [{ key: 'value', label: 'Theme', type: 'text' }] },
        ],
      },
      {
        key: 'contactCta',
        label: 'Contact CTA',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'primaryButton', label: 'Primary Button', type: 'text' },
          { key: 'secondaryButton', label: 'Secondary Button', type: 'text' },
        ],
      },
      {
        key: 'insightsPreview',
        label: 'Insights Preview',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'description', label: 'Section Description', type: 'textarea' },
        ],
      },
    ],
  },

  services: {
    label: 'Services',
    tabs: [

      {
        key: 'cards', label: 'Service Cards',
        fields: [
          {
            key: 'items', label: 'Services', type: 'array',
            fields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'detail', label: 'Detail', type: 'text' },
              { key: 'tag', label: 'Tag', type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'cta', label: 'CTA Section',
        fields: [
          { key: 'title', label: 'CTA Title', type: 'text' },
          { key: 'description', label: 'CTA Description', type: 'textarea' },
          { key: 'buttonText', label: 'Button Text', type: 'text' },
        ],
      },
    ],
  },

  insights: {
    label: 'Insights',
    tabs: [

      {
        key: 'featured', label: 'Featured Insight',
        fields: [
          { key: 'title', label: 'Featured Title', type: 'text' },
          { key: 'description', label: 'Featured Description', type: 'textarea' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
        ],
      },
      {
        key: 'grid', label: 'Insights Grid',
        fields: [
          {
            key: 'items', label: 'Insight Articles', type: 'array',
            fields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'category', label: 'Category', type: 'text' },
              { key: 'date', label: 'Date', type: 'text' },
            ],
          },
        ],
      },
    ],
  },




  newsroom: {
    label: 'Newsroom',
    tabs: [

      {
        key: 'featured', label: 'Featured News',
        fields: [
          { key: 'title', label: 'Featured Title', type: 'text' },
          { key: 'description', label: 'Featured Description', type: 'textarea' },
          { key: 'date', label: 'Date', type: 'text' },
        ],
      },
      {
        key: 'grid', label: 'News Grid',
        fields: [
          {
            key: 'items', label: 'News Articles', type: 'array',
            fields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'date', label: 'Date', type: 'text' },
              { key: 'category', label: 'Category', type: 'text' },
            ],
          },
        ],
      },
    ],
  },

  careers: {
    label: 'Careers',
    tabs: [

      {
        key: 'whyJoin', label: 'Why Join Us',
        fields: [
          { key: 'title', label: 'Section Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          {
            key: 'benefits', label: 'Benefits', type: 'array',
            fields: [
              { key: 'title', label: 'Benefit Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
          },
        ],
      },
      {
        key: 'positions', label: 'Open Positions',
        fields: [
          {
            key: 'items', label: 'Positions', type: 'array',
            fields: [
              { key: 'title', label: 'Job Title', type: 'text' },
              { key: 'department', label: 'Department', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'type', label: 'Type (Full-time/Part-time)', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  contact: {
    label: 'Contact',
    tabs: [

      {
        key: 'info', label: 'Contact Info',
        fields: [
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'address', label: 'Address', type: 'textarea' },
        ],
      },
      {
        key: 'formLabels', label: 'Form Labels',
        fields: [
          { key: 'nameLabel', label: 'Name Field Label', type: 'text' },
          { key: 'emailLabel', label: 'Email Field Label', type: 'text' },
          { key: 'companyLabel', label: 'Company Field Label', type: 'text' },
          { key: 'messageLabel', label: 'Message Field Label', type: 'text' },
          { key: 'submitButton', label: 'Submit Button Text', type: 'text' },
        ],
      },
      {
        key: 'offices', label: 'Office Locations',
        fields: [
          {
            key: 'items', label: 'Offices', type: 'array',
            fields: [
              { key: 'city', label: 'City', type: 'text' },
              { key: 'address', label: 'Address', type: 'textarea' },
              { key: 'phone', label: 'Phone', type: 'text' },
            ],
          },
        ],
      },
    ],
  },

  contactLocations: {
    label: 'Contact Locations',
    tabs: [

      {
        key: 'locations', label: 'Locations',
        fields: [
          {
            key: 'items', label: 'Office Locations', type: 'array',
            fields: [
              { key: 'city', label: 'City', type: 'text' },
              { key: 'country', label: 'Country', type: 'text' },
              { key: 'address', label: 'Address', type: 'textarea' },
              { key: 'phone', label: 'Phone', type: 'text' },
              { key: 'email', label: 'Email', type: 'text' },
            ],
          },
        ],
      },
    ],
  },

  faq: {
    label: 'FAQ',
    tabs: [

      {
        key: 'items', label: 'FAQ Items',
        fields: [
          {
            key: 'faqs', label: 'FAQ Items', type: 'array',
            fields: [
              { key: 'question', label: 'Question', type: 'text' },
              { key: 'answer', label: 'Answer', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  investorOverview: {
    label: 'IR Overview',
    tabs: [

      {
        key: 'metrics', label: 'Key Metrics',
        fields: [
          {
            key: 'items', label: 'Metrics', type: 'array',
            fields: [
              { key: 'value', label: 'Value', type: 'text' },
              { key: 'label', label: 'Label', type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'content', label: 'Overview Content',
        fields: [
          { key: 'title', label: 'Content Title', type: 'text' },
          { key: 'description', label: 'Content Description', type: 'textarea' },
        ],
      },
    ],
  },

  stockInformation: {
    label: 'Stock Information',
    tabs: [

      {
        key: 'details', label: 'Stock Details',
        fields: [
          { key: 'symbol', label: 'Stock Symbol', type: 'text' },
          { key: 'exchange', label: 'Exchange', type: 'text' },
          { key: 'price', label: 'Current Price', type: 'text' },
          { key: 'change', label: 'Change', type: 'text' },
        ],
      },
      {
        key: 'charts', label: 'Charts Labels',
        fields: [
          { key: 'chartTitle', label: 'Chart Title', type: 'text' },
          { key: 'periodLabels', label: 'Period Labels', type: 'array', fields: [{ key: 'value', label: 'Label', type: 'text' }] },
        ],
      },
    ],
  },

  eventsPresentations: {
    label: 'Events & Presentations',
    tabs: [

      {
        key: 'events', label: 'Events List',
        fields: [
          {
            key: 'items', label: 'Events', type: 'array',
            fields: [
              { key: 'date', label: 'Date', type: 'text' },
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'type', label: 'Type', type: 'text' },
            ],
          },
        ],
      },
    ],
  },

  reports: {
    label: 'Reports',
    tabs: [

      {
        key: 'reports', label: 'Reports List',
        fields: [
          {
            key: 'items', label: 'Reports', type: 'array',
            fields: [
              { key: 'year', label: 'Year', type: 'text' },
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'type', label: 'Type', type: 'text' },
              { key: 'link', label: 'Download Link', type: 'text' },
            ],
          },
        ],
      },
    ],
  },

  corporateGovernance: {
    label: 'Corporate Governance',
    tabs: [

      {
        key: 'framework', label: 'Governance Framework',
        fields: [
          { key: 'title', label: 'Framework Title', type: 'text' },
          { key: 'description', label: 'Framework Description', type: 'textarea' },
        ],
      },
      {
        key: 'board', label: 'Board Members',
        fields: [
          {
            key: 'members', label: 'Board Members', type: 'array',
            fields: [
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'title', label: 'Title/Position', type: 'text' },
              { key: 'bio', label: 'Bio', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  terms: {
    label: 'Terms & Conditions',
    tabs: [

      {
        key: 'sections', label: 'Content Sections',
        fields: [
          {
            key: 'items', label: 'Sections', type: 'array',
            fields: [
              { key: 'heading', label: 'Section Heading', type: 'text' },
              { key: 'body', label: 'Section Body', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  privacy: {
    label: 'Privacy Policy',
    tabs: [

      {
        key: 'sections', label: 'Content Sections',
        fields: [
          {
            key: 'items', label: 'Sections', type: 'array',
            fields: [
              { key: 'heading', label: 'Section Heading', type: 'text' },
              { key: 'body', label: 'Section Body', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },
};

/* Navigation structure for sidebar */
export const navStructure = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  {
    key: 'pages', label: 'Pages', icon: 'FileText',
    children: [
      { key: 'home', label: 'Home', path: '/home-editor' },
      { key: 'about', label: 'About Page', path: '/about-editor' },
      { key: 'services', label: 'Services', path: '/pages/services' },
      { key: 'insights', label: 'Insights', path: '/insights-editor' },
      { key: 'careers', label: 'Careers', path: '/careers-editor' },
      { key: 'contact', label: 'Contact', path: '/contact-editor' },
    ],
  },
  {
    key: 'ir', label: 'Investor Relations', icon: 'FileText',
    children: [
      { key: 'ir_overview', label: 'Overview', path: '/ir-editor' },
      { key: 'ir_reports', label: 'Reports', path: '/ir-editor?tab=reports' },
      { key: 'ir_stock', label: 'Stock Information', path: '/ir-editor?tab=stockInfo' },
      { key: 'ir_events', label: 'Event or Presentation', path: '/ir-editor?tab=events' },
      { key: 'ir_gov', label: 'Corporate Governance', path: '/ir-editor?tab=governance' },
    ],
  },
  {
    key: 'legal', label: 'Legal', icon: 'Pen',
    children: [
      { key: 'legal_faq', label: 'FAQ', path: '/legal?tab=faq' },
      { key: 'legal_terms', label: 'Terms & Conditions', path: '/legal?tab=terms' },
      { key: 'legal_privacy', label: 'Privacy Policy', path: '/legal?tab=privacy' },
    ],
  },
  { key: 'inquiries', label: 'Inquiries', icon: 'Mail', path: '/inquiries' },
  { key: 'clients', label: 'Client Logins', icon: 'Users', path: '/clients' },
  { key: 'settings', label: 'Dashboard Settings', icon: 'Settings', path: '/settings' },
  { key: 'apiSettings', label: 'API Integrations', icon: 'Link', path: '/api-settings' },
  { key: 'footerSettings', label: 'Footer Settings', icon: 'Settings', path: '/footer-settings' },
];
