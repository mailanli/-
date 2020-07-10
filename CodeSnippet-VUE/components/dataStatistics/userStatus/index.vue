<template>
  <div class="allStatus">
    <bread-crumb></bread-crumb>
    <el-tabs  v-model="activeName" >
      <el-tab-pane label="按组织" name="first">

        <organStatus></organStatus>

      </el-tab-pane>
      <el-tab-pane label="按用户" name="second">

        <userStatus></userStatus>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import organStatus from './organStatus' // 按组织
  import userStatus from './userStatus' // 按用户 
  export default {
    name: 'allStatus',
    components: { organStatus, userStatus }, // 组件
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
    }
  }
</script>
<style>
.allStatus .el-tabs__nav-scroll{
  padding-left: 20px;
} 
.allStatus .el-tabs__item{
  font-size: 16px;
}
</style>