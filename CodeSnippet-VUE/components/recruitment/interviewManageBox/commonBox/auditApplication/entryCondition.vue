<template>
  <div class="apply-form">
    <el-form label-width="120px" v-loading="loading">
      <div class="apply-item-box" style="padding-top:10px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="录用结果:">
              {{form.results === 1 ? '录用' : form.results === 2 ? '不录用' : '--'}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="录用部门:">
              {{ form.department ? entryPosition ? entryPosition : '--' : '--'}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="录用职位:">
              {{ form.positions ? form.positions.positionName ? form.positions.positionName : '--' : '--'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:">
              {{form.remarks ? form.remarks : '--'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="建议入时间:">
              {{form.recommendedEntryTime ? form.recommendedEntryTime : '--'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="面试评估表:">
              <span @click='preview(form.accessories)' style="color:#409EFF;cursor: pointer;">
                {{form.accessories ? form.accessories.name ? '面试评估表.png' : '--' : '--'}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评估时间:">
             {{form.createdTime ? form.createdTime : '--'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
             <el-form-item></el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请职位:">
              {{applicationJob ? applicationJob : ''}}
            </el-form-item>
          </el-col>
        </el-row>
      </div>     
    </el-form>
    <!-- 预览 -->
    <preview-file ref="previewFile"></preview-file>
  </div>
</template> 

<script>
  import api from '@/api/interviewManage';
  import bus from '@/components/common/bus.js'
  import previewFile from "@/components/recruitment/components/previewFile.vue";

  export default {
    components: {
      previewFile
    },
    data() {
      return {
        loading: false,
        applicationJob: '',
        entryPosition: '',
        form: {
          remarks: '',
          results: '',
          createdTime: '',
          recommendedEntryTime: '',
          department: {
            companyType: '',
            areaCompany: '',
            propertyCompany: '',
            departmentName1: '',
            departmentName2: '',
            departmentName3: ''
          },
          positions: {
            positionName: ''
          },
          accessories:{
            url: '',
            name: '',
            materialName: ''
          }
        }

      }
    },
    methods:{
      init(val) {
        this.resetForm()
        this.getEntryConditionData(val.id)
        this.applicationJob = val.applicatedJob
      },
      // 重置表单
      resetForm () {
        this.form = {
          remarks: '',
          results: '',
          createdTime: '',
          recommendedEntryTime: '',
          department: {
            companyType: '',
            areaCompany: '',
            propertyCompany: '',
            departmentName1: '',
            departmentName2: '',
            departmentName3: ''
          },
          positions: {
            positionName: ''
          },
          accessories:{
            url: '',
            name: '',
            materialName: ''
          }
        }
      },
      // 预览
      preview (file) {
        console.log('file', file)
        if (file.name && file.url) {
          this.$refs.previewFile.preview(file.name, file.url)
        }
      },
      //处理申请部门数据
      dealDepData(val){
        val.companyType = val.companyType ? val.companyType : '' 
        val.areaCompany = val.areaCompany ? val.areaCompany : '' 
        val.propertyCompany = val.propertyCompany ? val.propertyCompany : '' 
        val.departmentName1 = val.departmentName1 ? val.departmentName1 : '' 
        val.departmentName2 = val.departmentName2 ? val.departmentName2 : '' 
        val.departmentName3 = val.departmentName3 ? val.departmentName3 : ''    
      },
      //查看录用情况
      getEntryConditionData(val){
        return new Promise(resolve => {                    
          let data =  { personId: val }   
          api('getEntryCondition', data).then(res => {
            this.loading = true
            console.log('res', res)
            if (res.code === 0) {
              this.loading = false
              this.dealDepData(res.data.department) 
              res.data.createdTime = res.data.createdTime ? this.$moment(res.data.createdTime).format('YYYY-MM-DD') : ''                     
              this.form = Object.assign({},res.data)  
              console.log('this.form1',this.form)           
              this.entryPosition = `${this.form.department.companyType}${this.form.department.areaCompany}${this.form.department.propertyCompany}${this.form.department.departmentName1}${this.form.department.departmentName2}${this.form.department.departmentName3}`
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch(err => {
            console.log('catch',err)
            this.loading = false
            resolve(false)
          })                              
        })
      }

    },


  }
</script>

<style lang="less" scoped>


</style>
