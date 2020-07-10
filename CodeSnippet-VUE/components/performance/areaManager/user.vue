<template>
  <div class="user">
    <el-card class="box-card">
      <div class="container">
        <div class="avatar">
          <img :src="userInfo.pic" onerror="this.src='./static/img/avator.jpg'">
        </div>
        <div class="info">
          <div v-if="userInfo.flag">
            <!-- 月度分数数据 -->
            <p class="info_score" v-if="userInfo.score">{{userInfo.score|percent}}</p>
          </div>
          <div v-else>
            <p class="info_score" v-if="userInfo.score==0||userInfo.score">{{parseInt(userInfo.score*100)/100}}</p>
          </div>
          <p class="ringThan" v-if="userInfo.ringThan == 0 ">
            <i class="el-icon-minus"></i>
          </p>
          <p class="ringThan" v-else-if="userInfo.ringThan < 0 ">
            <i class="el-icon-caret-bottom lower"></i>&nbsp;{{userInfo.ringThan}}</p>
          <p class="ringThan" v-else>
            <i class="el-icon-caret-top grow"></i>&nbsp;{{userInfo.ringThan}}</p>
          <p v-if="userInfo.name">{{userInfo.name}}</p>
          <p v-if="userInfo.areaName">{{userInfo.areaName}}</p>
        </div>
      </div>
    </el-card>
    <div v-if="userInfo.our" class="pop">
      <div class="list">
        <p v-for="item in userInfo.our" :key="item.time" class="lists">
          <span>{{item.time}}</span>
          <span>{{item.event}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myUser',
  props: ['userInfo'],
  data() {
    return {}
  },
  filters: {
    percent(value) {
      if (parseFloat(value)>0&&value!=null) {
          return  value*100+'%'
      } else {
        return '/'
      }
    },
  },
  mounted() {
    // console.log(this.userInfo)
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.user {
  // padding: 10px;
  width: 260px;
  height: auto;
  // background: #fff;
  // border-radius: 5px;
  // border: 1px solid #ccc;
  // cursor: pointer;

  .container {
    display: flex;
    justify-content: space-between;

    .avatar {
      overflow: hidden;
      width: 100px;
      height: 140px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .info {
      margin: auto;
      width: 100px;

      p {
        margin: 5px 0;
        font-size: 18px;
        text-align: center;
      }
      .info_score {
        font-size: 30px;
      }
      .ringThan {
        font-size: 16px;
        color: #999;

        .grow {
          color: #f56c6c;
        }
        .lower {
          color: #67c23a;
        }
      }
    }
  }
  .pop {
    padding: 10px 0 0;

    .lists {
      position: relative;
      margin: 5px 0;
      padding-left: 18px;
    }
    .lists::after {
      position: absolute;
      left: 8px;
      content: ' ';
      width: 3px;
      height: 100%;
      background: #ccc;
    }
  }
}
</style>