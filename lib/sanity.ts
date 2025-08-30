import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration with environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID 
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_TOKEN

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
  token, // Only needed for write operations
})

// Image URL builder
const builder = imageUrlBuilder(client)

// Function to generate image URLs
export function urlFor(source: any) {
  return builder.image(source)
}

// Function to get image URL with specific dimensions
export function getImageUrl(source: any, width: number, height: number) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return '/images/product/1000x1000.png'
  }
  
  try {
    return urlFor(source).width(width).height(height).url()
  } catch (error) {
    console.warn('Error generating image URL:', error)
    return '/images/product/1000x1000.png'
  }
}

// Function to get image URL with quality and format options
export function getOptimizedImageUrl(
  source: any, 
  width: number, 
  height: number, 
  quality: number = 80,
  format: 'webp' | 'jpg' | 'png' = 'webp'
) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return '/images/product/1000x1000.png'
  }
  
  try {
    return urlFor(source)
      .width(width)
      .height(height)
      .quality(quality)
      .format(format)
      .url()
  } catch (error) {
    console.warn('Error generating optimized image URL:', error)
    return '/images/product/1000x1000.png'
  }
}

// Function to get AVIF image URL with quality options
export function getAvifImageUrl(
  source: any, 
  width: number, 
  height: number, 
  quality: number = 80
) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return '/images/product/1000x1000.png'
  }
  
  try {
    // For AVIF support, we'll use a custom approach
    // Since Sanity's image-url package doesn't support AVIF directly,
    // we'll construct the URL manually with AVIF format
    const imageBuilder = urlFor(source)
      .width(width)
      .height(height)
      .quality(quality)
    
    // Get the base URL and append AVIF format
    const baseUrl = imageBuilder.url()
    
    // If the URL contains format parameter, replace it with avif
    if (baseUrl.includes('format=')) {
      return baseUrl.replace(/format=[^&]+/, 'format=avif')
    } else {
      // If no format parameter, add it
      const separator = baseUrl.includes('?') ? '&' : '?'
      return `${baseUrl}${separator}format=avif`
    }
  } catch (error) {
    console.warn('Error generating AVIF image URL:', error)
    // Fallback to webp if AVIF generation fails
    return getOptimizedImageUrl(source, width, height, quality, 'webp')
  }
}

// Function to get responsive image URLs
export function getResponsiveImageUrls(source: any, breakpoints: number[]) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return {}
  }
  
  try {
    const urls: Record<string, string> = {}
    breakpoints.forEach(breakpoint => {
      urls[`${breakpoint}w`] = urlFor(source).width(breakpoint).url()
    })
    return urls
  } catch (error) {
    console.warn('Error generating responsive image URLs:', error)
    return {}
  }
}

// Import AVIF support functions
import { getAvifSupport, convertToAvifFormat } from './avif-support'

// Function to check if AVIF is supported by the browser
export async function isAvifSupported(): Promise<boolean> {
  return await getAvifSupport()
}

// Function to get the best available image format (AVIF > WebP > JPG)
export async function getBestImageFormat(
  source: any,
  width: number,
  height: number,
  quality: number = 80
): Promise<string> {
  try {
    const supportsAvif = await getAvifSupport()
    if (supportsAvif) {
      return getAvifImageUrl(source, width, height, quality)
    }
  } catch (error) {
    console.warn('Error checking AVIF support:', error)
  }
  
  // Fallback to WebP if AVIF is not supported
  return getOptimizedImageUrl(source, width, height, quality, 'webp')
}

// Export client configuration for debugging
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  hasToken: !!token,
} 