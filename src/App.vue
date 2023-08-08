<template>
  <div>
    <DateRangePanel
      :default-value="defaultValue"
      :range="range"
      @pick="handelChange"
    />
    <YearRangePanel
      :default-value="defaultValue"
      :range="range"
      @pick="handelChange"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import DateRangePanel from './date-picker-panel/DateRangePanel.vue'
import YearRangePanel from './date-picker-panel/YearRangePanel.vue'

export default {
  name: 'App',
  components: {
    DateRangePanel,
    YearRangePanel
  },
  setup() {
    const range = ['2008-04', '2024-02']
    const defaultValue = ref(['2020-01', '2025-10'])

    const handleClick = () => {
      defaultValue.value = ['2018-09', '2023-02']
    }

    const handelChange = (value) => {
      console.log(value.map((item) => item.toDate()))
    }
    return {
      range,
      handleClick,
      handelChange,
      defaultValue
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
