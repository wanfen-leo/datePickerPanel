<template>
  <div
    class="el-picker-panel el-date-picker socar-date-range-picker year-range"
  >
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
        <div class="el-date-picker__header el-date-picker__header--bordered">
          <span class="el-date-picker__prev-btn">
            <button
              type="button"
              class="d-arrow-left el-picker-panel__icon-btn"
              @click="moveByYear(false)"
            >
              <el-icon><d-arrow-left /></el-icon>
            </button>
          </span>
          <span
            role="button"
            class="el-date-picker__header-label"
            aria-live="polite"
            tabindex="0"
            >{{ yearLabel }}</span
          >
          <span class="el-date-picker__next-btn">
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-right"
              @click="moveByYear(true)"
            >
              <el-icon><d-arrow-right /></el-icon>
            </button>
          </span>
        </div>
        <div class="el-picker-panel__content">
          <BasicYearTable
            :min-date="minDate"
            :max-date="maxDate"
            :date="innerDate"
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
import { computed, defineComponent, ref } from 'vue'
import _ from 'lodash'
import { useRangePicker } from './useRangePicker'
import BasicYearTable from './BasicYearTable.vue'
export default defineComponent({
  name: 'YearRangePanel',
  components: {
    BasicYearTable
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
    },
    unit: {
      type: String,
      default: 'year'
    }
  },
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
      handleChangeRange,
      handleShortcutClick
    } = useRangePicker(props)

    const innerDate = ref(_.cloneDeep(minDate.value))

    const year = computed(() => {
      return innerDate.value.year()
    })
    const yearLabel = computed(() => {
      const startYear = Math.floor(year.value / 10) * 10
      return `${startYear} - ${startYear + 9}`
    })

    const moveByYear = (forward) => {
      const currentDate = innerDate.value
      const action = forward ? 'add' : 'subtract'
      innerDate.value = currentDate[action](10, 'year')
    }
    return {
      minDate,
      maxDate,
      leftDate,
      rightDate,
      innerDate,
      rangeState,
      yearLabel,
      moveByYear,
      disabledDate,
      handleRangePick,
      onSelect,
      handleChangeRange,
      handleShortcutClick
    }
  }
})
</script>
<style lang="scss"></style>
