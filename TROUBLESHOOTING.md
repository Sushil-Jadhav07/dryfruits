# Troubleshooting Guide - Sanity Integration

## 🚨 "Invalid prop" Error Resolution

### Common Causes and Solutions

#### 1. **Missing Environment Variables**
**Error**: Component fails to load or shows "Cannot find module" errors
**Solution**: 
```bash
# Create .env.local file in dryfruits directory
cp env.example .env.local

# Edit .env.local with your actual values
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your-actual-api-token
```

#### 2. **Sanity Project Not Found**
**Error**: "Project not found" or network errors
**Solution**:
- Verify your project ID in Sanity Studio
- Check that the project is accessible
- Ensure you're using the correct dataset name

#### 3. **Missing Required Fields in Sanity Schema**
**Error**: "Invalid prop" or undefined field errors
**Solution**: Ensure your Sanity schema includes all required fields:

```javascript
// Required fields for products
{
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'coverImage', type: 'image' },
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    { name: 'price', type: 'number' },
    { name: 'category', type: 'string' }, // This is crucial for filtering
    { name: 'brand', type: 'string' },
    { name: 'inStock', type: 'boolean' },
    { name: 'publishedAt', type: 'datetime' }
  ]
}
```

#### 4. **Data Type Mismatches**
**Error**: TypeScript errors or runtime prop validation failures
**Solution**: Check data types in your Sanity content:

- **Price**: Must be a number, not a string
- **Category**: Must be a string for filtering to work
- **Images**: Must be proper image references
- **Boolean fields**: Must be true/false, not "true"/"false"

#### 5. **Image Loading Issues**
**Error**: Images not displaying or broken image links
**Solution**:
- Verify CORS settings in your Sanity project
- Check that images are properly uploaded
- Ensure image fields are populated in content

### 🔍 Debugging Steps

#### Step 1: Check Environment Variables
Visit `/test-sanity` page and check the "Environment Check" section:
- All environment variables should be set (not "Not set")
- Project ID should match your Sanity project

#### Step 2: Verify Data Loading
In the debug section, check:
- Products count > 0
- Categories count > 0
- No error messages

#### Step 3: Check Console Logs
Open browser console and look for:
- "Sanity products loaded:" logs
- "Filtered products for category" logs
- Any error messages or warnings

#### Step 4: Validate Data Structure
Check that products have:
- `_id` field
- `name` field
- `category` field (for filtering)
- `price` field (number)
- `coverImage` or `images` field

### 🛠️ Quick Fixes

#### Fix 1: Reset Component State
```tsx
// Add this to WhatNewOne component for debugging
useEffect(() => {
    console.log('Current products:', allProducts);
    console.log('Current filtered products:', filteredProducts);
    console.log('Active tab:', activeTab);
}, [allProducts, filteredProducts, activeTab]);
```

#### Fix 2: Add Fallback Values
```tsx
// Ensure all required fields have fallbacks
const convertSanityToProductType = (sanityProduct: SanityProduct): ProductType => {
    return {
        id: sanityProduct._id || `fallback-${Date.now()}`,
        category: sanityProduct.category || 'Uncategorized',
        name: sanityProduct.name || 'Untitled Product',
        price: sanityProduct.price || 0,
        // ... other fields with fallbacks
    };
};
```

#### Fix 3: Validate Before Rendering
```tsx
// Only render products with valid data
{filteredProducts
    .filter(product => product && product._id && product.name)
    .slice(start, limit)
    .map((prd, index) => {
        const convertedProduct = convertSanityToProductType(prd);
        return convertedProduct ? (
            <Product 
                data={convertedProduct} 
                type='grid' 
                key={prd._id} 
                style='style-1' 
            />
        ) : null;
    })
}
```

### 📋 Checklist for Resolution

- [ ] Environment variables are set correctly
- [ ] Sanity project exists and is accessible
- [ ] Products have required fields (name, category, price)
- [ ] Categories are properly populated
- [ ] Images are uploaded and accessible
- [ ] No TypeScript compilation errors
- [ ] Console shows successful data loading
- [ ] Debug component shows valid data

### 🆘 Still Having Issues?

1. **Check Sanity Studio**: Verify content exists and fields are populated
2. **Test API directly**: Use Sanity Vision or API explorer
3. **Check Network tab**: Look for failed API requests
4. **Verify CORS**: Ensure your domain is allowed in Sanity settings
5. **Check Sanity logs**: Look for any backend errors

### 📞 Getting Help

- Check the [Sanity Discord](https://discord.gg/sanity-io)
- Review [Sanity documentation](https://www.sanity.io/docs)
- Check browser console for specific error messages
- Use the debug component to identify data issues

### 🔄 Common Workarounds

#### If Categories Aren't Working
```tsx
// Force default category if none exists
const getCategoryTabs = () => {
    const uniqueCategories = Array.from(
        new Set(allProducts.map(product => product.category).filter(Boolean))
    );
    
    // Always include default categories if none exist
    if (uniqueCategories.length === 0) {
        return ['all', 'Uncategorized', 'General'];
    }
    
    return ['all', ...uniqueCategories];
};
```

#### If Images Aren't Loading
```tsx
// Use fallback images
const getImageUrl = (image: any, width: number, height: number) => {
    try {
        return image ? getImageUrl(image, width, height) : '/images/product/1000x1000.png';
    } catch (error) {
        console.warn('Image processing error:', error);
        return '/images/product/1000x1000.png';
    }
};
``` 