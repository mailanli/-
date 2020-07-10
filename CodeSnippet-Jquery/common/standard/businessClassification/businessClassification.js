$(document).ready(function () {
  window.sessionStorage.removeItem('query_param') //移除其它页面存入的session
  businessClassificationTable()
  dialogEdit1(['#orgList','#areaList'])
  $('#serverType').searchableSelect({
    afterSelectItem: function () { }
  })
})
// 下拉框处理 
function dialogEdit1(array, editDatas) {
  // 获取区域下拉框数据
  var orgList = $(array[0])
  var areaList = $(array[1])
  var editData
  if (!editDatas) {
    editData = {
      orgId: '',
      areaId: '',
    }
  } else {
    editData = editDatas
  }
  selectAdapterGetN(orgList, '', 'userRole/getOrgList', function () {  //公司
    orgList.searchableSelect({
        afterSelectItem: function () {
            clearN(array.slice(1)) //清除该select联动的其它select数据   
            selectAdapterGetN(areaList, '', 'userRole/getAreaListByOrgId/' + this.holder.data('value'), function () {  //区域
    areaList.searchableSelect({
      afterSelectItem: function () {
      }
    })
  }, ['bdId', 'bdName'], editData.areaId, '1')
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
function initName(select, order) {
  switch (order) {
    case '0':
      select.append('<option value="" selected>请选择区域...</option>')
      break;
    default: select.append('<option value="" selected>请选择...</option>')
      break;
  }
}
function businessClassificationTable(params,pageNo) {
  var columnsSet = [[
    { title: '序号', type: 'numbers' },
    { title: '区域', field: 'areaName' },
    { title: '业务名称', field: 'name' },
    { title: '业务大类', field: 'typeName' },
    { title: '服务性质', field: 'serverTypeName' },
    { title: '创建人', field: 'createByName' },
    { title: '创建时间', field: 'createTime' },
    { title: '操作', toolbar: '#barDemo' }
  ]]
  layTable({
    'url': 'standard/list',
    'param': params || {},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo':pageNo ? pageNo : (params==false||params) ? true : false 
  }, '#businessClassificationTable')
}
// 点击查询
function submitForm() {
  var param = {
    orgId: $('#orgList').val() ? $('#orgList').val() * 1 : null,
    areaId: $('#areaList').val() ? $('#areaList').val() * 1 : null,
    areaName: null,
    name: $('#standName').val(),
    createByName: $('#createByName').val(),
    serverType: $('#serverType').val()
  }
  businessClassificationTable(param,1)
  window.sessionStorage.setItem('query_param',JSON.stringify(param))
}

//添加
function add() {
  $('#businessClassificationModal').modal()
  $('#businessClassificationModalLabel').html('<h4 class="modal-title addBusinessClassificationModal" id="businessClassificationModalLabel">添加分类</h4>')
  $('#orgList1').val('')
  $('#areaList1').val('')
  $('#business').val('')
  $('#stantType').val('')
  $('#serverType1').val(1)
  $('#stantRate').val('')
  $('.serverType1').show()
  $('.stantRate').hide()
  $('#serverType2').show()
  $('#stantType').change(function () {
    if ($(this).val() != 2) {
      $('.serverType1').hide()
      $('.stantRate').hide()
      $('#stantRate').val('')
      $('#serverType2').hide()
      $('#serverType1').val(1)
    } else if ($(this).val() == 2) {
      $('.serverType1').show()
      $('.stantRate').hide()
      $('#stantRate').val('')
      $('#serverType2').show()
    }
  })
  $('#serverType1').change(function () {
    $('.stantRate').hide()
    $('#stantRate').val('')
    // if ($(this).val() == 2) {
    //   $('.stantRate').show()
    // } else {
    //   $('.stantRate').hide()
    //   $('#stantRate').val('')
    // }
  })
  dialogEdit1(['#orgList1','#areaList1'])
}
// 编辑
function update(data) {
  console.log(data);
  $('#businessClassificationModal').modal();
  $('#businessClassificationModalLabel').html('<h4 class="modal-title editBusinessClassificationModal" id="businessClassificationModalLabel">修改分类</h4>')
  window.sessionStorage.setItem('ids', data.id)
  dialogEdit1(['#orgList1','#areaList1'],data)
  // dialogEdit1(['#areaList1'], data)
  // 监听
  $('#stantType').on('change', function (e) {
    doStantType1Show()
  })
  $('#serverType1').on('change', function (e) {
    dostantRateShow()
  })
  // 赋值
  $('#business').val(data.name)
  $("#serverType1").find("option[value=" + data.serverType + "]").prop("selected", true);
  $("#stantType").find("option[value=" + data.type + "]").prop("selected", true);
  if (data.maintenanceType !== '') {
    $("#stantRate").find("option[value=" + data.maintenanceType + "]").prop("selected", true);
  } else {
    $("#stantRate").find("option[value='']").prop("selected", true);
  }
  doStantType1Show();
  dostantRateShow();
}
function doStantType1Show() {
  if ($('#stantType').val() != 2) {
    $('.serverType1').hide()
    $('.stantRate').hide()
    $('#stantRate').val('')
    $('#serverType2').hide()
    $('#serverType1').val('')
  } else {
    $('.serverType1').show()
    $('.stantRate').hide()
    $('#serverType2').show()
  }
}
function dostantRateShow() {
  // if ($('#serverType1').val() == 2) {
  //   $('.stantRate').show()
  // } else {
  //   $('.stantRate').hide()
  //   $('#stantRate').val('')
  // }
}
//删除处理
function deleteItem(data) {
  $('#delete').modal('toggle')
  $('#delete .modal-body').html(data.name + '将被删除')
  this.deleteID = data.id
}

function deleteSure() {
  var id = this.deleteID
  layui.use(['layer'], function () {
    var layer = layui.layer
    $.adapter_post('', 'standard/delete/' + id, function (d) {
      layer.msg(d.msg)
      $('#delete').modal('toggle')
      if (d.status == '1') {
        var query_param =JSON.parse(window.sessionStorage.getItem('query_param'));
        if (!query_param) query_param = false;
        businessClassificationTable(query_param)
      }
    })
  })
}
//保存
function save() {
  var isEdit = $('#businessClassificationModalLabel h4').hasClass('editBusinessClassificationModal')
  var editID = window.sessionStorage.getItem('ids')
  layui.use(['layer'], function () {
    var layer = layui.layer
    if (!$('#areaList1').val()) {
      layer.msg('所属区域不能为空')
      return false
    } else if (!$('#business').val()) {
      layer.msg('分类名称不能为空')
      return false
    } else if (!$('#stantType').val()) {
      layer.msg('业务大类不能为空')
      return false
    } else if ($('#stantType').val() == '2' && !$('#serverType1').val()) {
      layer.msg('服务性质不能为空')
      return false
    } 
    // else if ($('#stantType').val() == '2' && $('#serverType1').val() == 2 && $('#stantRate').val() == '') {
    //   layer.msg('标准频度不能为空')
    //   return false
    // }
    var Param = {
      orgId: $('#orgList1').val(),
      areaId: $('#areaList1').val(),
      name: $('#business').val(),
      id: isEdit ? editID : null,
      // maintenanceType: $('#stantRate').val(),
      serverType: $('#stantType').val() !== '2' ? '1' : $('#serverType1').val(),
      type: $('#stantType').val(),
    }
    var url = isEdit ? 'standard/update' : 'standard/save'
    $.adapter_post(Param, url, function (data) {
      if (data.status == '1') {
        layer.msg(data.msg || '添加成功！')
        var query_param;
        if(!isEdit){
          query_param = '';
          window.sessionStorage.removeItem('query_param');
        } else{
          query_param =JSON.parse(window.sessionStorage.getItem('query_param'));
          if (!query_param) query_param = false;
        } 
        businessClassificationTable(query_param)
        $('#businessClassificationModal').modal('hide')
      } else {
        layer.msg(data.msg)
      }
    })
  })
}
//导出
function businessClassificationExports() {
  $.fileDownLoadExport('standard/export', true)
}

//重置
function resetForm(){
  $('.contentHeader').find('input').val('');
  $('.contentHeader').find('select').val('').searchableSelect();
  dialogEdit1(['#orgList', '#areaList'])
}