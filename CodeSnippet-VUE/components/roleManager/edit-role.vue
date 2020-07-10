<template>
  <el-row class="content-body" v-loading="loading" element-loading-text="拼命加载中">
    <el-form :model="item" :rules="rules" ref="roleForm" label-width="80px">
      <el-form-item label="角色编码" prop="code">
        <s-textfield v-model="item.code" placeholder="请填写角色编码..." readonly></s-textfield>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <s-textfield v-model="item.name" placeholder="请填写角色名称..."></s-textfield>
      </el-form-item>
      <el-form-item label="菜单权限" prop="roleColumnIds">
        <el-tree ref="menus" :data="menusTree.data"
                 node-key="code" :props="{children: 'subMenus',label: 'name'}"
                 show-checkbox :default-checked-keys="item.menusIds" @check-change="handleCheckChange" ></el-tree>
      </el-form-item>
      <el-form-item label="操作权限" prop="roleColumnIds">
        <el-transfer
          v-model="item.functionIds"
          :props="{key:'code', label:'name'}"
          :titles="['未拥有', '已拥有']"
          filterable
          :format="{noChecked: '${total}', hasChecked: '${checked}/${total}'}"
          @change="funcChange"
          :data="functions2.data">
        </el-transfer>
      </el-form-item>
      <!--<el-form-item label="角色描述" prop="roleDescription">-->
        <!--<s-textarea v-model="item.roleDescription" placeholder="请填写该角色的描述"></s-textarea>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit('roleForm')">确认</el-button>
        <el-button @click="formReset('roleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>
<script>
  import {addRole,getDataById,getMenusList,editRole,getFunctionsList,getFunctionsTransferList} from  "@/api/role";
  export default {
    name:'editRoleDialog',
    components: {},
    props:{
      id:String,
    },
    data() {
      return {
        functions2:{data:[]},
        loading: false,
        rules: {
          code: [
            { required: true, message: '请输入编号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        },
        item: {
          id:'',
          code:'',
          name:"",
          menusIds: [],
          functionIds: []
        },
        menusTree: {data:[]}
      }
    },
    mounted() {
      this.getDataById();
    },
    methods: {
      funcChange(val,direction,changeAry){
//      修改数据通知组件-强行界面刷新
        this.functions2.data.push('1');
        this.functions2.data.pop()
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
//          处理菜单权限
            let checkedNodes = this.$refs.menus.getCheckedNodes();
            var parentIds = new Set();
            checkedNodes.forEach(node=>{
              if(node.hasOwnProperty('parentCode')){
                this.item.menusIds.push(node.code);
                parentIds.add(node.parentCode);
              }else{
                parentIds.add(node.code);
              }
            });
//        父节点处理
            for (let item of parentIds.keys()) {
              this.item.menusIds.push(item);
            }
              this.editAgreement();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async editAgreement(){
        let me=this;
        await editRole(
          me.item,
          (response) => {
            me.$emit('close');
            me.menusTree.data=[];
            me.item.menusIds=[];
            me.functions2.data=[];
            me.$message({ type: 'success', message: '操作成功', duration: 2000,
              onClose: () => {
                me.$refs['roleForm'].resetFields();
              },
            });
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
      handleCheckChange(data, checked, indeterminate){
//        if(data.hasOwnProperty('privileges')) {
//          if(!checked) {//没被选中的或半选状态的
//            data.privileges.forEach((node) => {
//              let index = $.inArray(node.id, this.item.rolePrivilegeIds);//用于在数组（this.item.rolePrivilegeIds）中搜索指定的值（node.id）,并返回其索引值。如果数组中不存在该值,则返回-1;
//              if(index != -1){
//                this.item.rolePrivilegeIds.splice(index, 1);//删除数组中索引index对应的元素
//              }
//            })
//          }
//        }
      },
      handleRenderCheckChange(e, data, node){
        let checked = e.target.checked, val = parseInt(e.target.value);

        if(checked){
          this.item.rolePrivilegeIds.push(val);
          this.$refs.roleColumn.setChecked(data.id, true);
        } else {
          let index = $.inArray(val, this.item.rolePrivilegeIds);
          if(index != -1){
            this.item.rolePrivilegeIds.splice(index, 1);
          }
        }
      },
      inObjArray(array, prop, val){
        let result = -1;
        array.forEach((obj, index) => {
          if(obj[prop] === val) {
            result = index;
          }
        })
        return result;
      },
      async fetchMenusTreeData(){
        let me=this;
        await getMenusList(
          {roleCode:me.item.code},
          (response) => {
//                todo
            me.menusTree.data = response.data;
            var ary=response.defaultCheckNodes;
            for (var i = ary.length - 1; i >= 0; i--) {
              for(var j=0;j<me.menusTree.data.length;j++) {
                if (ary[i] === me.menusTree.data[j].code) {
                  ary.splice(i, 1);
                }
              }
            }
            me.item.menusIds=ary;
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
      async loadFunctionData(){
        let me=this;
        await getFunctionsTransferList(
          {roleCode:me.item.code}, (response) => {
            me.functions2.data=response.data;
            me.item.functionIds=response.value;
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
      async getDataById(){
        let me=this;
        await getDataById(
          {id:me.id},
          (response) => {
            this.item=response;
            this.fetchMenusTreeData();
//            this.fetchFunctionsData();
            this.loadFunctionData();
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
    },
    watch: {
      id(){
          if(this.id&&this.id.length>0){
            this.getDataById();
          }
      }
    },
  }
</script>
<style lang="less" scoped>
</style>
