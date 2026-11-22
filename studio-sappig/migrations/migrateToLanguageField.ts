import {migrateToLanguageField} from 'sanity-plugin-internationalized-array/migrations'

/* v4 -> v5: moves the language id from `_key` to a dedicated `language` field. */
export default migrateToLanguageField(['menuCategory', 'openingHours', 'siteSettings', 'popup', 'homePage'])
