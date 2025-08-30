'use client'

import React, { useState, useEffect } from 'react'
import { getAvifImageUrl, getOptimizedImageUrl, getBestImageFormat } from '@/lib/sanity'
import type { SanityImage } from '@/types/sanity'

interface AvifImageProps {
  source: SanityImage
  alt: string
  width: number
  height: number
  quality?: number
  className?: string
  priority?: boolean
  fallbackFormat?: 'webp' | 'jpg' | 'png'
  onLoad?: () => void
  onError?: (error: Error) => void
}

export default function AvifImage({
  source,
  alt,
  width,
  height,
  quality = 80,
  className = '',
  priority = false,
  fallbackFormat = 'webp',
  onLoad,
  onError
}: AvifImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [supportsAvif, setSupportsAvif] = useState<boolean | null>(null)

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to get the best available format (AVIF > WebP > JPG)
        const bestUrl = await getBestImageFormat(source, width, height, quality)
        setImageUrl(bestUrl)
        
        // Check if AVIF is supported
        const avifSupported = await import('@/lib/avif-support').then(
          module => module.getAvifSupport()
        )
        setSupportsAvif(avifSupported)
        
        setIsLoading(false)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load image')
        setError(error)
        setIsLoading(false)
        
        // Fallback to WebP if best format fails
        try {
          const fallbackUrl = getOptimizedImageUrl(source, width, height, quality, fallbackFormat)
          setImageUrl(fallbackUrl)
          setIsLoading(false)
        } catch (fallbackErr) {
          console.error('Fallback image loading failed:', fallbackErr)
        }
      }
    }

    if (source && source.asset && source.asset._ref) {
      loadImage()
    }
  }, [source, width, height, quality, fallbackFormat])

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = new Error('Image failed to load')
    setError(error)
    setIsLoading(false)
    onError?.(error)
  }

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    )
  }

  return (
    <div className="relative">
      {/* AVIF Image (if supported) */}
      {supportsAvif && (
        <picture>
          <source
            srcSet={getAvifImageUrl(source, width, height, quality)}
            type="image/avif"
          />
          <img
            src={getOptimizedImageUrl(source, width, height, quality, fallbackFormat)}
            alt={alt}
            width={width}
            height={height}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
      )}
      
      {/* Fallback Image (if AVIF not supported) */}
      {!supportsAvif && (
        <img
          src={getOptimizedImageUrl(source, width, height, quality, fallbackFormat)}
          alt={alt}
          width={width}
          height={height}
          className={className}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Format indicator (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {supportsAvif ? 'AVIF' : fallbackFormat.toUpperCase()}
        </div>
      )}
    </div>
  )
}

// Hook to check AVIF support in components
export function useAvifSupport() {
  const [supportsAvif, setSupportsAvif] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSupport = async () => {
      try {
        const { getAvifSupport } = await import('@/lib/avif-support')
        const supported = await getAvifSupport()
        setSupportsAvif(supported)
      } catch (error) {
        console.warn('Failed to check AVIF support:', error)
        setSupportsAvif(false)
      }
    }

    checkSupport()
  }, [])

  return supportsAvif
}
