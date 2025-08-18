'use client'

import React, { useState } from 'react'
import { useProducts, useCategories, useBrands } from '@/hooks/useSanity'
import { hierarchicalQueries } from '@/lib/sanity-queries'
import { fetchHierarchy } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'
import type { CategoryHierarchy } from '@/types/sanity'

export default function HierarchicalProductDisplay() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedBrand, setSelectedBrand] = useState<string>('all')
    const [hierarchyData, setHierarchyData] = useState<CategoryHierarchy>([])
    const [loading, setLoading] = useState(false)

    // Fetch the complete hierarchy
    const fetchHierarchyData = async () => {
        setLoading(true)
        try {
            const data = await fetchHierarchy(hierarchicalQueries.getCategoryHierarchy)
            setHierarchyData(data)
        } catch (error) {
            console.error('Error fetching hierarchy:', error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on component mount
    React.useEffect(() => {
        fetchHierarchyData()
    }, [])

    // Get unique categories for filtering
    const categories = hierarchyData.map(cat => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug.current
    }))

    // Get brands for selected category
    const getBrandsForCategory = () => {
        if (selectedCategory === 'all') return []
        const category = hierarchyData.find(cat => cat._id === selectedCategory)
        return category?.brands || []
    }

    // Get products for selected category and brand
    const getProductsForSelection = () => {
        if (selectedCategory === 'all') {
            // Return all products from all categories
            return hierarchyData.flatMap(cat => 
                cat.brands?.flatMap(brand => brand.products || []) || []
            )
        }

        const category = hierarchyData.find(cat => cat._id === selectedCategory)
        if (!category) return []

        if (selectedBrand === 'all') {
            // Return all products from selected category
            return category.brands?.flatMap(brand => brand.products || []) || []
        }

        // Return products from selected brand in selected category
        const brand = category.brands?.find(b => b._id === selectedBrand)
        return brand?.products || []
    }

    const products = getProductsForSelection()
    const brands = getBrandsForCategory()

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Product Hierarchy: Categories → Brands → Products</h1>
            
            {/* Filters */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value)
                                setSelectedBrand('all') // Reset brand when category changes
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCategory !== 'all' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand._id} value={brand._id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    Showing {products.length} products
                    {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                    {selectedBrand !== 'all' && ` from ${brands.find(b => b._id === selectedBrand)?.name}`}
                </div>
            </div>

            {/* Hierarchy Display */}
            <div className="space-y-8">
                {hierarchyData.map(category => (
                    <div key={category._id} className="border rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            {category.image && (
                                <img
                                    src={getImageUrl(category.image, 60, 60)}
                                    alt={category.name}
                                    className="w-15 h-15 object-cover rounded"
                                />
                            )}
                            <div>
                                <h2 className="text-2xl font-semibold">{category.name}</h2>
                                <p className="text-gray-600">{category.description}</p>
                                <p className="text-sm text-gray-500">
                                    {category.brandCount || 0} brands • {category.productCount} products
                                </p>
                            </div>
                        </div>

                        {category.brands && category.brands.length > 0 && (
                            <div className="space-y-4">
                                {category.brands.map(brand => (
                                    <div key={brand._id} className="border-l-4 border-blue-200 pl-4 ml-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            {brand.logo && (
                                                <img
                                                    src={getImageUrl(brand.logo, 40, 40)}
                                                    alt={brand.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <h3 className="text-lg font-medium">{brand.name}</h3>
                                                <p className="text-sm text-gray-600">{brand.description}</p>
                                                <p className="text-xs text-gray-500">
                                                    {brand.productCount} products
                                                </p>
                                            </div>
                                        </div>

                                        {brand.products && brand.products.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
                                                {brand.products.map(product => (
                                                    <div key={product._id} className="border rounded-lg p-3 bg-gray-50">
                                                        {product.coverImage && (
                                                            <img
                                                                src={getImageUrl(product.coverImage, 200, 200)}
                                                                alt={product.name}
                                                                className="w-full h-32 object-cover rounded mb-2"
                                                            />
                                                        )}
                                                        <h4 className="font-medium text-sm">{product.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            ${product.price} {product.currency}
                                                        </p>
                                                        <div className="flex gap-1 mt-1">
                                                            {product.featured && (
                                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                                    Featured
                                                                </span>
                                                            )}
                                                            {product.inStock ? (
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                    In Stock
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
} 