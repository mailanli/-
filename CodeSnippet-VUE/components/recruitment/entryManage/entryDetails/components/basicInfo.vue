<template>
  <div>
    <div class="basic-info">
      <section class="content-section">
        <div style="margin: 15px ;"></div>
        <el-row v-loading="loading">
          <el-col :span="16">
            <el-form ref="form" :model="form" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">
                    {{form.personInfo ? form.personInfo.name ? form.personInfo.name : '--' : '--'}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别：">
                    {{form.personInfo ? form.personInfo.genderName ? form.personInfo.genderName : '--' : '--'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="出生日期：">
                    {{form.personInfo ? form.personInfo.birthday ? form.personInfo.birthday : '--' : '--'}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="婚姻状况：">
                    {{form.personInfo ? form.personInfo.maritalStatus ? form.personInfo.maritalStatus : '--' : '--'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系电话：">
                    {{form.personInfo ? form.personInfo.phone ? form.personInfo.phone : '--' : '--'}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="E-mail：">
                    {{form.personInfo ? form.personInfo.email ? form.personInfo.email : '--' : '--'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="身份证号码：">
                    {{form.personInfo ? form.personInfo.idCardNumber ? form.personInfo.idCardNumber : '--' : '--'}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="现住址：">
                    {{form.personInfo ? form.personInfo.correspondenceAddress ? form.personInfo.correspondenceAddress : '--' : '--'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="入职部门：">
                    {{form.departmentName ? form.departmentName : '--'}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="入职职位：">
                    {{form.psnjob ? form.psnjob.pk_POST ? form.psnjob.pk_POST : '--' : '--'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="建议入职时间：">
                    {{form.scheduleEntryTime ? form.scheduleEntryTime : '--'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="入职进度：">
                    {{form.entryProgressName ? form.entryProgressName : '--'}}
                    <i v-if="form.entryProgressName === 3" class="el-icon-tickets" 
                    :title="form.entryProgressReason ? '取消入职原因: ' + form.entryProgressReason : '--'"></i>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="4" class="photo-col">
            <img class="photo" :src="form.accessories ? form.accessories.url : ''">
          </el-col>
        </el-row>
        <!-- <div style="font-size: 12px; text-align: center; padding: 10px; color: gray;">CopyRight @ 碧桂园物业 {{new Date().getFullYear()}}</div> -->
      </section>
    </div>

  </div>
</template>

<script>
import api from '@/api/entryManage'
export default {
      components: {},
      data(){
          return {
            form: {},
            loading: false
          }
      },
      mounted() {
      },
      methods: {
        init (data) {
          this.form = {}
          this.getData(data)
        },
        getData(data) {
          this.loading = true
          api(
            'queryBasicInformation',
            {
              id: data.id
            }
          ).then(
            res => {
              console.log('getData', res)
              this.form = this.dealData(res)
              this.loading = false
            }
          ).catch(error => {
            console.warn(error);
            this.loading = false
          })
        },
        dealData(data) {
          data.departmentName = data.department ? this.dealDepartmentName([data.department.areaCompany, data.department.companyType, data.department.departmentName1, data.department.departmentName2, data.department.departmentName3,]) : ''
          return data
        },
        dealDepartmentName(array = []) {
          let result = array[0] ? array[0] : ''
          array.forEach((ele, index) => {
            if (ele && index > 0) {
              if (index + 1 !== array.length) {
                result += result ? '/' : ''
              }
              result += ele ? ele : ''
            }
          });
          return result
        }

      }

  };
</script>

<style lang="less" scoped>
.el-select{
  width: 100%;
}
.basic-info {
  .photo-col {
      padding-top: 10px;
      text-align: center;
  }
  .photo {
    width: 140px;
  }
}
</style>
