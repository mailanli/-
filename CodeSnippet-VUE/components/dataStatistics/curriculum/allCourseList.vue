<template>
    <div class="allCourseList">
        <a-form  :formData="searchFormA" @search="search"  @reSet="reSet">
            <el-col :md="8" >
                <el-form-item label="组织">
                    <el-button @click="openOrganAll()" icon="el-icon-arrow-down arrowIcon" ><span v-if="searchFormA.orgId">{{showOrgAll.title}}</span><span v-else="searchFormA.orgId">请选择</span></el-button>
                </el-form-item>
            </el-col>
            <el-col :md="8" >
                <el-form-item label="制作组织">
                    <el-button @click="openOrganMake()" icon="el-icon-arrow-down arrowIcon" ><span v-if="searchFormA.makeOrgId">{{showOrgMake.title}}</span><span v-else="searchFormA.makeOrgId">请选择</span></el-button>
                </el-form-item>
            </el-col>
            <el-col :md="8" >
                <el-form-item label="课程分类">
                    <a-select :apiName="courseType.apiName" :props="courseType.props" :params="{}"  v-model="searchFormA.classId"></a-select>
                </el-form-item>
            </el-col>
            <el-col :md="8" >
                <el-form-item label="上架时间">
                    <el-date-picker v-model="searchFormA.time" type="daterange" range-separator="至"start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :md="8" >
                <el-form-item label="制作人"  porp="author">
                    <el-input placeholder="请选择制作人" v-model="searchFormA.makePeople" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :md="8" >
                <el-form-item label="课程名称">
                    <el-input v-model="searchFormA.name" placeholder="请输入课程名称搜索 "></el-input>
                </el-form-item>
            </el-col>
            <el-col :md="16" >
                <el-form-item label="累计">
                    <el-radio-group v-model="yearOrMonth" @click="handleSelYearMonth">
                        <el-radio :label="1">
                            <span>按年</span>
                            <span  v-if="yearOrMonth==1"><el-date-picker v-model="searchFormA.year"   type="year" placeholder="选择年" > </el-date-picker></span>
                            <span  v-else><el-date-picker v-model="searchFormA.year" disabled  type="year" placeholder="选择年" > </el-date-picker></span>
                        </el-radio>
                        <el-radio :label="2">
                            <span>按月</span>
                            <span  v-if="yearOrMonth==2"><el-date-picker  type="month" placeholder="选择月" v-model="searchFormA.month" >  </el-date-picker></span>
                            <span  v-else><el-date-picker disabled type="month" placeholder="选择月" v-model="searchFormA.month" >  </el-date-picker></span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </a-form>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;margin-left: 5px;">
                <i class="el-icon-date" style="margin-right: 5px;"></i>课程列表
                </span>
                <el-button size="small" class="fr ml" @click="exportTable">导出表格</el-button>
            </div>
            <el-table show-summary v-loading="tableLoading" :data="tableData" border stripe @selection-change="handleCurrentChange" style="width: 100%;font-size: 12px;">
                <el-table-column  v-for="(item,index) in columnList" :key="index"  :label="item.statistics"  >
                    <el-table-column  :prop="item.prop"   
                    :label="item.label"
                    :sortable="item.sort"
                    show-overflow-tooltip  >
                    </el-table-column>
                </el-table-column>
                <el-table-column  prop="makePeopleName"  label="制作人"   ></el-table-column>
                <el-table-column  prop="makeOrgName"  label="制作单位"   ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="checkInfo(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: -5px;">
                <el-pagination @current-change="handleCurrentChange" :page-count="page.total" :current-page.sync="page.pageIndex" layout="total, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </el-card>
        <a-organ 
          @selectDtata="selectOrganAll" 
          v-if="showOrgAll.show" 
          :isShow.sync="showOrgAll.show"
          :hideEmployee.sync="hideEmp"
        >
        </a-organ>
        <a-organ 
          @selectDtata="selectOrganMake" 
          v-if="showOrgMake.show" 
          :isShow.sync="showOrgMake.show"
          :hideEmployee.sync="hideEmp"
        >
        </a-organ>
    </div>
</template>
<script>
import common from '@/mixins/common.js'
import api from '@/api/allCourseList'
// import req from "@/api/excannteper"
export default {
    mixins: [common],
    data() {
        return {
            exportApiName: 'getAllCourseListExport',
            curriculumId:'',
            hideEmp:false,
            courseType:{
                apiName:"getCourseType",
                props:{label: 'name', value: 'id'}
            },
            showOrgAll:{
                show:false,
                title:''
            },
            showOrgMake:{
                show:false,
                title:''
            },
            apiConfig: {
                req: api,
                fncName: 'getTableList'
            },
            tableData: [],
            searchFormA: {
                orgId:'',
                year:'',
                month:'',
                classId:'',
                makePeople:'',
                name:'',
                startDate:'',
                endDate:'',
                time:''
            },
            tableCount:{
                userNumber1:'',
                commentTotal1:'',
                avgBisection1:'',
                scoreNumber1:'',
                browseTotal1:'',
            },
            yearOrMonth:1,
            columnList: [
                { prop: 'name', label: '课程名称',statistics:'合计' },
                { prop: 'userNumber', label: '学习用户数',statistics:"this.tableCount.userNumber1" },
                { prop: 'commentTotal', label: '评论数',statistics:"this.tableCount.commentTotal1"},
                { prop: 'avgBisection', label: '课程评分',statistics:"this.tableCount.avgBisection1"},
                { prop: 'scoreNumber', label: '评分人数',statistics:"this.tableCount.scoreNumber1"},
                { prop: 'browseTotal', label: '浏览次数',statistics:"this.tableCount.browseTotal1"},
                // { prop: 'makePeopleName', label: '制作人'},
                // { prop: 'makeOrgName', label: '制作单位'}
            ],
            page: {
                pageIndex: 1,   //当前第几页
                pageSize: 10,
                total: 0        //总页数
            },
            tableLoading:false,
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
    created () {
        this.getCourseList()
        // this.getDict()
    },
    //  watch: {
    //     $route: {
    //     handler (rou) {
    //         this.page.pageIndex = 1
    //         this.getCourseList()
    //     }
    //     }
    // },
    methods: {
        // 列表
        getCourseList () {
            // this.tableLoading = true
            api('getTableList', Object.assign({}, this.searchFormA, this.page)).then(res => {
                // this.tableCount.userNumber=''
                // this.tableCount.commentTotal=''
                // this.tableCount.avgBisection=''
                // this.tableCount.scoreNumber=''
                // this.tableCount.browseTotal=''
                this.tableData = res.data
                this.tableLoading = false
                this.page.total = res.data.pages
            }).catch(() => { this.tableLoading = false })
        },
        // 选择年和月
        handleSelYearMonth () {

        },
        //导出  
        exportTable(){

        }
    }
}
</script>

<style lang="less" >
.allCourseList{
    .fr{float: right !important;}
    .search-bar{
        .el-form-item,.el-tooltip{width: 100%;}
        .el-form-item__content{width: calc(~"100% - 100px");
          .el-button{width: 100%; text-align: left; color: #606266; padding-left:10px}
        }
        form{max-height: inherit !important ;}
        .el-date-editor--daterange.el-input__inner{width: auto}
    }
    .el-radio-group{
       label{width: 40%; margin-right: 3%;} 
       .el-date-editor.el-input{width: 90%;}
    }
    
}
</style>
