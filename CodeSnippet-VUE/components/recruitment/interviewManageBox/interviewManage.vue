<template>
  <div>
    <div class="page-agreement">
      <bread-crumb></bread-crumb>
      <a-form 
        :formData="searchForm"
        @search="search" 
        @reSet="reSet">
          <el-row>
            <el-form-item label="姓名">
              <el-input v-model="searchForm.personInfo.name" placeholder="请输入姓名" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="searchForm.personInfo.phone" placeholder="请输入手机号码" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="申请职位部门">
              <el-input readonly  placeholder="请选择申请职位部门" v-model="departmentName" clearable style="width:200px;">
                <el-button slot="append" icon="el-icon-search" @click="selectDepartment"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="申请职位">
              <!-- <a-select 
                v-model="searchForm.positionIds"
                :apiName="item.apiName"
                :props="item.props"
                :params="item.params"
                placeholder='请选择申请职位'
              ></a-select> -->
              <el-select v-model="searchForm.positionIds"  placeholder="请选择申请职位" clearable>
                <el-option
                  v-for="item in positions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划面试时间">
              <el-date-picker
                v-model="searchForm.scheduleInterviewTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format='yyyy-MM-dd HH:mm:ss'
                style="width:200px;"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="至">
              <el-date-picker
                v-model="searchForm.scheduleInterviewTimeEnd"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
                value-format='yyyy-MM-dd HH:mm:ss'
                style="width:200px;"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="邀约状态">
              <el-select v-model="searchForm.invitationStatus"  placeholder="请选择邀约状态" clearable>
                <el-option
                  v-for="item in searchList.select1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请表状态">
              <el-select v-model="searchForm.jobsApplicationStatus" placeholder="请选择申请表状态" clearable>
                <el-option
                  v-for="item in searchList.select2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="录用情况">
              <el-select v-model="searchForm.employmentStatus" placeholder="请选择录用情况" clearable>
                <el-option
                  v-for="item in searchList.select3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </a-form>
        
        <a-table
          @handleCurrentChange="handleCurrentChange" 
          @handleSizeChange="handleSizeChange"
          @row-dblclick="handleSelectionRow" 
          @handleSelectionChange="handleSelectionChange" 
          :loading="loading"
          :buttonList="buttonList" 
          :table="page" 
          :data="tableData"
        >
          <el-table-column type="selection" width="55" align="center" ></el-table-column>         
          <el-table-column
            v-for="(item,index) in columnList"
            :key="index + item"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sort"
            :width="item.width"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.jobsApplicationStatusName === '不通过' || scope.row.jobsApplicationStatusName === '已通过'" @click="handleSearch(scope.row)">查看</el-button>
              <el-button type="text" size="small" v-if="scope.row.jobsApplicationStatusName === '待审核'" @click="handleSearch(scope.row)">审核</el-button>
              <el-button type="text" size="small" v-if="scope.row.employmentStatusName === '待评估'" @click="openEntryTest(scope.row)">录用评定</el-button>
            </template>
          </el-table-column>
        </a-table>         
        <div style="font-size: 12px; text-align: center; padding: 10px; color: gray;">CopyRight @ 碧桂园物业 {{new Date().getFullYear()}}</div>

    </div>
    <!-- 新增面试人员模态框 -->
    <a-dialog title="新增" v-model="addInterviewer.dialogVisible" :toolbar="addInterviewer.toolbar" width="40%">
      <add-interviewer ref="addInterviewer"></add-interviewer>
    </a-dialog>

    <!-- 修改模态框 -->
    <a-dialog title="修改" v-model="modifyInterviewMsg.dialogVisible" :toolbar="modifyInterviewMsg.toolbar" width="40%">
      <modify-interview-msg ref="modifyInterviewMsg" :rowData="rowData" :positions="positions"></modify-interview-msg>
    </a-dialog>
    <!-- 录用评估模态框 -->
    <a-dialog title="录用评定" v-model="entryTest.dialogVisible" :toolbar="entryTest.toolbar" width="40%">
      <entry-test ref="entryTest" :rowData1="rowData1"></entry-test>
    </a-dialog>
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
  import common from '@/mixins/common.js'
  import breadCrumb from "@/components/breadCrumb.vue";
  import api from '@/api/interviewManage';
  import addInterviewer from './commonBox/addInterviewer.vue'
  import modifyInterviewMsg from './commonBox/modifyInterviewMsg.vue'
  import entryTest from './commonBox/entryTest.vue'
  import bus from '@/components/common/bus.js'
import { posix } from 'path';

  export default {
        mixins: [common],
        components: {breadCrumb, addInterviewer, modifyInterviewMsg, entryTest},
        data(){
            return {   
              apiConfig: {
                req: api,
                fncName: 'getList'
              },
              showOrgan: false,
              isOperaBtn1: true,
              isOperaBtn2: true,
              isOperaBtn3: true,
              departmentName: '',
              positions: [],
              //表单数据配置
              searchForm: 
                {
                  personInfo:{
                    name: '',
                    phone:'',
                  },
                  department:{
                    departmentId: '',
                  },
                  positionIds: '',
                  scheduleInterviewTime: '',
                  scheduleInterviewTimeEnd: '',
                  
                  invitationStatus: 0,
                  jobsApplicationStatus: 0,
                  employmentStatus: 0
                },
                pickerOptions1: {
                shortcuts: [ {
                  text: '一周前',
                  onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                  }
                }]
              },
              searchList:{
                select1: [
                  {
                  value: 0,
                  label: '所有'
                }, {
                  value: 1,
                  label: '待邀约'
                }, {
                  value: 2,
                  label: '已邀约'
                }, {
                  value: 3,
                  label: '被爽约'
                }],
                select2: [
                  {
                  value: 0,
                  label: '所有'
                }, {
                  value: 1,
                  label: '-'
                }, {
                  value: 2,
                  label: '待提交'
                }, {
                  value: 3,
                  label: '待审核'
                }, {
                  value: 4,
                  label: '已通过'
                }, {
                  value: 5,
                  label: '不通过'
                }],
                select3: [
                  {
                  value: 0,
                  label: '所有'
                }, {
                  value: 1,
                  label: '-'
                }, {
                  value: 2,
                  label: '待评估'
                }, {
                  value: 3,
                  label: '不录用'
                }, {
                  value: 4,
                  label: '已录用'
                }],
              },
              loading: false,
              //表格数据配置
              tableData: [],
              columnList: [
                {label: '姓名',prop: 'name',width: '80'},
                {label: '性别',prop: 'genderName',width: '60'},
                {label: '手机号码',prop: 'phone',width: '120'},
                {label: '申请职位',prop: 'applicatedJob'},
                {label: '计划面试时间',prop: 'scheduleInterviewTime'},
                {label: '邀约状态',prop: 'invitationStatus',width: '80'},
                {label: '申请表状态',prop: 'jobsApplicationStatus',width: '100'},
                {label: '录用情况',prop: 'employmentStatus',width: '80'}
              ],
              rowData: [],
              rowData1: [],
              buttonList: [
                {
                  text: '新增面试人员',
                  func: () => {
                    this.addBtn()
                  }
                },
                {
                  text: '职位申请邀约/重发',
                  func: () => {
                    this.jobApplyInvite()
                  }
                },
                {
                  text: '删除',
                  func: () => {
                    this.openDeleteDialog()
                  }
                },
                {
                  text: '修改',
                  func: () => {
                    this.modify()
                  }
                },
                {
                  text: '爽约',
                  func: () => {
                    this.openBreakConfirmDialog()
                  }
                },
              ],              
              addInterviewer:{
                dialogVisible: false,
                toolbar: [
                  {
                    text: '取消',                    
                    type: 'defualt',
                    func: (done) => {
                      this.addCancel(done)
                    }
                  },
                  {
                    text: '确定提交',
                    loading: false,
                    func: (done) => {
                      this.addConfirm(done)
                    }
                  }
                ],             
              },
              modifyInterviewMsg:{
                dialogVisible: false,
                toolbar: [
                  {
                    text: '取消',
                    type: 'defualt',
                    func: (done) => {
                      this.modifyCancel(done)
                    }
                  },
                  {
                    text: '确定提交',
                    loading: false,
                    func: (done) => {
                      this.modifyConfirm(done)
                    }
                  }
                ],   
              },
              entryTest:{
                dialogVisible: false,
                toolbar: [
                  {
                    text: '取消',
                    type: 'defualt',
                    func: (done) => {
                      this.testCancel(done)
                    }
                  },
                  {
                    text: '确定提交',
                    loading: false,
                    func: (done) => {
                      this.testConfirm(done)
                    }
                  }
                ],   
              },                                                
              ctlId:'0',
              pageInfo: {
                pageIndex: 1,
                pageSize: 10,
                total: 0
              },
              addDialogVisible: false,
            }
        },
        created(){
          bus.$on('auditSuccess',this.search)
        },
        mounted() {
          // 获取职位
          this.getPositions()
        },
        destoryed () {
          bus.$off('auditSuccess', this.search)
        },
        methods: {
          // 计划面试时间格式化 单位数前面加零
          // addZero(num){
          //   if(num<10)
          //     return "0" + num;
          //   return num;
          // }, 
          // 计划面试时间格式化    
          // timeFormat(item) {
          //   let date = new Date(item)
          //   return `${date.getFullYear()}-${this.addZero((date.getMonth() + 1))}-${this.addZero(date.getDate())} ${this.addZero(date.getHours())}:${this.addZero(date.getMinutes())}:${this.addZero(date.getSeconds())}`
          // },
          selectDepartment () {
            this.showOrgan = true
          },
          // 
          organData (data) {
            if (data.organ.length === 0) {
              return
            }else{
              this.departmentName = data.organ[0].unitName
              this.searchForm.department.departmentId = data.organ[0].fullUnitCode
              console.log(this.departmentName)
              console.log(this.searchForm.department.departmentId)
            }           
          },
          getPositions(){
            api(
              'positions',
              null
            ).then(
              res => {
                console.log('positions', res)
                this.positions = res.data.map(ele => {
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
          //处理后端响应的数据
          actionData (data) {
            console.log('actionData', data)
            return data.map(item => {
              item.name = item.personInfo ? item.personInfo.name : ''
              item.genderName = item.personInfo ? item.personInfo.genderName : ''
              item.phone = item.personInfo ? item.personInfo.phone  : ''
              item.applicatedJob = this.dealApplicatedJob(item)
              item.invitationStatus = item.invitationStatusName
              item.jobsApplicationStatus = item.jobsApplicationStatusName
              item.employmentStatus = item.employmentStatusName            
              return item
            })
          },
          dealApplicatedJob (item) {
            let result = []
            let departments = item.departmentList ? item.departmentList : []
            let positions = item.positions ? item.positions : []
            console.log('dealApplicatedJob', item)
            if (departments.length !== positions.length) {
              return
            }
            departments.forEach((ele, index) => {
              result[index] = `${this.getDepartmentName(ele)}-${positions[index].positionName}`
            })
            return result.join(';')
          },
          getDepartmentName (dep) {
            console.log('getDepartmentName', dep)
            let list = ['companyType', 'areaCompany', 'propertyCompany', 'departmentName1', 'departmentName2', 'departmentName3']
            let result = ''
            list.forEach((item, index) => {
              result += dep[item] ? dep[item] : ''
            })
            return result
          },
          //打开新增弹窗
          addBtn(){
            this.addInterviewer.dialogVisible = true
          },
          //新增确认
          addConfirm(done) {
            this.$refs.addInterviewer.add().then(res => {
              if (res) {
                console.log(done)
                this.showMessage('success', '保存成功')
                done()
                this.search()
              }
            })
          },
          //新增取消
          addCancel (done) {
            done()
          },
          //职位申请邀约/重发  jobsApplicationStatus   3   4  不   invitationStatus  3 不 
          jobApplyInvite(){
            let jobsApplicationStatusName = []
            let invitationStatusName = []
            this.rowData.forEach(item => {
              jobsApplicationStatusName.push(item.jobsApplicationStatusName)
              invitationStatusName.push(item.invitationStatusName)
            })
            if( this.rowData.length === 0){
              this.showMessage('warning','请至少选择一条数据进行职位申请邀约!')
            }else if(jobsApplicationStatusName.some(item=>{return item === '待审核' || item === '已通过'})){
              this.showMessage('warning','申请表状态为【待审核】和【已通过】的数据不能进行职位申请邀约!')                
            }else if(invitationStatusName.some(item=>item === '被爽约')){
              this.showMessage('warning','邀约状态为【被爽约】的数据不能进行职位申请邀约!')                                
            }else{
              let data = []
              this.rowData.forEach(item => {                    
                data.push({
                  id: item.personInfo.id,
                  phone: item.personInfo.phone,
                  name: item.personInfo.name,
                  gender: item.personInfo.gender
                })           
              })         
              api('messageSend',data).then(res => {
                  if (res.code === 0) {
                    this.showMessage('success','邀约短信已成功下发')
                    this.search()
                  }
              }).catch(err => {

              })
            }                       
          },
          //删除
          openDeleteDialog() {
            let invitationStatusList = []
            let personInfoIds = []
            if( this.rowData.length === 0 ){
              this.showMessage('warning','请至少选择一条数据进行删除!')
            }else{
              this.rowData.forEach(item => {
                invitationStatusList.push(item.invitationStatusName)
                personInfoIds.push(item.personInfo)
              })
              personInfoIds = personInfoIds.map(item => item.id).join(',')
                console.log(personInfoIds)

              if(invitationStatusList.some(item =>{return item !== '待邀约'})){
                this.showMessage('warning','请选择邀约状态为【待邀约】的数据进行删除!')
              }else{
                this.confirmPopover('warning', `是否确认删除？`, () => {
                  let data = {
                      interviewIds: this.rowData.map(item => item.id).join(','),
                      personIds: personInfoIds
                  }
                  api('delete',data).then(res => {
                    if (res.code === 0) {
                      this.showMessage('success','删除成功!')
                      this.search()  
                    }
                  }).catch(err => {
                    this.showMessage('success','已取消删除')
                    resolve(true)
                  })
                })
              }
            }               
          },
          //修改
          modify(){
            if( this.rowData.length !== 1 ) {
              this.showMessage('warning', `请选择一条数据进行修改`)
              return false
            }else{
              this.modifyInterviewMsg.dialogVisible=true
            }
          }, 
          //修改确认   
          modifyConfirm(done) {
            this.$refs.modifyInterviewMsg.modify().then(res => {
              if (res) {
                console.log(done)
                this.showMessage('success', '修改成功')
                done()
                this.search()
              }
            })
          },
          //修改取消
          modifyCancel(done) {
            done()
          },
          //爽约
          openBreakConfirmDialog() {
            let statusList = []
            if(this.rowData.length === 0) {             
              this.showMessage('warning','请选择邀约状态为【待提交】或【不通过】的数据进行爽约处理!')
            }else{
              this.rowData.forEach(item => {
                statusList.push(item.jobsApplicationStatusName)
              })
              if(statusList.some(item => {return item !== '待提交' && item !== '不通过'})){
                this.showMessage('warning','请选择邀约状态为【待提交】或【不通过】的数据进行爽约处理!')              
              }else{
                this.confirmPopover('warning', `被该面试人员爽约`, () => {
                  let data = 
                    {
                      ids:this.rowData.map(item => item.id).join(','),
                      invitationStatus: 3
                    }
                  api('modifyConfirm',data).then(res => {
                    // this.loading = true
                    if (res.code === 0) {
                      this.showMessage('success','状态修改成功!')
                      this.search()
                      // this.loading = false
                    }
                  }).catch(err => {
                    resolve(true)
                  })
                })
              } 
            }                   
          },
          //双击行
          handleSelectionRow(row) {
            
          }, 
          //多选
          handleSelectionChange(row) {
            this.rowData = row           
          },
          //打开录用评定弹窗
          openEntryTest(row) {
            this.entryTest.dialogVisible = true;
            this.rowData1 = row            
          },
          //录用评定弹窗确认按钮
          testConfirm(done){
            this.$refs.entryTest.entryConfirm().then(res => {
              if (res) {
                console.log(done)
                this.showMessage('success', '保存成功')
                done()
                this.search()
              }
            })
          },
          //录用评定弹窗取消按钮
          testCancel(){
            done()
          },
          //查看/审核申请表
          handleSearch(row) {
            console.log('row',row)
            bus.$emit('sendData',row.personInfo.id,row.personInfo.name)
            this.$router.push({
              path:"auditApplication",
              query: {
                id: row.personInfo.id,
                name: row.personInfo.name,
                status: row.jobsApplicationStatusName,
                reason: row.examineVerifyReason,
                wrapId: row.id,
                applicatedJob: row.applicatedJob,
                employmentStatusName: row.employmentStatusName
              }
            })
          }
        }
    }
</script>

<style lang="less" scoped>
.el-select{
  width: 100%;
}
.el-icon-circle-plus-outline:before{
  font-size: 32px;
  position: absolute;
  top: 4px;
}
.iconWrap{
  display: inline-block;
  width: 30px;
  height: 30px;
  // background-color: red;
  margin-top: 10px;
  position: relative;
}

</style>
