import { useState, useEffect } from 'react'
import {client} from '@/lib/sanity'
import type { 
  Product, 
  Category, 
  Brand, 
  BlogPost,
  ProductsResponse,
  CategoriesResponse,
  CategoriesWithBrandsResponse,
  BrandsResponse,
  BlogPostsResponse
} from '../../types/sanity'

// Generic hook for any Sanity query
export function useSanityQuery<T>(
  query: string,
  params?: Record<string, any>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const result = await client.fetch(query, params)
        
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error }
}

// Specific hooks for common queries
export function useProducts() {
  const query = `
    *[_type == "product"] {
      _id,
      _type,
      name,
      slug,
      price,
      comparePrice,
      description,
      "coverImage": {
        "asset": {
          "_ref": coverImage.asset._ref,
          "_type": coverImage.asset._type
        },
        "alt": coverImage.alt,
        "caption": coverImage.caption
      },
      category->{
        _id,
        name,
        slug
      },
      brand->{
        _id,
        name,
        slug
      },
      inStock,
      featured
    }
  `
  
  return useSanityQuery<ProductsResponse>(query)
}

export function useProduct(slug: string) {
  const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _type,
      name,
      slug,
      price,
      comparePrice,
      description,
      longDescription,
      "coverImage": {
        "asset": {
          "_ref": coverImage.asset._ref,
          "_type": coverImage.asset._type
        },
        "alt": coverImage.alt,
        "caption": coverImage.caption
      },
      "productImages": productImages[]{
        _key,
        "asset": {
          "_ref": asset._ref,
          "_type": asset._type
        },
        "alt": alt,
        "caption": caption
      },
      category->{
        _id,
        name,
        slug
      },
      brand->{
        _id,
        name,
        slug
      },
      variants[]{
        _key,
        title,
        price,
        "image": {
          "asset": {
            "_ref": image.asset._ref,
            "_type": image.asset._type
          },
          "alt": image.alt,
          "caption": image.caption
        }
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
      }
    }
  `
  
  return useSanityQuery<Product>(query, { slug }, [slug])
}

export function useCategories() {
  const query = `
    *[_type == "category"] {
      _id,
      name,
      slug,
      description,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
      },
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `
  
  return useSanityQuery<CategoriesResponse>(query)
}

// New hook for categories with their brands
export function useCategoriesWithBrands() {
  const query = `
    *[_type == "category"] {
      _id,
      name,
      slug,
      description,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
      },
      "brands": *[_type == "brand" && references(^._id)] {
        _id,
        name,
        slug,
        description,
        "logo": {
          "asset": {
            "_ref": logo.asset._ref,
            "_type": logo.asset._type
          },
          "alt": logo.alt,
          "caption": logo.caption
        },
        "productCount": count(*[_type == "product" && references(^._id)])
      },
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `
  
  return useSanityQuery<CategoriesWithBrandsResponse>(query)
}

export function useCategory(slug: string) {
  const query = `
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
      }
    }
  `
  
  return useSanityQuery<Category>(query, { slug }, [slug])
}

export function useBrands() {
  const query = `
    *[_type == "brand"] {
      _id,
      name,
      slug,
      description,
      "logo": {
        "asset": {
          "_ref": logo.asset._ref,
          "_type": logo.asset._type
        },
        "alt": logo.alt,
        "caption": logo.caption
      },
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  `
  
  return useSanityQuery<BrandsResponse>(query)
}

export function useBlogPosts() {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      author->{
        name,
        "image": {
          "asset": {
            "_ref": image.asset._ref,
            "_type": image.asset._type
          },
          "alt": image.alt,
          "caption": image.caption
        }
      },
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
      },
      category->{
        title,
        slug
      }
    }
  `
  
  return useSanityQuery<BlogPostsResponse>(query)
}

export function useBlogPost(slug: string) {
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
        "image": {
          "asset": {
            "_ref": image.asset._ref,
            "_type": image.asset._type
          },
          "alt": image.alt,
          "caption": image.caption
        }
      },
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
      },
      category->{
        title,
        slug
      },
      tags
    }
  `
  
  return useSanityQuery<BlogPost>(query, { slug }, [slug])
}

export function useFeaturedProducts(limit: number = 8) {
  const query = `
    *[_type == "product" && featured == true] | order(_createdAt desc)[0...$limit] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
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
      inStock
    }
  `
  
  return useSanityQuery<ProductsResponse>(query, { limit }, [limit])
}

export function useProductsOnSale(limit: number = 8) {
  const query = `
    *[_type == "product" && defined(comparePrice) && comparePrice > price] | order(price asc)[0...$limit] {
      _id,
      _type,
      title,
      slug,
      price,
      comparePrice,
      description,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
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
      inStock
    }
  `
  
  return useSanityQuery<ProductsResponse>(query, { limit }, [limit])
}

// Hook for search functionality
export function useProductSearch(searchTerm: string) {
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
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt,
        "caption": image.caption
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
      inStock,
      featured
    }
  `
  
  return useSanityQuery<ProductsResponse>(
    query, 
    { searchTerm }, 
    [searchTerm]
  )
}
