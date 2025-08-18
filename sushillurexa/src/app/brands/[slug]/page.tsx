'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useBrand } from '@/hooks/useSanity'
import { brandQueries } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'

export default function BrandDetailPage() {
    const params = useParams()
    const router = useRouter()
    const brandSlug = params.slug as string

    const { brand, loading, error } = useBrand(brandSlug)

    const handleProductClick = (productSlug: string) => {
        router.push(`/products/${productSlug}`)
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
                        <p className="mt-4 text-gray-600">Loading brand...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (error || !brand) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Brand Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || 'The brand you are looking for does not exist.'}</p>
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

            <div className="min-h-full ">
                {/* Header */}
              

                {/* Brand Info */}
                <div className="container mx-auto px-4 py-8">
                   

                    {/* Products Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl text-center font-bold text-gray-900 mb-12">Products by {brand.name}</h2>
                        
                        {brand.products && brand.products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {brand.products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-lg  transition-shadow cursor-pointer"
                                        onClick={() => handleProductClick(product.slug?.current || product._id)}
                                    >
                                        <div className="relative">
                                            {product.coverImage ? (
                                                <Image
                                                    src={getImageUrl(product.coverImage, 300, 300)}
                                                    width={300}
                                                    height={300}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover rounded-t-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">{product.name}</span>
                                                </div>
                                            )}
                                            {product.featured && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-center text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                           
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                                <p className="text-gray-600">This brand doesn&apos;t have any products yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
} 