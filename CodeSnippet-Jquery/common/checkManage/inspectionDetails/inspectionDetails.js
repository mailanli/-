var editID = '', deleteID = ''
$(document).ready(function () {
  var pageFlag = window.sessionStorage.getItem('pageFlag')
  var seachParams = window.sessionStorage.getItem('seachParams')
  window.sessionStorage.removeItem('pageFlag')
  var pageNo = window.sessionStorage.getItem('pageNo')
  if (seachParams && (pageFlag == 'edit')) {
    var data = JSON.parse(seachParams);
    detailsTable(data,pageNo)
    getAreaProject(['#orgIdL','#area2', '#projListC'], data)
    $('#classifyL').val(data.classify)
  }else if(pageFlag == 'edit'){
    detailsTable('',pageNo)
    getAreaProject(['#orgIdL','#area2', '#projListC'])
  } else {
    sessionStorage.removeItem('seachParams') //移除其它页面存入的session
    detailsTable()
    getAreaProject(['#orgIdL','#area2', '#projListC'])
  }
  sessionStorage.removeItem('pageNo')
  $('#descriptions').hide()
  $('#classifyL').searchableSelect()

})

function detailsTable (params,pageNo) {
  var columnsSet = [
    [
      {
        'title': '区域',
        'field': 'areaName'
      },
      {
        'title': '项目',
        'field': 'projectName'
      },
      {
        'title': '检查分类',
        'field': 'classifyName'
      },
      {
        'title': '检查标准',
        'field': 'classifyDetails',
        'width': '35%'
      },
      {
        'title': '分值',
        'field': 'score'
      },
      {
        'title': '创建时间',
        'field': 'createTime'
      },
      {
        'title': '创建人',
        'field': 'createByName'
      },
      {
        'title': '操作',
        toolbar: '#barDemo'
      }
    ]
  ]
  layTable({
    'url': 'checkDetails/list',
    'param': params || {},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo': pageNo ? pageNo : params == false ? true : false
  }, '#detailsTable')
}

// 查询
function submitForm () {
  var param = {
    orgId: $('#orgIdL').val() ? $('#orgIdL').val() : null,
    areaId: $('#area2').val() ? $('#area2').val() : null,
    projectId: $('#projListC').val() ? $('#projListC').val() : null,
    classify: $('#classifyL').val() ? $('#classifyL').val() : null
  }
  window.sessionStorage.setItem('seachParams', JSON.stringify(param))
  detailsTable(param)
  // console.log('aa',param)
}
// 重置
function resetForm () {
  getAreaProject(['#orgIdL','#area2', '#projListC'])
  $(".searchFrom").find("select").val('').searchableSelect()
  $(".searchFrom").find("input").val('')

}

// 新增
function handleAdd(){
  sessionStorage.removeItem('seachParams')
  sessionStorage.removeItem('pageFlag')
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractAdd'></div>")
  var path = 'integration-admin/common/checkManage/inspectionDetails/inspectionDetailsAdd.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}
// 表格预览
function previewTable(){
  $('.container').empty()
  var page = $("<div class='mypage' id='previewTable'></div>")
  var path = 'integration-admin/common/checkManage/inspectionDetails/inspectionDetailViewTable.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
  window.sessionStorage.setItem('pageFlag', 'edit')
}
// 编辑
function update (edit) {
  sessionStorage.setItem('pageNo',parseInt($('#detailsTable').next().find('em').text()));
  sessionStorage.removeItem('isDel')
  sessionStorage.removeItem('pageFlag')
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractAdd'></div>")
  var path = 'integration-admin/common/checkManage/inspectionDetails/inspectionDetailsAdd.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
  window.sessionStorage.setItem("inspectionDetailsId", edit.criterionId)
  window.sessionStorage.setItem('pageFlag', 'edit')
}


function adapterDataToArry (select, data, option, editDataID, order) {
  for (var key in data) {
    if (Array.isArray(data[key])) {
      select.html('')
      initName(select, order)
      if (data[key].length == 1 && !editDataID && (order == '0' || order == '1')) {
        select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
      } else {
        for (var i = 0; i < data[key].length; i++) {
          var listData = data[key][i]
          var selectType = editDataID == listData[option[0]]? 'selected' : ''
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
    case '2':
      select.append('<option value="" selected>请选择业务分类</option>')
      break
    default:
      select.append('<option value="" selected>请选择</option>')
      break
  }
}

// 删除处理
function deleteItem (data) {
  deleteID = data.criterionId
  $.adapter_get('', 'checkDetails/checkLast/' + data.projectId, function (d) {
    if (d.data) {
      $('#delete .modal-body').html('该项目存在监评策略，删除本详情后则策略暂停执行，确定删除吗？')
      $('#delete').modal('toggle')
    } else {
      $('#delete .modal-body').html('是否删除')
      $('#delete').modal('toggle')
    }
  })
}

function deleteSure () {
  var id = deleteID
  layui.use(['layer'], function () {
    var layer = layui.layer
    $.adapter_delete('', 'checkDetails/delete/' + id, function (d) {
      layer.msg(d.msg)
      $('#delete').modal('toggle')
      if (d.status == '1') {
        var pageNo=parseInt($('#detailsTable').next().find('em').text());
        var seachParams=JSON.parse(window.sessionStorage.getItem('seachParams'))
        if(!seachParams) seachParams = false;
        detailsTable(seachParams ,pageNo )      }
    })
  })
}

function fixScore (e) {
  var value = e.target.value.trim()
  if (!value) { return }
  if (!/^[0-9]+(.[0-9]+)?$/.test(value)) {
    layer.msg('分值必须输入正数')
    return false
  }
  $('#grade').val(Number(value.toString().match(/^\d+(?:\.\d{0,2})?/)))
}
function save () {
  var isEdit = $('#addModalLabel h4').hasClass('editRoom')
  layui.use(['layer'], function () {
    var layer = layui.layer
    if (!$('#area3').val()) {
      layer.msg('区域不能为空')
      return false
    } else if (!$('#project3').val()) {
      layer.msg('项目不能为空')
      return false
    } else if (!$('#kind').val()) {
      layer.msg('分类名不能为空')
      return false
    } else if (!$('#grade').val()) {
      layer.msg('分值不能为空')
      return false
    } else if (!/^[0-9]+(.[0-9]+)?$/.test($('#grade').val())) {
      layer.msg('分值必须输入正数')
      return false
    } else if (!$('#checkStandard').val().trim()) {
      layer.msg('检查标准不能为空')
      return false
    }
    var description = []
    $('#descriptions .sub').each(function () {
      description.push({
        subclassId: this.dataset.subclassid,
        id: isEdit ? this.dataset.id : null,
        describe: this.value
      })
    })
    var Param = {
      'criterionId': isEdit ? editID : null,
      'classifyId': $('#kind').val(),
      'descriptions': description,
      'score': $('#grade').val(),
      'description': $('#checkStandard').val()
    }
    if (isEdit) {
      $.adapter_put(Param, 'checkDetails/update', function (data) {
        initResult(data)
      })
    } else {
      $.adapter_post(Param, 'checkDetails/save', function (data) {
        initResult(data)
      })
    }
  })
}
function initResult(data) {
  if (data.status == '1') {
    layer.msg(data.msg || '添加成功！')
    detailsTable()
  } else {
    layer.msg(data.msg)
  }
  var isQuick = $('#lxtj').attr('checked') == true || $('#lxtj').attr('checked') == 'checked'
  if (isQuick) {
    // $('#grade').val('')
    // $('#checkStandard').val('')
  } else {
    $('#addModal').modal('toggle')
  }
}
function initSubClass (subclassInfo, flag) {
  if(!subclassInfo) {
    return false
  }
  var html = ''
  for (var i = 0; i < subclassInfo.length; i++) {
    var ele = subclassInfo[i]
    if (flag) {
      html += '<div class="x-row row_bottom">' +
        '<div class="labText subName" style="width: 10%"><span style="color:#fff;">*</span>' + ele.subclassName + '</div>' +
        '<input type="text" data-subclassId="' + ele.subclassId + '" data-id="' + ele.id + '" value="' + ele.describe + '" class="searchable-select-holder sub" style="width: 70%"  placeholder="请输入描述">' +
        '</div>'
    } else {
      html += '<div class="x-row row_bottom">' +
        '<div class="labText subName" style="width: 10%"><span style="color:#fff;">*</span>' + ele.name + '</div>' +
        '<input type="text" data-subclassId="' + ele.subclassId + '" class="searchable-select-holder sub" style="width: 70%"  placeholder="请输入描述">' +
        '</div>'
    }
  }
  $('#descriptions').html(html)
  $('#descriptions').show()
  $('#descriptions').on('mouseover', '.subName', function (e) {
    tip_index = layer.tips(e.target.innerText.slice(1), '.subName', {
      tips: [2, 'noto'],
      area: 'auto',
      time: 1000 //还可配置颜色
    });
  })

}


