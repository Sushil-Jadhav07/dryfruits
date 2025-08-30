'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProduct } from '@/hooks'
import { getImageUrl, getAvifImageUrl } from '../../../../lib/sanity'
import type { Product } from '../../../../types/sanity'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'

const ProductDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const productSlug = params.slug as string
    
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    
    // Fetch product by slug
    const { data: product, loading: productLoading, error: productError } = useProduct(productSlug)

    // Reset selected image index when product changes
    useEffect(() => {
        if (product?.productImages && product.productImages.length > 0) {
            setSelectedImageIndex(0)
        }
    }, [product])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!product?.productImages || product.productImages.length <= 1) return
            
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                setSelectedImageIndex(prev => 
                    prev === 0 ? (product.productImages?.length || 1) - 1 : prev - 1
                )
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                setSelectedImageIndex(prev => 
                    prev === (product.productImages?.length || 1) - 1 ? 0 : prev + 1
                )
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [product?.productImages])

    // Navigation functions
    const goToPreviousImage = () => {
        if (!product?.productImages || product.productImages.length <= 1) return
        setSelectedImageIndex(prev => 
            prev === 0 ? (product.productImages?.length || 1) - 1 : prev - 1
        )
    }

    const goToNextImage = () => {
        if (!product?.productImages || product.productImages.length <= 1) return
        setSelectedImageIndex(prev => 
            prev === (product.productImages?.length || 1) - 1 ? 0 : prev + 1
        )
    }

    const goToImage = (index: number) => {
        if (!product?.productImages || index < 0 || index >= (product.productImages?.length || 0)) return
        setSelectedImageIndex(index)
    }

    // Debug logging
    useEffect(() => {
        if (product) {
            console.log('Product loaded:', product)
            console.log('Product images:', product.productImages)
            console.log('Selected image index:', selectedImageIndex)
        }
    }, [product, selectedImageIndex])

    if (productLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading product...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (productError || !product) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-8">
                        <p className="text-red-600 text-lg">Product not found or error loading product.</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Check if we have multiple images
    const hasMultipleImages = product.productImages && product.productImages.length > 1
    const currentImage = product.productImages && product.productImages[selectedImageIndex] 
        ? product.productImages[selectedImageIndex] 
        : product.coverImage

    return (
        <>
            {/* Header */}
            <div id="header" className='relative w-full'>
                <MenuTwo />
            </div>
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Product Details */}
                    <div className="bg-white rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            {/* Product Images */}
                            <div className="space-y-4">
                                {/* Main Image with Navigation */}
                                <div className="relative aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                                    {/* Main Image */}
                                    {currentImage && currentImage.asset && currentImage.asset._ref ? (
                                        <>
                                            <img
                                                src={getImageUrl(currentImage, 600, 600)}
                                                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.warn('Failed to load main image:', currentImage)
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                            
                                            {/* Navigation Buttons - Always show if multiple images */}
                                            {hasMultipleImages && (
                                                <>
                                                    {/* Left Arrow */}
                                                    <button
                                                        onClick={goToPreviousImage}
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                                                        aria-label="Previous image"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Right Arrow */}
                                                    <button
                                                        onClick={goToNextImage}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                                                        aria-label="Next image"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Image Counter */}
                                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                        {selectedImageIndex + 1} / {product.productImages?.length || 0}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No Image Available</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Thumbnail Images */}
                                {hasMultipleImages ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Product Images ({product.productImages?.length || 0})</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {product.productImages?.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToImage(index)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                        index === selectedImageIndex 
                                                            ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                                                            : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                                                    }`}
                                                >
                                                    {image.asset && image.asset._ref ? (
                                                        <img
                                                            src={getImageUrl(image, 80, 80)}
                                                            alt={`${product.name} - Image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                console.warn('Failed to load thumbnail:', image)
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">No Image</span>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : product.coverImage && product.coverImage.asset && product.coverImage.asset._ref ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Cover Image</p>
                                        <div className="flex gap-2">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 ring-2 ring-blue-200">
                                                <img
                                                    src={getImageUrl(product.coverImage, 80, 80)}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                {/* Category and Brand */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#dcdcde] text-gray-800">
                                        {product.category?.name || 'Unknown Category'}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#dcdcde] text-blue-800">
                                        {product.brand?.name || 'Unknown Brand'}
                                    </span>
                                </div>

                                {/* Product Name */}
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                                {/* Description */}
                                {product.description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                    </div>
                                )}

                                {/* WhatsApp Button */}
                                <div className="pt-4">
                                    <a
                                        href={`https://wa.me/+919876543210?text=Hi! I'm interested in ${product.name} - ${window.location.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium w-full"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                        Contact on WhatsApp
                                    </a>
                                </div>

                                {/* Additional Info */}
                                {product.tags && product.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </>
    )
}

export default ProductDetailPage
