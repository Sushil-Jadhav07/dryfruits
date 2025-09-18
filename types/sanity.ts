// Sanity Asset Types
export interface SanityAsset {
  _ref: string
  _type: string
}

export interface SanityImage {
  asset: SanityAsset
  alt?: string
  caption?: string
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

// Sanity Slug Type
export interface SanitySlug {
  _type: 'slug'
  current: string
}

// SEO Type
export interface SEO {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: SanityImage
}

// Category Type
export interface Category {
  _id: string
  _type: 'category'
  name: string
  slug: SanitySlug
  description?: string
  image?: SanityImage
  productCount?: number
  brands?: Brand[]
}

// Brand Type
export interface Brand {
  _id: string
  _type: 'brand'
  name: string
  slug: SanitySlug
  description?: string
  logo?: SanityImage
  productCount?: number
}

// Product Variant Type
export interface ProductVariant {
  _key: string
  title: string
  price: number
  image?: SanityImage
  sku?: string
  inStock?: boolean
}

// Product Type
export interface Product {
  _id: string
  _type: 'product'
  name: string
  slug: SanitySlug
  price: number
  comparePrice?: number
  description?: string
  longDescription?: any
  richDescription?: any
  coverImage?: SanityImage
  productImages?: Array<{
    _key: string
    asset: SanityAsset
    alt?: string
    caption?: string
  }>
  category?: Category
  brand?: Brand
  variants?: ProductVariant[]
  tags?: string[]
  inStock?: boolean
  featured?: boolean
  specifications?: Record<string, any>
  reviews?: Array<{
    _key: string
    rating: number
    comment?: string
    author?: string
    date?: string
  }>
  seo?: SEO
  _createdAt?: string
  _updatedAt?: string
}

// Author Type
export interface Author {
  _id: string
  _type: 'author'
  name: string
  bio?: string
  image?: SanityImage
}

// Blog Post Type
export interface BlogPost {
  _id: string
  _type: 'post'
  title: string
  slug: SanitySlug
  excerpt?: string
  body?: any // Portable Text
  publishedAt: string
  author?: Author
  image?: SanityImage
  category?: {
    title: string
    slug: SanitySlug
  }
  tags?: string[]
  seo?: SEO
}

// Extended Category type with brands for the shop by category feature
export interface CategoryWithBrands extends Category {
  brands: Brand[]
}

// Sanity Query Response Types
export type ProductsResponse = Product[]
export type CategoriesResponse = Category[]
export type CategoriesWithBrandsResponse = CategoryWithBrands[]
export type BrandsResponse = Brand[]
export type BlogPostsResponse = BlogPost[]

// Utility Types
export type SanityDocument = Product | Category | Brand | BlogPost | Author

export interface SanityQueryParams {
  [key: string]: any
}

// Image URL Builder Types
export interface ImageUrlBuilder {
  image(source: any): ImageUrlBuilder
  width(width: number): ImageUrlBuilder
  height(height: number): ImageUrlBuilder
  quality(quality: number): ImageUrlBuilder
  format(format: 'webp' | 'jpg' | 'png'): ImageUrlBuilder
  url(): string
}

// Sanity Client Configuration
export interface SanityConfig {
  projectId: string
  dataset: string
  apiVersion: string
  useCdn: boolean
  hasToken: boolean
}

// Slider Types
export interface SliderDocument {
  _id: string
  _type: 'slider'
  image: SanityImage
}

export type SlidersResponse = SliderDocument[]
