<template>
  <div>
    <bread-crumb>
      <div slot="curPath">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </div>
    </bread-crumb>

    <!-- 标题 -->
    <div>
      <el-card>
        <div slot="header">
          <span style="line-height: 36px;">
            <i class="el-icon-date" style="margin-right: 5px;"></i>
            分类管理
          </span>
          <el-button style="float: right;" size="small" type="primary" @click="addClassify">新增分类</el-button>
          <!-- <el-button style="float: right; margin-right: 10px;" size="small" type="primary" @click="searchButtonClicked()">查询</el-button> -->
        </div>

        <!-- 树形控件title -->
        <div class="classify-title">
          <div>分类名称</div>
          <div>视频数量</div>
          <div>操作</div>
        </div>

        <!-- 树形控件 -->
        <div class="video-tree">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
        </div>
      </el-card>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :rules="formRules" :model="formData" label-width="80px">
        <el-form-item label="分类名称" prop="className">
          <el-input v-model="formData.className"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
          <el-input v-model="formData.parentName" @focus="selectTreeVisible = true"></el-input>
          <div class="select-tree" v-show="selectTreeVisible">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              @node-click="selectTreeClick"
              :expand-on-click-node="false">
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="submit">确定提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="40%">
      <div style="display: flex;align-items: center;height: 50px;">
        <i class="el-icon-warning" style="font-size: 30px;margin-right: 10px;"> </i>
        是否删除该记录?
      </div>
      <el-form>
        <el-form-item>
          <el-button size="small" type="primary" @click="submit">确定提交</el-button>
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb2.vue"
import {getClassifyList, editVideo, deleteVideo, addClassify} from '@/api/videoManage.js'

export default {
  components: {
    breadCrumb
  },
  data () {
    return {
      dialogTitle: '新增分类',
      dialogVisible: false,
      deleteDialogVisible: false,
      selectTreeVisible: false,
      submitLoading: false,
      dialogType: '',
      formData: {
        className: '',
        parentName: ''
      },
      treeData: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      defaultProps: {
        children: 'listClass',
        label: 'className'
      },
      formRules: {
        className: [
          { required: true, message: '请输入分类名称', trigger: 'change' },
        ]
      }
    }
  },
  mounted () {
    this.getClassifyList()
  },
  methods: {
    getClassifyList () {
      getClassifyList({}, result => {
        this.treeData = result
      })
    },
    openDialog (type) {
      this.dialogVisible = true
      if (type === 'add') {
        this.dialogTitle = '新增分类'
      } else {
        this.dialogTitle = '编辑分类'
      }
    },
    openDeleteDialog (node) {
      if (node.data.listClass && node.data.listClass.length) {
        this.$message({
          type: 'info',
          message: '该分类下有子分类，不允许删除该分类!'
        })
      } else if (node.data.total > 0) {
        this.$message({
          type: 'info',
          message: '该分类下有关联的视频文件，不允许删除该分类!'
        })
      } else {
        this.dialogType = 'delete'
        this.formData = Object.assign({}, this.formData, node.data)
        this.deleteDialogVisible = true
      }
    },
    // 新增分类
    addClassify () {
      this.selectTreeVisible = false
      this.formData = {}
      this.dialogType = 'add'
      this.openDialog('add')
    },
    // 编辑分类
    editClassify (node) {
      this.dialogType = 'edit'
      this.formData = Object.assign({}, this.formData, node.data, {
        parentName: node.parent ? node.parent.data.className : '无'
      })
      this.openDialog('edit')
    },
    // 表单提交
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.dialogType === 'add') {
            addClassify({ClassName: this.formData.className, ParentId: this.formData.parentId || '-1'}, result => {
              if (Object.keys(result).length) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.dialogVisible = false
                this.submitLoading = false
                this.getClassifyList()
                this.$refs.form.resetFields()
              }
            }, ex => {
              this.submitLoading = false
              console.log('ex', ex)
            })
          } else if (this.dialogType === 'edit') {
            editVideo({ParentId: this.formData.parentId, ClassId: this.formData.classId, ClassName: this.formData.className}, result => {
              if (result) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.dialogVisible = false
                this.submitLoading = false
                this.getClassifyList()
                this.$refs.form.resetFields()
              } else {
                this.submitLoading = false
                this.$message({
                  type: 'error',
                  message: '修改失败'
                })
              }
            })
          } else if (this.dialogType === 'delete') {
            deleteVideo({ClassId: this.formData.classId}, result => {
              if (Object.keys(result).length) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.deleteDialogVisible = false
                this.submitLoading = false
                this.getClassifyList()
              } else {
                this.submitLoading = false
                this.$message({
                  type: 'error',
                  message: '修改失败'
                })
              }
            })
          }
        }
      })
    },
    // 下拉树节点点击事件
    selectTreeClick (data, node) {
      this.formData.parentName = data.className
      this.formData.parentId = data.classId
      this.selectTreeVisible = false
    },
    renderContent (h, { node, data, store }) {
      return (
        <div style="position: relative;display: flex;justify-content: space-between;width: 100%;height: 40px;align-items:center;">
          <div>{data.className}</div>
          <div style="position: absolute;right: 290px;">{data.total}</div>
          <div style="padding-right: 20px;" v-show={data.classId === '0' ? false : true}>
            <button on-click={() => {this.editClassify(node)}} style="background: transparent;color: #409EFF;font-size:16px;cursor:pointer;">编辑</button>
            <button on-click={() => {this.openDeleteDialog(node)}} style="background: transparent;color: #409EFF;font-size: 16px;margin-left: 30px;cursor:pointer;">删除</button>
          </div>
        </div>
      )
    }
  }
}
</script>

<style lang="less">
.classify-title {
  width: 600px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 50px;
}

.el-form {
  .el-form-item {
    .el-form-item__content {
      text-align: center;
    }
  }
}

.video-tree {
  width: 600px;
  height: 300px;
  overflow: auto;
  .el-tree {
    .el-tree-node {
      .el-tree-node__content {
        height: 40px;
      }
    }
  }
}

.select-tree {
  border: 1px solid #ddd;
  margin-top: 5px;
  min-height: 100px;
  overflow: auto;
}
</style>
