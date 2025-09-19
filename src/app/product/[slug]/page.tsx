'use client'

import React, { useState, useEffect, useRef } from 'react'
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
    const [isDragging, setIsDragging] = useState(false)
    const [dragX, setDragX] = useState(0)
    const dragStartXRef = useRef(0)
    
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

    // Drag/Swipe handlers for main image
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!hasMultipleImages) return
        setIsDragging(true)
        dragStartXRef.current = e.clientX
        setDragX(0)
        try {
            ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        } catch {}
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const dx = e.clientX - dragStartXRef.current
        setDragX(dx)
    }

    const endDrag = () => {
        if (!isDragging) return
        const threshold = 60
        const dx = dragX
        setIsDragging(false)
        setDragX(0)
        if (Math.abs(dx) > threshold) {
            if (dx < 0) {
                goToNextImage()
            } else {
                goToPreviousImage()
            }
        }
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        try {
            ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
        } catch {}
        endDrag()
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
                <div className="container mx-auto lg:px-4 px-0">
                    {/* Product Details */}
                    <div className="bg-white rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-0 md:px-3 py-3">
                            {/* Product Images */}
                            <div className="space-y-4">
                                {/* Main Image with Navigation */}
                                <div
                                    className="relative aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden select-none -mx-4 md:mx-0"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={endDrag}
                                    onPointerLeave={endDrag}
                                    style={{ touchAction: hasMultipleImages ? 'pan-y' as const : 'auto' as const }}
                                >
                                    {/* Main Image */}
                                    {currentImage && currentImage.asset && currentImage.asset._ref ? (
                                        <>
                                            <img
                                                src={getImageUrl(currentImage, 600, 600)}
                                                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                                                className={`w-full h-full object-cover ${hasMultipleImages ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                                style={{
                                                    transform: `translateX(${dragX}px)`,
                                                    transition: isDragging ? 'none' : 'transform 200ms ease',
                                                }}
                                                draggable={false}
                                                onError={(e) => {
                                                    console.warn('Failed to load main image:', currentImage)
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                            
                                            {/* Brand label overlay */}
                                            {product.brand?.name && (
                                                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                                                    {product.brand.name}
                                                </div>
                                            )}
                                            {/* Image Counter (optional) */}
                                            {hasMultipleImages && (
                                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {selectedImageIndex + 1} / {product.productImages?.length || 0}
                                                </div>
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
                                    <div className="space-y-2 lg:px-0 px-4">
                                        <p className="text-sm font-medium text-gray-700">Product Images ({product.productImages?.length || 0})</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {product.productImages?.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToImage(index)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-b-2 transition-all duration-200 ${
                                                        index === selectedImageIndex 
                                                            ? 'border-b-blue-500 ring-2 ring-blue-200 scale-105' 
                                                            : 'border-b-transparent hover:border-b-gray-300 hover:scale-102'
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
                            <div className="space-y-6 lg:px-0 px-4">
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
                                {(product.richDescription || product.longDescription || product.description) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                        <div className="text-gray-700 leading-relaxed space-y-3">
                                            {Array.isArray(product.richDescription)
                                                ? (<RichDescription blocks={product.richDescription as any[]} />)
                                                : Array.isArray(product.longDescription)
                                                    ? (<RichDescription blocks={product.longDescription as any[]} />)
                                                    : (<PlainTextDescription text={product.description || ''} />)}
                                        </div>
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

// Helpers to render description nicely without extra libs
function PlainTextDescription({ text }: { text: string }) {
    if (!text) return null
    // Normalize line endings and collapse extra spaces
    const normalized = text.replace(/\r\n?/g, '\n')
    // Split into lines and group bullets
    const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean)
    const chunks: Array<{ type: 'p' | 'ul'; content: string[] }> = []
    let currentList: string[] | null = null

    lines.forEach(line => {
        // Detect bullets at start OR inline bullets like "• item1 • item2"
        const hasInlineBullets = /[•·]/.test(line) && line.split(/[•·]/).filter(s => s.trim()).length > 1
        const isBulletStart = /^\s*([-*•]|\u2022)/.test(line)
        if (hasInlineBullets) {
            // Flush any open paragraph/list
            currentList = null
            const items = line.split(/[•·]/).map(s => s.trim()).filter(Boolean)
            chunks.push({ type: 'ul', content: items })
            return
        }
        const cleaned = line.replace(/^\s*([-*•]\s?)/, '').trim()
        const isBullet = isBulletStart
        if (isBullet) {
            if (!currentList) {
                currentList = []
                chunks.push({ type: 'ul', content: currentList })
            }
            currentList.push(cleaned)
        } else {
            currentList = null
            chunks.push({ type: 'p', content: [line] })
        }
    })

    return (
        <div className="max-w-none space-y-3">
            {chunks.map((c, i) =>
                c.type === 'p' ? (
                    <p key={i} className="whitespace-pre-line">{c.content[0]}</p>
                ) : (
                    <ul key={i} className="list-disc pl-5">
                        {c.content.map((item, j) => (
                            <li key={j}>{item}</li>
                        ))}
                    </ul>
                )
            )}
        </div>
    )
}

type Block = { _type: string; children?: Array<{ text: string }>; listItem?: 'bullet' | 'number'; level?: number }

function RichDescription({ blocks }: { blocks: Block[] }) {
    const elements: React.ReactNode[] = []
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null

    const flushList = () => {
        if (!listBuffer) return
        const listEl = listBuffer.type === 'ul' ? (
            <ul className="list-disc pl-5">
                {listBuffer.items.map((it, idx) => (<li key={idx}>{it}</li>))}
            </ul>
        ) : (
            <ol className="list-decimal pl-5">
                {listBuffer.items.map((it, idx) => (<li key={idx}>{it}</li>))}
            </ol>
        )
        elements.push(<div key={`list-${elements.length}`}>{listEl}</div>)
        listBuffer = null
    }

    blocks.forEach((block, idx) => {
        if (block._type === 'block') {
            const text = (block.children || []).map(c => c.text).join('')
            if (block.listItem === 'bullet' || block.listItem === 'number') {
                const type = block.listItem === 'bullet' ? 'ul' : 'ol'
                if (!listBuffer || listBuffer.type !== type) {
                    flushList()
                    listBuffer = { type, items: [] }
                }
                listBuffer.items.push(text)
            } else {
                flushList()
                elements.push(
                    <p key={`p-${idx}`} className="whitespace-pre-line">{text}</p>
                )
            }
        }
    })
    flushList()

    return <div className="max-w-none space-y-3">{elements}</div>
}
