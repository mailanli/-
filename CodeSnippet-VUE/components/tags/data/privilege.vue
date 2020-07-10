<template>
	<el-row>
		<template v-for="option in options">
			<!-- 0代表  manage、view、modify 、import  -->
			<router-link v-if="option.privilegeType === 0" :class="'el-button el-button--' + option.privilegeColor + ' el-button--' + size" 
			 :title="option.privilegeName" :to="{name:option.privilegeUname, query:query}" tag="button">
			 <template v-if="isIcon"><i :class="option.privilegeIcon"></i></template>
			 <template v-if="isLabel">{{option.privilegeName}}</template>
			</router-link>
			<!-- 1代表    -->
			<a v-if="option.privilegeType === 1" :class="'el-button el-button--' + option.privilegeColor + ' el-button--' + size"
			 :title="option.privilegeName" :href="option.privilegeUrl" target="_blank">
			 <template v-if="isIcon"><i :class="option.privilegeIcon"></i></template>
			 <template v-if="isLabel">{{option.privilegeName}}</template>
			</a>
			<!-- 2代表   delete multiDelete export -->
			<el-button v-if="option.privilegeType === 2" :type="option.privilegeColor" :size="size" 
			:title="option.privilegeName" @click="handleClick(option.privilegeUname, query)">
			 <template v-if="isIcon"><i :class="option.privilegeIcon"></i></template>
			 <template v-if="isLabel">{{option.privilegeName}}</template>
			</el-button>
		</template>
	</el-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	props: {
		options:Array,
		query:Object||Array,
		isLabel: {
			type: Boolean,
			default: true
		},
		isIcon: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: 'nomarl'
		}
	},
	methods: {    
  	handleClick(event, query) {
      this.$bus.$emit(event, query);
    }
  }
}	
</script>