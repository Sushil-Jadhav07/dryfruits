# Hierarchical Structure: Categories → Brands → Products

## Overview

The Sanity schema has been updated to create a proper hierarchical relationship between categories, brands, and products. This structure allows for better organization and easier navigation through your product catalog.

## Schema Structure

### 1. **Category Schema** (`category.js`)
```javascript
{
  name: 'category',
  fields: [
    'name',           // Category name (e.g., "Electronics", "Clothing")
    'slug',           // URL-friendly identifier
    'description',    // Category description
    'image',          // Category representative image
    'brands',         // Array of brands in this category
    'parentCategory', // For subcategories
    'featured',       // Mark as featured
    'sortOrder'       // Custom ordering
  ]
}
```

### 2. **Brand Schema** (`brand.js`)
```javascript
{
  name: 'brand',
  fields: [
    'name',           // Brand name (e.g., "Apple", "Nike")
    'slug',           // URL-friendly identifier
    'description',    // Brand description
    'category',       // Reference to parent category
    'logo',           // Brand logo image
    'website',        // Brand website URL
    'featured',       // Mark as featured
    'country',        // Country of origin
    'products',       // Array of products by this brand
    'sortOrder'       // Custom ordering within category
  ]
}
```

### 3. **Product Schema** (`product.js`)
```javascript
{
  name: 'product',
  fields: [
    'name',           // Product name
    'slug',           // URL-friendly identifier
    'description',    // Product description
    'coverImage',     // Main product image
    'images',         // Additional product images
    'category',       // Reference to parent category
    'brand',          // Reference to parent brand
    'price',          // Product price
    'currency',       // Price currency
    'inStock',        // Stock availability
    'featured',       // Mark as featured
    'tags',           // Product tags
    'publishedAt',    // Publication date
    'sortOrder'       // Custom ordering within brand
  ]
}
```

## Data Flow

```
Categories
    ↓
  Brands (belonging to each category)
    ↓
  Products (belonging to each brand)
```

## Frontend Implementation

### 1. **Hierarchical Queries**

The new query structure supports fetching data in the hierarchical format:

```typescript
// Get complete hierarchy
const hierarchy = await fetchHierarchy(hierarchicalQueries.getCategoryHierarchy)

// Get products by category and brand
const products = await fetchProducts(productQueries.getByCategoryAndBrand, {
  categorySlug: 'electronics',
  brandSlug: 'apple'
})
```

### 2. **Component Usage**

#### Basic Product Display
```tsx
import { useProducts } from '@/hooks/useSanity'
import { productQueries } from '@/lib/sanity-queries'

function ProductList() {
  const { products, loading, error } = useProducts(productQueries.getAll)
  // ... render products
}
```

#### Hierarchical Display
```tsx
import HierarchicalProductDisplay from '@/components/HierarchicalProductDisplay'

function CategoryPage() {
  return <HierarchicalProductDisplay />
}
```

### 3. **Filtering and Navigation**

The hierarchical structure enables:

- **Category-based filtering**: Show all products in a specific category
- **Brand-based filtering**: Show all products from a specific brand
- **Combined filtering**: Show products from a specific brand within a specific category
- **Hierarchical navigation**: Navigate from category → brand → product

## Sanity Studio Setup

### 1. **Create Categories First**
1. Go to Sanity Studio
2. Create categories (e.g., "Electronics", "Clothing", "Home & Garden")
3. Add category images and descriptions
4. Set sort order for display priority

### 2. **Create Brands Within Categories**
1. Create brands (e.g., "Apple", "Samsung", "Nike")
2. **Important**: Assign each brand to a category
3. Add brand logos and descriptions
4. Set sort order within the category

### 3. **Create Products Within Brands**
1. Create products
2. **Important**: Assign each product to both a category and brand
3. Add product images, descriptions, and pricing
4. Set sort order within the brand

## Example Data Structure

```javascript
// Category: Electronics
{
  _id: "electronics-category",
  name: "Electronics",
  slug: { current: "electronics" },
  brands: [
    {
      _id: "apple-brand",
      name: "Apple",
      category: "electronics-category",
      products: [
        {
          _id: "iphone-product",
          name: "iPhone 15",
          category: "electronics-category",
          brand: "apple-brand",
          price: 999
        }
      ]
    }
  ]
}
```

## Frontend Components

### 1. **WhatNewOne Component**
- Updated to work with the new hierarchical structure
- Fetches products with category and brand information
- Supports filtering by category

### 2. **HierarchicalProductDisplay Component**
- New component showcasing the complete hierarchy
- Interactive filtering by category and brand
- Visual representation of the data flow

### 3. **SanityDebug Component**
- Enhanced to show hierarchical relationships
- Displays category, brand, and product counts
- Helps debug data structure issues

## Benefits of the New Structure

### 1. **Better Organization**
- Clear separation of concerns
- Logical grouping of related items
- Easier content management

### 2. **Improved Navigation**
- Users can browse by category first
- Then filter by brand within categories
- Finally view specific products

### 3. **Enhanced Filtering**
- Multiple filter levels
- Better search capabilities
- Improved user experience

### 4. **Scalability**
- Easy to add new categories
- Simple to manage brand relationships
- Flexible product organization

## Migration Guide

### 1. **Existing Data**
If you have existing products without proper category/brand relationships:

1. Create categories first
2. Create brands and assign them to categories
3. Update existing products to reference proper categories and brands
4. Use the migration script if needed

### 2. **Content Strategy**
- Plan your category structure
- Organize brands logically within categories
- Ensure consistent naming conventions
- Set appropriate sort orders

### 3. **Testing**
- Test the hierarchical queries
- Verify data relationships
- Check frontend filtering
- Validate image loading

## Troubleshooting

### Common Issues

1. **Missing References**
   - Ensure products reference both category and brand
   - Check that brands reference categories
   - Verify all required fields are populated

2. **Circular References**
   - Categories should not reference themselves
   - Brands should only reference one category
   - Products should reference one category and one brand

3. **Data Loading Issues**
   - Check environment variables
   - Verify Sanity project access
   - Test queries in Sanity Vision

### Debug Steps

1. Use the `SanityDebug` component to inspect data
2. Check browser console for query errors
3. Verify data structure in Sanity Studio
4. Test individual queries in Sanity Vision

## Future Enhancements

### 1. **Subcategories**
- Support for nested category structures
- Multi-level navigation
- Enhanced filtering options

### 2. **Brand Collections**
- Group brands by themes
- Seasonal brand collections
- Featured brand showcases

### 3. **Advanced Filtering**
- Price range filtering
- Availability filtering
- Tag-based filtering
- Search within categories/brands

## Conclusion

The new hierarchical structure provides a solid foundation for organizing your product catalog. It enables better user experience, improved content management, and scalable growth. Follow the setup guide and test thoroughly to ensure smooth operation. 