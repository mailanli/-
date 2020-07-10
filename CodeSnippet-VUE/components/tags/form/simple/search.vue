<template>
  <el-input v-bind="$props" v-model="keywords" placeholder="请准确填写检索信息" @keyup.enter.native="search">
  <!-- @keyup.enter="search"  停顿1s后搜索，以后有需要再加上去吧 ytx-->
    <el-button slot="append" icon="search" @click="search" ></el-button>
  </el-input>
</template>
<script>
export default{
  data(){
    return {
      keywords: this.$route.query.keywords || ''
    }
  },
  props: {
    routeName: {
      type:String,
      default:''
    },
    placeholder: String,
    icon: {
      type:String,
      default:'search'
    },
    disabled: Boolean,
    label: {
      type:String,
      default:'搜索'
    },
    name: String
  },
  methods:{
    search(){
      let query = $.extend({}, this.$route.query);
      query.keywords = this.keywords;
      this.$router.push({name:this.routeName, query:query});
    },
    delaysearch(){
      setTimeout(this.search(),1000);
    }
  }
}
</script>