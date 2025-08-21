'use client'

import React, { useState, useEffect } from 'react'
import ProductComponent from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { motion } from 'framer-motion'
import { useBrands, useProducts } from '@/hooks'
import type { Brand, Product } from '../../../types/sanity'

interface Props {
    start: number;
    limit: number;
}

const PopularProduct: React.FC<Props> = ({ start, limit }) => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Fetch brands and products from Sanity
    const { data: brands, loading: brandsLoading, error: brandsError } = useBrands();
    const { data: products, loading: productsLoading, error: productsError } = useProducts();

    // Update filtered products when active tab or products change
    useEffect(() => {
        if (products && products.length > 0) {
            console.log('PopularProduct: Products loaded:', products.length);
            console.log('PopularProduct: First product brand:', products[0]?.brand);
            
            if (activeTab === 'all') {
                // Show first 5 products from all brands
                const firstFive = products.slice(0, 5);
                console.log('PopularProduct: Showing first 5 products from all brands:', firstFive.length);
                setFilteredProducts(firstFive);
            } else {
                // Filter products by brand and show first 5
                const filtered = products.filter((product) => 
                    product.brand && product.brand.name && product.brand.name.toLowerCase() === activeTab.toLowerCase()
                );
                console.log(`PopularProduct: Filtered products for ${activeTab}:`, filtered.length);
                const firstFive = filtered.slice(0, 5);
                setFilteredProducts(firstFive);
            }
        }
    }, [activeTab, products]);

    const handleTabClick = (brandName: string) => {
        console.log('PopularProduct: Tab clicked:', brandName);
        setActiveTab(brandName);
    };

    // Get all brands for tabs (limit to first 8 for better UI)
    const getBrandTabs = () => {
        if (!brands || brands.length === 0) {
            console.log('PopularProduct: No brands available');
            return ['all'];
        }
        
        console.log('PopularProduct: Brands loaded:', brands.length);
        console.log('PopularProduct: First brand:', brands[0]?.name);
        
        // Limit to first 8 brands plus 'all' for better UI
        const limitedBrands = brands.slice(0, 8);
        const brandNames = ['all', ...limitedBrands.map(brand => brand.name)];
        console.log('PopularProduct: Brand tabs:', brandNames);
        return brandNames;
    };

    if (brandsLoading || productsLoading) {
        return (
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">Popular Brands</div>
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl md:mt-8 mt-6">
                            {[...Array(9)].map((_, index) => (
                                <div key={index} className="tab-item relative text-secondary text-button-uppercase py-2 px-5">
                                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                        {[...Array(5)].map((_, index) => (
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

    if (brandsError || productsError) {
        return (
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">Popular Brands</div>
                        <div className="text-red-500 mt-4">
                            Error loading brands or products. Please try again later.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Convert Sanity product to ProductType for compatibility
    const convertSanityToProductType = (sanityProduct: Product): ProductType => {
        // Ensure we have valid data before conversion
        if (!sanityProduct || !sanityProduct._id || !sanityProduct.name) {
            console.warn('Invalid Sanity product data:', sanityProduct);
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
                coverImage: '/images/product/1000x1000.png',
                description: 'Invalid product data',
                action: 'add',
                slug: 'invalid-product'
            };
        }

        // Safely handle images with fallbacks
        const getSafeImageUrl = (image: any, width: number, height: number) => {
            try {
                if (!image) {
                    return '/images/product/1000x1000.png';
                }
                const url = getImageUrl(image, width, height);
                return url || '/images/product/1000x1000.png';
            } catch (error) {
                return '/images/product/1000x1000.png';
            }
        };

        const coverImageUrl = getSafeImageUrl(sanityProduct.coverImage, 300, 400);
        const imageUrls = sanityProduct.images && sanityProduct.images.length > 0 
            ? sanityProduct.images.map((img: any) => getSafeImageUrl(img, 300, 400))
            : [coverImageUrl];

        return {
            id: sanityProduct._id || '',
            category: sanityProduct.categories && sanityProduct.categories.length > 0 ? sanityProduct.categories[0] : 'Uncategorized',
            type: sanityProduct.categories && sanityProduct.categories.length > 0 ? sanityProduct.categories[0] : 'Uncategorized',
            name: sanityProduct.name || 'Untitled Product',
            gender: 'unisex',
            new: sanityProduct.publishedAt ? new Date(sanityProduct.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : true,
            sale: false,
            rate: 5,
            price: sanityProduct.price || 0,
            originPrice: sanityProduct.price || 0,
            brand: sanityProduct.brand || 'Unknown Brand',
            sold: 0,
            quantity: sanityProduct.inStock ? 100 : 0,
            quantityPurchase: 1,
            sizes: ['S', 'M', 'L', 'XL'],
            variation: [{
                color: 'Default',
                colorCode: '#000000',
                colorImage: coverImageUrl,
                image: coverImageUrl
            }],
            thumbImage: imageUrls,
            images: imageUrls,
            coverImage: coverImageUrl,
            description: sanityProduct.description || 'No description available',
            action: 'add',
            slug: sanityProduct.slug?.current || sanityProduct._id
        };
    };

    const brandTabs = getBrandTabs();

    return (
        <>
            <div className="whate-new-block md:pt-20 pt-10">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="heading3">Popular Brands</div>
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl md:mt-8 mt-6 overflow-x-auto">
                            {brandTabs.map((brandName) => (
                                <div
                                    key={brandName}
                                    className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black whitespace-nowrap
                                        ${activeTab === brandName ? 'active' : ''}`}
                                    onClick={() => handleTabClick(brandName)}
                                >
                                    {activeTab === brandName && (
                                        <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white'></motion.div>
                                    )}
                                    <span className='relative text-button-uppercase z-[1]'>
                                        {brandName === 'all' ? 'All Brands' : brandName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
                        {filteredProducts.slice(start, limit).map((prd, index) => {
                            const convertedProduct = convertSanityToProductType(prd);
                            return (
                                <Product 
                                    data={convertedProduct} 
                                    type='grid' 
                                    key={prd._id || index} 
                                    style='style-1' 
                                />
                            );
                        })}
                    </div>
                    
                    {filteredProducts.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            {activeTab === 'all' 
                                ? 'No products found.' 
                                : `No products found for ${activeTab}.`
                            }
                        </div>
                    )}

                    {/* Show info about product limit */}
                    {filteredProducts.length > 0 && (
                        <div className="text-center text-sm text-gray-500 mt-6">
                            Showing first 5 products {activeTab !== 'all' && `from ${activeTab}`}
                            {activeTab !== 'all' && filteredProducts.length < 5 && ` (only ${filteredProducts.length} available)`}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PopularProduct