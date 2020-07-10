<template>
  <div>
    <div class="apply-files">
      <div style="margin: 15px ;"></div>
      <div v-if="applyType === 4" style="background:#ffffcc;height:50px;margin-bottom:20px;line-height:50px;color:#990000">
        <i class="el-icon-warning" style="margin-left:20px;"></i>
        <span>当前职位申请表状态：</span>
        <span>审核不通过</span>
        <span style="margin-left:20px;">理由：</span>
        <span>{{unPassReason}}</span>
      </div>
      <div class="download-all" v-if="applyType !== 5">
        <i  class="el-icon-download" @click="downloadAll">下载全部</i>
      </div>
      <div v-if="applyType === 5" class="init-table" v-loading="initGetDataLoading">
        <el-row class="header">
          <el-col :span="6" class='header-cell'>
            序号
          </el-col>
          <el-col :span="9" class="header-cell text-left">
            材料名称
          </el-col>
          <el-col :span="9" class='header-cell'>
            附件
          </el-col>
        </el-row>
        <el-row class="file-row" v-for="(file, index) of initFiles" :key="index">
          <el-col :span="6" class="file-cell file-num">
            {{index + 1}}
          </el-col>
          <el-col :span="9" class="file-cell text-left">
            <span class="file-name">{{file.fileName}}</span>
            <span class="file-rule">{{file.rule}}</span>
          </el-col>
          <el-col :span="9" class="file-cell file-upload">
            <div v-if="file.name">
              <span class="uploaded-text">{{file.name}}</span>
              <el-upload 
              class="upload-btn" 
              :show-file-list='false'
              :action="apiServer" 
              :http-request="uploadFile" 
              :data="{'index': index, 'ruleSize': file.ruleSize, 'ruleTypes': file.ruleTypes, 'fileList': 'initFiles'}">
                  <el-button size="small" type="default" :loading="file.loading" :disabled="file.loading">重新上传</el-button>
              </el-upload>
            </div>
            <div v-else>
              <el-upload 
              class="upload-btn" 
              :show-file-list='false'
              :action="apiServer" 
              :http-request="uploadFile" 
              :data="{'index': index, 'ruleSize': file.ruleSize, 'ruleTypes': file.ruleTypes, fileList: 'initFiles'}">
                  <el-button size="small" type="default" :loading="file.loading" :disabled="file.loading">点击上传</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <div class="submit-btn">
          <span class="submit-title">档案初始化：</span>
          <el-button type="primary" @click="submitInit" :loading="initLoading">保存</el-button>
          <el-button @click="backToList">返回</el-button>
        </div>
      </div>
      <div v-if="applyType === 2" class="check-table" v-loading="checkLoading">
        <el-row class="header">
          <el-col :span="6" class='header-cell'>
            序号
          </el-col>
          <el-col :span="4" class="header-cell ">
            材料名称
          </el-col>
          <el-col :span="6" class='header-cell'>
            附件
          </el-col>
          <el-col :span="4" class='header-cell'>
            <el-checkbox :indeterminate="isCheckIndeterminate" v-model="checkAll" @change="handleCheckAllChange">批量通过</el-checkbox>
          </el-col>
          <el-col :span="4" class='header-cell'>
            <el-checkbox :indeterminate="isUncheckIndeterminate" v-model="uncheckAll" @change="handleUncheckAllChange">批量不通过</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="file-row" v-for="(file, index) of checkFiles" :key="index">
          <el-col :span="6" class="file-cell file-num">
            {{index + 1}}
          </el-col>
          <el-col :span="4" class="file-cell line-mid">
            {{file.fileName}}
          </el-col>
          <el-col :span="6" class="file-cell file-upload">
            <span class="uploaded-text download-file" @click="preview(file)">{{file.name}}</span>
          </el-col>
          <el-col :span="4" class="file-cell line-mid">
            <el-checkbox v-if="file.name && !file.pass" v-model="file.check" @change="handleCheck($event, index)">通过</el-checkbox>
            <i class="el-icon-success success" v-if="file.pass"></i>
          </el-col>
          <el-col :span="4" class="file-cell line-mid">
            <el-checkbox v-if="file.name && !file.pass" v-model="file.uncheck" @change="handleUncheck($event, index)">不通过</el-checkbox>
          </el-col>
        </el-row>
        <div class="submit-btn">
          <span class="submit-title">入职档案审核：</span>
          <el-button type="primary" @click="reasonDialog = true" :disabled="!unpassValid || !allSelected">审核不通过</el-button>
          <el-button type="primary" @click="submitCheck(true)" :loading="passLoading" :disabled="!passValid || !allSelected">审核通过</el-button>
        </div>
      </div>
      <div v-if="[1,3,4,6].indexOf(applyType) !== -1" v-loading="viewLoading" class="view-table">
        <el-row class="header">
          <el-col :span="6" class='header-cell'>
            序号
          </el-col>
          <el-col :span="8" class="header-cell text-left">
            材料名称
          </el-col>
          <el-col :span="8" class='header-cell'>
            附件
          </el-col>
        </el-row>
        <el-row class="file-row" v-for="(file, index) of viewFiles" :key="index">
          <el-col :span="6" class="file-cell file-num">
            {{index + 1}}
          </el-col>
          <el-col :span="8" class="file-cell text-left">
            <span class="file-name ">{{file.fileName}}</span>
            <span class="file-rule">{{file.rule}}</span>
          </el-col>
          <el-col :span="8" class="file-cell file-upload">
            <div v-if="file.name">
              <span class="uploaded-text download-file" @click="preview(file)">{{file.name}}</span>
              <el-upload 
              class="upload-btn" 
              :show-file-list='false'
              :action="apiServer" 
              :http-request="viewUploadFile" 
              :data="{'index': index, 'ruleSize': file.ruleSize, 'ruleTypes': file.ruleTypes, 'fileList': 'viewFiles', 'id': file.id, 'materialName': file.fileValue}">
                  <el-button size="small" type="default" :loading="file.loading" :disabled="file.loading">重新上传</el-button>
              </el-upload>
            </div>
            <div v-else>
              <el-upload 
              class="upload-btn" 
              :show-file-list='false'
              :action="apiServer" 
              :http-request="viewUploadFile" 
              :data="{'index': index, 'ruleSize': file.ruleSize, 'ruleTypes': file.ruleTypes, 'fileList': 'viewFiles', 'id': file.id, 'materialName': file.fileValue}">
                  <el-button size="small" type="default" :loading="file.loading" :disabled="file.loading">点击上传</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="2" class="file-cell text-left line-mid">
            <i class="el-icon-error error" v-if="file.status === 2"></i>
            <i class="el-icon-success success" v-if="file.status === 1"></i>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 预览 -->
    <preview-file ref="previewFile"></preview-file>
    <!-- 审核不通过 -->
    <!-- 更新入职进度 -->
    <a-dialog title="审核不通过" v-model="reasonDialog" :toolbar="reasonToolbar">
        <el-form ref="reasonForm" :model="reasonForm" :rules='reasonFormRules' label-position='top'>
          <el-form-item label="审核不通过理由" prop='examineVerifyReason'>
            <el-input type="textarea" :rows="5" v-model="reasonForm.examineVerifyReason"></el-input>
          </el-form-item>
        </el-form>
    </a-dialog>
  </div>
</template>

<script>
  import api from '@/api/entryManage'
  import previewFile from "@/components/recruitment/components/previewFile.vue";
  export default {
        components: {
          previewFile
        },
        data(){
            return {
              initFiles: [
                { fileName: '身份证', rule: '上传jpg文件，大小不超过50M，正反面在同一页', fileValue: 'idCard', ruleTypes: ['jpg'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '一寸照片', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'oneInchPhotos', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '毕业证书', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'graduationCertufucate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '学位证书', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'degreeCertificate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '无犯罪记录证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'noCriminal', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '退伍证', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'militaryService', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '计生证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'familyPlan', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '体检表', rule: '上传pdf、zip或rar文件，大小不超过50M', fileValue: 'examinationTable', ruleTypes: ['pdf','zip','rar'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '离职证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'separationCertificate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '其它', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'other', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '面试评估表', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'interviewAssessment', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: '背景调查报告书', rule: '上传pdf、zip或rar文件，大小不超过50M', fileValue: 'backgroundSurvey', ruleTypes: ['pdf','zip','rar'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
                { fileName: 'BIP帐号申请表', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'BIPAccout', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: ''},
              ],
              checkFiles: [
                { fileName: '身份证', rule: '上传jpg文件，大小不超过50M，正反面在同一页', fileValue: 'idCard', ruleTypes: ['jpg'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '一寸照片', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'oneInchPhotos', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '毕业证书', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'graduationCertufucate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '学位证书', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'degreeCertificate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '无犯罪记录证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'noCriminal', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '退伍证', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'militaryService', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '计生证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'familyPlan', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '体检表', rule: '上传pdf、zip或rar文件，大小不超过50M', fileValue: 'examinationTable', ruleTypes: ['pdf','zip','rar'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '离职证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'separationCertificate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false},
                { fileName: '其它', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'other', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '面试评估表', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'interviewAssessment', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: '背景调查报告书', rule: '上传pdf、zip或rar文件，大小不超过50M', fileValue: 'backgroundSurvey', ruleTypes: ['pdf','zip','rar'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
                { fileName: 'BIP帐号申请表', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'BIPAccout', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: '', check: false, uncheck: false, pass: false},
              ],
              viewFiles: [
                { fileName: '身份证', rule: '上传jpg文件，大小不超过50M，正反面在同一页', fileValue: 'idCard', ruleTypes: ['jpg'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '一寸照片', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'oneInchPhotos', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '毕业证书', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'graduationCertufucate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '学位证书', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'degreeCertificate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '无犯罪记录证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'noCriminal', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '退伍证', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'militaryService', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '计生证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'familyPlan', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '体检表', rule: '上传pdf、zip或rar文件，大小不超过50M', fileValue: 'examinationTable', ruleTypes: ['pdf','zip','rar'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '离职证明', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'separationCertificate', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '其它', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'other', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '面试评估表', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'interviewAssessment', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: '背景调查报告书', rule: '上传pdf、zip或rar文件，大小不超过50M', fileValue: 'backgroundSurvey', ruleTypes: ['pdf','zip','rar'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
                { fileName: 'BIP帐号申请表', rule: '上传jpg、png文件，大小不超过50M', fileValue: 'BIPAccout', ruleTypes: ['jpg', 'png'], ruleSize: 50, name: '', url: '', realName: '', loading: false, id: '', status: ''},
              ],
              apiServer: '',
              fileList: [],
              applyType: undefined,
              id: '',
              rowId: '',
              unPassReason: '',
              initLoading: false,
              initGetDataLoading: false,
              viewLoading: false,
              passLoading: false,
              checkLoading: false,
              reasonDialog: false,
              reasonForm: {
                examineVerifyReason: ''
              },
              reasonFormRules: {
                examineVerifyReason : [
                  { required: true, message: '请填写审核不通过理由', trigger: 'blur' }
                ],
              },
              reasonToolbar:  [
                {
                  text: '取消',
                  func: () => {
                    this.closeReasonDialog()
                  }
                },
                {
                  text: '确定',
                  loading: false,
                  func: () => {
                    this.confirmReason()
                  }
                }
              ],
            }
        },
        mounted() {
        },
        computed: {
          isCheckIndeterminate: function() {
            return !this.checkAll && this.checkFiles.some(ele => ele.check)
          },
          isUncheckIndeterminate: function() {
            return !this.uncheckAll && this.checkFiles.some(ele => ele.uncheck)
          },
          checkAll: function() {
            return this.checkFiles.every(ele => ele.check || !ele.name || ele.pass)
          },
          uncheckAll: function() {
            return this.checkFiles.every(ele => ele.uncheck || !ele.name || ele.pass)
          },
          passValid: function() {
            return this.checkFiles.every(ele => ele.check || !ele.name || ele.pass)
          },
          unpassValid: function() {
            return !this.checkFiles.every(ele => ele.check)
          },
          allSelected: function() {
            return this.checkFiles.every(ele => ele.check || ele.uncheck || !ele.name || ele.pass)
          },
        },
        methods: {
          init (data) {
            console.log('applyFiles', data)
            this.resetInit()
            this.resetView()
            this.resetCheck()
            this.applyType = +data.entryFileStatus
            this.id = data.id
            this.rowId = data.rowId
            if ([1,3,4,6].indexOf(this.applyType) !== -1) {
              this.getViewData()
              if (this.applyType === 4) {
                this.getUnpassReason()
              }
            } else if (this.applyType === 2) {
              this.getCheckData()
            } else if (this.applyType === 5) {
              this.getInitData()
            }
          },
          // 下载全部
          downloadAll () {
            const config = require('@/config/index')
            const DOMIN = config.apiServer
            let Token = JSON.parse(sessionStorage.getItem('sysUserInfo')).accessToken
            let url = DOMIN + `/api/recruit/download/zip/${this.id}?AccessToken=${Token}`
            window.open(url, '_blank')
          },
          // 关闭不通过理由弹框
          closeReasonDialog () {
            this.reasonDialog = false
            this.resetReason()
          },
          // 重置不通过理由
          resetReason () {
            this.$refs.reasonForm  ? this.$refs.reasonForm.clearValidate() : ''
            this.reasonForm.examineVerifyReason = ''
          },
          // 预览
          preview (file) {
            console.log('file', file)
            if (file.name && file.url) {
              this.$refs.previewFile.preview(file.name, file.url)
            }
          },
          // 批量通过
          handleCheckAllChange (value) {
            console.log('handleCheckAllChange', value)
            if (value) {
              this.checkFiles.forEach(ele => {
                if (ele.name && !ele.pass) {
                  ele.check = true
                  ele.uncheck = false
                }
              })
            } else {
              this.checkFiles.forEach(ele => {
                ele.check = false
              })
            }
          },
          // 批量不通过
          handleUncheckAllChange (value) {
            console.log('handleUncheckAllChange', value)
            if (value) {
              this.checkFiles.forEach(ele => {
                if (ele.name && !ele.pass) {
                  ele.check = false
                  ele.uncheck = true
                }
              })
            } else {
              this.checkFiles.forEach(ele => {
                ele.uncheck = false
              })
            }
          },
          // 通过
          handleCheck (value, index) {
            console.log('handleCheck', value, index)
            if (value) {
              this.checkFiles[index].uncheck = false
            }
          },
          // 不通过
          handleUncheck (value, index) {
            console.log('handleUncheck', value, index)
            if (value) {
              this.checkFiles[index].check = false
            }
          },
          // 上传校验
          beforeUpload (file) {
            console.log('beforeUpload', file)
            let maxSize = file.data.ruleSize ? file.data.ruleSize : 50
            if(file.file.size >= maxSize * 1024 * 1024){//2097152B =2048KB = 2MB
              this.$message.error(`上传文件不能超过${maxSize}MB`)
              return false
            }
            let arr = file.file.name.split('.')
            let type = arr[arr.length - 1]
            let types = file.data.ruleTypes
            if (file.data.ruleTypes.indexOf(type) === -1) {
              this.$message.error(`请上传${file.data.ruleTypes.join(',')}文件`)
              return false
            }
            return true
          },
          // 上传文件
          uploadFile (file) {
            console.log('file', file)
            let index = file.data.index
            let fileList = file.data.fileList
            if (this.beforeUpload(file)) {
              this[fileList][index].loading = true
              let formData = new FormData()
              formData.append('uploadFile', file.file)
              api(
                'upload',
                formData
              ).then(
                res => {
                  console.log('upload', res)
                  this.$message({ type: "success", message: "上传成功", duration: 2000 });
                  this[fileList][index].loading = false
                  this[fileList][index].url = res.data.fileUrl
                  this[fileList][index].realName = res.data.fileRealName
                  this[fileList][index].name = res.data.name
                }
              ).catch(error => {
                this[fileList][index].loading = false
                console.warn(error);
              })
            } else {
              return false
            }
          },
          // 查看上传文件
          viewUploadFile (file) {
            let index = file.data.index
            let fileList = file.data.fileList
            let id = file.data.id
            let materialName = file.data.materialName
            let recruitPersonInfoId = this.id
            if (this.beforeUpload(file)) {
              this[fileList][index].loading = true
              let formData = new FormData()
              formData.append('uploadFile', file.file)
              formData.append('id', id)
              formData.append('materialName', materialName)
              formData.append('recruitPersonInfoId', recruitPersonInfoId)
              api(
                'againUpload',
                formData
              ).then(
                res => {
                  console.log('upload', res)
                  this.$message({ type: "success", message: "上传成功", duration: 2000 });
                  this[fileList][index].loading = false
                  this[fileList][index].url = res.url
                  this[fileList][index].realName = res.realName
                  this[fileList][index].name = res.name
                  this[fileList][index].id = res.id
                  this[fileList][index].status = res.status
                  this.checkAllPass()
                }
              ).catch(error => {
                this[fileList][index].loading = false
                console.warn(error);
              })
            } else {
              return false
            }
          },
          // 查看所有文件都上传并通过
          checkAllPass () {
            let result = this.viewFiles.every(ele => ele.status === 1)
            console.log('checkAllPass', result)
            if (result && this.applyType === 4) {
              this.viewAllPass()
            }
          },
          // 初始化保存
          submitInit() {
            console.log('submitInit', this.initFiles)
            let filterList = this.initFiles.filter(ele => ele.name)
            if (filterList.length === 0) {
              this.$message.error('请至少上传一个附件')
              return
            }
            let data = filterList.map(ele => {
              return {
                recruitPersonInfoId: this.id,
                materialName: ele.fileValue,
                name: ele.name,
                url: ele.url,
                realName: ele.realName,
                id: ele.id
              }
            })
            this.initLoading = true
            api(
              'archives',
              data
            ).then(
              res => {
                console.log('archives', res)
                this.initLoading = false
                this.$message({ type: "success", message: "初始化成功", duration: 2000 });
                this.resetInit()
                this.backToList()
              }
            ).catch(error => {
              console.warn(error);
              this.initLoading = false
            })
          },
          // 初始化重置
          resetInit () {
            this.initFiles.forEach(ele => {
              ele.name = ''
              ele.url = ''
              ele.realName = ''
            })
          },
          // 查看重置
          resetView () {
            this.resetReason()
            this.viewFiles.forEach(ele => {
              ele.name = ''
              ele.url = ''
              ele.realName = ''
              ele.id = ''
              ele.status = ''
            })
          },
          // 查看审核
          resetCheck () {
            this.checkFiles.forEach(ele => {
              ele.name = ''
              ele.url = ''
              ele.realName = ''
              ele.loading = false
              ele.id = ''
              ele.status = ''
              ele.check = false
              ele.uncheck = false
              ele.pass = false
            })
          },
          // 回到列表
          backToList () {
            this.$router.push({
              path:"entryManage"
            });
          },
          // 初始化
          getInitData () {
            this.initGetDataLoading = true
            api(
              'queryArchives',
                {
                  id: this.id
                }
            ).then(
              res => {
                console.log('getInitData', res)
                this.initGetDataLoading = false
                let list = res
                this.initFiles.forEach(file => {
                  let searchFile = list.filter(item => item.materialName === file.fileValue)
                  if (searchFile.length > 0) {
                    file.name = searchFile[0].name
                    file.url = searchFile[0].url
                    file.realName = searchFile[0].realName
                    file.id = searchFile[0].id
                  }
                })
              }
            ).catch(error => {
              this.initGetDataLoading = false
              console.warn(error);
            })
          },
          // 查看入职档案
          getViewData () {
            this.viewLoading = true
            api(
              'queryArchives',
                {
                  id: this.id
                }
            ).then(
              res => {
                console.log('getViewData', res)
                this.viewLoading = false
                let list = res
                this.viewFiles.forEach(file => {
                  let searchFile = list.filter(item => item.materialName === file.fileValue)
                  if (searchFile.length > 0) {
                    file.name = searchFile[0].name
                    file.url = searchFile[0].url
                    file.realName = searchFile[0].realName
                    file.id = searchFile[0].id
                    file.status = searchFile[0].status
                  }
                })
              }
            ).catch(error => {
              this.viewLoading = false
              console.warn(error);
            })
          },
          // 获取不通过理由
          getUnpassReason () {
            api(
              'checkEntryFileStatus',
                {
                  id: this.rowId
                }
            ).then(
              res => {
                console.log('res', res)
                this.unPassReason = res.examineVerifyReason
              }
            ).catch(error => {
              this.viewLoading = false
              console.warn(error);
            })
          },
          // 审核入职档案初始化
          getCheckData () {
            this.checkLoading = true
            api(
              'queryArchives',
                {
                  id: this.id
                }
            ).then(
              res => {
                console.log('getViewData', res)
                this.checkLoading = false
                let list = res
                this.checkFiles.forEach(file => {
                  let searchFile = list.filter(item => item.materialName === file.fileValue)
                  if (searchFile.length > 0) {
                    file.name = searchFile[0].name
                    file.url = searchFile[0].url
                    file.realName = searchFile[0].realName
                    file.id = searchFile[0].id
                    file.status = searchFile[0].status
                    file.check = searchFile[0].status === 1 ? true : false
                    file.uncheck = searchFile[0].status === 2 ? true : false
                    file.pass = searchFile[0].status === 1 ? true : false
                  }
                })
              }
            ).catch(error => {
              this.checkLoading = false
              console.warn(error);
            })
          },
          viewAllPass () {
            let accessories = this.viewFiles.map(ele => {
              return {
                id: ele.id,
                status: ele.status
              }
            })
            let data = {
              personInfoId: this.id,
              entryFileStatus: 3,
              examineVerifyReason: '',
              accessories: accessories
            }
            this.viewLoading = true
            api(
              'examineArchives',
              data
            ).then(
              res => {
                console.log('examineArchives', res)
                this.$message({ type: 'success', message: '审核已通过', duration: 2000, onClose: () => {} });
                this.viewLoading = false
                this.applyType == 3
                this.backToList()
              }
            ).catch(error => {
              console.warn(error);
              this.viewLoading = false
            })
          },
          // 审核
          submitCheck(flag) {
            console.log('submitCheck', this.checkFiles)
            let filterList = this.checkFiles.filter(ele => ele.name && (ele.check || ele.uncheck) && !ele.pass)
            let accessories = filterList.map(ele => {
              return {
                id: ele.id,
                status: ele.check ? 1 : 2
              }
            })
            let data = {
              personInfoId: this.id,
              entryFileStatus: flag ? 3 : 4,
              examineVerifyReason: this.reasonForm.examineVerifyReason,
              accessories: accessories
            }
            if (!flag) {
              this.reasonToolbar[1].loading = true
            } else {
              this.passLoading = true
            }
            api(
              'examineArchives',
              data
            ).then(
              res => {
                console.log('examineArchives', res)
                this.$message({ type: 'success', message: '操作成功', duration: 2000, onClose: () => {} });
                if (!flag) {
                  this.reasonToolbar[1].loading = false
                  this.closeReasonDialog()
                } else {
                  this.passLoading = false
                }
                this.backToList()
              }
            ).catch(error => {
              console.warn(error);
              if (!flag) {
                this.reasonToolbar[1].loading = false
                this.closeReasonDialog()
              } else {
                this.passLoading = false
              }
            })
          },
          // 审核不通过
          confirmReason () {
            this.$refs.reasonForm.validate((valid) => {
              if (valid) {
                this.submitCheck(false)
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          // 判断是图片还是文件
          isPhoto (str) {
            if (str) {
              let arr = str.split('.')
              let type = arr[arr.length - 1]
              let types = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG']
              return types.indexOf(type) !== -1
            }
            return false
          }
        }

    };
</script>

<style lang="less">
.apply-files {
  .init-table, .check-table, .view-table {
    margin: 10px 40px;
  }
  .download-all {
    margin: 0px 40px;
    text-align: right;
  }
  .el-icon-download {
    font-size: 18px;
    cursor: pointer;
  }
  .download-file:hover {
    color: #409EFF;
    cursor: pointer;
  }
  .upload-btn {
    display: inline-block; 
    margin-left: 10px;
  }
  .submit-btn {
    text-align: center;
    padding: 20px;
  }
  .header {
    text-align: center;
    border-bottom: 1px solid #ebeef5;
    padding: 20px 0px;
    color: #909399;
  }
  .header-cell {
    padding: 0px 10px;
  }
  .file-row {
    text-align: center;
    border-bottom: 1px solid #ebeef5;
  }
  .file-cell {
    padding: 10px;
  }
  .file-num {
    line-height: 70px;
  }
  .file-name {
    display: block;
    line-height: 40px;
  }
  .file-rule, .uploaded-text {
    color: #909399;
    font-size: 14px;
  }
  .file-upload {
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .text-left {
    text-align: left;
  }
  .line-mid {
    line-height: 70px;
  }
  .error {
    color: #e03636
  }
  .success {
    color: #5af580
  }
}
</style>
