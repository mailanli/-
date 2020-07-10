<template>
  <a-dialog 
    title="分类选择"
    v-model="isShow" 
    :close-on-click-modal="false" 
    dialogWidth="700px"
    @input="beforeClose"
    append-to-body
    :toolbar="toolbar"
  >
    <div class="class_content">
      <div class="content_select">
        <p class="content_title">已选分类
          <el-button type="text" @click="clearAll">全部清除</el-button>
        </p>
        <div class="content_item">
          <el-tag 
            v-for="(item, index) in selectList" 
            :key="index" 
            type="info"
            closable
            @close="handleClose(item)"
          >{{item.name}}</el-tag>
        </div>
        <div class="content_search">
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <!-- <el-input size="small" placeholder="请输入内容" @change="serachClass" v-model="keyWord">
            <el-button slot="append" icon="el-icon-search" @click="serachClass"></el-button>

          </el-input> -->
          <el-select
            v-model="keyWord"
            filterable
            remote
            size="small"
            reserve-keyword
            placeholder="请输入关键词"
            @change="changeClass"
            :remote-method="serachClass"
          >
            <el-option
              v-for="item in serachList"
              :key="item.id"
              :label="item.name"
              :value="`${item.path},${item.name}`">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="class_list">
        <div class="first_list">
          <div
            v-for="(item, index) in parentList" 
            :class="[{'select': selectIndex === index}, 'first_item']"            
            :key="index"
            @click="clickSelect(item, index)"
          >{{item.name}}</div>
        </div>
        <div class="second_list">
          <div 
            v-for="(item, index) in parentList"
            :key="index"
            v-show="selectIndex == index"
          > 
            <el-checkbox 
              v-for="(itm, idx) in item.children"
              :key="idx"
              :true-label="`1,${index},${idx}`"
              :false-label="`0,${index},${idx}`"
              v-model="itm.check"
              @change="changeCheck"
            >{{itm.name}}</el-checkbox>
          </div>         
        </div>
      </div>
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
      // 弹窗按钮配置
      toolbar: [{
        text: '取消',
        type: 'plain',
        func: (done) => {
          this.cancel(done)
        }
      },{
        text: '确定',
        func: (done) => {
          this.confirm(done)         
        }
      }],
      // 已选类型
      selectList:[
      ],
      // 类型查询字段
      keyWord: '',
      allList: [],
      parentList: [
      ],
      childrenList: [
      ],
      selectIndex: 0,
      serachList: [],
      testData: true
    }
  },
  created () {
    this.initData()
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
      this.$emit('selectData', this.selectList)
      done()
    },
    clickSelect (item, index) {
      this.selectIndex = index
      this.childrenList = this.allList.filter(itm => {
        return item.id === itm.parentId
      })
    },
    initData () {
      req('getClassList').then(res =>{
        if (res.code == '0') {
          this.operateData(res.data)
          this.allList = res.data
        }
      })
    },
    operateData (val) {
      val.forEach(item => {
        if (item.parentId == '-1') {
          this.parentList.push(item)
        }
      })
      this.parentList.forEach((item, index) => {
        item.children = []
        val.forEach(itm => {
          if (item.id == itm.parentId) {
            itm.check = false
            item.children.push(itm)
          }
        })
      })
    },
    // checkbox点击选中和取消
    changeCheck (val) {
      let arr = val.split(',')
      let name = this.parentList[arr[1]].name + ">" + this.parentList[arr[1]].children[arr[2]].name
      let item = {name: name, path: this.parentList[arr[1]].children[arr[2]].path}
      if (arr[0] == 1) {
        this.selectList.push(item)
      } else {
        this.handleClose(item)
      }
    },
    // 删除已选类别
    handleClose(val) {
      this.selectList = this.selectList.filter(item => {
        return item.name !== val.name
      })
      this.setCheckbox(val.path, false)
    },
    // 清除全部类别
    clearAll () {
      this.selectList = []
      this.parentList.forEach((item, index) => {
        item.children.forEach((itm, idx) => {
          this.parentList[index].children[idx].check = false
        })
      })
    },
    // 远程搜索
    serachClass (val) {
      if (val !== '') {
         let params = {
          id: this.parentList[this.selectIndex].id,
          name: val
        }
        req('getSearchClass', params).then(res => {
          if (res.code == '0') {
            this.serachList = res.data
          }
        })
      } else {
        this.serachList = []
      }     
    },
    // 远程结果选中
    changeClass (val) {
      let arr = val.split(',')
      let name = this.parentList[this.selectIndex].name + '>' + arr[1]
      let path = arr[0]
      if ( !this.selectList.some(item => { return item.name == name}) ) {
        this.selectList.push({ name: name, path: path })
        this.setCheckbox(path, true)
      }            
    },
    // 更新checkbox状态
    setCheckbox (path, loop) {
      this.parentList.forEach((item, index) => {
        item.children.forEach((itm, idx) => {
          if (path == itm.path) {
            this.parentList[index].children[idx].check = loop ? true : false
          }
        })
      })
    }
  }
}
</script>
<style lang="less">
.class_content {
  height: 400px;
  .content_select {
    border-bottom: 1px solid #ccc;
    .content_item {
      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .content_search {
      .el-select {
        margin: 10px 0;
        width: 60%;
      }
      // .el-input {
      //   margin: 10px 0;
      //   width: 60%;
      // }
    }   
  }
  .class_list {
    overflow: hidden;  
    .first_list {
      height: 280px;
      width: 150px;
      padding-top: 10px;
      float: left;     
      border-right: 1px solid #ccc;
      .first_item {
        &:hover {
          cursor: pointer;
        }
        margin: 10px 0;
        text-align: center;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        border-left: 2px solid #fff;
      }
      .select {
        color: #2db7f5;
        border-left: 2px solid #2db7f5;
      }
    }
    .second_list {
      height: 280px;
      width:480px;
      padding-top: 10px;
      padding-left: 20px;
      float: left;
      .el-checkbox {
        width: 100px;
        height: 60px;
        margin-left: 0;
      }
    }
  }
}
</style>


