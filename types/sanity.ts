// Sanity Image type
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Sanity Slug type
export interface SanitySlug {
  _type: 'slug'
  current: string
}

// Product type
export interface SanityProduct {
  _id: string
  _type: 'product'
  name: string
  slug: SanitySlug
  description: string
  coverImage: SanityImage
  images: SanityImage[]
  price: number
  currency: string
  inStock: boolean
  featured: boolean
  tags: string[]
  publishedAt: string
  categories: string[] // Array of category names (resolved from references)
  categorySlugs: string[] // Array of category slugs (resolved from references)
  brand: string // Brand name (resolved from reference)
  brandSlug: string // Brand slug (resolved from reference)
}

// Category type
export interface SanityCategory {
  _id: string
  _type: 'category'
  name: string
  slug: SanitySlug
  description?: string
  productCount: number
}

// Brand type
export interface SanityBrand {
  _id: string
  _type: 'brand'
  name: string
  slug: SanitySlug
  description?: string
  logo?: SanityImage
  productCount: number
}

// Blog post type (if you have blog functionality)
export interface SanityBlogPost {
  _id: string
  _type: 'post'
  title: string
  slug: SanitySlug
  excerpt: string
  content: any[] // Portable Text
  coverImage: SanityImage
  author: {
    name: string
    avatar?: SanityImage
  }
  publishedAt: string
  tags: string[]
}

// Common query result types
export type ProductList = SanityProduct[]
export type CategoryList = SanityCategory[]
export type BrandList = SanityBrand[]
export type BlogPostList = SanityBlogPost[]

// Query parameters
export interface ProductQueryParams {
  slug?: string
  categorySlug?: string
  brandSlug?: string
  searchTerm?: string
}

export interface CategoryQueryParams {
  slug?: string
}

export interface BrandQueryParams {
  slug?: string
} 