<template>
  <div class="curriculumPanel">
    <bread-crumb></bread-crumb>
    <el-tabs  v-model="activeName" >
      <el-tab-pane label="推送课程" name="first"><pushCourseList></pushCourseList></el-tab-pane>
      <el-tab-pane label="全部课程" name="second"><allCourseList></allCourseList></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import pushCourseList from './pushCourseList' // 推送课程 
  import allCourseList from './allCourseList' // 全部课程 
  export default {
    name: 'courseList',
    components: { pushCourseList, allCourseList }, // 组件
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
    }
  }
</script>
<style lang="less" >

</style>