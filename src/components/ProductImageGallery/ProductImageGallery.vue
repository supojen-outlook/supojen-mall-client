<template>
  <div class="product-image-gallery">
    <div class="main-image-container" @click="handleMainImageClick">
      <img 
        :src="thumbnails[currentImage]" 
        :alt="productName"
        @error="handleImageError"
        class="main-image"
      >
    </div>
    <div class="thumbnails" v-if="thumbnails.length > 1">
      <img 
        v-for="(thumbnail, index) in thumbnails" 
        :key="index"
        :src="thumbnail"
        :alt="`${productName} - ${index + 1}`"
        @click="setCurrentImage(index)"
        @error="handleThumbnailError"
        :class="['thumbnail', { active: index === currentImage }]"
      >
    </div>
    
    <!-- Image Preview Dialog -->
    <el-image-viewer 
      v-if="viewerVisible"
      :url-list="thumbnails"
      :initial-index="currentImage"
      @close="closeViewer"
      :z-index="2000"
      :preview-teleported="true"
      fit="contain"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElImageViewer } from 'element-plus'

interface Props {
  mainImage?: string | null
  detailImages?: string[]
  productName: string
}

const props = withDefaults(defineProps<Props>(), {
  mainImage: null,
  detailImages: () => []
})

const currentImage = ref(0)
const viewerVisible = ref(false)

// Generate thumbnails array (main image + detail images)
const thumbnails = computed(() => {
  const images = [...props.detailImages]
  if (props.mainImage && !images.includes(props.mainImage)) {
    images.unshift(props.mainImage)
  }
  return images
})

// Set initial image
const initializeImage = () => {
  if (thumbnails.value.length > 0) {
    currentImage.value = 0
  }
}

// Set current image
const setCurrentImage = (index: number) => {
  currentImage.value = index
}

// Close viewer
const closeViewer = () => {
  viewerVisible.value = false
}

// Handle main image click - open viewer
const handleMainImageClick = () => {
  if (thumbnails.value.length > 0) {
    viewerVisible.value = true
  }
}

// Handle main image error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/600?text=No+Image'
}

// Handle thumbnail error
const handleThumbnailError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/100?text=No+Image'
}

// Initialize on mount
initializeImage()
</script>

<style scoped>
.product-image-gallery {
  width: 100%;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 1/1;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  cursor: pointer;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: #e6a23c;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #B33B15;
}

/* RWD */
@media (max-width: 768px) {
  .main-image-container {
    aspect-ratio: 1/1;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
  }
}
</style>
