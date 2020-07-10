<template>

  <el-row type="flex" class="row-bg" justify="space-between">
    <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="18">
        <el-form :model="form" :rules="formRules" v-loading="loading">
          <!--filterable-->
          <!--:filter-method="filterMethod"-->
          <!--filter-placeholder="请输入城市拼音"-->
          <el-form-item label="">
            <el-transfer
              v-model="form.funCodes"
              :props="{key:'code', label:'name'}"
              :titles="['未拥有', '已拥有']"
              :button-texts="['到左边', '到右边']"
              filterable
              :format="{noChecked: '${total}', hasChecked: '${checked}/${total}'}"
              :data="functions.data">
            </el-transfer>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="loading" @click="onSubmit()">提交</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>

        </el-form>
    </el-col>
    <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
  </el-row>

</template>

<script>
  import {getFunctionsTransferList,editRolesFunctions} from  "@/api/role";
  export default {
      name:'',
      props:{
          rCode:String,
      },
      mounted() {
          this.loadData();
      },
      data(){
        return{
          form:{funCodes:[],rCode:''},
          formRules:{},
          loading:false,
          functions:{data:[]}
        }
      },
      methods:{
        onSubmit(){
            debugger
          let me=this;
          me.form.rCode=me.rCode;
          me.editRolesFunctions();
        },
        async editRolesFunctions(){
          let me=this;
          await editRolesFunctions(
            me.form,
            (response) => {
              me.close();
              me.$message({ type: 'success', message: '修改权限成功', duration: 2000});
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
        async loadData(){
          let me=this;
          await getFunctionsTransferList(
            {roleCode:me.rCode}, (response) => {
              me.functions.data=response.data;
              me.form.funCodes=response.value;
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
        close(){
          this.$emit('close');
        }
      },
      watch:{
        rCode(){ //改变后需再次获取数据
          this.loadData();
        }
      }
    };
</script>

<style lang="less">

</style>
