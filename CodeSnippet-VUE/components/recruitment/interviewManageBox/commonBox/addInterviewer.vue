<template>
  <div>
    <el-form ref="addInterviewer" :rules="rules" :model="addInterviewerMsgForm" label-width="120px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addInterviewerMsgForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="addInterviewerMsgForm.gender" placeholder="请选择性别">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="addInterviewerMsgForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item 
        v-for="(job, index) in addInterviewerMsgForm.department"
        :label="'申请职位' + (index+1)"
        :key="job.key"
        :prop="'department.' + index + '.ruleData'"
        :rules="{
          required: true, message: '申请部门或申请职位不能为空', trigger: 'change'
        }"
      >        
        <el-input readonly  placeholder="请选择申请职位部门" v-model="addInterviewerMsgForm.department[index].departmentName" @change="chgDep(job,index)" style="width:220px;" clearable>
          <el-button slot="append" icon="el-icon-search" @click="selectDepartment(index)"></el-button>
        </el-input>
        <el-select v-model="addInterviewerMsgForm.department[index].positionIds" filterable placeholder="请选择申请职位" @change="chgPos($event,job,index)" style="width:160px;" clearable>
          <el-option
            v-for="item in addInterviewerMsgForm.positions"
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
          v-model="addInterviewerMsgForm.interviewTime"
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
import api from '@/api/interviewManage'

export default {
  name: 'addInterviewer',
  data(){
    return {
        // 新增面试人员字段
      showOrgan: false,
      type: null,
      addInterviewerMsgForm:{           
        name:'',
        gender: '',
        phone: '',
        interviewTime: '',
        positions: [],
        departmentId: '',
        department: [{
          departmentName: '',
          positionIds: '',
          ruleData: ''
        }],
      }, 
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /(^1[34578]\d{9}$)|(^(00852)?\-?\d{8}$)/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        interviewTime: [{ required: true, message: '请选择计划面试时间', trigger: 'blur' }],
      },
    }
  },
  mounted(){
    this.getPositions()
  },
  methods:{
    //改变申请部门，判断申请职位是否为空，校验部门和职位
    chgDep(job,index){
      console.log('index',index)
      if (this.addInterviewerMsgForm.department[index].departmentName && this.addInterviewerMsgForm.department[index].positionIds) {
        this.addInterviewerMsgForm.department[index].ruleData = '123'
      } else {
        this.addInterviewerMsgForm.department[index].ruleData = ''
      }
      console.log('this.addInterviewerMsgForm', this.addInterviewerMsgForm)
    },
    //改变申请职位，判断申请部门是否为空，校验部门和职位
    chgPos(event, job,index){
      console.log('chgPos', event, job,index)
      if (this.addInterviewerMsgForm.department[index].departmentName && this.addInterviewerMsgForm.department[index].positionIds) {
        this.addInterviewerMsgForm.department[index].ruleData = '123'
      } else {
        this.addInterviewerMsgForm.department[index].ruleData = ''
      }
      console.log('this.addInterviewerMsgForm', this.addInterviewerMsgForm)
    },
    //增加申请职位
    addDomain() {
      if(this.addInterviewerMsgForm.department.length < 3) {
        this.addInterviewerMsgForm.department.push({
          departmentName: null,
          positionIds: null,
          key: Date.now(),
          ruleData: null
        })
      }     
    },
    //减少申请职位
    removeDomain(item,item1) {
      console.log('job',item)
      console.log('index',item1)
      let index = this.addInterviewerMsgForm.department.indexOf(item)
      if (index !== -1) {
        this.addInterviewerMsgForm.department.splice(index, 1)
      }
    },
    //打开申请部门选择器
    selectDepartment (index) {     
      this.type = index 
      this.showOrgan = true  
    },
    //获取申请部门数据
    organData (data) {
      if (data.organ.length === 0) {
        return
      }
      this.addInterviewerMsgForm.department[this.type].departmentId = data.organ[0].fullUnitCode
      this.addInterviewerMsgForm.department[this.type].departmentName = data.organ[0].unitName
    },
    //获取职位数据
    getPositions(){
      api(
        'positions',
        null
      ).then(
        res => {
          console.log('positions', res)
          this.addInterviewerMsgForm.positions = res.data.map(ele => {
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
    //新增确认
    add() {
      return new Promise(resolve => {
        console.log('addInterviewerMsgForm', this.addInterviewerMsgForm)
        this.$refs.addInterviewer.validate().then(valid => {
          if (valid) {           
              let data = 
                {
                  personInfo: {
                    name: this.addInterviewerMsgForm.name,
                    genderName: this.addInterviewerMsgForm.gender,
                    phone: this.addInterviewerMsgForm.phone
                  },
                  departmentIds: this.addInterviewerMsgForm.department.map(item=> item.departmentId).join('-'),
                  positionIds: this.addInterviewerMsgForm.department.map(item=> item.positionIds).join(','),
                  scheduleInterviewTime: this.addInterviewerMsgForm.interviewTime
                } 
              api('addConfirm', data).then(res => {
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


