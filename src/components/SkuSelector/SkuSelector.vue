<template>
  <div class="sku-selector" v-if="skus.length > 1">
    <h3 class="selector-title">選取規格:</h3>
    <el-radio-group v-model="selectedSkuId" @change="handleSkuChange">
      <el-radio 
        v-for="sku in skus" 
        :key="sku.id"
        :value="sku.id"
        class="sku-option"
      >
        {{ sku.name }}
      </el-radio>
    </el-radio-group>
    
    <div class="selected-specs" v-if="currentSku && currentSku.specs && currentSku.specs.length > 0">
      <div class="spec-list">
        <div v-for="spec in currentSku.specs" :key="spec.keyId" class="spec-item">
          <span class="spec-name">{{ spec.name }}</span>
          <span class="spec-separator">:</span>
          <span class="spec-value">{{ spec.value }}{{ spec.unit || '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Sku } from '@/model'

interface Props {
  skus: Sku[]
  modelValue?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const selectedSkuId = ref(props.modelValue)

// Find current SKU based on selection
const currentSku = computed(() => {
  return props.skus.find(sku => sku.id === selectedSkuId.value) || null
})

// Handle SKU change
const handleSkuChange = (value: number | null) => {
  selectedSkuId.value = value
  emit('update:modelValue', value)
}

// Watch for external model value changes
watch(() => props.modelValue, (newValue) => {
  selectedSkuId.value = newValue
})
</script>

<style scoped>
.sku-selector {
  margin-bottom: 24px;
}

.selector-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.sku-option {
  display: block;
  margin-bottom: 8px;
  padding: 8px 0;
}

.selected-specs {
  margin-top: 16px;
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.spec-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex: 0 0 auto;
  min-width: fit-content;
}

.spec-name {
  font-weight: 500;
  color: var(--el-text-color-regular);
  font-size: 13px;
}

.spec-separator {
  color: var(--el-text-color-regular);
  font-size: 13px;
  margin: 0 2px;
}

.spec-value {
  color: var(--el-text-color-primary);
  font-weight: 600;
  font-size: 14px;
}

/* RWD */
@media (max-width: 768px) {
  .selector-title {
    font-size: 14px;
  }
  
  .selected-specs {
    padding: 10px;
  }
  
  .spec-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .spec-name {
    min-width: auto;
  }
}
</style>
