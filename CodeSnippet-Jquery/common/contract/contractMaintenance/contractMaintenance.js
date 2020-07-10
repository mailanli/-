$(document).ready(function () {
  $('.searchable').searchableSelect()
  var pageFlag = window.sessionStorage.getItem('pageFlag')
  var seachParams = sessionStorage.getItem('seachParams')
  var pageNo = window.sessionStorage.getItem('pageNo')
  if (seachParams && (pageFlag == 'edit' || pageFlag == 'stop' || pageFlag == 'look' || pageFlag == 'remind')) {
    var data = JSON.parse(seachParams);
    contractTable(data, pageNo)
    getAreaProject(['#org','#area', '#project'], data)
    $('#contractName').val(data.name)
    $('#contractCode').val(data.contractNum)
    // $('#contractStatus').val(data.status)
    // $('#warnLevel').val(data.warnLevel)
    $('#companyName').val(data.companyName)
  } else if (pageFlag == 'edit' || pageFlag == 'stop' || pageFlag == 'look' || pageFlag == 'remind') {
    contractTable('', pageNo)
    getAreaProject(['#org','#area', '#project'])
  } else {
    contractTable()
    getAreaProject(['#org','#area', '#project'])
    sessionStorage.removeItem('seachParams')
  }
  sessionStorage.removeItem('pageFlag')
  sessionStorage.removeItem('pageNo')
});

// 导出
function exports() {
  $.fileDownLoadExport('contract/export', true)
}
// 查询
function submitForm() {
  var param = {
    'orgId': $('#org').val() ? $('#org').val() : null,
    'areaId': $('#area').val() ? $('#area').val() : null,
    'projectId': $('#project').val() ? $('#project').val() : null,
    'name': $('#name').val() ? $('#name').val().trim() : null,
    'contractNum': $('#contractCode').val() ? $('#contractCode').val().trim() : null,
    'companyName': $('#companyName').val() ? $('#companyName').val().trim() : null,
    'status': $('#contractStatus').val() === null ? null : $('#contractStatus').val() * 1,
    'warnLevel': $('#warnLevel').val() === null ? null : $('#warnLevel').val() * 1
  }
  contractTable(param)
  sessionStorage.setItem('seachParams', JSON.stringify(param))
}

// 重置
function resetForm() {
  $('.contentHeader').find('input').val('')
  $('.contentHeader').find('select').val('').searchableSelect();
  getAreaProject(['#org','#area', '#project'])
}

function add() {
  sessionStorage.removeItem('seachParams')
  sessionStorage.removeItem('pageFlag')
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractAdd'></div>")
  var path = 'integration-admin/common/contract/contractAdd/contractAdd.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}
function contractTable(params, pageNo) {
  var columnsSet = [[
    { 'title': '序号', type: 'numbers' },
    { 'title': '合同名称', 'field': 'name' },
    { 'title': '合同编码', 'field': 'contractNum' },
    { 'title': '业务分类', 'field': 'typeName' },
    { 'title': '业务供应商', 'field': 'companyName' },
    { 'title': '执行人', 'field': 'executer' },
    { 'title': '联系电话', 'field': 'executerPhone' },
    {
      'title': '合同有效期', 'width': '18%',
      'templet': function (d) {
        if (d.startDay && d.endDay) {
          return d.startDay.slice(0, 10) + ' ~ ' + d.endDay.slice(0, 10)
        } else {
          return ''
        }
      }
    },
    {
      'title': '合同状态',
      'templet': function (d) {
        return d.status == 0 ? '有效' : d.status == 1 ? '失效' : '作废'
      }
    },
    { 'title': '所属项目', 'field': 'projectName' },
    {
      'title': '操作', 'width': '30%',
      'templet': function (d) {
        var obj = JSON.stringify({
          id: d.id,
          endDay: d.endDay ? d.endDay.slice(0, 10) : ''
        })
        if (d.status == 0) {
          return (
            '<div> ' +
            '<a class="td_button_default btn_right" onclick=\'lookFile(' + d.id + ")'>查看</a>" +
            '<a class="td_button_default btn_right" onclick=\'editFile(' + d.id + ")'>编辑</a>" +
            '<a class="td_button_default btn_right" onclick=\'stopFile(' + d.id + ")'>终止</a>" +
            '<a class="td_button_default btn_right" onclick=\'addReminder(' + obj + ")'>添加提醒</a>" +
            '<a class="td_button_default" onclick=\'delFile(' + JSON.stringify(d) + ")'>删除</a>" +
            '</div>'
          )
        } else {
          return (
            '<div> ' +
            '<a class="td_button_default btn_right" onclick=\'lookFile(' + d.id + ")'>查看详情</a>" +
            '<a class="td_button_default" onclick=\'delFile(' + obj + ")'>删除</a>" +
            '</div>'
          )
        }
      }
    }
  ]]
  layTable({
    'url': 'contract/list',
    'param': params || {},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo': pageNo ? pageNo : params == false ? true : false
  }, '#contractTables')

}

// 合同编辑
function editFile(contracId) {
  sessionStorage.removeItem('pageFlag');
  sessionStorage.removeItem('pageNo');
  sessionStorage.setItem('pageNo', parseInt($('#contractTables').next().find('em').text()));
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractEdit'></div>")
  var path = 'integration-admin/common/contract/contractEdit/contractEdit.html'
  window.sessionStorage.setItem('contracId', contracId)
  window.sessionStorage.setItem('pageFlag', 'edit')
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 合同详情
function lookFile(contractId) {
  sessionStorage.removeItem('pageFlag');
  sessionStorage.removeItem('pageNo');
  sessionStorage.setItem('pageNo', parseInt($('#contractTables').next().find('em').text()));
  $('.container').empty()
  window.sessionStorage.setItem('contracId', contractId)
  window.sessionStorage.setItem('pageFlag', 'look')
  var page = $("<div class='mypage' id='pageContractLook'></div>")
  var path = 'integration-admin/common/contract/contractLook/contractLook.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 合同终止
function stopFile(contractId) {
  sessionStorage.removeItem('pageFlag');
  sessionStorage.removeItem('pageNo');
  sessionStorage.setItem('pageNo', parseInt($('#contractTables').next().find('em').text()));
  $('.container').empty()
  window.sessionStorage.setItem('contracId', contractId)
  window.sessionStorage.setItem('pageFlag', 'stop')
  var page = $("<div class='mypage' id='pageContractStop'></div>")
  var path = 'integration-admin/common/contract/contractEdit/contractEdit.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 添加提醒
function addReminder(obj) {
  sessionStorage.removeItem('pageFlag');
  sessionStorage.removeItem('pageNo');
  sessionStorage.setItem('pageNo', parseInt($('#contractTables').next().find('em').text()));
  $('.container').empty()
  window.sessionStorage.setItem('contractId', obj.id)
  window.sessionStorage.setItem('endDay', obj.endDay)
  window.sessionStorage.setItem('pageFlag', 'remind')
  var page = $("<div class='mypage' id='pageAddReminder'></div>")
  var path = 'integration-admin/common/contract/addReminder/addReminder.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

//删除该合同维护
function delFile(data) {
  getTipOpen(data, '该合同将被删除', function () {
    if (data.isDelete == 1) {
      $.adapter_delete('', 'contract/delete/' + data.id, function (d) {
        layer.msg(d.msg)
        if (d.status == '1') {
          layui.table.reload(tableObject.config.id)
        }
      })
    } else {
      layer.msg('该合同已经关联策略，不可删除哦')
    }
  })
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
          var selectType = (editDataID == listData[option[0]]) ? 'selected' : ''
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

function initName(select, order) {
  switch (order) {
    case '0':
      select.append('<option value="" selected>请选择区域...</option>')
      break;
    case '1':
      select.append('<option value="" selected>请选择项目...</option>')
      break;
    default:
      select.append('<option value="" selected>请选择...</option>')
      break;
  }
}
