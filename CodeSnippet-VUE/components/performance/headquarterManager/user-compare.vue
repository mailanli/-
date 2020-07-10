<template>
  <div>
    <bread-crumb></bread-crumb>
    <div class="compare-wrapper" v-loading="compareLoading" element-loading-text="数据加载中......">
      <el-card class="compare_table">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px; margin-left: 5px;">
            <i class="el-icon-date"></i>数据对比</span>
          <el-button style="float: right;margin-right: 20px;" type="primary" @click="handleGoBack">返回</el-button>
        </div>
        <div class="top">
          <div class="xuanzhe">
            <el-checkbox v-model="isIndicator">标识最优项</el-checkbox>
          </div>
          <div class="list_card">
            <div v-for="(userPanel,userIndex) in userComparePanel">
              <!-- 显示区域 -->
              <user-item v-if="(userCompareList.length>userIndex)" :userKey="userIndex" :userType="userType" :userCompareList="userCompareList" :userMonthList="userMonthList[userIndex]" :userMsg="userCompareList[userIndex]" @monthChange="monthChange(userPanel)">
              </user-item>
              <!-- 下拉对比区域 -->
              <el-card v-else class="area-select box-card" style="margin-top: 10px">
                <div slot="header" class="header clearfix" style="line-height:32px;">
                  <span class="title">下拉选择对比{{regionCity}}</span>
                </div>
                <div class="compare-info clearfix">
                  <el-select class="compare-select" value-key="areaName" clearable v-model="userPanel.select" placeholder="请选择对比" @change="addToCompares">
                    <el-option v-for="(userSelectMsg,index) in userList" :value="userSelectMsg" :key="userSelectMsg.areaName" :label="userSelectMsg.areaName"></el-option>
                  </el-select>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        <el-table class="dataTable" :data="tableData" border :show-header="isTitle" header-row-class-name="dataHang">
          <el-table-column width="150" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="区域一" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.show == 1 && isIndicator ? 'red' : ''">{{scope.row[0]}}</div>
            </template>
          </el-table-column>
          <el-table-column label="区域二" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.show == 2 && isIndicator ? 'red' : ''">{{scope.row[1]}}</div>
            </template>
          </el-table-column>
          <el-table-column label="区域三" align="center">
            <template slot-scope="scope">
              <div :class="scope.row.show == 3 && isIndicator ? 'red' : ''">{{scope.row[2]}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-list">
          <el-button @click='iclick' round>退出</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import breadCrumb from '../../breadCrumb'
import { getScoreDetail,getElementByType, getAreaDatas } from '@/api/performance'
import userItem from '@/components/performance/headquarterManager/user-item.vue'
export default {
  data() {
    return {
      msg: 123,
      //userItem选中的对比值
      userCompareSelect: {},
      // userItem 组件类型
      userType: 'select',
      // 对比Loding
      compareLoading: false,
      // 表格数据
      tableData: [],
      // 标识最优项
      isIndicator: true,
      // 是否显示表头
      isTitle: false,
      // 用户拥有的月份
      userMonthList: [],
      selectMonth: 2,
      selectYear: new Date().getFullYear(),
      // 用户展示的面板数据
      userComparePanel: [
        {
          index: 0,
          select: ''
        },
        {
          index: 1,
          select: ''
        },
        {
          index: 2,
          select: ''
        }
      ],
      // 区域缓存
      areaCache: {},
      regionCity: '', //区域/城市公司
      // 指标数据展示顺序
      quotaOptionsCity: [],
      quotaOptionsFirst: [],
      quotaOptionregion: [],
      userCompareList: null,
      userList: null
    }
  },
  props: {
    // 'userCompares': {
    // 	type: Array
    // },
    // 'userCompareList': {
    // 	type: Array
    // },
    // 'userList': {
    // 	type: Array
    // }
  },
  activated() {
    var _this=this
    // console.log("activated")
    // if (this.$route.query.region == '城市公司') {
    //   _this.quotaOptionsFirst=_this.quotaOptionsCity
    //   // _this.getElementByType('2')
    // } else {
    //   _this.quotaOptionsFirst=_this.quotaOptionregion
    //   //  _this.getElementByType('1')
    // }
    this.regionCity = this.$route.query.region;
    this.getSession();
  },
  created() {
    // console.log("created")
    this.userCompareList = JSON.parse(window.sessionStorage['userCompareList'])
    this.userList = JSON.parse(window.sessionStorage['userList'])
  },
  components: {
    'user-item': userItem,
    'bread-crumb': breadCrumb
  },
  watch: {
    // $route: 'getSession',
    userCompareList() {
      this.$nextTick(() => {
        // dom元素更新后执行,因此此处能正确打印出更改之后的值;
        // console.log('watch Data : userCompareList');
        this.queryAreaData()
      })
    },
    isIndicator(oldVal) {
      if (oldVal) {
        this.calculationMaximum()
      }
    }
  },
  mounted() {
    this.regionCity = this.$route.query.region;
    // this.getSession()
  },
  methods: {
    // 获取session数据
    getSession() {
      // 获取session数据
      this.userList = JSON.parse(window.sessionStorage['userList'])
      this.userComparePanel = [
        {
          index: 0,
          select: ''
        },
        {
          index: 1,
          select: ''
        },
        {
          index: 2,
          select: ''
        }
      ]

      this.userCompareList = []
      let _userCompareList = JSON.parse(
        window.sessionStorage['userCompareList']
      )
      this.areaCache = {}
      for (let j = 0; j < _userCompareList.length; j++) {
        this.userCompareList[j] = _userCompareList[j]
      }

      this.queryAreaData()
    },
    initPage(RowId) {
      let _monthList = [],
        _areaIdList = [],
        areaId = '',
        month = ''
      let _tableData = [],
        _monthData = [],
        _userTabeldata = []
      let dataJson = this.getAreaIdData()
      // 获取用户数据变量定义
      let _data = []
      let _areaJson = {}
      // console.log(_data)
      // debugger
      _areaIdList = dataJson.idList
      _monthList = dataJson.monthList
      if (RowId >= 0) {
        this.queryAreaDataOne(_areaIdList[RowId], _monthList[RowId], RowId);
        return
      }
      this.userMonthList = []
      for (let i = 0; _areaIdList[i]; i++) {
        areaId = _areaIdList[i]
        month = 0;
        // debugger
        _tableData = this._analysisAreaList(areaId, month).returnList
        // console.log('_tableData',_tableData)
        _monthData = this._analysisAreaList(areaId, '月份').returnList
        // console.log(" _monthData", _monthData)
        _areaJson = this._analysisAreaList(areaId, month).arrayData
        //  console.log("   _areaJson ",_areaJson )
        _userTabeldata.push(_tableData)
        this.userMonthList.push(_monthData)
        _data.push(_areaJson)
      }
      console.log('this.userMonthList',this.userMonthList)
      this.getUserData(_data)
      this.dataToTable(_userTabeldata)
      this.compareLoading = false
    },
    monthChange(data) {
      this.initPage(data.index)
    },
    // 计算最优值
    calculationMaximum() {
      // console.log('调用map函数');
      let _this = this
      let _thisVal = 0
      let _prevVal = 0
      let tableList = _this.tableData
      let compareList = _this.userComparePanel
      let tabelItem = ''
      // console.log('tableList==>');
      // console.log(tableList);
      for (let i = 0; compareList[i]; i++) {
        for (let q = 0; tableList[q]; q++) {
          tabelItem = tableList[q]
          _thisVal = parseFloat(tabelItem[i])
          if (!isNaN(_thisVal)) {
            // _prevVal = i > 0 ? tabelItem[i - 1] : 0;
            _prevVal = tabelItem['score']
            _prevVal = parseFloat(_prevVal)
            if (_thisVal > _prevVal) {
              tabelItem.show = i + 1
              tabelItem['score'] = _thisVal
            }
          }
        }
      }
    },
    // 数据转变成表格需要的数据
    dataToTable(dataList) {
      // console.log('调用方法: dataToTable', dataList)
      // return;
      let _this = this
      let _userList = dataList
      let _userMsg = ''
      let _userObj = ''
      let isExist = false
      let _tableData = {}

      // _this._tableData = [];
      // 循环解析接口传递的数值
      for (let i = 0; _userList[i]; i++) {
        _userMsg = _userList[i]
        for (let q = 0; _userMsg[q]; q++) {
          // 判断解析出来的数值  是否存在表格中
          // for(let a=0;_tableData[a];a++){
          // 	if(_tableData[a]['name'] === _userMsg[q]['name']){
          // 		_tableData[a][i] = _userMsg[q]['score'];
          // 		_userMsg[q]['score'] = 0;
          // 		isExist = true;
          // 		break;
          // 	}
          // }
          // debugger
          for (const key in _tableData) {
            if (_tableData[key]['name'] === _userMsg[q]['name']) {
              _tableData[key][i] = _userMsg[q]['score']
              _userMsg[q]['score'] = 0
              isExist = true
              break
            }
          }
          // 解析数值不存在表格中 则进行添加操作
          if (!isExist || i === 0) {
            _userMsg[q]['show'] = i + 1
            _userMsg[q][i] = _userMsg[q]['score']
            // _tableData.push(_userMsg[q]);
            _tableData[_userMsg[q].name] = _userMsg[q]
          }
        }
      }
     _this.tableData = _this.tableDataSort(_tableData)
      if (this.isIndicator) {
        this.calculationMaximum()
      }
      // console.log(_this.tableData)
    },
    // 表格数据排序
    tableDataSort(listData) {
      let _this = this
      let _list=[];
      // let _list = JSON.parse(JSON.stringify(_this.quotaOptionsFirst))
      // let i = _list.length
      // while (i--) {
      //   // debugger
      //   if (listData[_list[i].value]) {
      //     _list[i] = Object.assign(_list[i], listData[_list[i].value])
      //   } else {
      //     _list.splice(i, 1)
      //   }
      // }
     
      for(let key in listData){
         _list.push(listData[key])
      }
      return _list
    },
    addToCompares(data) {
      let len = this.userCompareList.length
      // console.log(data);
      if (data && len <= 2) {
        data = this.deepCopy(data)
        this.userCompareList.push(data)
      } else if (len > 2) {
        this.$message('最多可选择3条')
      }
    },
    iclick() {
      this.$router.push({ path: 'performanceAnalysis' })
    },
    // 获取当前对比: 区域ID
    getAreaIdData() {
      let areaIdList = [],
        areaMonthList = [],
        areaId = '',
        selectMonth = ''
      for (let i = 0; this.userCompareList[i]; i++) {
        areaId = this.userCompareList[i]['areaId']
        selectMonth = this.userCompareList[i]['selectMonth']
        areaIdList.push(areaId)
        areaMonthList.push(selectMonth)
      }
      return {
        idList: areaIdList,
        monthList: areaMonthList
      }
    },
    // 根据解析区域值
    _analysisAreaList(areaId, key) {
      let _this = this
      // 原始数据数组_arrayData
      let _arrayData = []
      let areaList = []
      let organJson = {}
      let returnList = []
      let dataJson = {
        areaId: areaId,
        areaKey: key,
        maxQuarter: '',
        detailInfo: []
      }
      // 获取存在缓存中的区域数据
      for (let cacheKey in _this.areaCache) {
        if (cacheKey.indexOf(areaId) >= 0) {
          areaList = _this.areaCache[cacheKey];
          for (let i = 0; areaList[i]; i++) {
            organJson = areaList[i]['detailInfo'][0]['scoreDetailInfo'][0]
            // 获取到对应区域的详细列表值
            if (areaId == organJson.hierachyId) {
              // _arrayData.push()
              dataJson.detailInfo = areaList[i]['detailInfo']
              dataJson.maxQuarter = areaList[i]['maxQuarter']
              returnList = _this._analysisDetailList(dataJson)
              return {
                returnList: returnList,
                arrayData: JSON.parse(JSON.stringify(areaList[i]))
              }
            }
          }
          return {
            returnList: returnList,
            arrayData: {}
          }
        }
      }
    },
    _analysisDetailList(dataJson) {
      let detailList = dataJson['detailInfo']
      let returnList = []
      let elementInfo = {}
      let scoreInfo = []
      let List = [],
        obj
      let _thisMonth = ''
      for (let i = 0; detailList[i]; i++) {
        elementInfo = detailList[i]['elementInfo']
        scoreInfo = detailList[i]['scoreDetailInfo']
        if (dataJson['areaKey'] === '月份') {
          for (var q = 1; q < dataJson['maxQuarter'] + 1; q++) {
            obj = new Object()
            obj.label = this._dataToMonth(q)
            obj.value = q
            returnList.push(obj)
          }
          break
        } else {
          // debugger;
          // try{
          _thisMonth = dataJson['areaKey']
          if (scoreInfo[_thisMonth]) {
            obj = new Object()
            obj.name = elementInfo.elementId
            obj.item = elementInfo.name
            if (obj.name == 0) {
              obj.score = scoreInfo[_thisMonth]['scoreInfo']['actualScore']
            } else {
              obj.score = scoreInfo[_thisMonth]['scoreInfo']['score']
            }
            returnList.push(obj)
          }
          // }catch(e){
          // 	console.log('当前下标:'+i)
          // 	console.log(detailList[i]);
          // 	console.log('scoreInfo:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
          // 	console.log(scoreInfo)
          // }
        }
      }
      return returnList
    },
    _dataToMonth(val) {
      let month = ''
      val = parseInt(val)
      val = isNaN(val) ? 1 : val
      switch (val) {
        case 1:
          month = '第一季度'
          break
        case 2:
          month = '第二季度'
          break
        case 3:
          month = '第三季度'
          break
        case 4:
          month = '第四季度'
          break
      }
      return month
    },
    // 返回用户列表数据
    getUserData(dataList) {
      // console.log(dataList);
      let _this = this
      let _userData = JSON.parse(JSON.stringify(_this.userCompareList))
      // console.log(_userData)
      let regionFlag = ''
      // 季度
      let _month = 0;
      if (_this.$route.query.region == '城市公司') {
        regionFlag = '1'
      } else {
        regionFlag ='0'
      }
      for (let i = 0; dataList[i]; i++) {
        let _dataList = _this.checkQuotaData(dataList[i].detailInfo, regionFlag)
        _userData[i].score =
          _dataList.scoreDetailInfo[_month].scoreInfo.actualScore

        let _ringThan = _dataList.scoreDetailInfo[_month].ranges
        _userData[i].ringThan =
          _ringThan === '' || _ringThan == '0' || isNaN(_ringThan)
            ? 0
            : parseInt(_ringThan * 10000) / 100

        _this.userCompareList[i].score = _userData[i].score
        _this.userCompareList[i].selectMonth = _dataList.scoreDetailInfo[_month].quarter
        _this.userCompareList[i].ringThan = _userData[i].ringThan
      }
      // _this.userCompareList = JSON.parse(JSON.stringify(_userData));
      // console.log(_this.userCompareList);
    },
    // 返回上级菜单
    handleGoBack() {
      this.$router.push({ path: '/performanceAnalysis' })
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
    // 排序去重
    removeDuplicated(arr) {
      let ret = [],
        end
      arr.sort()
      end = arr[0]
      ret.push(arr[0])
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] != end) {
          ret.push(arr[i])
          end = arr[i]
        }
      }
      return ret
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
    },
    // 判断缓存是否存在数据，否则请求数据
    async queryAreaData(month) {
      let _this = this,
        cacheKey = ''
      let areaIdList = [],
        dataList = [];
      let _month = month || _this.$route.query.month || 0;
      areaIdList = this.getAreaIdData().idList || []
      if (areaIdList.length === 0) return
      this.compareLoading = true
      areaIdList = this.removeDuplicated(areaIdList)
      cacheKey = areaIdList.join(';')
      // console.log(cacheKey)
      // console.log(_this.areaCache)
      if (_this.areaCache[cacheKey]) {
        // dataList = _this.areaCache[cacheKey];
        _this.initPage()
      } else {
        await getAreaDatas(
          '季度',
          {
            quarter: _month,
            typeNo: _this.regionCity == '区域' ? '1' : '2',
            organList: areaIdList,
            year: new Date().getFullYear()
          },
          response => {
            // console.log(response);
            _this.areaCache[cacheKey] = response
            // dataList = _this.areaCache[cacheKey];
            // console.log(JSON.stringify(dataList));
            _this.initPage()
          },
          (error, code) => {
            this.$message({
              type: 'error',
              message: '接口请求失败'
            })
            console.warn(error)
            this.compareLoading = false
          },
          (exception, code) => {
            console.warn(exception)
            this.$message({
              type: 'error',
              message: exception.message
            })
            this.compareLoading = false
          }
        )
      }
    },
    async queryAreaDataOne(id, month, RowId) {
      let _this = this,
        cacheKey = ''
      let areaIdList = [],
        dataList = [];
      areaIdList = this.getAreaIdData().idList || []
      if (areaIdList.length === 0) return
      this.compareLoading = true
      areaIdList = this.removeDuplicated(areaIdList)
      cacheKey = areaIdList.join(';')
      await getAreaDatas(
        '季度',
        {
          quarter: month,
          typeNo: _this.regionCity == '区域' ? '1' : '2',
          organList: id,
          year: new Date().getFullYear()
        },
        response => {
          // console.log(response);
          for (let i = 0; i < _this.areaCache[cacheKey].length; i++) {
            if (_this.areaCache[cacheKey][i].detailInfo[0].scoreDetailInfo[0].hierachyId == response[0].detailInfo[0].scoreDetailInfo[0].hierachyId) {
              _this.areaCache[cacheKey][i] = response[0]
              break
            }
          }
          // dataList = _this.areaCache[cacheKey];
          // console.log(JSON.stringify(dataList));
          _this.initPage()
        },
        (error, code) => {
          this.$message({
            type: 'error',
            message: '接口请求失败'
          })
          console.warn(error)
          this.compareLoading = false
        },
        (exception, code) => {
          console.warn(exception)
          this.$message({
            type: 'error',
            message: exception.message
          })
          this.compareLoading = false
        }
      )

    },
  },
  computed: {}
}
</script>
	<style lang="less" scoped>
.compare-wrapper {
  margin: 15px;
  .top {
    position: relative;
    margin-bottom: 10px;
    .xuanzhe {
      position: absolute;
      top: 90px;
      width: 150px;
      text-align: center;
    }
    .list_card {
      display: flex;
      justify-content: space-around;
      padding-left: 150px;
      padding-right: 80px;
      width: 100%;
      min-width: 1000px;
      box-sizing: border-box;
      text-align: left;
      .items {
        margin-bottom: 10px;
        width: 250px;
        .card_con {
          display: flex;
          justify-content: space-between;
          width: 100%;
          .items_pic {
            width: 90px;
            height: 135px;
          }
          .items_con {
            width: 100px;
            .fenshu {
              font-size: 28px;
              font-weight: bold;
            }
            p {
              margin: 3px 0;
              text-align: center;
            }
            .strong {
              margin-top: 10px;
            }
          }
        }
      }
      .area-select {
        display: inline-block;
        width: 250px;
        margin: 10px;
        overflow: inherit;
        .title {
          font-size: 14px;
        }
        .compare-info {
          margin: 45px auto;
          .el-form-item__content {
            margin: 0;
          }
          .compare-select {
            width: 100%;
            margin: 10px 0;
          }
        }
      }
    }
  }
  .compare_table {
    width: 100%;
    height: auto;
    .red {
      color: red;
    }
  }
  .page-list {
    line-height: 100px;
    width: 100%;
    height: 100px;
    text-align: center;
    .el-button {
      display: inline-block;
    }
  }
}
</style>
	<style>
.area-select .el-card__header {
  padding: 5px 20px;
}
</style>