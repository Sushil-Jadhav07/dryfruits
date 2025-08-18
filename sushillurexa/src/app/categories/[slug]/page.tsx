'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useCategory } from '@/hooks/useSanity'
import { categoryQueries } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'

export default function CategoryDetailPage() {
    const params = useParams()
    const router = useRouter()
    const categorySlug = params.slug as string

    const { category, loading, error } = useCategory(categorySlug)

    const handleBrandClick = (brandSlug: string) => {
        router.push(`/brands/${brandSlug}`)
    }

    const handleBackToCategories = () => {
        router.push('/categories')
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
                        <p className="mt-4 text-gray-600">Loading category...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (error || !category) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Category Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || 'The category you are looking for does not exist.'}</p>
                        <button
                            onClick={handleBackToCategories}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            ← Back to Categories
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

            <div className="min-h-full">
                {/* Header */}
                

                {/* Category Image */}
                {/* {category.mainImage ? (
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-full mx-auto">
                            <Image
                                src={getImageUrl(category.mainImage, 1200, 600)}
                                width={1200}
                                height={600}
                                alt={category.name}
                                className="w-full lg:h-[500px] h-[200px] object-cover rounded-lg shadow-lg"
                                priority={true}
                            />
                        </div>
                    </div>
                ) : category.image ? (
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            <Image
                                src={getImageUrl(category.image, 800, 400)}
                                width={800}
                                height={400}
                                alt={category.name}
                                className="w-full lg:h-[500px] h-[200px] object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                ) : null} */}

                {/* Brands Section */}
                <div className="container mx-auto px-4 py-8">
                  

                    {category.brands && category.brands.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {category.brands.map((brand) => (
                                <div
                                    key={brand._id}
                                    className="bg-white rounded-lg   transition-shadow cursor-pointer"
                                    onClick={() => handleBrandClick(brand.slug?.current || brand._id)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-center mb-4">
                                            {brand.logo ? (
                                                <Image
                                                    src={getImageUrl(brand.logo, 120, 120)}
                                                    width={300}
                                                    height={300}
                                                    alt={brand.name}
                                                    className="w-48 h-48 object-contain"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm font-medium">{brand.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                                           
                                          
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Brands Found</h3>
                            <p className="text-gray-600">This category doesn&apos;t have any brands yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
} 