import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2560h915',
    dataset: 'production',
  },
  /* The site is plain HTML served from GitHub Pages, so there is no
     framework build to hook into here. */
  studioHost: 'sappig',
  deployment: {autoUpdates: true, appId: 'qcdniydf1wo9iw368l0oglmp'},
})
