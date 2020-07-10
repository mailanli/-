<template>
  <div>
    <bread-crumb>
      <div slot="curPath">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频列表(管理员)</el-breadcrumb-item>
      </div>
    </bread-crumb>

    <el-card>
      <div slot="header">
        <span style="line-height: 36px;">
          <i class="el-icon-date" style="margin-right: 5px;"></i>
          筛选查询
        </span>
        <el-button style="float: right;" size="small" type="primary" @click="reset">重置</el-button>
        <el-button style="float: right; margin-right: 10px;" size="small" type="primary" @click="search">查询</el-button>
      </div>
      <div>
        <el-form :inline="true" label-width="120px" :model="formData">
          <el-form-item label="名称">
            <el-input v-model="formData.videoName"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-dropdown trigger="click" placement="bottom-start">
              <el-input v-model="formData.classify" @focus="classifyFocus"></el-input>

              <el-dropdown-menu slot="dropdown">
                <div class="select-tree" v-show="selectTreeVisible">
                  <el-tree
                    :data="treeData"
                    :props="defaultProps"
                    @node-click="selectTreeClick"
                    :expand-on-click-node="false">
                  </el-tree>
                </div>
              </el-dropdown-menu>
            </el-dropdown>


            <!-- <el-input v-model="formData.classify" @focus="classifyFocus" @blur="selectTreeVisible = false"></el-input>

            <div class="select-tree" v-show="selectTreeVisible">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="selectTreeClick"
                :expand-on-click-node="false">
              </el-tree>
            </div> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span style="line-height: 36px;">
          <i class="el-icon-date" style="margin-right: 5px;"></i>
          视频列表
        </span>

        <el-button style="float: right;" size="small" type="primary" @click="deleteVideoList(deleteIdList)">批量删除</el-button>

        <el-button style="float: right; margin-right: 10px;" size="small" type="primary" @click="uploadDialogVisible = true">视频上传</el-button>
      </div>

      <div>
        <el-table :data="tableData" @selection-change="selectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :prop="item.prop"
            :label="item.label"
            :key="index"
            align="center">
          </el-table-column>
          <el-table-column label="操作" :width="300" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button size="mini" @click="openWatchDialog(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteVideoList([scope.row.fileId])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageInfo.pageIndex"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          layout="prev, pager, next, jumper" >
        </el-pagination>
      </div>
    </el-card>

    <!-- 编辑和查看视频 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :model="editFormData" label-width="80px">
        <el-form-item label="视频名称">
          <el-input v-model="editFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-dropdown trigger="click" placement="bottom-start">
            <el-input v-model="editFormData.className" @focus="editClassifyFocus"></el-input>

            <el-dropdown-menu slot="dropdown">
              <div class="select-tree" v-show="dialogSelectVisivle">
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  @node-click="editSelectTreeClick"
                  :expand-on-click-node="false">
                </el-tree>
              </div>
            </el-dropdown-menu>
          </el-dropdown>

        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editFormData.description"></el-input>
        </el-form-item>
        <el-form-item label="视频封面">
          <img v-show="this.dialogType === 'watch'" :src="editFormData.coverUrl" style="width:100px;" alt="">
          <form ref="cExample" v-show="this.dialogType === 'edit'">
            <input type="file" ref="cExampleCover" />
          </form>
        </el-form-item>
        <el-form-item v-show="this.dialogType === 'edit'">
          <el-button type="primary" @click="dialogSubmit">确定提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 上传视频 -->
    <el-dialog
      title="上传视频"
      :visible.sync="uploadDialogVisible"
      @open="openUploadDialog"
      width="50%">
      <el-form ref="uploadForm" :model="uploadFormData" label-width="80px">
        <el-form-item label="视频名称">
          <el-input v-model="uploadFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-dropdown trigger="click" placement="bottom-start">
            <el-input v-model="uploadFormData.className" @focus="uploadClassifyFocus"></el-input>

            <el-dropdown-menu slot="dropdown">
              <div class="select-tree" v-show="uploadDialogSelectVisivle">
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  @node-click="uploadSelectTreeClick"
                  :expand-on-click-node="false">
                </el-tree>
              </div>
            </el-dropdown-menu>
          </el-dropdown>

        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="uploadFormData.description"></el-input>
        </el-form-item>
        <el-form-item label="选择视频">
          <form ref="vExample">
            <input type="file" ref="vExampleFile"/>
          </form>
          <div>请上传mp4,rmvb,wmv格式的视频,大小不超过500M</div>
        </el-form-item>
        <el-form-item label="视频封面">
          <form ref="uploadExample">
            <input type="file" ref="uploadExampleCover" />
          </form>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="uploadDialogSubmit">确定提交</el-button>
          <el-button @click="uploadDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getVideoList, getClassifyList, deleteVideoList, setVideo} from '@/api/videoManage.js'
import breadCrumb from '@/components/breadCrumb2.vue'
import TcVod from 'vod-js-sdk-v6'
import axios from 'axios'
import { setTimeout } from 'timers';

export default {
  components: {
    breadCrumb
  },
  data () {
    return {
      dialogTitle: '编辑视频',
      dialogVisible: false,
      selectTreeVisible: false,
      dialogSelectVisivle: false,
      uploadDialogVisible: false,
      uploadDialogSelectVisivle: false,
      submitLoading: false,
      dialogType: 'edit',
      isCover: false,
      treeData: [],
      deleteIdList: [],
      defaultProps: {
        children: 'listClass',
        label: 'className'
      },
      uploadFormData: {},
      formData: {
        videoName: '',
        classId: '',
        classify: ''
      },
      editFormData: {},
      tcVod: null,
      keyWord: '',
      uploaderInfos: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {prop: 'fileId', label: '序号'},
        {prop: 'name', label: '视频名称'},
        {prop: 'className', label: '分类'},
        {prop: 'description', label: '描述'},
        {prop: 'playCount', label: '播放次数'}
      ],
      tableData: [],
      showOrgan: false
    }
  },
  created () {
    let accessToken = JSON.parse(sessionStorage.getItem('sysUserInfo')).accessToken
    let getSignature = () => {
      return axios.get('/api/nideo/getVideoSign', {params: {AccessToken: accessToken, isCover: this.isCover}}).then(function (response) {
        return response.data.data
      })
    }
    this.tcVod = new TcVod({
      getSignature: getSignature
    })
  },
  mounted () {
    this.search()
  },
  methods: {
    uploadDialogSubmit () {
      if (JSON.stringify(this.uploadFormData) == "{}" || !this.uploadFormData.className) {
        this.$message({
          message: '类别不能为空！',
          type: 'warning'
        });
      } else {
        this.vExampleUpload()
      }

//       console.log(this.uploadFormData.className)
    },
    openUploadDialog () {
      if (this.$refs.uploadExampleCover) {
        this.$refs.uploadExample.reset()
      }
    },
    reset () {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.search()
    },
    // 搜索
    search () {
      getVideoList(
        {pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize,
        text: this.formData.videoName,
        classId: this.formData.classId},
      result => {
        this.tableData = result.BasicInfo
        this.pageInfo.pageSize = result.pageSize
        this.pageInfo.total = result.TotalCount
        this.pageInfo.pageIndex = result.currentPage
        console.log('返回结果', result)
        console.log(this.tableData)
      })
    },
    handleCurrentChange (val) {
      this.pageInfo.pageIndex = val
      this.search()
    },
    // 下拉树点击事件
    selectTreeClick (data, node) {
      // this.selectTreeVisible = false
      this.formData.classify = data.className
      this.formData.classId = data.classId
    },
    editSelectTreeClick (data, node) {
      this.dialogSelectVisivle = false
      this.editFormData.className = data.className
      this.editFormData.classId = data.classId
    },
    uploadSelectTreeClick (data, node) {
      this.uploadDialogSelectVisivle = false
      this.uploadFormData.className = data.className
      this.uploadFormData.classId = data.classId
    },
    // 获取树形节点数据
    getClassifyList () {
      getClassifyList({}, result => {
        this.treeData = result
      })
    },
    // 分类获取焦点
    classifyFocus () {
      this.selectTreeVisible = true
      this.getClassifyList()
    },
    uploadClassifyFocus () {
      this.uploadDialogSelectVisivle = true
      this.getClassifyList()
    },
    // 编辑dialog类别选择框获取焦点
    editClassifyFocus () {
      this.dialogSelectVisivle = true
      this.getClassifyList()
    },
    // dialog表单提交
    dialogSubmit () {
      delete this.editFormData.coverUrl

      if (this.$refs.cExampleCover.files[0]) {
        this.cExampleUpload(this.editFormData.fileId, this.$refs.cExampleCover.files[0]).then(() => {
          setVideo({...this.editFormData}, result => {
            if (result === '修改成功') {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.dialogVisible = false
              this.search()
            }
          })
        })
      } else {
        setVideo({...this.editFormData}, result => {
          if (result === '修改成功') {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.dialogVisible = false
            this.search()
          }
        })
      }
    },
    // 编辑视频
    openEditDialog (row) {
      this.dialogType = 'edit'
      this.dialogTitle = '编辑视频'
      this.dialogVisible = true
      this.editFormData = Object.assign({}, row)
      setTimeout(() => {
        if (this.$refs.cExampleCover.files[0]) {
          this.$refs.cExample.reset()
        }
      })
    },
    // 查看视频
    openWatchDialog (row) {
      this.dialogType = 'watch'
      this.dialogTitle = '查看视频'
      this.dialogVisible = true
      this.editFormData = Object.assign({}, row)
    },
    // 上传视频
    vExampleAdd: function () {
      this.$refs.vExampleFile.click()
    },
    // 表格多选框选中
    selectionChange (selection) {
      this.deleteIdList = selection.map(item => {
        return item.fileId
      })
    },
    deleteVideoList (idList) {
      this.$confirm('确定删除视频吗？').then(() => {
        deleteVideoList({ids: idList.toString()}, result => {
          if (result === '删除成功') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.search()
          }
        })
      })
    },
    // 修改视频封面
    cExampleUpload (fileId, file) {
      return new Promise((resolve, reject) => {
        // var coverFile = this.$refs.uploadExampleCover.files[0]
  
        var uploader = this.tcVod.upload({
          fileId: fileId,
          coverFile: file
        })
        uploader.on('cover_progress', info => {
          uploaderInfo.coverProgress = info.percent
        })
        uploader.on('cover_upload', info => {
          uploaderInfo.isCoverUploadSuccess = true
        })
        console.log(uploader, 'uploader')
  
        var uploaderInfo = {
          coverInfo: uploader.coverInfo,
          isCoverUploadSuccess: false,
          coverProgress: 0,
          coverUrl: '',
          cancel: function () {
            uploader.cancel()
          },
        }
  
        this.uploaderInfos.push(uploaderInfo)
  
        uploader.done().then(doneResult => {
          // this.search()
          console.log('doneResult', doneResult)
          // this.search()
          uploaderInfo.coverUrl = doneResult.cover.url
          // this.$refs.cExample.reset()
          // this.$refs.uploadExample.reset()
        }).then(() => {
          console.log('封面修改完成')
          // this.search()
          resolve()
        })
      })
    },
    // 文件input改变事件(视频上传)
    vExampleUpload () {
      var videoFile = this.$refs.vExampleFile.files[0]
      var coverFile = this.$refs.uploadExampleCover.files[0];

      if (videoFile !== undefined) {
        var videoName = videoFile.name.split('.')[1]
      }

      if (!videoFile) {
        this.$message({
          message: '视频不能为空！',
          type: 'warning'
        });
        return false
      } if (videoName !== 'mp4' && videoName !== 'rmvb' && videoName !== 'wmv') {
        this.$message({
          message: '请上传mp4,rmvb,wmv格式的视频！',
          type: 'warning'
        });
        return false
      } if (videoFile.size > 1024*1024*500) {
        this.$message({
          message: '视频大小不能超过500M！',
          type: 'warning'
        });
        return false
      }else {
        this.submitLoading = true

        // 告知后台，前端是否有上传封面
        if (this.$refs.uploadExampleCover.files[0]) {
          this.isCover = true
        } else {
          this.isCover = false
        }

        var uploader = this.tcVod.upload({
          videoFile: videoFile,
          coverFile: coverFile
        })
        uploader.on('video_progress', function (info) {
          uploaderInfo.progress = info.percent
        })
        uploader.on('video_upload', function (info) {
          uploaderInfo.isVideoUploadSuccess = true
        })
        uploader.on('cover_progress', function(info) {
          uploaderInfo.coverProgress = info.percent;
        })
        uploader.on('cover_upload', function(info) {
          uploaderInfo.isCoverUploadSuccess = true;
        })
        console.log(uploader, 'uploader')

        var uploaderInfo = {
          videoInfo: uploader.videoInfo,
          coverInfo: uploader.coverInfo,
          isVideoUploadSuccess: false,
          isCoverUploadSuccess: false,
          progress: 0,
          coverProgress: 0,
          fileId: '',
          videoUrl: '',
          coverUrl: '',
          cancel: function () {
            uploader.cancel()
          }
        }

        this.uploaderInfos.push(uploaderInfo)

        this.$message({
          type: 'info',
          message: '视频文件上传中....'
        })

        uploader.done().then((doneResult) => {
          console.log('上传视频完成', doneResult)
          uploaderInfo.fileId = doneResult.fileId
          this.uploadFormData.fileId = doneResult.fileId
          return this.getAntiLeechUrl(doneResult.video.url)
        }).then(videoUrl => {

          uploaderInfo.videoUrl = videoUrl
          setVideo({...this.uploadFormData}, result => {
            this.$message({
              type: 'success',
              message: '视频文件上传完成'
            })
            this.submitLoading = false
            this.uploadDialogVisible = false
            this.search()
            // this.$refs.uploadForm.resetFields()
            this.uploadFormData = {}
          })
          this.$refs.vExample.reset()
        })
      }
    },
    /*
      防盗链地址获取
    */
    getAntiLeechUrl (videoUrl, callback) {
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.select-tree {
  width: 200px;
  border: 1px solid #ddd;
  margin-top: 5px;
}

// .el-form {
//   .el-form-item {
//     .el-form-item__content {
//       text-align: center;
//     }
//   }
// }
</style>
