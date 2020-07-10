<template>
    <div >
        <a-form 
        :formData="searchForm"
        @search="search" 
        @reSet="reSet">
            <el-row>
                <el-form-item label="组织">
                    <el-button @click="openOrgan()" icon="el-icon-arrow-down arrowIcon" ><span v-if="searchForm.fromOrg">{{showOrg.title}}</span><span v-else="searchForm.fromOrg">请选择</span></el-button>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-input v-model="searchForm.name" placeholder="请输入课程名称搜索 "></el-input>
                </el-form-item>
            </el-row>
        </a-form>
        <a-table
        @handleCurrentChange="handleCurrentChange" 
        @handleSizeChange="handleSizeChange"
        :loading="loading"
        :buttonList="buttonList" 
        :table="page" 
        :data="tableData">
            <el-table-column
                v-for="(item,index) in columnList"
                :key="index + item"
                :prop="item.prop"
                :label="item.label"
                :sortable="item.sort"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="推送完成率" >
                <template slot-scope="scope">
                    <el-progress :percentage="scope.row.rankChange"></el-progress>
                </template>
            </el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="checkInfo(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </a-table>
        <a-organ 
          @selectDtata="organData" 
          v-if="showOrg.show" 
          :isShow.sync="showOrg.show"
          :hideEmployee.sync="hideEmp"
        >
        </a-organ>
    </div>
</template>
<script>
import common from '@/mixins/common.js'
import api from '@/api/pushCourseList'
import req from "@/api/excannteper"
export default {
    mixins: [common],
    data() {
        return {
            exportApiName: 'getTableListExport',
            hideEmp:false,
            showOrg:{
                show:false,
                title:''
            },
            apiConfig: {
                req: api,
                fncName: 'getTableList'
            },
            tableData: [],
            searchForm: {
                fromOrg:'',
                name:''
            },
            columnList: [
                { prop: 'name', label: '课程名称' },
                { prop: 'coun', label: '推送人数' },
                { prop: 'finish', label: '完成人数'},
                { prop: 'unfinish', label: '未完成人数'}
            ],
            buttonList: [
                {
                    text: '导出',
                    func: () => {
                        this.handleDataExport()
                    }
                },
            ]
        };
    },
    components: {},
    methods: {
        // 导出推送课程列表数据事件
         handleDataExport() {
            let exportUrl = this;
            let me = this;
            let fromOrg = this;
            let name = this;
            fromOrg = me.searchForm.fromOrg;
            name = me.searchForm.name;
            exportUrl = req.evaluatPushCourseList({
              fromOrg: fromOrg,
              name: name
            });
            window.open(exportUrl);
          },
        /**
         * @param {Array} data 对请求返回数据进行额外操作事件
         */
        actionData (data) {
            return data.map(item => {
                item.rankChange = this.getPercent(item.finish,item.coun);
                return item
            })
        },
        //计算两个整数之间的百分比事件
        getPercent(curNum, totalNum, isHasPercentStr) {
            curNum = parseFloat(curNum);
            totalNum = parseFloat(totalNum);
            if (isNaN(curNum) || isNaN(totalNum)) {
                return '0';
            }
            return isHasPercentStr ?
                totalNum <= 0 ? '0%' : (Math.round(curNum / totalNum * 10000)  + '%') :
                totalNum <= 0 ? 0 : (Math.round(curNum / totalNum * 10000) );
        },
        // 查看事件
        checkInfo (row) {
             this.$router.push({path: '/pushCourseDetail',query: { id: row.id,name:row.name }})
        },
        // 选择组织事件
        openOrgan () {
          this.showOrg.show = true      
        },
        organData (val) {
            this.showOrg.show = false  
            if(val.organ.length != 0){
                this.searchForm.fromOrg=val.organ[0].fullUnitCode 
                this.showOrg.title=val.organ[0].unitName 
            }else{
                this.searchForm.fromOrg=''
            }
        }
    }
}
</script>

<style lang="less" >
.curriculumPanel{
    .el-tabs__item{font-size: 16px;}
    .arrowIcon{float: right !important; margint-left:12px;} 
    .el-tabs__nav-wrap{padding-left: 18px;}
}


</style>
