import 'dotenv/config';
import { createClient } from '@sanity/client'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
import 'dotenv/config'

// Sanity client configuration
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2025-01-11',
})

// Paths to JSON files
const newsPath = path.join(__dirname, '../public/news.json')
const categoriesPath = path.join(__dirname, '../public/categories.json')

// Read and parse JSON files
const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'))
const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))

// Map to store category ID to Sanity document ID
const categoryIdToRef = {}

// Helper to download image and upload to Sanity
async function uploadImageFromUrl(url, filename) {
  if (!url) return null
  console.log(`Downloading image from ${url}`)
  try {
    const response = await axios({
      url,
      responseType: 'stream',
      headers: { 'User-Agent': 'axios' },
    })
    const asset = await client.assets.upload('image', response.data, {
      filename: filename || path.basename(url),
    })
    console.log(`Uploaded image: ${asset._id}`)
    return asset._id
  } catch (error) {
    console.error(`Failed to upload image from ${url}:`, error.message)
    return null
  }
}

// Migrate categories
async function migrateCategories() {
  console.log('Migrating categories...')
  for (const category of categoriesData) {
    const doc = {
      _type: 'category',
      title: category.name,
      categoryId: category.id,
    }
    try {
      const existing = await client.fetch(
        '*[_type == "category" && categoryId == $id][0]',
        { id: category.id }
      )
      if (existing) {
        console.log(`Category ${category.id} already exists, skipping`)
        categoryIdToRef[category.id] = existing._id
        continue
      }
      const created = await client.create(doc)
      console.log(`Created category ${created._id}`)
      categoryIdToRef[category.id] = created._id
    } catch (error) {
      console.error(`Error creating category ${category.id}:`, error.message)
    }
  }
}

// Migrate articles
async function migrateArticles() {
  console.log('Migrating articles...')
  for (const article of newsData) {
    console.log(`Processing article: ${article.title}`)
    // Upload thumbnail and main image
    const thumbnailAssetId = await uploadImageFromUrl(
      article.thumbnail_url,
      `thumbnail-${article.id}.jpg`
    )
    const imageAssetId = await uploadImageFromUrl(
      article.image_url,
      `image-${article.id}.jpg`
    )

    // Prepare author object
    const author = article.author
      ? {
          name: article.author.name,
          published_date: article.author.published_date,
          img: article.author.img,
        }
      : {}

    // Prepare rating object
    const rating = article.rating
      ? {
          number: article.rating.number,
          badge: article.rating.badge,
        }
      : {}

    // Prepare others flags
    const others = article.others
      ? {
          is_today_pick: article.others.is_today_pick || false,
          is_trending: article.others.is_trending || false,
        }
      : {}

    // Build the document
    const doc = {
      _type: 'article',
      title: article.title,
      slug: {
        _type: 'slug',
        current: article.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      },
      category: {
        _type: 'reference',
        _ref: categoryIdToRef[article.category_id],
      },
      rating,
      total_view: article.total_view,
      author,
      details: article.details,
      tags: article.tags || [],
      others,
      production: article.production !== false,
    }

    // Add image references if uploaded
    if (thumbnailAssetId) {
      doc.thumbnail = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: thumbnailAssetId,
        },
      }
    }
    if (imageAssetId) {
      doc.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      }
    }

    // Check if article already exists (by original ID)
    try {
      const existing = await client.fetch(
        '*[_type == "article" && _id == $id][0]',
        { id: article.id }
      )
      if (existing) {
        console.log(`Article ${article.id} already exists, skipping`)
        continue
      }
      // Create with custom _id to preserve original ID
      const created = await client.create({
        ...doc,
        _id: article.id,
      })
      console.log(`Created article ${created._id}`)
    } catch (error) {
      console.error(`Error creating article ${article.id}:`, error.message)
    }
  }
}

// Main migration function
async function migrate() {
  try {
    await migrateCategories()
    await migrateArticles()
    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()