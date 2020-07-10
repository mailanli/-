<template >
  <el-table-column align="center" :label="itemData.name" min-width="150">
    <template v-for="stData in itemData.children">
      <el-table-column v-if="(stData.children.length===0&&stData.fixed!='')" align="center" :prop="stData.prop" :label="stData.name" :fixed="stData.fixed" min-width="150">
        <template slot-scope="scope">
          <!-- <el-input size="mini" v-if="itemUpdata && stData.canUpdata" @change="tableItemChange(scope.$index,[stData.prop],scope.row[stData.prop])"  v-model="scope.row[stData.prop]" placeholder="请输入内容" type="number"></el-input> -->
          <div v-if="itemUpdata && stData.canUpdata">
            <el-input size="mini" v-if="itemUpdata && stData.canUpdata"  v-model="scope.row[stData.prop]" placeholder="请输入内容" type="number"></el-input>
            <el-select v-else size="mini" v-model="scope.row[stData.prop]" placeholder="请选择">
              <template v-if="stData.txtType=='checkbox'">
                <el-option v-for="item in tabData['tableCheckList']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </template>
              <template v-else-if="stData.txtType=='text'">
                <el-option v-for="item in tabData['tableCheckList']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </template>
            </el-select>
          </div>
          <span v-else>{{scope.row[stData.prop]|roundedUp(stData)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-else-if="(stData.children.length===0)" align="center" :prop="stData.prop" :label="stData.name" min-width="150">
        <template slot-scope="scope">
          <div v-if="itemUpdata && stData.canUpdata">
            <el-input size="mini" v-if="stData.txtType=='number'" v-model="scope.row[stData.prop]" placeholder="请输入内容" type="number"></el-input>
            <el-select v-else size="mini" v-model="scope.row[stData.prop]" placeholder="请选择">
              <template v-if="stData.txtType=='checkbox'">
                <el-option v-for="item in tabData['tableCheckList']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </template>
              <template v-else-if="stData.txtType=='text'">
                <el-option v-for="item in tabData['tableCheckList']" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </template>
            </el-select>
          </div>
          <span v-else>{{scope.row[stData.prop]|roundedUp(stData)}}</span>
        </template>
      </el-table-column>
      <recursion-b v-else :itemData="stData" :itemUpdata="itemUpdata" @dataToTable="dealTable"></recursion-b>
    </template>
  </el-table-column>
</template>

<script>
export default {
  data() {
    return {
      tabData: {
        tableCheckList: [{ value: 1, label: '是' }, { value: 0, label: '否' }], //表格内容选项 是|否
        tableTxtList: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' }
        ] //表格内容方正选项  A|B|C
      }
    }
  },
  props: {
    itemData: Object,
    itemUpdata: Boolean
  },
  beforeCreate: function() {
    this.$options.components.RecursionB = require('./table-recursionB.vue')
  },
  watch: {},
  created() {},
  mounted() {},
  filters: {
    roundedUp: function(data, itemJson) {
      // var regNum = /^-?[1-9]*(\.\d*)?$|^-?0(\.\d*)?$/;
      let regNum = /^-?\d+(\.\d+)?$/
      let { txtType, unit, name } = { ...itemJson }
      // let txtType = json.txtType;  //输入框类型
      // let unit = json.unit;  //单位
      if (!regNum.test(data) || data === '') {
        return data || ''
      }
      // let IsCheck = key.toString().indexOf("isCheck") >= 0 || key.toString().indexOf("is_check") >= 0;
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
    }
  },
  methods: {
    tableItemChange(a, b, c) {
      let json = {}
      json['row'] = a
      json['key'] = b
      json['val'] = c
      this.$emit('dataToTable', json)
      // console.log('tableItemChange',a,b,c);
    },
    dealTable(json) {
      this.$emit('dataToTable', json)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
