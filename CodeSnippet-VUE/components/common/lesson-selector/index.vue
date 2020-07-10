<template>
  <a-dialog 
    title="资源选择器"
    v-model="isShow" 
    :close-on-click-modal="false" 
    dialogWidth="700px"
    @input="beforeClose"
    append-to-body
    :toolbar="toolbar"
  >
    <div class="lesson_content">
      <el-tabs v-model="lessonType" @tab-click="tabClick">
        <el-tab-pane label="课程" name="课程" v-loading="loadingObj[0].tabLoading">
          <el-input placeholder="请输入课程名称" v-model="keyWord" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="searchLesson()"></el-button>
          </el-input>
          <div class="content_lesson">
            <div 
              :class="[{'select': selectIndex === index}, 'content_item']" 
              v-for="(item, index) in lessonList" 
              :key="index"
              @click="clickSelect(item, index)"
            >
              <div>
                <img :src="item.cover" alt="">
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>      
        </el-tab-pane>
        <el-tab-pane label="共享课程" name="共享课程" v-loading="loadingObj[1].tabLoading">
          asdasd
        </el-tab-pane>
      </el-tabs>
      <transition name="show-fade">
        <div class="set_img" v-show="nextSign">       
          <p class="setTitle">设置图片及标题<i class="el-icon-close" @click="closeSetimg()"></i></p>
          <div class="img_form">
            <el-form :model="setFormData" :rules="rules" label-width="100px">
              <el-form-item class="upload_img" label="封面图片" prop="cover">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img :src="setFormData.cover" class="avatar">              
                </el-upload> 
                <p class="upload_alert">
                  图片尺寸：1125x468像素；格式仅支持jpg、png，且不能大于2M
                </p>                          
              </el-form-item>

              <el-form-item label="推荐标题" prop="name">
                <el-input v-model="setFormData.name"></el-input>
              </el-form-item>

              <el-form-item label="推荐语" prop="comText">
                <el-input type="textarea" v-model="setFormData.comText"></el-input>
              </el-form-item>
              
            </el-form>
          </div>         
        </div>
      </transition>
      
    </div> 
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="pages.pageIndex || 1"
        :page-size="pages.pageSize"
        :total="pages.total"
        layout="total, prev, pager, next"
      >
      </el-pagination>
    </div>    
  </a-dialog>
</template>
<script>
import req from '@/api/common.js'

export default {
  name: 'Aorgan',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      toolbar: [{
        text: '取消',
        type: 'plain',
        func: (done) => {
          this.cancel(done)
        }
      },{
        text: '确定',
        hide: true,
        func: (done) => {
          this.confirm(done)         
        }
      },{
        text: '下一步',
        hide: false,
        func: (done) => {
          this.showSetimg(done)         
        }
      }],
      pages: {
        pageIndex: 1,
        pageSize: 8,
        total: 0
      },
      keyWord: '', // 搜索关键字
      lessonList: [], // 课程数据数组
      selectIndex: '',
      selectData: {},
      nextSign: false, // 下一步标识
      imageUrl: '',
      setFormData: {
        cover: '',
        name: '',
        comText: ''
      },
      rules: {
        cover: [
          { required: true }
        ],
        name: [
          { required: true, message: '请选输入标题', trigger: 'blur' }
        ]
      },
      lessonType: '课程',
      loadingObj: [{
          tabLoading: true
        },
        {
          tabLoading: false
        }
      ]
    }
  },
  computed: { 
    uploadUrl () {
      this.$store.dispatch('getSysUserInfo')
      let Token = this.$store.state.sysUserInfo.accessToken
      let base = process.env.AIP_BASE
      return base + '/api/banner/upload?AccessToken=' + Token
    }
  },
  created () {
    console.log(123123)
    if (this.isShow) {
      this.getlessonList()
    }  
  },
  methods: {
    beforeClose () {
      this.$emit('update:isShow', false)
    },
    cancel (done) {
      done()
    },
    // 确认选中课程
    confirm (done) {
      let selectVal = {}
      switch (this.lessonType) {
        case "课程":
        selectVal = Object.assign(this.selectData, this.setFormData)
      }
      this.$emit('selectData', selectVal)
      done()
    },
    // 设置下一步
    showSetimg (done) {
      if (this.selectData.cover) {
        this.nextSign = true
        this.setFormData.cover = this.selectData.cover
        this.setFormData.name = this.selectData.name
        this.toolbar[1].hide = false
        this.toolbar[2].hide = true
      } else {
        this.showMessage('warning', '请选择内容')
      } 
    },
    // 获取课程资源
    getlessonList () {
      req('getLessonList', {
          name: this.keyWord, 
          pageSize: this.pages.pageSize,
          pageIndex:  this.pages.pageIndex
        }).then(res => {
          this.loadingObj[0].tabLoading = false
          this.selectIndex = ''
          this.lessonList = res.data.data
          this.pages.pageIndex = res.data.currentPage
          this.pages.total = res.data.total
      })
    },
    // 分页索引
    handleCurrentChange (val) {
      this.pages.pageIndex = val
      switch (this.lessonType) {
        case "课程":
        this.loadingObj[0].tabLoading = true
        this.getlessonList()
        break;
      }      
    },
    // 课程查询
    searchLesson () {
      this.pages.pageIndex = 1
      this.getlessonList()
    },
    // 选中样式
    clickSelect (val, index) {
      this.selectIndex = index
      this.selectData = val
    },
    // 封面图片上传
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      if (res.code === 0) {
        this.setFormData.cover = res.data.url
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    closeSetimg () {
      this.nextSign = false
      this.toolbar[1].hide = true
      this.toolbar[2].hide = false
    },
    // 每一个tab的loading加载以及请求数据
    tabClick (val) {
      let index = val.index
      this.loadingObj[index].tabLoading = true
      switch (index) {
        case "0":
        this.getlessonList()
      }
    }
  }
}
</script>
<style lang="less">
  .el-dialog__body {
    padding-top: 0px;
    .lesson_content {
      position: relative;
      height: 350px;
      .el-tabs {
        width: 100%;
        .el-tabs__content {
          .el-input {
            width: 300px;
          }
          .content_lesson {
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            .select {
              img {
                border: 1px solid #2db7f5;
                box-sizing: border-box;
              } 
            }
            .content_item {
              &:hover {
                cursor: pointer;
              }
              width: 25%;           
              margin-bottom: 20px;
              img {
                display: inline-block;
                width: 90%;
                height: 90px;
              }  
              p {
                text-align: center;
              }         
            }
          }
        }
      }
      .set_img {
        width: 100%;
        height: 300px;
        position: absolute;
        left: 0;
        bottom: 0;
        .setTitle {
          position: relative;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #000;
          color: #fff;
          i {
            position: absolute;
            right: 10px;
            top: 18px;
            font-size: 20px;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .img_form {
          padding: 10px 20px;
          background: #ccc;
          .upload_img {
            .avatar-uploader {
              display: inline-block;
              height: 100px;
              width: 150px;
              img {
                width: 150px;
                height: 78px;
              }
            }
            .upload_alert {
              display: inline-block;
              width: 300px;
            }
          }        
        }
      }
    }
  }

  // 动画
  /* 设置持续时间和动画函数 */
.show-fade-enter-active {
  transition: all 1s ease;
}
.show-fade-leave-active {
  transition: all .3s;
}
.show-fade-enter, .show-fade-leave-to {
  transform: translateY(280px);
}

</style>


