var editId = '', deleteID = ''
$(document).ready(function () {
  $('#kind').searchableSelect()
  editId = window.sessionStorage.getItem('inspectionClassificatId')
  sessionStorage.removeItem('inspectionClassificatId')
  if(editId ){
    $(".contentHeader").find("h3").text("编辑分类")
    $(".addPage").find(".btnGroup").html('<button type="button" class="btn addBtn" onclick="save('+editId+')" style="margin-right:4px">保存</button><button type="button" class="btn" onclick="handleGoBack()">返回</button>')
    updateView(editId)
  }else{
    $(".contentHeader").find("h3").text("添加分类")
    getAreaProject(['#org3','#area3', '#project3'])
    // dialogEdit1(['#area3', '#project3'])
  }  
  $('#kind').val('')
  $('#addKind').html('')
  $('.sonClassify').val('')
})

// 返回
function handleGoBack(){
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractMaintenance'></div>")
  var path = 'integration-admin/common/checkManage/inspectionClassification/inspectionClassification.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 添加子类
function addKind (subclassInfo) {
  var name = subclassInfo === undefined ? '' : subclassInfo.name
  var id = subclassInfo === undefined ? '' : subclassInfo.id
  var newhtml = '<div class="x-row row_bottom">' +
    '<div class="x-col">' +
    '<div class="labText"><span style="color:#fff;">*</span>子类名</div>' +
    '<input onkeydown="checknum(this)" onkeyup="checknum(this)" type="text" data-id="' + id + '" data-name="' + name + '" value="' + name + '" maxlength="15" class="searchable-select-holder sonClassify" style="width: 70%" placeholder="限制15字">' +
    '</div>' +
    '<div class="x-col">' +
    '<button type="button" class="btn" onclick="removeKind(event)">删除</button>' +
    '</div>' +
    '</div>'
  $('#addKind').append(newhtml)
}

// 下拉框处理
function dialogEdit1 (array, editDatas) {
  for (var i = 0; i < array.length; i++) {
    $(array[i]).removeData()
  }
  // 获取区域下拉框数据
  var areaList = $(array[0])
  var proList = $(array[1])
  var editData = editDatas || {areaId: '', projectId: ''}
  selectAdapterGet(areaList, '', 'userRole/getBDList', function () {
    areaList.searchableSelect({
      afterSelectItem: function () {
        // 清空选择框
        clear(array.slice(1), 1)
        var areaId = this.holder.data('value')
        if (areaId) {
          selectAdapterGet(proList, '', 'userRole/getProListByAreaId/' + areaId, function () {
            proList.searchableSelect({
              afterSelectItem: function () {}
            })
          }, ['bdId', 'bdName'], editData.projectId, '1')
        }
      }
    })
  }, ['bdId', 'bdName'], editData.areaId, '0')
}

// 删除子类
function removeKind (e) {
  // var isEdit = $('#addModalLabel h4').hasClass('editRoom')
  var obj = $(e.target).parents('.x-row').find('.sonClassify')[0].dataset
  if (editId && obj && obj.id) {
    var isDel = sessionStorage.getItem('isDel') ? JSON.parse(sessionStorage.getItem('isDel')) : []
    isDel.push({
      id: obj.id,
      name: obj.name,
      isDel: 1
    })
    sessionStorage.setItem('isDel', JSON.stringify(isDel))
  }
  $(e.target).parents('.x-row').remove()
}

// 编辑回显
function updateView(editId){
  sessionStorage.removeItem('isDel')
  $.adapter_get({id: editId}, 'checkClassify/info/' + editId, function (d) {
        if (d.status != '1') {
          return
        }
        var data = d.data
        getAreaProject(['#org3','#area3', '#project3'], data)
        $('#kind').val(data.classify)
        $('#kind').searchableSelect()
        var subclassInfo = data.subclassInfo || []
        if (subclassInfo.length > 0) {
          for (var i = 0; i < subclassInfo.length; i++) {
            this.addKind(subclassInfo[i])
          }
        }
      })

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
// 限制字符输入
function checknum(obj){
  var nMax = 15;
  var len =$(obj).val().length;    
  if(len>nMax){
      textDom.value = textDom.value.substring(0,nMax);
      return;
  }
  // document.getElementById("in").value="你还可以输入"+(nMax-len)+"个字";
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
      select.append('<option value="" selected>请选择</option>')
      break
    case '1':
      select.append('<option value="" selected>请选择</option>')
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
        inspectionTable()
      }
    })
  })
}
// 保存
function save (editId) {
  // var isEdit = $('#addModalLabel h4').hasClass('editRoom')
  var sonClassify = []
  $('.sonClassify').each(function () {
    if (editId) {
      sonClassify.push({ id: $(this).attr('data-id'),name: $(this).val()})
    } else {
      sonClassify.push({ name: $(this).val()})
    }
  })
  layui.use(['layer'], function () {
    var layer = layui.layer
    var orgId=$('#org3').val()
    var areaId=$('#area3').val()
    var projectId=$('#project3').val()
    var classify=$('#kind').val()
    if (!areaId) {
      layer.msg('区域不能为空')
      return false
    } else if (!projectId) {
      layer.msg('项目不能为空')
      return false
    } else if (!classify) {
      layer.msg('分类名不能为空')
      return false
    }
    var Param = {
      orgId: orgId,
      areaId: areaId,
      projectId: projectId,
      classify: classify,
      id: editId ? editId : null,
      // orgId: '1',
      subclass: sonClassify
    }
    if (editId) {
      var isDel = JSON.parse(sessionStorage.getItem('isDel'))
      // sonClassify.push(isDel)
      sonClassify.push.apply(sonClassify, isDel)
      console.log("aa",isDel)
      $.adapter_put(Param, 'checkClassify/update', function (data) {
        initResult(data)
      })
    } else {
      $.adapter_post(Param, 'checkClassify/save', function (data) {
        initResult(data)
      })
    }
  })
}
function initResult (data) {
  if (data.status == '1') {
    layer.msg(data.msg || '添加成功！')
    handleGoBack()
    inspectionTable()
    
    // $('#addModal').modal('toggle')
  } else {
    layer.msg(data.msg)
  }
}
