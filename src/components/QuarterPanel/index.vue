<template>
  <div class="el-picker-panel el-date-range-picker socar-date-range-picker">
    <div class="el-picker-panel__body-wrapper">
      <div class="el-picker-panel__body">
        <!-- 左侧 -->
        <div
          class="el-picker-panel__content el-date-range-picker__content is-left"
        >
          <div class="el-date-range-picker__header">
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-left"
              @click="leftPrevYear"
            >
              <el-icon><d-arrow-left /></el-icon>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
        </div>

        <div
          class="el-picker-panel__content el-date-range-picker__content is-right"
        >
          <div class="el-date-range-picker__header">
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-right"
              @click="rightNextYear"
            >
              <el-icon><d-arrow-right /></el-icon>
            </button>
            <div>{{ rightLabel }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useDatePicker } from './hooks/useDatePicker'
import { useDatePanel } from './hooks/useDatePanel'
export default defineComponent({
  name: 'QuarterPanel',
  props: {
    range: {
      type: Array,
      default() {
        return null
      }
    },
    defaultValue: {
      type: Array,
      require: true,
      default() {
        return null
      }
    }
  },
  setup(props) {
    const { leftDate, rightDate } = useDatePicker(props)
    const { leftPrevYear, leftNextYear, leftLabel, rightLabel } = useDatePanel({
      leftDate,
      rightDate
    })

    return {
      leftPrevYear,
      leftNextYear,
      leftLabel,
      rightLabel
    }
  }
})
</script>
