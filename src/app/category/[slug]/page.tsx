'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCategory, useBrands, useProducts } from '@/hooks'
import { getImageUrl, getAvifImageUrl } from '../../../../lib/sanity'
import type { Category, Brand, Product } from '../../../../types/sanity'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css/bundle'

const CategoryPage = () => {
    const router = useRouter()
    const params = useParams()
    const categorySlug = params.slug as string
    
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

    // Fetch category by slug
    const { data: category, loading: categoryLoading, error: categoryError } = useCategory(categorySlug)
    
    // Fetch all brands
    const { data: allBrands, loading: brandsLoading, error: brandsError } = useBrands()
    
    // Fetch all products for filtering
    const { data: products, loading: productsLoading, error: productsError } = useProducts()

    // Filter brands that have products in the current category
    const getCategoryBrands = () => {
        if (!allBrands || !category) return []
        
        let categoryBrands: Brand[] = []
        
        // First, check if the category has brands directly associated with it
        if (category.brands && category.brands.length > 0) {
            categoryBrands = category.brands
        } else {
            // Fallback: Get brands that have products in this category
            if (products) {
                const categoryBrandIds = new Set(
                    products
                        .filter(product => 
                            product.category && product.category._id === category._id
                        )
                        .map(product => product.brand?._id)
                        .filter(Boolean)
                )
                
                categoryBrands = allBrands.filter(brand => categoryBrandIds.has(brand._id))
            }
        }
        
        return categoryBrands
    }

    // Do not auto-select a brand; show all until user clicks

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
    }

    const handleBackToCategories = () => {
        router.push('/')
    }

    const filteredProducts = getFilteredProducts()
    // Determine which brands to show (all or only selected)
    const brandsToShow = selectedBrand
        ? getCategoryBrands().filter(b => b._id === selectedBrand._id)
        : getCategoryBrands()

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
                

               
                

                {/* Brands Tabs */}
                <div className="mb-6 bg-white rounded-xl p-4 ">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Brands in {category.name}</h2>
                        {selectedBrand && (
                            <div className="mt-4">
                                <button
                                    onClick={() => setSelectedBrand(null)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                      <path fillRule="evenodd" d="M15.78 19.28a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06L9.31 11.25H20a.75.75 0 010 1.5H9.31l6.47 6.47a.75.75 0 010 1.06z" clipRule="evenodd" />
                                    </svg>
                                    Back to all brands
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {(brandsLoading || productsLoading) ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading brands...</p>
                        </div>
                    ) : (brandsError || productsError) ? (
                        <div className="text-center py-8">
                            <p className="text-red-600">Error loading data: {brandsError || productsError}</p>
                        </div>
                    ) : getCategoryBrands().length > 0 ? (
                        <div className={`${brandsToShow.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'} gap-6`}>
                            {brandsToShow.map((brand) => (
                                <div
                                    key={brand._id}
                                    onClick={() => handleBrandClick(brand)}
                                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 group p-4 rounded-lg ${
                                        selectedBrand?._id === brand._id 
                                            ? 'scale-110 bg-blue-50' 
                                            : 'hover:scale-105 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 mb-4 transition-all duration-300 ${
                                        selectedBrand?._id === brand._id 
                                            ? 'border-blue-500 shadow-lg shadow-blue-200 ring-4 ring-blue-100' 
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                    }`}>
                                        {brand.logo && brand.logo.asset && brand.logo.asset._ref ? (
                                            <picture>
                                                <source
                                                    srcSet={getAvifImageUrl(brand.logo, 192, 192, 85)}
                                                    type="image/avif"
                                                />
                                                <img
                                                    src={getImageUrl(brand.logo, 192, 192)}
                                                    alt={brand.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.warn('Failed to load brand logo:', brand.logo)
                                                        e.currentTarget.style.display = 'none'
                                                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                    }}
                                                />
                                            </picture>
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-xs font-medium">No Logo</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-base font-medium text-center transition-colors duration-300 ${
                                        selectedBrand?._id === brand._id 
                                            ? 'text-blue-600 font-semibold' 
                                            : 'text-gray-700 group-hover:text-gray-900'
                                    }`}>
                                        {brand.name}
                                    </span>
                                    {selectedBrand?._id === brand._id && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="mb-4">
                                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No brands available in this category</p>
                            <p className="text-gray-400 text-sm mt-2">This category doesn&apos;t have any associated brands yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Please check back later or contact support.</p>
                        </div>
                    )}
                </div>

                {/* Products View - Only show if there are brands */}
                {getCategoryBrands().length === 0 && !brandsLoading && !productsLoading ? (
                    <div className="text-center py-6">
                      
                        <p className="text-gray-500 text-lg">No Products available in this category</p>
                       
                    </div>
                ) : !selectedBrand && (brandsLoading || productsLoading) ? (
                    <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading brands and products...</p>
                    </div>
                ) : selectedBrand ? (
                    <div>
                        <div className="text-center mb-4">
                        image.png
                        </div>
                        
                        {productsLoading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-6">
                                <div className="mb-4">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4m0 0L4 7m8-4v16l8-4m-8 4V7" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg">No products found for {selectedBrand.name}</p>
                                <p className="text-gray-400 text-sm mt-2">This brand doesn&apos;t have any products in the {category.name} category yet.</p>
                                <p className="text-gray-400 text-sm mt-1">Try selecting a different brand or check back later.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <Link key={product._id} href={`/product/${product.slug.current}`}>
                                        <div className="bg-white overflow-hidden">
                                            <div className="aspect-w-16 aspect-h-full">
                                                {product.coverImage && product.coverImage.asset && product.coverImage.asset._ref ? (
                                                    <picture>
                                                        <source
                                                            srcSet={getAvifImageUrl(product.coverImage, 400, 400, 85)}
                                                            type="image/avif"
                                                        />
                                                        <img
                                                            src={getImageUrl(product.coverImage, 400, 400)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                console.warn('Failed to load product image:', product.coverImage)
                                                                e.currentTarget.style.display = 'none'
                                                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                            }}
                                                        />
                                                    </picture>
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
                ) : null}
            </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </>
    )
}

export default CategoryPage
