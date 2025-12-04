'use client'

import React, { useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCategory } from '@/hooks'
import { getImageUrl, getAvifImageUrl } from '@/lib/sanity'
import type { Brand } from '@/types/sanity'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'

const CategoryPage = () => {
    const router = useRouter()
    const params = useParams()
    const categorySlug = params.slug as string
    
    // Fetch category by slug (includes brands in the query)
    const { data: category, loading: categoryLoading, error: categoryError } = useCategory(categorySlug)
    
    // Get brands from category data (already included in the query)
    const categoryBrands = useMemo(() => {
        if (!category || !category.brands) return []
        // Debug: log to verify brands are being fetched
        if (category.brands && category.brands.length > 0) {
            console.log('Category brands found:', category.brands.length, category.brands)
        }
        return category.brands
    }, [category])

    const handleBrandClick = (brand: Brand) => {
        // Navigate to brand page
        if (brand.slug?.current) {
            router.push(`/category/${categorySlug}/brand/${brand.slug.current}`)
        } else {
            console.error('Brand slug is missing:', brand)
        }
    }

    if (categoryError || (!categoryLoading && !category)) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-8">
                        <p className="text-red-600 text-lg">Category not found or error loading category.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            {/* Header */}
            <div id="header" className='relative w-full'>
                <MenuTwo />
            </div>
            
            <div className="min-h-full bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                    {/* Brands Grid - NO CAROUSEL, ONLY GRID LAYOUT */}
                    <div className="mb-12 bg-white rounded-xl p-8">
                    <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold mb-2">
                                {categoryLoading ? 'Loading...' : `Brands in ${category?.name || ''}`}
                            </h2>
                    </div>
                    
                        {categoryLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading brands...</p>
                        </div>
                        ) : categoryBrands.length > 0 ? (
                            // Responsive Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {categoryBrands.map((brand) => (
                                <div
                                    key={brand._id}
                                    onClick={() => {
                                        if (brand.slug?.current) {
                                            handleBrandClick(brand)
                                        } else {
                                            console.warn('Brand does not have a slug:', brand)
                                        }
                                    }}
                                    className={`flex flex-col items-center transition-all duration-300 group p-4 rounded-lg hover:scale-105 hover:bg-gray-50 ${
                                        brand.slug?.current ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                                    }`}
                                >
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 mb-4 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
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
                                                            }}
                                                        />
                                                    </picture>
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-xs font-medium">No Logo</span>
                                                    </div>
                                                )}
                                            </div>
                                    <span className="text-base font-medium text-center transition-colors duration-300 text-gray-700 group-hover:text-gray-900">
                                                {brand.name}
                                            </span>
                                        </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No brands available in this category</p>
                            <p className="text-gray-400 text-sm mt-2">This category doesn&apos;t have any associated brands yet.</p>
                            </div>
                        )}
                    </div>
            </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </>
    )
}

export default CategoryPage
