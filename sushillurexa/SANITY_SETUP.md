# Sanity Client Setup Guide

This guide explains how to set up and use the Sanity client in your Next.js project.

## 🚀 Quick Start

### 1. Environment Variables

Copy the `env.example` file to `.env.local` and fill in your Sanity project details:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your-actual-api-token
```

### 2. Get Your Sanity Project Details

1. Go to [sanity.io](https://sanity.io) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy your **Project ID** and **Dataset**
5. Create a new **API Token** if you need write access

## 📁 File Structure

```
dryfruits/
├── lib/
│   ├── sanity.ts          # Sanity client configuration
│   └── sanity-queries.ts  # GROQ queries and helper functions
├── types/
│   └── sanity.ts          # TypeScript type definitions
├── hooks/
│   └── useSanity.ts       # React hooks for data fetching
└── env.example            # Environment variables template
```

## 🔧 Usage Examples

### Basic Product Fetching

```tsx
import { useProducts } from '../hooks/useSanity'
import { productQueries } from '../lib/sanity-queries'

function ProductList() {
  const { products, loading, error } = useProducts(productQueries.getAll)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Fetching Featured Products

```tsx
import { useProducts } from '../hooks/useSanity'
import { productQueries } from '../lib/sanity-queries'

function FeaturedProducts() {
  const { products, loading, error } = useProducts(productQueries.getFeatured)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Featured Products</h2>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Single Product Page

```tsx
import { useProduct } from '../hooks/useSanity'
import { getImageUrl } from '../lib/sanity'

function ProductPage({ slug }: { slug: string }) {
  const { product, loading, error } = useProduct(slug)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>

  return (
    <div>
      <h1>{product.name}</h1>
      <img 
        src={getImageUrl(product.coverImage, 600, 400)} 
        alt={product.name} 
      />
      <p>{product.description}</p>
      <p>${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Brand: {product.brand}</p>
    </div>
  )
}
```

### Product Search

```tsx
import { useState } from 'react'
import { useProductSearch } from '../hooks/useSanity'

function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const { products, loading, error } = useProductSearch(searchTerm)

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      
      <div>
        {products.map(product => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🖼️ Image Handling

The setup includes utilities for handling Sanity images:

```tsx
import { getImageUrl, getResponsiveImageUrls } from '../lib/sanity'

// Get image with specific dimensions
const imageUrl = getImageUrl(product.coverImage, 600, 400)

// Get responsive image URLs
const responsiveUrls = getResponsiveImageUrls(product.coverImage, [300, 600, 900])

// Use in Next.js Image component
import Image from 'next/image'

<Image
  src={getImageUrl(product.coverImage, 600, 400)}
  alt={product.name}
  width={600}
  height={400}
/>
```

## 🔍 Available Queries

### Product Queries
- `productQueries.getAll` - All products
- `productQueries.getFeatured` - Featured products only
- `productQueries.getBySlug` - Single product by slug
- `productQueries.getByCategory` - Products by category
- `productQueries.getByBrand` - Products by brand
- `productQueries.search` - Search products

### Category Queries
- `categoryQueries.getAll` - All categories
- `categoryQueries.getBySlug` - Single category by slug

### Brand Queries
- `brandQueries.getAll` - All brands
- `brandQueries.getBySlug` - Single brand by slug

## 🎣 Available Hooks

- `useProducts(query, params)` - Fetch products with custom query
- `useCategories(query, params)` - Fetch categories with custom query
- `useBrands(query, params)` - Fetch brands with custom query
- `useProduct(slug)` - Fetch single product
- `useCategory(slug)` - Fetch single category
- `useBrand(slug)` - Fetch single brand
- `useProductSearch(searchTerm)` - Search products with debouncing

## 🚨 Error Handling

All hooks include built-in error handling:

```tsx
const { products, loading, error } = useProducts(productQueries.getAll)

if (error) {
  console.error('Error:', error)
  return <div>Something went wrong. Please try again later.</div>
}
```

## 🔒 Security Notes

- `SANITY_API_TOKEN` is only needed for write operations
- The token should be kept secret and not committed to version control
- Public queries (read-only) don't require authentication
- Use environment variables for all sensitive configuration

## 📚 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Image URLs](https://www.sanity.io/docs/image-url)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 Troubleshooting

### Common Issues

1. **"Project not found" error**
   - Check your `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
   - Ensure the project ID is correct and the project exists

2. **"Dataset not found" error**
   - Verify your `NEXT_PUBLIC_SANITY_DATASET` value
   - Default dataset is usually "production"

3. **Images not loading**
   - Check that your Sanity project has CORS configured
   - Ensure image assets are properly uploaded to Sanity

4. **TypeScript errors**
   - Make sure all imports are correct
   - Check that the types match your actual Sanity schema

### Getting Help

- Check the [Sanity Discord](https://discord.gg/sanity-io)
- Review [Sanity GitHub issues](https://github.com/sanity-io/sanity/issues)
- Check the [Next.js documentation](https://nextjs.org/docs) 