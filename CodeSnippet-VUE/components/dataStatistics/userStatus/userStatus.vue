<template>
    <div class="userStatus">
        <a-form 
        :formData="searchForm"
        @search="search" 
        @reSet="reSet">
            <el-row>
                <el-form-item label="组织">
                    <el-button @click="openOrgan()" icon="el-icon-arrow-down arrowIcon" ><span v-if="searchForm.fromOrg">{{searchForm.fromOrg}}</span><span v-else="searchForm.fromOrg">请选择</span></el-button>
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
        </a-table>
        <a-organ 
          @selectDtata="organData" 
          v-if="showOrgan" 
          :isShow.sync="showOrgan"
          :hideEmployee.sync="hideEmp"
        >
        </a-organ>
    </div>
</template>
<script>
import common from '@/mixins/common.js'
import api from '@/api/pushCourseList'
import req from "@/api/excannteper";
export default {
    mixins: [common],
    data() {
        return {
            exportApiName: 'getTableListExport',
            hideEmp:false,
            showOrgan: false,
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
                { prop: 'name', label: '员工编号' },
                { prop: 'coun', label: '姓名' },
                { prop: 'finish', label: '所属组织'},
                { prop: 'unfinish', label: '激活时间'},
                { prop: 'unfinish2', label: '最后一次活跃时间'}
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
          this.showOrgan = true      
        },
        organData (val) {
          this.showOrgan = false  
          this.searchForm.fromOrg=val.organ[0].unitName
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
