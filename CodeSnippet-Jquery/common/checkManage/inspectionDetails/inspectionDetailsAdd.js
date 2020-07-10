var editId = '', deleteID = ''
$(document).ready(function () {
  editId = window.sessionStorage.getItem('inspectionDetailsId')
  sessionStorage.removeItem('inspectionDetailsId')
  if(editId ){
    $(".contentHeader").find("h3").text("编辑详情")
    $(".addPage").find(".btnGroup").html('<button type="button" class="btn addBtn" onclick="save('+editId+')" style="margin-right:10px">保存</button><button type="button" class="btn" onclick="handleGoBack()">返回</button>')
    updateView(editId)
  }else{
    $(".contentHeader").find("h3").text("添加详情")
    initSelect(['#org3','#area3', '#project3'],['#kind'])
  }  
  // $('.searchable').searchableSelect()
  $('#descriptions').hide()
})
//初始下拉
function initSelect(array,objarray,editData){
  var classList=$(objarray[0]);
  getAreaProject(array,editData,function(projectId){
    if(projectId){
      selectAdapterGet(classList, {'projectId': projectId}, 'checkClassify/selectList', function () {
        classList.searchableSelect({
          afterSelectItem: function () {
            if (editData && editData.classifyId) {
              $('.searchable').next().find('.searchable-select-holder').css({
                'background-color': '#fbfbfb',
                'pointer-events': 'none'
              }).siblings('.searchable-select-caret').css({
                'background-color': '#fff',
                'pointer-events': 'none'
              })
            } else {
              $('#kind, #area3, #project3').next().find('.searchable-select-holder').css({
                'background-color': '#fff'
              })
            }
            var checkClassify = this.holder.data('value');
            if (checkClassify && !editData) {
              $.adapter_post({'projectId': projectId,'checkClassify': checkClassify}, 
                'checkClassify/subclass', function (d) {
                  if (d.status == '1') {
                    initSubClass(d.data.subclassInfo)
                  } else {
                    $('#descriptions').html('')
                  }
              })
            }
          }
        })
      }, ['classifyid', 'name'], editData?editData.classifyId:'', '2')
    }
  })
}
// 返回
function handleGoBack(){
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractMaintenance'></div>")
  var path = 'integration-admin/common/checkManage/inspectionDetails/inspectionDetails.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 编辑回显
function updateView(editId){
  sessionStorage.removeItem('isDel')
  $('#lxtj').attr('checked', false)
  $('#descriptions').html('')
  $('#continueBox').hide()
  $.adapter_get({id: editId}, 'checkDetails/info/' + editId, function (d) {
        if (d.status != '1') {
          return
        }
        var editData = d.data
        initSelect(['#org3','#area3', '#project3'],['#kind'],editData)
        $('#effectStandard').val(editData.effectStandard);
        $('#grade').val(editData.score);
        $('#checkStandard').val(editData.describe);
        initSubClass(editData.subclassDetails, true);
      })

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
      select.append('<option value="" selected>请选择</option>')
      break
    case '1':
      select.append('<option value="" selected>请选择</option>')
      break
    case '2':
      select.append('<option value="" selected>请选择</option>')
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
        detailsTable()
      }
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
function save (editId) {
  // var editId = $('#addModalLabel h4').hasClass('editRoom')
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
        id: editId ? this.dataset.id : null,
        describe: this.value
      })
    })
    var Param = {
      'criterionId': editId ? editId : null,
      'classifyId': $('#kind').val(),
      'descriptions': description,
      'score': $('#grade').val(),
      'effectStandard': $('#effectStandard').val(),
      'description': $('#checkStandard').val()
    }
    if (editId) {
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
    console.log( $("#lxtj").val())
    layer.msg(data.msg || '添加成功！')
    if(! $("#lxtj").attr('checked') ){
      handleGoBack()

      detailsTable()
    }
    
  } else {
    layer.msg(data.msg)
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
        '<div class="labText subName">' + ele.subclassName + '</div>' +
        '<input type="text" data-subclassId="' + ele.subclassId + '" data-id="' + ele.id + '" value="' + ele.describe + '" class="searchable-select-holder sub"  placeholder="请输入描述(可留空)">' +
        '</div>'
    } else {
      html += '<div class="x-row row_bottom">' +
        '<div class="labText subName" >' + ele.name + '</div>' +
        '<input type="text" data-subclassId="' + ele.subclassId + '" class="searchable-select-holder sub"  placeholder="请输入描述(可留空)">' +
        '</div>'
    }
  }
  $('#descriptions').html(html)
  $('#descriptions').show()
  $('#descriptions').on('mouseover', '.subName', function (e) {
    layer.tips(e.target.innerText, $(this));
    // tip_index = layer.tips(e.target.innerText.slice(1), '.subName', {
    //   tips: [2, 'noto'],
    //   // area: ['500px', '300px'],
    //   area: 'auto',
    //   // offset: ['500px', '1000px'],
    //   time: 1000 //还可配置颜色
    // });
  })

}
//校验分值
$("#grade").on("change", function (e) {
  var val=$.trim($(this).val());
  if(val == 0 || val > 100 ) {
    layer.msg("分值检验必须大于0小于等于100")
    $(this).val('')
  }
});


