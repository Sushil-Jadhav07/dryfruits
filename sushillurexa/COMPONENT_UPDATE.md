# WhatNewOne Component Update - Sanity Integration

## Overview

The `WhatNewOne` component has been updated to fetch products directly from Sanity CMS instead of receiving static data as props. This enables dynamic content management through the Sanity headless CMS.

## Changes Made

### 1. Component Props Update
- **Removed**: `data: Array<ProductType>` prop
- **Kept**: `start: number` and `limit: number` props for pagination

### 2. Data Fetching
- Added Sanity client integration using custom hooks
- Fetches products and categories from Sanity CMS
- Implements loading states and error handling

### 3. Dynamic Category Tabs
- Category tabs are now generated dynamically from Sanity data
- Added "All" tab to show all products
- Categories are extracted from actual product data

### 4. Data Transformation
- Added `convertSanityToProductType` function to convert Sanity data to existing `ProductType` interface
- Maintains compatibility with existing Product component
- Handles image URLs using Sanity image utilities

## Files Modified

### Primary Component
- `src/components/Home1/WhatNewOne.tsx` - Main component with Sanity integration

### Parent Components Updated
- `src/app/page.tsx` - Removed `data` prop
- `src/app/homepages/fashion2/page.tsx` - Removed `data` prop

### New Files Created
- `src/lib/sanity.ts` - Sanity client configuration
- `src/lib/sanity-queries.ts` - GROQ queries for data fetching
- `src/types/sanity.ts` - TypeScript types for Sanity data
- `src/hooks/useSanity.ts` - React hooks for data fetching
- `src/app/test-sanity/page.tsx` - Test page for verification

## Usage

### Before (Old Usage)
```tsx
import productData from '@/data/Product.json'

<WhatNewOne data={productData} start={0} limit={8} />
```

### After (New Usage)
```tsx
<WhatNewOne start={0} limit={8} />
```

## Features

### ✅ Dynamic Data Fetching
- Products are fetched from Sanity CMS in real-time
- No need to rebuild the application when content changes
- Supports live content updates

### ✅ Category-Based Filtering
- Products are automatically categorized based on Sanity data
- Dynamic tab generation based on available categories
- "All" tab shows all products

### ✅ Loading States
- Skeleton loading UI while data is being fetched
- Smooth user experience during data loading

### ✅ Error Handling
- Graceful error handling for failed API calls
- User-friendly error messages

### ✅ Image Optimization
- Sanity image URLs with responsive sizing
- Optimized image loading for better performance

## Setup Requirements

### 1. Environment Variables
Create `.env.local` file with your Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your-api-token
```

### 2. Sanity Schema
Ensure your Sanity schema includes:
- `product` document type with fields: name, slug, description, coverImage, images, price, currency, inStock, featured, tags, publishedAt, category, brand
- `category` document type with fields: name, slug, description
- `brand` document type with fields: name, slug, description, logo

### 3. Data Structure
The component expects products to have:
- `category` field (string) for filtering
- `brand` field (string) for display
- `images` array for product galleries
- `coverImage` for main product image

## Testing

### Test Page
Visit `/test-sanity` to test the Sanity integration:
- Shows the WhatNewOne component with real Sanity data
- Demonstrates loading states and error handling
- Useful for debugging and verification

### Verification Steps
1. Ensure environment variables are set correctly
2. Check that Sanity project has products with categories
3. Verify that images are loading properly
4. Test category filtering functionality

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Ensure all Sanity files are in the correct `src/` directories
   - Check import paths in the component

2. **No products loading**
   - Verify Sanity project ID and dataset
   - Check that products exist in your Sanity studio
   - Ensure products have the required fields

3. **Images not displaying**
   - Verify Sanity CORS settings
   - Check that image assets are properly uploaded
   - Ensure image fields are populated in Sanity

4. **Categories not showing**
   - Check that products have `category` field populated
   - Verify category data structure in Sanity

### Debug Mode
Add console logs to debug data flow:
```tsx
useEffect(() => {
    console.log('Products loaded:', products);
    console.log('Categories loaded:', categories);
}, [products, categories]);
```

## Performance Considerations

- Products are fetched once and cached in component state
- Image URLs are generated on-demand
- Pagination is handled client-side for better UX
- Loading states prevent layout shifts

## Future Enhancements

- Add server-side rendering for better SEO
- Implement caching strategies
- Add search functionality
- Support for more complex filtering options
- Real-time updates using Sanity webhooks 