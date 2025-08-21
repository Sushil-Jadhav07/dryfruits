'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCategoriesWithBrands } from '@/hooks'
import { getImageUrl } from '@/lib/sanity'
import type { Category } from '../../../types/sanity'

const Category = () => {
    const router = useRouter()

    // Fetch categories with their brands
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategoriesWithBrands()

    const handleCategoryClick = (category: Category) => {
        // Navigate to the category page instead of changing the same page
        router.push(`/category/${category.slug.current}`)
    }

    if (categoriesLoading) {
        return (
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
                        <p className="text-gray-600">Discover our amazing collection of products</p>
                    </div>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (categoriesError) {
        return (
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
                        <p className="text-gray-600">Discover our amazing collection of products</p>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-red-600">Error loading categories: {categoriesError}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
                        
                    </div>

                    {/* Categories Grid */}
                    {categories && categories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <div
                                    key={category._id}
                                    onClick={() => handleCategoryClick(category)}
                                    className="bg-white rounded-lg  overflow-hidden cursor-pointer transition-all duration-200  hover:scale-105"
                                >
                                    <div className="aspect-w-16 aspect-h-9">
                                        {category.image && category.image.asset && category.image.asset._ref ? (
                                            <img
                                                src={getImageUrl(category.image, 400, 300)}
                                                alt={category.name}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    console.warn('Failed to load category image:', category.image)
                                                    e.currentTarget.style.display = 'none'
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-48 bg-gray-200 flex items-center justify-center ${category.image && category.image.asset && category.image.asset._ref ? 'hidden' : ''}`}>
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">{category.name}</h3>
                                       
                                      
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No categories available.</p>
                            <p className="text-sm text-gray-400 mt-2">Please set up your category system in Sanity.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Category