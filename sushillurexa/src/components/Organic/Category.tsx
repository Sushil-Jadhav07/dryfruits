'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useSanity';
import { categoryQueries } from '@/lib/sanity-queries';
import { getImageUrl } from '@/lib/sanity';
import type { SanityCategory } from '@/types/sanity';

const Category = () => {
    const router = useRouter();

    // Fetch categories from Sanity
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(categoryQueries.getAll);

    const handleCategoryClick = (category: SanityCategory) => {
        // Navigate to the category detail page
        const categorySlug = category.slug?.current || category._id;
        router.push(`/categories/${categorySlug}`);
    };

    if (categoriesLoading) {
        return (
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (categoriesError) {
        return (
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                    <div className="text-center text-red-600">
                        <p>Error loading categories: {categoriesError}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
                        <p className="text-gray-600">Discover our amazing collection of products</p>
                    </div>

                    <div className="list-trending section-swiper-navigation style-small-border style-outline md:mt-8 mt-6">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={2}
                            navigation
                            loop={true}
                            modules={[Navigation, Autoplay]}
                            breakpoints={{
                                576: {
                                    slidesPerView: 3,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                                1290: {
                                    slidesPerView: 6,
                                    spaceBetween: 30,
                                },
                            }}
                            className='h-full'
                        >
                            {categories && categories.length > 0 ? (
                                categories.map((category) => (
                                    <SwiperSlide key={category._id}>
                                        <div 
                                            className="trending-item block relative cursor-pointer hover:scale-105 transition-transform duration-300" 
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            <div className="bg-img rounded-full overflow-hidden">
                                                {category.mainImage ? (
                                                    <Image
                                                        src={getImageUrl(category.mainImage, 200, 200)}
                                                        width={200}
                                                        height={200}
                                                        alt={category.name}
                                                        priority={true}
                                                        className='w-full h-full object-cover'
                                                    />
                                                ) : category.image ? (
                                                    <Image
                                                        src={getImageUrl(category.image, 200, 200)}
                                                        width={200}
                                                        height={200}
                                                        alt={category.name}
                                                        priority={true}
                                                        className='w-full h-full object-cover'
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-500 text-sm">{category.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="trending-name text-center mt-5 duration-500">
                                                <span className='heading5'>{category.name}</span>
                                                <p className="text-sm text-gray-600 mt-1">{category.productCount || 0} products</p>
                                                {category.brands && category.brands.length > 0 && (
                                                    <p className="text-xs text-blue-600 mt-1">{category.brands.length} brands</p>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))
                            ) : (
                                <div className="text-center text-gray-600 py-8">
                                    <p>No categories found.</p>
                                </div>
                            )}
                        </Swiper>
                    </div>

                    {/* View All Categories Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={() => router.push('/categories')}
                            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            View All Categories
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Category