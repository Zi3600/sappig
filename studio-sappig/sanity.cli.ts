import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2560h915',
    dataset: 'production',
  },
  /* The site is plain HTML served from GitHub Pages, so there is no
     framework build to hook into here. */
  deployment: {autoUpdates: true},
})
