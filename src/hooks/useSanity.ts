import { useState, useEffect } from 'react'
import { client } from '../lib/sanity'
import { productQueries, categoryQueries, brandQueries } from '../lib/sanity-queries'
import type { 
  SanityProduct, 
  SanityCategory, 
  SanityBrand, 
  ProductList, 
  CategoryList, 
  BrandList 
} from '../types/sanity'

// Hook for fetching products
export function useProducts(query: string, params?: any) {
  const [products, setProducts] = useState<ProductList>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(query, params)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, JSON.stringify(params)])

  return { products, loading, error }
}

// Hook for fetching categories
export function useCategories(query: string, params?: any) {
  const [categories, setCategories] = useState<CategoryList>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(query, params)
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, JSON.stringify(params)])

  return { categories, loading, error }
}

// Hook for fetching brands
export function useBrands(query: string, params?: any) {
  const [brands, setBrands] = useState<BrandList>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(query, params)
        setBrands(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brands')
        console.error('Error fetching brands:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, JSON.stringify(params)])

  return { brands, loading, error }
}

// Hook for fetching a single product by slug
export function useProduct(slug: string) {
  const [product, setProduct] = useState<SanityProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(productQueries.getBySlug, { slug })
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}

// Hook for fetching a single category by slug
export function useCategory(slug: string) {
  const [category, setCategory] = useState<SanityCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function fetchCategory() {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(categoryQueries.getBySlug, { slug })
        setCategory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category')
        console.error('Error fetching category:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [slug])

  return { category, loading, error }
}

// Hook for fetching a single brand by slug
export function useBrand(slug: string) {
  const [brand, setBrand] = useState<SanityBrand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function fetchBrand() {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(brandQueries.getBySlug, { slug })
        setBrand(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brand')
        console.error('Error fetching brand:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBrand()
  }, [slug])

  return { brand, loading, error }
}

// Hook for searching products
export function useProductSearch(searchTerm: string) {
  const [products, setProducts] = useState<ProductList>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setProducts([])
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(productQueries.search, { searchTerm })
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search products')
        console.error('Error searching products:', err)
      } finally {
        setLoading(false)
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  return { products, loading, error }
} 