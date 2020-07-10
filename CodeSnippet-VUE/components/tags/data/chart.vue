<template>
  <canvas class="chartjs" @resetChart></canvas>
</template>

<script>
import {Line, Bar, Pie} from 'vue-chartjs'
const types = ['line', 'bar', 'radar', 'polarArea', 'pie', 'doughnut', 'bubble']
export default {
  props: {
    width: Number,
    height: Number,
    type: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    this.chart = new Chart(this.$el, {
      type: this.type,
      data: this.data,
      options: this.options
    })
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    resetChart () {
      this.$nextTick(() => {
        this.chart.destroy();
        this.chart = new Chart(this.$el, {
          type: this.type,
          data: this.data,
          options: this.options
        })
      })
    }
  },
  watch: {
    type () {
      this.resetChart()
    },
    data () {
      this.resetChart()
      // this.chart.update()
    },
    options () {
      this.resetChart()
    }
  }
}
</script>