<template>
  <section class="home-wrapper">
    <bread-crumb></bread-crumb>
    <section style="height:100%;" class="home-content">
      <!--   条件筛选 -->
      <el-card v-if="!userCompareShow" class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px; margin-left: 5px;">
            <i class="el-icon-date"></i>筛选查询
          </span>
          <div style="" class="quartMonth">
            <label for="" class="quartMonthlabel">季度/月度</label>
            <div style="display:inline-block;width:120px;">
              <el-select v-model="form.quartMonth" placeholder="季度" align="center" aria-placeholder="">
                <el-option v-for="item in quartMonthList" style="padding-left:35px" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="filter-wrapper">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row :gutter="10">
              <!-- 类别:开始 -->
              <el-select class="type-select" width="100" v-model="form.type" placeholder="类别">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <!-- 类别:结束 -->
              <!-- 展示方式:开始 -->
              <el-select class="scale-select" width="100" v-model="form.scale" placeholder="展示方式">
                <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <!-- 展示方式:结束 -->
              <!-- 全部指标:开始 -->
              <el-cascader style="width:200px" class="quota-select" :options="cityQuota" :props='props' change-on-select v-model="form.quota" placeholder="全部指标">
              </el-cascader>
              <!-- 全部指标:结束 -->
              <!-- 分数:开始 -->
              <el-select class="filter-select" width="100" v-model="form.scoreFilter" placeholder="分数">
                <el-option v-for="item in scoreFilterOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <!-- 分数:结束 -->
              <!-- 其他:开始 -->
              <div class="filter-score" v-if="form.scoreFilter==='其他'">
                <el-select class="condition-select" v-model="form.scoreCondition" placeholder="条件">
                  <el-option label="大于" value="gt"></el-option>
                  <el-option label="小于" value="lt"></el-option>
                </el-select>
                <el-input v-model="form.scoreInput" :min="1" :max="100" type="number"></el-input>
                <el-button type="primary" @click="queryQuotaData()">确认</el-button>
              </div>
              <!-- 其他:结束 -->
            </el-row>
          </el-form>
        </div>
      </el-card>
      <!-- 图表 -->
      <!-- <div v-if="isOnlyIndex" class="onlyIndex-wrapper"> -->
      <el-card v-if="!userCompareShow" class="box-card">
        <div slot="header" class="clearfix">
          <!-- <span style="line-height: 36px; margin-left: 5px;"><i class="el-icon-date"></i>{{blockQuota}}整体完成情况—全国平均分柱状图</span> -->
          <span style="line-height: 36px; margin-left: 5px;">
            <i class="el-icon-date"></i>整体完成情况—全国平均分柱状图</span>
        </div>
        <div class="onlyIndex-wrapper" v-loading="initLoading" element-loading-text="数据加载中......">
          <div class="index-chart" id="indexChart"></div>
          <!-- <el-tabs v-model="activeName">
              <el-tab-pane label="月度" name="first">
                <div  class="index-chartA" id="indexChartA"></div>
              </el-tab-pane>
              <el-tab-pane label="完成情况" name="second">
                <div class="index-chartB" id="indexChartB"></div>
              </el-tab-pane>
            </el-tabs> -->
        </div>
      </el-card>
      <!-- 方阵 -->
      <el-card v-if="form.scale == 1 || form.scale == 2" class="box-card ">
        <div slot="header" class="clearfix">
          <span v-if="form.scale == 1" style="line-height: 36px; margin-left: 5px;">
            <i class="el-icon-date"></i>{{blockMouth}}{{blockQuota}}利润方阵</span>
          <span v-else style="line-height: 36px; margin-left: 5px;">
            <i class="el-icon-date"></i>{{blockMouth}}{{blockQuota}}面积方阵</span>
        </div>
        <div class="phalams-wrapper" v-loading="initLoading" element-loading-text="数据加载中......">
          <!-- <div class="phalams-chart" id="phalamsChart"></div> -->
          <div class="phalamsTable">
            <el-table class="dataTable" v-if="form.scale == 1" :data="profitData" :header-cell-style="headerCellStyle" :cell-style="cellStyle" border>
              <el-table-column prop="id" label="排名" width="70" align="center">
              </el-table-column>
              <el-table-column label="方阵一(3000万以上)" align="center">
                <!-- 区域名称:开始 -->
                <el-table-column prop="a" label="区域名称" align="center">
                  <template slot-scope="scope">
                    <div style="cursor: pointer;" @click="goAreaAll(scope.row['akey'])">{{scope.row['a']}}</div>
                  </template>
                </el-table-column>
                <!-- 区域名称:结束 -->
                <!-- 得分情况:开始 -->
                <el-table-column prop="adf" label="得分情况" align="center">
                  <template slot-scope="scope">
                    {{scope.row['adf'] === -1 ? '/' : scope.row['adf']}}
                  </template>
                </el-table-column>
                <!-- 得分情况:结束 -->
                <!-- 升降情况:开始 -->
                <el-table-column prop="aph" label="升降情况" align="center">
                </el-table-column>
              </el-table-column>
              <!-- 升降情况:结束 -->
              <el-table-column label="方阵二(1500-3000万)" align="center">
                <!-- 区域名称:开始 -->
                <el-table-column prop="b" label="区域名称" align="center">
                  <template slot-scope="scope">
                    <div style="cursor: pointer;" @click="goAreaAll(scope.row['bkey'])">
                      {{scope.row['b']}}</div>
                  </template>
                </el-table-column>
                <!-- 区域名称:结束 -->
                <!-- 得分情况:开始 -->
                <el-table-column prop="bdf" label="得分情况" align="center">
                  <template slot-scope="scope">
                    {{scope.row['bdf'] === -1 ? '/' : scope.row['bdf']}}
                  </template>
                </el-table-column>
                <!-- 得分情况:结束 -->
                <!-- 升降情况:开始 -->
                <el-table-column prop="bph" label="升降情况" align="center">
                </el-table-column>
                <!-- 升降情况:结束 -->
              </el-table-column>
              <el-table-column label="方阵三(1500万以下)" align="center">
                <!-- 区域名称:开始 -->
                <el-table-column prop="c" label="区域名称" align="center">
                  <template slot-scope="scope">
                    <div style="cursor: pointer;" @click="goAreaAll(scope.row['ckey'])">
                      {{scope.row['c']}}</div>
                  </template>
                </el-table-column>
                <!-- 区域名称:结束 -->
                <!-- 得分情况:开始 -->
                <el-table-column prop="cdf" label="得分情况" align="center">
                  <template slot-scope="scope">
                    {{scope.row['cdf'] === -1 ? '/' : scope.row['cdf']}}
                  </template>
                </el-table-column>
                <!-- 得分情况:结束 -->
                <!-- 升降情况:开始 -->
                <el-table-column prop="cph" label="升降情况" align="center">
                </el-table-column>
                <!-- 升降情况:结束 -->
              </el-table-column>
            </el-table>
            <el-table class="dataTable" v-else :data="squareData" border>
              <el-table-column prop="id" label="排名" width="70" align="center">
              </el-table-column>
              <el-table-column label="5000平方以下" align="center">
                <!-- 区域名称 -->
                <el-table-column prop="a" label="区域名称" align="center">
                </el-table-column>
                <!-- 得分情况 -->
                <el-table-column prop="adf" label="得分情况" align="center">
                  <template slot-scope="scope">
                    {{scope.row['adf'] === -1 ? '/' : scope.row['adf']}}
                  </template>
                </el-table-column>
                <!-- 升降情况 -->
                <el-table-column prop="aph" label="升降情况" align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column label="5000-20000平方" align="center">
                <!-- 区域名称 -->
                <el-table-column prop="b" label="区域名称" align="center">
                </el-table-column>
                <!-- 得分情况 -->
                <el-table-column prop="bdf" label="得分情况" align="center">
                  <template slot-scope="scope">
                    {{scope.row['bdf'] === -1 ? '/' : scope.row['bdf']}}
                  </template>
                </el-table-column>
                <!-- 升降情况 -->
                <el-table-column prop="bph" label="升降情况" align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column label="20000平方以上" align="center">
                <!-- 区域名称 -->
                <el-table-column prop="c" label="区域名称" align="center">
                </el-table-column>
                <!-- 得分情况 -->
                <el-table-column prop="cdf" label="得分情况" align="center">
                  <template slot-scope="scope">
                    {{scope.row['cdf'] === -1 ? '/' : scope.row['cdf']}}
                  </template>
                </el-table-column>
                <!-- 升降情况 -->
                <el-table-column prop="cph" label="升降情况" align="center">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>

      <!-- 用户列表 -->
      <el-card v-if="!userCompareShow && form.scale == 0" class="box-card ">
        <div slot="header" class="clearfix">
          <!-- <span style="line-height: 36px; margin-left: 5px;"><i class="el-icon-date"></i>{{blockMouth}}{{blockQuota}}区域完成情况—各区域列表</span> -->
          <span style="line-height: 36px; margin-left: 5px;">
            <i class="el-icon-date"></i>{{blockMouth}}{{regionCity}}完成情况—各{{regionCity}}列表</span>
        </div>
        <div class="user-wrapper" v-loading="initLoading" element-loading-text="数据加载中......">
          <el-select class="sorting" v-model="form.sort" placeholder="分数排序">
            <el-option v-for="item in scoreSortOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <user-item v-for="(userMsg,userKey) in userList" :key="userKey" :regionCity="regionCity" :userCompareList="userCompareList" :monthKey="userMsg.name" :month="selectMonth" :userKey="userKey" :userMsg="userMsg" :showRangking="true" @addCompares="compareSideShow=true;" :userType="userType" :quartMonth='form.quartMonth'></user-item>
        </div>
      </el-card>
      <!-- 侧边栏 -->
      <div v-if="!userCompareShow" class="compare-side" v-show="compareSideShow">
        <div class="compare-header">
          <i class="el-icon-arrow-right el-icon--right compare-back" @click.stop.prevent="compareSideShow=false;"></i>
          <h3 class="title">{{regionCity}}对比</h3>
        </div>
        <div class="compare-content">
          <div class="compare-item" v-for="(userCmp,index) in userCompareList" :key="userCmp.areaName">
            <h3 class="title">
              <span class="title-num">{{index+1}}.</span>{{userCmp.areaName}}</h3>
            <span class="el-icon-close item-close" @click.stop.prevent="clearCompare(index)"></span>
          </div>
        </div>
        <div class="compare-footer">
          <el-select class="compare-select" clearable value-key="areaName" v-model="userSelect" placeholder="请选择对比" @change="addToCompares">
            <el-option v-for="userMsg in userList" :key="userMsg.areaName" :label="userMsg.areaName" :value="userMsg"></el-option>
          </el-select>
          <!-- <el-button @click.stop.prevent="userCompareShow=true;compareSideShow=false" class="compare-btn fl" type="danger">开始对比</el-button> -->
          <el-button @click="goinCompare" class="compare-btn fl" type="danger">开始对比</el-button>
          <el-button class="compare-btn fr" icon="el-icon-delete" @click="clearAllCompares()">清空</el-button>
        </div>
      </div>
      <!-- 用户对比 -->
      <!-- <user-compare @ievent="userCompareShow = false" :userList="userList" :userCompareList="userCompareList" v-if="userCompareShow"></user-compare> -->
      <!-- 遮罩层 -->
      <div class="mask" @click.stop.prevent="compareSideShow=false;" v-show="compareSideShow"></div>
    </section>
    <!-- 发布按钮:开始 -->
    <!-- 发布按钮放在 quotaManage文件夹;因为个人觉得它跟指标管理那块联系更大,跟绩效分析联系不是很密切,后续可能会改动 -->
    <div class="publish-wrapper">
      <quota-publish :regionCity="regionCity"></quota-publish>
    </div>
    <!-- 发布按钮:结束 -->
  </section>
</template>
<script>
import Vue from 'vue'
import breadCrumb from '../../breadCrumb'
// 发布按钮放在 quotaManage文件夹;因为个人觉得它跟指标管理那块联系更大,跟绩效分析联系不是很密切,后续可能会改动
import quotaPublish from '../quotaManage/quota-publish'
// import { apiServer } from '@/config/index'
import { analysis } from '../common/muck.js'
import {
  getMonthScore,
  getMonthAverageScore,
  retrunPicURL,
  getElementByType
} from '@/api/performance'
import userItem from '@/components/performance/headquarterManager/user-item.vue'
import userCompare from '@/components/performance/headquarterManager/user-compare.vue'
export default {
  components: {
    userItem,
    userCompare,
    breadCrumb,
    quotaPublish
  },
  data() {
    return {
      props: {
        value: 'elementId',
        label: 'elementName'
      },
      //临时数据
      cacheData: '',
      regionCity: '区域',
      // 首页Loading
      initLoading: false,
      // 显示对比页面
      userCompareShow: false,
      // 显示侧边栏对比
      compareSideShow: false,
      // 是否显示单指标
      isOnlyIndex: false,
      // 是否显示方阵
      isPhalanx: false,
      // 用户对比:选中值
      userSelect: '',
      userType: 'compare',
      // 单指标选择卡
      activeName: 'first',
      // 选择展示月份
      selectMonth: 0,
      //全局映入echart
      _echarts: '',
      myChart: '',
      // 块，标题指标
      blockQuota: '',
      blockMouth: '',
      // 类型列表:下拉列表展示类数据
      typeOptions: [
        {
          value: '1',
          label: '区域'
        },
        {
          value: '2',
          label: '城市公司'
        }
      ],
      // 规模列表:下拉列表展示类数据
      quartMonthList: [
        {
          value: '月度',
          label: '月度'
        },
        {
          value: '季度',
          label: '季度'
        }
      ],
      showOptions: [
        {
          value: '0',
          label: '普通展示'
        },
        {
          value: '1',
          label: '利润方阵'
        }
        // {
        // 	value: "2",
        // 	label: "面积方阵"
        // }
      ],
      // 分数选择:下拉列表展示类数据
      scoreFilterOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '大于平均分',
          label: '大于平均分'
        },
        {
          value: '小于平均分',
          label: '小于平均分'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      // 用户方块排序方式:下拉列表展示类数据
      scoreSortOptions: [
        {
          value: '分数升序',
          label: '按本月度完成率升序'
        },
        {
          value: '分数降序',
          label: '按本月度完成率降序'
        },
        {
          value: '速度降序',
          label: '按本月度完成率上升最快'
        },
        {
          value: '速度升序',
          label: '按本月度完成率下降最多'
        }
      ],
      // 指标数据:下拉列表展示类数据
      cityQuota: [],
      cityOptions: [],
      quotaOptions: [],
      // form 表单对象
      form: {
        type: '1', // 类别
        scale: '0', // 展示方式
        quota: [1001], // 指标
        scoreFilter: '', // 分数筛选条件
        scoreCondition: '', // 分数:下拉条件值
        scoreInput: '', // 分数:输入框
        isAdd: false, // 计算加减分项
        sort: '分数降序', // 排序方式
        quartMonth: '月度' //季度/月度
      },
      // 用户列表
      userList: [],
      // 指标元数据
      quotaCache: {},
      // 用户对比列表
      userCompareList: [],
      // 利润方阵数据
      profitData: [],
      // 面积方阵数据
      squareData: []
    }
  },
  activated() {
    this.userCompareList = []
    this.form.quartMonth = '月度' //路由二次切回页面
    this._echarts = require('echarts')
    // this.queryQuotaData()
    this.getAverageScore(this.form.quota)
  },
  created() {
    this.getElementByType('1')
  },
  watch: {
    'form.quartMonth': function(quartMonth, oldVal) {
      if (quartMonth == '月度') {
        this.$router.replace('/Monthlyanalysis')
      } else {
        this.$router.replace('/PerformanceAnalysis')
      }
    },
    //区域城市公司
    'form.type': function(newVal, oldVal) {
      this.userCompareList = []
      if (newVal == 1) {
        this.regionCity = '区域'
        this.showOptions = [
          { value: '0', label: '普通展示' },
          { value: '1', label: '利润方阵' }
        ]
        this.getElementByType('1')
        this.form.quota = [1001]
      } else {
        //城市公司=
        this.regionCity = '城市公司'
        this.showOptions = [{ value: '0', label: '普通展示' }]
        this.form.scale = '0'
        this.getElementByType('2')
        this.form.quota = [1016]
      }
      this.$nextTick(() => {
        // this.queryQuotaData()
        this.getAverageScore(this.form.quota)
      })
    },
    // 指标更新
    'form.quota': function(val, oldVal) {
      // console.log(val)
      // dom元素更新后执行， 因此此处能正确打印出更改之后的值；
      this.$nextTick(() => {
        // this.queryQuotaData()
        this.getAverageScore(this.form.quota)
      })
    },
    // 分数筛选条件更新
    'form.scoreFilter': function(val, oldVal) {
      // dom元素更新后执行， 因此此处能正确打印出更改之后的值；
      this.$nextTick(() => {
        this.queryQuotaData()
      })
    },
    // 排序方式更新
    'form.sort': function(val, oldVal) {
      // dom元素更新后执行， 因此此处能正确打印出更改之后的值；
      this.$nextTick(() => {
        if (val !== '其他') {
          this.queryQuotaData()
        }
      })
    },
    // "form.score"
    // 对比页面
    userCompareShow: function(val, oldVal) {
      this.$nextTick(() => {
        if (!val) {
          // console.log('watch Data:userCompareShow');
          this.queryQuotaData()
        }
      })
    }
  },
  mounted(options) {
    // console.log(123)
    // this._echarts = require('echarts')
    // this.queryQuotaData()
  },
  methods: {
    // 跳转到对比页面
    goinCompare() {
      let _this = this
      // _this.userCompareShow=true;
      _this.compareSideShow = false
      window.sessionStorage['userList'] = ''
      window.sessionStorage['userCompareList'] = ''
      window.sessionStorage['userList'] = JSON.stringify(_this.userList)
      window.sessionStorage['userCompareList'] = JSON.stringify(
        _this.userCompareList
      )
      let suiji = parseInt(Math.random() * 10000)
      _this.$router.push({
        path: '/performanceComparemonth',
        query: {
          region: this.regionCity,
          data: suiji,
          month: this.selectMonth
        }
      })
    },
    // 页面数据初始化主入口
    initPage(dataList) {
      var _this = this
      this.initLoading = false
      let Lists = []
      // Lists.push(this.deepCopy(dataList))
      // if (dataList.length === 0) return false
      // console.log(dataList);
      // for (let i = 0; dataList[i]; i++) {
      //   Lists.push(this.deepCopy(dataList[i]))
      // } // 深度拷贝一个新的数组对象
      // Lists.push(this.deepCopy(dataList))
      // if (!_this.blockMouth) {
      //   let _dateData = [
      //     '一月',
      //     '二月',
      //     '三月',
      //     '四月',
      //     '五月',
      //     '六月',
      //     '七月',
      //     '八月',
      //     '九月',
      //     '十月',
      //     '十一月',
      //     '十二月'
      //   ]
      //   _this.blockMouth = _dateData[dataList[0].month - 1]
      // }
      // this.onlyIndex(dataList) //柱状图
      Lists = this.FilterHander(dataList) //数据筛选
      Lists = this.SrotScoreHandler(Lists) //数据排序
      this.getUserData(Lists)
      this.getProfitData(Lists, 'profit')
    },
    // 判断缓存是否存在数据，否则请求数据
    async queryQuotaData() {
      let dataList = []
      let _this = this
      let quota = _this.form.quota[0] == '10' ? ['0'] : _this.form.quota
      let cacheKey = quota.join(';')
      quota = quota[quota.length - 1]
      // console.log(quota, cacheKey)
      _this.initLoading = true
      // if (_this.quotaCache[cacheKey]) {
      //   _this.blockQuota = _this.quotaCache[cacheKey].label
      //   dataList = _this.quotaCache[cacheKey]
      //   _this.initPage(dataList)
      // } else {
        // 数据请求
        await getMonthScore(
          quota,
          {
            month: this.selectMonth,
            typeNo: this.regionCity=='区域'?'1':'2'
          },
          response => {
            // // console.log(response);
            // _this.quotaCache[cacheKey] = response
            // _this.blockQuota = _this.quotaCache[cacheKey].label
            // console.log(_this.blockQuota)
            // dataList = _this.quotaCache[cacheKey]
            // // console.log('接口请求获取数据');
            // // console.log(JSON.stringify(dataList));
            // _this.initPage(dataList)
            // // return _this.quotaCache[quota];
            _this.quotaCache[cacheKey] = response
            _this.cacheData = response
            _this.blockQuota = _this.quotaCache[cacheKey].label
            dataList = _this.quotaCache[cacheKey]
            _this.initPage(dataList)
          },
          (error, code) => {
            this.$message({
              type: 'error',
              message: '接口请求失败'
            })
            console.warn(error)
            _this.initLoading = false
          },
          (exception, code) => {
            ////////////////////////////////////////////test///////////////////////////////////////////////////
            // _this.quotaCache[cacheKey] = analysis.data
            // _this.cacheData = analysis.data
            // _this.blockQuota = _this.quotaCache[cacheKey].label
            // dataList = _this.quotaCache[cacheKey]
            // _this.initPage(dataList)
            /////////////////////////////////////////////test/////////////////////////////////////////////////

            console.error(exception)
            this.$message({
              type: 'error',
              message: exception.message
            })
            _this.initLoading = false
          }
        )
      // }
    },
    // 返回用户列表数据
    getUserData(obj) {
      var _this = this
      let dataList = obj
      let _month = 0;
      for (let i = 0; i < dataList.length; i++) {
        dataList[i].pic = retrunPicURL(
          JSON.stringify(dataList[i].imageUrl) == '{}' ||
          JSON.stringify(dataList[i].imageUrl) == 'null'
            ? ''
            : dataList[i].imageUrl
        )
        dataList[i].completeRate =
          dataList[i].completeInfo[_month].completeRate
        dataList[i].areaName = dataList[i].hierarchyName
        dataList[i].areaId =
          dataList[i].completeInfo[_month].hierarchyId
        dataList[i].selectMonth = _month //当前选择的月份
        dataList[i].ringThan =
          dataList[i].completeInfo[_month].ranges
      }
      this.userList = dataList
    },
    //根据属性从大到小或者从小到大排列,flag=1,表示从大到小，flag=0,表示从小到大
    compare(property, flag) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (flag == 0) {
          return value1 - value2 //flag=0,表示从小到大
        } else {
          return value2 - value1 //flag=1,表示从大到小
        }
      }
    },

    // 返回利润方阵数据
    getProfitData(dataList, type) {
      let _this = this
      let _ph = '',
        _df = '',
        _pj = '',
        _key = '',
        _name = ''
      let dataA = [],
        dataB = [],
        dataC = [],
        tabelData = []
      let OrgJson = {},
        SiList = {},
        tabelItem = {}
      let month = 0
      for (let i = 0; dataList[i]; i++) {
        OrgJson = dataList[i]
        SiList = dataList[i].completeInfo
        _name = OrgJson.hierarchyName
        _key = OrgJson.hierarchyId
        //区域分数
        SiList[month]
          ? SiList[month]
          : {
              actualScore: null,
              actualAverageScore: null,
              score: null,
              averageScore: null,
              scope: null
            }
        if (_this.form.quota[0] == '0') {
          _df = SiList[month].actualScore || 0
          _pj = SiList[month].actualAverageScore || 0
        } else {
          _df = SiList[month].score || 0
          _pj = SiList[month].averageScore || 0
        }
        _ph = 0
        // (SiList.length > 1 && month+1 < SiList.length)
        //   ? SiList[month].num - SiList[month+1].num
        //   : 0;
        let _itemData = {
          name: _name,
          key: _key,
          df: isNaN(_df) ? 0 : _df,
          pj: isNaN(_pj) ? 0 : _pj,
          ph: isNaN(_ph) ? 0 : _ph
        }
        if (type == 'profit') {
          if (SiList[month].scope < 1500) {
            dataC.push(_itemData)
          } else if (
            SiList[month].scope >= 1500 &&
            SiList[month].scope <= 3000
          ) {
            dataB.push(_itemData)
          } else if (SiList[month].scope > 3000) {
            dataA.push(_itemData)
          }
        } else {
          if (OrgJson.square < 5000) {
            dataA.push(_itemData)
          } else if (OrgJson.square >= 5000 && OrgJson.square <= 20000) {
            dataB.push(_itemData)
          } else if (OrgJson.square > 20000) {
            dataC.push(_itemData)
          }
        }
      }
      function writingData(data, name, key, df, pj, ph) {
        for (let i = 0; i < data.length; i++) {
          if (!tabelData[i]) {
            tabelItem = new Object()
            tabelItem.id = i + 1
            tabelData.push(tabelItem)
            // tabelData[i].id = i + 1;
          }
          tabelData[i][name] = data[i].name
          tabelData[i][key] = data[i].key
          tabelData[i][df] = data[i].df
          tabelData[i][pj] = data[i].pj
          tabelData[i][ph] = data[i].ph
        }
      }
      writingData(dataA, 'a', 'akey', 'adf', 'apj', 'aph')
      writingData(dataB, 'b', 'bkey', 'bdf', 'bpj', 'bph')
      writingData(dataC, 'c', 'ckey', 'cdf', 'cpj', 'cph')
      if (type == 'profit') {
        _this.profitData = tabelData
      } else {
        _this.squareData = tabelData
      }
    },
    // 筛选总入口
    FilterHander(FsList, val) {
      let _this = this
      let FsJson = []
      let _month = 0;
      let FsType = this.form.scoreFilter
      if (FsType.indexOf('大于') != -1) {
        FsJson = FsList.filter(function(cur, index, arr) {
          return (
            cur.completeInfo[_month].completeRate >
            _this.cacheData[_month].averageRate
          )
        })
      } else if (FsType.indexOf('小于') != -1) {
        FsJson = FsList.filter(function(cur, index, arr) {
          return (
            cur.completeInfo[_month].completeRate <
            _this.cacheData[_month].averageRate
          )
        })
      } else if (
        FsType.indexOf('其他') > -1 &&
        _this.form.scoreCondition &&
        _this.form.scoreInput
      ) {
        if (_this.form.scoreCondition == 'gt') {
          FsJson = FsList.filter(function(cur, index, arr) {
            return (
              cur.completeInfo[_month].completeRate * 100 >
              _this.form.scoreInput
            )
          })
        } else if (_this.form.scoreCondition == 'lt') {
          FsJson = FsList.filter(function(cur, index, arr) {
            return (
              cur.completeInfo[_month].completeRate * 100 <
              _this.form.scoreInput
            )
          })
        }
      } else {
        FsJson = FsList
        return FsJson
      }
      return FsJson
      // }
    },
    // 筛选：获取条件类型
    Filter_ScoreType(FsType) {
      // _Fkey = gt:高于 | lt:低于 ;
      let _this = this
      // 获取删选条件与过滤的值
      let FsJson = {},
        InputData = 0
      switch (FsType) {
        case '低于保底':
          FsJson.key = 'atLeastTarget'
          FsJson.selector = 'lt'
          break
        case '高于嚎叫':
          FsJson.key = 'howlTarget'
          FsJson.selector = 'gt'
          break
        case '小于平均分':
          FsJson.key =
            _this.form.quota[0] == '0' ? 'actualAverageScore' : 'averageScore'
          FsJson.selector = 'lt'
          break
        case '大于平均分':
          FsJson.key =
            _this.form.quota[0] == '0' ? 'actualAverageScore' : 'averageScore'
          FsJson.selector = 'gt'
          break
        case '其他':
          FsJson.selector = this.form.scoreCondition
          InputData = parseInt(this.form.scoreInput)
          InputData = isNaN(InputData) ? 0 : InputData
          FsJson.data = InputData
          if (!FsJson.selector || !InputData) return false
          break
        case '全部':
        default:
          FsJson.key = ''
          FsJson.selector = ''
          break
      }
      if (FsJson.key || FsJson.selector) return FsJson
      return false
    },
    // 筛选：数据处理
    Filter_ScoreData(FsJson) {
      // 删选数据
      let FsList = FsJson.List,
        Fskey = FsJson.key,
        FsData = FsJson.data,
        FsSelector = FsJson.selector,
        FsScore = '',
        FsScoreKey = 'score',
        SiList = []
      let q = 0,
        i = FsList.length
      // console.log('i:'+ i);
      if (Fskey === 'atLeastTarget' || Fskey === 'howlTarget') {
        FsScoreKey = 'complete'
      } else if (this.form.quota[0] == '0') {
        FsScoreKey = 'actualScore'
      }
      while (i--) {
        SiList = FsList[i].scoreInfo || []
        q = SiList.length
        while (q--) {
          FsData = FsData || SiList[q][Fskey]
          if (!FsData) {
            SiList.splice(q, 1)
          } else {
            FsScore = SiList[q][FsScoreKey] //分数
            FsSelector === 'lt'
              ? FsScore < FsData ? '' : SiList.splice(q, 1)
              : FsScore > FsData ? '' : SiList.splice(q, 1)
          }
        }
        if (SiList.length === 0) FsList.splice(i, 1)
      }
      return FsList
    },
    filter(data) {
      //过滤完成率
      if (
        data == null ||
        data == 'null' ||
        data == undefined ||
        data == 'undefined' ||
        data == '-1' ||
        data == -1 ||
        data == '0'
      ) {
        return 0
      }
      return data
    },
    // 返回排序后的数组
    SrotScoreHandler(SrList) {
      let _this = this
      let property = ''
      let flag = ''
      let speed = ''
      let _month = 0;
      property = this.form.sort.indexOf('分数') > -1 ? 'completeRate' : 'speed'
      flag = this.form.sort.indexOf('升序') > -1 ? '0' : '1'
      if (property.indexOf('speed') != -1) {
        for (let i = 0; i < SrList.length; i++) {
          try {
            if (SrList[i].completeInfo[_month + 1] != undefined) {
              SrList[i].speed =
                _this.filter(
                  SrList[i].completeInfo[_month].completeRate
                ) -
                _this.filter(
                  SrList[i].completeInfo[_month + 1].completeRate
                )
            } else {
              SrList[i].speed = 0
            }
          } catch (e) {
            SrList[i].speed = 0
          }
        }
        speed = true
      }
      return SrList.sort(this.compare(property, flag, speed))
    },
    //从小到大  flag=0,  从大到小  flag=1
    compare(property, flag, speed) {
      let _this = this
      let _month = 0;
      return function(a, b) {
        if (speed) {
          var value1 = _this.filter(a[property])
          var value2 = _this.filter(b[property])
        } else {
          var value1 = _this.filter(a.completeInfo[_month][property])
          var value2 = _this.filter(b.completeInfo[_month][property])
        }
        if (flag == 0) {
          return value1 - value2
        } else {
          return value2 - value1
        }
      }
    },
    // 增加同比数据
    Srot_AddSpeedData(SrList) {
      let SiList = [],
        SrSpeed
      // 数组增加速度情况
      for (let i = 0; SrList[i]; i++) {
        SiList = SrList[i].scoreInfo
        for (let q = 0; SiList[q]; q++) {
          SrSpeed =
            q + 1 < SiList.length ? SiList[q].score - SiList[q + 1].score : 0
          // console.log('SrSpeed:'+SrSpeed);
          SiList[q]['speed'] = SrSpeed
        }
      }
      return SrList
    },
    // 添加对比
    addToCompares(data) {
      let len = this.userCompareList.length
      let _thisMonth = this.selectMonth
      if (data && len <= 2) {
        data = this.deepCopy(data)
        this.userCompareList.push(data)
      } else if (len > 2) {
        this.$message('最多可选择3条')
      }
    },
    // 清除对比
    clearCompare(index) {
      this.userCompareList.splice(index, 1)
    },
    // 清空对比
    clearAllCompares() {
      this.userCompareList = []
    },
    // 单指标图表
    onlyIndex(dataList) {
      let _this = this
      _this.myChart = ''
      _this.myChart = _this._echarts.init(document.getElementById('indexChart'))
      _this.myChart.off('click')
      let _dateData = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
      let _data = ['', '', '', '', '', '', '', '', '', '', '', '']
      //后台返回小数
      for (let i = 0; i < dataList.length; i++) {
        _data[dataList[i].month - 1] = (dataList[i].averageRate * 100).toFixed(2)
      }
      _this.myChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '完成率{c0}%'
        },
        grid: {
          top: '8%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     start: 0,
        //     end: 100,
        //   }
        // ],
        xAxis: [
          {
            type: 'category',
            data: _dateData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: { formatter: '{value}%' }
          }
        ],
        series: [
          {
            name: '完成率',
            type: 'bar',
            // barWidth: '60%',
            barWidth: '30%',
            data: _data,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
        ]
      })
      _this.myChart.on('click', function(params) {
        // console.log(params)
        _this.blockMouth = params.name
        // let dataIndex = _data.length - params.dataIndex - 1
        // _this.selectMonth = dataIndex
        let dataIndex = params.dataIndex + 1
        for (let i = 0; i < dataList.length; i++) {
          // console.log(dataList[0].scoreInfo)
          if (dataIndex == dataList[i].month) {
            _this.selectMonth = i + 1
          }
        }
        // _this.myChart.off('click')
        _this.queryQuotaData()
        return false
      })
    },
    // 方阵表头样式
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'a' ||
        column.property === 'adf' ||
        column.property === 'aph' ||
        column.label === '方阵一(3000万以上)'
      ) {
        return 'background: #e3e3e3;'
      } else if (
        column.property === 'b' ||
        column.property === 'bdf' ||
        column.property === 'bph' ||
        column.label === '方阵二(1500-3000万)'
      ) {
        return 'background: #efefef;'
      } else if (
        column.property === 'c' ||
        column.property === 'cdf' ||
        column.property === 'cph' ||
        column.label === '方阵三(1500万以下)'
      ) {
        return 'background: #fcfcfc;'
      } else {
        return ''
      }
    },
    // 方阵低于平均值背景色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log({
      //   row,
      //   column,
      //   rowIndex,
      //   columnIndex
      // })
      if (
        (row.adf < row.apj &&
          (column.property === 'a' ||
            column.property === 'adf' ||
            column.property === 'aph')) ||
        (row.bdf < row.bpj &&
          (column.property === 'b' ||
            column.property === 'bdf' ||
            column.property === 'bph')) ||
        (row.cdf < row.cpj &&
          (column.property === 'c' ||
            column.property === 'cdf' ||
            column.property === 'cph'))
      ) {
        return 'background: #F56C6C; color: #fefefe'
      }
    },
    // 点击跳转区域总页面
    goAreaAll(res) {
      // console.log(res)
      if (res === undefined || res === null || res === '') {
        return
      }
      let data = {
        areaId: res
      }
      let path = ''
      if (this.regionCity == '城市公司') {
        path = '/areaManagerCity'
      } else {
        path = '/areaManager'
      }
      this.$router.push({
        path: path,
        query: {
          areaId: data.areaId,
          month: this.selectMonth,
          region: this.regionCity
        }
      })
    },
    // 方法：深度copy对象
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
    },
    //获取动态指标
    async getElementByType(type) {
      await getElementByType(
        {
          typeNo: type
        },
        response => {
          this.cityQuota = this.updateCityQuota(response)
        },
        (error, code) => {
          this.$message({
            type: 'error',
            message: error
          })
        },
        (exception, code) => {
          this.$message({
            type: 'error',
            message: exception.message
          })
        }
      )
    },
    updateCityQuota(arr) {
      let arg = JSON.parse(JSON.stringify(arr))
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].elementId.toString().length > 4) {
          //对于超过4位进行插入children
          for (let x = 0; x < arg.length; x++) {
            //找到指定的elementId进行删除
            if (arr[i].elementId == arg[x].elementId) {
              let val = arg.splice(x, 1)[0] //删除超过四位的value值,并且暂存,
              let value = val.elementId.toString()
              let label = val.elementName

              if (value.length <= 7) {
                for (let z = 0; z < arg.length; z++) {
                  if (value.substring(0, 4) == arg[z].elementId) {
                    arg[z]['children'] = arg[z]['children']
                      ? arg[z]['children']
                      : []
                    arg[z]['children'].push({
                      elementId: value,
                      elementName: label
                    })
                    break
                  }
                }
              } else if (value.length > 7) {
                for (let d = 0; d < arg.length; d++) {
                  if (arg[d].children) {
                    for (let e = 0; e < arg[d].children.length; e++) {
                      if (
                        value.substring(0, 7) == arg[d].children[e].elementId
                      ) {
                        arg[d].children[e]['children'] = arg[d].children[e][
                          'children'
                        ]
                          ? arg[d].children[e]['children']
                          : []
                        arg[d].children[e]['children'].push({
                          elementId: value,
                          elementName: label
                        })
                        break
                      }
                    }
                  }
                }
              }
              break
            }
          }
        }
      }
      arg= arg.filter(item =>item.elementId != 999 &&item.elementId!= 1&&item.elementId!= 0)
      return arg
    },
    // 获取平均分
    async getAverageScore(quota){
       let _this=this
       quota = quota==10?0: quota
       await getMonthAverageScore(
          quota,
          {
            typeNo: this.regionCity=='区域'?'1':'2'
          },
          response => {
            this.onlyIndex(response)//柱状图平均分
            this.blockMouth =_this.blockMouth ?_this.blockMouth : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][
            response[response.length-1].month-1
          ]//季度label
            this.selectMonth=this.selectMonth?this.selectMonth:parseInt(response[response.length-1].month) //季度值
            this.queryQuotaData()//获取区域列表
          },
          (error, code) => {
            this.$message({
              type: 'error',
              message: '接口请求失败'
            })
            console.warn(error)
            _this.initLoading = false
          },
          (exception, code) => {
            console.error(exception)
            this.$message({
              type: 'error',
              message: exception.message
            })
            _this.initLoading = false
          }
       )
    }
  }
}
</script>

<style lang="less" scoped>
.home-wrapper {
  position: relative;
  .box-card {
    margin: 15px;
  }
  .quartMonth {
    float: right;
  }
  .quartMonth .el-input__inner {
    padding-left: 35px;
  }
  .quartMonthlabel {
    width: 100px;
    text-align: center;
    display: inline-block;
  }
  .tableHeader {
    background: #999;
  }
  .home-content {
    .text {
      font-size: 14px;
    }
    .item {
      margin-bottom: 18px;
    }
    // .filter-wrapper,
    // .user-wrapper,
    // .onlyIndex-wrapper,
    // .phalams-wrapper {
    //   padding: 20px;
    //   margin: 10px 0;
    //   border: 1px solid #ededed;
    //   border-radius: 5px;
    //   background: #fafafa;
    // }
    .user-wrapper {
      padding-top: 70px;
    }
    .sorting {
      float: left;
      margin-top: -55px;
    }
    /* 条件筛选 */
    .filter-wrapper {
      .type-select,
      .scale-select,
      .quota-select,
      .filter-select {
        // min-width: 50px;
        // max-width: 100px;
        width: 120px;
      }
      /* 改写 饿了么样式 */
      // .el-form-item__label,
      // .el-form-item__content,
      // .el-radio {
      //   line-height: 40px;
      // }
      // .el-radio {
      //   margin: 0 10px 0 0;
      // }
      /* 改写分数 的饿了么 样式 */
      .filter-score {
        display: inline-block;
        position: relative;
        height: 41px;
        line-height: 40px;
        cursor: pointer; // border-radius: 4px;
        // border: 1px solid #dcdfe6;
        outline: 0;
        white-space: nowrap;
        .el-select,
        .el-input,
        .el-button,
        .el-select input,
        .el-input input {
          display: inline-block;
          width: 80px;
          border-radius: 0;
          border: 0;
        }
        .el-select input {
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
          border-right: 1px solid #dcdfe6;
        }
        .el-button {
          /*padding: 13px 20px;*/
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
        }
      }
    }
    /* 对比:侧边栏 */
    .compare-side {
      position: fixed;
      right: 0;
      top: 0;
      width: 280px;
      height: 100%;
      z-index: 1001;
      background: #fff;
      box-shadow: 0 0 10px #000;
      border-top: 3px solid #adadad;
      /* 侧边栏:头部 */
      .compare-header {
        border-bottom: 1px solid #efefef;
        .compare-back {
          display: inline-block;
          height: 30px;
          width: 30px;
          padding: 0 10px;
          margin: 10px 0;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
          border-right: 1px solid #efefef;
        }
        .title {
          display: inline-block;
          padding: 0 10px;
          margin: 10px 0;
          line-height: 30px;
        }
      }
      /* 侧边栏:中间内容 */
      .compare-content .compare-item {
        position: relative;
        .title {
          display: inline-block;
          height: 30px;
          margin: 15px 40px 15px 10px;
          line-height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .title-num {
          margin: 0 10px;
        }
        .item-close {
          position: absolute;
          display: block;
          right: 0;
          top: 15px;
          height: 30px;
          width: 30px;
          line-height: 30px;
          text-align: center;
          background: #fff;
          cursor: pointer;
        }
      }
      /* 侧边栏:底部 */
      .compare-footer {
        padding: 0 20px;
        margin: 10px 0;
        .compare-btn {
          margin: 10px 5px;
        }
        .compare-select {
          box-sizing: border-box;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -o-box-sizing: border-box;
          -ms-box-sizing: border-box;
          width: 100%;
          margin: 10px 5px;
        }
      }
    }
    /* 单指标外围 */
    .onlyIndex-wrapper {
      text-align: center;
      /* 图表:A */
      .chartTitle {
        margin: 0 0 10px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .index-chart {
        width: 100%;
        height: 200px; // margin-bottom: 20px;
      }
      .index-chartA {
        width: 100%;
        height: 400px;
        margin-bottom: 20px;
      }
      /* 图表:B */
      .index-chartB {
        display: inline-block;
        width: 400px;
        height: 400px;
        text-align: center;
        margin-bottom: 20px;
      }
    }
    /* 方阵 */
    .phalams-wrapper {
      .phalams-chart {
        width: 100%;
        height: 400px;
        text-align: center;
      }
    }
    /* 遮罩层 */
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    .el-table th > .cell {
      text-align: center;
    }
  }
  .publish-wrapper {
    position: fixed;
    right: 50px;
    bottom: 50px;
    z-index: 1000;
  }
}
</style>
<style>
.quartMonth .el-input--suffix .el-input__inner {
  text-align: center;
}
</style>
