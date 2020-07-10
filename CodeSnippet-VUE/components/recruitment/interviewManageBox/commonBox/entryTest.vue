<template>
    <div>
        <el-form ref="entryTest" :rules="rules" :model="entryTestForm" label-width="120px" v-loading="loading">
          <el-form-item label="录用结果" prop="results" >
            <el-radio-group v-model="entryTestForm.results" @change="isEntry()">
              <el-radio label="录用" value='1'></el-radio>
              <el-radio label="不录用" value='2'></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="录用部门" prop="department.departmentName" v-if="isEntryDepart" >
            <el-input readonly  placeholder="请选择申请职位部门" v-model="entryTestForm.department.departmentName" clearable>
              <el-button slot="append" icon="el-icon-search" @click="selectDepartment"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="录用职位" prop="positionIds" v-if="isEntryJob">
            <el-select v-model="entryTestForm.positionIds"  placeholder="请选择申请职位" clearable>
                <el-option
                  v-for="item in entryTestForm.positions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="建议入职时间" prop="recommendedEntryTime" v-if="isEntryTime">
            <el-date-picker
              v-model="entryTestForm.recommendedEntryTime"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format='yyyy-MM-dd'
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" prop="remarks" v-model="entryTestForm.remarks"></el-input>
          </el-form-item>
          <el-form-item label="面试评估表" v-if="isTable">
            <!-- <div v-if="file">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="apiServer" 
                :file-list="fileList"
                :http-request="reUploadFile" 
                :auto-upload="true">
                <el-button slot="trigger" size="small" type="primary">重新上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过50M</div>
              </el-upload>
            </div>
            <div v-else>
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="apiServer" 
                :file-list="fileList"
                :http-request="uploadFile" 
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :auto-upload="true">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过50M</div>
              </el-upload>
            </div> -->
            <div v-if="fileObj.name">
              <span class="uploaded-text">{{fileObj.name}}</span>
              <el-upload 
              class="upload-btn" 
              :show-file-list='false'
              :action="apiServer" 
              :http-request="uploadFile">
                  <el-button size="small" type="default" :loading="fileObj.loading" :disabled="fileObj.loading">重新上传</el-button>
              </el-upload>
            </div>
            <div v-else>
              <el-upload 
              class="upload-btn" 
              :show-file-list='false'
              :action="apiServer" 
              :http-request="uploadFile" >
                  <el-button size="small" type="default" :loading="fileObj.loading" :disabled="fileObj.loading">点击上传</el-button>
              </el-upload>
            </div>
          </el-form-item>         
        </el-form>
        <a-organ 
          @selectDtata="organData" 
          v-if="showOrgan" 
          :isShow.sync="showOrgan"
          :hideEmployee='false'
        >
        </a-organ>
    </div>
</template>
<script>
import api from '@/api/interviewManage'

export default {
  name: 'entryTest',
  props: {
    rowData1: {}
  },
  data() {
    return{
      loading: false,
      showOrgan: false,
      entryTestForm:{
        results: null,
        positionIds: '',
        positions: [],
        recommendedEntryTime: '',
        department: {
          departmentId: '',
          departmentName: ''
        },
        remarks: ''
      },
      isEntryDepart: true,
      isEntryJob: true,
      isEntryTime: true,
      isTable: true,
      apiServer: '',      
      rules: {
        results: [{ required: true, message: '请选择录用结果'}],
        'department.departmentName': [{ required: true, message: '请选择录用部门' ,trigger: 'change'}],
        positionIds: [{ required: true,message:'请选择录用职位',trigger: 'change'}],
        recommendedEntryTime: [{ required: true, message: '请选择建议入职时间', trigger: 'blur'}],        
      },
      file: '',
      fileList: [],
      fileUrl: '',
      fileName: '',
      fileRealName: '',
      //  
      fileObj: {
        name: '',
        url: '',
        fileRealName: '',
        loading: false
      }

    }
  },
  mounted(){
    this.getPositions()
  },
  methods:{
    //打开选择部门选择器
    selectDepartment () {
      this.showOrgan = true
      // this.type = type
    },
    // 获取部门数据
    organData (data) {
      // console.log('organData', data)
      if (data.organ.length === 0) {
        return
      }else{
        this.entryTestForm.department.departmentName = data.organ[0].unitName
        this.entryTestForm.department.departmentId = data.organ[0].fullUnitCode
        // console.log(this.departmentName)
        // console.log(this.searchForm.department.departmentId)
      }           
    },
    //获取录用职位数据
    getPositions(){
      api(
        'positions',
        null
      ).then(
        res => {
          this.entryTestForm.positions = res.data.map(ele => {
            return {
              label: ele.positionName,
              value: ele.positionId
            }
          })
        }
      ).catch(error => {
        console.warn(error);
      })
    },
    isEntry() {
      console.log(this.entryTestForm.results )
      if(this.entryTestForm.results === '不录用'){
        this.isEntryDepart = false
        this.isEntryJob = false
        this.isEntryTime = false
        this.isTable = false
      }
      else{
        this.isEntryDepart = true
        this.isEntryJob = true
        this.isEntryTime = true
        this.isTable = true
      }
    },
    //上传校验
    beforeUpload (file) {
      // console.log('beforeUpload', file)
      let maxSize = 50
      if(file.file.size >= 50 * 1024 * 1024){//2097152B =2048KB = 2MB
        this.showMessage('error',`上传文件不能超过50MB`)
        return false
      }
      let arr = file.file.name.split('.')
      let type = arr[arr.length - 1]
      let types = ['jpg','png']
      if (types.indexOf(type) === -1) {
        this.showMessage('error',`请上传jpg,png文件`)
        return false
      }
      return true
    },
    //上传
    uploadFile (file) {
      this.file = file.file.name
      console.log('file', file)
      if (this.beforeUpload(file)) {
        let formData = new FormData()
        formData.append('uploadFile', file.file)
        this.fileObj.loading = true
        console.log('formData',formData)
        api('upload',formData).then(res => {
          console.log('upload', res)
          this.$message({ type: "success", message: "上传成功", duration: 2000 });
          this.fileObj.url = res.data.fileUrl
          this.fileObj.fileRealName = res.data.fileRealName
          this.fileObj.name = res.data.name
          this.fileObj.loading = false
        }).catch(error => {
          this.fileObj.loading = false
          console.warn(error);
        })
      }
       else {
        return false
      }
    },
    //重新上传
    reUploadFile(file){
      this.file = file.file.name
      console.log('file', file)
      if (this.beforeUpload(file)) {
        let formData = new FormData()
        formData.append('uploadFile', file.file)
        this.fileObj.loading = true
        console.log('formData',formData)
        api('upload',formData).then(res => {
          console.log('upload', res)
          this.$message({ type: "success", message: "上传成功", duration: 2000 });
          this.fileObj.url = res.data.fileUrl
          this.fileObj.fileRealName = res.data.fileRealName
          this.fileObj.name = res.data.name
          this.fileObj.loading = false
        }).catch(error => {
          this.fileObj.loading = false
          console.warn(error);
        })
      }
       else {
        return false
      }
    },
    handleExceed(files, fileList) {

    },
    beforeRemove(file,fileList){
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
     handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    entryConfirm(){
      return new Promise(resolve => {
        this.$refs.entryTest.validate().then(valid => {
          if (valid) {             
            let data =  
              {
                personInfo: {
                  id: this.rowData1.personInfo.id
                },
                results: this.entryTestForm.results==='不录用' ? 2 : 1,
                positions: {
                  positionId: this.entryTestForm.positionIds
                },
                recommendedEntryTime: this.entryTestForm.recommendedEntryTime,
                department: {
                  departmentId: this.entryTestForm.department.departmentId
                },
                accessories: {
                  realName: this.fileObj.fileRealName ? this.fileObj.fileRealName : '',
                  url: this.fileObj.url ? this.fileObj.url : '',
                  name: this.fileObj.name ? this.fileObj.name : '',
                  materialName: 'interviewAssessment'
                },
                remarks: this.entryTestForm.remarks
              }   
            
            api('entryConfirm', data).then(res => {
              this.loading = true
              if (res.code === 0) {
                this.loading = false
                resolve(true)
              } else {
                resolve(false)
              }
            }).catch(err => {
              this.loading = false
              resolve(false)
            })                              
          }
        })
      })
    }
  }
}
</script>
<style less="lang" scoped>

</style>


