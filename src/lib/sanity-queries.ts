import { client } from './sanity'

// Product queries
export const productQueries = {
  // Get all products
  getAll: `*[_type == "product" && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
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
    sortOrder,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`,

  // Get featured products
  getFeatured: `*[_type == "product" && featured == true && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`,

  // Get product by slug
  getBySlug: `*[_type == "product" && slug.current == $slug && (isActive == true || !defined(isActive))][0] {
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
    sortOrder,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`,

  // Get products by category
  getByCategory: `*[_type == "product" && $categorySlug in categories[]->slug.current && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`,

  // Get products by brand
  getByBrand: `*[_type == "product" && brand->slug.current == $brandSlug && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`,

  // Get products by category and brand
  getByCategoryAndBrand: `*[_type == "product" && $categorySlug in categories[]->slug.current && brand->slug.current == $brandSlug && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`,

  // Search products
  search: `*[_type == "product" && (
    name match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    tags[] match $searchTerm + "*"
  ) && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
    _id,
    name,
    slug,
    coverImage,
    price,
    currency,
    inStock,
    "categories": categories[]->name,
    "categorySlugs": categories[]->slug.current,
    "brand": brand->name,
    "brandSlug": brand->slug.current
  }`
}

// Category queries
export const categoryQueries = {
  // Get all categories with brands
  getAll: `*[_type == "category" && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    description,
    image,
    mainImage,
    featured,
    sortOrder,
    "brands": brands[]->{
      _id,
      name,
      slug,
      logo,
      featured,
      sortOrder,
      "productCount": count(*[_type == "product" && references(^._id)])
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get category by slug with brands and products
  getBySlug: `*[_type == "category" && slug.current == $slug && (isActive == true || !defined(isActive))][0] {
    _id,
    name,
    slug,
    description,
    image,
    mainImage,
    featured,
    sortOrder,
    "brands": brands[]->{
      _id,
      name,
      slug,
      logo,
      description,
      featured,
      sortOrder,
      "products": *[_type == "product" && references(^._id)] | order(sortOrder asc, publishedAt desc) {
        _id,
        name,
        slug,
        coverImage,
        price,
        currency,
        inStock,
        featured
      },
      "productCount": count(*[_type == "product" && references(^._id)])
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get featured categories
  getFeatured: `*[_type == "category" && featured == true && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    description,
    image,
    mainImage,
    "brandCount": count(brands),
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
}

// Brand queries
export const brandQueries = {
  // Get all brands with categories and products
  getAll: `*[_type == "brand" && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    description,
    logo,
    website,
    featured,
    country,
    sortOrder,
    "categories": categories[]->{
      _id,
      name,
      slug,
      image
    },
    "products": *[_type == "product" && references(^._id)] | order(sortOrder asc, publishedAt desc) {
      _id,
      name,
      slug,
      coverImage,
      price,
      currency,
      inStock,
      featured
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get brand by slug
  getBySlug: `*[_type == "brand" && slug.current == $slug && (isActive == true || !defined(isActive))][0] {
    _id,
    name,
    slug,
    description,
    logo,
    website,
    featured,
    country,
    sortOrder,
    "categories": categories[]->{
      _id,
      name,
      slug,
      image
    },
    "products": *[_type == "product" && references(^._id) && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
      _id,
      name,
      slug,
      coverImage,
      price,
      currency,
      inStock,
      featured,
      "categories": categories[]->name,
      "brand": ^.name
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get brands by category
  getByCategory: `*[_type == "brand" && $categorySlug in categories[]->slug.current && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    description,
    logo,
    featured,
    sortOrder,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get featured brands
  getFeatured: `*[_type == "brand" && featured == true && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    description,
    logo,
    featured,
    "categories": categories[]->{
      _id,
      name,
      slug
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
}

// Hierarchical queries for the complete flow
export const hierarchicalQueries = {
  // Get complete category hierarchy: Category → Brands → Products
  getCategoryHierarchy: `*[_type == "category" && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    description,
    image,
    featured,
    sortOrder,
    "brands": brands[]->{
      _id,
      name,
      slug,
      logo,
      description,
      featured,
      sortOrder,
          "products": *[_type == "product" && references(^._id) && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
      _id,
      name,
      slug,
      coverImage,
      price,
      currency,
      inStock,
      featured,
      tags
    },
      "productCount": count(*[_type == "product" && references(^._id)])
    },
    "brandCount": count(brands),
    "productCount": count(*[_type == "product" && references(^._id)])
  }`,

  // Get products organized by category and brand
  getProductsByHierarchy: `*[_type == "category" && (isActive == true || !defined(isActive))] | order(sortOrder asc, name asc, _createdAt desc) {
    _id,
    name,
    slug,
    image,
    "brands": brands[]->{
      _id,
      name,
      slug,
      logo,
      "products": *[_type == "product" && references(^._id) && (isActive == true || !defined(isActive))] | order(sortOrder asc, publishedAt desc, _createdAt desc) {
        _id,
        name,
        slug,
        coverImage,
        price,
        currency,
        inStock,
        featured
      }
    }
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

export async function fetchHierarchy(query: string, params?: any) {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Error fetching hierarchy:', error)
    return []
  }
} 