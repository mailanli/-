<template>
  <section class="dataUpload-wrapper">
    <bread-crumb></bread-crumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px; margin-left: 5px;">
          <i class="el-icon-date"></i>数据上报
        </span>
        <div style="" class="quartMonth">
          <label for="" class="quartMonthlabel">季度/月度</label>
          <div style="display:inline-block;width:120px;">
            <el-select v-model="PageHeadManage['quartMonth']" placeholder="月度" align="center">
              <el-option v-for="item in  PageOption['quartMonth']" :key="item.value" :label="item.label" :value="item.value" style="padding-left:35px">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="dataUpload-content">
        <header>
          <!-- 表格展示:下拉 开始 -->
          <el-form ref="form" :model="PageHeadManage" label-width="50px">
            <!-- 类型 -->
            <el-form-item label="类型">
              <el-select v-model="PageHeadManage['pageCity']" placeholder="请选择类型展示">
                <el-option v-for="item in PageOption['pageTypeCity']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 指标 -->
            <el-form-item label="指标">
              <el-cascader class="quota-select" @change="handleChangeFlag" :props='props' :options="PageOption['pageTypeList']" change-on-select v-model="pageType" placeholder="请选择指标展示">
              </el-cascader>
              <!-- <el-select v-model="PageHeadManage['pageType']" placeholder="请选择指标展示">
                <el-option v-for="item in PageOption['pageTypeList']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>

            <!-- 时间控件: 开始 -->
            <el-form-item label="年份">
              <div class="datePanel">
                <el-date-picker v-model="PageHeadManage['pageYear']" type="year" format="yyyy" placeholder="选择年份">
                </el-date-picker>
              </div>
            </el-form-item>
            <!-- 时间控件: 结束 -->
            <!-- 季度控件: 开始 -->
            <el-form-item label="月度">
              <el-select v-model="PageHeadManage['pageMonth']" placeholder="请选择月度">
                <el-option v-for="item in PageOption['quarterList']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 季度控件: 结束 -->
          </el-form>
          <!-- 表格展示:下拉 结束 -->
        </header>
        <el-tabs type="border-card" @tab-click="tabHandle">
          <!-- Excel导入: 开始 -->
          <el-tab-pane label="Excel导入">
            <span slot="label">
              <i class="el-icon-date"></i>Excel录入</span>
            <!-- 文件上传 -->
            <div class="upload-wrapper" v-loading="uploadLoading" element-loading-text="数据上传中......">
              <!-- 去除上传表格权限控制 -->
              <!-- <div class="upload-item" v-if="PageAuthority['write']&&!PageAuthority['lockStatus']"> -->
              <div class="upload-item">
                <i class="el-icon-upload"></i>
                <span class="upload-tip">点击上传</span>
                <label for="uploadBtn" class="upload-label"></label>
                <input id="uploadBtn" class="upload-btn" type="file" @change="handleFileChange()" ref="uploadBtn" />

                <div class="download-item" @click="excelDownHandle">
                  <p class="download-txt">模板下载</p>
                </div>
              </div>
              <!-- <div class="no-upload" v-else>
                <i class="el-icon-error"></i>
                <span class="error-tip">暂无权限</span>
              </div> -->
            </div>
            <!-- <el-button type="success" plain @click="excelDownHandle">Excel模板下载</el-button> -->
            <a href="" ref="excelDown"></a>
            <!-- </el-card> -->
          </el-tab-pane>
          <!-- Excel导入: 结束 -->
          <el-tab-pane label="手工录入">
            <quota-entry :PageHeadManage="PageHeadManage" :PageOption="PageOption" :currentRouter="currentRouter" @pageAuthorityHandle="pageAuthorityHandle"></quota-entry>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false">
      <el-progress type="circle" style="left: 30%;" :percentage="uploadPrecentage" :status="uploadStatus">
      </el-progress>
    </el-dialog>
  </section>
</template>

<script>
import breadCrumb from '../../breadCrumb'
import quotaEntry from './quota-entry-month.vue'
import { apiServer } from '@/config/index'
import { quotaMonthApiManage } from '@/api/performance'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    breadCrumb,
    quotaEntry
  },
  data() {
    return {
      props: {
        value: 'elementId',
        label: 'elementName'
      },
      currentRouter: 'quotaMonthupload',
      pageType: [],
      pageTypeName: '',
      PageHeadManage: {
        pageCity: '', //当前类型
        pageYear: '', //当前年份
        pageMonth: '', //当前月份
        pageType: [], //页面主入口指标
        pageIsManual: false, //页面是否手工录入
        quartMonth: '月度' //季度/月度
      },
      PageOption: {
        // 页面下拉选项
        pageTypeCity: [
          {
            value: '城市公司',
            label: '城市公司'
          },
          {
            value: '区域',
            label: '区域'
          }
        ],
        pageTypeList: [],
        quarterList: [
          {
            label: '1月',
            value: 1
          },
          {
            label: '2月',
            value: 2
          },
          {
            label: '3月',
            value: 3
          },
          {
            label: '4月',
            value: 4
          },
          {
            label: '5月',
            value: 5
          },
          {
            label: '6月',
            value: 6
          },
          {
            label: '7月',
            value: 7
          },
          {
            label: '8月',
            value: 8
          },
          {
            label: '9月',
            value: 9
          },
          {
            label: '10月',
            value: 10
          },
          {
            label: '11月',
            value: 11
          },
          {
            label: '12月',
            value: 12
          }
        ],
        quartMonth: [
          {
            label: '月度',
            value: '月度'
          },
          {
            label: '季度',
            value: '季度'
          }
        ]
      },
      PageAuthority: {
        read: false, //查询(false:表示无权;true:表示有权)
        write: false, //保存/导入(false:表示无权;true:表示有权)
        unLock: false, //解锁(false:表示无权;true:表示有权)
        lock: false, //锁定(false:表示无权;true:表示有权)
        lockStatus: false //锁定状态，false，表示非锁定，true表示锁定
      },
      //权限列表
      dialogVisible: false,
      uploadPrecentage: 0,
      uploadStatus: '',
      // 上传Loading
      uploadLoading: false
    }
  },
  activated: function() {
    this.PageHeadManage['quartMonth'] = '月度' //解决切换路由导致数据重新未加载
  },
  methods: {
    handleChangeFlag(value) {
      this.PageHeadManage['pageType'] = value[value.length - 1]
      // console.log(this.getpageTypeName(this.PageOption['pageTypeList']))
    },
    getpageTypeName(array) {
      let _this = this
      let obj = {}
      for (let i = 0; i < array.length; i++) {
        if (array[i].value == this.PageHeadManage['pageType']) {
          return array[i].label
        }
        if (array[i].children) {
          this.getpageTypeName(array[i].children)
        }
      }
    },
    async handleFileChange() {
      // this.uploadFileType=filetype;
      let inputDOM = ''
      inputDOM = this.$refs.uploadBtn
      let _pageYear = this.PageHeadManage['pageYear'],
        _pageMonth = this.PageHeadManage['pageMonth'],
        _pageCity = this.PageHeadManage['pageCity']
      let _couldWrite = this.PageAuthority['write']
      // 通过DOM取文件数据
      this.file = inputDOM.files[0]

      // if (!_couldWrite) {
      //   this.$message('抱歉,权限不足!')
      //   inputDOM.value = ''
      //   return false
      // }
      if (!_pageYear || !_pageYear || !_pageMonth) {
        this.$message('请选择年份或月份')
        inputDOM.value = ''
        return false
      }

      if (
        this.file.name.indexOf('.xlsx') > 0 ||
        this.file.name.indexOf('.xls') > 0
      ) {
        _pageYear = new Date(_pageYear).getFullYear()
        this.uploadLoading = true
        this.onPostFile(inputDOM, _pageYear, _pageMonth)
      } else {
        this.$message.error('请上传后辍为xlsx与xls的文件')
        inputDOM.value = ''
      }
    },
    async onPostFile(inputDOM, pageYear, pageMonth) {
      let pageType = this.PageHeadManage['pageType']
      let pageCity = this.PageHeadManage['pageCity']
      if (!pageType) {
        this.$message('请选择指标')
        inputDOM.value = ''
        return false
      }
      const postData = new FormData()
      const uploadfile = this.file
      postData.append('year', pageYear) //年份
      postData.append('month', pageMonth) //季度
      postData.append('elementId', this.PageHeadManage['pageType']) //文件类型
      postData.append('uploadfile', uploadfile) //上传的文件
      postData.append('name', uploadfile.name) //文件名
      await quotaMonthApiManage(
        pageCity,
        '表格上传',
        postData,
        response => {
          this.uploadLoading = false
          this.uploadStatus = 'success'
          this.dialogVisible = false
          this.$message('上传成功')
          this.uploadSuccess()
          this.file = ''
          inputDOM.value = ''
          console.warn(response)
          // clearInterval(progressInterval);
        },
        (error, code) => {
          this.uploadStatus = 'exception'
          this.dialogVisible = false
          // clearInterval(progressInterval);
          if (code === 500) {
            this.$message({
              type: 'error',
              message: '上传模板错误。请检查后重试'
            })
          }
          this.file = ''
          inputDOM.value = ''
          console.warn(error)
          this.uploadLoading = false
        },
        (exception, code) => {
          this.uploadStatus = 'exception'
          this.dialogVisible = false
          // clearInterval(progressInterval);
          console.warn(exception)
          if (code === 500) {
            this.$message({
              type: 'error',
              message: '上传模板错误。请检查后重试'
            })
          }
          this.file = ''
          inputDOM.value = ''
          this.uploadLoading = false
        },
        progressEvent => {
          console.log(progressEvent)
          // this.uploadPrecentage = (progressEvent.loaded / progressEvent.total) * 100;
          // if (this.uploadPrecentage >= 100) {
          //   this.uploadStatus = 'success';
          // }
          inputDOM.value = ''
        }
      )
    },
    tabHandle(_this) {
      this.PageHeadManage['pageIsManual'] =
        _this.label == '手工录入' ? true : false
    },
    pageAuthorityHandle(dataJson) {
      this.PageAuthority['write'] = dataJson['write']
      this.PageAuthority['lockStatus'] = dataJson['lockStatus']
    },
    excelDownHandle() {
      const config = require('@/config/index')
      const DOMIN = config.apiServer
      let _couldWrite = this.PageAuthority['write']
      let pageType = this.PageHeadManage['pageType']
      // if (!_couldWrite) {
      //   this.$message('抱歉,权限不足!')
      //   return false
      // }
      if (!pageType) {
        this.$message('请选择指标')
        return false
      }
      let url = ''
      if (this.PageHeadManage['pageCity'] == '区域') {
        url =
          DOMIN +
          '/templateDownload/choiceRegionMonthlyDownload?elementName=' +
          this.getpageTypeName(this.PageOption['pageTypeList'])
      } else {
        url =
          DOMIN +
          '/templateDownload/choiceCompanyMonthlyDownload?elementName=' +
          this.getpageTypeName(this.PageOption['pageTypeList'])
      }

      window.open(url, '_blank')
      console.log('下载模板文件:', url)
    }
  }
}
</script>
<style lang="less" scoped>
.dataUpload-wrapper {
  padding: 0;
  margin: 0;
  list-style: none;
  font-style: normal;
  text-decoration: none;
  border: none;
  font-family: 'Microsoft Yahei', sans-serif;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  .box-card {
    margin: 15px;
    .el-form,
    .el-form-item,
    .datePanel {
      display: inline-block;
    }
    .quartMonth {
      float: right;
    }
    .quartMonth .el-input__inner {
      padding-left: 35px;
    }
    .quartMonthlabel {
      width: 100px;
      text-align: center;
      display: inline-block;
    }
    .upload-wrapper {
      position: relative;
      width: 360px;
      height: 180px;
      cursor: pointer;
      border-radius: 6px;
      text-align: center;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      background-color: #fff;
      border: 1px dashed #d9d9d9;
      overflow: hidden;
      &:hover {
        border-color: #20a0ff;
      }
      .no-upload {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        .el-icon-error {
          font-size: 67px;
          color: #97a8be;
          margin: 40px 0 16px;
          line-height: 50px;
        }
        .error-tip {
          display: block;
          color: #97a8be;
          font-size: 14px;
          text-align: center;
        }
      }
      .upload-item {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        text-decoration: none;
        .el-icon-upload {
          font-size: 67px;
          color: #97a8be;
          margin: 40px 0 16px;
          line-height: 50px;
        }
        .upload-tip {
          display: block;
          color: #97a8be;
          font-size: 14px;
          text-align: center;
        }
        .upload-label {
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer; // background: red;
        }
        .upload-btn {
          display: none;
        }
      }
      .download-item {
        position: absolute;
        bottom: 0px;
        right: 0px;
        width: 1px;
        height: 0px;
        // margin-left: 548px;
        // margin-top: -11px;
        color: #fff;
        border-left: 60px solid #efefef; //与主题相容
        border-bottom: 60px solid #20a0ff;
        box-shadow: 0 0 5px #a2a2a2;
        animation: rotateInUpLeft 1s;
        .download-txt {
          position: absolute;
          right: 5px;
          top: 25px;
          width: 30px;
          font-size: 12px;
        }
      }
    }
  }
}
@-webkit-keyframes rotateInUpLeft {
  from {
    -webkit-transform-origin: left bottom;
    transform-origin: left bottom;
    -webkit-transform: rotate3d(0, 0, 1, 45deg);
    transform: rotate3d(0, 0, 1, 45deg);
    opacity: 0;
  }
  to {
    -webkit-transform-origin: left bottom;
    transform-origin: left bottom;
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
@-webkit-keyframes rotateStop {
  from {
    -webkit-transform-origin: left bottom;
    transform-origin: left bottom;
    -webkit-transform: rotate3d(0, 0, 1, 45deg);
    transform: rotate3d(0, 0, 1, 45deg);
    opacity: 0;
  }
  to {
    -webkit-transform-origin: left bottom;
    transform-origin: left bottom;
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
</style>
<style>
.quartMonth .el-input--suffix .el-input__inner {
  text-align: center;
}
</style>