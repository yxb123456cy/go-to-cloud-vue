<script setup lang="ts">
defineOptions({
  name: 'QyTextarea',
})

const props = defineProps({

  // 占位符
  placeholder: {
    type: String,
    default: '请选择',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否为错误状态;
  isError: {
    type: Boolean,
    default: false,
  },
  // 输入值的最大长度限制 默认为200
  maxLength: {
    type: Number,
    default: 200,
  },
  // 是否显示字数统计 默认显示
  showWordlimit: {
    type: Boolean,
    default: true,
  },
  // 是否让文本框自适应内容高度 默认确定
  autoSize: {
    type: Boolean,
    default: true,
  },
  // 是否允许清空文本域 默认允许
  allowClear: {
    type: Boolean,
    default: true,
  },
})
const value = defineModel<string>()
defineExpose({})
</script>

<template>
  <div>
    <a-textarea
      v-model="value" :placeholder="props.placeholder" :disabled="props.disabled" :error="props.isError"
      :max-length="props.maxLength" :show-word-limit="props.showWordlimit" :allow-clear="props.allowClear"
      :auto-size="props.autoSize"
    />
  </div>
</template>

<style scoped></style>
