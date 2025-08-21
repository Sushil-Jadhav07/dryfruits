'use client'

import React, { useState } from 'react'
import { useCategories, useProducts } from '@/hooks'
import { getImageUrl } from '@/lib/sanity'
import type { Category, Product } from '../../../types/sanity'

interface Props {
    start: number;
    limit: number;
}

const WhatNewOne: React.FC<Props> = ({ start, limit }) => {
    const [activeCategory, setActiveCategory] = useState<string>('all')
    
    // Fetch categories and products
    const { data: categories, loading: categoriesLoading } = useCategories()
    const { data: products, loading: productsLoading } = useProducts()

    // Filter products by category
    const getFilteredProducts = () => {
        if (!products) return []
        
        if (activeCategory === 'all') {
            return products.slice(start, start + limit)
        }
        
        return products.filter(product => 
            product.category && product.category._id === activeCategory
        ).slice(start, start + limit)
    }

    const filteredProducts = getFilteredProducts()

    if (categoriesLoading || productsLoading) {
        return (
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">What&apos;s new</div>
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">What&apos;s new</div>
                        
                        {/* Category Tabs */}
                        {categories && categories.length > 0 && (
                            <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl md:mt-8 mt-6 overflow-x-auto">
                                <div
                                    className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black whitespace-nowrap
                                        ${activeCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveCategory('all')}
                                >
                                    <span className='relative text-button-uppercase z-[1]'>All Categories</span>
                                </div>
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black whitespace-nowrap
                                            ${activeCategory === category._id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category._id)}
                                    >
                                        <span className='relative text-button-uppercase z-[1]'>{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="list-product grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg overflow-hidden">
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
                                      
                                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">{product.name}</h3>
                                       
                                        <div className="flex items-center justify-between">
                                           
                                            <button 
                                                onClick={() => window.location.href = `/product/${product.slug.current}`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-10">
                            <p>No products found for the selected category.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default WhatNewOne