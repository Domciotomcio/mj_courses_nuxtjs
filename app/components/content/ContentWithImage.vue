<script setup lang="ts">
interface Props {
  imageSrc?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  imageSize?: 'small' | 'medium' | 'large'
  sticky?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  imagePosition: 'right',
  imageSize: 'medium',
  sticky: true
})

const sizeClasses = {
  small: 'lg:w-1/4',
  medium: 'lg:w-1/3',
  large: 'lg:w-1/2'
}

const contentSizeClasses = {
  small: 'lg:w-3/4',
  medium: 'lg:w-2/3',
  large: 'lg:w-1/2'
}
</script>

<template>
    <div class="flex flex-col gap-8 items-start" :class="imagePosition === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'">
      <!-- Image Section - Shows first on mobile -->
      <div v-if="imageSrc" class="w-full flex-shrink-0 order-first" :class="sizeClasses[imageSize]">
        <div :class="sticky ? 'lg:sticky lg:top-4' : ''">
          <img 
            :src="imageSrc" 
            :alt="imageAlt || 'Content image'" 
            class="w-full rounded-2xl shadow-xl object-cover aspect-square hover:shadow-2xl transition-shadow duration-300"
          />
        </div>
      </div>

      <!-- Content Section - Shows second on mobile -->
      <div class="w-full prose dark:prose-invert max-w-none prose-p:mb-6" :class="contentSizeClasses[imageSize]">
        <slot />
      </div>
    </div>
</template>
