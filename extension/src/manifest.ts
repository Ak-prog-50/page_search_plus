import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  name: 'Page Search Plus',
  description: 'Enhanced in-page search functionality',
  version: '0.0.1',
  manifest_version: 3,
  permissions: ['activeTab', 'scripting'],
  icons: {
    '16': 'img/favicon.ico',
    '32': 'img/logo-32.png',
    '48': 'img/logo-48.png',
    '128': 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/favicon.ico', 'img/logo-32.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
});
