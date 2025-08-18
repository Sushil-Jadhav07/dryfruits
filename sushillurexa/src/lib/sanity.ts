import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Only needed for write operations
})

// Image URL builder for Sanity images
export const imageBuilder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return imageBuilder.image(source)
}

// Helper function to get image URL with specific dimensions
export function getImageUrl(source: any, width: number, height?: number) {
  return urlFor(source)
    .width(width)
    .height(height || width)
    .url()
}

// Helper function to get responsive image URLs
export function getResponsiveImageUrls(source: any, sizes: number[]) {
  return sizes.map(size => ({
    size,
    url: getImageUrl(source, size)
  }))
} 