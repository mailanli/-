<template>
  <a-dialog 
    title="组织选择"
    v-model="isShow" 
    :close-on-click-modal="false" 
    dialogWidth="700px"
    @input="beforeClose"
    append-to-body
    :toolbar="toolbar"
  >
    <div v-loading="treeLoading" element-loading-text="组织树加载中...">
      <el-tree
        class="filter-tree"
        ref="tree"
        :props="defaultProps"
        node-key="id"
        :expand-on-click-node="false"
        lazy
        :load="loadNode"
        @node-click="clickTree"
      >
      </el-tree>
    </div>
  </a-dialog>
</template>

<script>

import req from '@/api/common.js'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'unitName',
        id:'fullUnitCode',
        isLeaf: (data, node) => {
          return !data.isClick
        }
      },
      // 弹窗按钮配置
      toolbar: [{
        text: '取消',
        type: 'plain',
        func: (done) => {
          this.cancel(done)
        }
      },{
        text: '确定',
        func: (done) => {
          this.confirm(done)         
        }
      }],
      treeLoading: false
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:isShow', false)
    },
    cancel (done) {
      done()
    },
    // 确认选中课程
    confirm (done) {
      this.$emit('selectData', this.selectList)
      done()
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.getOrganData().then(data => {
          resolve(data)
          this.$nextTick(() => {
            this.$refs.tree.root.childNodes.forEach(treeNode => {
              treeNode.expand()
            })
          })
        })
      } else {
        if (node.data.children && node.data.children.length) {
          resolve(node.data.children)
        } else {
          node.data.level = String(Number(node.data.level) + 1)
          let params = node.data      
          req('getOrganList', params).then(data => {
            if (data.code == '0') {
               resolve(data.data)
            }           
          })
        }
      }
    },
    getOrganData () {
      return new Promise((resolve, reject) => {
        let params = {level: '1'}
        req('getOrganList', params).then(data => {
          this.treeLoading = false
          if (data.code == '0') {
             resolve(data.data)
          }        
        }).catch(err => {
          this.treeLoading = false
        })
      })
    },
    clickTree (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="less">

</style>


