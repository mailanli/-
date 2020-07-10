<template>
  <div>
    <div class="page-agreement">
      <bread-crumb></bread-crumb>
      <section class="content-section">
        <div style="margin: 15px ;"></div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;"><i class="el-icon-date" style="margin-right: 5px;"></i>筛选查询</span>
            <el-button style="float: right;" size="small" @click="resetSearchButtonClicked()">重置</el-button>
            <el-button style="float: right; margin-right: 10px;" size="small" type="primary" @click="searchButtonClicked()">查询</el-button>
          </div>
          <div>
            <el-form label-position="right" label-width="120px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="编码：" style="margin-bottom: 10px;">
                    <el-input placeholder="请输入内容"  v-model="searchForm.code" @keyup.enter.native="searchButtonClicked" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="名称：" style="margin-bottom: 10px;">
                    <el-input placeholder="请输入内容" v-model="searchForm.name" @keyup.enter.native="searchButtonClicked" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;"><i class="el-icon-date" style="margin-right: 5px;"></i>操作权限列表</span>
            <el-button style="float: right;margin-right: 20px;margin-left: 0;" size="small" type="primary" @click="addDialogVisible=true">新增</el-button>
          </div>
          <el-table ref="functionsTable" :data="tableData" @row-dblclick="checkRow" v-loading.body="tableLoading" stripe border class="table-font" max-height="450">
            <!--<el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column type="index" label="序列" align="center" width="80"></el-table-column>
            <el-table-column prop="code" label="编号"  align="center"></el-table-column>
            <el-table-column prop="name" label="名称"  align="center"></el-table-column>
            <el-table-column prop="description" label="描述"  align="center"></el-table-column>
            <el-table-column prop="enable" label="状态" align="center" :formatter="parseState"></el-table-column>
            <el-table-column width="200" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleModify(scope.$index, tableData)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.$index, tableData)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px; margin-left: -5px;">
            <el-pagination @current-change="handleCurrentChange" 
            :page-count="pagination.pages" 
            :current-page.sync="pagination.current" 
            layout="prev, pager, next, jumper"></el-pagination>
          </div>
        </el-card>
        <div style="font-size: 12px; text-align: center; padding: 10px; color: gray;">CopyRight @ 碧桂园物业 {{new Date().getFullYear()}}</div>
      </section>
    </div>
    <!-- 新增模态框 -->
    <el-dialog title="权限操作" :visible.sync="addDialogVisible" @close="initTable">
      <add-functions-dialog :id="ctlId" @close="closeDialog"></add-functions-dialog>
    </el-dialog>
  </div>
</template>

<script>
  import breadCrumb from "../breadCrumb.vue";
  import {getList,deleteByid} from '@/api/functions';
  import addFunctionsDialog from '@/components/functions/updateFunctionsDialog'
  export default {
        components: {breadCrumb,addFunctionsDialog},
        mounted() {
          this.resetSearchButtonClicked()
        },
        data(){
            return {
              tableData: [],
              tableLoading: false,
              commList: [],
              searchForm:{name:'',code:''},
              ctlId:'0',
              pagination: { current: 1, limit: 10, total: 0, pages: 0, max: 1, next: 1 },
              addDialogVisible:false,
            }
        },
        methods: {
          initTable(refreshFlag){
            //let -- 常量
            let me=this;
            me.addDialogVisible=false;
            me.ctlId='';
            if(refreshFlag)me.resetSearchButtonClicked();
          },
          
          async fetchData() {
            let me=this;
            me.searchForm.size=this.pagination.limit;
            me.searchForm.page=this.getPaginationSkip()
            // console.warn("fecth data form server.");
            me.tableLoading = true;
            await getList(
              me.searchForm,
              (response) => {
                me.setPaginationTotal(response.pages);
                me.tableData = response.data;
                me.tableLoading = false;
              },
              (error) => {
                console.warn(error);
                me.tableLoading = false;
                // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
              },
              (exception) => {
                console.warn(exception);
                me.tableLoading = false;
                // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
              }
            );
          },
          //      当前分页改变
          async handleCurrentChange(val) {
            this.setPaginationNextPage(val);
            this.fetchData();
          },
          resetSearchButtonClicked() { //重置查询
            this.searchForm.name='';
            this.searchForm.code='';
            this.fetchData();
          },
          searchButtonClicked() {
            this.fetchData();
          },
          checkRow(row, event){
            this.$refs.functionsTable.toggleRowSelection(row);
          },
          parseState(row, column, cellValue, index){
            return row.enable?'可用':'禁用';
          },
          setPaginationNextPage(next) {
            this.pagination.next = next;
          },
          //获取分页跳转数
          getPaginationSkip() {
            return Math.max(1, this.pagination.next);
          },
          //设置分页总数
          setPaginationTotal(row) {
            this.pagination.total = row;
            this.pagination.pages = row;
          },
          handleDelete(index, rows) {
            this.$confirm('是否删除该记录' , "提示",{ confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }).then(() => {
              deleteByid(
                {
                  id:rows[index].id
                },
                (response) => {
                  this.fetchData();
                  this.$message({ type: "success", message: "删除成功", duration: 3000, onClose: () => {} });
                },
                (error) => {
                  console.error(error);
                },
                (exception) => {
                  console.error(exception);
                },
              );
            });
          },
          handleModify(index, rows) {
              let me=this;
              me.ctlId=rows[index].id+'';
              me.addDialogVisible=true;
          },
          closeDialog(){
            let me=this;
            me.addDialogVisible=false;
            me.ctlId='';
            me.resetSearchButtonClicked();

          }
        },
        deactived(){
            this.$destroy();
        },
        watch:{

        }

    };
</script>

<style lang="less" scoped>

</style>
