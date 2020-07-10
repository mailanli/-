<template>
    <div>
      <div class="page-agreement">
        <bread-crumb></bread-crumb>

        <el-row style="margin-top: 10px;margin-left: 20px">
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>菜单树</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="init"><i class="el-icon-refresh"></i></el-button>
              </div>
              <el-input
                style="margin-bottom: 5px;"
                size="small"
                placeholder="输入关键字进行过滤"
                v-model="filterText" clearable>
              </el-input>
              <el-tree
                ref="menusTree"
                @node-click="menuTreeClickHandler"
                :data="menusTreeData"
                :props="{children: 'subMenus',label: 'name'}"
                :default-checked-keys="existCheckedMenuCodes"
                :filter-node-method="filterNode"
                node-key="code">
              </el-tree>
            </el-card>
          </el-col>

          <el-col :span="17" style="margin-left: 20px">
            <el-card class="box-card">
              <el-button type="primary" @click="resetForm">增加菜单</el-button>
              <el-button type="success" @click="onSubmit('menuForm')" :loading="saveLoading">保存</el-button>
              <el-button type="danger" @click="deleteMenu">删除</el-button>
              <!--<el-button type="danger">禁用</el-button>-->
            </el-card>
            <el-card class="box-card" style="margin-top: 10px">
              当前状态 : <el-tag type="selectId!=''?'warning':'success'" style="font-size: 14px;">{{selectId!=''?'修改':'新增'}}</el-tag>
            </el-card>
            <el-card class="box-card" style="margin-top: 10px">
              <el-form :model="item" :rules="rules" ref="menuForm" label-width="80px">
                <el-form-item label="编码" prop="code">
                  <s-textfield v-model="item.code" placeholder="请填写编码..." :readonly="item.id===null"></s-textfield>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                  <s-textfield v-model="item.name" placeholder="请填写名称..."></s-textfield>
                </el-form-item>
                <el-form-item label="父菜单" prop="icon">
                  <el-cascader
                    style="width: 60%"
                    :options="menusTreeData"
                    v-model="parentNode"
                    :props="{value: 'code',label:'name',disabled:'enable',children: 'subMenus'}"
                    :change-on-select="true"
                    placeholder="请选择父菜单（不选择则为根级菜单）..."
                    @change="handleParentMenuChange" clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="访问路径" prop="name">
                  <s-textfield v-model="item.url" placeholder="请填写长访问路径..."></s-textfield>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                  <s-textfield v-model="item.icon" placeholder="请填写图标路径..."></s-textfield>
                </el-form-item>
                <el-form-item label="可用" prop="enable">
                  <el-switch v-model="item.enable"></el-switch>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">
                  <el-input-number v-model="item.orderNum" :min="1" :max="1000" label="请输入排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input type="textarea" :rows="5" v-model="item.description"></el-input>
                </el-form-item>
                <!--<el-form-item>-->
                  <!--<el-button type="primary" @click="onSubmit('roleForm')">确认</el-button>-->
                  <!--<el-button @click="formReset('roleForm')">重置</el-button>-->
                <!--</el-form-item>-->
              </el-form>
            </el-card>
          </el-col>
      </el-row>
    </div>
    </div>
</template>

<script>
  import breadCrumb from "../breadCrumb.vue";
  import {getMenusList,deleteMenuById} from  "@/api/role";
  import {deleteByid,addMenu,editMenu,getMenuDataById} from  "@/api/menu";
  export default {
      components: {
        breadCrumb},
      mounted() {
          this.init();
      },
      data(){
        return {
          menusTreeData:[],
          existCheckedMenuCodes:[],
          selectId:'',
          selectName:'',
          parentNode:[],
          filterText:'',

          selectNode:{},
          saveLoading:false,
          options:[],
          item:{code:'',name:'',url:'',parentCode:'',icon:'',enable:true,orderNum:0,description:''},
          rules:{
            code: [
              { required: true, message: '请输入编号', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            icon: [
              { required: true, message: '请输入图标路径', trigger: 'blur' }
            ],
            orderNum: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            url: [
              { required: true, message: '请输入访问路径', trigger: 'blur' }
            ],
          },

        }
      },
      methods:{
        deleteMenu(){
          let me=this;
          if(!me.selectNode||!me.selectNode.hasOwnProperty("id")){
            me.$message({ type: "error", message: '请选择菜单进行操作！', duration: 2000, onClose: () => {} });
            me.selectNode={};
            me.selectId='';
            return;
          }
          if(me.selectNode.subMenus&&me.selectNode.subMenus.length>0){
            me.$message({ type: "error", message: '该菜单下存在子菜单！无法删除！', duration: 2000, onClose: () => {} });
            me.selectNode={};
            me.selectId='';
            return;
          }
          this.$confirm('是否删除该菜单：[ '+me.selectNode.name+' ]' , "提示",{ confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }).then(() => {
            deleteMenuById(
              {
                id:me.selectId
              },
              (response) => {
                me.init();
                me.selectNode={};
                me.selectId='';
                me.$message({ type: "success", message: "删除成功", duration: 3000, onClose: () => {} });
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
        filterNode(value, data) {
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        },
        onSubmit(formName){
          let me=this;
          me.saveLoading=true;
          me.$refs[formName].validate((valid) => {
            if (valid) {
              me.$confirm('是否保存记录' , "提示",{ confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }).then(() => {
                if (me.item.id&&me.selectId&&me.selectNode) {
                  me.editAgreement();
                } else {
                  me.addAgreement();
                }
              });

            } else {
              me.saveLoading=false;
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(){
          this.$refs['menuForm'].resetFields();
          this.selectNode={};
          this.selectId='';
          this.item={code:'',name:'',url:'',parentCode:'',icon:'',enable:true,orderNum:0,description:''};
          this.parentNode=[];
        },
        menuTreeClickHandler(data,node,elem){
          this.selectId=data.id;
          this.selectNode=data;
          this.loadData();
        },
        handleParentMenuChange(value){
            if(value.length>2){
              this.$message({ type: "error", message: '菜单层级不能错过3级！', duration: 2000, onClose: () => {} });
              this.parentNode.pop();
              return false;
            }
            this.item.parentCode=value[value.length-1];

        },
        init(){
          let me=this;
          me.fetchMenusTreeData();
        },
        async editAgreement(){
          let me=this;
          await editMenu(
            me.item,
            (response) => {
              me.init();
              me.saveLoading=false;
              this.$message({ type: 'success', message: '操作成功', duration: 2000,
                onClose: () => {
                  me.$refs['menuForm'].resetFields();
                },
              });
            },
            (error) => {
              console.warn(error);
              me.saveLoading=false;
              this.$message({ type: "error", message: error, duration: 2000, onClose: () => {} });
            },
            (exception) => {
              me.saveLoading=false;
              console.warn(exception);
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            }
          );
        },
        async addAgreement(){
          let me=this;
          await addMenu(
            me.item,
            (response) => {
              me.init();
              me.saveLoading=false;
              this.$message({ type: 'success', message: '操作成功', duration: 2000,
                onClose: () => {
                  this.$refs['menuForm'].resetFields();
                },
              });
            },
            (error) => {
              console.warn(error);
              me.saveLoading=false;
              this.$message({ type: "error", message: error, duration: 2000, onClose: () => {} });
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            },
            (exception) => {
              me.saveLoading=false;
              console.warn(exception);
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            }
          );
        },
        async fetchMenusTreeData(){
          let me=this;
          me.menusTreeLoad=true;
          await getMenusList(
            {roleCode:''},
            (response) => {
              me.menusTreeData = response.data;
              me.existCheckedMenuCodes=response.defaultCheckNodes;
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
        async loadData(){
          let me=this;
          await getMenuDataById(
            {id:me.selectId}, (response) => {
              me.item=response;
              me.parentNode=[];
              me.parentNode=me.parseCascaderByCode(me.item.parentCode);
            },
            (error) => {
              console.warn(error);
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            },
            (exception) => {
              console.warn(exception);
              // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
            }
          );
        },
        parseCascaderByCode(code){
          let me=this;
          var node=[];
          me.menusTreeData.forEach(m=>{
              if(m.code===code){
                  node.push(m.code);
              }

              m.subMenus.forEach(mm=>{
                if(mm.code===code){
                  node.push(m.code);
                  node.push(mm.code);
                }

                mm.subMenus.forEach(mmm=>{
                  if(mmm.code===code){
                    node.push(m.code);
                    node.push(mm.code);
                    node.push(mmm.code);
                  }
                });

              });
          });
          return node;
        },
      },
      deactived(){
        this.$destroy();
      },
      watch:{
        filterText(val) {
          this.$refs.menusTree.filter(val);
        }
      }

    };
</script>

<style lang="less" scoped>

</style>
