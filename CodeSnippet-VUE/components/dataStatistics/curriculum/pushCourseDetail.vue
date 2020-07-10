<template>
    <div>
        <bread-crumb></bread-crumb>
        <el-card class="box-card">
          <div >
            <el-button  @click="onreturn">返回</el-button>
            当前课程：{{this.$route.query.name}}
          </div>
        </el-card>
        <a-form 
        :formData="searchForm"
        @search="search" 
        @reSet="reSet">
            <el-row>
                <el-form-item label="学习状态">
                    <el-select v-model="searchForm.isComplete" placeholder="全部">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="员工编号">
                    <el-input v-model="searchForm.code" placeholder="请输入员工编号查询 "></el-input>
                </el-form-item>
                <el-form-item label="员工姓名">
                    <el-input v-model="searchForm.name" placeholder="请输入员工姓名查询 "></el-input>
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
        <a-dialog v-model="dialogVisible" :toolbar="toolbar"></a-dialog>
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
            options: [{
              value: '0',
              label: '未完成'
            }, {
              value: '1',
              label: '已完成'
            }],
            apiConfig: {
                req: api,
                fncName: 'getDataDetail'
            },
            tableData: [],
            searchForm: {
                id:this.$route.query.id,
                isComplete:'',
                code:'',
                name:''
            },
            columnList: [
                { prop: 'code', label: '员工编号' },
                { prop: 'name', label: '姓名' },
                { pkOrg: 'pkOrg', label: '组织'},
                { prop: 'isComplete', label: '学习状态'},
                { prop: 'completeDuration', label: '学习时长（分钟）'},
                { prop: 'completeDate', label: '实际完成时间'},
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
        /**
         * @param {Array} data 对请求返回数据进行额外操作
         */
        actionData (data) {
            return data.map(item => {
                item.isComplete == 0 ? item.isComplete="未完成":item.isComplete="已完成"
                item.completeDate?item.completeDate = this.$moment(item.completeDate).format('YYYY-MM-DD HH:mm:ss'):item.completeDate="-";
                return item
            })
        },
        // 返回
        onreturn(){
            this.$router.go(-1);
        },
        // 导出
        handleDataExport() {
            let exportUrl = this;
            let me = this;
            let id = this;
            let isComplete = this;
            let name = this;
            let code = this;
            isComplete = me.searchForm.isComplete;
            id = me.searchForm.id;
            name = me.searchForm.name;
            code = me.searchForm.code;
            exportUrl = req.evaluatPushCourseDetial({
              id: id,
              isComplete: isComplete,
              name: name,
              code: code
            });
            window.open(exportUrl);
          },
       
    }
}
</script>

<style lang="less" scoped>

</style>
