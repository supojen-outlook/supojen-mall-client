<template>
  <div class="category-filter">
    <!-- 面包屑导航 - 只显示全部 -->
    <div v-if="breadcrumb.length > 0" class="breadcrumb">
      <span 
        class="breadcrumb-item" 
        @click="resetToRoot()"
      >
        {{ breadcrumb[0]?.name }}
      </span>
    </div>

    <!-- 分类标签 -->
    <div class="category-tags">
      <button
        v-for="category in currentCategories"
        :key="category.id"
        class="category-tag"
        :class="{ 
          'is-leaf': category.isLeaf,
          'is-parent': !category.isLeaf,
          'active': selectedCategoryId === category.id
        }"
        @click="handleCategoryClick(category)"
      >
        {{ category.name }}
        <span v-if="!category.isLeaf" class="arrow">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Category } from '@/model'
import { getCategories } from '@/services/Category'

interface Props {
  // 初始选中的分类ID（可选）
  initialCategoryId?: number
  // 模式：'navigate'（跳转模式，用于首页）或 'filter'（筛选模式，用于搜索页）
  mode?: 'navigate' | 'filter'
}

const props = withDefaults(defineProps<Props>(), {
  initialCategoryId: undefined,
  mode: 'filter'
})

const emit = defineEmits<{
  // 选择叶节点分类时触发
  select: [categoryId: number, categoryName: string]
  // 进入子分类层级时触发（用于面包屑更新）
  navigate: [breadcrumb: Category[]]
}>()

// 所有分类数据
const allCategories = ref<Category[]>([])
const loading = ref(false)

// 面包屑路径
const breadcrumb = ref<Category[]>([])

// 当前选中的分类ID
const selectedCategoryId = ref<number | undefined>(props.initialCategoryId)

// 获取分类数据
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await getCategories({ size: 1000, status: 'active' })
    allCategories.value = response.list || []
    
    // 如果有初始分类ID，构建面包屑
    if (props.initialCategoryId) {
      buildBreadcrumb(props.initialCategoryId)
    }
  } catch (err) {
    console.error('加载分类失败:', err)
  } finally {
    loading.value = false
  }
}

// 构建面包屑路径
const buildBreadcrumb = (categoryId: number) => {
  const path: Category[] = []
  let current = allCategories.value.find(c => c.id === categoryId)
  
  while (current) {
    path.unshift(current)
    if (current.parentId) {
      current = allCategories.value.find(c => c.id === current!.parentId)
    } else {
      break
    }
  }
  
  breadcrumb.value = path
  selectedCategoryId.value = categoryId
}

// 当前层级的分类列表
const currentCategories = computed(() => {
  // 如果有面包屑，显示当前层级的子分类
  if (breadcrumb.value.length > 0) {
    const currentParent = breadcrumb.value[breadcrumb.value.length - 1]
    // 如果当前选中的是叶节点，显示同级分类
    if (currentParent.isLeaf) {
      const parentId = currentParent.parentId
      return allCategories.value.filter(c => 
        (parentId ? c.parentId === parentId : !c.parentId) && c.status === 'active'
      )
    }
    // 显示当前父分类的子分类
    return allCategories.value.filter(c => 
      c.parentId === currentParent.id && c.status === 'active'
    )
  }
  
  // 默认显示根分类（无 parentId 的分类）
  return allCategories.value.filter(c => !c.parentId && c.status === 'active')
})

// 处理分类点击
const handleCategoryClick = (category: Category) => {
  selectedCategoryId.value = category.id
  
  if (category.isLeaf) {
    // 叶节点：触发搜索
    emit('select', category.id, category.name)
  } else {
    // 非叶节点：检查是否在面包屑中
    const categoryIndex = breadcrumb.value.findIndex(item => item.id === category.id)
    
    if (categoryIndex !== -1) {
      // 在面包屑中：縮回到該層級
      breadcrumb.value = breadcrumb.value.slice(0, categoryIndex)
    } else {
      // 不在面包屑中：進入子分類層級
      breadcrumb.value.push(category)
    }
    emit('navigate', [...breadcrumb.value])
  }
}


const resetToRoot = () => {
  breadcrumb.value = []
  selectedCategoryId.value = undefined
  emit('navigate', [])
}

onMounted(() => {
  loadCategories()
})

// 监听 initialCategoryId 和 allCategories 变化，重新构建面包屑
watch([() => props.initialCategoryId, () => allCategories.value.length], ([newId, categoriesLength]) => {
  if (!categoriesLength) return // 分類還沒載入，不處理
  
  if (newId) {
    selectedCategoryId.value = newId
    // 重新构建面包屑路径
    const path: Category[] = []
    let current = allCategories.value.find(c => c.id === newId)
    while (current) {
      path.unshift(current)
      current = current.parentId 
        ? allCategories.value.find(c => c.id === current!.parentId)
        : undefined
    }
    breadcrumb.value = path.slice(0, -1) // 不包含当前选中的分类
  } else {
    selectedCategoryId.value = undefined
    breadcrumb.value = []
  }
}, { immediate: true })
</script>

<style scoped>
.category-filter {
  padding: 16px 0;
}

/* 面包屑 - 高对比度深色文字 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #333333;
  font-weight: 400;
}

.breadcrumb-item {
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
}

.breadcrumb-item:hover {
  color: var(--el-color-primary);
  background: rgba(179, 59, 21, 0.08);
}

.breadcrumb-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
  background: rgba(179, 59, 21, 0.12);
  cursor: default;
}

.separator {
  margin: 0 4px;
  color: #999999;
  font-weight: 300;
}

/* 分类标签 - 无 border pill 风格 */
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 18px;
  border-radius: 24px;
  border: none;
  background: #f5f5f5;
  color: #444444;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tag:hover {
  background: #e8e8e8;
  color: var(--el-color-primary);
  transform: translateY(-1px);
}

.category-tag.active {
  background: var(--el-color-primary);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(179, 59, 21, 0.25);
}

.category-tag.is-parent {
  padding-right: 14px;
}

.category-tag.is-parent:hover {
  background: #e0e0e0;
}

.category-tag.is-parent.active:hover {
  background: var(--el-color-primary);
}

.arrow {
  font-size: 14px;
  margin-left: 4px;
  opacity: 0.6;
}
</style>
