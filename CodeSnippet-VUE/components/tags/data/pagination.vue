<template>
  <el-pagination
	  layout="total, sizes, prev, pager, next, jumper"
	  :current-page="page"
	  :page-size="pagesize"
	  :page-sizes="[20, 40, 60, 80]"
	  :total="count"
	  @size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	  >
	</el-pagination>
</template>
<script>
export default{
	props: {
		count:{
		  type: Number,
		  default: 0			
		}
	},
	data() {
		return {
			page: 1,
			pagesize: 20
	  } 
	},
	mounted(){
		this.$bus.$on('pageToFirst', (option) => {//切换状态时(例如工单状态等)，将当前页码设为1 ytx
  		this.page = 1;
  	});
	},
  beforeDestroy(){
    this.$bus.$off('pageToFirst');
  },
	methods: {
		handleSizeChange(pagesize){
			let query = $.extend({}, this.$route.query);
			this.pagesize =	query.pagesize = pagesize;
			this.$router.push({name:this.$route.name, query:query});
		},
		handleCurrentChange(page){
			let query = $.extend({}, this.$route.query);
			this.page =	query.page = page;
			this.$router.push({name:this.$route.name, query:query});
		}
	}
}
</script>