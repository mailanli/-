<template>
    <section class="edit-authority-wrapper"   >
        <div class="edit-authority-content">
            <!-- 权限 编辑|管理 页面: 搜索框 开始 -->
            <header class="edit-search-wrapper">
                <h3>当前用户:  {{this.userName}}</h3>
            </header>
            <!-- 权限 编辑|管理 页面: 搜索框 结束 -->
            <!-- 权限 编辑|管理 页面: 内容面板 开始 -->
            <div class="edit-panel">
                 <el-transfer
                    filterable
                    filter-placeholder="请输入权限名称"
                    :titles="['未添加', '已添加']"
                    v-model="PageData['updataList']"
                    :data="PageManage['transferList']">
                </el-transfer>   
            </div>
            <footer>
                <el-button type="primary" round size="small"  @click="saveAuthorityHandle">保存</el-button>
            </footer>
            <!-- 权限 编辑|管理 页面: 内容面板 结束 -->
        </div>
    </section>
</template>

<script type='text/ecmascript-6'>
import { quotaAuthorityManage } from "@/api/performance";
const _debounce = require("lodash/debounce");
export default {
  data() {
    return {
      PageManage: {
        pageTotal: 0, //页面表格总数
        pageSize: 10, //页面展示条数
        pageCurrent: 1, //当前页码
        transferList: [], //表格需要的用户列表
        initList: [], //用户列表,存储原始数据,transferList会筛选Dom元素成需要的数据,数据缺失
        loading: false
      },
      PageData: {
        searchTxt: "", //查询的用户内容
        updataList: [] //编辑的用户数据
      },
      transferCache: {}  //穿梭框缓存
    };
  },
  props: {
    userCode: String,
    userName: String
  },
  beforeCreate() {
      // 广播该方法,让父组件点击编辑按钮时调用一次查询
      this.$on("getPageData", function (){
        this.$nextTick(function() {
          this.getPageData();
        });
    });
  },
  created() {},
  watch: {},
  methods: {
    // 请求页面穿梭框数据; 如果是缓存有，则取缓存，反之调接口
    getPageData() {
      let cacheKey = this.userCode + ";";
      let cacheData = this.transferCache[cacheKey];
      console.log("getPageData", cacheKey,cacheData);
      if (cacheData) {
        this.PageData["updataList"] = cacheData["itemSelect"];
        this.PageManage["transferList"] = cacheData["transferList"];
        this.PageManage["initList"] = cacheData["initList"];
        this.PageManage["loading"] = false;
        return;
      } else {
        this.PageManage["loading"] = true;
        this.queryAuthorityData(this.userCode, cacheKey);
      }
    },
    /*  编辑权限页面搜索框,搜索没有权限的用户;
        @param [userCode,cacheKey];
        userCode 需要操作的用户ID,父组件传过来的值
        cacheKey 页面缓存对象的key值;
    */
    async queryAuthorityData(userCode, cacheKey) {
      let { pageSize, pageCurrent } = { ...this.PageManage };
      this.PageManage["loading"] = true;
      await quotaAuthorityManage(
        "获取编辑",
        {
            userCode
        },
        response => {
          this.transferListMap(response, cacheKey);
        },
        (error, code) => {
          this.PageManage["loading"] = false;
          this.$message({
            type: "error",
            message: "接口请求失败"
          });
          console.warn(error);
        },
        (exception, code) => {
          this.PageManage["loading"] = false;
          console.error(exception);
          this.$message({
            type: "error",
            message: exception.message
          });
        }
      );
    },
    /*  保存新添加的用户;
        @param [saveList,userCode];
        saveList 保存操作的数组;
        userCode 需要操作的用户ID,父组件传过来的值;
    */
    async saveAuthorityData({ saveList = [],userCode } = {}) {
      if (saveList.length == 0) return false; //不能添加为空
      this.PageManage["loading"] = true;
      // 数据请求
      await quotaAuthorityManage(
        "保存编辑",saveList,
        response => {
          this.$emit("refreshTable", userCode);
          this.$message({
            type: "success",
            message: "保存成功"
          });
        },
        (error, code) => {
          this.PageManage["loading"] = false;
          this.$message({
            type: "error",
            message: "接口请求失败"
          });
          console.warn(error);
        },
        (exception, code) => {
          this.PageManage["loading"] = false;
          console.error(exception);
          this.$message({
            type: "error",
            message: exception.message
          });
        }
      );
    },
    /* 将数据转换成穿梭框所需要的
        @param [dataList, cacheKey] 
        dataList  接口请求回调数据
        cacheKey  页面缓存对象的key值
    */
    transferListMap(dataList, cacheKey) {
      let itemSelect = [],
        transferList = [];
      for (var i = 0, dataItem; (dataItem = dataList[i]); i++) {
        if (dataItem["isSelect"] === "1") {itemSelect.push(dataItem["elementId"]);}
        transferList.push({
          key: dataItem["elementId"],
          label: dataItem["elementName"]
        });
      }
      this.PageData["updataList"] = itemSelect;
      this.PageManage["transferList"] = transferList;
      this.PageManage["initList"] = dataList;
      this.transferCache[cacheKey] = {
        itemSelect,
        transferList,
        initList: dataList
      };
    },
    // 保存按钮点击操作
    saveAuthorityHandle() {
      let { initList, transferList } = { ...this.PageManage };
      let itemSelect = this.PageData["updataList"];
      let userCode = this.userCode;
      let cacheKey = userCode + ";";
      initList.map(item => {
        item["isSelect"] = "0";
      });
      for (let u = 0, updataItem; (updataItem = itemSelect[u]); u++) {
        for (let i = 0, item; (item = initList[i]); i++) {
          if (item["elementId"] === updataItem) {
            item["isSelect"] = "1";
            break;
          }
        }
      }
     // 更新缓存
      this.transferCache[cacheKey] = {
        initList,
        itemSelect,
        transferList
      };
      this.saveAuthorityData({ saveList: initList,userCode});
    },
  },
  components: {}
};
</script>

<style lang='less' scoped>
.edit-authority-wrapper {
  margin: 0 auto;
  text-align: center;
  .edit-search-wrapper{
      margin:5px 20px;
      text-align: left;
  }
  // 内容面板
  .edit-panel {
    margin: 20px;
    .edit-empty-panel {
      .edit-empty-txt {
        display: inline-block;
        height: 50px;
        width: 100%;
        margin: 25px 0;
      }
    }
  }
  .el-button.is-round {
    margin: 10px;
    margin-top: 20px;
    width: 100px;
  }
}
</style>
<style >
.edit-authority-wrapper .el-transfer-panel {
  text-align: left;
}
</style>

