<template>
  <div class="a-table">
    <el-card>
      <div slot="header" class="clearfix">
        <div class="table-title">
          <span><i class="el-icon-date"></i>数据列表</span>
        </div>
        <div class="action-btn">
          <el-button
            v-for="(btn, index) of buttonList"
            v-show="!btn.hide"
            :disabled="btn.disabled"
            :loading="btn.loading"
            :key="index"
            :icon="btn.icon"
            :type="btn.type || 'primary'"
            :size="btn.size || 'small'"
            @click="handleClick(btn)"
          >
            {{btn.text}}
          </el-button>
        </div>
      </div>
      <el-table
        :data="data"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        border
        ref="multipleTable"
        style="width: 100%">
        <slot></slot>
      </el-table>
      <div class="page-info">
        <el-pagination
          ref="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-count="table.totalPage"
          :current-page="table.pageIndex || 1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="table.pageSize"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  props: {
    // 翻页参数
    table: {
      type: Object,
      default: () => ({})
    },
    //是否添加loading效果
    loading: {
      type: Boolean,
      default: false
    },
    //列表数据
    data: {
      type: Array,
      default: () => []
    },
    // 操作按钮列表
    buttonList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    //抛出选择每页条数事件
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    //抛出当前页数跳转事件
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)        
    },
    handleClick (btn) {
      const { func } = btn
      func && func()
    },
    //抛出表格选中事件
    handleSelectionChange(list) {
      this.$emit('handleSelectionChange', list)
    },
  },
};
</script>

<style lang="less" scoped>
.a-table {
  margin: 0 10px;
  .page-info {
    text-align: right;
    padding-top: 15px;
  }
  .clearfix {
    display: flex;
  }
  .action-btn {
    flex: 10;
    min-width: 127px;
    text-align: right;
  }
  .table-title {
    flex: 1;
    min-width: 100px;
  }
}
</style>
