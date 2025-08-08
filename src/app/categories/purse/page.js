'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BannerCollection from '@/components/Categories/BannerCollection';
import MenuTwo from '@/components/Header/Menu/MenuTwo';
import CategoryBrand from '@/components/Brand/CategoryBrand';
import productData from "@/data/productBrand.json";

const Purse = () => {
  const category = "Purse";
  const [brands, setBrands] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const brandImageMap = {
      "Gucci": "/images/brand/gucci.webp",
      "Louis Vuitton": "/images/brand/3.png",
      "Prada": "/images/brand/prada.webp",
      "Dior": "/images/brand/dior.webp",
      "Coach": "/images/brand/coach.webp",
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

  return (
    <div id="header" className="relative w-full">
      <MenuTwo />
      <BannerCollection url="/images/banner/bannerCollection/purse.webp" title="Purse" />
      <CategoryBrand brand={brands} handleBrandClick={handleBrandClick} />
    </div>
  );
};

export default Purse;
