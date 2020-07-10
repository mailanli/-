
var fileChoose = new createUpload('.uploadFile', 5);
$(document).ready(function () {
  $('.searchable').searchableSelect()
  getContractDetails();
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
function getContractDetails() {
  var contracId = window.sessionStorage.getItem('contracId')
  var pageFlag = window.sessionStorage.getItem('pageFlag')
  if (pageFlag == 'edit') {
    $('#title').html('合同修改')
    $('#remarkEdit').attr("disabled", "disabled"); //状体备注
  } else if (pageFlag == 'stop') {
    $('#title').html('合同终止')
    $('#org_select,#area_select, #project_select, #type_select, #company_select, #fileList_change,#contractType_select').hide()
    $('#orgName, #areaName, #projectName, #typeName, #companyShow,#contractTypeShow').show()
    $('#orgEdit,#nameEdit,#companyEdit,#companyShortEdit,#codeEdit,#executeEdit,#executePhone,#contractPhone,#contractEdit,#startDate,#endDate')
      .attr("disabled", "disabled");
    $('#remarkEdit').removeAttr("disabled"); //状态备注
  }
  if (contracId) {
    $.adapter_get('', 'contract/info/' + contracId, function (d) {
      if (d.status == 1) {
        var contractDetails = d.data;
        if (pageFlag == 'edit') {
          selects(['#orgEdit', '#areaEdit', '#projectEdit', '#typeEdit'], {
            orgId: contractDetails.orgId,
            areaId: contractDetails.areaId,
            projectId: contractDetails.projectId,
            typeId: contractDetails.typeId
          })
          $('#contractType').val(contractDetails.contractType)
          $('#contractType').searchableSelect({
            afterSelectItem: function () {
              selectCompany('#companyName', contractDetails.companyId)
            }
          })
          // selectCompany('#companyName', contractDetails.companyId)
        } else {
          $('#orgName').val(contractDetails.orgName)
          $('#areaName').val(contractDetails.areaName)
          $('#projectName').val(contractDetails.projectName)
          $('#typeName').val(contractDetails.typeName)
          $('#companyShow').val(contractDetails.companyName) //供应商
          $('#companyShortEdit').val(contractDetails.companyShortName) //供应商
          $('#contractPhone').val(contractDetails.companyPhone) //供应商电话
          $('#contractEdit').val(contractDetails.companyContact) //供应商联系人
          $('#contractTypeShow').val(contractDetails.contractType) //合同业务
          $('#secondContact').val(contractDetails.secondContact) //供应商联系人2
          $('#secondTelephone').val(contractDetails.secondTelephone) //供应商联系人2
        }
        $('#nameEdit').val(contractDetails.name) //合同名称
        $('#codeEdit').val(contractDetails.contractNum) // 合同编号
        $('#remarkEdit').val(contractDetails.remark) //状体备注
        $('#executeEdit').val(contractDetails.executer) //联系人
        $('#executePhone').val(contractDetails.executerPhone) //联系电话

        $('#startDate').val(contractDetails.startDay.slice(0, 10))
        $('#endDate').val(contractDetails.endDay.slice(0, 10))
        initFile(contractDetails.fileList);
      }
    })
  }
}

function initFile(fileList) {
  if (!fileList || !fileList.length) {
    return false
  }
  var html = '';
  for (var i = 0; i < fileList.length; i++) {
    var ele = fileList[i];
    var fileName = ''
    if (ele.fileName) {
      fileName = ele.fileName
    }
    var pageFlag = window.sessionStorage.getItem('pageFlag')
    var deleteFile = pageFlag == 'edit' ? '' : 'delete_file';
    if (ele) {
      html += '<p>' +
        '<span class="filename" >' + fileName + '</span>' +
        '<button class="btn" onclick=\"downloadFile1(\'' + ele.url + '\')\">下载</button>' +
        '<button class="btn" onclick=\"printFile1(\'' + ele.url + '\')\">打印</button>' +
        '<button class="btn ' + deleteFile + '" onclick=\"deleteFile1(' + ele.id + ',' + i + ')\">删除</button>' +
        '</p>'
    }
    $('#fileList').html(html)
  }
}
function save() {
  var contracId = window.sessionStorage.getItem('contracId')
  var pageFlag = window.sessionStorage.getItem('pageFlag')
  var url = pageFlag == 'edit' ? 'contract/update' : 'contract/endUp';
  var param;
  if (pageFlag == 'edit') {
    var orgId = $('#orgEdit').val() ? $('#orgEdit').val() * 1 : null
    var areaId = $('#areaEdit').val() ? $('#areaEdit').val() * 1 : null
    var projectId = $('#projectEdit').val() ? $('#projectEdit').val() * 1 : null
    var typeId = $('#typeEdit').val() ? $('#typeEdit').val() * 1 : null
    var contractNum = $('#codeEdit').val().trim()
    var name = $('#nameEdit').val().trim()
    var companyId = $('#companyName').val() ? $('#companyName').val() * 1 : null
    var contractType = $('#contractType').val() ? $('#contractType').val() * 1 : null
    var executer = $('#executeEdit').val().trim()
    var executerPhone = $('#executePhone').val().trim()
    var startDay = $('#startDate').val()
    var endDay = $('#endDate').val()
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
    }
    else if (!executer) {
      layer.msg('请填写执行人')
      return
    } else if (!executerPhone) {
      layer.msg('请填写执行人电话')
      return
    } else if (!startDay) {
      layer.msg('请选择生效开始日期')
      return
    } else if (!endDay) {
      layer.msg('请选择结束日期')
      return
    } else if (startDay > endDay) {
      layer.msg('生效日期不能大于结束日期')
      return
    } else if (!contractNum) {
      layer.msg('请填写合同编号')
      return
    }
    param = {
      id: contracId,
      orgId: orgId,
      areaId: areaId,
      projectId: projectId,
      name: name,
      companyId: companyId,
      contractType: contractType,
      executer: executer,
      executerPhone: executerPhone,
      contractNum: contractNum,
      typeId: typeId,
      startDay: startDay,
      endDay: endDay,
      fileList: null
    }
    if (fileChoose.fileList.length !== 0) {
      var files = []
      var str = {
        "projectId": projectId,
        "moduleId": 1
      }
      $.adapterFiles('fileAdd', {}, 'cos/uploadByMultipartFiles', function (d) {
        if (d.status == '1') {
          for (var i = 0; i < d.data.length; i++) {
            var item = d.data[i];
            files.push({
              fileName: item.fileName ? item.fileName : '',
              url: item.fileUrl
            })
          }
          var params = {
            businessId: contracId,
            module: '1',
            fileList: files
          }
          $.adapter_post(params, 'file/fileUpload', function (data) {
            if (data.status == '1') {
              $.adapter_put(param, url, function (datas) {
                initResult(datas);
              })
            } else {
              layer.msg(data.msg)
            }
          })
          $.adapter_put(param, url, function (d) {
            initResult(d)
          })
        }
      }, str)
    } else {
      $.adapter_put(param, url, function (d) {
        initResult(d)
      })
    }
  } else {
    param = {
      id: contracId,
      remark: $('#remarkEdit').val().trim()
    }
    $.adapter_put(param, url, function (d) {
      initResult(d)
    })
  }
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
        var orgId=this.holder.data('value')
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
                selectAdapterPost(typeList, typeParam, '/management/selectName', function () {
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
function initResult(d) {
  layer.msg(d.msg)
  if (d.status == 1) {
    goBack()
  }
}

function selectCompany(company, editData) {
  var companyId = editData ? editData : ''
  var companyList = $(company);
  selectAdapterPost(companyList, { 'queryStr': '', 'contractType': $('#contractType').val() }, 'company/listSelect', function (res) {
    var data = this.data;
    companyList.searchableSelect({
      afterSelectItem: function () {
        if (!this.holder.data('value')) {
          $('#companyShortEdit').val('')
          $('#contractEdit').val('')
          $('#contractPhone').val('')
          $('#secondContact').val('')
          $('#secondTelephone').val('')
          return false
        }
        for (var i = 0; i < data.length; i++) {
          var ele = data[i];
          if (ele.id == this.holder.data('value')) {
            $('#companyShortEdit').val(ele.shortName)
            $('#contractEdit').val(ele.contact)
            $('#contractPhone').val(ele.telephone)
            $('#secondContact').val(ele.secondContact)
            $('#secondTelephone').val(ele.secondTelephone)
          }
        }
      }
    })
  }, ['id', 'name'], companyId, '3')
}
function downloadFile1(url) {
  downloadFileGet(url)
}
function deleteFile1(id, index) {
  $('#deleteFile').modal('toggle')
  sessionStorage.setItem('deleteId', id);
  sessionStorage.setItem('elementIndex', index)
}

function deleteFileSure() {
  var id = sessionStorage.getItem('deleteId');
  $.adapter_delete('', 'file/delete/' + id, function (d) {
    if (d.status == '1') {
      var index = sessionStorage.getItem('elementIndex')
      $('#fileList').find('p').eq(index).remove()
      sessionStorage.removeItem('deleteId')
      sessionStorage.removeItem('elementIndex')
    }
    $('#deleteFile').modal('toggle')
    layer.msg(d.msg)
  })
}
function printFile1(url) {
  $("#printFile").attr('src', url)
  $("#printFile").print();
}

function selectAdapterPost(selectID, param, fun, cb, option, editDataID, order) {
  $.adapter_post(param, fun, function (d) {
    adapterDataToArry(selectID, d, option, editDataID, order)
    if (cb) {
      cb.call(d)
    }
  })
}