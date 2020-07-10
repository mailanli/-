
var fileChoose = new createUpload('.uploadFile', 5);
$(document).ready(function () {
  $('.searchable').searchableSelect()
  selects(['#orgAdd', '#areaAdd', '#projectAdd', '#typeAdd'])
  // 供应商搜索框
  $('#contractType').searchableSelect({
    afterSelectItem: function () {
      console.log(1)
      selectCompany(['#companyAdd'])
    }
  })
})
// 时间控件
$(function () {
  jeDate("#endDate", {
    format: "YYYY-MM-DD",
    isTime: false
  })
  jeDate("#startDate", {
    format: "YYYY-MM-DD",
    isTime: false
  })
})
// 保存
function save() {
  var url = 'contract/save'
  var orgId = $('#orgAdd').val() ? $('#orgAdd').val() * 1 : null
  var areaId = $('#areaAdd').val() ? $('#areaAdd').val() * 1 : null
  var projectId = $('#projectAdd').val() ? $('#projectAdd').val() * 1 : null
  var typeId = $('#typeAdd').val() ? $('#typeAdd').val() * 1 : null
  var contractNum = $('#codeAdd').val().trim()
  var name = $('#nameAdd').val().trim()
  var companyId = $('#companyAdd').val() ? $('#companyAdd').val() * 1 : null
  var contractType = $('#contractType').val() ? $('#contractType').val() * 1 : null
  var executer = $('#executeAdd').val().trim()
  var executerPhone = $('#executePhone').val().trim()
  var startDay = $('#startDate').val()
  var endDay = $('#endDate').val()
  var fileList = [];
  layui.use(['layer'], function () {
    if (!orgId) {
      layer.msg('请选择公司名称')
      return
    }
    if (!areaId) {
      layer.msg('请选择区域名称')
      return
    } else if (!projectId) {
      layer.msg('请选择项目名称')
      return
    } else if (!name) {
      layer.msg('请填写合同名称')
      return
    } else if (!typeId) {
      layer.msg('请选择业务分类')
      return
    } else if (!companyId) {
      layer.msg('请选择业务供应商')
      return
    } else if (!contractType) {
      layer.msg('请选择合同业务')
      return
    } else if (!executer) {
      layer.msg('请填写执行人')
      return
    } else if (!executerPhone) {
      layer.msg('请填写执行人电话')
      return
    } else if (!startDay) {
      layer.msg('请选择生效开始日期')
      return
    } else if (!endDay) {
      layer.msg('请选择生效结束日期')
      return
    } else if (!contractNum) {
      layer.msg('请填写合同编号')
      return
    }
    var param = {
      "orgId": orgId,
      "areaId": areaId,
      "projectId": projectId,
      "typeId": typeId,
      "contractNum": contractNum,
      "name": name,
      "companyId": companyId,
      "contract_type": contractType,
      "executer": executer,
      "executerPhone": executerPhone,
      "startDay": startDay,
      "endDay": endDay,
      "fileList": fileList
    }
    if (fileChoose.fileList.length !== 0) {
      fileList = []
      var str = {
        "projectId": projectId,
        "moduleId": 1
      }
      $.adapterFiles('fileAdd', {}, 'cos/uploadByMultipartFiles', function (d) {
        if (d.status == '1') {
          for (var i = 0; i < d.data.length; i++) {
            var item = d.data[i];
            fileList.push({
              fileName: item.fileName ? item.fileName : '',
              url: item.fileUrl
            })
          }
          param.fileList = fileList;
          $.adapter_post(param, url, function (data) {
            layer.msg(data.msg)
            if (data.status == '1') {
              goBack()
            }
          })
        }
      }, str)
    } else {
      $.adapter_post(param, url, function (d) {
        layer.msg(d.msg)
        if (d.status == '1') {
          goBack()
        }
      })
    }
  })
}
// 回退页面
function goBack() {
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractMaintenance'></div>")
  var path = 'integration-admin/common/contract/contractMaintenance/contractMaintenance.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

/* 
下拉列表
 */
function selects(array, editDatas) {
  // 获取区域下拉框数据
  var orgList = $(array[0])
  var areaList = $(array[1])
  var proList = $(array[2])
  var typeList = $(array[3])
  var editData
  if (!editDatas) {
    editData = {
      orgId: '',
      areaId: '',
      projectId: '',
      typeId: ''
    }
  } else {
    editData = editDatas
  }
  selectAdapterGetN(orgList, '', 'userRole/getOrgList', function () {  //公司
    orgList.searchableSelect({
      afterSelectItem: function () {
        clearN(array.slice(1)) //清除该select联动的其它select数据   
        var orgId = this.holder.data('value')
        if(orgId){
        selectAdapterGetN(areaList, '', 'userRole/getAreaListByOrgId/' + this.holder.data('value'), function () {  //区域
          areaList.searchableSelect({
            afterSelectItem: function () {
              // 清空选择框
              clearN(array.slice(2))
              var areaId = this.holder.data('value')
              if (areaId) {
                // 项目
                selectAdapterGetN(proList, '', 'userRole/getProListByAreaId/' + areaId, function () {
                  proList.searchableSelect({
                    afterSelectItem: function () { }
                  })
                }, ['bdId', 'bdName'], editData.projectId, '1')
                // 区域
                var typeParam = {
                  "areaId": areaId,
                  "typeId": "2",
                  "serverType": "2"
                }
                selectAdapterPost(typeList, typeParam, 'management/selectName', function () {
                  typeList.searchableSelect({
                    afterSelectItem: function () { }
                  })
                }, ['id', 'name'], editData.typeId, '2')
              }
            }
          })
        }, ['bdId', 'bdName'], editData.areaId, '1')
      }
      }
    })
  }, ['bdId', 'bdName'], editData.orgId, '0')
}
function selectCompany(arr, editData) {
  var companyId;
  companyId = editData ? editData : ''
  var companyList = $(arr[0]);
  var contractType = $('#contractType').val(); //合同业务类型
  selectAdapterPost(companyList, { 'queryStr': '', 'contractType': contractType }, 'company/listSelect', function () {
    var data = this.data;
    companyList.searchableSelect({
      afterSelectItem: function () {
        if (!this.holder.data('value')) {
          $('#companyShortAdd').val('')
          $('#contractAdd').val('')
          $('#contractPhone').val('')
          $('#secondContact').val('')
          $('#secondTelephone').val('')
          return false
        }
        for (var i = 0; i < data.length; i++) {
          var ele = data[i];
          if (ele.id == this.holder.data('value')) {
            $('#companyShortAdd').val(ele.shortName)
            $('#contractAdd').val(ele.contact)
            $('#contractPhone').val(ele.telephone)
            $('#secondContact').val(ele.secondContact)
            $('#secondTelephone').val(ele.secondTelephone)
          }
        }
      }
    })
  }, ['id', 'name'], companyId, '3')
}
function adapterDataToArry(select, data, option, editDataID, order) {
  for (var key in data) {
    if (Array.isArray(data[key])) {
      select.html('')
      initName(select, order)
      if (data[key].length == 1 && !editDataID && (order == '0' || order == '1')) {
        select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
      } else {
        for (var i = 0; i < data[key].length; i++) {
          var listData = data[key][i]
          var selectType = editDataID == listData[option[0]] ? 'selected' : ''
          select.append('<option value="' + listData[option[0]] + '" ' + selectType + '>' + listData[option[1]] + '</option>')
        }
      }
      return
    } else if (typeof (data[key]) == 'object') {
      if (data[key] == null) {
        select.html('')
        initName(select, order)
      } else {
        adapterDataToArry(select, data[key], option, editDataID, order)
        return
      }
    }
  }
}

function clear(array, index) {
  for (var key in array) {
    if (array[key]) {
      $(array[key]).html('')
      var order = (key * 1 + index).toString()
      initName($(array[key]), order)
      $(array[key]).searchableSelect({})
    }
  }
}
function initName(select, order) {
  switch (order) {
    case '0':
      select.append('<option value="" selected>请选择</option>')
      break;
    case '1':
      select.append('<option value="" selected>请选择</option>')
      break;
    case '2':
      select.append('<option value="" selected>请选择</option>')
      break;
    case '3':
      select.append('<option value="" selected>请选择</option>')
      break;
    case '4':
      select.append('<option value="" selected>请选择</option>')
      break;
    default:
      select.append('<option value="" selected>请选择</option>')
      break;
  }
}
function selectAdapterPost(selectID, param, fun, cb, option, editDataID, order) {
  $.adapter_post(param, fun, function (d) {
    adapterDataToArry(selectID, d, option, editDataID, order)
    if (cb) {
      cb.call(d)
    }
  })
}