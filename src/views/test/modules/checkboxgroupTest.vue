<script setup lang="ts">
import type { CheckboxOption } from '../../../components/Qy-Pro-form-item/qy-pro-checkbox-group.vue'
import { ref } from 'vue'

const maxCount: number = 2
const CheckboxGroupRef = ref()
const fruits: CheckboxOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橘子', value: 'orange' },
]
function logCheckboxGroupValue() {
  console.warn('value:', CheckboxGroupRef.value.checkboxgroupValue)
}
</script>

<template>
  <div>
    <QyProCheckboxGroup ref="CheckboxGroupRef" :options="fruits" :max-count="maxCount" />
    <AButton type="primary" @click="logCheckboxGroupValue">
      打印Value
    </AButton>
  </div>
</template>

<style scoped></style>
