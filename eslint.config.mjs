import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({ ignores: ['design/**', 'dist/**', '.wrangler/**'] }, prettier)
