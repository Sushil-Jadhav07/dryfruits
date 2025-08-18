'use client'

import React, { useState, useEffect } from 'react'
import Product from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { motion } from 'framer-motion'
import { useProducts, useCategories } from '@/hooks/useSanity'
import { productQueries, categoryQueries } from '@/lib/sanity-queries'
import { getImageUrl } from '@/lib/sanity'
import type { SanityProduct, SanityCategory } from '@/types/sanity'

interface Props {
    start: number;
    limit: number;
}

const WhatNewOne: React.FC<Props> = ({ start, limit }) => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [filteredProducts, setFilteredProducts] = useState<SanityProduct[]>([]);
    const [allProducts, setAllProducts] = useState<SanityProduct[]>([]);

    // Fetch all products and categories
    const { products, loading: productsLoading, error: productsError } = useProducts(productQueries.getAll);
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(categoryQueries.getAll);

    // Update all products when data is fetched
    useEffect(() => {
        if (products && products.length > 0) {
            console.log('Sanity products loaded:', products);
            console.log('First product structure:', products[0]);
            setAllProducts(products);
            setFilteredProducts(products);
        } else if (products && products.length === 0) {
            console.log('No products returned from Sanity');
        }
    }, [products]);

    // Debug categories
    useEffect(() => {
        if (categories && categories.length > 0) {
            console.log('Sanity categories loaded:', categories);
            console.log('First category structure:', categories[0]);
        } else if (categories && categories.length === 0) {
            console.log('No categories returned from Sanity');
        }
    }, [categories]);

    // Filter products based on active tab
    useEffect(() => {
        console.log('Filtering products. Active tab:', activeTab, 'Total products:', allProducts.length);
        if (activeTab === 'all') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter((product) => {
                // Check if any of the product's categories match the active tab
                const hasMatchingCategory = product.categories && product.categories.some(cat => 
                    cat.toLowerCase() === activeTab.toLowerCase()
                );
                console.log(`Product ${product.name} categories:`, product.categories, 'Matches:', hasMatchingCategory);
                return hasMatchingCategory;
            });
            console.log(`Filtered products for category "${activeTab}":`, filtered);
            setFilteredProducts(filtered);
        }
    }, [activeTab, allProducts]);

    const handleTabClick = (type: string) => {
        setActiveTab(type);
    };

    // Convert Sanity product to ProductType for compatibility
    const convertSanityToProductType = (sanityProduct: SanityProduct): ProductType => {
        // Ensure we have valid data before conversion
        if (!sanityProduct || !sanityProduct._id || !sanityProduct.name) {
            console.warn('Invalid Sanity product data:', sanityProduct);
            // Return a fallback product instead of null
            return {
                id: 'fallback-id',
                category: 'Uncategorized',
                type: 'Uncategorized',
                name: 'Invalid Product',
                gender: 'unisex',
                new: false,
                sale: false,
                rate: 0,
                price: 0,
                originPrice: 0,
                brand: 'Unknown Brand',
                sold: 0,
                quantity: 0,
                quantityPurchase: 1,
                sizes: ['S', 'M', 'L', 'XL'],
                variation: [{
                    color: 'Default',
                    colorCode: '#000000',
                    colorImage: '/images/product/1000x1000.png',
                    image: '/images/product/1000x1000.png'
                }],
                thumbImage: ['/images/product/1000x1000.png'],
                images: ['/images/product/1000x1000.png'],
                coverImage: '/images/product/1000x1000.png', // Add cover image to fallback
                description: 'Invalid product data',
                action: 'add',
                slug: 'invalid-product'
            };
        }

        // Debug: Log the incoming Sanity product data
        console.log('Converting Sanity product:', {
            id: sanityProduct._id,
            name: sanityProduct.name,
            hasCoverImage: !!sanityProduct.coverImage,
            imagesCount: sanityProduct.images?.length || 0,
            categories: sanityProduct.categories,
            price: sanityProduct.price
        });

        // Safely handle images with fallbacks and validation
        const getSafeImageUrl = (image: any, width: number, height: number) => {
            try {
                if (!image) {
                    console.log('No image provided, using fallback');
                    return '/images/product/1000x1000.png';
                }
                const url = getImageUrl(image, width, height);
                console.log('Generated image URL:', url);
                return url || '/images/product/1000x1000.png';
            } catch (error) {
                console.warn('Error generating image URL:', error);
                return '/images/product/1000x1000.png';
            }
        };

        const coverImageUrl = getSafeImageUrl(sanityProduct.coverImage, 300, 400);
        const imageUrls = sanityProduct.images && sanityProduct.images.length > 0 
            ? sanityProduct.images.map((img: any) => getSafeImageUrl(img, 300, 400))
            : [coverImageUrl];
        const fullImageUrls = sanityProduct.images && sanityProduct.images.length > 0
            ? sanityProduct.images.map((img: any) => getSafeImageUrl(img, 600, 800))
            : [coverImageUrl];

        // Ensure we always have at least one image
        const finalImageUrls = imageUrls.length > 0 ? imageUrls : ['/images/product/1000x1000.png'];
        const finalFullImageUrls = fullImageUrls.length > 0 ? fullImageUrls : ['/images/product/1000x1000.png'];

        // Debug: Log the final image URLs
        console.log('Final image URLs for product:', sanityProduct.name, {
            thumbImage: finalImageUrls,
            images: finalFullImageUrls
        });

        return {
            id: sanityProduct._id || '',
            category: sanityProduct.categories && sanityProduct.categories.length > 0 ? sanityProduct.categories[0] : 'Uncategorized',
            type: sanityProduct.categories && sanityProduct.categories.length > 0 ? sanityProduct.categories[0] : 'Uncategorized',
            name: sanityProduct.name || 'Untitled Product',
            gender: 'unisex', // Default value
            new: sanityProduct.publishedAt ? new Date(sanityProduct.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : true, // New if published within 30 days
            sale: false, // Default value
            rate: 5, // Default value
            price: sanityProduct.price || 0,
            originPrice: sanityProduct.price || 0,
            brand: sanityProduct.brand || 'Unknown Brand',
            sold: 0, // Default value
            quantity: sanityProduct.inStock ? 100 : 0,
            quantityPurchase: 1,
            sizes: ['S', 'M', 'L', 'XL'], // Default sizes
            variation: finalImageUrls.length > 0 ? [
                {
                    color: 'Default',
                    colorCode: '#000000',
                    colorImage: finalImageUrls[0],
                    image: finalImageUrls[0]
                }
            ] : [
                {
                    color: 'Default',
                    colorCode: '#000000',
                    colorImage: coverImageUrl,
                    image: coverImageUrl
                }
            ],
            thumbImage: finalImageUrls,
            images: finalFullImageUrls,
            coverImage: coverImageUrl, // Set the cover image
            description: sanityProduct.description || 'No description available',
            action: 'add',
            slug: sanityProduct.slug?.current || sanityProduct._id
        };
    };

    // Get unique categories from products for tabs
    const getCategoryTabs = () => {
        const allCategories: string[] = [];
        allProducts.forEach(product => {
            if (product.categories && Array.isArray(product.categories)) {
                allCategories.push(...product.categories);
            }
        });
        const uniqueCategories = Array.from(new Set(allCategories.filter(Boolean)));
        console.log('All categories from products:', allCategories);
        console.log('Unique categories for tabs:', uniqueCategories);
        return ['all', ...uniqueCategories];
    };

    if (productsLoading || categoriesLoading) {
        return (
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">What{String.raw`'s`} new</div>
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl mt-6">
                            {[...Array(9)].map((_, index) => (
                                <div key={index} className="tab-item relative text-secondary text-button-uppercase py-2 px-5">
                                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 h-64 rounded-2xl"></div>
                                <div className="mt-3 bg-gray-200 h-4 rounded"></div>
                                <div className="mt-2 bg-gray-200 h-4 w-3/4 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (productsError || categoriesError) {
        return (
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">What{String.raw`'s`} new</div>
                        <div className="text-red-500 mt-4">
                            Error loading products. Please try again later.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">What{String.raw`'s`} new</div>
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl mt-6">
                            {getCategoryTabs().map((type) => (
                                <div
                                    key={type}
                                    className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black ${activeTab === type ? 'active' : ''}`}
                                    onClick={() => handleTabClick(type)}
                                >
                                    {activeTab === type && (
                                        <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white'></motion.div>
                                    )}
                                    <span className='relative text-button-uppercase z-[1]'>
                                        {type === 'all' ? 'All' : type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                        {filteredProducts.slice(start, limit).map((prd, index) => {
                            const convertedProduct = convertSanityToProductType(prd);
                            // Only render if we have a valid converted product
                            if (!convertedProduct) {
                                console.warn('Failed to convert product:', prd);
                                return null;
                            }
                            
                            return (
                                <Product 
                                    data={convertedProduct} 
                                    type='grid' 
                                    key={prd._id || index} 
                                    style='style-1' 
                                />
                            );
                        }).filter(Boolean)} {/* Filter out null values */}
                    </div>
                    
                    {filteredProducts.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default WhatNewOne