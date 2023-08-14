<template>
  <div class="date-picker-panel-wrapper">
    <QuarterPanel :range="dateRange" :default-value="defaultValue" />
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import QuarterPanel from './components/QuarterPanel/index.vue'
export default defineComponent({
  components: {
    QuarterPanel
  },
  setup() {
    const dateRange = ['2008', '2023']
    const defaultValue = ref(['2020-01', '2022-01'])
    return {
      dateRange,
      defaultValue
    }
  }
})
</script>
<style>
.date-picker-panel-wrapper {
  width: 600px;
}
</style>
