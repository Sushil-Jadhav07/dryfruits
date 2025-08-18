'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useProduct, useProducts } from '@/hooks/useSanity'
import { productQueries } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Footer from '@/components/Footer/Footer'
import type { SanityProduct } from '@/types/sanity'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const productSlug = params.slug as string
    const [selectedImage, setSelectedImage] = useState<number>(0)
    const [relatedProducts, setRelatedProducts] = useState<SanityProduct[]>([])

    const { product, loading, error } = useProduct(productSlug)
    const { products: allProducts } = useProducts(productQueries.getAll)

    // Fetch related products when product and all products are available
    useEffect(() => {
        if (product && allProducts && allProducts.length > 0) {
            const related = allProducts.filter(p => 
                p._id !== product._id && (
                    // Same category
                    (product.categories && p.categories && 
                     product.categories.some(cat => p.categories?.includes(cat))) ||
                    // Same brand
                    (product.brand && p.brand && product.brand === p.brand)
                )
            ).slice(0, 8); // Limit to 8 related products
            
            setRelatedProducts(related);
        }
    }, [product, allProducts]);

    const handleBackToBrands = () => {
        router.push('/categories')
    }

    const handleWhatsAppRedirect = () => {
        const message = `Hi! I'm interested in ${product?.name}. Can you provide more details about this product?`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    const handleProductClick = (productSlug: string) => {
        router.push(`/products/${productSlug}`)
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
                        <p className="mt-4 text-gray-600">Loading product...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (error || !product) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <MenuTwo />
                </div>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
                        <button
                            onClick={handleBackToBrands}
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

            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <button
                                onClick={handleBackToBrands}
                                className="hover:text-gray-900 transition-colors"
                            >
                                Categories
                            </button>
                            <span>/</span>
                            {product.categories && product.categories.length > 0 && (
                                <>
                                    <span>{product.categories[0]}</span>
                                    <span>/</span>
                                </>
                            )}
                            {product.brand && (
                                <>
                                    <span>{product.brand}</span>
                                    <span>/</span>
                                </>
                            )}
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </div>
                    </div>
                </div>

                {/* Product Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images - Left Side */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="bg-white rounded-lg p-4">
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={getImageUrl(product.images[selectedImage] || product.coverImage, 600, 600)}
                                        width={600}
                                        height={600}
                                        alt={product.name}
                                        className="w-full h-auto rounded-lg"
                                        priority={true}
                                    />
                                ) : product.coverImage ? (
                                    <Image
                                        src={getImageUrl(product.coverImage, 600, 600)}
                                        width={600}
                                        height={600}
                                        alt={product.name}
                                        className="w-full h-auto rounded-lg"
                                        priority={true}
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500 text-lg">No image available</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-5 gap-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index 
                                                    ? 'border-gray-900' 
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <Image
                                                src={getImageUrl(image, 120, 120)}
                                                width={120}
                                                height={120}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="w-full h-24 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details - Right Side */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div className="bg-white rounded-lg  p-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                                
                               
                                {/* Availability */}
                                <div className="mb-6">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        product.inStock 
                                            ? 'bg-green text-green-800' 
                                            : 'bg-red text-red-800'
                                    }`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${
                                            product.inStock ? 'bg-[#044a1f]' : 'bg-red-500'
                                        }`}></span>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                {/* Category and Brand */}
                                <div className="space-y-3 mb-6">
                                    {product.categories && product.categories.length > 0 && (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600 font-medium">Category:</span>
                                            <span className="text-gray-900">{product.categories.join(', ')}</span>
                                        </div>
                                    )}
                                    
                                    {product.brand && (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-600 font-medium">Brand:</span>
                                            <span className="text-gray-900">{product.brand}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="mb-6">
                                        <span className="text-gray-600 font-medium block mb-2">Tags:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                  
                                    
                                    <button
                                        onClick={handleWhatsAppRedirect}
                                        className="w-full bg-[#25D366] text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                        <span>Contact on WhatsApp</span>
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="bg-white rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Product Information */}
                          
                        </div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Products</h2>
                                <p className="text-gray-600">Discover more products you might like</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct._id}
                                        className="bg-white rounded-lg text-center transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                        onClick={() => handleProductClick(relatedProduct.slug?.current || relatedProduct._id)}
                                    >
                                        <div className="relative">
                                            {relatedProduct.coverImage ? (
                                                <Image
                                                    src={getImageUrl(relatedProduct.coverImage, 300, 300)}
                                                    width={300}
                                                    height={300}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-48 object-cover rounded-t-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">{relatedProduct.name}</span>
                                                </div>
                                            )}
                                            
                                            {relatedProduct.featured && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {relatedProduct.name}
                                            </h3>
                                            
                                           
                                          
                                            
                                           
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
} 