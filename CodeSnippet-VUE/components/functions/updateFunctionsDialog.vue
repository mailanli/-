<template>
  <el-row class="content-body" v-loading="loading" element-loading-text="拼命加载中">
    <el-form :model="item" :rules="rules" ref="funcForm" label-width="80px">
      <el-form-item label="操作编码" prop="code">
        <s-textfield v-model="item.code" placeholder="请填写编码..." :readonly="item.id===null"></s-textfield>
      </el-form-item>
      <el-form-item label="操作名称" prop="name">
        <s-textfield v-model="item.name" placeholder="请填写名称..."></s-textfield>
      </el-form-item>
      <el-form-item label="操作描述" prop="roleDescription">
        <s-textarea v-model="item.description" placeholder="请填写描述..."></s-textarea>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('funcForm')">确认</el-button>
        <el-button @click="formReset('funcForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  import {addFunctions,editFunctions,getDataById} from  "@/api/functions";
    export default {
        components: {},
        props:{
            id:String,
        },
        mounted() {
          this.getDataById();
        },
        data(){
            return {
              loading: false,
              rules: {
                code: [
                  { required: true, message: '请输入操作编码', trigger: 'blur' }
                ],
                name: [
                  { required: true, message: '请输入操作名称', trigger: 'blur' }
                ],
              },
              item: {
                id:'',
                code:'',
                name:'',
                description:"",
              },
            }
        },
        methods: {
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if (this.item.id) {
                  this.editAgreement();
                } else {
                  this.addAgreement();
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          async editAgreement(){
            let me=this;
            await editFunctions(
              me.item,
              (response) => {
                me.$emit('close');
                this.$message({ type: 'success', message: '操作成功', duration: 2000,
                  onClose: () => {
                    me.$refs['funcForm'].resetFields();
                  },
                });
              },
              (error) => {
                console.warn(error);
                this.$message({ type: "error", message: error, duration: 2000, onClose: () => {} });
              },
              (exception) => {
                console.warn(exception);
                // this.$message({ type: "error", message: "查询协议列表失败,请重新查询", duration: 2000, onClose: () => {} });
              }
            );
          },
          async addAgreement(){
            let me=this;
            await addFunctions(
              me.item,
              (response) => {
                me.$emit('close');
                this.$message({ type: 'success', message: '操作成功', duration: 2000,
                  onClose: () => {
                    this.$refs['funcForm'].resetFields();
                  },
                });
              },
              (error) => {
                console.warn(error);
                this.$message({ type: "error", message: error, duration: 2000, onClose: () => {} });
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
        deactived(){
            this.$destroy();
        },
        watch:{
          id(){
            if(this.id&&this.id.length>0) {
              this.getDataById();
            }else this.$refs['funcForm'].resetFields();
          }
        }

    };
</script>

<style lang="less" scoped>

</style>
