<template>
  <el-radio-group
    v-bind="$props"
    v-model="currentValue"
    @change="handleChange">
    <template v-for="option in options">
    <s-radio v-bind="$props" :label="option[props.value]">{{option[props.label]}}</s-radio>
    </template>
  </el-radio-group>
</template>
<script>
export default{
  props: {
    options:Array,
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        };
      }
    },
    name: String,
    value: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {    
    handleChange(value) {
      this.$emit('change', value);
    }
  }
}	
</script>