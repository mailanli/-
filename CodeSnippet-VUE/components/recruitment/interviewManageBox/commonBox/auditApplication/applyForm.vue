<template>
  <div class="apply-form">
    <div v-if="isShowResult" style="background:#ffffcc;height:50px;margin-bottom:20px;line-height:50px;color:#990000;postion:relative">
      <i class="el-icon-warning" style="margin-left:20px;"></i>
      <span>当前职位申请表状态：</span>
      <span>{{auditForm.applyCondition.status}}</span>
      <span style="margin-left:20px;">理由：</span>
      <span>{{auditForm.applyCondition.reason}}</span>
      <el-button class="el-icon-download" style="font-size:16px;color:#409eff;position:absolute;right:20px;top:5px;" @click="downloadPDF">下载</el-button>
    </div>
    <div id="application-form">
      <div style="font-size:24px;font-weight:bolder;text-align:center;margin-bottom:10px;">{{applicationTitle}}-职位申请表</div>
      <el-form label-width="120px">
        <div class="apply-item-box" style="padding-top:10px">
          <el-row v-loading="loading">
              <el-col :span="6">
                <el-form-item label="申请职位：">
                  {{applicatedJob}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="要求薪金：">
                  {{form.salary ? form.salary : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否要求住宿：">
                  {{form.accommodation === 1 ? '不住' : '住'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="可到职时间：">
                  {{form.entranceTime ? form.entranceTime : '--'}}
                </el-form-item>
              </el-col>
          </el-row>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 136px; ">一、基本情况</div>
          <el-row v-loading="loading">
            <el-col :span="19">
              <el-col :span="6">
                <el-form-item label="姓  名：">
                  {{form.personInfo.name ? form.personInfo.name : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="曾用名：">
                  {{form.personInfo.formerName ? form.personInfo.formerName : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别：">
                  {{form.personInfo.genderName ? form.personInfo.genderName : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期：">
                  {{form.personInfo.birthday ? form.personInfo.birthday : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年龄：">
                  {{form.personInfo.age ? form.personInfo.age : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身高：">
                  {{form.personInfo.height ? form.personInfo.height : '--'}}(cm)
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="体重：">
                  {{form.personInfo.weight ? form.personInfo.weight : '--'}}(kg)
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="视力：">
                  {{form.personInfo.vision ? form.personInfo.vision : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="民族：">
                  {{form.personInfo.nation ? form.personInfo.nation : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="宗教信仰：">
                  {{form.personInfo.religious ? form.personInfo.religious : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="婚姻状况：">
                  {{form.personInfo.maritalStatus ? form.personInfo.maritalStatus : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="生育情况：">
                  {{form.personInfo.fertilityStatus ? form.personInfo.fertilityStatus : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="子女数：">
                  {{form.personInfo.numberOfChildren ? form.personInfo.numberOfChildren : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="政治面貌：">
                  {{form.personInfo.polity ? form.personInfo.polity : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="籍贯：">
                  {{form.personInfo.nativePlace ? form.personInfo.nativePlace : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="户口所在地：">
                  {{form.personInfo.prp ? form.personInfo.prp : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="户口性质：">
                  {{form.personInfo.householdRegisterNature ? form.personInfo.householdRegisterNature : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最高学历：">
                  {{form.personInfo.highestEducation ? form.personInfo.householdRegisterNature : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="专业：">
                  {{form.personInfo.majors ? form.personInfo.majors : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="职称：">
                  {{form.personInfo.title ? form.personInfo.title : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参加工作日期：">
                  {{form.personInfo.startWorkTime ? form.personInfo.startWorkTime : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否退伍军人：">
                  {{form.personInfo.veteranName ? form.personInfo.veteranName : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话：">
                  {{form.personInfo.phone ? form.personInfo.phone : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="家庭电话：">
                  {{form.personInfo.homePhone ? form.personInfo.homePhone : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="E-mail：">
                  {{form.personInfo.email ? form.personInfo.email : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="微信号：">
                  {{form.personInfo.wechat ? form.personInfo.wechat : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现住址：">
                  {{form.personInfo.correspondenceAddress ? form.personInfo.correspondenceAddress : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮编：">
                  {{form.personInfo.zipCode ? form.personInfo.zipCode : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证地址：">
                  {{form.personInfo.idCardAddress ? form.personInfo.idCardAddress : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号码：">
                  {{form.personInfo.idCardNumber ? form.personInfo.idCardNumber : '--'}}
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="5" class="photo-col">
              <img class="photo" :src="base64Code">
            </el-col>
          </el-row>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 136px; ">二、个人能力</div>
          <el-row v-loading="loading">
              <el-col :span="6">
                <el-form-item label-width='140px' label="国语：">
                  {{form.personalAbility.chinese ? form.personalAbility.chinese : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="粤语：">
                  {{form.personalAbility.cantonese ? form.personalAbility.cantonese : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="英语：">
                  {{form.personalAbility.english ? form.personalAbility.english : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他语言：">
                  {{form.personalAbility.otherLanguage ? form.personalAbility.otherLanguage : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width='140px' label="计算机能力：">
                  {{form.personalAbility.computerAbility ? form.personalAbility.computerAbility : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="驾驶执照：">
                  {{form.personalAbility.drivingLicense ? form.personalAbility.drivingLicense : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width='140px' label="其他专业资格：">
                  {{form.personalAbility.otherProfessional ? form.personalAbility.otherProfessional : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width='140px' label="个人专长与爱好：">
                  {{form.personalAbility.expertiseAndHobbies ? form.personalAbility.expertiseAndHobbies : '--'}}
                </el-form-item>
              </el-col>
          </el-row>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 136px; ">三、教育背景</div>
          <el-table v-loading="loading" ref="education" :data="form.educationBackground" stripe border class="table" max-height="450">
            <el-table-column label="起止时间" align="center" width="220">
              <template slot-scope="scope">
                {{scope.row.startDate + ' - ' + scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column prop="schoolName" label="学校名称"  align="center"></el-table-column>
            <el-table-column prop="majorName" label="专业"  align="center"></el-table-column>
            <el-table-column prop="educationLevel" label="学历"  align="center"></el-table-column>
            <el-table-column prop="formsOfLearning" label="学习方式"  align="center"></el-table-column>
            <el-table-column prop="degree" label="学位"  align="center"></el-table-column>
          </el-table>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 136px; ">四、工作履历</div>
          <el-table v-loading="loading" ref="education" :data="form.workHistory" stripe border class="table" max-height="450">
            <el-table-column label="起止时间" align="center" width="220">
              <template slot-scope="scope">
                {{scope.row.startDate + ' - ' + scope.row.endDate}}
              </template>
            </el-table-column>
            <el-table-column label="工作单位及部门" align="center" width="220">
              <template slot-scope="scope">
                {{scope.row.companyName + ' - ' + scope.row.department}}
              </template>
            </el-table-column>
            <el-table-column prop="jobTitle" label="职位"  align="center"></el-table-column>
            <el-table-column prop="salary" label="薪金"  align="center"></el-table-column>
            <el-table-column prop="reasonOfLeaving" label="离职原因"  align="center"></el-table-column>
            <el-table-column prop="workContent" label="主要工作内容"  align="center"></el-table-column>
            <el-table-column prop="referenceAndTel" label="证明人及联系电话"  align="center"></el-table-column>
          </el-table>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 136px; ">五、家庭背景</div>
          <el-table v-loading="loading" ref="education" :data="form.familyBackground" stripe border class="table" max-height="450">
            <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
            <el-table-column prop="relation" label="关系"  align="center"></el-table-column>
            <el-table-column prop="dateBirth" label="出生年月"  align="center"></el-table-column>
            <el-table-column prop="companyName" label="工作单位"  align="center"></el-table-column>
            <el-table-column prop="jobTitle" label="职位"  align="center"></el-table-column>
            <el-table-column prop="telephone" label="联系电话"  align="center"></el-table-column>
          </el-table>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 220px; ">六、与本集团员工关系</div>
          <el-table  v-loading="loading" ref="education" :data="form.employeeRelations" stripe border class="table" max-height="450">
            <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
            <el-table-column prop="relation" label="关系"  align="center"></el-table-column>
            <el-table-column prop="companyName" label="公司（楼盘）"  align="center"></el-table-column>
            <el-table-column prop="department" label="部门"  align="center"></el-table-column>
            <el-table-column prop="jobTitle" label="职位"  align="center"></el-table-column>
            <el-table-column prop="telephone" label="联系电话"  align="center"></el-table-column>
          </el-table>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 90px; ">七、其他</div>
          <el-row v-loading="loading">
              <el-col :span="6">
                <el-form-item label-width='140px' label="紧急情况联系人：">
                  {{form.other.emergencyContact ? form.other.emergencyContact : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width='140px' label="联系电话：">
                {{form.other.emergencyContactTel ? form.other.emergencyContactTel : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width='140px' label="与本人关系：">
                  {{form.other.relation ? form.other.relation : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width='140px' label="招聘信息来源：">
                  {{form.other.accommodation ? form.other.accommodation : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width='220px' label="健康状况-曾否受伤或施手术：">
                  {{form.other.injuryOrOperationStatusName ? form.other.injuryOrOperationStatusName : '--'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width='160px' label="健康状况-过往病史：">
                  {{form.other.pastMedicalHistory ? form.other.pastMedicalHistory : '--'}}
                </el-form-item>
              </el-col>
          </el-row>
        </div>
        <div class="apply-item-box">
          <div class="apply-title-box" style=" width: 180px; ">所附材料（附件）</div>
          <!-- Tabs页 -->
          <el-tabs v-model="activeName" style="padding: 10px;" v-loading="loading">
            <el-tab-pane v-for="(tab, index) of form.accessories" :label="tab.label" :name="tab.materialName" :key="index">
              <span @click='preview(tab)' style="color:#409EFF;cursor: pointer;">
                {{tab.name}}
              </span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
    </div>
    <div v-if="isShowAudit" style="margin-bottom:20px;height:60px;">
      <span style="margin-right:20px;line-height:60px;margin-left:350px;">职位申请表审核:</span>
      <el-button type="primary" @click="auditIsPass(5)">审核不通过</el-button>
      <el-button type="primary" @click="auditIsPass(4)">审核通过</el-button>
    </div>
    <!-- 预览 -->
    <preview-file ref="previewFile"></preview-file>
    <!-- 审核不通过的理由 -->
    <a-dialog title="审核不通过" v-model="auditDialogVisible" :toolbar="auditToolbar" width="20%">
      <el-form ref="auditForm" :rules="rules" :model="auditForm">
        <el-form-item prop="applyCondition.noPassReason">
          <el-input v-model="auditForm.applyCondition.noPassReason" placeholder="请填写审核不通过理由"></el-input>
        </el-form-item>
      </el-form>
    </a-dialog>
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
        data(){
            return {
              auditForm: {
                applyCondition:{
                  status: '',
                  reason: '',
                  noPassReason: ''
                }
              },
              auditToolbar: [
                {
                  text: '取消',
                  type: 'defualt',
                  func: (done) => {
                    this.auditCancel(done)
                  }
                },
                {
                  text: '确定',
                  loading: false,
                  func: (done) => {
                    this.auditConfirm(done)
                  }
                }
              ], 
              applicationTitle: '',
              loading: false,
              isShowResult: false,
              isShowAudit: false,
              status: false,
              personId: null,
              auditDialogVisible: false,
              wrapId: '',
              applicatedJob: '',
              form: {
                basicInfo: {},
                personInfo: {},
                personalAbility: [],
                educationBackground: [], 
                workHistory: [],
                familyBackground: [],
                employeeRelations: [],                     
                other: {},
                accessories:[],
                department:{},
                positions:{}
              },
              rules: {
                'applyCondition.noPassReason': [{ required: true, message: '请输入审核不通过理由', trigger: 'blur' }]
              },
              activeName: '离职证明',
              tapsDic: [
                {label: '离职证明', value: 'separationCertificate'},
                {label: '学历证书', value: 'graduationCertificate'},
                {label: '学位证书', value: 'degreeCertificate'},
                {label: '职称或等级证书', value: 'gradeCertificate'},
                {label: '身份证', value: 'idCard'},
                {label: '个人简历', value: 'resume'},
                {label: '健康证或体检表', value: 'examinationTable'},
                {label: '其他', value: 'other'},
              ],
              base64Code: ''
            }
        },
        watch: {
          '$route': {
            handler: function(val, oldVal) {
              this.$nextTick(() => {
                  bus.$emit('tabTick')
                })
            },
            immediate: true,
            deep: true
          }
        },
        methods: {
          init (val){
            this.resetForm()
            this.applicationTitle = val.name
            this.queryData(val.id)
            this.auditForm.applyCondition.status = val.status
            this.auditForm.applyCondition.reason = val.reason
            this.wrapId = val.wrapId
            this.applicatedJob = val.applicatedJob
            console.log('this.applicatedJob',this.applicatedJob)
            console.log('status',val.status)
            if(val.status === '不通过'){
              this.isShowResult = true
            }else if(val.status === '待审核'){
              this.isShowAudit = true
            }
          }, 
          // 重置表单
          resetForm () {
            this.form = {
              basicInfo: {},
              personInfo: {},
              personalAbility: [],
              educationBackground: [], 
              workHistory: [],
              familyBackground: [],
              employeeRelations: [],                     
              other: {},
              accessories:[],
              department:{},
              positions:{}
            }
          },
          queryData(personId) {
            this.personId = personId
            let data = {
              id: personId
            }  
            this.loading = true
            console.log('queryData', data)
            api('applicationAudit',data).then(res => {
              if (res.code === 0) {
                this.loading = false 
                this.getPhotoData(res.data.accessories)
                let copyData = this.dealData(res.data)                         
                this.form = Object.assign({}, copyData)
                console.log('this.form', this.form)
                this.activeName = this.form.accessories[0].materialName
              }
            }).catch(err => {
              this.loading = false
            })
          } , 
          //处理附件名数据
          dealData(data){
            let arr = data.accessories
            arr.forEach(item => {
              this.tapsDic.forEach(ele => {
                if (ele.value === item.materialName) {
                  item.label = ele.label
                }
              });
            });
            data.accessories = arr.filter(item => item.label)
            return data
          },   
          // 获取图片
          getPhotoData (list) {
            let target = list.filter(item => item.materialName === 'oneInchPhotos')
            if (target.length > 0) {
              this.base64(target[0].realName)
            }
          },
          // 获取图片Base64码
          base64(name) {
            api(
              'base64',
                {
                  ossFileName: name
                }
            ).then(
              res => {
                this.base64Code = res
              }
            ).catch(error => {
              console.warn(error);
            })
          },  
          //下载附件
          download (tab){
            let isPhoto = this.isPhoto(tab.name)
            if (isPhoto) {
              this.previewShow = true
              this.previewSrc = tab.url
            } else {
              window.open(tabpreview.url, '_blank')
            }
          },
          // 预览
          preview (file) {
            console.log('file', file)
            if (file.name && file.url) {
              this.$refs.previewFile.preview(file.name, file.url)
            }
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
          },
          downloadPDF() {
            this.getPdf('application-form', `${this.applicationTitle}-职位申请表`)
          },  
          //取消审核
          auditCancel(done){
            done()
          },
          //审核确认
          auditConfirm(done){
            this.audit().then(res => {
              if (res) {
                this.showMessage('success', '审核成功')
                done()
                this.$router.push({
                  path:"interviewManage",                 
                })
                bus.$emit('auditSuccess')
              }
            })
          },
          audit(){
            let data = {
              id: this.wrapId,
              jobsApplicationStatus: 5,
              examineVerifyReason: this.auditForm.applyCondition.noPassReason
            } 
            return new Promise(resolve => {
              this.$refs.auditForm.validate().then(valid => {
                if (valid) {                        
                  api('auditApplyForm', data).then(res => {
                    if (res.code === 0) {  
                      this.loading = false
                      this.showMessage('success','审核成功!') 
                      this.$router.push({
                        path:"interviewManage",               
                      })
                      bus.$emit('auditSuccess')
                      resolve(true)
                    } else {
                      this.loading = false
                      resolve(false)
                    }
                  }).catch(err => {
                    this.loading = false
                    resolve(false)
                  })                              
                }
              })  
            })
          },
          //审核是否通过
          auditIsPass(val) {          
            if(val === 5){
              this.auditDialogVisible = true              
            } else if(val === 4){
              let data = {
                id: this.wrapId,
                jobsApplicationStatus: 4,
              } 
              api('auditApplyForm',data).then(res => {
                this.loading = true
                if (res.code === 0) {
                  this.loading = false
                  this.showMessage('success','审核成功!') 
                  this.$router.push({
                    path:"interviewManage",                
                  })
                  bus.$emit('auditSuccess')                               
                }
              }).catch(err => {
                this.loading = false
              })
            }                          
          }
        }
    }
</script>

<style lang="less" scoped>
.el-select{
  width: 100%;
}
.apply-form {
  .table {
    margin-bottom: 20px;
  }
  .photo-col {
    padding-top: 10px;
    text-align: center;
  }
  .photo {
    width: 140px;
  }
  .apply-title-box {
    margin: 15px;
    color: #48576a;
    font-size: 22px !important;
    padding-bottom: 1px;
    border-bottom: 1px solid #48576a;
  }
  .apply-item-box {
    width: auto !important;
    min-height: 40px !important;
    margin-left: 0 !important;
    border: 1px dashed #bebebe;
    padding: 0 10px;
    margin-bottom: 20px;
  }
}
</style>
