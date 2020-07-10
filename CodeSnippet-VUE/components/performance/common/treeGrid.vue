<template>
  <el-table
    :data="data"
    border
    style="width: 100%"
    header-row-class-name="dataHang"
    :row-style="showTr">
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
      :label="column.text" align="center">
      <template slot-scope="scope">
        <p :class="{isCenter: index == 0}">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <button class="button" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-circle-plus" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-remove" aria-hidden="true"></i>
          </button>
          {{scope.row[column.dataIndex]}}
        </p>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  // import Utils from '../utils/index.js'
  import MSDataTransfer from './dataTranslate.js'
  //  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    props: {
      // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      // 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {}
    },
    computed: {
      // 格式化数据源
      data: function () {
        let _this = this
        if (_this.treeStructure) {
          let data = MSDataTransfer.treeToArray(_this.dataSource, null, null, _this.defaultExpandAll)
          console.log(data)
          return data
        }
        return _this.dataSource
      }
    },
    methods: {
      // 显示行
      showTr: function (row, index) {
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },
      // 展开下级
      toggle: function (trIndex) {
        console.log(trIndex)
        let _this = this
        let record = _this.data[trIndex]
        record._expanded = !record._expanded
      },
      // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let _this = this
        if (_this.treeStructure && index === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let _this = this
        if (_this.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      }
    }
  }
</script>
<style scoped>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  .button {
    background-color: transparent;
  }
  .dataHang {
    background: #eef1f6;
  }
  .isCenter {
    text-align: left;
  }
</style>