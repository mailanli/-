<template>
  <div>
    <el-form ref="modifyInterviewMsg" :rules="rules" :model="modifyInterviewerMsgForm" label-width="120px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="modifyInterviewerMsgForm.name" placeholder="请输入姓名" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="genderName">
        <el-radio-group v-model="modifyInterviewerMsgForm.genderName" placeholder="请选择性别" disabled>
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="modifyInterviewerMsgForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item 
        v-for="(job, index) in modifyInterviewerMsgForm.department"
        :label="'申请职位' + (index+1)"
        :key="job.key"
        :prop="'department.' + index + '.ruleData'"
        :rules="{
          required: true, message: '申请部门或申请职位不能为空', trigger: 'change'
        }"
      >        
        <el-input readonly  placeholder="请选择申请职位部门" v-model="modifyInterviewerMsgForm.department[index].departmentName" @change="chgDep(job,index)" style="width:220px;" clearable>
          <el-button slot="append" icon="el-icon-search" @click="selectDepartment(index)"></el-button>
        </el-input>
        <el-select v-model="modifyInterviewerMsgForm.department[index].positionIds" filterable placeholder="请选择申请职位" @change="chgPos($event,job,index)" style="width:160px;" clearable>
          <el-option
            v-for="item in positions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="iconWrap" v-if="index === 0"><i class="el-icon-circle-plus-outline" @click="addDomain()"></i></span>
        <span class="iconWrap1" v-if="index > 0"><i class="el-icon-remove-outline" @click.prevent="removeDomain(job,index)"></i></span>
      </el-form-item>
      <el-form-item label="计划面试时间" prop="interviewTime">
        <el-date-picker
          v-model="modifyInterviewerMsgForm.interviewTime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00"
          value-format='yyyy-MM-dd HH:mm:ss'
        >
        </el-date-picker>
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
import api from '@/api/interviewManage';

export default {
  name: 'modifyInterviewMsg',
  props: {
    rowData: {
      type: Array,
      default: () => {
        return []
      }
    },
    positions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data(){
    return {
      showOrgan: false,
      type: null,
      modifyInterviewerMsgForm:{           
        name:'',
        genderName: '',
        phone: '',
        interviewTime: '',
        positions: [],
        department: [{
          departmentId: '',
          departmentName: '',
          positionIds: '',
          ruleData: '123'
        }],
      }, 
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /(^1[34578]\d{9}$)|(^(00852)?\-?\d{8}$)/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        // wantedJob1: [{ required: true, message: '请选择申请职位', trigger: 'blur' }],
        interviewTime: [{ required: true, message: '请选择计划面试时间', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.modifyInterviewerMsgForm.positions = this.positions
    this.carryData()
    // this.getPositions()
    this.calculatePositionIds()
    console.log('positions',this.positions)
  },
  methods:{
    //获取行的职位数据，如超过一个申请职位，则自动增加文本框并赋值
    calculatePositionIds(){
      let pos = this.rowData[0].positionIds.split(',') 
      let dep = this.rowData[0].applicatedJob      
      dep = dep.split(';').map(ele=>ele.split('-')[0]) //["物业服务公司物业总公司（物业）", "物业服务公司安徽区域（物业）", "房产公司（物业）佛山区域（房产）"]
      console.log('dep',dep[2])
      let depIds = this.rowData[0].departmentIds.split('-')//部门Id
      console.log('depIds',depIds)
      // console.log(typeof(pos[1]))
      // console.log('pos',pos)
      this.modifyInterviewerMsgForm.department[0].departmentId = depIds[0]
      this.modifyInterviewerMsgForm.department[0].departmentName = dep[0]
      this.modifyInterviewerMsgForm.department[0].positionIds = +pos[0]
      if(pos.length === 2){
        this.modifyInterviewerMsgForm.department.push({
          departmentId: depIds[1],
          departmentName: dep[1],
          positionIds: +pos[1],
          key: Date.now(),
          ruleData: '123'    
        })
      }else if(pos.length === 3){
        this.modifyInterviewerMsgForm.department.push({
          departmentId: depIds[1],
          departmentName: dep[1],
          positionIds: +pos[1],
          key: Date.now(),
          ruleData: '123'    
        },{
          departmentId: depIds[2],
          departmentName: dep[2],
          positionIds: +pos[2],
          key: Date.now(),
          ruleData: '123'    
        })
      }         
    },
    //进入修改页面带入行数据
    carryData() {
      console.log('rowData',this.rowData)
      this.modifyInterviewerMsgForm.name = this.rowData[0].name
      this.modifyInterviewerMsgForm.genderName = this.rowData[0].genderName
      this.modifyInterviewerMsgForm.phone = this.rowData[0].phone
      this.modifyInterviewerMsgForm.interviewTime = this.rowData[0].scheduleInterviewTime
      // this.modifyInterviewerMsgForm.department[0].departmentId = this.rowData[0].department.departmentId
      // let depName = `${this.rowData[0].department.companyType}${this.rowData[0].department.areaCompany}${this.rowData[0].department.propertyCompany}${this.rowData[0].department.departmentName1}${this.rowData[0].department.departmentName2}${this.rowData[0].department.departmentName2}`
      // this.modifyInterviewerMsgForm.department[0].departmentName = depName
      // this.modifyInterviewerMsgForm.department[0].positionIds = this.rowData[0].positionIds    
    },
    //改变申请部门，判断申请职位是否为空，校验部门和职位
    chgDep(job,index){
      console.log('index',index)
      if (this.modifyInterviewerMsgForm.department[index].departmentName && this.modifyInterviewerMsgForm.department[index].positionIds) {
        this.modifyInterviewerMsgForm.department[index].ruleData = '123'
      } else {
        this.modifyInterviewerMsgForm.department[index].ruleData = ''
      }
      console.log('this.modifyInterviewerMsgForm', this.modifyInterviewerMsgForm)
    },
    //改变申请职位，判断申请部门是否为空，校验部门和职位
    chgPos(event, job,index){
      console.log('chgPos', event, job,index)
      if (this.modifyInterviewerMsgForm.department[index].departmentName && this.modifyInterviewerMsgForm.department[index].positionIds) {
        this.modifyInterviewerMsgForm.department[index].ruleData = '123'
      } else {
        this.modifyInterviewerMsgForm.department[index].ruleData = ''
      }
      console.log('this.modifyInterviewerMsgForm', this.modifyInterviewerMsgForm)
    },
    //增加申请职位
    addDomain() {
      if(this.modifyInterviewerMsgForm.department.length < 3) {
        this.modifyInterviewerMsgForm.department.push({
          departmentName: null,
          positionIds: null,
          key: Date.now(),
          ruleData: ''
        })
      }     
    },
    //减少申请职位
    removeDomain(item,item1) {
      console.log('job',item)
      console.log('index',item1)
      let index = this.modifyInterviewerMsgForm.department.indexOf(item)
      if (index !== -1) {
        this.modifyInterviewerMsgForm.department.splice(index, 1)
      }
    },
    //打开申请部门选择器
    selectDepartment (index) {
      this.showOrgan = true
      this.type = index    
    },
    //获取申请部门数据
    organData (data) {
      if (data.organ.length === 0) {
        return
      }
      this.modifyInterviewerMsgForm.department[this.type].departmentId = data.organ[0].fullUnitCode
      this.modifyInterviewerMsgForm.department[this.type].departmentName = data.organ[0].unitName
      console.log('this.modifyInterviewerMsgForm',this.modifyInterviewerMsgForm)
    },
    //修改确认
    modify() {
      return new Promise(resolve => {
        this.$refs.modifyInterviewMsg.validate().then(valid => {
          if (valid) {             
              let data = 
               {
                 ids: this.rowData[0].id,
                 personInfo: {
                   id: this.rowData[0].personInfo.id,
                   phone: this.modifyInterviewerMsgForm.phone
                 },
                 departmentIds: this.modifyInterviewerMsgForm.department.map(item=>item.departmentId).join('-'),
                 positionIds: this.modifyInterviewerMsgForm.department.map(item=>item.positionIds).join(','),
                 scheduleInterviewTime: this.modifyInterviewerMsgForm.interviewTime
               }

              api('modifyConfirm', data).then(res => {
                if (res.code === 0) {
                  resolve(true)
                } else {
                  resolve(false)
                }
              }).catch(err => {
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
.iconWrap{
  display: inline-block;
  width: 22px;
  height: 22px;
  position: relative;
}
.el-icon-circle-plus-outline:before{
  font-size: 28px;
  position: absolute;
  top: 6px;
  color:#409EFF;
}
.iconWrap1{
  display: inline-block;
  width: 22px;
  height: 22px;
  position: relative;
}
.el-icon-remove-outline:before{
  font-size: 28px;
  position: absolute;
  top: 6px;
  color:#409EFF;
}
</style>


