<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'QyProModal',
})

const props = withDefaults(defineProps<{
  modelValue?: boolean
  width?: number | string
  title?: string
  titleAlign?: 'start' | 'center'
  maskClosable?: boolean
  hideCancel?: boolean
  closable?: boolean
  okText?: string
  cancelText?: string
  okLoading?: boolean
  escToClose?: boolean
  fullscreen?: boolean
  hideTitle?: boolean
}>(), {
  titleAlign: 'center',
  closable: true,
  maskClosable: true,
  hideCancel: false,
  okLoading: false,
  fullscreen: false,
  hideTitle: false,
  escToClose: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

// 内部控制
const visible = ref(props.modelValue ?? false)

watch(() => props.modelValue, (val) => {
  visible.value = val ?? false
})

function handleOk() {
  emit('ok')
}
function handleCancel() {
  emit('cancel')
  close()
}
function close() {
  emit('update:modelValue', false)
  visible.value = false
  emit('close')
}
</script>

<template>
  <a-modal
    v-model:visible="visible" :title="hideTitle ? undefined : title" :width="width" :closable="closable"
    :mask-closable="maskClosable" :ok-loading="okLoading" :esc-to-close="escToClose" :fullscreen="fullscreen"
    unmount-on-close @ok="handleOk" @cancel="handleCancel" @close="close"
  >
    <!-- 自定义头部 -->
    <template v-if="!hideTitle" #title>
      <slot name="header">
        <div :style="{ textAlign: titleAlign }">
          {{ title }}
        </div>
      </slot>
    </template>

    <!-- 内容插槽 -->
    <slot>
      <div>默认内容</div>
    </slot>

    <!-- 底部插槽 -->
    <template #footer>
      <slot name="footer">
        <a-button v-if="!hideCancel" @click="handleCancel">
          {{ cancelText || '取消' }}
        </a-button>
        <a-button type="primary" :loading="okLoading" @click="handleOk">
          {{ okText || '确定' }}
        </a-button>
      </slot>
    </template>
  </a-modal>
</template>
