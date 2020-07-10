<template>
    <section class="quota-authority-wrapper">
        <bread-crumb></bread-crumb>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px; margin-left: 5px;">数据权限管理</span>
            </div>
            <div class="quota-authority-content">
                <header>
                    <!-- 表格展示:下拉 开始 -->
                    <el-form ref="form" :model="PageManage" label-width="80px" label-position="left">
                        <el-form-item label="用户名">
                            <el-input size="small" prefix-icon="el-icon-search" placeholder="请输入想查找的内容" v-model="PageData['tableSearch']" clearable @keyup.enter="getPageData">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <!-- 表格顶部:按钮操作 开始-->
                    <div class="table-btn-group clearfix">
                        <el-button type="primary" size="small" @click="addUserHandler">新增中心对接人</el-button>
                        <!-- 刷新按钮:开始 -->
                        <!-- <el-button  size="small" @click="refreshTable" icon="el-icon-refresh"></el-button> -->
                        <!-- 刷新按钮:结束 -->
                    </div>
                    <!-- 表格顶部:按钮操作 结束 -->
                </header>
                <div class="quota-authority-panel">
                    <el-table  v-loading="PageManage['loading']" :data="PageData['tableList']" border style="width: 100%" stripe>
                        <el-table-column align="left" prop="userName" label="用户名">
                        </el-table-column>
                        <el-table-column align="left" prop="quotaName" label="指标">
                        </el-table-column>
                        <el-table-column align="center" fixed="right" label="操作" width="150">
                            <template slot-scope="scope">
                                        <el-button type="text" size="small" @click="editUserHandler(scope.row)">编辑</el-button>
                                        <el-button type="text" size="small" @click="deleteUserHandler(scope.row['userCode'])">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :total="PageManage['pageTotal']"
                        :page-size="PageManage['pageSize']"
                        :current-page="PageManage['pageCurrent']"
                        layout="prev, pager, next, jumper"
                        >
                    </el-pagination>
                </div>
            </div>
        </el-card>

        <!-- 新增对接人弹出框:开始 -->
        <el-dialog title="新增对接人" :visible.sync="PageManage['addDialog']" width="350px">
            <add-authority @refreshTable="refreshTable" ref="addDialogDom"></add-authority>
        </el-dialog>
        <!-- 新增对接人弹出框:结束 -->

        <!-- 编辑权限弹出框:开始 -->
        <el-dialog  title="用户编辑" :visible.sync="PageManage['editDialog']"   width="600px">
            <edit-authority @refreshTable="refreshTable" 
                            :userCode="PageData['userCode']"
                            :userName="PageData['userName']"
                            ref="editDialogDom"></edit-authority>
        </el-dialog>
        <!-- 编辑权限弹出框:结束 -->

    </section>
</template>

<script type='text/ecmascript-6'>
    import breadCrumb from "../../breadCrumb";
    import editAuthority from "./edit-authority.vue";
    import addAuthority from "./add-authority.vue";
    import {quotaAuthorityManage} from "@/api/performance";
    const _debounce = require('lodash/debounce');
    export default {
        data() {
            return {
                PageManage: {
                    pageTotal: 0, //页面表格总数
                    pageSize: 5, //页面展示条数
                    pageCurrent: 1, //当前页码
                    loading: false,  //loading
                    addDialog: false, //中心对接人增加弹窗
                    editDialog: false,//权限编辑弹窗
                },
                PageData:{
                    userCode:'', //用户ID 赋值给弹框用
                    userName:'', //用户名称 赋值给弹框用
                    tableSearch: '', //查询表格内容
                    tableList : [],  //页面表格展示的数据
                },
                tableDataCache: {}, //页面缓存数据
                editTimer:'',  //编辑弹框定时器
            }
        },
        created() {
            this.getPageData('');
        },
        mounted() {},
        watch: {
            // 实时监听输入框
            "PageData.tableSearch": _debounce(function(userName) {
                this.PageManage['pageCurrent'] = 1;
                this.getPageData(userName);
            }, 500, {
                'leading': false,
                'trailing': true
            }),
        },
        components: {
            breadCrumb,
            editAuthority,
            addAuthority
        },
        methods: {
            /*
                控制搜索框请求的对象
                如果是缓存有，则取缓存，反之调接口
                接口的调用根据输入框来判断，输入框没值，调用查询全部的接口,反之调用模糊搜索的接口
            */
            getPageData() {
                let tableSearch = this.PageData.tableSearch;
                let {pageSize,pageCurrent} = { ...this.PageManage};
                let cacheKey = tableSearch + ';' + pageSize + ';' + pageCurrent;
                let tableData = this.tableDataCache[cacheKey];
                if (tableData) {
                    this.PageData['tableList'] = tableData['tableList'];
                    this.PageManage['pageTotal'] = tableData['pageTotal'];
                    this.PageManage['loading'] = false;
                    return;
                }
                this.PageManage['loading'] = true;
                if (!tableSearch) {
                    this.getInitData(cacheKey);
                } else {
                    this.queryTableData(tableSearch,cacheKey);
                }
            },
            /*页面初始化时,查询表格数据 
              @param [cacheKey] 
              cacheKey 页面缓存对象的key值
            */
            async getInitData(cacheKey) {
                let {pageSize,pageCurrent} = { ...this.PageManage};
                this.PageManage["loading"] = true;
                await quotaAuthorityManage(
                    '全部表格', {
                        pageSize,
                        pageCurrent
                    }, response => {
                        this.dataToTable(response,cacheKey);
                    },
                    (error, code) => {
                        this.PageManage["loading"] = false;
                        this.$message({
                            type: "error",
                            message: "接口请求失败"
                        });
                        console.warn(error);
                    },
                    (exception, code) => {
                        this.PageManage["loading"] = false;
                        console.error(exception);
                        this.$message({
                            type: "error",
                            message: exception.message
                        });
                    });
            },
            /* 权限页面的搜索框,根据输入框搜索已存在的权限用户;
                @param [searchTxt,cacheKey] 
                searchTxt 输入框需要模糊搜索的内容,
                cacheKey  页面缓存对象的key值
            */
            async queryTableData(searchTxt,cacheKey) {
                let {pageSize,pageCurrent} = { ...this.PageManage};
                this.PageManage["loading"] = true;
                await quotaAuthorityManage(
                    '搜索表格', {
                        "userName":searchTxt,
                        pageSize,
                        pageCurrent
                    }, response => {
                        this.dataToTable(response,cacheKey);
                    },
                    (error, code) => {
                        this.PageManage["loading"] = false;
                        this.$message({
                            type: "error",
                            message: "接口请求失败"
                        });
                        console.warn(error);
                    },
                    (exception, code) => {
                        this.PageManage["loading"] = false;
                        console.error(exception);
                        this.$message({
                            type: "error",
                            message: exception.message
                        });
                    });
            },
             /* 删除选择的用户
                @param [userCode] 
                userCode 要删除的用户Id
            */
            async deleteTableData(userCode) {
                this.PageManage["loading"] = true;
                await quotaAuthorityManage(
                    '删除表格', {
                        userCode
                    }, response => {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.refreshTable();
                        // 新增中心对接人 页面有加载才需要刷新,没有则不需要
                        let addDialogDom  = this.$refs['addDialogDom'];
                        if(addDialogDom){addDialogDom.$emit('refreshHandle');}
                        return false;
                    },
                    (error, code) => {
                        this.PageManage["loading"] = false;
                        this.$message({type: "error",message: "接口请求失败"});
                        console.warn(error);
                    },
                    (exception, code) => {
                        this.PageManage["loading"] = false;
                        this.$message({type: "error",message: exception.message});
                        console.error(exception);
                    });
            },
            /* 将数据转换成表格所需要的
                @param [response,cacheKey] 
                response  接口请求回调数据
                cacheKey  页面缓存对象的key值
            */
            dataToTable(response,cacheKey) {
                let tableList = [],
                    dataList = response['rows']||[],
                    pageTotal = response['total']||0;
                for (let i = 0, dataItem; dataItem = dataList[i]; i++) {
                    let {userName,userCode} = { ...dataItem};
                    let quotaName = [];
                    dataItem['userPowers'].forEach((data) => {
                        (data['isSelect'] === '1') ? quotaName.push(' ['+data['elementName']+'] '):'';
                    });
                    quotaName = quotaName.join(' ');
                    tableList.push({userName,userCode,quotaName});
                }
                this.PageData['tableList'] = tableList;
                this.PageManage['pageTotal'] = pageTotal;
                this.tableDataCache[cacheKey] = {tableList,pageTotal};
                this.PageManage['loading'] = false;
            },
            // 删除按钮点击操作
            deleteUserHandler(userCode){
                if(!userCode)return false;
                this.$confirm('是否确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteTableData(userCode);
                }).catch(() => {
                });
            },
            // 编辑按钮点击操作
            editUserHandler(itemJson) {
                let {userCode,userName} = {...itemJson};
                clearTimeout(this.editTimer);
                this.PageData['userCode'] = userCode;
                this.PageData['userName'] = userName;
                this.PageManage['editDialog'] = true;
                let editDialogDom  = this.$refs['editDialogDom'];
                if(editDialogDom){
                    console.log('editUserHandler: ',userCode,userName);
                    editDialogDom.$emit('getPageData');
                }else{
                    this.editTimer = setTimeout(() => {
                        this.editUserHandler(itemJson);       
                    }, 800);
                }
                return false;
            },
            // 新增对接人按钮点击操作
            addUserHandler(){
                this.PageManage['addDialog'] = true;
                let addDialogDom  = this.$refs['addDialogDom'];
                if(addDialogDom){
                    addDialogDom.$emit('getPageData');
                }
            },
            // 分页函数处理
            handleCurrentChange(val) {
                this.PageManage['pageCurrent'] = val;
                this.getPageData();
            },
            // 刷新操作,清楚页面缓存
            refreshTable(handle){
                console.log('refreshTable');
                this.PageManage['loading'] = false;
                this.PageManage['addDialog'] = false;
                this.PageManage['editDialog'] = false;
                if(handle!=='无操作'){
                    this.tableDataCache = {};
                    this.getPageData();
                }
            }
        }
    }
</script>

<style lang='less' scoped>
    .quota-authority-wrapper {
        padding: 0;
        margin: 0;
        list-style: none;
        font-style: normal;
        text-decoration: none;
        border: none;
        font-family: "Microsoft Yahei", sans-serif;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
        .box-card {
            margin: 15px;
            .el-form,
            .el-form-item {
                display: inline-block;
            }
            .table-btn-group {
                float: right;
                text-align: right;
                margin-bottom: 15px;
                line-height: 40px;
            }
            .quota-authority-panel {
                &::before {
                    display: block;
                    height: 1px;
                    margin-bottom: 15px;
                    content: '';
                    background: #efefef;
                }
            }
        }
    }
</style>
