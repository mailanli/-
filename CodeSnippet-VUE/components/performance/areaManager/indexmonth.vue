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
          <div class="right_top" v-loading.body="fullscreenLoading">
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
          <div class="container">
            <div class="xuanzhe">
              <!-- <el-select class="score" v-model="scoreValue" placeholder="请选择分数">
                <el-option v-for="item in scoreOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
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
              <el-table-column align="center" min-width="100" label="完成值">
                <template slot-scope="scope">
                  {{scope.row['complete']|isnull}}
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="100" label="年度目标">
                <template slot-scope="scope">
                  {{scope.row['annualTarget']|isnull}}
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="100" label="完成率">
                <template slot-scope="scope">
                  {{scope.row['completeRate']|percent}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <!-- <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px; margin-left: 5px;">
                            <i class="el-icon-date"></i>{{regionCity}}季度总成绩柱状图</span>
                    </div>
                    <div class="lineChart" id="lineChart" v-loading.body="fullscreenLoading"></div>
                </el-card> -->
      </div>
    </section>
  </div>
</template>

<script>
import { getMonthScoreDetail, retrunPicURL, getAreaInfo, getAreaDatas } from '@/api/performance'
import myUser from './user'
import { detail } from '../common/muck.js'
import breadCrumb from '../../breadCrumb'
import MSDataTransfer from '../common/dataTranslate.js'
import { getDynamicIndex,accMul } from '../common/js/method.js'
export default {
  components: {
    myUser,
    breadCrumb
  },
  data() {
    return {
      quartMonth: '月度', //季度/月度
      regionCity: '区域', //类型
      cityFlag: '区域',
      pic: './static/img/avator.jpg',
      // 加载中
      fullscreenLoading: false,
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
      this.processTableData(this.areaCache[this.key], this.monthValue)
      // 处理区域总信息
      // this.processUserData(this.areaCache[this.key], this.monthValue)
    },
    quartMonth: function(quartMonth, oldVal) {
      if (quartMonth == '月度') {
        this.$router.replace({
          path: '/areaManagerMonth',
          query: {
            region: this.$route.query.region,
            areaId: this.$route.query.areaId
          }
        })
      } else {
        this.$router.replace({
          path: '/areaManager',
          query: {
            region: this.$route.query.region,
            areaId: this.$route.query.areaId
          }
        })
      }
    }
  },
  filters: {
    percent(value) {
      if (parseFloat(value) > 0 && value != null) {
        return `${accMul(value,100)}%`
      } else {
        return ''
      }
    },
    // 过滤负数
    isnull(value) {
      if (parseFloat(value) > 0 && value != null) {
        return value
      } else {
        return ''
      }
    }
  },
  activated() {
    this.quartMonth = '月度' //路由二次切回页面
  },
  deactivated(){
    this.fullscreenLoading = false
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
      let data = ''
      if (this.$route.query.areaId) {
        this.areaList = [] //初始化切换数组
        data = this.$route.query.areaId
      }
      this.isShowGoBack = data ? true : false
      if (this.$route.path == '/areaManagerMonth') {
        _this.regionCity = _this.$route.query.region
        data ? (this.key = data) : ''
        // this.queryAreaData([this.key])
        // 获取区域总详情数据 - 11.16
        _this.getAreaInfo(_this.key);
        // 重新触发月份选项
        _this.monthValue = parseInt(_this.$route.query.month) || 0;
        _this.getAreaDatas(_this.key, _this.monthValue);
      }
      // console.log(this.key)
    },
    // 处理表格数据
    processTableData(listData, month) {
      // console.log('执行表格处理函数')
      // console.log(listData)
      // console.log(month)
      let _this = this
      let _data = {}
      if (!listData) {
        listData = {
          detailInfo: []
        }
      }
      
      //动态获取指标
      let obj =getDynamicIndex(listData,'月度')
      this.quotaOptionsFirst = obj.quotaOptionsFirst
      this.quotaOptions = obj.quotaOptions

      _this.tableData = _this.tableDataSort(listData)
      _this.dataSource = _this.tableDataNest(_this.tableData)
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
      // console.log(listData)

      let _this = this
      let table = []
      let _list = JSON.parse(JSON.stringify(_this.quotaOptionsFirst))
      let i = _list.length
      while (i--) {
        // debugger
        for (let b = 0; b < listData.length; b++) {
          if (listData[b].elementId == _list[i].value) {
            table[i] = Object.assign(listData[b], _list[i])
          }
        }
      }
      return table
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
          }
        }
      }
      // 查询二、三级指标并嵌入上级指标
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
      let _this = this
      let _month = []
      for (let i = 0; i < listData.length; i++) {
        let _item = {
          value: i,
          label: `${listData[i].year}年${listData[i].month}月`
        }
        _month.push(_item)
      }
      return _month
    },
    // 处理区域总信息
    processUserData(listData, month) {
      // console.log(listData)
      // console.log('处理区域总信息')
      let _this = this
      // // 当前区域总指标数据
      let _allQuotaData = ''
      if (!listData) {
        listData.monthAveDtoList = [];
      }
      _allQuotaData = listData
      // // 首个项目的月度数据
      let _itemList = _allQuotaData.monthAveDtoList
      // // console.log(_allQuotaData)
      // // 局域-环比值
      // let _ringThan = parseInt(_itemList[month].scoreInfo. || 0)
      // _ringThan = _itemList[1] === undefined ? 0 : _itemList[0].scoreInfo.score - _itemList[1].scoreInfo.score;
      // _ringThan = _itemList[1] === undefined ? 0 : (_itemList[0].scoreInfo.score - _itemList[1].scoreInfo.score) / _itemList[1].scoreInfo.score;
      // _ringThan = _ringThan == '' || _ringThan == 0 || isNaN(_ringThan) ? 0 : parseInt(_ringThan * 10000) / 100
      let _info = {
        score: _allQuotaData.monthAveDtoList[month].elementsAverage,
        pic:
          retrunPicURL(listData.organ.imageUrl) == null
            ? ''
            : retrunPicURL(listData.organ.imageUrl),
        name: listData.organ.names,
        areaName: listData.organ.hierarchyName,
        flag: '月度'
        // ringThan: _ringThan
        // depart: listData.organInfo.hierarchyName,
      }
      _this.userInfo = _info
      _this.itemData = []
      for (let i = 0; i < listData.organ.commInfo.length; i++) {
        let _item = {
          pic:
            retrunPicURL(listData.organ.commInfo[i].imageOnePath) == null
              ? ''
              : retrunPicURL(listData.organ.commInfo[i].imageOnePath),
          score: '',
          name: listData.organ.commInfo[i].names,
          area: listData.organ.commInfo[i].commName
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
      //筛选未编辑
      let FsJson = {}
      // let FsType = this.scoreValue
      // FsJson = this.Filter_ScoreType(FsType)
      // if (FsJson) {
      //   FsJson.List = FsList
      //   // console.log(FsList, FsJson)
      //   FsList = this.Filter_ScoreData(FsJson, month)
      // }

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
    // 获取月度区域总详情数据 - 11.6
    async getAreaInfo (key) {
      let _this = this;
      _this.InfoLoading = true;
      _this.regionCity = '区域';
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
    // 获取月度区域数据 - 11.6
    async getAreaDatas (key, month) {
      let _this = this;
      let _month = month || _this.$route.query.month || 0;
      _this.DatasLoading = true;
      _this.regionCity = '区域';
      await getAreaDatas (
        '月度',
        {
          year: new Date().getFullYear(),
          month: _month,
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
          let _monthList = [];
          // 返回当前总分和排名
          if (!response[_area]) {
            _this.selectTime = [];
            _this.userInfo.score = '';
            _this.userInfo.ringThan = '';
            return false
          }
          // 返回季度可选值
          for (let index = 0; index < response[_area].maxMonth; index++) {
            let _item = {
              year: new Date().getFullYear(),
              month: index + 1
            }
            _monthList.push(_item);
          }
          _this.selectTime = _this.processMouthData(_monthList)

          _this.areaCache = response[_area];
          // 处理区域数据
          _this.processTableData(response[_area].performanceMonthAveDto.monthDtoList, _month);
          // 返回当前总分和排名
          _this.userInfo.score = response[_area].performanceMonthAveDto.elementsAverage;
          _this.userInfo.ringThan = response[_area].performanceMonthAveDto.ranges;
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
.el-table th {
  background: #f5f7fa;
}
</style>