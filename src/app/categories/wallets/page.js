"use client"

import BannerCollection from '@/components/Categories/BannerCollection'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import React, { useEffect, useState } from 'react'
import productData from "@/data/productBrand.json";
import { useRouter } from 'next/navigation';
import CategoryBrand from '@/components/Brand/CategoryBrand';
const Wallets = () => {
	const category = "Wallets";
	const [brands, setBrands] = useState([]);
	const router = useRouter();
	useEffect(() => {
		const brandImageMap = {
			"Fossil": "/images/brand/fossil.webp",
			"Tommy Hilfiger": "/images/brand/tommyhilfiger.webp",
			"Montblanc": "/images/brand/montblanc.webp",
			"Burberry": "/images/brand/Burberry.webp",
			"Calvin Klein": "/images/brand/calvinklein.webp",
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
			<BannerCollection url={"/images/banner/bannerCollection/wallets.webp"} title={"Wallets"} />
			<CategoryBrand brand={brands} handleBrandClick={handleBrandClick} />
		</div>
	)
}

export default Wallets