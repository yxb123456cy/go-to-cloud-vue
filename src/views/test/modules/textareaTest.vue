<script setup lang="ts">
import { ref } from 'vue'
import QyTextarea from '../../../components/Qy-Pro-form-item/qy-textarea.vue'

const textAreaValue = ref<string>('')

const textareaRef = ref<InstanceType<typeof QyTextarea> | null>(null)
</script>

<template>
  <div>
    <QyTextarea ref="textareaRef" v-model="textAreaValue" />
    <a-button>文本域内容{{ textAreaValue }}</a-button>
  </div>
</template>

<style scoped></style>
