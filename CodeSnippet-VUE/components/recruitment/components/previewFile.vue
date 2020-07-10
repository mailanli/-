<template>
  <div class="preview-file">
    <!-- 预览 -->
    <a-dialog title="预览" 
    v-model="previewShow" 
    class="preview-dialog" 
    style='text-align: center;'
    :toolbar="[]">
        <div class="apply-form-preview-frame">
          <img class="apply-form-prePhoto" :src='previewSrc'>
        </div>
    </a-dialog>
  </div>
</template>

<script>
export default {
      components: {},
      data(){
          return {
            previewShow: false,
            previewSrc: '',
          }
      },
      methods: {
        // 预览
        // name 文件名 
        // url 文件地址
        preview(name, url) {
          if (name && url) {
            let isPhoto = this.isPhoto(name)
            if (isPhoto) {
              this.previewShow = true
              this.previewSrc = url
            } else {
              window.open(url, '_blank')
            }
          }
        },
        // 判断是图片还是文件
        isPhoto (str) {
          if (str) {
            let arr = str.split('.')
            let type = arr[arr.length - 1]
            let types = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG']
            return types.indexOf(type) !== -1
          }
          return false
        }
      }

  };
</script>

<style lang="less">
  .apply-form-preview-frame {
    height: 350px;
    text-align: center;
    line-height: 350px;
  }
  .apply-form-prePhoto {
    max-width: 90%;
    max-height: 350px;
    min-width: 200px;
    vertical-align: middle;
  }
</style>
