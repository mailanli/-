<template>
  <div class="search-component">
    <el-card class="search-bar">
      <div slot="header" class="clearfix">
        <div class="head-title">
          <span><i class="el-icon-date"></i>筛选查询</span>
        </div>
        <div class="action-btn">
          <el-button 
            v-show="showReset" 
            @click="reSet"
            type="primary" 
            size="small">重置
          </el-button>
          <el-button 
            @click="search"
            type="primary" 
            size="small">查询
          </el-button>
        </div>
      </div>
      <div>
        <el-form 
          :model="formData" 
          :label-width="labelWidth" 
          :inline="true"
          :style="formHeight"
          ref="form" 
          class="search-form">
          <div ref="formItem">
            <slot></slot>
          </div>
        </el-form>
        <div class="showStatus" v-if="showActionBtn">
          <el-button 
            type="text" 
            :icon="iconName"  
            @click="handleCollapse"
          >{{collapseText}}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      formHeight: {
        maxHeight: 'none'
      },
      showHeight: 0,
      isCollapse: false,
      showActionBtn: true,
    };
  },
  computed: {
    collapseText () {
      return this.isCollapse ? '收起' : '更多'
    },
    iconName () {
      return this.isCollapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    }
  },
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    showReset: {
      type: Boolean,
      default: true
    },
    // 搜索字段
    formData: {
      type: Object
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.initLayout()
    })
  },
  methods: {
    initLayout () {
      this.setLayout()
      this.browserListener()
    },
    browserListener () {
      window.onresize = () => {
        this.setLayout()
      }
    },
    setLayout () {
      let maxWidth = 0
      let formItemEls = this.$refs.formItem.children
      Array.from(formItemEls[0].children).forEach(item => {
        if (item.clientWidth > maxWidth) maxWidth = item.clientWidth
      })
      let formItemNum = parseInt((formItemEls[0].clientWidth)/maxWidth)
      this.showHeight = formItemEls[0].children[0].clientHeight*2 + 40 + 'px'
      Object.assign(this.formHeight, {maxHeight: this.showHeight})
      if (formItemNum*2 < formItemEls[0].children.length) {
        this.showActionBtn = true
      } else {
        this.showActionBtn = false
      }
    },
    handleCollapse () {
      this.isCollapse = !this.isCollapse
      this.isCollapse ? Object.assign(this.formHeight, {maxHeight: 'none'}) : Object.assign(this.formHeight, {maxHeight: this.showHeight})
    },
    // 抛出重置按钮事件
    reSet () {
      this.$emit('reSet')
    },
    // 抛出搜索按钮事件
    search () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$emit('search', this.formData)
        }
      })
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../style/mixin";
.search-component {
  .search-form {
    overflow: hidden;
  }
  .showStatus {
    text-align: center;
    color: #409efe;
    cursor: pointer;
    font-size: 12px;
  }
  margin: 10px;
  .clearfix {
    display: flex;
  }
  .action-btn {
    flex: 10;
    min-width: 127px;
    text-align: right;
  }
  .head-title {
    flex: 1;
    min-width: 100px;
  }
}
</style>