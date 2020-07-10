<template>
  <el-checkbox
    v-bind="$props"
  >
    <slot></slot>
    <template v-if="!$slots.default">{{label}}</template>
  </el-checkbox>
</template>
<script>
export default{
  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number]
  }
}	
</script>