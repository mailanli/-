<template>
  <el-color-picker
    v-bind="$props"
    v-model="currentValue"
  ></el-color-picker>
</template>
<script>
export default{
  props: {
    value: {
      type: String
    },
    showAlpha: {
      type: Boolean
    },
    colorFormat: {
      type: String
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);

        this.$emit('change', val);
      }
    }
  }
}	
</script>