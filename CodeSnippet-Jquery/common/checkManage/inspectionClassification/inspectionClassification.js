var editID = '', deleteID = ''
$(document).ready(function () {
  var pageFlag = window.sessionStorage.getItem('pageFlag')
  var seachParams = window.sessionStorage.getItem('seachParams')
  window.sessionStorage.removeItem('pageFlag')
  var pageNo = window.sessionStorage.getItem('pageNo')
  if (seachParams && (pageFlag == 'edit')) {
    var data = JSON.parse(seachParams);
    inspectionTable(data,pageNo)
    getAreaProject(['#org2','#area2', '#projListC'], data)
    $('#contractName').val(data.name)
    $('#contractCode').val(data.contractNum)
  }else if(pageFlag == 'edit'){
    inspectionTable('',pageNo)
    getAreaProject(['#org2','#area2', '#projListC'])
  }else{
    inspectionTable(false)
    getAreaProject(['#org2','#area2', '#projListC'])

  }
  $('.searchable').searchableSelect()
  sessionStorage.removeItem('pageNo')
})

function inspectionTable (params,pageNo) {
  var columnsSet = [
    [
    //   {
    //   title: '序号',
    //   type: 'numbers'
    // },
      // {
      //   'title': '公司',
      //   'field': 'name',
      //   'width': '12%'
      // },
      {
        'title': '区域',
        'field': 'areaName'
      },
      {
        'title': '项目',
        'field': 'projectName',
      },
      {
        'title': '检查分类',
        'field': 'classifyName'
      },
      {
        'title': '检查子类',
        'field': 'subclassInfo',
        'width': '35%'
      },
      {
        'title': '创建人',
        'field': 'createByName'
      },
      {
        'title': '操作',
        'toolbar': '#barDemo'
      }
    ]
  ]
  layTable({
    'url': 'checkClassify/list',
    'param': params || {},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo': pageNo ? pageNo : params == false ? true : false
  }, '#inspectionTable')
}

// 查询
function submitForm () {
  var param = {
    orgId: $('#org2').val() ? $('#org2').val() : null,
    areaId: $('#area2').val() ? $('#area2').val() : null,
    projectId: $('#projListC').val() ? $('#projListC').val() : null
  }
  inspectionTable(param)
  window.sessionStorage.setItem('seachParams', JSON.stringify(param))
  // console.log("cc",window.sessionStorage.getItem('seachParams'))
}
// 重置
function resetForm () {
  getAreaProject(['#org2','#area2', '#projListC'])
}

// 新增
function handleAdd(){
  sessionStorage.removeItem('seachParams')
  sessionStorage.removeItem('pageFlag')
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractAdd'></div>")
  var path = 'integration-admin/common/checkManage/inspectionClassification/inspectionClassificatAdd.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}
// 编辑
function update (edit) {
  sessionStorage.setItem('pageNo',parseInt($('#inspectionTable').next().find('em').text()));
  sessionStorage.removeItem('isDel')
  sessionStorage.removeItem('pageFlag')
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractAdd'></div>")
  var path = 'integration-admin/common/checkManage/inspectionClassification/inspectionClassificatAdd.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
  window.sessionStorage.setItem("inspectionClassificatId", edit.id)
  window.sessionStorage.setItem('pageFlag', 'edit')

}

function adapterDataToArry (select, data, option, editDataID, order) {
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

function clear (array, index) {
  for (var key in array) {
    if (array[key]) {
      $(array[key]).html('')
      var order = (key * 1 + index).toString()
      initName($(array[key]), order)
      $(array[key]).searchableSelect({})
    }
  }
}

function initName (select, order) {
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

// 删除处理
function deleteItem (data) {
  $('#delete').modal('toggle')
  $('#delete .modal-body').html('检查分类'+ data.classifyName + '将被删除')
  deleteID = data.id
}

function deleteSure () {
  var id = deleteID
  layui.use(['layer'], function () {
    var layer = layui.layer
    $.adapter_delete('', 'checkClassify/delete/' + id, function (d) {
      layer.msg(d.msg)
      $('#delete').modal('toggle')
      if (d.status == '1') {
        var pageNo=parseInt($('#inspectionTable').next().find('em').text());
        inspectionTable( JSON.parse(window.sessionStorage.getItem('seachParams')),pageNo )
        inspectionTable(false)

      }
    })
  })
}

