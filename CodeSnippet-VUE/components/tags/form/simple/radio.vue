<template>
  <el-radio
    v-bind="$props"
  >
    <slot></slot>
    <template v-if="!$slots.default">{{label}}</template>
  </el-radio>
</template>
<script>
export default{
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String
  }
}	
</script>