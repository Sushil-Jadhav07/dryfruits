'use client'

import React from 'react'
import WhatNewOne from '@/components/Home1/WhatNewOne'
import SanityDebug from '@/components/SanityDebug'
import HierarchicalProductDisplay from '@/components/HierarchicalProductDisplay'

export default function TestSanityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sanity Integration Test</h1>
        <p className="text-center text-gray-600 mb-8">
          This page tests the Sanity CMS integration with the WhatNewOne component and hierarchical structure.
        </p>
        
        {/* Debug component to check data */}
        <div className="mb-8">
          <SanityDebug />
        </div>
        
        {/* Hierarchical Product Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hierarchical Structure Test</h2>
          <HierarchicalProductDisplay />
        </div>
        
        {/* WhatNewOne component */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">WhatNewOne Component Test</h2>
          <WhatNewOne start={0} limit={12} />
        </div>
      </div>
    </div>
  )
} 