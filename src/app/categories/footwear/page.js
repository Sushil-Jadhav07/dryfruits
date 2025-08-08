"use client"

import BannerCollection from '@/components/Categories/BannerCollection'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import productData from "@/data/productBrand.json";
import CategoryBrand from '@/components/Brand/CategoryBrand';
const Footwear = () => {
	const category = "Shoes";
	const [brands, setBrands] = useState([]);
	const router = useRouter();
	useEffect(() => {
		const brandImageMap = {
			"Nike": "/images/brand/nike.webp",
			"Adidas": "/images/brand/6.png",
			"Puma": "/images/brand/puma.webp",
			"Reebok": "/images/brand/reebok.webp",
			"New Balance": "/images/brand/3.webp",
			// Add more brands here if needed
		};

		const purseBrands = productData
			.filter((p) => p.category.toLowerCase() === category.toLowerCase())
			.map((p) => p.brand);

		const unique = [...new Set(purseBrands)];

		const formatted = unique.map((brand) => ({
			name: brand,
			image: brandImageMap[brand] || '/images/brands/default.webp'
		}));

		setBrands(formatted);
	}, []);

	const handleBrandClick = (brand) => {
		router.push(`/brand/${encodeURIComponent(brand)}`);
	};
	console.log(brands)
	return (
		<div id="header" className='relative w-full'>
			<MenuTwo />
			<BannerCollection url={"/images/banner/bannerCollection/shoes.webp"} title={"Footwear"} />
			<CategoryBrand brand={brands} handleBrandClick={handleBrandClick} />
		</div>
	)
}

export default Footwear