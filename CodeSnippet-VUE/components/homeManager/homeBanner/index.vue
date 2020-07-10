<template>
  <div class="banner_manage">
    <bread-crumb></bread-crumb>
    <div style="padding:10px;">
      <p>
        <i class="el-icon-warning" style="color:red;"></i>
        <span style="font-size:14px;margin-left:5px;">注意：最多可添加6张banner</span>
      </p>
      <div class="img_list">
        <div v-for="(val, index) in bannerList" :key="index" class="single_banner"  v-if="index < 6"  >
          <img :src="val.coverUrl" :alt="val.content">
          <p class="banner_title">{{val.content}}</p>
          <p class="banner_operate">
            <span @click="edit(val.webSiteId)">编辑</span>
            <span>|</span>
            <span @click="del(val)">删除</span>
          </p>
        </div>
        <el-button class="addBtn" :class="{ 'disable': disableV}"  v-if="showBannerList" icon="el-icon-plus" @click="addBtnFlag && add()" ></el-button>
      </div>
    </div>  
    <lesson-selector 
      v-if="showLesson"
      :isShow.sync="showLesson"
      @selectData="selectData"
    ></lesson-selector>
    <lesson-selector 
      v-if="showLessonEdit"
      :isShow.sync="showLessonEdit"
      @selectData="selectDataEdit"
    ></lesson-selector>   
  </div>
</template>

<script>

import req from '@/api/banner.js'
export default {
  data () {
    return {
      disableV:false,
      addBtnFlag:true,
      bannerList: [],
      showBannerList:true,
      showLesson:false,
      showLessonEdit:false,
      editWebSiteId:'',
    }
  },
  created () {
    this.getBannerList()
  },
  methods: {
    // banner列表
    getBannerList () {
      req('getBannerList', {}).then(res => {
        if(res.resultCode == 0){
          this.bannerList=res.data
          if(res.data.length >= 6 ){
            this.disableV=true; 
            this.addBtnFlag=false
          }else{
            this.disableV=false; 
            this.addBtnFlag=true
          }
        }else{
          alert(res.resultMsg)
        }
      })
    },
    // 增加banner
    add () {
      this.showLesson = true;
    },
    // 增加banner事件
    selectData (val) {
      let param={
        url:val.cover,
        courseId:val.id,
        title:val.name
      }
      req("add", param).then(res => {
        if(res.resultCode == 0){
          this.$message("新增成功！")
          this.getBannerList()
        }else{
          alert(res.resultMsg)
        }
      })
    },
    // 编辑
    edit(webSiteId){
        this.showLessonEdit = true;
        this.editWebSiteId=webSiteId;
    },
    // 编辑banner事件
    selectDataEdit (val) {
      let param={
        url:val.cover,
        courseId:val.id,
        title:val.name,
        webSiteId:this.editWebSiteId,
        type:"update"
      }
      req("update", param).then(res => {
        if(res.resultCode == 0){
          this.$message("编辑成功！")
          this.getBannerList()
        }else{
          this.$message(res.resultMsg)
        }
      })
    },
    // 删除
    del(val){
      let param={
        url:val.coverUrl,
        title:val.title,
        content:val.content,
        courseId:val.courseId,
        webSiteId:val.webSiteId,
        type:"remove"
      }
      req('update', param).then(res => {
        if(res.resultCode == 0){
          this.$message(param.content+"已删除")
          this.getBannerList()
        }else{
          this.$message(res.resultMsg)
        }
      })
    }
  }
}
</script>

<style lang="less">
.banner_manage{
  .img_list {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    .single_banner,.addBtn {
      width: 200px;
      height: 120px;
      position: relative;
      margin-right: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      img {
        width: 200px;
        height: 120px;
      }
      .banner_title {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 200px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #aaa;
        color: #fff;    
        font-size: 12px;   
      }
      .banner_operate {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 30px;
        line-height: 30px;
        text-align: center;
        width: 200px;
        font-size: 12px;
        background: #eee;
        span:hover {
          cursor: pointer;
        }
        display: none;
      }
      &:hover {
        .banner_operate {
          display: block;
        }
      }
    }
    .upload_box{
      width: 200px;
      height: 120px;
      line-height: 120px;
      text-align:center;
      border: 1px solid #ccc;
      box-sizing: border-box;
      padding-top: 10px;
      i{
        font-size: 60px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  // 图片
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .disable{background-color: #eee;
    &：hover{background-color: #eee; color:#eee;}
    i{color:#000;
    }
  }
}
</style>


