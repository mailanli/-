<template>
    <section class="add-authority-wrapper" style="text-align: center">
        <div class="add-authority-content">
            <!-- 权限新增页面: 搜索框 开始 -->
            <header class="add-search-wrapper">
                <el-input size="small" v-model="PageData['searchTxt']" placeholder="请输入想查找的内容" prefix-icon="el-icon-search" @keyup.enter="getPageData" clearable>
                </el-input>
            </header>
            <!-- 权限新增页面: 搜索框 结束 -->
            <!-- 权限新增页面: 内容面板 开始 -->
            <div class="add-panel" v-loading="PageManage['loading']">
                <el-radio-group v-model="PageData['radioTxt']" @change="handleChange" v-if="PageManage['userList'].length>0">
                    <el-radio class="radio" :key="index" :label="user" v-for="(user,index) in PageManage['userList']">{{user.userName}}
                    </el-radio>
                </el-radio-group>
                <div v-else class="add-empty-panel">
                    <p class="add-empty-txt">暂无数据</p>
                </div>
                <!-- 分页:开始 -->
                <div class="pagination-wrapper">
                    <el-pagination @current-change="handleCurrentChange" :total="PageManage['pageTotal']" :page-size="PageManage['pageSize']" :current-page="PageManage['pageCurrent']" layout="prev, pager, next, jumper">
                    </el-pagination>
                </div>
                <!-- 分页:结束 -->
            </div>
            <footer class="add-btn-group">
                <el-button type="primary" round size="small" @click="saveUserData">保存</el-button>
            </footer>
            <!-- 权限新增页面: 内容面板 结束 -->
        </div>
    </section>
</template>

<script type='text/ecmascript-6'>
    import {quotaAuthorityManage} from "@/api/performance";
    const _debounce = require('lodash/debounce');
    export default {
        data() {
            return {
                PageManage: {
                    pageTotal: 0, //页面表格总数
                    pageSize: 10, //页面展示条数
                    pageCurrent: 1, //当前页码
                    loading: false, //是否展示loading
                    userList: [], //用户列表
                },
                PageData: {
                    searchTxt: '', //查询的用户内容
                    userCode: '', //新增的用户数据
                    radioTxt: '', //单选组的值,只是为了触发事件,勿删
                },
                AuthorityCache: {},//权限列表缓存
            }
        },
        beforeCreate() {
            //广播该方法  新增中心对接人 页面有加载才需要刷新,没有则调用 广播的 getPageData
            this.$on("refreshHandle", function() {
                console.log('refreshHandle');
                this.getPageData();
                this.refreshHandle();
            });
            this.$on("getPageData", function() {
                console.log('getPageData');
                this.getPageData();
            });
        },
        created() {
            this.getPageData();
        },
        watch: {
            // 实时监听输入框
            "PageData.searchTxt": _debounce(function() {
                this.PageManage['pageCurrent'] = 1;
                this.getPageData();
            }, 500, {
                'leading': false,
                'trailing': true
            }),
        },
        methods: {
            /*
                控制搜索框请求的对象
                如果是缓存有，则取缓存，反之调接口
            */
            getPageData() {
                let searchTxt = this.PageData.searchTxt;
                let {pageSize,pageCurrent
                } = { ...this.PageManage};
                let cacheKey = searchTxt + ';' + pageSize + ';' + pageCurrent;
                let tableData = this.AuthorityCache[cacheKey];
                if (tableData) {
                    console.log('新增对接人 => 请求缓存数据',cacheKey,tableData);
                    this.PageManage['userList'] = tableData['userList'];
                    this.PageManage['pageTotal'] = tableData['pageTotal'];
                    this.PageManage['loading'] = false;
                    return;
                } else {
                    this.PageManage['loading'] = true;
                    this.queryUserData(searchTxt, cacheKey);
                }
            },
            /*新增权限页面搜索框,搜索没有权限的用户;
              @param [userName, cacheKey] 
              userName 页面模糊查询的用户名;
              cacheKey 页面缓存对象的key值;
            */
            async queryUserData(userName, cacheKey) {
                userName = userName || null;
                let {
                    pageSize,
                    pageCurrent
                } = { ...this.PageManage
                };
                this.PageManage["loading"] = true;
                // 数据请求
                await quotaAuthorityManage(
                    '搜索新增', {
                        userName,
                        pageSize,
                        pageCurrent
                    }, response => {
                        this.PageManage["loading"] = false;
                        this.dataToTable(response, cacheKey);
                        console.log(response);
                    },
                    (error, code) => {
                        this.PageManage["loading"] = false;
                        let errorMsg = error == '已存在，不能重复添加' ? error : "接口请求失败";
                        this.$message({
                            type: "error",
                            message: errorMsg
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
            // 保存新添加的用户;
            async saveUserData() {
                let userCode = this.PageData['userCode'];
                if (!userCode) {
                    this.$emit('refreshTable', '无操作');
                    return false; //不能添加为空
                }
                this.PageManage["loading"] = true;
                // 数据请求
                await quotaAuthorityManage(
                    '保存新增', {
                        userCode
                    }, response => {
                        console.log(response);
                        this.$emit('refreshTable', userCode);
                        this.refreshHandle();
                        this.$message({
                            type: "success",
                            message: '保存成功'
                        });
                        this.PageManage["loading"] = false;
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
            // 单选框值改变触发操作
            handleChange(userItem) {
                this.PageData['userCode'] = userItem['userCode'];
            },
            // 页码选择操作
            handleCurrentChange(val) {
                this.PageManage['pageCurrent'] = val;
                this.getPageData();
            },
            /* 将数据转换成表格所需要的
                @param [response,cacheKey] 
                response  接口请求回调数据
                cacheKey  页面缓存对象的key值
            */
            dataToTable(response, cacheKey) {
                let userList = [],
                    dataList = response['rows'] || [],
                    pageTotal = response['total'] || 0;
                for (let i = 0, dataItem; dataItem = dataList[i]; i++) {
                    let {
                        userName,
                        userCode
                    } = { ...dataItem
                    };
                    userList.push({
                        userName,
                        userCode
                    });
                }
                console.log(userList);
                this.PageManage['userList'] = userList;
                this.PageManage['pageTotal'] = pageTotal;
                this.AuthorityCache[cacheKey] = {
                    userList,
                    pageTotal
                };
                this.PageManage['loading'] = false;
            },
            // 刷新操作,清楚页面缓存
            refreshHandle() {
                this.AuthorityCache = {};
                this.PageData['radioTxt'] = '';
                this.PageManage['userList'] = [];
                this.PageManage['pageTotal'] = 0;
                this.PageManage['pageCurrent'] = 1;
            }
        },
        mounted() {},
        components: {}
    }
</script>

<style lang='less' scoped>
    .add-authority-wrapper {
        width: 300px;
        margin: 0 auto; // 搜索框
        .add-search-wrapper {
            .el-autocomplete {
                width: 100%;
            }
        } // 内容面板
        .add-panel {
            width: 100%;
            border: 1px solid #efefef;
            text-align: left;
            .el-radio-group {
                width: 100%;
                min-height: 200px;
                max-height: 300px;
                padding: 10px 0;
                border-bottom: 1px solid #efefef;
                overflow: auto;
                .el-radio {
                    display: block;
                    width: auto;
                    height: 20px;
                    line-height: 20px;
                    margin: 0 15px;
                    padding: 10px 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .add-empty-panel {
                display: table;
                width: 100%;
                height: 200px;
                text-align: center;
                border-bottom: 2px solid #efefef;
                .add-empty-txt {
                    display: table-cell;
                    vertical-align: middle;
                    width: 100%;
                    margin: 25px 0;
                }
            }
        }
        .el-button.is-round {
            margin: 15px;
            width: 100px;
        }
    }
</style>
