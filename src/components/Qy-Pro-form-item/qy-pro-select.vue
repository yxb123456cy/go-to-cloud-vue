<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

defineOptions({
  name: 'QyProSelect',
})
const props = defineProps({
  // 默认值
  defaultValue: {
    type: Array as PropType<string | Array<string | number | boolean | Record<string, unknown>>>,
    default: () => [],
  },
  // 选项
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  // 禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  allowClear: {
    type: Boolean,
    default: true,
  },

  multiple: {
    type: Boolean,
    default: false,
  },
  // 尺寸
  size: {
    type: String as PropType<'mini' | 'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  limit: {
    type: Number,
    default: 0,
  },
})
const selectedValue = ref(props.defaultValue)

export interface SelectOption {
  label: string
  disabled?: boolean
  value: string | number | boolean
  index?: number
}

const getSelectedValue = () => selectedValue.value

defineExpose({
  getSelectedValue,
})
</script>

<template>
  <div>
    <a-select
      v-model="selectedValue" :default-value="props.defaultValue" :disabled="props.disabled"
      :placeholder="props.placeholder" :allow-clear="props.allowClear" :size="props.size"
      :bordered="props.bordered" :multiple="props.multiple" :limit="props.limit"
    >
      <a-option
        v-for="item in props.options" :key="item.value" :disabled="item.disabled" :index="item.index"
        :value="item.value"
      >
        {{ item.label }}
      </a-option>
    </a-select>
  </div>
</template>

<style scoped></style>
