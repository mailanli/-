<template>
	<el-row :gutter="20">
	<el-col :span="span" align="right">{{label}}</el-col>
	<el-col :span="spanRight">
		<slot></slot>
	</el-col>
	</el-row>
</template>
<script>
export default{
	props: {
		label: String,
		span: {
		  type: Number,
		  default: 8			
		}
	},
	computed: {
		spanRight() {
			return 24 - this.span;
		}
	}
}
</script>