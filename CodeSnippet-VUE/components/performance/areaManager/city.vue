<template>
  <div>
    <bread-crumb></bread-crumb>
    <section class="area">
      <div class="right">
        <!-- 筛选查询 -->
        <el-card>
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; margin-left: 5px;">
              <i class="el-icon-date"></i>筛选查询
            </span>
            <div style="" class="quartMonth">
              <label for="" class="quartMonthlabel">季度/月度</label>
              <div style="display:inline-block;width:120px;">
                <el-select v-model="quartMonth" placeholder="季度" align="center" aria-placeholder="">
                  <el-option v-for="item in quartMonthList" style="padding-left:35px" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <el-button v-if="isShowGoBack" style="float: right;margin-left: 20px;verical-align:middle;margin-top:3px" size="small" type="primary" @click="handleGoBack">返回</el-button>
            </div>
          </div>
          <!-- Joey 新增 2018/08/14 :开始 -->
          <div v-if="areaList.length>1">
            <label for="" style="width:100px;text-align:center;display:inline-block;">{{regionCity}}切换</label>
            <div style="display:inline-block;">
              <el-select v-model="key" placeholder="请选择" @change="getParams">
                <el-option v-for="item in areaList" :key="item.hierachyId" :label="item.hierachyName" :value="item.hierachyId">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- Joey 新增 2018/08/14 :结束 -->
        </el-card>

        <el-card class="box-card" style="margin-top:15px">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; margin-left: 5px;">
              <i class="el-icon-date"></i>{{regionCity}}总信息
            </span>
          </div>
          <div class="right_top" v-loading="InfoLoading">
            <myUser v-if="userInfo.areaName != ''" class="user" :userInfo="userInfo"></myUser>
            <div v-if="itemData.length > 0" class="top_dataTable">
              <el-card v-for="(item, index) in itemData" :key="index" class="item">
                <img class="pic" :src="item.pic" onerror="this.src='./static/img/avator.jpg'">
                <div v-if="item.score" class="score">{{item.score}}</div>
                <p class="name">{{item.name}}</p>
                <el-tooltip class="item" effect="dark" :content="item.area" placement="bottom">
                  <p v-if="item.area" class="itemArea">{{item.area}}</p>
                </el-tooltip>
              </el-card>
            </div>
          </div>
        </el-card>
        <el-card class="box-card ">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; margin-left: 5px;">
              <i class="el-icon-date"></i>{{regionCity}}绩效信息</span>
          </div>
          <div class="container" v-loading="DatasLoading">
            <div class="xuanzhe">
              <el-select class="score" v-model="scoreValue" placeholder="请选择分数">
                <el-option v-for="item in scoreOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-select class="sorting" v-model="monthValue" placeholder="请选择月份">
                <el-option v-for="item in selectTime" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-table :data="tableDataTranslate" border style="width: 100%" header-row-class-name="dataHang" :cell-style="cellStyle" :row-style="showTr">
              <el-table-column align="center" fixed="left" min-width="100" label="指标">
                <template slot-scope="scope">
                  <p style="text-align:left">
                    <span v-for="(space, levelIndex) in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
                    <button class="button" v-if="toggleIconShow(0,scope.row)" @click="toggle(scope.$index)">
                      <i v-if="!scope.row._expanded" style="color: #999" class="el-icon-circle-plus" aria-hidden="true"></i>
                      <i v-if="scope.row._expanded" style="color: #999" class="el-icon-remove" aria-hidden="true"></i>
                    </button>
                    {{scope.row['elementName']}}
                  </p>
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="100" label="权重">
                <template slot-scope="scope">
                  {{scope.row['weights']}}
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="100" label="完成值">
                <template slot-scope="scope">
                  {{scope.row['complete']}}
                </template>
              </el-table-column>
              <el-table-column label="目标值" align="center">
                <el-table-column min-width="100" label="门槛值" align="center">
                  <template slot-scope="scope">
                    {{scope.row['thresholdTarget']}}
                  </template>
                </el-table-column>
                <el-table-column min-width="100" label="保底" align="center">
                  <template slot-scope="scope">
                    {{scope.row['atLeastTarget']}}
                  </template>
                </el-table-column>
                <el-table-column min-width="100" label="尖叫" align="center">
                  <template slot-scope="scope">
                    {{scope.row['screamTarget']}}
                  </template>
                </el-table-column>
                <el-table-column min-width="100" label="嚎叫" align="center">
                  <template slot-scope="scope">
                    {{scope.row['howlTarget']}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column align="center" min-width="100" label="考核频率">
                <template slot-scope="scope">
                  {{scope.row['assess']}}
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" min-width="100" label="得分">
                <template slot-scope="scope">
                  {{scope.row['score'] === '' ? '' : parseInt(scope.row['score']*100)/100}}
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" min-width="100" label="加权得分">
                <template slot-scope="scope">
                  {{scope.row['actualScore'] === '' ? '' : parseInt(scope.row['actualScore']*100)/100}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; margin-left: 5px;">
              <i class="el-icon-date"></i>{{regionCity}}季度总成绩柱状图</span>
          </div>
          <div class="lineChart" id="lineChart" v-loading="ChartsLoading"></div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>
import { getScoreDetail, retrunPicURL, getAreaInfo, getAreaDatas, getAreaCharts } from '@/api/performance'
import myUser from './user'
import breadCrumb from '../../breadCrumb'
import MSDataTransfer from '../common/dataTranslate.js'
import { getDynamicIndex } from '../common/js/method.js'
export default {
  components: {
    myUser,
    breadCrumb
  },
  data() {
    return {
      quartMonth: '季度', //季度/月度
      regionCity: '城市公司', //类型
      pic: './static/img/avator.jpg',
      myChartA: '', // 初始化表格
      // 详情加载中
      InfoLoading: false,
      // 数据加载中
      DatasLoading: false,
      // 图表加载中
      ChartsLoading: false,
      // 是否显示返回按钮
      isShowGoBack: false,
      // 是否显示树状按钮
      treeStructure: true,
      // 是否展开树状内容
      defaultExpandAll: true,
      // 当前区域id
      key: '',
      // 分数选择值
      scoreValue: '全部',
      // 选择月份
      monthValue: 0,
      // 区域总信息
      userInfo: {
        score: '',
        smaeScore: '',
        pic: '',
        name: '',
        areaName: '',
        depart: ''
      },
      quartMonthList: [
        { value: '季度', label: '季度' },
        { value: '月度', label: '月度' }
      ],
      // 分数选项数组
      scoreOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '低于保底',
          label: '低于保底'
        },
        {
          value: '高于嚎叫',
          label: '高于嚎叫'
        }
      ],
      // 多个区域切换列表
      areaList: [],
      // 月份选项
      selectTime: [],
      // 项目数组
      itemData: [],
      // 表格数据
      tableData: [],
      // 原始数据
      areaCache: {},
      // 筛选后数据
      filterData: {},
      // 指标数据
      quotaOptions: [],
      // 指标数据展示顺序
      quotaOptionsFirst: [],
      dataSource: []
    }
  },
  watch: {
    // 监听路由变化
    $route: 'getParams',
    // 监听月份变化
    monthValue: function(val, oldVal) {
      // 输入原数据指标数组、月份，返回表格数据
      // this.processTableData(this.areaCache[this.key], this.monthValue)
      // 处理区域总信息
      // this.processUserData(this.areaCache[this.key], this.monthValue)

      this.getAreaDatas(this.key, this.monthValue + 1);
    },
    scoreValue: function(val, oldVal) {
      // 输入原数据指标数组、月份，返回表格数据
      // console.log(val)
      // this.processTableData(this.areaCache[this.key], this.monthValue)
      // 处理区域总信息
      // this.processUserData(this.areaCache[this.key], this.monthValue)

      this.processTableData(this.areaCache, 0)
    },
    quartMonth: function(quartMonth, oldVal) {
      if (quartMonth == '月度') {
        this.$router.replace('/areaManagerCityMonth')
      } else {
        this.$router.replace('/areaManagerCity')
      }
    }
  },
  activated() {
    this.quartMonth = '季度' // 路由二次切回页面
  },
  created() {},
  mounted() {
    this.getParams()
  },
  computed: {
    // 格式化数据源
    tableDataTranslate: function() {
      // debugger;
      let _this = this
      if (_this.treeStructure) {
        let data = MSDataTransfer.treeToArray(
          _this.dataSource,
          null,
          null,
          _this.defaultExpandAll
        )
        // console.log(data)
        return data
      }
      return _this.dataSource
    }
  },
  methods: {
    getParams() {
      var _this = this
      let data
      if (this.$route.query.areaId) {
        this.areaList = [] //初始化切换数组
        data = this.$route.query.areaId
      }
      this.isShowGoBack = data ? true : false
      if (this.$route.path == '/areaManagerCity') {
        _this.regionCity = _this.$route.query.region
        data ? (this.key = data) : ''
        // this.queryAreaData([this.key])

        // 获取区域总详情数据 - 11.16
        _this.getAreaInfo(_this.key);
        _this.getAreaCharts(_this.key);
        // 重新触发月份选项
        _this.monthValue = parseInt(_this.$route.query.month) - 1 || 0;
        _this.getAreaDatas(_this.key, _this.monthValue);
      }
    },
    // 折线图
    lineChart(listData) {
      // console.log('执行图表渲染函数')
      let _this = this
      let _echarts = require('echarts')
      this.myChartA = _echarts.init(document.getElementById('lineChart'))
      // let _dateData = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      // let _data = ['', '', '', '', '', '', '', '', '', '', '', ''];
      let _dateData = ['第一季度', '第二季度', '第三季度', '第四季度']
      let _data = ['', '', '', '']

      // if (_this.regionCity == '区域') {
      //   listData = _this.checkQuotaData(listData.detailInfo, '0')
      // } else {
      //   listData = _this.checkQuotaData(listData.detailInfo, '1')
      // }

      // for (let i = 0; i < listData.scoreDetailInfo.length; i++) {
      //   let _score = listData.scoreDetailInfo[i].scoreInfo.actualScore
      //   _data[listData.scoreDetailInfo[i].quarter - 1] = _score
      // }
      for (let i = 0; i < listData.length; i++) {
        let _score = listData[i].actualScore
        _data[parseInt(listData[i].quarterly) - 1] = _score
      }
      this.myChartA.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
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
            type: 'value'
          }
        ],
        series: [
          {
            name: '总指标',
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
    },
    // 处理表格数据
    processTableData(listData, month) {
      let _this = this
      let _data = {}
      if (!listData) {
        listData = {
          detailInfo: []
        }
      }
      //动态获取指标
      let obj =getDynamicIndex(listData.detailInfo,'季度')
      this.quotaOptionsFirst = obj.quotaOptionsFirst
      this.quotaOptions = obj.quotaOptions

      // 筛选数据
      listData = JSON.parse(JSON.stringify(listData))
      listData = _this.FilterHander(listData.detailInfo, month)

      for (let i = 0; i < listData.length; i++) {
        let _item = {
          one: '',
          two: '',
          three: '',
          elementName: ''
        }
        let _quota =
          _this.checkQuotaNames(
            listData[i].elementInfo.elementId,
            _this.quotaOptions
          ) || []
        // 当前指标单位
        let _unit = listData[i].elementInfo.unit
        // let _unit = 0;
        let _unitName = ''
        // _item.id = i + 1;
        _item.elementId = listData[i].elementInfo.elementId
        // debugger
        // console.log('_quota', _quota)
        if (_quota.length !== 0) {
          _item.elementName = _quota[_quota.length - 1].label
          _item.one = _quota[0].label
          _quota[1] ? (_item.two = _quota[1].label) : (_item.two = '')
          _quota[2] ? (_item.three = _quota[2].label) : (_item.three = '')
        }
        _unitName =
          _unit === 0
            ? ''
            : _unit === 1
              ? '%'
              : _unit === 2
                ? '元/元'
                : _unit === 3 ? '万元' : _unit === 4 ? '平方米/人' : ''
        // console.log(listData[i].elementInfo.name, listData[i], _unitName)
        // 权重
        if (_item.elementId == '0') {
          _item.weights = _this.returnTwoFloatPrize(1)
        } else {
          _item.weights = _this.returnTwoFloatPrize(
            listData[i].scoreDetailInfo[month].targetInfo.weight
          )
        }
        if (_item.elementId == '1012005') {
          // 入室盗窃案案发率
          // 指标值
          _item.index = listData[i].scoreDetailInfo[month].scoreInfo.score
          // 完成值
          _item.complete = _this.returnTwoFloatPrize4(
            listData[i].scoreDetailInfo[month].scoreInfo.complete
          )
          _item.thresholdTarget = _this.returnTwoFloatPrize4(
            listData[i].scoreDetailInfo[month].targetInfo.thresholdTarget
          )
          _item.atLeastTarget = _this.returnTwoFloatPrize4(
            listData[i].scoreDetailInfo[month].targetInfo.atLeastTarget
          )
          _item.screamTarget = _this.returnTwoFloatPrize4(
            listData[i].scoreDetailInfo[month].targetInfo.screamTarget
          )
          _item.howlTarget = _this.returnTwoFloatPrize4(
            listData[i].scoreDetailInfo[month].targetInfo.howlTarget
          )
        } else if (_unit === 1) {
          // 指标值
          _item.index = listData[i].scoreDetailInfo[month].scoreInfo.score
          // 完成值
          _item.complete = _this.returnTwoFloatPrize(
            listData[i].scoreDetailInfo[month].scoreInfo.complete
          )
          _item.thresholdTarget = _this.returnTwoFloatPrize(
            listData[i].scoreDetailInfo[month].targetInfo.thresholdTarget
          )
          _item.atLeastTarget = _this.returnTwoFloatPrize(
            listData[i].scoreDetailInfo[month].targetInfo.atLeastTarget
          )
          _item.screamTarget = _this.returnTwoFloatPrize(
            listData[i].scoreDetailInfo[month].targetInfo.screamTarget
          )
          _item.howlTarget = _this.returnTwoFloatPrize(
            listData[i].scoreDetailInfo[month].targetInfo.howlTarget
          )
        } else {
          // 指标值
          _item.index = listData[i].scoreDetailInfo[month].scoreInfo.score
          // 完成值
          _item.complete = _this.returnTwoFloat(
            listData[i].scoreDetailInfo[month].scoreInfo.complete
          )
          _item.complete =
            _item.complete > 0 ? _item.complete + _unitName : _item.complete
          _item.thresholdTarget = _this.returnTwoFloat(
            listData[i].scoreDetailInfo[month].targetInfo.thresholdTarget
          )
          _item.thresholdTarget =
            _item.thresholdTarget > 0
              ? _item.thresholdTarget + _unitName
              : _item.thresholdTarget
          _item.atLeastTarget = _this.returnTwoFloat(
            listData[i].scoreDetailInfo[month].targetInfo.atLeastTarget
          )
          _item.atLeastTarget =
            _item.atLeastTarget > 0
              ? _item.atLeastTarget + _unitName
              : _item.atLeastTarget
          _item.screamTarget = _this.returnTwoFloat(
            listData[i].scoreDetailInfo[month].targetInfo.screamTarget
          )
          _item.screamTarget =
            _item.screamTarget > 0
              ? _item.screamTarget + _unitName
              : _item.screamTarget
          _item.howlTarget = _this.returnTwoFloat(
            listData[i].scoreDetailInfo[month].targetInfo.howlTarget
          )
          _item.howlTarget =
            _item.howlTarget > 0
              ? _item.howlTarget + _unitName
              : _item.howlTarget
        }
        // 目标
        // _item.thresholdTarget = Math.round(listData[i].scoreDetailInfo[month].targetInfo.thresholdTarget * 100)/100;
        // _item.atLeastTarget = Math.round(listData[i].scoreDetailInfo[month].targetInfo.atLeastTarget * 100)/100;
        // _item.screamTarget = Math.round(listData[i].scoreDetailInfo[month].targetInfo.screamTarget * 100)/100;
        // _item.howlTarget = Math.round(listData[i].scoreDetailInfo[month].targetInfo.howlTarget * 100)/100;
        // 考核频率
        _item.assess = listData[i].scoreDetailInfo[month].targetInfo.frequency
        // 得分
        if (
          _item.elementId == '1010' ||
          _item.elementId == '1011' ||
          _item.elementId == '1012' ||
          _item.elementId == '1013' ||
          _item.elementId == '1014' ||
          _item.elementId == '1015'
        ) {
          _item.score = listData[i].scoreDetailInfo[month].scoreInfo.score
        } else {
          _item.score =
            listData[i].scoreDetailInfo[month].scoreInfo.score == -1
              ? ''
              : listData[i].scoreDetailInfo[month].scoreInfo.score
        }
        if (_item.elementId == '0') {
          _item.actualScore =
            listData[i].scoreDetailInfo[month].scoreInfo.actualScore
        } else {
          _item.actualScore =
            _item.weights == 0
              ? ''
              : _item.score == ''
                ? _item.score
                : _item.score *
                  listData[i].scoreDetailInfo[month].targetInfo.weight
        }
        // _data.push(_item)
        _data[_item.elementId] = JSON.parse(JSON.stringify(_item))
      }
      // console.log(_data)
      // _this.tableData = _data;
      _this.tableData = _this.tableDataSort(_data)
      // console.log('数据排序之后的数据', _this.tableData)
      _this.dataSource = _this.tableDataNest(_this.tableData)
      //   console.log('_this.dataSource' + JSON.stringify(_this.dataSource))
    },
    // 输出保留后4位百分数
    returnTwoFloatPrize4(data) {
      // _item.complete = listData[i].scoreDetailInfo[month].scoreInfo.complete
      if (data === null) {
        return ''
      } else if (data == -1) {
        return ''
      } else if (data <= 1 && data > 0) {
        data = Math.round(data * 1000000) / 10000 + '%'
      } else {
        data = Math.round(data * 100) / 100
      }
      return data
    },
    // 输出保留后两位百分数
    returnTwoFloatPrize(data) {
      // _item.complete = listData[i].scoreDetailInfo[month].scoreInfo.complete
      if (data === null) {
        return ''
      } else if (data == -1) {
        return ''
      } else if (data <= 1 && data > 0) {
        data = Math.round(data * 10000) / 100 + '%'
      } else {
        data = Math.round(data * 100) / 100
      }
      return data
    },
    // 输出保留后两位小数
    returnTwoFloat(data) {
      // _item.complete = listData[i].scoreDetailInfo[month].scoreInfo.complete
      if (data === null) {
        data = ''
      } else if (data == -1) {
        return ''
      } else {
        data = Math.round(data * 100) / 100
      }
      return data
    },
    // 表格数据排序
    tableDataSort(listData) {
      let _this = this
      let _list = JSON.parse(JSON.stringify(_this.quotaOptionsFirst))
      let i = _list.length
      while (i--) {
        // debugger
        if (listData[_list[i].value]) {
          _list[i] = Object.assign(_list[i], listData[_list[i].value])
        } else {
          _list.splice(i, 1)
        }
      }
      return _list
    },
    // 处理表格数据内嵌并返回
    tableDataNest(data) {
      let _this = this
      data = JSON.parse(JSON.stringify(data))
      // 查询并嵌入对象
      let _nestData = function(id, itemData) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].elementId == id) {
            data[j].children = data[j].children
              ? JSON.parse(JSON.stringify(data[j].children))
              : []
            data[j].children.push(itemData)
            // 清空有子级指标的父级完成值
            data[j].complete = ''
            // 累加权重 赋值到上级权重
            let _allWeights =
              data[j].weights != 0
                ? data[j].weights.replace('%', '')
                : data[j].weights
            let _itemWeights =
              itemData.weights != 0
                ? itemData.weights.replace('%', '')
                : itemData.weights
            let _weights = parseFloat(_allWeights) + parseFloat(_itemWeights)
            data[j].weights = _weights === 0 ? _weights : _weights + '%'
          }
        }
      }
      // 查询二、三级指标并嵌入上级指标
      // console.log('_this.quotaOptions', _this.quotaOptions)
      for (let i = data.length - 1; i >= 0; i--) {
        let _quota = _this.checkQuotaNames(
          data[i].elementId,
          _this.quotaOptions
        )
        if (_quota.length > 1) {
          _nestData(_quota[_quota.length - 2].value, data[i])
        }
      }
      // 删除二三级指标
      let k = data.length
      while (k--) {
        let _quota = _this.checkQuotaNames(
          data[k].elementId,
          _this.quotaOptions
        )
        if (_quota.length > 1) {
          data.splice(k, 1)
        }
      }
      // console.log('table', data)
      return data
    },
    // 处理月份、季度选择数据
    processMouthData(listData) {
      // console.log('执行月份处理函数')
      let _this = this
      let _month = []
      // console.log(listData)
      // listData = listData.scoreDetailInfo
      for (let i = 0; i < listData.length; i++) {
        let _item = {
          value: parseInt(listData[i].quarterly) - 1 || 0,
          label:
           listData[i].year +
            '年第' +
            listData[i].quarterly +
            '季度'
        }
        _month.push(_item)
      }
      // console.log(_month)
      return _month
    },
    // 处理区域总信息
    processUserData(listData, month) {
      let _this = this
      // 当前区域总指标数据
      let _allQuotaData = ''
      if (!listData) {
        listData.detailInfo = [];
      }
      if (_this.regionCity == '区域') {
        _allQuotaData = _this.checkQuotaData(listData.detailInfo, '0')
      } else {
        _allQuotaData = _this.checkQuotaData(listData.detailInfo, '1')
      }

      // 首个项目的月度数据
      let _itemList = _allQuotaData.scoreDetailInfo
      // console.log(_allQuotaData)
      // 局域-环比值
      let _ringThan = parseInt(_itemList[month].scoreInfo.ranges || 0)
      // _ringThan = _itemList[1] === undefined ? 0 : _itemList[0].scoreInfo.score - _itemList[1].scoreInfo.score;
      // _ringThan = _itemList[1] === undefined ? 0 : (_itemList[0].scoreInfo.score - _itemList[1].scoreInfo.score) / _itemList[1].scoreInfo.score;
      // _ringThan = _ringThan == '' || _ringThan == 0 || isNaN(_ringThan) ? 0 : parseInt(_ringThan * 10000) / 100
      let _info = {
        score: _allQuotaData.scoreDetailInfo[month].scoreInfo.actualScore,
        pic:
          retrunPicURL(listData.organInfo.imageUrl) == null
            ? ''
            : retrunPicURL(listData.organInfo.imageUrl),
        name: listData.organInfo.names,
        areaName: listData.organInfo.hierachyName,
        ringThan: _ringThan
        // depart: listData.organInfo.hierarchyName,
      }
      _this.userInfo = _info
      console.log('_this.userInfo',_this.userInfo)
      _this.itemData = []
      for (let i = 0; i < listData.organInfo.commInfo.length; i++) {
        let _item = {
          pic:
            retrunPicURL(listData.organInfo.commInfo[i].imageOnePath) == null
              ? ''
              : retrunPicURL(listData.organInfo.commInfo[i].imageOnePath),
          score: '',
          name: listData.organInfo.commInfo[i].names,
          area: listData.organInfo.commInfo[i].commName
        }
        _this.itemData.push(_item)
      }
    },
    // 返回上级菜单
    handleGoBack() {
      this.$router.push({
        path: '/performanceAnalysis'
      })
    },
    // 查询指标，并返回一二三级
    checkQuotaNames(Id, arrData) {
      let _this = this
      let name = []
      for (let i = 0; i < arrData.length; i++) {
        let item = {
          value: arrData[i].value,
          label: arrData[i].label
        }
        if (arrData[i].value == Id) {
          name.push(item)
          return name
        } else if (arrData[i].children) {
          let _name = _this.checkQuotaNames(Id, arrData[i].children)
          if (_name != [] && _name != undefined) {
            name.push(item)
            name = name.concat(_name)
            return name
          }
        }
      }
    },
    // 在指标中查询指标并返回数据
    checkQuotaData(listData, index) {
      let _data = {}
      for (let i = 0; i < listData.length; i++) {
        if (listData[i].elementInfo.elementId == index) {
          _data = JSON.parse(JSON.stringify(listData[i]))
          break
        }
      }
      return _data
    },
    // 筛选总入口
    FilterHander(FsList, month) {
      let FsJson = {}
      let FsType = this.scoreValue
      FsJson = this.Filter_ScoreType(FsType)
      if (FsJson) {
        FsJson.List = FsList
        // console.log(FsList, FsJson)
        FsList = this.Filter_ScoreData(FsJson, month)
      }
      // console.log(FsList)
      return FsList
    },
    // 筛选：获取条件类型
    Filter_ScoreType(FsType) {
      // _Fkey = gt:高于 | lt:低于 ;
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
          FsJson.key = 'averageScore'
          FsJson.selector = 'lt'
          break
        case '大于平均分':
          FsJson.key = 'averageScore'
          FsJson.selector = 'gt'
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
    Filter_ScoreData(FsJson, month) {
      // 删选数据
      // debugger
      let FsList = FsJson.List, //被筛选数据
        Fskey = FsJson.key, //固定对比值
        FsSelector = FsJson.selector, //对比条件
        FsScore = '', //对比分数
        SiList = [] //列表
      let i = FsList.length
      while (i--) {
        SiList = FsList[i].scoreDetailInfo || []
        let FsData = SiList[month].targetInfo[Fskey]
        if (!FsData) {
          FsList.splice(i, 1)
        } else {
          FsScore = SiList[month].scoreInfo['complete'] //完成值
          FsSelector === 'lt'
            ? FsScore < FsData ? '' : FsList.splice(i, 1)
            : FsScore > FsData ? '' : FsList.splice(i, 1)
        }
        // if(SiList.length === 0) FsList.splice(i, 1);
      }
      return FsList
    },
    // 表格插件
    // 显示行
    showTr(row, index) {
      let show = row.row._parent
        ? row.row._parent._expanded && row.row._parent._show
        : true
      row.row._show = show
      if (row.rowIndex % 2 == 0) {
        return show ? '' : 'display:none;'
      } else {
        return show ? 'background: #f6f6f6;' : 'display:none;'
      }
    },
    // 展开下级
    toggle(trIndex) {
      let _this = this
      let record = _this.tableDataTranslate[trIndex]
      record._expanded = !record._expanded
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(index, record) {
      let _this = this
      if (
        _this.treeStructure &&
        index === 0 &&
        record.children &&
        record.children.length > 0
      ) {
        return true
      }
      return false
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'red'
      }
    },
    // 表格低于平均值背景色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log({row, column, rowIndex, columnIndex})
      if (parseFloat(row.complete) < parseFloat(row.thresholdTarget)) {
        return 'background: #F56C6C; color: #fefefe'
      }
    },
    // 获取季度区域总详情数据 - 11.6
    async getAreaInfo (key) {
      let _this = this;
      _this.InfoLoading = true;
      _this.regionCity = '城市公司';
      await getAreaInfo (
        {
          typeNo: _this.regionCity == '区域' ? '1' : '2',
          organList: key
        },
        response => {
          _this.InfoLoading = false;
          console.log(response);
          if (response.length > 1) {
            this.areaList = response;
            _this.setAreaInfo([]);
          } else {
            _this.setAreaInfo(response);
          }
        },
        (error, code) => {
          console.log(error)
          _this.InfoLoading = false
          this.$message({
            type: 'error',
            message: '信息接口请求失败'
          })
        },
        (exception, code) => {
          console.log('异常' + exception)
          _this.InfoLoading = false
          this.$message({
            type: 'error',
            message: '信息接口请求失败'
          })
        }
      )
    },
    // 获取季度区域数据 - 11.6
    async getAreaDatas (key, month) {
      let _this = this;
      let _month = month || _this.$route.query.month || 0;
      _this.DatasLoading = true;
      _this.regionCity = '城市公司';
      await getAreaDatas (
        '季度',
        {
          year: new Date().getFullYear(),
          quarter: _month,
          typeNo: _this.regionCity == '区域' ? '1' : '2',
          organList: key
        },
        response => {
          _this.DatasLoading = false;
          console.log(response);
          // 默认取第一个区域数据
          let _area = 0;
          // 默认第一个季度
          let _month = 0;
          // 默认取总指标
          let _elementid = 1;
          _this.areaCache = response[_area];
          // 处理区域数据
          _this.processTableData(response[_area], _month);
          // 返回当前总分和排名
          if (!response[_area]) {
            _this.userInfo.score = '';
            _this.userInfo.ringThan = '';
            return false
          }
          // 从总指标中返回当前总分和排名
          let _datas = _this.checkQuotaData(response[_area].detailInfo, _elementid);
          _this.userInfo.score = _datas.scoreDetailInfo[_area].scoreInfo.score;
          _this.userInfo.ringThan = _datas.scoreDetailInfo[_area].ranges;
        },
        (error, code) => {
          console.log(error)
          _this.DatasLoading = false
          this.$message({
            type: 'error',
            message: '数据接口请求失败'
          })
        },
        (exception, code) => {
          console.log('异常' + exception)
          _this.DatasLoading = false
          this.$message({
            type: 'error',
            message: '数据接口请求失败'
          })
        }
      )
    },
    // 获取季度区域数据 - 11.6
    async getAreaCharts (key) {
      let _this = this;
      _this.ChartsLoading = true;
      _this.regionCity = '城市公司';
      await getAreaCharts (
        {
          year: new Date().getFullYear(),
          typeNo: _this.regionCity == '区域' ? '1' : '2',
          organList: key
        },
        response => {
          _this.ChartsLoading = false;
          console.log(response);
          // 返回季度可选值
          _this.selectTime = _this.processMouthData(response)
          if (_this.selectTime.length > 0) {
            // 处理区域数据
            _this.lineChart(response);
          }
        },
        (error, code) => {
          console.log(error)
          _this.ChartsLoading = false
          // 处理区域数据
          _this.lineChart([]);
          this.$message({
            type: 'error',
            message: '图表接口请求失败'
          })
        },
        (exception, code) => {
          console.log('异常' + exception)
          _this.ChartsLoading = false
          this.$message({
            type: 'error',
            message: '图表接口请求失败'
          })
        }
      )
    },
    // 设置区域总信息 - 11.6
    setAreaInfo (datas) {
      let _this = this;
      let _month = 0;
      if (datas.length == 0) {
        let _item = {commInfo: []};
        datas.push(_item);
      }
      let _info = {
        pic:
          retrunPicURL(datas[_month].imageUrl) == null
            ? ''
            : retrunPicURL(datas[_month].imageUrl),
        name: datas[_month].names || '',
        areaName: datas[_month].hierachyName || '',
        score: '',
        ringThan: ''
      }
      _this.userInfo = _info;
      _this.itemData = [];
      for (let i = 0; i < datas[_month].commInfo.length; i++) {
        let _item = {
          pic:
            retrunPicURL(datas[_month].commInfo[i].imageOnePath) == null
              ? ''
              : retrunPicURL(datas[_month].commInfo[i].imageOnePath),
          score: '',
          name: datas[_month].commInfo[i].names,
          area: datas[_month].commInfo[i].commName
        }
        _this.itemData.push(_item)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.red {
  background: red;
}
.area {
  display: flex;
  min-width: 800px;
  .left {
    padding: 10px;
    width: 30px; // background: #eee;
    .user {
      margin: auto;
    }
    .assess {
      overflow: hidden;
      margin: 10px 0;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
  }
  .right {
    margin: 20px;
    width: 100%;
    min-width: 800px;
    .box-card {
      margin-bottom: 15px;
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
    // .searchCard{
    //   padding: 20px;
    //   padding: 20px;
    //   border-top: 1px solid #ebeef5;
    // }
    .right_top {
      display: flex; // overflow: hidden;
      width: 100%;
      min-height: 100px;
      .el-card__body {
        padding: 10px;
      }
      .top_dataTable {
        display: flex; // flex-wrap: wrap;
        min-width: 500px;
        margin-left: 30px;
        padding-top: 30px;
        overflow-x: auto;
        .item {
          overflow: visible;
          position: relative;
          margin: 0 20px 15px 0;
          width: 120px;
          height: 120px;
          text-align: center;
          .pic {
            display: block;
            margin: -10px auto 0;
            width: 50px;
            height: 50px;
          }
          .score {
            position: absolute;
            top: -15px;
            right: -15px;
            overflow: hidden;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid #ededed;
            color: #fff;
            font-size: 16px;
            background: #6b97fb;
            text-align: center;
            line-height: 30px;
          }
          p {
            width: 100%;
            margin: 3px 0;
            text-align: center;
          }
          .itemArea {
            height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .filter-wrapper {
      overflow: hidden;
      margin: 20px 0;
      padding: 10px 0;
      border: 1px solid #ededed;
      border-radius: 5px;
      background: #fafafa;
      .zhibiao {
        margin-left: 10px;
        margin-right: 20px;
      }
      input {
        border: 0 !important;
        background: rgba(0, 0, 0, 0) !important;
      }
    }
    .container {
      width: 100%; // min-height: 500px;
      .xuanzhe {
        overflow: hidden;
        margin-bottom: 20px;
        width: 100%;
        height: 60px;
        .selectTime {
          margin: 10px 10px 0;
        }
        .score {
          margin-left: 0px;
        }
        .sorting {
          margin: 10px 10px 0;
        }
      }
      .dataTable {
        margin: 20px auto;
        width: 100%;
        height: auto;
      }
      .dataHang {
        background: #eef1f6;
      }
    }
    .lineChart {
      margin: 0 auto;
      width: 100%;
      height: 200px;
    }
  }
}
.qksort-item {
  margin-top: 20px;
  text-align: center;
}
.qksort-item .titile,
.qksort-item .qksort-text {
  display: block;
  margin: 10px 0;
  text-decoration: none;
}
.qksort-item .qksort-text:active {
  color: #409dfb;
}
.filter-wrapper .el-form-item {
  margin-bottom: 15px;
}
.filter-wrapper .el-form-item__label,
.filter-wrapper .el-form-item__content,
.filter-wrapper .el-radio {
  line-height: 40px;
}
.filter-wrapper .el-radio {
  margin: 0 10px 0 0;
}
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: '';
}
table td {
  line-height: 26px;
}
.button {
  background-color: transparent;
}
.dataHang {
  background: #eef1f6;
}
.isCenter {
  text-align: left;
}
</style>
<style>
.quartMonth .el-input--suffix .el-input__inner {
  text-align: center;
}
</style>