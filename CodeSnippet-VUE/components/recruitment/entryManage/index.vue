<template>
  <div>
    <div class="entry-manage">
      <bread-crumb></bread-crumb>
      <a-form 
      :formData="searchForm"
      @search="search" 
      @reSet="reSet">
        <el-row>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.personInfo.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="searchForm.personInfo.phone" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="入职部门">
            <el-input readonly placeholder="请选择" v-model="searchForm.department.departmentName">
              <el-button slot="append" icon="el-icon-search" @click="selectDepartment('search')"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="入职职位">
            <el-select v-model="searchForm.hiPsnjobHjid" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in positions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀约状态">
            <el-select v-model="searchForm.invitationStatus" placeholder="请选择">
              <el-option
                v-for="item in searchList.invitationStatuses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职档案情况">
            <el-select v-model="searchForm.entryFileStatus" placeholder="请选择">
              <el-option
                v-for="item in searchList.entryFileStatuses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职进度">
            <el-select v-model="searchForm.entryProgress" placeholder="请选择">
              <el-option
                v-for="item in searchList.entryProgresses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建议入职时间">
            <el-date-picker
              v-model="searchForm.scheduleEntryTime"
              type="date"
              placeholder="选择日期时间"
              value-format='yyyy-MM-dd'
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
      </a-form>

      <a-table
        @handleCurrentChange="handleCurrentChange" 
        @handleSizeChange="handleSizeChange"
        @handleSelectionChange="handleSelectionChange"
        :loading="loading"
        :buttonList="buttonList" 
        :table="page" 
        :data="tableData"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>         
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
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if='scope.row.entryFileStatus === 5' @click="toFileInit(scope.row)">档案初始化</el-button>
            <el-button type="text" size="small" v-if='scope.row.entryFileStatus === 2' @click="toCheck(scope.row)">审核</el-button>
            <el-button type="text" size="small" v-if='scope.row.entryFileStatus === 6 || scope.row.entryFileStatus === 1 || scope.row.entryFileStatus === 3 || scope.row.entryFileStatus === 4' @click="toView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </a-table>  
    </div>
    
    <!-- 新增修改入职人员模态框 -->
    <a-dialog :title="entryPersonTitle" v-model="addDialogShow" :toolbar="addToolbar" width="40%">
        <el-form ref="entryPersonForm" :rules="entryPersonFormRules" :model="entryPersonForm" label-width="140px">
          <el-form-item label="姓名：" prop='personInfo.name'>
            <el-input v-model="entryPersonForm.personInfo.name" :disabled="entryPersonTitle === '修改'"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop='personInfo.gender'>
            <el-radio-group v-model="entryPersonForm.personInfo.gender" :disabled="entryPersonTitle === '修改'">
              <el-radio :label="2">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" prop='personInfo.phone'>
            <el-input v-model="entryPersonForm.personInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="录用部门：" prop='department.departmentName' >
            <el-input readonly  v-model="entryPersonForm.department.departmentName">
              <el-button v-if="entryPersonTitle !== '修改'" slot="append" icon="el-icon-search" @click="selectDepartment('dialog')"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="录用职位：" prop='hiPsnjobHjid'>
            <!-- <el-input v-model.number="entryPersonForm.hiPsnjobHjid"></el-input> -->
            <el-select v-model="entryPersonForm.hiPsnjobHjid" placeholder="请选择" clearable filterable style="width: 100%;" :disabled="entryPersonTitle === '修改'">
              <el-option
                v-for="item in positions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建议入职时间：" prop='scheduleEntryTime'>
            <!-- <el-input v-model="entryPersonForm.name"></el-input> -->
            <el-date-picker
              v-model="entryPersonForm.scheduleEntryTime"
              align="right"
              type="date"
              style="width:100%"
              value-format='yyyy-MM-dd'
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
    </a-dialog>

    <!-- 更新入职进度 -->
    <a-dialog title="更新入职进度" v-model="updateProcessDialogShow" :toolbar="processToolbar" width="40%">
        <el-form ref="updateProcessForm" :model="updateProcessForm" :rules='updateProcessFormRules' label-position='top'>
          <el-form-item prop='entryProgress'>
            <el-radio-group v-model="updateProcessForm.entryProgress">
              <el-radio :label="2">已入职</el-radio>
              <el-radio :label="3">已取消入职</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="取消入职原因说明：" prop='entryProgressReason' v-if="updateProcessForm.entryProgress === 3">
            <el-input type="textarea" :rows="5" v-model="updateProcessForm.entryProgressReason"></el-input>
          </el-form-item>
        </el-form>
    </a-dialog>
    <!--  -->
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
  import api from '@/api/entryManage'
  export default {
        components: {},
        mixins: [common],
        data(){
            return {
              showOrgan: false,
              apiConfig: {
                req: api,
                fncName: 'getList'
              },
              searchForm:{
                personInfo: {
                  name: '',
                  phone: ''
                },
                department: {
                  departmentName: '',
                  departmentId: ''
                },
                hiPsnjobHjid: '',
                scheduleEntryTime: '',
                invitationStatus: 0,
                entryFileStatus: 0,
                entryProgress: 0
              },
              entryPersonTitle: '',
              // 入职人员
              entryPersonForm: {
                personInfo: {
                  name: '',
                  gender: '',
                  phone: '',
                },
                department: {
                  companyId: '',
                  departmentId: 123,
                },
                hiPsnjobHjid: '',
                scheduleEntryTime: ''
              },
              entryPersonFormRules : {
                'personInfo.name' : [
                  { required: true, message: '请输入', trigger: 'blur' }
                ],
                'personInfo.gender' : [
                  { required: true, message: '请选择', trigger: 'change' }
                ],
                'personInfo.phone' : [
                  { required: true, message: '请输入', trigger: 'blur' }
                ],
                'department.departmentName' : [
                  { required: true, message: '请选择', trigger: 'change' }
                ],
                hiPsnjobHjid: [
                  { required: true, message: '请输入', trigger: 'change' }
                ],
                scheduleEntryTime: [
                  { required: true, message: '请输入', trigger: 'blur' }
                ],
              },
              updateProcessForm:{
                entryProgress: '',
                entryProgressReason: '',
                personInfoIds: ''
              },
              searchList:{
                invitationStatuses: [{
                  value: 0,
                  label: '所有'
                },{
                  value: 1,
                  label: '待邀约'
                }, {
                  value: 2,
                  label: '已邀约'
                }],
                entryFileStatuses: [{
                  value: 0,
                  label: '所有'
                },{
                  value: 1,
                  label: '待提交'
                }, {
                  value: 2,
                  label: '待审核'
                }, {
                  value: 3,
                  label: '已通过'
                }, {
                  value: 4,
                  label: '不通过'
                }, {
                  value: 5,
                  label: '待初始化'
                }, {
                  value: 6,
                  label: '已初始化'
                }],
                entryProgresses: [{
                  value: 0,
                  label: '所有'
                },{
                  value: 1,
                  label: '待入职'
                }, {
                  value: 2,
                  label: '已入职'
                }, {
                  value: 3,
                  label: '已取消入职'
                }],
              },
              addToolbar:  [
                {
                  text: '取消',
                  type: 'defualt',
                  func: () => {
                    this.cancelAdd()
                  }
                },
                {
                  text: '确定提交',
                  loading: false,
                  func: () => {
                    this.confirmAdd()
                  }
                }
              ],
              processToolbar:  [
                {
                  text: '提交',
                  loading: false,
                  func: () => {
                    this.confirmUpdateProcess()
                  }
                }
              ],
              //表格数据配置
              tableData: [],
              columnList: [
                {label: '姓名',prop: 'name'},
                {label: '性别',prop: 'genderName'},
                {label: '手机号码',prop: 'phone'},
                {label: '入职部门',prop: 'departmentName'},
                {label: '入职职位',prop: 'hiPsnjobHjName'},
                {label: '建议入职时间',prop: 'scheduleEntryTime', width: '140px'},
                {label: '邀约状态',prop: 'invitationStatusName'},
                {label: '入职档案情况',prop: 'entryFileStatusName', width: '140px'},
                {label: '入职进度',prop: 'entryProgressName'}
              ],
              buttonList: [
                {
                  text: '新增入职人员',
                  func: () => {
                    this.add()
                  }
                },
                {
                  text: '入职档案提交邀约/重发',
                  loading: false,
                  func: () => {
                    this.sendMessage()
                  }
                },
                {
                  text: '更新入职进度',
                  func: () => {
                    this.updateProcess()
                  }
                },
                {
                  text: '修改',
                  func: () => {
                    this.modify()
                  }
                },
              ],
              updateProcessDialogShow: false,
              addDialogShow: false,
              multipleSelection: [],
              positions: [],
              type: ''
            }
        },
        watch: {
          '$route': {
            handler: function(val, oldVal) {
              if (val.path === '/entryManage') {
                this.reSet()
                this.search()
              }
            },
            immediate: true,
            deep: true
          }
        },
        mounted() {
          // 获取职位
          this.getPositions()
        },
        computed: {
          updateProcessFormRules :function() {
            return {
              entryProgress : [
                { required: true, message: '请选择', trigger: 'change' }
              ],
              entryProgressReason : [
                { required: this.updateProcessForm.entryProgress === 3, message: '请输入', trigger: 'blur' }
              ]
            }
          },
        },
        methods: {
          selectDepartment (type) {
            this.showOrgan = true
            this.type = type
          },
          // 
          organData (data) {
            console.log('organData', data)
            if (data.organ.length === 0) {
              return
            }
            if (this.type === 'dialog') {
              this.entryPersonForm.department.departmentName = data.organ[0].unitName
              this.entryPersonForm.department.departmentId = data.organ[0].fullUnitCode
            } else if (this.type === 'search') {
              this.searchForm.department.departmentName = data.organ[0].unitName
              this.searchForm.department.departmentId = data.organ[0].fullUnitCode
            }
          },
          // 职位
          getPositions () {
            api(
              'positions',
              null
            ).then(
              res => {
                // console.log('positions', res)
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
          // 档案初始化
          toFileInit (data) {
            this.goDetail(data)
          },
          // 审核
          toCheck (data) {
            this.goDetail(data)
          },
          // 查看
          toView (data) {
            this.goDetail(data)
          },
          // 查看入职档案
          goDetail (data) {
            console.log('查看入职档案')
            this.$router.push({
              path:"entryDetails",
              // name: '查看入职档案',
              query: {
                id: data.personInfo.id,
                name: data.personInfo.name,
                entryFileStatus: data.entryFileStatus,
                rowId: data.id
              }
            });
          },
          // 新增
          add () {
            this.entryPersonTitle = '新增'
            this.addDialogShow = true
            this.addReset()
          },
          cancelAdd () {
            this.addDialogShow = false
            this.addReset()
          },
          addReset () {
            this.entryPersonForm =  {
              personInfo: {
                name: '',
                gender: '',
                phone: '',
              },
              department: {
                departmentName: '',
                departmentId: '',
              },
              hiPsnjobHjid: '',
              scheduleEntryTime: ''
            }
            this.$refs.entryPersonForm  ? this.$refs.entryPersonForm.clearValidate() : ''
          },
          confirmAdd () {
            this.$refs.entryPersonForm.validate((valid) => {
              if (valid) {
                this.addToolbar[1].loading = true
                let apiFun = ''
                if (this.entryPersonTitle === '修改') {
                  apiFun = 'updateRecruitEntry'
                } else {
                  apiFun = 'addRecruitEntry'
                }
                api(
                  apiFun,
                  this.entryPersonForm
                ).then(
                  res => {
                    this.addToolbar[1].loading = false
                    this.addDialogShow = false
                    this.addReset()
                    this.search()
                    this.$message({ type: 'success', message: '操作成功', duration: 2000, onClose: () => {} });
                  }
                ).catch(error => {
                  this.addToolbar[1].loading = false
                  console.warn(error);
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          // 发短信
          sendMessage () {
            let len = this.multipleSelection.length
            console.log('len', len)
            if (len === 0) {
              this.$message({ type: 'error', message: '请选择入职人员', duration: 2000, onClose: () => {} });
              return
            }
            // 入职档案情况状态为待审核、已通过时不能触发邀约
            let checkList = this.multipleSelection.filter(ele => ele.entryFileStatus === 3 || ele.entryFileStatus === 2)
            if (checkList.length > 0) {
              let names = checkList.map(item => item.personInfo.name).join(',')
              this.$message({ type: 'error', message: `${names}入职档案情况状态为待审核或已通过，不能触发邀约`, duration: 2000, onClose: () => {} });
              return
            }
            let data =  this.multipleSelection.map(ele => {
              return {
                id: ele.personInfo ? ele.personInfo.id : '',
                name: ele.personInfo ? ele.personInfo.name : '',
                gender: ele.personInfo ? ele.personInfo.gender : '',
                phone: ele.personInfo ? ele.personInfo.phone : ''
              }
            })
            this.buttonList[1].loading = true
            api(
              'sendingSms',
              data
            ).then(
              res => {
                this.buttonList[1].loading = false
                this.search()
                this.$message({ type: 'success', message: '操作成功', duration: 2000, onClose: () => {} });
              }
            ).catch(error => {
              this.buttonList[1].loading = false
              console.warn(error);
            })
          },
          // 修改
          modify () {
            let len = this.multipleSelection.length
            console.log('len', len)
            if (len === 0) {
              this.$message({ type: 'error', message: '请选择一名入职人员', duration: 2000, onClose: () => {} });
              return
            }
            if (len > 1) {
              this.$message({ type: 'error', message: '只能选择一名入职人员', duration: 2000, onClose: () => {} });
              return
            }
            this.entryPersonTitle = '修改'
            this.addDialogShow = true
            let data = this.multipleSelection[0]
            console.log('data', data)
            this.entryPersonForm = {
              personInfo: {
                id: data.personInfo ? data.personInfo.id : '',
                name: data.personInfo ? data.personInfo.name : '',
                gender: data.personInfo ? data.personInfo.gender : '',
                phone: data.personInfo ? data.personInfo.phone : '',
              },
              department: {
                departmentName: data.departmentName ? data.departmentName : '',
                departmentId: data.department ? data.department.departmentId : 0,
              },
              hiPsnjobHjid: data.hiPsnjobHjid ,
              scheduleEntryTime: data.scheduleEntryTime ,
            }
          },
          processReset () {
            this.updateProcessForm = {
              entryProgress: '',
              entryProgressReason: '',
              personInfoIds: ''
            }
            this.$refs.updateProcessForm ? this.$refs.updateProcessForm.clearValidate() : ''
          },
          //  更新入职进度
          updateProcess () {
            let len = this.multipleSelection.length
            console.log('len', len)
            if (len === 0) {
              this.$message({ type: 'error', message: '请选择入职人员', duration: 2000, onClose: () => {} });
              return
            }
            // 默认是“待入职”状态，只有在待入职状态下才可以更新入职进度
            let checkList = this.multipleSelection.filter(ele => ele.entryProgress !== 1)
            if (checkList.length > 0) {
              let names = checkList.map(item => item.personInfo.name).join(',')
              this.$message({ type: 'error', message: `只有在待入职状态下才可以更新入职进度,${names}入职状态不是待入职`, duration: 2000, onClose: () => {} });
              return
            }
            this.updateProcessDialogShow = true
            this.updateProcessForm.personInfoIds = this.multipleSelection.map(item => item.personInfo.id).join(',')
          },
          // 更改入职进度 
          confirmUpdateProcess () {
            this.$refs.updateProcessForm.validate((valid) => {
              if (valid) {
                this.processToolbar[0].loading = true
                api(
                  'updateEntrySchedule',
                  this.updateProcessForm
                ).then(
                  res => {
                    this.processToolbar[0].loading = false
                    this.updateProcessDialogShow = false
                    this.processReset()
                    this.search()
                    this.$message({ type: 'success', message: '操作成功', duration: 2000, onClose: () => {} });
                  }
                ).catch(error => {
                  this.processToolbar[0].loading = false
                  console.warn(error);
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          // 查看
          view () {
            console.log('view')
          },
          // 评定
          evaluate () {
            console.log('evaluate')
          },
          closeDialog(){
            this.addDialogVisible=false;
            this.ctlId='';
            this.resetSearchButtonClicked();

          },
          // 查询重置
          reSet () {
            this.searchForm = {
              personInfo: {
                name: '',
                phone: ''
              },
              department: {
                departmentName: '',
                departmentId: ''
              },
              hiPsnjobHjid: '',
              scheduleEntryTime: '',
              invitationStatus: 0,
              entryFileStatus: 0,
              entryProgress: 0
            }
            this.search()
          },
          // 处理查询数据
          actionData (data) {
            console.log('actionData', data)
            return data.map(item => {
              item.name = item.personInfo ? item.personInfo.name : ''
              item.genderName = item.personInfo ? item.personInfo.genderName : ''
              item.phone = item.personInfo ? item.personInfo.phone : ''
              item.departmentName = item.department ? this.dealDepartmentName([item.department.areaCompany, item.department.companyType, item.department.departmentName1, item.department.departmentName2, item.department.departmentName3,]) : ''
              item.scheduleEntryTime = item.scheduleEntryTime ? this.$moment(item.scheduleEntryTime).format('YYYY-MM-DD') : ''
              return item
            })
          },
          dealDepartmentName(array = []) {
            let result = array[0] ? array[0] : ''
            array.forEach((ele, index) => {
              if (ele && index > 0) {
                if (index + 1 !== array.length) {
                  result += result ? '/' : ''
                }
                result += ele ? ele : ''
              }
            });
            return result
          }
        }

    };
</script>

<style lang="less" scoped>
.entry-manage {
  .el-input, .el-select, .el-date-editor {
    width: 200px ;
  }
}
</style>
