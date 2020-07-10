<template>
  <el-input-number
    v-bind="$props"
    @input="handleInput"
    @change="handleChange"
  ></el-input-number>
</template>
<script>
export default{
	props: {
      step: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      value: {
        default: 0
      },
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: true
      }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },  
    handleChange(value) {
      this.$emit('change', value);
    }
  }
}	
</script>