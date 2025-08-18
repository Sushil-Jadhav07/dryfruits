'use client'

import { useProducts, useCategories, useBrands } from '../hooks/useSanity'
import { productQueries, categoryQueries, brandQueries } from '../lib/sanity-queries'
import { getImageUrl } from '../lib/sanity'

export default function SanityExample() {
  // Fetch featured products
  const { products, loading: productsLoading, error: productsError } = useProducts(productQueries.getFeatured)
  
  // Fetch all categories
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(categoryQueries.getAll)
  
  // Fetch all brands
  const { brands, loading: brandsLoading, error: brandsError } = useBrands(brandQueries.getAll)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sanity CMS Integration Example</h1>
      
      {/* Featured Products Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        {productsLoading && <div className="text-gray-600">Loading products...</div>}
        {productsError && <div className="text-red-600">Error: {productsError}</div>}
        {!productsLoading && !productsError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-sm">
                {product.coverImage && (
                  <img
                    src={getImageUrl(product.coverImage, 300, 200)}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">${product.price}</span>
                  <span className="text-sm text-gray-500">{product.currency}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="mr-3">Categories: {product.categories && product.categories.length > 0 ? product.categories.join(', ') : 'Uncategorized'}</span>
                  <span>Brand: {product.brand}</span>
                </div>
                <div className="mt-2">
                  {product.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700 mr-2 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        {categoriesLoading && <div className="text-gray-600">Loading categories...</div>}
        {categoriesError && <div className="text-red-600">Error: {categoriesError}</div>}
        {!categoriesLoading && !categoriesError && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category._id} className="border rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.productCount} products</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Brands Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Brands</h2>
        {brandsLoading && <div className="text-gray-600">Loading brands...</div>}
        {brandsError && <div className="text-red-600">Error: {brandsError}</div>}
        {!brandsLoading && !brandsError && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <div key={brand._id} className="border rounded-lg p-4 text-center">
                {brand.logo && (
                  <img
                    src={getImageUrl(brand.logo, 80, 80)}
                    alt={brand.name}
                    className="w-20 h-20 object-contain mx-auto mb-3"
                  />
                )}
                <h3 className="font-semibold mb-2">{brand.name}</h3>
                <p className="text-sm text-gray-600">{brand.productCount} products</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Setup Instructions */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">Setup Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Copy <code className="bg-blue-100 px-1 rounded">env.example</code> to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
          <li>Fill in your Sanity project details in <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
          <li>Make sure your Sanity schema matches the types in <code className="bg-blue-100 px-1 rounded">types/sanity.ts</code></li>
          <li>Start your development server with <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
        </ol>
        <p className="mt-3 text-sm text-blue-600">
          Check <code className="bg-blue-100 px-1 rounded">SANITY_SETUP.md</code> for detailed setup instructions.
        </p>
      </section>
    </div>
  )
} 