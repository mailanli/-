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
                      <el-input placeholder="请输入内容" v-model="searchForm.code" @keyup.enter.native="searchButtonClicked" clearable></el-input>
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
              <span style="line-height: 36px;"><i class="el-icon-date" style="margin-right: 5px;"></i>角色列表</span>
              <el-button style="float: right;margin-right: 20px;margin-left: 0;" size="small" type="primary" @click="distributionMenusDialogToggle">分配菜单</el-button>
              <el-button style="float: right;margin-right: 20px;margin-left: 0;" size="small" type="primary" @click="distributionFunctions">分配操作</el-button>
              <el-button style="float: right;margin-right: 20px;margin-left: 0;" size="small" type="primary" @click="addRoleDialogVisible=!addRoleDialogVisible">创建角色</el-button>
            </div>
            <el-table ref="roleTable" :data="tableData" @row-dblclick="checkRow" v-loading.body="tableLoading" stripe border class="table-font" max-height="450" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" label="序列" align="center" width="80"></el-table-column>
              <el-table-column prop="code" label="编号"  align="center"></el-table-column>
              <el-table-column prop="name" label="名称"  align="center"></el-table-column>
              <el-table-column prop="enable" label="状态" align="center" :formatter="parseState"></el-table-column>
              <el-table-column width="200" fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="handleViewRoleUsers(scope.$index)"
                    type="text"
                    size="small">
                    管理用户
                  </el-button>
                  <el-button type="text" @click="handleModify(scope.$index, tableData)">编辑</el-button>
                  <el-button type="text" @click="handleDelete(scope.$index, tableData)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: -5px;">
              <el-pagination @current-change="handleCurrentChange" :page-count="pagination.pages" :current-page.sync="pagination.current" layout="prev, pager, next, jumper"></el-pagination>
            </div>
          </el-card>
          <div style="font-size: 12px; text-align: center; padding: 10px; color: gray;">CopyRight @ 碧桂园物业 {{new Date().getFullYear()}}</div>
        </section>
      </div>

      <!-- 角色分配操作 -->
      <el-dialog title="分配操作" :visible.sync="distributionFunctionsDialogVisible" width="60%" @close="initTable">
        <distribution-func :rCode="distributionMenusDialogForm.rCode" @close="initTable(true)"></distribution-func>
      </el-dialog>
      <!-- 新增角色模态框 -->
      <el-dialog title="创建角色" :visible.sync="addRoleDialogVisible" width="60%" @close="initTable">
          <add-role-dialog :rCode="distributionMenusDialogForm.rCode" @close="initTable(true)"></add-role-dialog>
      </el-dialog>
      <!-- 修改角色模态框 -->
      <el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" width="60%" @close="initTable">
        <edit-role-dialog :id="ctlId" @close="initTable(true)"></edit-role-dialog>
      </el-dialog>
      <!-- 分配菜单模态框 -->
      <el-dialog title="分配菜单" :visible.sync="distributionMenusDialogVisible" @close="initTable">
        <el-form :model="distributionMenusDialogForm" :rules="distributionMenusDialogFormRules"
                 v-loading="requestLoading"
                 ref="addWeeklyReportDialogForm">

          <el-tree
            ref="menusTree"
            :data="menusTreeData"
            :props="{children: 'subMenus',label: 'name'}"
            :default-checked-keys="existCheckedMenuCodes"
            node-key="code"
            show-checkbox>
          </el-tree>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="requestLoading"
                     @click="distributionMenus">提交</el-button>
          <el-button type="default" @click="distributionMenusDialogVisible = !distributionMenusDialogVisible">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import breadCrumb from "../breadCrumb.vue";
    import ElRow from "element-ui/packages/row/src/row";

    import {getRolesList,getMenusList,editRolesMenus,deleteByid} from  "@/api/role";
    import addRoleDialog from './add-role';
    import editRoleDialog from './edit-role';
    import distributionFunc from './distribution-funs.vue';
    export default {
      components: {
        editRoleDialog,
        ElRow, breadCrumb ,addRoleDialog,distributionFunc},
      mounted() {
          this.resetSearchButtonClicked();
      },
      data(){
          return{
//          分配操作
            distributionFunctionsDialogVisible:false,
//          新增角色
            addRoleDialogVisible:false,
//          分配菜单
            distributionMenusDialogVisible:false,
            distributionMenusDialogForm:{mCodes:'',rCode:''},
            distributionMenusDialogFormRules:{},
            menusTreeLoad:false,
            menusTreeData:[],
            existCheckedMenuCodes:[],
            requestLoading:false,
//          编辑角色id
            ctlId:'',
            editRoleDialogVisible:false,

            tableData: [],
            tableLoading: false,
            commList: [],
            organCode:'',
            organList: [],
            searchForm:{name:'',code:''},
            multipleSelection:[],
            casefield_modify_casefieldname: false,
            casefield_modify_header: false,
            pagination: { current: 1, limit: 10, total: 0, pages: 0, max: 1, next: 1 },
          }
      },
      methods:{
        initTable(refreshFlag){
            let me=this;
            me.editRoleDialogVisible=false;
            me.addRoleDialogVisible=false;
            me.distributionFunctionsDialogVisible=false;
            me.ctlId='';
            if(refreshFlag)me.resetSearchButtonClicked();
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
                this.$message({ type: "error", message: error, duration: 3000, onClose: () => {} });
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
          me.editRoleDialogVisible=true;
        },
        distributionMenus(){//分配菜单
          let me=this;
          let checkedNodes = me.$refs.menusTree.getCheckedNodes();

          if(!checkedNodes||checkedNodes.length<=0){
            me.$message({ type: 'error', message: '请勾选菜单', duration: 2000 });
            return;
          }
          var parentIds = new Set();
          var menuIds="";
          checkedNodes.forEach(node=>{
              if(node.hasOwnProperty('parentCode')){
                menuIds+=node.code+',';
                parentIds.add(node.parentCode);
              }else{
                parentIds.add(node.code);
              }
          });
//        父节点处理
          for (let item of parentIds.keys()) {
            menuIds+=item+',';
          }
          me.distributionMenusDialogForm.mCodes=menuIds;
          me.editdistributionMenus();
        },
        distributionMenusDialogToggle(){
          let me=this;
//        弹窗显示树形菜单进行勾选
          if(!me.multipleSelection||me.multipleSelection.length!=1){
            me.$message({ type: 'error', message: '请勾选一个角色', duration: 2000 });
            return;
          }
          me.distributionMenusDialogForm.rCode=me.multipleSelection[0].code;
          me.fetchMenusTreeData();
          me.distributionMenusDialogVisible=true;
        },
        distributionFunctions(){
          let me=this;
//        弹窗显示树形菜单进行勾选
          if(!me.multipleSelection||me.multipleSelection.length!=1){
            me.$message({ type: 'error', message: '请勾选一个角色', duration: 2000 });
            return;
          }
          me.distributionMenusDialogForm.rCode=me.multipleSelection[0].code;
          me.distributionFunctionsDialogVisible=true;
        },
        searchButtonClicked() {
          this.fetchData();
        },
        resetSearchButtonClicked() { //重置查询
          this.searchForm.name='';
          this.searchForm.code='';
          this.fetchData();
        },
        //分配菜单请求
        async editdistributionMenus(){
          let me=this;
          await editRolesMenus(
            me.distributionMenusDialogForm,
            (response) => {
              me.menusTreeLoad = false;
              me.distributionMenusDialogVisible=false;
              this.$message({ type: "success", message: "授权菜单成功！", duration: 2000, onClose: () => {} });
            },
            (error) => {
              console.warn(error);
              this.menusTreeLoad = false;
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            },
            (exception) => {
              console.warn(exception);
              this.menusTreeLoad = false;
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            }
          );
        },
//      当前分页改变
        async handleCurrentChange(val) {
          this.setPaginationNextPage(val);
          this.fetchData();
        },
//
        async fetchMenusTreeData(){
          let me=this;
          me.menusTreeLoad=true;
          await getMenusList(
            {roleCode:me.distributionMenusDialogForm.rCode},
            (response) => {
              me.menusTreeData = response.data;
              var ary=response.defaultCheckNodes;
              for (var i = ary.length - 1; i >= 0; i--) {
                for(var j=0;j<me.menusTreeData.length;j++) {
                    if (ary[i] === me.menusTreeData[j].code) {
                        if(me.menusTreeData[j].subMenus.length>0) ary.splice(i, 1);
                    }
                  }
              }
              me.existCheckedMenuCodes=ary;
              me.menusTreeLoad = false;
            },
            (error) => {
              console.warn(error);
              this.menusTreeLoad = false;
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            },
            (exception) => {
              console.warn(exception);
              this.menusTreeLoad = false;
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            }
          );
        },
        async fetchData() {
          let me=this;
          me.tableLoading = true;
          me.searchForm.size=this.pagination.limit;
          me.searchForm.page=this.getPaginationSkip()
          await getRolesList(
            me.searchForm,
            (response) => {
              this.setPaginationTotal(response.pages);
              this.tableData = response.data;
              this.tableLoading = false;
            },
            (error) => {
              console.warn(error);
              this.tableLoading = false;
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            },
            (exception) => {
              console.warn(exception);
              this.tableLoading = false;
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            }
          );
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;

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
        checkRow(row, event){
              this.$refs.roleTable.toggleRowSelection(row);
        },
        handleViewRoleUsers(index){
          const item = this.tableData[index];
          this.$router.push({path:"/roleusers",query:{roleCode:item.code,roleName:item.name}});
        },
      },
      deactived(){
        this.$destroy();
      },
    };
</script>

<style lang="less" scope>

</style>
