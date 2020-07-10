<template>
  <div class="interviewDetails">
    <bread-crumb>
      <div slot="curPath">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/interviewManage' }">面试管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </div>
    </bread-crumb>
    <section class="contentBox" v-loading='loading'>
      <el-tabs v-model="activeName" @tab-click="tabClick($event)">

        <el-tab-pane label="职位申请表" name="applyForm">
          <apply-form ref="applyForm"></apply-form>
        </el-tab-pane>
        <el-tab-pane label="录用情况" name="entryCondition" :disabled="isShow">
          <entry-condition ref="entryCondition"></entry-condition>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>
<script>
import breadCrumb from "@/components/breadCrumb2.vue";
import applyForm from './applyForm'
import entryCondition from './entryCondition'
import bus from '@/components/common/bus.js'

export default {
  components: {
    applyForm,
    entryCondition,
    breadCrumb,
  },
  data(){
    return{
      loading: false,
      isShow: true,
      activeName: 'applyForm',
      tabNames: [
        {label: '职位申请表', name: 'applyForm', component: 'applyForm'},
        {label: '录用情况', name: 'entryCondition', component: 'entryCondition'}
      ],
    }
  },
  watch: {
    '$route': {
      handler: function(val, oldVal) {
        console.log('$route', val)
        if (val.path === '/auditApplication') {
          let applyData = {
            id: +val.query.id,
            name: val.query.name,
            status: val.query.status,
            reason: val.query.reason,
            wrapId: +val.query.wrapId,
            applicatedJob: val.query.applicatedJob,
            employmentStatusName: val.query.employmentStatusName
          }
          console.log('employmentStatusName',applyData.employmentStatusName)
          console.log('status',status)
          this.$nextTick(() => {
            this.$refs.applyForm.init(applyData)
            if(applyData.employmentStatusName === '已录用' || applyData.employmentStatusName === '不录用'){
              this.isShow = false
              this.$refs.entryCondition.init(applyData)
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  created(){
    bus.$on('tabTick',()=>{
      this.activeName = 'applyForm'
    })
  },
  methods:{
    tabClick(tab,event) {
      console.log('tab',tab,event)
    },
    update(){
    }
  }   
}
</script>
<style less="lang" scoped>
.contentBox{
  margin: 15px 20px 0 20px;
}
.el-select{
  width: 100%;
}
</style>

