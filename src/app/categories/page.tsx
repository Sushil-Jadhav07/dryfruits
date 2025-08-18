'use client'

import React from 'react'
import { useCategories } from '@/hooks/useSanity'
import { categoryQueries } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'

export default function CategoriesPage() {
    const router = useRouter()
    const { categories, loading, error } = useCategories(categoryQueries.getAll)

    const handleCategoryClick = (categorySlug: string) => {
        router.push(`/categories/${categorySlug}`)
    }

    if (loading) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (error) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Categories</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuTwo />
            </div>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover our amazing collection of products organized by categories. 
                                Each category contains carefully curated brands and products.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="container mx-auto px-4 py-12">
                    {categories && categories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                    onClick={() => handleCategoryClick(category.slug?.current || category._id)}
                                >
                                    <div className="relative">
                                        {category.mainImage ? (
                                            <Image
                                                src={getImageUrl(category.mainImage, 400, 300)}
                                                width={400}
                                                height={300}
                                                alt={category.name}
                                                className="w-full h-48 object-cover rounded-t-xl"
                                                priority={true}
                                            />
                                        ) : category.image ? (
                                            <Image
                                                src={getImageUrl(category.image, 400, 300)}
                                                width={400}
                                                height={300}
                                                alt={category.name}
                                                className="w-full h-48 object-cover rounded-t-xl"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl flex items-center justify-center">
                                                <span className="text-gray-500 text-lg font-medium">{category.name}</span>
                                            </div>
                                        )}
                                        {category.featured && (
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                                        {category.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
                                        )}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{category.productCount || 0} products</span>
                                            {category.brands && category.brands.length > 0 && (
                                                <span>{category.brands.length} brands</span>
                                            )}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                                                Explore Category
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-6">
                                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Categories Found</h3>
                            <p className="text-gray-600 mb-8">It looks like there are no categories available at the moment.</p>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
} 