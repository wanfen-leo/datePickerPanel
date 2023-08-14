import { watch, ref } from 'vue'
import dayjs from 'dayjs'
// 将计算时间的相关操作单独抽一个hooks 之后做年份的时候可以复用 季度，年份时间单位不同而已
export const useDatePicker = (props) => {
  // const emit = defineEmits()
  // 默认值起始时间
  const minDate = ref()
  // 默认值结束时间
  const maxDate = ref()
  // 左侧面板时间 ps：面板时间与默认值时间无关 只是用于面板title显示 不需要过于纠结
  const leftDate = ref()
  // 右侧面板时间
  const rightDate = ref()

  const restoreDefault = () => {
    // 将默认转为dayjs时间对象
    const [start, end] = props.defaultValue.map((item) => dayjs(item))
    minDate.value = start
    maxDate.value = end
    leftDate.value = start
    rightDate.value = start.add(1, 'year')
  }

  watch(
    () => props.defaultValue,
    (value) => {
      if (value) {
        restoreDefault()
      }
    },
    {
      immediate: true
    }
  )

  return {
    minDate,
    maxDate,
    leftDate,
    rightDate
  }
}
