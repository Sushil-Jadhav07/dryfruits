# Sanity CMS Setup for Dryfruits Frontend

This document outlines the complete Sanity CMS integration setup for the dryfruits frontend application.

## 🚀 What's Been Set Up

### 1. Core Sanity Client (`lib/sanity.ts`)
- **Environment-based configuration** - Uses environment variables with fallbacks
- **Smart CDN usage** - Automatically uses CDN in production
- **Image optimization utilities** - Multiple image handling functions
- **Error handling** - Graceful fallbacks for missing images

### 2. Query Functions (`lib/sanity-queries.ts`)
- **Product queries** - Get all products, by slug, by category
- **Category & Brand queries** - Complete category and brand management
- **Blog queries** - Blog post management
- **Search functionality** - Product search with multiple criteria
- **Featured products** - Special queries for featured and sale items

### 3. TypeScript Types (`types/sanity.ts`)
- **Complete type definitions** for all Sanity document types
- **Image and asset types** with proper typing
- **SEO and metadata types** for better content management
- **Response type aliases** for cleaner code

### 4. React Hooks (`hooks/useSanity.ts`)
- **Custom hooks** for all major data fetching operations
- **Loading and error states** built-in
- **Optimized queries** with proper dependencies
- **Generic query hook** for custom queries

### 5. Image Components (`components/SanityImage.tsx`)
- **Optimized image rendering** with WebP support
- **Responsive images** with multiple breakpoints
- **Background image support** for hero sections
- **Fallback handling** for missing images

## 📋 Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Optional (for write operations)
SANITY_API_TOKEN=your-api-token

# Optional (for studio links)
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
```

## 🎯 How to Use

### Basic Product Fetching

```tsx
import { useProducts, useProduct } from '../hooks/useSanity'

// Fetch all products
function ProductList() {
  const { data: products, loading, error } = useProducts()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {products?.map(product => (
        <div key={product._id}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}

// Fetch single product
function ProductDetail({ slug }: { slug: string }) {
  const { data: product, loading, error } = useProduct(slug)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>{product?.title}</h1>
      <p>{product?.description}</p>
    </div>
  )
}
```

### Using Sanity Images

```tsx
import SanityImage from '../components/SanityImage'

function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <SanityImage
        image={product.image}
        alt={product.title}
        width={400}
        height={400}
        quality={85}
        format="webp"
        className="rounded-lg"
      />
      <h3>{product.title}</h3>
    </div>
  )
}

// Responsive images
function HeroSection({ image }: { image: SanityImage }) {
  return (
    <ResponsiveSanityImage
      image={image}
      breakpoints={[400, 800, 1200, 1600]}
      alt="Hero image"
      className="w-full h-96"
    />
  )
}

// Background images
function HeroBackground({ image }: { image: SanityImage }) {
  return (
    <BackgroundSanityImage
      image={image}
      className="min-h-screen flex items-center justify-center"
    >
      <h1 className="text-white text-6xl">Welcome</h1>
    </BackgroundSanityImage>
  )
}
```

### Custom Queries

```tsx
import { useSanityQuery } from '../hooks/useSanity'

function CustomProductList() {
  const query = `
    *[_type == "product" && price < 100] | order(price asc) {
      _id,
      title,
      price,
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "_type": image.asset._type
        },
        "alt": image.alt
      }
    }
  `
  
  const { data: products, loading, error } = useSanityQuery(query)
  
  // ... rest of component
}
```

### Direct Client Usage

```tsx
import { client } from '../lib/sanity'

// For server-side operations or complex queries
export async function getServerSideProps() {
  const products = await client.fetch(`
    *[_type == "product" && featured == true][0...6] {
      _id,
      title,
      price,
      image
    }
  `)
  
  return {
    props: { products }
  }
}
```

## 🔧 Available Hooks

| Hook | Description | Returns |
|------|-------------|---------|
| `useProducts()` | All products | `ProductsResponse` |
| `useProduct(slug)` | Single product by slug | `Product` |
| `useCategories()` | All categories | `CategoriesResponse` |
| `useCategory(slug)` | Single category by slug | `Category` |
| `useBrands()` | All brands | `BrandsResponse` |
| `useBlogPosts()` | All blog posts | `BlogPostsResponse` |
| `useBlogPost(slug)` | Single blog post by slug | `BlogPost` |
| `useFeaturedProducts(limit)` | Featured products | `ProductsResponse` |
| `useProductsOnSale(limit)` | Products on sale | `ProductsResponse` |
| `useProductSearch(term)` | Search products | `ProductsResponse` |

## 🖼️ Image Utilities

| Function | Description |
|----------|-------------|
| `urlFor(source)` | Basic image URL builder |
| `getImageUrl(source, width, height)` | Image with dimensions |
| `getOptimizedImageUrl(source, width, height, quality, format)` | Optimized image |
| `getResponsiveImageUrls(source, breakpoints)` | Multiple sizes for responsive images |

## 📱 Image Components

| Component | Use Case |
|-----------|----------|
| `SanityImage` | Standard product/category images |
| `ResponsiveSanityImage` | Responsive images with multiple breakpoints |
| `BackgroundSanityImage` | Hero sections and backgrounds |

## 🚨 Error Handling

All hooks include built-in error handling:

```tsx
const { data, loading, error } = useProducts()

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!data) return <NoDataMessage />

// Safe to use data here
return <ProductList products={data} />
```

## 🔍 Debugging

Export the `sanityConfig` from `lib/sanity.ts` to debug configuration:

```tsx
import { sanityConfig } from '../lib/sanity'

console.log('Sanity Config:', sanityConfig)
// Outputs: { projectId, dataset, apiVersion, useCdn, hasToken }
```

## 📚 Next Steps

1. **Set up your Sanity Studio** with the schema types matching the TypeScript interfaces
2. **Create content** in your Sanity Studio
3. **Test the queries** using the provided hooks
4. **Customize the queries** based on your specific content structure
5. **Add more image optimization** as needed for your use case

## 🆘 Troubleshooting

### Common Issues

1. **Images not loading**: Check if the image asset reference exists in Sanity
2. **Type errors**: Ensure your Sanity schema matches the TypeScript interfaces
3. **Query errors**: Verify GROQ syntax and field references
4. **Environment variables**: Make sure `.env.local` is properly configured

### Getting Help

- Check Sanity documentation: https://www.sanity.io/docs
- Review GROQ query syntax: https://www.sanity.io/docs/groq
- Check the Sanity Studio for content structure

---

This setup provides a solid foundation for building a content-driven e-commerce frontend with Sanity CMS. All components are optimized for performance and include proper error handling.
