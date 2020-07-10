<template>
  <div>
    <div class="apply-form">
      <section class="content-section">
        <div class="download-pdf">
          <i  class="el-icon-download" @click="downloadPdf">下载</i>
        </div>
        <apply-form ref="applyForm" id="apply-form" formType='entry'></apply-form>
      </section>
    </div>

  </div>
</template>

<script>
  import applyForm from "@/components/recruitment/components/applyForm.vue";
  export default {
        components: {
          applyForm
        },
        data(){
            return {
            }
        },
        mounted() {
        },
        methods: {
          init(data) {
            this.$refs.applyForm.init(data)
          },
          downloadPdf() {
            this.getPdf('apply-form','职位申请表')
          }
        }

    };
</script>

<style lang="less">
.apply-form {
  .download-pdf {
    margin: 0px 10px;
    text-align: right;
  }
  .el-icon-download {
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
