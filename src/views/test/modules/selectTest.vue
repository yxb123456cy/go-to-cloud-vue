<script setup lang="ts">
import type { SelectOption } from '../../../components/Qy-Pro-form-item/qy-pro-select.vue'
import { ref } from 'vue'
import QyProSelect from '../../../components/Qy-Pro-form-item/qy-pro-select.vue'

const fruits: SelectOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橘子', value: 'orange', disabled: true },
  { label: '西瓜', value: 'watermelon' },
]

const singleSelectRef = ref<InstanceType<typeof QyProSelect> | null>(null)
const multiSelectRef = ref<InstanceType<typeof QyProSelect> | null>(null)

function getSingleValue() {
  console.warn('单选值:', singleSelectRef.value?.getSelectedValue())
}

function getMultiValue() {
  console.warn('多选值:', multiSelectRef.value?.getSelectedValue())
}
</script>

<template>
  <div style="padding: 20px">
    <h3>单选示例</h3>
    <QyProSelect ref="singleSelectRef" :options="fruits" default-value="apple" placeholder="请选择水果" />

    <a-button type="primary" style="margin-top: 10px" @click="getSingleValue">
      获取单选值
    </a-button>

    <h3 style="margin-top: 30px">
      多选示例
    </h3>
    <QyProSelect ref="multiSelectRef" :options="fruits" multiple default-value="banana" placeholder="请选择多个水果" />

    <a-button type="primary" style="margin-top: 10px" @click="getMultiValue">
      获取多选值
    </a-button>
  </div>
</template>
