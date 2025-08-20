<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

defineOptions({
  name: 'QyProCheckboxGroup',
})
/**
 * Props
 */
const props = defineProps({
  // 默认值;
  defaultValue: {
    type: Array as PropType<Array<string | number | boolean>>,
    default: () => [],
  },
  // 选项
  options: {
    type: Array as PropType<CheckboxOption[]>,
    default: () => [],
  },
  // 排列方向
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 最多可选 默认为Number.MAX_VALUE
  maxCount: {
    type: Number,
    default: Number.MAX_VALUE,
  },
})
const checkboxgroupValue = ref([])
export interface CheckboxOption {
  label: string
  disabled?: boolean
  indeterminate?: boolean
  value: string | number | boolean
}
// 暴露给父组件的属性
defineExpose({
  checkboxgroupValue,
})
</script>

<template>
  <div>
    <a-checkbox-group
      v-model="checkboxgroupValue" :direction="props.direction" :disabled="props.disabled"
      :max="props.maxCount"
    >
      <a-checkbox
        v-for="item in props.options" :key="item.value + item.label" :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>

<style scoped></style>
