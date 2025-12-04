'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCategory, useBrand, useProducts } from '@/hooks'
import { getImageUrl, getAvifImageUrl } from '@/lib/sanity'
import type { Product } from '@/types/sanity'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'

const BrandPage = () => {
    const router = useRouter()
    const params = useParams()
    const categorySlug = params.slug as string
    const brandSlug = params.brandSlug as string

    // Fetch category by slug
    const { data: category, loading: categoryLoading, error: categoryError } = useCategory(categorySlug)
    
    // Fetch brand by slug
    const { data: brand, loading: brandLoading, error: brandError } = useBrand(brandSlug)
    
    // Fetch all products for filtering
    const { data: products, loading: productsLoading, error: productsError } = useProducts()

    // Filter products based on category and brand
    const getFilteredProducts = (): Product[] => {
        if (!products || !category || !brand) return []
        
        return products.filter(product => 
            product.category && 
            product.category._id === category._id &&
            product.brand && 
            product.brand._id === brand._id
        )
    }

    const filteredProducts = getFilteredProducts()

    if (categoryLoading || brandLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state if category or brand not found
    if (categoryError || !category || brandError || !brand) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="text-center py-8">
                            <p className="text-red-600 text-lg mb-4">Category or brand not found.</p>
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
                    {/* Page Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {brand.name} - {category.name}
                        </h1>
                    </div>

                    {/* Products Grid */}
                    {productsLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading products...</p>
                        </div>
                    ) : productsError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">Error loading products: {productsError}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4m0 0L4 7m8-4v16l8-4m-8 4V7" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">No products found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {brand.name} doesn&apos;t have any products in the {category.name} category yet.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <Link key={product._id} href={`/product/${product.slug.current}`}>
                                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                                            <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                                                {product.coverImage && product.coverImage.asset && product.coverImage.asset._ref ? (
                                                    <picture>
                                                        <source
                                                            srcSet={getAvifImageUrl(product.coverImage, 400, 400, 85)}
                                                            type="image/avif"
                                                        />
                                                        <img
                                                            src={getImageUrl(product.coverImage, 400, 400)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                            onError={(e) => {
                                                                console.warn('Failed to load product image:', product.coverImage)
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    </picture>
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                {product.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                        {product.description}
                                                    </p>
                                                )}
                                                {product.price && (
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ${product.price}
                                                        {product.comparePrice && product.comparePrice > product.price && (
                                                            <span className="ml-2 text-sm text-gray-500 line-through">
                                                                ${product.comparePrice}
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </>
    )
}

export default BrandPage

