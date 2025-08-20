import type { ExtractPropTypes, ExtractPublicPropTypes, PropType } from 'vue'

// props 定义
export const ProTableProps = {
  submitMsg: { type: String, default: '查询' }, // 按钮文本
  isSearch: { type: Boolean, default: false }, // 是否启用查询
  isHeaderBtns: { type: Boolean, default: true }, // 是否启用表头上方按钮
  isCallBack: { type: Boolean, default: false }, // 刷新后是否要回调
  selectVisible: { type: Boolean, default: false }, // 是否多选
  indexVisible: { type: Boolean, default: true }, // 是否显示序号
  indexWidth: { type: String, default: '64px' }, // 序号列宽度;
  queryColumns: { type: Array as PropType<any[]>, default: () => [] }, // 查询表单
  columns: { type: Array as PropType<any[]>, default: () => [] }, // 定义列
  initParam: { type: Object as PropType<Record<string, any>>, default: () => ({}) }, // 筛选默认值
  requestApi: { type: Object as PropType<(params: any) => Promise<any> | null>, default: null }, // 列表数据接口
  isPagination: { type: Boolean, default: true }, // 是否显示分页
  formatRequest: Function as PropType<(res: any) => any>, // 格式化列表数据
  formatQuery: Function as PropType<(query: any) => any>, // 格式化查询数据
  isOnePage: { type: Boolean, default: false }, // 只有一页的时候是否显示分页
  rowKey: { type: String, default: '' }, // 列表行数据 key
  reserveSelection: { type: Boolean, default: true }, // 是否保留选中
  height: { type: String, default: '' }, // 列表高度
  maxHeight: { type: String, default: null }, // 列表最大高度
  listField: { type: String, default: 'records' }, // 列表数据字段
  defaultPageSize: { type: Number, default: 20 }, // 默认分页大小
  autoResize: { type: Boolean, default: true }, // 是否自动计算列表高度
  extraHeight: { type: Number, default: 0 }, // 列表自动高度的额外高度
  hasBorder: { type: Boolean, default: false }, // 是否显示边框
} as const
// 2. 内部 props 类型 (setup)
export type ProTableInnerProps = ExtractPropTypes<typeof ProTableProps>

// 3. 外部 props 类型 (父组件使用时的提示)
export type ProTablePublicProps = ExtractPublicPropTypes<typeof ProTableProps>
