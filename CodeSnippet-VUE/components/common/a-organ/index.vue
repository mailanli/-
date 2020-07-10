<template>
  <a-dialog 
    :title="title" 
    v-model="isShow" 
    :close-on-click-modal="false" 
    dialogWidth="750px"
    @input="beforeClose"
    append-to-body
    :toolbar="toolbar"
  >
  <div class="organ_content">
    <div class="standby_organ">
      <div class="standby_title">
        人员库<span>(通过下面的条件检索您所需的人员)</span>
      </div>
      <div class="standby_tree" style="padding:5px 3px;">
        <el-tabs v-model="selectType">
          <el-tab-pane label="组织" name="组织">
            <el-input placeholder="请输入内容" v-model="searchOrgan" size="mini" @keydown.native.enter.prevent="searchOrganFnc">
              <el-button slot="append" icon="el-icon-search" @click="searchOrganFnc"></el-button>
            </el-input>
            <div v-show="!showOrganSearch" class="organ_tree" v-loading="treeLoading" element-loading-text="组织树加载中...">
              <el-tree
                show-checkbox
                @check-change="handleCheckChange"
                class="filter-tree"
                ref="tree"
                :props="defaultProps"
                node-key="id"
                :expand-on-click-node="false"
                lazy
                :load="loadNode"
                :default-expanded-keys="selectArr"
                :default-checked-keys="selectArr"
              >
              </el-tree>
            </div> 
            <div class="organ_search" v-show="showOrganSearch">
              <!-- <el-button type="text" @click="backOrganTree()">返回组织树</el-button> -->
              <div 
                v-for="(item, index) in searchOrganList"
                :class="[{ 'item_selected': item.check }, 'list_cont']"  
                :key="index"
                @click="toggleSelect(index, searchOrganList)"
              >
                {{item.unitName}}
              </div>
            </div>          
          </el-tab-pane>
          <el-tab-pane label="员工" name="员工" v-if="hideEmployee">
            <div>
                <el-radio v-model="importType" label="1">编号导入</el-radio>
                <el-radio v-model="importType" label="2">账号导入</el-radio>
                <el-radio v-model="importType" label="3">搜索</el-radio>
            </div>
            <div class="import_type" v-if="importType === '1'">
              <p style="font-size:12px;color:b3b3b3;margin-bottom:8px;padding-left:10px;">
                填写员工编号导入（或UM号），每行1条，<br/>
                单次最多粘贴1000行。示例:<br/>
                zhangsanfeng001<br/>
                BXZ100891<br/>
              </p>
              <el-input rows="10" type="textarea" v-model="employeeCodes"></el-input>
            </div>
            <div class="import_type" v-if="importType === '2'">
              <p style="font-size:12px;color:b3b3b3;margin-bottom:8px;padding-left:10px;">
                填写员工手机号或邮箱导入，每行一条，<br/>
                单次可以粘贴1000行。示例:<br/>
                13545065123<br/>
                xxx@pingan.com<br/>
              </p>
              <el-input rows="10" type="textarea" v-model="phoneOrEmails"></el-input>
            </div>
            <div class="import_type" v-if="importType === '3'">
              <el-input placeholder="请输入内容" v-model="searchEmpWord" size="mini" @keydown.native.enter.prevent="searchEmployee">
                <el-button slot="append" icon="el-icon-search" @click="searchEmployee"></el-button>
              </el-input>
              <div style="height:220px;margin-top:8px;overflow-y:auto;">
                <div 
                  v-for="(item, index) in searchList"
                  :class="[{ 'item_selected': item.check }, 'list_cont']"  
                  :key="index"
                  @click="toggleSelect(index, searchList)"
                >
                  {{item.name}}
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="oprate_btn">
      <el-button 
        style="margin-bottom: 12px;" 
        size="mini" 
        type="primary"
        @click="add()"
      >
        添加
        <i class="el-icon-d-arrow-right el-icon--right"></i>
      </el-button>
      <el-button 
        style="margin-left:0;" 
        size="mini" 
        type="primary" 
        icon="el-icon-d-arrow-left"
        @click="del()"
      >
        删除
      </el-button>
    </div>
    <div class="has_select">
      <div class="has_title">
        已选人群<span class="title-span">(多个条件叠加取并集)</span>
        <el-button type="text" @click="clearSelect()">清空</el-button>
      </div>
      <div class="has_content">
        <div v-if="selectList.organ.length">
          <div class="list_title">组织</div>
          <div 
            v-for="(item, index) in selectList.organ"
            :class="[{ 'item_selected': item.check }, 'list_cont']"  
            :key="index"
            @click="toggleSelect(index, selectList.organ)"
          >
            {{item.unitName}}
          </div>
        </div>
        <div v-if="selectList.employee.length">
          <div class="list_title">员工</div>
          <div 
            v-for="(item, index) in selectList.employee"
            :class="[{ 'item_selected': item.check }, 'list_cont']"  
            :key="index"
            @click="toggleSelect(index, selectList.employee)"
          >
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
  </div>   
  </a-dialog>
</template>
<script>

import list from './list.vue'
import req from '@/api/common.js'

export default {
  name: 'Aorgan',
  props: {
    // 弹窗显示变量
    isShow: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      typy: String,
      default: '可见人群设置'
    },
    // 是否显示员工tab
    hideEmployee: {
      type: Boolean,
      default: true
    }
  },
  components: {
    list
  },
  data () {
    return {
      toolbar: [{
        text: '取消',
        type: 'plain',
        func: (done) => {
          this.cancel(done)
        }
      },{
        text: '确认',
        func: (done) => {
          this.confirm(done)
        }
      }],
      // 员工搜索方式
      importType: '1',
      // 组织搜索关键字
      searchOrgan: '',
      // 组织搜索结果数据
      searchOrganList: [],
      // 组织查询结果显示控制
      showOrganSearch: false,
      // 员工编号关键字
      employeeCodes: '',
      // 电话和邮箱关键字
      phoneOrEmails: '',
      // 员工搜索关键字
      searchEmpWord: '',
      // 组织和员工搜索方式
      selectType: '组织',
      // 员工查询备选数据
      searchList: [
      ],
      // 组织勾选的备选数据
      organList: [],
      // 树节点加载loding
      treeLoading: true,
      // organ选择组织数据,employee选择的员工数据
      selectList: {
        organ: [

        ],
        employee: [
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'unitName',
        id:'fullUnitCode',
        isLeaf: (data, node) => {
          return !data.isClick
        }
      }
    }
  },
  computed: {
    // 已选中节点和禁用节点id
    selectArr () {
      let arr = []
      this.selectList.organ.forEach(item => {
        arr.push(item.fullUnitCode)
      })
      return arr
    }
  },
  methods: {
    beforeClose () {
      this.$emit('update:isShow', false)
    },
    // 添加时，判断是哪一种模式搜索的结果
    add () {
      if (this.selectType === '组织') {
        // 组织树选择
        if (!this.showOrganSearch) {
          if (this.organList.length > 0) {
            this.addOrgan(this.organList)
          }
          // 组织搜索选择
        } else {
          let selectSearchOrgan = this.searchOrganList.filter(item => {
            return item.check
          })
          this.addOrgan(selectSearchOrgan)
        }  
       // 员工搜索
      } else {
        switch (this.importType) {
          case '1':
          let params1 = {
            employeeCodes: this.employeeCodes.split('\n')
          }
          req('getEmployeeList', params1).then(res => {
            if (res.code == '0') {
              let searchList1 = res.data
              searchList1.forEach(item => {
                item.name += `(${item.code})`
              })
              this.addEmployee(searchList1)
            }           
          })
          break;
          case '2':
          let params2 = {
            phoneOrEmails: this.phoneOrEmails.split('\n')
          }
          req('getEmployeeList', params2).then(res => {
            if (res.code == '0') {
              let searchList2 = res.data
              searchList2.forEach(item => {
                item.name += `(${item.code})`
              })
              this.addEmployee(searchList2)
            } 
          })         
          break;
          case '3':
          let hasSelectData = JSON.parse(JSON.stringify(this.searchList)).filter(item => {
            return item.check
          })
          
          hasSelectData.forEach(item => {
            item.check = !item.check
          })

          this.addEmployee(hasSelectData)
          break;
        }
      }
    },
    // 删除选中的组织和员工
    del () {
       this.selectList.employee = this.selectList.employee.filter(item => {
         return !item.check
       })
       this.selectList.organ = this.selectList.organ.filter(item => {
         return !item.check
       })
    },
    // 新增选中员工, hasSelectData为选中的员工
    addEmployee (hasSelectData) {
      let selectList = this.selectList.employee
      if (selectList.length) {
        hasSelectData = hasSelectData.filter(item => {
          for (let newItem of selectList) {
            if (item.code === newItem.code) {
              return false
            }
          }
          return true
        })
      }
      this.selectList.employee = this.selectList.employee.concat(hasSelectData)
    },
    // 新增选中组织, hasSelectData为选中的组织
    addOrgan (hasSelectData) {
      let selectList = this.selectList.organ
      let hasSelectCopy = JSON.parse(JSON.stringify(hasSelectData))
      hasSelectCopy.forEach(item => {
        item.check = false
      })
      if (selectList.length) {
        hasSelectCopy = hasSelectCopy.filter(item => {
          for (let newItem of selectList) {
            if (item.fullUnitCode === newItem.fullUnitCode) {
              return false
            }
          }
          return true
        })
      }
      this.selectList.organ = this.selectList.organ.concat(hasSelectCopy)
    },
    // 清空函数
    clearSelect () {
      this.selectList.organ = []
      this.selectList.employee = []
    },
    cancel (done) {
      done()
    },
    // 确定选中
    confirm (done) {
      this.$emit('selectDtata', this.selectList)
      done()     
    },
    handleCheckChange (val) {
      this.organList = this.$refs.tree.getCheckedNodes(false, true)
      console.log(this.organList)
    },
    // 组织树懒加载
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.getOrganData().then(data => {
          resolve(data)
          this.$nextTick(() => {
            this.$refs.tree.root.childNodes.forEach(treeNode => {
              treeNode.expand()
            })
          })
        })
      } else {
        if (node.data.children && node.data.children.length) {
          resolve(node.data.children)
        } else {
          node.data.level = String(Number(node.data.level) + 1)
          let params = node.data      
          req('getOrganList', params).then(data => {
            if (data.code == '0') {
               resolve(data.data)
            }           
          })
        }
      }
    },
    getOrganData () {
      return new Promise((resolve, reject) => {
        let params = {level: '1'}
        req('getOrganList', params).then(data => {
          this.treeLoading = false
          if (data.code == '0') {
             resolve(data.data)
          }        
        }).catch(err => {
          this.treeLoading = false
        })
      })
    },
    // 选中函数
    toggleSelect (index, val) {
      val[index].check = !val[index].check
    },
    // 员工搜索
    searchEmployee () {
      let params = {
        employeeNames: [this.searchEmpWord]       
      }
      req('getEmployeeList', params).then(res => {
        if (res.code == '0') {
          if (res.data.length > 0) {
            this.searchList = res.data
            this.searchList.forEach(item => {
              item.name += `(${item.code})`
            })
          } else {
            this.showMessage('warning', '无此姓名员工')
          }         
        }          
      })    
    },
    // 组织搜索
    searchOrganFnc () {
      if (this.searchOrgan) {
        let params = {
          unitName: this.searchOrgan
        }
        req('getOrganSearch', params).then(res => {
          if (res.code == '0') {
            if (res.data.length > 0) {
              this.showOrganSearch = true
              let list = JSON.parse(JSON.stringify(res.data))
              list.forEach(item => {
                item.check = false
              })           
              this.searchOrganList = list             
            } else {
              this.showMessage('warning', '没有相关组织')
            }           
          }
        }) 
      } else {
        this.showOrganSearch = false
      }         
    },
    backOrganTree () {
      this.showOrganSearch = false
    }
  },
  watch: {
    isShow (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
.el-dialog__body {
  padding-top: 0px;
}
.organ_content {
  height: 410px;
  display: flex;
  .standby_organ {
    flex: 3;
    width: 310px;
    height: 380px; 
    .standby_title {
      font-size: 14px;
      color: #787878;
      margin-bottom: 6px;
      span {
        color: #afafaf;
        font-size: 12px;
        margin-left: 6px;
      }
    }
    .standby_tree {
      height: 100%;
      border: 1px solid #ddd;
      .el-tabs  {
        .el-tabs__content {
          .el-tab-pane {
            .organ_tree {
              height: 300px;
              overflow: auto;
              .el-tree {
                font-size: 12px;              
              }
            }
            .el-radio {
              margin-left: 12px;
              .el-radio__label {
                font-size: 12px;
              }             
            }
            .import_type {
              margin: 5px 0;
            }
          }
        }
      }
    }
  }
  .oprate_btn {
    flex: 1;
    height: 380px;
    text-align: center;
    padding-top: 200px;
    box-sizing: border-box;
  }
  .has_select {
    flex:3;
    height: 380px;
    .has_title {
      font-size: 14px;
      color: #787878;
      margin-bottom: 6px;
      .title-span {
        color: #afafaf;
        font-size: 12px;
        margin-left: 6px;
        margin-right: 35px;
      }
      .el-button--text {
        padding: 0;
      }
    }
    .has_content {
      height: 380px;
      border: 1px solid #ddd;
      padding: 5px;
      overflow-y: auto;
      .list_title {
        border-bottom:1px solid #d9d9d9;
        font-size: 14px;
        height:30px;
        line-height:30px;
        padding-left:6px;
        margin-bottom:5px;
      }
    }
  } 
}

.list_cont {
  font-size: 12px;
  padding: 6px 16px;
  margin: 3px 0;
  min-height: 25px;
  line-height: 25px;
  cursor: pointer;
}
.item_selected {
  color: #2db7f5;
  background-color: #e7f4fd;
  border-radius: 5px;
}

// 覆盖默认滚动条
 /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
    ::-webkit-scrollbar  
    {  
        width: 6px;  /*滚动条宽度*/
        height: 8px;  /*滚动条高度*/
    }  
      
    /*定义滚动条轨道 内阴影+圆角*/  
    ::-webkit-scrollbar-track  
    {  
        // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
        // border-radius: 10px;  /*滚动条的背景区域的圆角*/
        // background-color: red;/*滚动条的背景颜色*/  
        box-shadow: inset 0 0 6px #333;
        // border-radius: 10px;
    }  
      
    /*定义滑块 内阴影+圆角*/  
    ::-webkit-scrollbar-thumb  
    {  
        // border-radius: 10px;  /*滚动条的圆角*/
        // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
        // background-color: green;  /*滚动条的背景颜色*/
        background-color: #666;
        // border-radius: 10px;
    }
</style>


