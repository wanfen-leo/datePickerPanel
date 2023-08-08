<template>
  <div class="el-picker-panel el-date-range-picker">
    <div class="el-picker-panel__body-wrapper">
      <div v-if="shortcuts" class="el-picker-panel__sidebar">
        <button
          v-for="(shortcut, key) in shortcuts"
          :key="key"
          type="button"
          class="el-picker-panel__shortcut"
          @click="handleShortcutClick(shortcut)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <div class="el-picker-panel__body">
        <!-- 左侧 -->
        <div
          class="el-picker-panel__content el-date-range-picker__content is-left"
        >
          <div class="el-date-range-picker__header">
            <!-- is-disabled 超出范围禁用？ -->
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-left"
              @click="leftPrevYear"
            >
              <el-icon><d-arrow-left /></el-icon>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
          <!-- <QuarterTable
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :date="leftDate"
            :disabled-date="disabledDate"
            @pick="handleRangePick"
            @select="onSelect"
            @changerange="handleChangeRange"
          /> -->
          <BasicMonthTable
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :date="leftDate"
            :disabled-date="disabledDate"
            @pick="handleRangePick"
            @select="onSelect"
            @changerange="handleChangeRange"
          />
        </div>
        <!-- 右侧 -->
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
          <!-- <QuarterTable
            :min-date="minDate"
            :max-date="maxDate"
            :date="rightDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @pick="handleRangePick"
            @select="onSelect"
            @changerange="handleChangeRange"
          /> -->
          <BasicMonthTable
            :min-date="minDate"
            :max-date="maxDate"
            :date="rightDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @pick="handleRangePick"
            @select="onSelect"
            @changerange="handleChangeRange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { useQuarterRangeHeader } from './useQuarterPanel'
import { useRangePicker } from './useRangePicker'
// import BasicQuarterTable from './BasicQuarterTable.vue'
import BasicMonthTable from './BasicMonthTable.vue'
// isSameAfter isSameBefort
dayjs.extend(quarterOfYear)

export default defineComponent({
  name: 'DateRangePanel',
  components: {
    // QuarterTable,
    BasicMonthTable
    // BasicQuarterTable
  },
  props: {
    defaultValue: {
      type: Array,
      default() {
        return null
      },
      require: true
    },
    range: {
      type: Array,
      default() {
        return null
      }
    },
    shortcuts: {
      type: Array,
      default() {
        return null
      }
    }
  },
  emits: ['pick'],
  setup(props) {
    const {
      minDate,
      maxDate,
      leftDate,
      rightDate,
      rangeState,
      disabledDate,
      handleRangePick,
      onSelect,
      handleChangeRange
    } = useRangePicker(props)

    const {
      leftPrevYear,
      rightNextYear,
      leftNextYear,
      rightPrevYear,
      leftLabel,
      rightLabel
    } = useQuarterRangeHeader({
      leftDate,
      rightDate
    })

    return {
      minDate,
      maxDate,
      leftLabel,
      rightLabel,
      leftPrevYear,
      rightNextYear,
      leftNextYear,
      rightPrevYear,
      leftDate,
      rightDate,
      rangeState,
      disabledDate,
      onSelect,
      handleRangePick,
      handleChangeRange
    }
  }
})
</script>
