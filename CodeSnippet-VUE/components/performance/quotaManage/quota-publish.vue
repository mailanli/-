<template>
  <div v-if="isGetStatus" class="publish-panel" :class="{active: !isPublish}" @click="saveHandle">
    <i class="publish-icon el-icon-edit-outline"></i>
    <p class="publish-txt" v-if="isPublish">已发布</p>
    <p class="publish-txt" v-else>发布</p>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getPublicStatus, savePublicStatus } from '@/api/performance'
export default {
  data() {
    return {
      isPublish: true, //是否已发布; true 已发布|false 未发布
      isGetStatus: false,
      quartMonth: String,//季度、月度
    }
  },
  props: {
    regionCity: String,
  },
  watch: {
    // $route:'updateStatus',
    regionCity: function() {
        let data={
          typeNo: this.regionCity=='区域'?'1':'2'
        }
      this.queryPublicStatus(data)
    }
  },
  activated() {
    this.updateStatus();
  },
  methods: {
    //切换路由更新组件
    updateStatus(){
      if(this.$route.path=='/Monthlyanalysis'){
        this.quartMonth='月度'
        this.queryPublicStatus({})
      }else{
        this.quartMonth='季度'
        let data={
          typeNo: this.regionCity=='区域'?'1':'2'
        }
        this.queryPublicStatus(data)
      }
    },
    // 判断缓存是否存在数据，否则请求数据
    async queryPublicStatus(data) {
      // 数据请求
      await getPublicStatus(
        this.quartMonth,
        this.regionCity,
        data,
        response => {
          this.isGetStatus = true
          this.isPublish = !!response['status']
        },
        (error, code) => {
          this.$message({
            type: 'error',
            message: '接口请求失败'
          })
          console.warn(error)
        },
        (exception, code) => {
          this.$message({
            type: 'error',
            message: exception.message
          })
        }
      )
    },
    async savePublicStatus() {
      await savePublicStatus(
        this.quartMonth,
        this.regionCity,
        {
          typeNo:this.regionCity=='区域'?'1':'2'
        },
        response => {
          this.showNotify(response)
        },
        (error, code) => {
          this.$message({
            type: 'error',
            message: '接口请求失败'
          })
          console.warn(error)
        },
        (exception, code) => {
          this.$message({
            type: 'error',
            message: exception.message
          })
        }
      )
    },
    saveHandle() {
      if (this.isGetStatus && !this.isPublish) {
        this.savePublicStatus()
      } else return false
    },
    showNotify(dataJson) {
      let msg = ''
      let dataList = dataJson['rows'] || []
      let dataTotal = dataJson['total'] || 0
      if (dataTotal === -1 || dataTotal === '-1') {
        this.$message({ message: '发布成功', type: 'success' })
        this.isPublish = true
        return
      }

      if (dataList.length === 0) {
        return false
      } else {
        for (let i = 0, data; (data = dataList[i]); i++) {
          msg += ' [' + data + '] '
        }
        msg += `等 ${dataTotal}个指标未锁定`
        this.$notify.error({ title: '发布失败', message: msg, duration: 0 })
      }
    }
  },
  components: {}
}
</script>

<style lang='less' scoped>
.publish-panel {
  width: 40px;
  height: 40px;
  padding: 15px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  background: #adadad;
  box-shadow: 0 0 10px #999;
  cursor: not-allowed;
  &.active {
    cursor: pointer;
    background: #f00;
    animation: bounce 0.8s;
    animation-iteration-count: 3;
    &:hover {
      box-shadow: 0 0 15px #333;
    }
    &:active {
      color: #ffa396;
    }
  }
  .publish-icon {
    font-size: 16px;
    font-weight: 700;
  }
  .publish-txt {
    font-size: 12px;
  }
}
</style>

<style scoped>
@-webkit-keyframes bounce {
  from,
  20%,
  53%,
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -30px, 0);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -15px, 0);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
}
</style>

