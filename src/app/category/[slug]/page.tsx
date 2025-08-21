'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCategory, useBrands, useProducts } from '@/hooks'
import { getImageUrl } from '../../../../lib/sanity'
import type { Category, Brand, Product } from '../../../../types/sanity'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'

const CategoryPage = () => {
    const router = useRouter()
    const params = useParams()
    const categorySlug = params.slug as string
    
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [showProducts, setShowProducts] = useState(false)

    // Fetch category by slug
    const { data: category, loading: categoryLoading, error: categoryError } = useCategory(categorySlug)
    
    // Fetch all brands
    const { data: allBrands, loading: brandsLoading, error: brandsError } = useBrands()
    
    // Fetch all products for filtering
    const { data: products, loading: productsLoading, error: productsError } = useProducts()

    // Filter products based on selected category and brand
    const getFilteredProducts = () => {
        if (!products || !category) return []
        
        let filtered = products.filter(product => 
            product.category && product.category._id === category._id
        )
        
        if (selectedBrand) {
            filtered = filtered.filter(product => 
                product.brand && product.brand._id === selectedBrand._id
            )
        }
        
        return filtered
    }

    const handleBrandClick = (brand: Brand) => {
        setSelectedBrand(brand)
        setShowProducts(true)
    }

    const handleBackToBrands = () => {
        setSelectedBrand(null)
        setShowProducts(false)
    }

    const handleBackToCategories = () => {
        router.push('/')
    }

    const filteredProducts = getFilteredProducts()

    if (categoryLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading category...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (categoryError || !category) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-8">
                        <p className="text-red-600 text-lg">Category not found or error loading category.</p>
                        <button 
                            onClick={handleBackToCategories}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Back to Categories
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <div id="header" className='relative w-full'>
                <MenuTwo />
            </div>
            
            <div className="min-h-full bg-gray-50">
                {/* Page Header */}
              

            <div className="container mx-auto px-4 py-8">
                {/* Navigation Breadcrumb */}
                

                {/* Category Image */}
                

                {/* Brands View */}
                {!showProducts && (
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold mb-2">All Brands</h2>
                          
                        </div>
                        
                        {brandsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading brands...</p>
                            </div>
                        ) : brandsError ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">Error loading brands: {brandsError}</p>
                            </div>
                        ) : allBrands && allBrands.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {allBrands.map((brand) => (
                                    <div
                                        key={brand._id}
                                        onClick={() => handleBrandClick(brand)}
                                        className="bg-white rounded-lg  p-4 cursor-pointer transition-all duration-200  hover:scale-105"
                                    >
                                        <div className="flex flex-col items-center">
                                            {brand.logo && brand.logo.asset && brand.logo.asset._ref ? (
                                                <img
                                                    src={getImageUrl(brand.logo, 900, 900)}
                                                    alt={brand.name}
                                                    className="w-[300px] object-contain mb-2"
                                                    onError={(e) => {
                                                        console.warn('Failed to load brand logo:', brand.logo)
                                                        e.currentTarget.style.display = 'none'
                                                        e.currentTarget.nextElementSibling?.nextElementSibling?.classList.remove('hidden')
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2 ${brand.logo && brand.logo.asset && brand.logo.asset._ref ? 'hidden' : ''}`}>
                                                <span className="text-gray-500 text-xs">No Logo</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 text-center">{brand.name}</p>
                                           
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">No brands available.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Products View */}
                {showProducts && selectedBrand && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-center flex-1">
                                <h2 className="text-2xl font-semibold mb-2">
                                    Products in {category.name} - {selectedBrand.name}
                                </h2>
                                <p className="text-gray-600">{filteredProducts.length} products found</p>
                            </div>
                            <button
                                onClick={handleBackToBrands}
                                className="bg-[#000] text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                ← Back to Brands
                            </button>
                        </div>
                        
                        {productsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No products found with the selected filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <Link href={`/product/${product.slug.current}`} >
                                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="aspect-w-16 aspect-h-9">
                                            {product.coverImage && product.coverImage.asset && product.coverImage.asset._ref ? (
                                                <img
                                                    src={getImageUrl(product.coverImage, 400, 400)}
                                                    alt={product.name}
                                                    className="w-full h-64 object-cover"
                                                    onError={(e) => {
                                                        console.warn('Failed to load product image:', product.coverImage)
                                                        e.currentTarget.style.display = 'none'
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-64 bg-gray-200 flex items-center justify-center ${product.coverImage && product.coverImage.asset && product.coverImage.asset._ref ? 'hidden' : ''}`}>
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                          
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                                           
                                          
                                        </div>
                                    </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </>
    )
}

export default CategoryPage
