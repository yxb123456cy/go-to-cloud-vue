import type { ProTableInnerProps } from './useProp'
import { computed, ref } from 'vue'

export default function useSelection(props: Partial<ProTableInnerProps>) {
  const isSelected = ref<boolean>(false)

  // 选中的数据列表
  const selectedList = ref<any[]>([])
  // 当前选中的所有ids(数组)
  const selectedListIds = computed(() => {
    return selectedList.value.map(i => i[props.rowKey as string])
  })

  // 获取行数据的 Key,用来优化 Table 的渲染;在使用跨页多选时,该属性是必填的
  const getRowKeys = (row: any) => row.id

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: any[]) => {
    rowArr.length === 0 ? (isSelected.value = false) : (isSelected.value = true)
    selectedList.value = rowArr
  }

  return {
    isSelected,
    selectedList,
    selectedListIds,
    getRowKeys,
    selectionChange,
  }
}
