<template>
  <div class="specification-display">
    <h2 class="section-title" v-if="title">{{ title }}</h2>
    <div class="spec-grid">
      <div v-for="spec in specs" :key="spec.keyId" class="spec-item">
        <span class="spec-name">{{ spec.name }}:</span>
        <span class="spec-value">{{ spec.value }}{{ spec.unit || '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Specification } from '@/model'

interface Props {
  specs: Specification[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Specifications'
})

// Debug logging
console.log('SpecificationDisplay received specs:', props.specs)
console.log('SpecificationDisplay specs length:', props.specs.length)
</script>

<style scoped>
.specification-display {
  margin-top: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.spec-grid {
  display: block;
  margin-top: 20px;
}

.spec-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.spec-item:hover {
  background-color: #fafafa;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-name {
  font-weight: 500;
  color: #6c757d;
  min-width: 100px;
  margin-right: 12px;
}

.spec-value {
  color: #212529;
  font-weight: 600;
}

/* RWD */
@media (max-width: 768px) {
  .spec-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .spec-item {
    padding: 10px 12px;
  flex-direction: column;
    align-items: flex-start;
  }
  
  .spec-name {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 4px;
  }
}
</style>
