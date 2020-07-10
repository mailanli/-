<template>
  <el-card class="box-card user-item">
    <div slot="header" class="clearfix user-header">
      <div class="paihang-wrapper paihang-wrapper1" v-if="(userKey == 0 && showRangking)">
        <img src="static/img/No1.svg">
        <span class="paihang-"></span>
        <span class="title title1">1</span>
      </div>
      <div class="paihang-wrapper" v-if="(userKey == 1 && showRangking)">
        <img src="static/img/No2.svg">
        <span class="title">2</span>
      </div>
      <div class="paihang-wrapper" v-if="(userKey == 2 && showRangking)">
        <img src="static/img/No3.svg">
        <span class="title">3</span>
      </div>
      <!-- 对比按钮 -->
      <el-button v-if="userType==='compare'" class="compare-btn" type="text" @click.stop.prevent="addToCompares">
        对比
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
      <!-- 月份选择 -->
      <el-select v-if="userType==='select'" class="compare-month strong" :size="selectSize" v-model="userMsg.selectMonth" @change="monthHandler" placeholder="选择月份">
        <el-option v-for="item in userMonthList" :key="item.value" :monthKey="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div @click='goAreaAll(userMsg)'>
      <div class="user-wrapper clearfix">
        <div class="user-panel">
          <div class="avatar-wrapper">
            <img class="avatar" :src="userMsg.pic" onerror="this.src='./static/img/avator.jpg'">
          </div>

          <div class="info-warpper">
            <!-- 分数 -->
            <!-- {{userMsg.completeRate}} -->

            <div v-if="userMsg.score!=undefined">
              <p class="info-item score">
                <span v-if="quotaScore=='加/减分项'">
                  {{parseInt(userMsg.score*100)/100}}
                </span>
                <span v-else>
                  {{userMsg.score == -1 ? '/' : parseInt(userMsg.score*100)/100}}
                </span>
              </p>
              <p class="ringThan" v-if="userMsg.ringThan > 0">
                <i class="el-icon-caret-top grow"></i>&nbsp;{{userMsg.ringThan}}</p>
              <p class="ringThan" v-else-if="userMsg.ringThan < 0 ">
                <i class="el-icon-caret-bottom lower"></i>&nbsp;{{userMsg.ringThan}}</p>
              <p class="ringThan" v-else>
                <i class="el-icon-minus"></i>
              </p>
            </div>
            <!-- 完成率 -->
            <div v-else-if="userMsg.completeRate!=undefined">
              <p class="info-item score">{{userMsg.completeInfo[0].completeRate|percent}}</p>
              <p class="ringThan" v-if="userMsg.completeInfo[0].ranges > 0">
                <i class="el-icon-caret-top grow"></i>&nbsp;{{userMsg.completeInfo[0].ranges}}</p>
              <p class="ringThan" v-else-if="userMsg.completeInfo[0].ranges < 0 ">
                <i class="el-icon-caret-bottom lower"></i>&nbsp;{{userMsg.completeInfo[0].ranges}}</p>
              <p class="ringThan" v-else>
                <i class="el-icon-minus"></i>
              </p>
            </div>

            <!-- 名称 -->
            <p class="info-item name">{{userMsg.name|isobject}}</p>
            <!-- 区域名称 -->
            <el-tooltip class="item" effect="dark" :content="userMsg.areaName" placement="left">
              <p class="info-item areaName">{{userMsg.areaName}}</p>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue'

export default {
  data() {
    return {
      monthSelect: '',
      selectSize: 'mini',
      selectMonth: 0,
      selectMonthList: []
    }
  },
  props: {
    month: Number,
    userMsg: Object,
    userKey: Number,
    userMonthList: Array,
    userCompareList: Array,
    userType: String,
    regionCity: String,
    quartMonth: String,
    quotaScore: '',
    showRangking: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  filters: {
    // 过滤值为 null 和 undefined 的
    isobject(data) {
      if (data instanceof Object) {
        return ''
      } else {
        return data
      }
    },
    isNull(data) {
      if (
        data === null ||
        data === 'null' ||
        data === undefined ||
        data === 'undefined'
      ) {
        return ''
      } else return data
    },
    percent(value) {
      if (value > 0 && value) {
        if (value != '0') {
          let val = parseFloat(value) * 100
          if (value.split('.')[1].length > 2) {
            val = val.toFixed(2)
          }
          return val + '%'
        } else {
          return value
        }
      } else {
        return '/'
      }
    }
  },
  activated() {
    console.log(this.userMsg)
    // this.selectMonth = this.userMsg[0] ? this.userMonthList[0].selectMonth : 0;
  },
  created() {
    // this.initComparePage()
    
  },
  methods: {
    monthHandler(data) {
      Vue.set(this.userMsg, 'selectMonth', this.userMsg.selectMonth)
      console.log(this.userMsg)
      this.$emit('monthChange')
    },
    addToCompares() {
      let len = this.userCompareList.length
      let data = ''
      console.log('this.userMsg'), console.log(this.userMsg)
      if (this.userMsg && len <= 2) {
        data = this.deepCopy(this.userMsg)
        this.userCompareList.push(data)
      } else if (len > 2) {
        this.$message('最多可选择3条')
      }
      this.$emit('addCompares')
    },
    goAreaAll(res) {
      // console.log(res)
      let _this = this
      if (_this.userType === 'select') {
        return
      }
      let path = ''
      if (_this.regionCity == '城市公司') {
        path =
          _this.quartMonth == '季度'
            ? '/areaManagerCity'
            : '/areaManagerCityMonth'
      } else {
        path = _this.quartMonth == '季度' ? '/areaManager' : '/areaManagerMonth'
      }
      // console.log(res.areaId)
      this.$router.push({
        path: path,
        query: {
          areaId: res.areaId,
          month: _this.month,
          region: _this.regionCity
        }
      })
    },
    // 深度拷贝
    deepCopy(p, c) {
      c = c || {}
      for (var i in p) {
        if (p.hasOwnProperty(i)) {
          if (typeof p[i] === 'object') {
            c[i] = Array.isArray(p[i]) ? [] : {}
            this.deepCopy(p[i], c[i])
          } else {
            c[i] = p[i]
          }
        }
      }
      return c
    }
  }
}
</script>
	<style lang="less" scoped>
.user-item {
  display: inline-block;
  width: 250px;
  margin: 10px;
  overflow: inherit;
  .user-header {
    position: relative;
    height: 32px;
    line-height: 32px;
    overflow: unset;
    /* 用户列表:排行图标 */
    .paihang-wrapper {
      position: absolute;
      left: -10px;
      top: -10px;
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
      }
      .title {
        display: block;
        position: absolute;
        left: 16px;
        top: 12px;
        font-size: 24px;
        color: #fff;
      }
    }
    .paihang-wrapper1 {
      left: -15px;
      top: -15px;
      .title1 {
        left: 20px;
        top: 4px;
      }
    }
    .compare-btn {
      float: right;
      padding: 0px;
      line-height: 32px;
    }
    .compare-month {
      float: right;
      width: 100px;
    }
  }
  /* 用户列表:外层 */
  .user-wrapper {
    overflow: unset;
    .user-panel {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      /* 用户列表:头像 */
      .avatar-wrapper {
        display: inline-block;
        width: 100px;
        flex: 0 0 100px;
        height: 150px;
        vertical-align: top;
        .avatar {
          width: 100%;
          height: 100%;
          background-size: contain;
        }
      }
      /* 用户列表:信息 */
      .info-warpper {
        display: inline-block;
        font-size: 14px;
        width: 100px;
        padding: 0 10px;
        text-align: center;
        .info-item {
          margin: 5px 0;
          width: 100%;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .score {
          font-size: 25px;
          margin: 15px 0;
        }
        .ringThan {
          margin-top: -15px;
          font-size: 16px;
          color: #999;

          .grow {
            color: #f56c6c;
          }
          .lower {
            color: #67c23a;
          }
        }
        .name,
        .areaName {
          color: #333;
          font-size: 18px;
          margin-bottom: 5px;
        }
        .areaName {
          font-size: 20px;
        }
        .el-select {
          display: block;
          float: right;
          width: 80px;
          padding: 3px 0;
        }
      }
    }
  }
  // 清除浮动
  .clearfix {
    display: block;
  }
}
</style>
	<style>
.user-item .el-card__header {
  padding: 5px 20px;
}
</style>