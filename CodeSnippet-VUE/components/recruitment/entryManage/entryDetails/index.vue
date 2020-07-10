<template>
  <div>
    <div class="entry-details">
      <bread-crumb>
        <div slot="curPath">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/entryManage' }">入职管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看入职档案</el-breadcrumb-item>
        </div>
      </bread-crumb>
      <section class="content-box" v-loading='loading'>
      <!-- Tabs页 -->
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="basicInfo">
              <basicInfo ref="basicInfo"></basicInfo>
          </el-tab-pane>
          <el-tab-pane label="职位申请表" name="checkApplyInfo">
              <checkApplyInfo ref="checkApplyInfo"></checkApplyInfo>
          </el-tab-pane>
          <el-tab-pane label="入职档案" name="applyFiles">
              <applyFiles ref="applyFiles"></applyFiles>
          </el-tab-pane>
        </el-tabs>
    </section>
    </div>

  </div>
</template>

<script>
  import breadCrumb from "@/components/breadCrumb2.vue";
  import {getList,deleteByid} from '@/api/functions';
  import basicInfo from './components/basicInfo'
  import checkApplyInfo from './components/checkApplyInfo'
  import applyFiles from './components/applyFiles'
  export default {
        components: {
          breadCrumb,
          basicInfo,
          checkApplyInfo,
          applyFiles
        },
        data(){
            return {
              loading: false,
              activeName: 'applyFiles',
              tabNames: [
                {label: '基本信息', name: 'basicInfo', component: 'basicInfo'},
                {label: '职位申请表', name: 'checkApplyInfo', component: 'checkApplyInfo'},
                {label: '入职档案', name: 'applyFiles', component: 'applyFiles'},
              ],
              applyData: {}
            }
        },
        mounted() {
          // console.log('this.$route', this.$route)
        },
        updated() {
          // console.log('this.$route', this.$route)
        },
        watch: {
          '$route': {
            handler: function(val, oldVal) {
              if (val.path === '/entryDetails') {
                let applyData = {
                  id: +val.query.id,
                  rowId: +val.query.rowId,
                  name: val.query.name,
                  entryFileStatus: +val.query.entryFileStatus,
                }
                this.$nextTick(() => {
                  this.$refs.basicInfo.init(applyData)
                  this.$refs.checkApplyInfo.init(applyData)
                  this.$refs.applyFiles.init(applyData)
                })
              }
            },
            immediate: true,
            deep: true
          }
        },
        methods: {
          update () {
          },
          tabClick () {

          }
        }

    };
</script>

<style lang="less">
.entry-details {
  .content-box {
      margin: 15px 20px 10px 20px;
  }
}
</style>
