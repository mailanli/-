
$(document).ready(function () {
  var pageFlag = window.sessionStorage.getItem('pageFlag')
  var seachParams = window.sessionStorage.getItem('seachParams')
  sessionStorage.removeItem('objectTypeId')
  sessionStorage.setItem('objectTypeId', 1) //保存巡逻对象类型
  window.sessionStorage.removeItem('pageFlag')
  window.sessionStorage.removeItem('pageFlag')
  var pageNo = window.sessionStorage.getItem('pageNo')
  if (seachParams && (pageFlag == 'edit')) {
    var data = JSON.parse(seachParams);
    getAreaProject(['#org','#area', '#projList'], data)
    $('#projList1').val(data.objectsType)
    $('#patrolName').val(data.name)
    // $('#projList1').searchableSelect()
    computerRoomTable(data, pageNo)
  } else if (pageFlag == 'edit') {
    computerRoomTable('', pageNo)
    getAreaProject(['#org', '#area', '#projList'])
  } else {
    sessionStorage.removeItem('seachParams')//移除其它页面存入的session
    computerRoomTable()
    getAreaProject(['#org', '#area', '#projList'])
  }
  sessionStorage.removeItem('pageNo')
  $('.searchable').searchableSelect();
  // sessionStorage.removeItem('seachParams')
})

function submitForm() {
  var params = {
    orgId: $('#org').val(),
    areaId: $('#area').val(),
    projectId: $('#projList').val(),
    objectsType: sessionStorage.getItem('objectTypeId'),
    name: $('#patrolName').val().trim(),
    pageNo: 1
  }
  computerRoomTable(params)
  window.sessionStorage.setItem('seachParams', null);
  window.sessionStorage.setItem('seachParams', JSON.stringify(params))
}
//重置
function resetSearch() {
  $('.contentHeader').find('input').val('');
  $('.contentHeader').find('select').val('').searchableSelect();
  getAreaProject(['#org','#area', '#projList'])
}
function computerRoomTable(params, pageNo) {
  var columnsSet = [[
    { title: '序号', type: 'numbers' },
    { title: '巡逻名', field: 'name' },
    { title: '所属项目', field: 'projectName' },
    { title: '所属区域', field: 'areaName' },
    { title: '创建人', field: 'createByName' },
    { title: '创建时间', field: 'createTime' },
    { title: '操作', toolbar: '#caozuo', width: 250 }
  ]];
  layTable({
    'url': 'globalPatrolObjects/list',
    'param': params || { objectsType: sessionStorage.getItem('objectTypeId') },
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo': pageNo ? pageNo : params == false ? true : false
  }, '#computerRoomTable')
}
function add(params) {
  sessionStorage.removeItem('seachParams')
  sessionStorage.removeItem('pageFlag')
  $(".container").empty();
  var page = $("<div class='mypage' id='patrolObjectDetail'></div>");
  var path = '/integration-admin/common/patrol/global/patrolObjectAdd.html'
  $(".container").append(page);
  // 加载目标网页
  window.loadPage(page[0], path);
}
// function look() {
// $(".container").empty();
// var page = $("<div class='mypage' id='patrolObjectDetail'></div>");
// var path = '/integration-admin/common/patrol/patrolObjectAdd.html'
// $(".container").append(page);
// // 加载目标网页
// window.loadPage(page[0], path);
// }

function update(id) {
  sessionStorage.removeItem('pageFlag');
  sessionStorage.removeItem('pageNo');
  sessionStorage.setItem('pageNo', parseInt($('#computerRoomTable').next().find('em').text()));
  window.sessionStorage.setItem('pageFlag', 'edit');
  $(".container").empty();
  var page = $("<div class='mypage' id='patrolObjectDetail'></div>");
  window.sessionStorage.setItem('patrolUpdate', '1');
  window.sessionStorage.setItem('updatePatrol', id)
  var path = '/integration-admin/common/patrol/global/patrolObjectAdd.html'
  $(".container").append(page);
  // 加载目标网页
  window.loadPage(page[0], path);
}

function deleteItem(id) {
  $.adapter_get('', 'globalPatrolObjects/check/' + id, function (d) {
    if (d.data) {
      layer.msg("已关联巡逻策略，不能删除哦")
      return
    } else {
      window.sessionStorage.setItem('deletePatrol', id)
      $('#delete').modal();
    }
  })
}
function adapterDataToArry(select, data, option, editDataID, order) {
  for (var key in data) {
    if (Array.isArray(data[key])) {
      select.html('')
      initName(select, order)
      if (data[key].length == 1 && !editDataID) {
        select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
      } else {
        for (var i = 0; i < data[key].length; i++) {
          var listData = data[key][i]
          var selectType = (editDataID == listData[option[0]] && (order == '0' || order == '1')) ? 'selected' : ''
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
      select.append('<option value="" selected>请选择区域</option>')
      break
    case '1':
      select.append('<option value="" selected>请选择项目</option>')
      break
    default:
      select.append('<option value="" selected>请选择</option>')
      break
  }
}
function findDetail(data) {
  sessionStorage.removeItem('pageFlag');
  sessionStorage.removeItem('pageNo');
  sessionStorage.setItem('pageNo', parseInt($('#computerRoomTable').next().find('em').text()));
  window.sessionStorage.setItem('pageFlag', 'edit');
  window.sessionStorage.setItem('targetData_protro', JSON.stringify(data));
  $(".container").empty();
  var page = $("<div class='mypage' id='patrolObjectDetail'></div>");
  var path = '/integration-admin/common/patrol/global/patrolObjectDetails.html'
  $(".container").append(page);
  // 加载目标网页
  window.loadPage(page[0], path);
}
function deletePatrolObject(id) {
  $.adapter_post({}, 'globalPatrolObjects/delete/' + window.sessionStorage.getItem('deletePatrol'), function (d) {
    $('#delete').modal('hide');
    layer.msg(d.msg)
    var pageNo = parseInt($('#computerRoomTable').next().find('em').text());
    computerRoomTable(JSON.parse(window.sessionStorage.getItem('seachParams')), pageNo)
  })
}
function exprotFile() {
  $.fileDownLoadExport('globalPatrolObjects/export', true);
}
