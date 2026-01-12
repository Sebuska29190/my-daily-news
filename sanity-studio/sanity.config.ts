import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schema'

export default defineConfig({
  name: 'my-daily-news',
  title: 'My Daily News CMS',
  projectId: process.env.SANITY_PROJECT_ID || '9gym6q5m',
  dataset: process.env.SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})