<template>
  <el-tooltip
    ref="tooltip"
    :disabled="multiple || !isOverflow"
    :content="getToolTip()"
    effect="dark"
    placement="top"
  >
    <el-select
      class="e-select"
      ref="iSelect"
      v-model="selected"
      :filterable="filterable"
      :clearable="clearable"
      :placeholder="controlPlaceholder"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :allow-create="allowCreate"
      @focus="focus"
      @clear="clear"
      @change="handleChange"
      @mouseenter.native="handleMouseEnter"
      @keydown.native.enter.prevent="handleEnterKeyDown($event)"
    >
      <el-option
        v-for="item in list"
        v-show="!item.hide"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item[props.value]"
        :disabled="item.disabled"
        @click.native="handleOptionClick(item)"
      ></el-option>
    </el-select>
  </el-tooltip>
</template>
<script>
  import api from '@/api/selectApi.js'
  export default {
    name: 'e-select',
    data: function () {
      return {
        isOverflow: false,
        list: this.options,
        selected: this.value
      }
    },
    props: {
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            value: 'value'
          }
        }
      },
      size: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      collapseTags: {
        type: Boolean,
        default: true
      },
      async: {
        type: Boolean,
        default: true
      },
      options: Array,
      filterable: {
        type: Boolean,
        default: true
      },
      apiName: {
        type: String,
        default: 'dict'
      },
      parameter: String,
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Array],
        default: ''
      },
      clearable: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      hideKeys: {
        type: Array,
        default () {
          return []
        }
      },
      allowCreate: {
        type: Boolean,
        default: false
      },
      // 自动显示第一项
      autoShow: Boolean,
      // 下拉接口额外的参数
      params: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      controlPlaceholder () {
        return this.placeholder || (this.disabled ? '' : '请选择')
      }
    },
    watch: {
      value (value) {
        this.selected = value
      },
      options (value) {
        this.list = value
      },
      parameter (value) {
        value && this.init()
      },
      hideKeys (value) {
        value.length && this.handleOptionHide(value)
      }
    },
    created () {
      this.init()
    },
    mounted () {
      if (this.multiple && !this.allowCreate) {
        this.addInputBlurListener()
      }
    },
    methods: {
      init () {
        let apiName = this.handleApiName()
        this.async && this.getData(apiName)
      },
      handleApiName () {
        return this.apiName
      },
      getData (apiName) {
        var data = Object.assign({
          id:'1853',
          commID:'185301'
        }, this.params)
        api(apiName, data).then((res) => {
          if ('0' == res.code) {
            this.list = res.data
            this.autoShow && (this.selected = res.data[0][this.props.value])
            this.hideKeys.length && this.handleOptionHide(this.hideKeys)
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error'
            })
          }
				}).catch(error => {
          this.$message({
            showClose: true,
            message: error.message,
            type: 'error'
          })
				})                
      },
      handleOptionClick (option) {
        this.$emit('option-click', option)
      },
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      },
      setDisabled (value, isDisabled) {
        for (let item of this.list) {
          if (item.value === value) {
            this.$set(item, 'disabled', isDisabled)
            break
          }
        }
      },
      setHideOption (value, isHide) {
        for (let item of this.list) {
          if (item.value === value) {
            item.hide = isHide
            break
          }
        }
      },
      handleOptionHide (keys) {
        if (!this.list || !this.list.length) return
        for (let item of this.list) {
          if (keys.includes(item[this.props.value])) {
            item.hide = true
          }
        }
      },
      clear () {
        this.isOverflow && this.closeTooltip()
        this.$emit('clear')
      },
      focus () {
        this.$emit('focus')
      },
      getToolTip () {
        if (this.selected && Array.isArray(this.list) && this.list.length) {
          const item = JSON.parse(JSON.stringify(this.list)).filter(item => item[this.props.value] === this.selected)[0]
          return item ? item[this.props.label] : ''
        }
      },
      /** 彻底关闭tooltip */
      closeTooltip () {
        const tooltip = this.$refs.tooltip
        tooltip && tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
      },
      handleMouseEnter () {
        const input = this.$refs.iSelect.$el.querySelector('.el-input__inner')
        this.isOverflow = input.scrollWidth > input.offsetWidth
      },
      /** 处理回车事件 */
      handleEnterKeyDown (event) {
        if (this.multiple && !this.allowCreate) {
          this.forceSelected(event)
        }
      },
      /** 处理失焦事件 */
      addInputBlurListener (event) {
        this.$nextTick(() => {
          this.$refs.iSelect.$el.querySelector('.el-select__input').addEventListener('blur', this.forceSelected)
        })
      }
    }
  }
</script>
<style scoped>
  .e-select .el-input .el-input__inner{
    height: 30px;
    text-overflow: ellipsis;
  }
</style>
