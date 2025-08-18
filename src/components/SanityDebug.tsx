'use client'

import React, { useState, useEffect } from 'react'
import { useProducts, useCategories } from '@/hooks/useSanity'
import { productQueries, categoryQueries } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'

export default function SanityDebug() {
    const { products, loading: productsLoading, error: productsError } = useProducts(productQueries.getAll);
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(categoryQueries.getAll);

    // Add a simple test query to see if Sanity is working
    const [testData, setTestData] = useState<any>(null);
    const [testLoading, setTestLoading] = useState(false);
    const [testError, setTestError] = useState<string | null>(null);

    useEffect(() => {
        async function testSanityConnection() {
            setTestLoading(true);
            try {
                // Simple query to test if Sanity is working
                const { client } = await import('../lib/sanity');
                const result = await client.fetch('*[_type == "product"] | order(_createdAt desc)[0..5]');
                console.log('Simple Sanity test query result:', result);
                setTestData(result);
            } catch (err) {
                console.error('Sanity connection test failed:', err);
                setTestError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setTestLoading(false);
            }
        }

        testSanityConnection();
    }, []);

    if (productsLoading || categoriesLoading || testLoading) {
        return <div className="p-4">Loading Sanity data...</div>;
    }

    if (productsError || categoriesError) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <h3 className="font-bold">Error Loading Data:</h3>
                {productsError && <p>Products Error: {productsError}</p>}
                {categoriesError && <p>Categories Error: {categoriesError}</p>}
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Sanity Data Debug</h2>
            
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Products ({products?.length || 0}):</h3>
                {products && products.length > 0 ? (
                    <div className="space-y-2">
                        {products.slice(0, 3).map((product, index) => {
                            // Generate image URLs for debugging
                            const coverImageUrl = product.coverImage ? getImageUrl(product.coverImage, 300, 400) : 'No cover image';
                            const firstImageUrl = product.images && product.images.length > 0 ? getImageUrl(product.images[0], 300, 400) : 'No images';
                            
                            return (
                                <div key={product._id} className="bg-white p-3 rounded border">
                                    <p><strong>ID:</strong> {product._id}</p>
                                    <p><strong>Name:</strong> {product.name}</p>
                                    <p><strong>Categories:</strong> {product.categories && product.categories.length > 0 ? product.categories.join(', ') : 'No categories'}</p>
                                    <p><strong>Brand:</strong> {product.brand || 'No brand'}</p>
                                    <p><strong>Price:</strong> {product.price || 'No price'}</p>
                                    <p><strong>Has Cover Image:</strong> {product.coverImage ? 'Yes' : 'No'}</p>
                                    <p><strong>Cover Image URL:</strong> {coverImageUrl}</p>
                                    <p><strong>Images Count:</strong> {product.images?.length || 0}</p>
                                    <p><strong>First Image URL:</strong> {firstImageUrl}</p>
                                    <p><strong>Description:</strong> {product.description ? 'Yes' : 'No'}</p>
                                    
                                    {/* Show actual image if available */}
                                    {product.coverImage && (
                                        <div className="mt-2">
                                            <p className="text-sm font-semibold">Cover Image Preview:</p>
                                            <img 
                                                src={coverImageUrl} 
                                                alt={product.name}
                                                className="w-32 h-32 object-cover rounded border"
                                                onError={(e) => {
                                                    console.error('Failed to load cover image:', coverImageUrl);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {products.length > 3 && (
                            <p className="text-sm text-gray-600">... and {products.length - 3} more products</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">No products found</p>
                )}
            </div>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">Categories ({categories?.length || 0}):</h3>
                {categories && categories.length > 0 ? (
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category._id} className="bg-white p-3 rounded border">
                                <p><strong>ID:</strong> {category._id}</p>
                                <p><strong>Name:</strong> {category.name}</p>
                                <p><strong>Slug:</strong> {category.slug?.current || 'No slug'}</p>
                                <p><strong>Product Count:</strong> {category.productCount}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No categories found</p>
                )}
            </div>

            <div className="bg-blue-100 border border-blue-400 text-blue-700 p-3 rounded">
                <h3 className="font-semibold">Environment Check:</h3>
                <p><strong>NEXT_PUBLIC_SANITY_PROJECT_ID:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Not set'}</p>
                <p><strong>NEXT_PUBLIC_SANITY_DATASET:</strong> {process.env.NEXT_PUBLIC_SANITY_DATASET || 'Not set'}</p>
                <p><strong>NEXT_PUBLIC_SANITY_API_VERSION:</strong> {process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'Not set'}</p>
            </div>

            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded mt-4">
                <h3 className="font-semibold">Image Configuration Check:</h3>
                <p><strong>Next.js Image Domains:</strong> cdn.sanity.io, cdn.sanity.images</p>
                <p><strong>Note:</strong> Make sure to restart your dev server after updating next.config.js</p>
            </div>

            {/* Simple Sanity Test Results */}
            <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mt-4">
                <h3 className="font-semibold">Simple Sanity Connection Test:</h3>
                {testError ? (
                    <p className="text-red-600"><strong>Error:</strong> {testError}</p>
                ) : testData ? (
                    <div>
                        <p><strong>Success!</strong> Sanity connection is working.</p>
                        <p><strong>Raw data returned:</strong> {JSON.stringify(testData, null, 2)}</p>
                        <p><strong>Data type:</strong> {Array.isArray(testData) ? 'Array' : typeof testData}</p>
                        {Array.isArray(testData) && (
                            <p><strong>Number of items:</strong> {testData.length}</p>
                        )}
                    </div>
                ) : (
                    <p>No test data available</p>
                )}
            </div>
        </div>
    );
} 