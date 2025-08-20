<script setup lang="ts">
import { ref } from 'vue'
import QyProModal from '../../../components/Qy-Pro-form-item/qy-pro-modal.vue'
import TextareaTest from './textareaTest.vue'

const textareaRef = ref<InstanceType<typeof QyProModal> | null>(null)
const show = ref<boolean>(false)

function handleOk() {
  show.value = false
}

function handleCancel() {
  show.value = false
}
function save() {
  console.warn('保存成功!')
  handleOk()
}
</script>

<template>
  <div>
    <QyProModal
      ref="textareaRef" v-model="show" title="温馨提示" :fullscreen="true" ok-text="提交" cancel-text="返回" @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #header>
        <h3 class="  font-900  text-rose">
          自定义头部
        </h3>
      </template>

      <TextareaTest />

      <template #footer>
        <a-button @click="show = false">
          关闭
        </a-button>
        <a-button type="primary" @click="save">
          保存
        </a-button>
      </template>
    </QyProModal>
    <a-button @click="show = true">
      打开Modal
    </a-button>
  </div>
</template>

<style scoped></style>
