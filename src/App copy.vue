<template>
  <div class="socar-layout-page socar-leitianpeng-test-page">
    <div class="socar-leitianpeng-data-picker-panel">
      <div class="date-panel">
        <DateRangePanel
          :default-value="defaultMonthValue"
          :range="range"
          unit="month"
          @pick="handelMonthChange"
          @shortcut-change="shortClick"
        />
        <!-- <DateSliderbar /> -->
      </div>
      <div class="date-panel">
        <DateRangePanel
          :default-value="defaultQuarter"
          :range="range"
          unit="quarter"
          @shortcut-change="shortClick"
          @pick="handelQuarterChange"
        />
      </div>
      <div class="date-panel">
        <YearRangePanel
          :default-value="defaultYear"
          :range="range"
          unit="year"
          @shortcut-change="shortClick"
          @pick="handelYearChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import dayjs from 'dayjs'
import DateRangePanel from './date-picker-panel/DateRangePanel.vue'
import YearRangePanel from './date-picker-panel//YearRangePanel.vue'

export default defineComponent({
  components: {
    DateRangePanel,
    YearRangePanel
  },
  setup() {
    const range = ['2008-04', '2024-02']
    const defaultMonthValue = ref(['2022-01', '2023-10'])
    const defaultQuarter = ref(['2021-01', '2022-10'])
    const defaultYear = ref(['2020-01', '2023-10'])

    const handelQuarterChange = (value) => {
      console.log('季度选择器', value)
      defaultQuarter.value = value
    }
    const handelYearChange = (value) => {
      console.log('年份选择器', value)
      defaultYear.value = value
    }

    const handelMonthChange = (value) => {
      console.log('月份选择器', value)
      defaultMonthValue.value = value
    }

    const shortcutMap = {
      quarter: [
        {
          text: '最近4季度',
          value: 4
        },
        {
          text: '最近8季度',
          value: 8
        },
        {
          text: '最近12季度',
          value: 12
        },
        {
          text: '最近24季度',
          value: 24
        },
        {
          text: '全部',
          value: 'all'
        }
      ],
      month: [
        {
          text: '最近12个月',
          value: 12
        },
        {
          text: '最近36个月',
          value: 36
        },
        {
          text: '最近60个月',
          value: 60
        },
        {
          text: '最近90个月',
          value: 90
        },
        {
          text: '全部',
          value: 'all'
        }
      ],
      year: [
        {
          text: '最近1年',
          value: 3
        },
        {
          text: '最近3年',
          value: 3
        },
        {
          text: '最近5年',
          value: 5
        },
        {
          text: '最近10年',
          value: 10
        },
        {
          text: '全部',
          value: 'all'
        }
      ]
    }

    const shortClick = (event, unit) => {
      const { value } = event
      const [start, end] = range
      const endDate = dayjs(end)
      const startDate =
        value === 'all' ? dayjs(start) : endDate.subtract(value, unit)
      console.log(startDate, endDate)
    }
    return {
      range,
      shortcutMap,
      handelQuarterChange,
      handelYearChange,
      handelMonthChange,
      defaultMonthValue,
      defaultQuarter,
      shortClick,
      defaultYear
    }
  }
})
</script>
<style lang="scss"></style>
