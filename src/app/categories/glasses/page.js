"use client"

import BannerCollection from '@/components/Categories/BannerCollection'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import { useRouter } from 'next/navigation';
import productData from "@/data/productBrand.json";
import React, { useEffect, useState } from 'react'
import CategoryBrand from '@/components/Brand/CategoryBrand';

const Glasses = () => {
	const category = "Glasses";
	const [brands, setBrands] = useState([]);
	const router = useRouter();
	useEffect(() => {
		const brandImageMap = {
			"Ray-Ban": "/images/brand/rayban.webp",
			"Oakley": "/images/brand/oakley.webp",
			"Tom Ford": "/images/brand/tomford.webp",
			"Versace": "/images/brand/versace.webp",
			"Armani Exchange": "/images/brand/giorgioarmani.webp",
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
			<BannerCollection url={"/images/banner/bannerCollection/glass.webp"} title={"Glasses"} />
			<CategoryBrand brand={brands} handleBrandClick={handleBrandClick} />
		</div>
	)
}

export default Glasses