<template>
  <!-- 指标管理 -->
  <div class="qm-table-wrapper reset-element">
    <!-- 指标管理: 内容区域 -->
    <div class="table-contant reset-input" v-loading="PageManage['loading']">
      <header>
        <!-- 提示语 -->
        <div class="tip-panel">
          <h5 class="tip-title">当前状态</h5>
          <!-- <label>当前状态</label> -->
          <div class="tip-panel-success" v-if="PageManage['pageVacancy'] == 0">
            <span class="tip-success">正常</span>
            <i class="tip-success  el-icon-success"></i>
          </div>
          <div class="tip-panel-warn" v-else>
            <span class="tip-warn">欠缺</span>
            <el-tooltip class="item" effect="dark" :content="PageManage['pageTip']" placement="bottom">
              <span class="tip-warn-icon">{{PageManage['pageVacancy']}}</span>
            </el-tooltip>
          </div>
        </div>
        <!-- 表格顶部:按钮操作 开始-->
        <div class="table-btn-group clearfix">
          <!-- 解锁状态: 可以编辑 -->
          <div class="lockbtn-content" v-if="tabData.tableUnlock">
            <el-button size="medium" @click="handleTableSave" :disabled="!PageAuthority['write']">保存</el-button>
            <el-button type="primary" class="lock-btn" size="medium" @click="handleTableLock" :disabled="!PageAuthority['lock']">锁定</el-button>
          </div>
          <!-- 锁定状态: 不可编辑 -->
          <div class="lockbtn-content" v-else>
            <el-button class="lock-btn" size="medium" @click="handleTableLock" :disabled="!PageAuthority['unLock']">解锁</el-button>
          </div>
          <el-button type="primary" class="calculation-btn" size="medium">自动计算</el-button>
        </div>
        <!-- 表格顶部:按钮操作 结束 -->
      </header>
      <!-- 指标管理: 表格区域 -->
      <el-table :data="tabData.tableData" border style="width: 100%; margin-top: 20px">
        <!-- 第一层:开始 -->
        <template v-for="(itemData) in tabData['tableHeader']">
          <!-- 有子标题头的情况: 使用递归继续生产 -->
          <recursionA v-if="itemData.children.length!==0" :itemData="itemData" :itemUpdata="itemEditable" @dataToTable="dealTable" :key="itemData.prop"></recursionA>
          <!-- 没有子标题头的情况且 需要冻结标题头  -->
          <el-table-column v-else-if="(itemData.fixed!='')" align="center" :label="itemData.name" :fixed="itemData.fixed" :key="itemData.prop" min-width="150">
            <template slot-scope="scope">
              <!-- <el-input size="mini" v-if="itemEditable && itemData.canUpdata"  v-model="scope.row[itemData.prop]" placeholder="请输入内容" type="number"></el-input> -->
              <div v-if="itemEditable && itemData.canUpdata">
                <el-input size="mini" v-if="itemData.txtType=='number'" v-model="scope.row[itemData.prop]" placeholder="请输入内容" type="number"></el-input>
                <el-select v-else size="mini" v-model="scope.row[itemData.prop]" placeholder="请选择">
                  <template v-if="itemData.txtType=='checkbox'">
                    <el-option v-for="item in tabData['tableCheckList']" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </template>
                  <template v-else-if="itemData.txtType=='text'">
                    <el-option v-for="item in  tabData['tableTxtList']" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </template>
                </el-select>
              </div>
              <span v-else>{{scope.row[itemData.prop]|roundedUp(itemData)}}</span>
            </template>
          </el-table-column>
          <!-- 没有子标题头的情况且 不需要冻结标题头  -->
          <el-table-column v-else align="center" :label="itemData.name" :key="itemData.prop" min-width="150">
            <template slot-scope="scope">
              <div v-if="itemEditable && itemData.canUpdata">
                <el-input size="mini" v-if="itemData.txtType=='number'" v-model="scope.row[itemData.prop]" placeholder="请输入内容" type="number"></el-input>
                <el-select v-else size="mini" v-model="scope.row[itemData.prop]" placeholder="请选择">
                  <template v-if="itemData.txtType=='checkbox'">
                    <el-option v-for="item in tabData['tableCheckList']" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </template>
                  <template v-else-if="itemData.txtType=='text'">
                    <el-option v-for="item in tabData['tableTxtList']" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </template>
                </el-select>
              </div>
              <span v-else>{{scope.row[itemData.prop]|roundedUp(itemData)}}</span>
            </template>
          </el-table-column>
        </template>
        <!-- 第一层:结束 -->
      </el-table>
      <!-- 分页:开始 -->
      <div class="pagination-wrapper">
        <el-pagination @current-change="handleCurrentChange" :total="PageManage['pageTotal']" :page-size="PageManage['pageSize']" :current-page="PageManage['pageCurr']" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 分页:结束 -->
    </div>
    <!-- </el-card> -->
  </div>
</template>

<script>
import {
  PageTableManage,
  PageDataManage,
  PageLinkApiManage,
  PageRequestManage,
  PageNotAssessment,
  updateUpdataType
} from '../common/quota-entry.js'
import { monthList } from '../common/muck.js'
import { quotaMonthApiManage, getElementByType } from '@/api/performance'
import recursionA from '../common/table-recursionA'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      PageManage: {
        pageTotal: 0, //页面表格总数
        pageSize: 10, //页面展示条数
        pageCurr: 1, //当前页码
        pageIsChange: false, //页面是否值改变过
        pageTip: '', //页面提示空缺填写的区域数目&项目名
        pageVacancy: 0, //页面空缺填写的区域数目
        loading: false //是否loading
      },
      PageAuthority: {
        read: Boolean, //查询(false:表示无权;true:表示有权)
        write: Boolean, //保存/导入(false:表示无权;true:表示有权)
        unLock: Boolean, //解锁(false:表示无权;true:表示有权)
        lock: Boolean, //锁定(false:表示无权;true:表示有权)
        lockStatus: Boolean //锁定状态，false，表示非锁定，true表示锁定
      },
      PageStatus: {
        GET_STATUS: 1, //权限获取   1表示获取权限
        SAVE_STATUS: 2, //保存锁的状态  2表示保存
        LOCK: 1, //锁定
        UNLOCK: 0, //解锁
        UNKNOW: -1 //权限获取的时候丢-1; 保存接口的时候: 1为锁定,0为解锁;
      },
      // 表数据
      tabData: {
        tableUnlock: true, // 表格是否解锁 true|false; true为解锁
        tableHeader: [], // 表头样式数据
        tableData: [], // 表格数据
        tableUnitJson: [], //表格列 单位列表
        tableCheckList: [{ value: 1, label: '是' }, { value: 0, label: '否' }], //表格内容选项 是|否
        tableTxtList: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' }
        ] //表格内容方正选项  A|B|C
      },
      ApiData: {
        apiLinkTable: {}, //获取对照表
        apiRequestData: [], // 获取填写的Key值
        apiNotAssessment: [] // 获取页面会出现不考核的key值
      }
    }
  },
  props: {
    PageHeadManage: {
      pageCity: String, //当前类型
      pageYear: String, //当前年份
      pageQuarter: String, //当前季度
      pageType: String, //页面主入口
      pageMonth: String, //当前月份
      pageIsManual: Boolean, //页面是否手工录入
      quartMonth: '' //季度/月度
    },
    PageOption: {
      pageTypeList: Array //当前类型
    },
    currentRouter: '' //当前根路由
  },
  watch: {
    'PageHeadManage.quartMonth': function(quartMonth, oldVal) {
      if (quartMonth == '月度') {
        this.$router.replace('/dataMonthUpload')
      } else {
        this.$router.replace('/dataUpload')
      }
    },
    'PageHeadManage.pageCity': function(pageCity, oldVal) {
      this.PageHeadManage['pageType'] = '' //清空指标数据
      if (pageCity)
        this.getPageStatusAjax(
          this.PageStatus['GET_STATUS'],
          this.PageStatus['UNKNOW']
        )
      switch (pageCity) {
        case '区域':
           this.getElementByType('1','month')
          break
        case '城市公司':
          this.getElementByType('2')
          break
      }
    },
    'PageHeadManage.pageType': function(pageTypeVal, oldVal) {
      let _pageMonth = this.PageHeadManage['pageMonth']
      //--------------- 清空表格操作:开始-----getPageStatusAjax----------
      this.PageManage['pageCurr'] = 1
      this.PageManage['pageTotal'] = 0
      this.tabData['tableData'] = []
      // ---------------清空表格操作:结束---------------
      this.initTable(pageTypeVal, '', _pageMonth) //初始化表格
      //testtesttesttesttesttesttesttesttesttesttesttest
      // this.tabData['tableData'] = this.dataToTabel(PageDataManage(pageTypeVal))
      //testtesttesttesttesttesttesttesttesttesttesttest
      this.getPageStatusAjax(
        this.PageStatus['GET_STATUS'],
        this.PageStatus['UNKNOW']
      )
    },
    'PageHeadManage.pageYear': function(data) {
      if (data)
        this.getPageStatusAjax(
          this.PageStatus['GET_STATUS'],
          this.PageStatus['UNKNOW']
        )
    },
    'PageHeadManage.pageMonth': function(pageMonthVal, oldVal) {
      let pageTypeVal = this.PageHeadManage['pageType']
      if (pageTypeVal) {
        this.initTable(pageTypeVal, '', pageMonthVal) //初始化表格
      }
      this.getPageStatusAjax(
        this.PageStatus['GET_STATUS'],
        this.PageStatus['UNKNOW']
      )
    },
    'PageHeadManage.pageIsManual': function(data) {
      if (data) this.getPageDataAjax()
    }
  },
  created() {},
  mounted() {},
  filters: {
    roundedUp: function(data, itemJson) {
      // var regNum = /^-?[1-9]*(\.\d*)?$|^-?0(\.\d*)?$/;
      let regNum = /^-?\d+(\.\d+)?$/
      let {
        txtType, //输入框类型
        unit, //单位
        name //名称
      } = { ...itemJson }
      if (!regNum.test(data) || data === '') {
        return data || ''
      }
      if (txtType === 'checkbox') {
        data = data == 1 ? '是' : '否'
      } else if (txtType === 'number') {
        data = parseFloat(data)
        data = name == '入室盗窃案案发率' ? data.toFixed(3) : data.toFixed(2)
      }
      if (unit === 'percent') {
        data = data + '%'
      }
      return data
    },
    // 过滤输入值为负数的 dataList为所有输入框的key列表
    isMinus(data, type) {
      if (data.toString().indexOf('-1') >= 0) {
        // if(type === "填写值"){ return '';}
        // else{return '/';}
        return ''
      } else {
        return data
      }
    },
    // 过滤值为 null 和 undefined 的
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
    // 过滤值为 % 号的
    isPercent(data, _percent) {
      if (_percent) {
        data = data.split('%')[0]
        data = parseInt(data) / 100
      }
      return data
    },
    // 过滤值为 纯数字的, 类型String转为Interger
    isNumber(data, key) {
      // const regInt = /^\d+$/gm;// 整数的正则
      const regFloat = /^-?\d+(\.\d+)?$/ // 浮点数的正则
      if (regFloat.test(data) && key !== 'hierarchyId') {
        data = parseFloat(data)
      }
      return data
    }
  },
  computed: {
    ...mapState(['sysUserInfo']),
    // 表格中的输入框是否可以可编辑
    itemEditable() {
      // 有录入权限 以及表格是解锁的才能 进行录入
      if (this.PageAuthority['write'] && this.tabData['tableUnlock']) {
        // console.log('有录入权限'+this.PageAuthority['write'])
        // console.log('解锁的才能 '+this.tabData['tableUnlock'])
        return true
      } else {
        return false
      }
    }
  },
  components: {
    recursionA
  },
  methods: {
    // 初始化表格
    initTable(pageTypeVal, pageQuarterVal, pageMonth) {
      this.tabData['tableHeader'] = PageTableManage(
        // 获取表格头部样式
        '',
        pageTypeVal,
        pageQuarterVal,
        pageMonth
      )
      this.tabData['tableUnitJson'] = this.getTableUnitJson(
        //获取表头单元列
        this.tabData['tableHeader'],
        new Object()
      )
      this.ApiData['apiLinkTable'] = PageLinkApiManage(
        '',
        pageTypeVal,
        pageQuarterVal,
        pageMonth
      ) //获取对照表
      this.ApiData['apiRequestData'] = PageRequestManage(
        '',
        pageTypeVal,
        pageQuarterVal,
        pageMonth
      ) // 获取填写的Key值
      this.ApiData['apiNotAssessment'] = PageNotAssessment(
        '',
        pageTypeVal,
        pageQuarterVal,
        pageMonth
      ) // 获取页面会出现不考核的key值
    },
    // 获取表格数据接口
    async getPageDataAjax() {
      let PageManage = this.PageManage,
        PageAuthority = this.PageAuthority

      let { pageSize, pageCurr } = { ...this.PageManage }
      let { pageCity, pageYear, pageMonth, pageType, pageIsManual } = {
        ...this.PageHeadManage
      }
      if (!PageAuthority['read']) {
        return false
      }
      if (!pageYear || !pageType || !pageMonth || !pageIsManual || !pageCity)
        return false
      pageYear = new Date(pageYear).getFullYear()
      this.PageManage['loading'] = true
      await quotaMonthApiManage(
        pageCity,
        '表格查询',
        {
          elementId: pageType,
          pageSize,
          pageCurr,
          month: pageMonth,
          year: pageYear
        },
        response => {
          // console.log('获取数据成功')
          // console.log(response)
          let vacancyAreaList = [],
            vacancyTxt = ''
          this.PageManage['loading'] = false
          this.apiTabelData = response['list'] || []
          this.PageManage['pageTotal'] = response['totalPage'] || 0
          this.PageManage['pageVacancy'] = response['vacancy'] || 0 //欠缺填写的区域数量
          vacancyAreaList = response['vacancyHierarchyName'] || [] //欠缺填写的区域名称列表
          for (let i = 0; vacancyAreaList[i] && i < 5; i++) {
            vacancyTxt += '["' + vacancyAreaList[i] + '"],'
          }
          if (vacancyAreaList.length > 5) {
            vacancyTxt.replace(/\,$/, '')
            vacancyTxt += '...'
          }
          this.PageManage['pageTip'] = vacancyTxt
          this.tabData['tableData'] = this.undataToTabel(this.apiTabelData)
          this.$message({ type: 'success', message: '数据获取成功' })
        },
        (error, code) => {
          this.PageManage['loading'] = false
          this.$message({ type: 'error', message: '接口请求失败' })
          console.warn(error)
        },
        (exception, code) => {
          this.PageManage['loading'] = false
          this.$message({ type: 'error', message: exception.message })
          //////////////////////////////////////////////////test//////////////////////////////
          let response = monthList
          let vacancyAreaList = [],
            vacancyTxt = ''
          this.PageManage['loading'] = false
          this.apiTabelData = response['list'] || []
          this.PageManage['pageTotal'] = response['totalPage'] || 0
          this.PageManage['pageVacancy'] = response['vacancy'] || 0 //欠缺填写的区域数量
          vacancyAreaList = response['vacancyHierarchyName'] || [] //欠缺填写的区域名称列表
          for (let i = 0; vacancyAreaList[i] && i < 5; i++) {
            vacancyTxt += '["' + vacancyAreaList[i] + '"],'
          }
          if (vacancyAreaList.length > 5) {
            vacancyTxt.replace(/\,$/, '')
            vacancyTxt += '...'
          }
          this.PageManage['pageTip'] = vacancyTxt
          this.tabData['tableData'] = this.undataToTabel(this.apiTabelData)
          // debugger;
          // console.log(JSON.stringify(this.apiTabelData))

          // console.log(this.tabData['tableData'])
          //////////////////////////////////////////////////test//////////////////////////////
        }
      )
    },
    // 表格保存数据接口
    async getTableSaveAjax(rowNum, data) {
      let pageType = this.PageHeadManage['pageType']
      let pageCity = this.PageHeadManage['pageCity']
      this.PageManage['loading'] = true
      // 数据请求
      await quotaMonthApiManage(
        pageCity,
        '表格保存',
        data,
        response => {
          let List = this.dataKeyType('列表', response) ? response['list'] : []
          this.PageManage['loading'] = false
          if (Array.isArray(List) && List.length > 0) {
            this.PageManage['pageIsChange'] = false
            List = this.undataToTabel(List)
            this.tableItemReset(rowNum, List)
            this.$message({ type: 'success', message: '保存成功' })
          } else {
            this.$message({ type: 'error', message: response })
            return false
          }
        },
        (error, code) => {
          this.PageManage['loading'] = false
          this.$message({ type: 'error', message: '接口请求失败' })
          console.warn(error)
        },
        (exception, code) => {
          /////////////////////////////////////test///////////////////////////////////
          this.PageManage['loading'] = false
          console.error(exception)
          this.$message({ type: 'error', message: exception.message })
        }
      )
    },
    //获取权限状态接口
    async getPageStatusAjax(apiType, lockStatus) {
      let PageHeadManage = this.PageHeadManage
      let { pageYear, pageMonth, pageType, pageCity } = {
        ...this.PageHeadManage
      }
      let { GET_STATUS, UNKNOW, LOCK, UNLOCK } = { ...this.PageStatus }
      if (!pageYear || !pageType || !pageMonth || !pageCity) return false
      console.log('权限状态 接口:getPageStatusAjax')
      pageYear = new Date(pageYear).getFullYear()
      await quotaMonthApiManage(
        pageCity,
        '表格权限',
        {
          elementId: pageType,
          year: pageYear,
          handle: apiType,
          month: pageMonth,
          lockStatus: lockStatus
        },
        response => {
          let data = response
          if (data && JSON.stringify(data) !== '{}') {
            this.PageAuthority['read'] = !!(data['couldRead'] == 1) //查询(0:表示无权;1:表示有权)
            this.PageAuthority['lock'] = !!(data['couldLock'] == 1) //锁定(0:表示无权;1:表示有权)
            this.PageAuthority['unLock'] = !!(data['couldUnLock'] == 1) //解锁(0:表示无权;1:表示有权)
            this.PageAuthority['write'] = !!(data['couldWrite'] == 1) //保存/导入(0:表示无权;1:表示有权)
            this.PageAuthority['lockStatus'] = !!(data['lockStatus'] == 1) //锁定状态，0，表示非锁定，1表示锁定
            console.log(
              '解锁权限:',
              this.PageAuthority['unLock'],
              '锁定权限:',
              this.PageAuthority['lock'],
              '查询权限:',
              this.PageAuthority['read'],
              '录入权限:',
              this.PageAuthority['write'],
              '是否锁定:',
              this.PageAuthority['lockStatus']
            )
          }
          if (this.PageAuthority['read']) {
            this.getPageDataAjax()
          } else {
            this.tabData['tableData'] = []
            this.PageManage['pageCurr'] = 1
            this.PageManage['pageTotal'] = 0
          }
          this.tabData['tableUnlock'] = !this.PageAuthority['lockStatus']
          // this.tabData["tableUnlock"] = true;
          this.$emit('pageAuthorityHandle', this.PageAuthority)
        },
        (error, code) => {
          this.$message({ type: 'error', message: '权限接口请求失败' })
          console.warn(error)
        },
        (exception, code) => {
          this.$message({ type: 'error', message: exception.message })
          console.error(exception)
        }
      )
    },
    // 子组件修改丢过来的值  暂时不需要
    dealTable(dataJson) {
      this.PageManage['pageIsChange'] = true
    },
    // 锁定/解锁 函数处理
    handleTableLock() {
      const _pageManage = this.PageManage,
        thisStatus = this.tabData['tableUnlock'] //当前是否解锁  true 为解锁 | false 为锁定
      const { lock: lockAuthority, unLock: unLockAuthority } = {
        ...this.PageAuthority
      } //锁的权限
      const { LOCK, UNLOCK } = { ...this.PageStatus }

      if (thisStatus && !lockAuthority) {
        console.log('当前状态是解锁,想要锁定且没有锁定权限')
        return false
      } else if (!thisStatus && !unLockAuthority) {
        console.log('当前状态是锁定,想要解锁且没有解锁权限')
        return false
      }
      if (_pageManage['pageIsChange'] == true && thisStatus)
        this.$message({ message: '值已改变 注意保存', type: 'warning' })

      if (thisStatus) {
        this.$confirm('是否确定锁定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.getPageStatusAjax(this.PageStatus['SAVE_STATUS'], UNLOCK)
          })
          .catch(() => {})
      } else {
        this.getPageStatusAjax(this.PageStatus['SAVE_STATUS'], LOCK)
      }
    },
    handleTableSave() {
      if (!this.PageAuthority['write']) {
        //录入权限
        this.$message({ type: 'error', message: '抱歉!权限不足' })
        return false
      }
      let List = []
      let tableData, rowJson
      let allTableList = this.tabData['tableData'] || []
      if (allTableList.length === 0) return false
      for (let i = 0; (rowJson = allTableList[i]); i++) {
        if (rowJson.hasOwnProperty('sqzn_sqlr_complete')) {
          if (
            rowJson['sqzn_sqlr_complete'] != 0 ||
            rowJson['sqzn_sqlr_complete'] != 1
          ) {
            this.$message({ type: 'error', message: '请选择税前利润是否达标' })
            return false
          }
        }
        rowJson = this.tableRowDeal(rowJson, '接口')
        rowJson = this.dataConverter(rowJson, '接口')
        List.push(rowJson)
      }
      console.log('开始调用保存接口了', List)
      this.getTableSaveAjax('全部', List)
    },
    // 分页函数处理
    handleCurrentChange(val) {
      this.PageManage['pageCurr'] = val
      this.getPageDataAjax()
    },
    /*  重渲染|回显数据 第二个接口计算 回调数据
          @param  row: 当前需要渲染的行数 | 全部 List: 渲染的数据    */
    tableItemReset(saveType, dataList) {
      let allTableList = this.tabData['tableData']
      let rowJson, apiJson
      let areaKey, dataKey, q
      // 获取到区域的key值
      for (areaKey in dataList[0]) {
        areaKey = this.dataKeyType('表格区域', areaKey)
        if (areaKey) {
          break
        }
      }
      for (let i = 0; (rowJson = allTableList[i]); i++) {
        q = dataList.length
        while (q--) {
          apiJson = dataList[q]
          if (areaKey && rowJson[areaKey] === apiJson[areaKey]) {
            for (let key in rowJson) {
              if (apiJson[key] === rowJson[key]) continue
              this.$set(rowJson, key, apiJson[key])
            }
            dataList.splice(q, 1)
          }
        }
      }
    },
    /*  将接口请求获取到的数据 转换表格所需要的格式数据
          接口请求获取到的数据 的key值跟页面不对应，需要使用转换器 this.dataConverter()
          @param  apiAllList 接口请求到的数据
          */
    dataToTabel(apiAllList) {
      // debugger;
      // console.log(JSON.stringify(apiAllList))
      let tableData = [], //表格展示的数据
        rowJson = {}
      for (let i = 0, apiItem; (apiItem = apiAllList[i]); i++) {
        rowJson = this.dataConverter(apiItem, '表格')
        rowJson = this.tableRowDeal(rowJson, '表格')
        tableData.push(rowJson)
      }
      return tableData
    },
    //直接使用后台的key填充prop，dataToTabel方法引起子集转换不成功
    undataToTabel(apiAllList) {
      // debugger;
      // console.log(JSON.stringify(apiAllList))
      let tableData = [], //表格展示的数据
        rowJson = {}
      for (let i = 0, apiItem; (apiItem = apiAllList[i]); i++) {
        rowJson = this.tableRowDeal(apiItem, '表格')
        tableData.push(rowJson)
      }
      return tableData
    },
    /* key值映射表 进行表格与api请求数据的格式转换  example: 表格需要的是 bgkey1 ,返回来是key,则将之转为bgkey1
         @param keyType 值为'表格'时,说明key值需要转成表格展示需要的key,反之相反
         rpKey JSON需要替换的key值;reVal 替换成想要的key值   */
    dataConverter(rowJson, keyType) {
      //  console.log(rowJson)
      let dataLink,
        returnJson = {},
        rpKey,
        rpVal,
        rpTxt
      rpTxt = JSON.stringify(rowJson)
      dataLink = this.ApiData['apiLinkTable'] //接口请求数据跟表格对照
      let areaName, prjName
      //循环替换key值
      for (let key in dataLink) {
        prjName = prjName ? prjName : this.dataKeyType('表格项目', key)
        areaName = areaName ? areaName : this.dataKeyType('表格区域', key)

        keyType === '表格'
          ? ((rpKey = dataLink[key]), (rpVal = key))
          : ((rpKey = key), (rpVal = dataLink[key]))
        rpTxt = rpTxt.replace(new RegExp(rpKey, 'gm'), rpVal) //注意问题出现集中点
      }
      returnJson = JSON.parse(rpTxt)
      returnJson[prjName] = returnJson[areaName]
      return returnJson
    },
    /* 单位转换器,如果是要显示百分比,先 x100,保存的时候返回后台再 除于100
         @param keyType 值为'表格'时,说明key值需要转成表格展示需要的key,反之相反*/
    unitConverter(data, key, keyType) {
      let unitJson = this.tabData['tableUnitJson']
      let regNum = /^-?\d+(\.\d+)?$/
      if (regNum.test(data) && unitJson[key] === 'percent') {
        data = keyType === '表格' ? data * 100 : data / 100
        // let _firKey = key.split('_')[0];
        // data = (key == 'rhdq_af_rate')?data.toFixed(3):(_firKey == 'xyz'||_firKey == 'wyfw'||_firKey == 'wyqf') ? data : data.toFixed(2);//保留两位小数 如果是 入室盗窃案案发率, 保留三位小数
      }
      return data
    },
    /*  表行: 数据处理    对数据进行 过滤|处理
          @param  tableRow: 当前表格行数据*/
    tableRowDeal(rowJson, keyType) {
      let FilterRule = this.$options.filters
      let data,
        rqsList = this.ApiData['apiRequestData'] || [],
        notAssList = this.ApiData['apiNotAssessment'] || []
      for (let key in rowJson) {
        data = rowJson[key]
        data = FilterRule['isNull'](data) //过滤'null'和'undefined'
        data = FilterRule['isNumber'](data, key) //过滤值为正整数
        data = FilterRule['isPercent'](data, this.dataKeyType('百分比', data)) //过滤有%的数据
        data = this.unitConverter(data, key, keyType)
        for (let i = 0, rqsItem; (rqsItem = rqsList[i]); i++) {
          if (key == rqsItem) {
            data = FilterRule['isMinus'](data, '填写值') //过滤输入值为负数的
            break
          }
        }
        for (let i = 0, notAssItem; (notAssItem = notAssList[i]); i++) {
          if (key == notAssItem) {
            data = FilterRule['isMinus'](data, '考核值') //过滤输入值为负数的
            break
          }
        }
        rowJson[key] = data
      }
      return rowJson
    },
    /*  表行: 数据处理
          @param  tableRow: 当前表格行数据*/
    dataKeyType(keyType, data) {
      let returnData = false
      switch (keyType) {
        case '表格区域': //返回表格的区域Key值
          if (data.toString().indexOf('areaName') >= 0) {
            returnData = data
          }
          break
        case '表格项目':
          if (data.toString().indexOf('prjName') >= 0) {
            returnData = data
          }
          break
        case '百分比':
          if (data.toString().indexOf('%') >= 0) {
            returnData = data
          }
          break
        case '列表': //是否有表格list键
          if (data.hasOwnProperty('list')) {
            returnData = data
          }
          break
      }
      return returnData
    },
    // 获取表头单元列
    getTableUnitJson(apiList, unitJson) {
      apiList = apiList || []
      let prop, unit, children
      for (let i = 0, apiItem; (apiItem = apiList[i]); i++) {
        prop = apiItem['prop']
        unit = apiItem['unit']
        children = apiItem['children'] || []
        if (unitJson[prop]) {
          continue
        }
        if (children.length > 0) {
          this.getTableUnitJson(children, unitJson)
        } else {
          unitJson[prop] = unit
        }
      }
      return unitJson
    },
    // 暂时不需要: 原先获取配置好的项目权限代码,现改为接口获取权限
    // getSysUserInfo(){
    //   if(this.sysUserInfo!= undefined && this.sysUserInfo!= null ){
    //     console.log('sysUserInfo',this.sysUserInfo);
    //     let _userFunctions = this.sysUserInfo.userFunctions||[];
    //     /*返回 绩效指标审核录入 权限的数组
    //           绩效指标审核录入: 可锁定|可录入|不可解锁*/
    //     let quotaInput = _userFunctions.filter((item)=>{return item.code == "performance_quota_input";})||[];
    //     /*返回 绩效指标审核权限 权限的数组
    //           绩效指标审核权限: 可解锁|可锁定|可录入*/
    //     let quotaAuthority = _userFunctions.filter((item)=>{return item.code == "performance_quota_authority";})||[];
    //     console.log('当前用户权限:');
    //     if(quotaInput.length>0||quotaAuthority.length>0){
    //       console.log('--------录入数据权限')
    //       this.PageManage['inputAuthority'] = true;  //可录入数据权限
    //     }else{
    //       this.PageManage['inputAuthority'] = false;
    //     }
    //     if(quotaAuthority.length>0){
    //       console.log('--------解锁表格权限');
    //       this.PageManage['deblocking'] = true; //是否可以解锁|true表格可以解锁
    //     }else{
    //       this.PageManage['deblocking'] = false;
    //     }
    //       this.PageManage['inputAuthority'] = true;
    //       this.PageManage['deblocking'] = true;
    //   }
    // }
    async getElementByType(type,month) {
      await getElementByType(
        {
          typeNo: type
        },
        response => {
          this.PageOption['pageTypeList'] = updateUpdataType(
            response,month
          )
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
    }
  }
}
</script>

<style lang="less" scoped>
.qm-table-wrapper {
  margin: 15px;
  .table-contant {
    .tip-panel,
    .tip-panel-success,
    .tip-panel-warn {
      display: inline-block;
      padding: 10px;
      font-size: 14px;
      .tip-title {
        display: inline-block;
        font-weight: 500;
        font-size: 14px;
      }
      .tip-success {
        color: #67c23a;
      }
      .tip-warn {
        color: #f56c6c;
      }
      // 提示语图标
      .tip-warn-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        border-radius: 50%;
        background: #f56c6c;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
    .el-form,
    .el-form-item,
    .datePanel {
      display: inline-block;
    }
    .table-btn-group {
      float: right;
      text-align: right;
      margin-bottom: 15px;
      .lockbtn-content {
        display: inline-block;
      }
    }
    .pagination-wrapper {
      margin: 10px;
      text-align: right;
    }
  }
}
</style>
