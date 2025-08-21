import { client } from './sanity'

// Common GROQ query fragments
export const imageFragment = `
  "image": {
    "asset": {
      "_ref": image.asset._ref,
      "_type": image.asset._type
    },
    "alt": image.alt,
    "caption": image.caption
  }
`

export const seoFragment = `
  "seo": {
    "title": seo.title,
    "description": seo.description,
    "keywords": seo.keywords,
    "ogImage": seo.ogImage
  }
`

// Product queries
export async function getAllProducts() {
  const query = `
    *[_type == "product"] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      ${imageFragment},
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      variants[]{
        _key,
        title,
        price,
        ${imageFragment}
      },
      tags,
      inStock,
      featured,
      ${seoFragment}
    }
  `
  return await client.fetch(query)
}

export async function getProductBySlug(slug: string) {
  const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      longDescription,
      ${imageFragment},
      images[]{
        _key,
        ${imageFragment}
      },
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      variants[]{
        _key,
        title,
        price,
        ${imageFragment}
      },
      tags,
      inStock,
      featured,
      specifications,
      reviews[]{
        _key,
        rating,
        comment,
        author,
        date
      },
      ${seoFragment}
    }
  `
  return await client.fetch(query, { slug })
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `
    *[_type == "product" && category->slug.current == $categorySlug] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      ${imageFragment},
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      inStock,
      featured
    }
  `
  return await client.fetch(query, { categorySlug })
}

// Category queries
export async function getAllCategories() {
  const query = `
    *[_type == "category"] {
      _id,
      title,
      slug,
      description,
      ${imageFragment},
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `
  return await client.fetch(query)
}

export async function getCategoryBySlug(slug: string) {
  const query = `
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      ${imageFragment},
      ${seoFragment}
    }
  `
  return await client.fetch(query, { slug })
}

// Brand queries
export async function getAllBrands() {
  const query = `
    *[_type == "brand"] {
      _id,
      title,
      slug,
      description,
      ${imageFragment},
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `
  return await client.fetch(query)
}

// Blog queries
export async function getAllBlogPosts() {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      author->{
        name,
        ${imageFragment}
      },
      ${imageFragment},
      category->{
        title,
        slug
      },
      ${seoFragment}
    }
  `
  return await client.fetch(query)
}

export async function getBlogPostBySlug(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      publishedAt,
      author->{
        name,
        bio,
        ${imageFragment}
      },
      ${imageFragment},
      category->{
        title,
        slug
      },
      tags,
      ${seoFragment}
    }
  `
  return await client.fetch(query, { slug })
}

// Search functionality
export async function searchProducts(searchTerm: string) {
  const query = `
    *[_type == "product" && (
      title match $searchTerm + "*" ||
      description match $searchTerm + "*" ||
      tags[] match $searchTerm + "*"
    )] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      ${imageFragment},
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      inStock,
      featured
    }
  `
  return await client.fetch(query, { searchTerm })
}

// Featured and special queries
export async function getFeaturedProducts(limit: number = 8) {
  const query = `
    *[_type == "product" && featured == true] | order(_createdAt desc)[0...$limit] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      ${imageFragment},
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      inStock
    }
  `
  return await client.fetch(query, { limit })
}

export async function getProductsOnSale(limit: number = 8) {
  const query = `
    *[_type == "product" && defined(comparePrice) && comparePrice > price] | order(price asc)[0...$limit] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      ${imageFragment},
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      inStock
    }
  `
  return await client.fetch(query, { limit })
}

// Utility function to get multiple products by IDs
export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return []
  
  const query = `
    *[_type == "product" && _id in $ids] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      ${imageFragment},
      category->{
        _id,
        title,
        slug
      },
      brand->{
        _id,
        title,
        slug
      },
      inStock
    }
  `
  return await client.fetch(query, { ids })
}
