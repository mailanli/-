<template>
  <el-switch
    v-bind="$props"
    v-model="currentValue"
  >
  </el-switch>
</template>
<script>
export default{
  props: {
    value: {
      type: [Boolean, String, Number],
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 0
    },
    onIconClass: {
      type: String,
      default: ''
    },
    offIconClass: {
      type: String,
      default: ''
    },
    onText: {
      type: String,
      default: 'ON'
    },
    offText: {
      type: String,
      default: 'OFF'
    },
    onColor: {
      type: String,
      default: ''
    },
    offColor: {
      type: String,
      default: ''
    },
    onValue: {
      type: [Boolean, String, Number],
      default: 1
    },
    offValue: {
      type: [Boolean, String, Number],
      default: 0
    },
    name: {
      type: String,
      default: ''
    }
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
    handleChange(event) {
      this.$emit('change', event.currentTarget.checked ? this.onValue : this.offValue);
    }
  }
}	
</script>