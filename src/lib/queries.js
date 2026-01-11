import { sanityClient } from './sanityClient'

// Helper to construct image URL from asset reference
const imageUrl = (asset) => {
  if (!asset) return ''
  return `${asset.url}?w=1200&h=630&fit=crop`
}

// GROQ projection that matches the original JSON structure
const articleProjection = `
  _id,
  title,
  "category_id": category->categoryId,
  rating,
  total_view,
  author,
  "thumbnail_url": thumbnail.asset->url,
  "image_url": image.asset->url,
  details,
  tags,
  others,
  production
`

// Fetch all articles (for category page)
export const fetchAllArticles = async () => {
  const query = `*[_type == "article"] { ${articleProjection} }`
  const articles = await sanityClient.fetch(query)
  // Transform to match exact JSON shape (ensure category_id is number)
  return articles.map(article => ({
    ...article,
    category_id: Number(article.category_id) || 0,
    id: article._id,
  }))
}

// Fetch article by ID (for news details)
export const fetchArticleById = async (id) => {
  const query = `*[_type == "article" && _id == $id][0] { ${articleProjection} }`
  const article = await sanityClient.fetch(query, { id })
  if (!article) return null
  return {
    ...article,
    category_id: Number(article.category_id) || 0,
    id: article._id,
  }
}

// Fetch categories (optional)
export const fetchCategories = async () => {
  const query = `*[_type == "category"] { _id, "id": categoryId, name }`
  const categories = await sanityClient.fetch(query)
  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
  }))
}

// Fetch today's pick articles (where others.is_today_pick == true)
export const fetchTodaysPicks = async () => {
  const query = `*[_type == "article" && others.is_today_pick == true] { ${articleProjection} }`
  const articles = await sanityClient.fetch(query)
  return articles.map(article => ({
    ...article,
    category_id: Number(article.category_id) || 0,
    id: article._id,
  }))
}

// Fetch articles by category ID
export const fetchArticlesByCategoryId = async (categoryId) => {
  const query = `*[_type == "article" && category->categoryId == $categoryId] { ${articleProjection} }`
  const articles = await sanityClient.fetch(query, { categoryId })
  return articles.map(article => ({
    ...article,
    category_id: Number(article.category_id) || 0,
    id: article._id,
  }))
}