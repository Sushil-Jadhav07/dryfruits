import { client } from './sanity'

// Product queries
export const productQueries = {
  // Get all products
  getAll: `*[_type == "product"] | order(publishedAt desc) {
    _id,
    name,
    slug,
    description,
    coverImage,
    images,
    price,
    currency,
    inStock,
    featured,
    tags,
    publishedAt,
    "category": category->name,
    "brand": brand->name
  }`,

  // Get featured products
  getFeatured: `*[_type == "product" && featured == true] | order(publishedAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    "category": category->name,
    "brand": brand->name
  }`,

  // Get product by slug
  getBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    coverImage,
    images,
    price,
    currency,
    inStock,
    featured,
    tags,
    publishedAt,
    "category": category->name,
    "brand": brand->name
  }`,

  // Get products by category
  getByCategory: `*[_type == "product" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "category": category->name,
    "brand": brand->name
  }`,

  // Get products by brand
  getByBrand: `*[_type == "product" && brand->slug.current == $brandSlug] | order(publishedAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "category": category->name,
    "brand": brand->name
  }`,

  // Search products
  search: `*[_type == "product" && (
    name match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    tags[] match $searchTerm + "*"
  )] | order(publishedAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "category": category->name,
    "brand": brand->name
  }`
}

// Category queries
export const categoryQueries = {
  // Get all categories
  getAll: `*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get category by slug
  getBySlug: `*[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
}

// Brand queries
export const brandQueries = {
  // Get all brands
  getAll: `*[_type == "brand"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    logo,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get brand by slug
  getBySlug: `*[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    logo,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
}

// Helper functions to execute queries
export async function fetchProducts(query: string, params?: any) {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function fetchCategories(query: string, params?: any) {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function fetchBrands(query: string, params?: any) {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
} 