var checkList = [];
$(document).ready(function () {
  var patrolId = window.sessionStorage.getItem('updatePatrol'); //编辑ID
  if (patrolId) {
    $(".addBtn").attr("onclick", "patrolObjectSave(" + patrolId + ")")
    $.adapter_get('', 'globalPatrolObjects/info/' + patrolId, function (d) {
      var data = d.data
      $('#patrolId').val(data.id);
      $('#name').val(data.name);
      $("#org").append('<option value=' + data.orgId + ' selected=selected>' + data.orgName + '</option>').searchableSelect();
      $("#area").append('<option value=' + data.areaId + ' selected=selected>' + data.areaName + '</option>').searchableSelect();
      $("#project").append('<option value=' + data.projectId + ' selected=selected>' + data.projectName + '</option>').searchableSelect();
      disabled()
      checkList = [].concat(data.patrolPointInfos)
      loadPointPag(data.patrolPointInfos)
      window.sessionStorage.setItem('infoSession', d.data.patrolPointInfos)
    })
  } else {
    getAreaToProject(['#org', '#area', '#project'])
    loadPointPag()
  }
  window.sessionStorage.removeItem('updatePatrol')
  $('.searchable').searchableSelect();
})
// 公司、区域、项目下拉
function getAreaToProject(array, editDatas, cb, isArea) {
  var orgList = $(array[0])
  var areaList = $(array[1])
  var proList = $(array[2])
  var editData = editDatas || { orgId: '', areaId: '', projectId: '' }
  for (var i = 0; i < array.length; i++) {
    $(array[i]).removeData()
  }
  // 公司下拉
  getOrg(orgList, '', '', function (v1) {
    clearN(array.slice(1))
    if (v1) {
      initPoint(editDatas)
      // 区域下拉
      getArea(areaList, v1, '', function (v2) {
        clearN(array.slice(2))
        if (v2) {
          initPoint(editDatas)
          if (isArea && cb) cb(v2)
          // 项目下拉
          getProject(proList, { 'areaId': v2 }, '', function (v3) {
            clearN(array.slice(3))
            if (v3) {
              initPoint(editDatas)
            }
          })
        }

      })
    }
  })

}
// 加载巡逻点模块
function loadPointPag(editData) {
  var $pointList = '#pointList';
  path = '/integration-admin/common/patrol/point.html'
  window.loadPage(pointList, path, function () {
    initPoint(editData)
  });
}
// 初始化巡逻点
function initPoint(editData) {
  handleTagDrag()
  if (editData) {
    editData.forEach(function (item, index) {
      $('#subTablePoint').closest('div').prev('.tipGroup').append('<span class="tag column"  draggable="true" data-id="' + item.id + '" data-name="' + item.name + '" data-selectName="' + item.standardTypeId + '" data-standName="' + item.standardManageId + '">' + item.name + '<i class="btnClose layui-icon">&#x1006;</i></span>')
    })
  } else {
    clearAllTip()
  }
  getEquipmentAddress(['#basedistrict', '#street', '#building', '#unity'], { 'projectId': $("#project").val() }) //
  $('#pointList').find('#submitFormEquipment').on('click', function (e) {
    $('.tipGroup').empty();
    checkList = [];
    params = equipmentTable(); //返回 {basedistrictId,streetId,buildingId,unityId,roomId}
  })

  //已选设备关闭
  $('#pointList').on('click', '.tipGroup .btnClose', function (e) {
    var curTableData = layui.table.cache[tableObject.config.id];
    for (var i = 0; i < curTableData.length; i++) {
      if (curTableData[i].id == $(e.target).parent().data('id')) {
        curTableData[i]["LAY_CHECKED"] = 'false';
        var index = curTableData[i]["LAY_TABLE_INDEX"];
        $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').prop('checked', false);
        $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').next().removeClass('layui-form-checked');
      }
    }
    for (var j = 0; j < checkList.length; j++) {
      if (checkList[j].id == $(e.target).closest('.tag').data('id')) {
        checkList.splice(j--, 1)
      }
    }
    $(this).closest('.tag').remove();
  })
  params = equipmentTable('', '', editData)
}
// 清除全部标签 
function clearAllTip(e) {
  $("#clearAllTip").nextAll().remove()
  var curTableData = layui.table.cache[tableObject.config.id];
  if (curTableData) {
    for (var i = 0; i < curTableData.length; i++) {
      curTableData[i]["LAY_CHECKED"] = 'false';
      var index = curTableData[i]["LAY_TABLE_INDEX"];
      $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').prop('checked', false);
      $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').next().removeClass('layui-form-checked');
      // }
    }
    checkList = []
  }


}
//设备查询
function submitFormEquipment() {
  checkList = [];
  $('.tipGroup').empty();
  equipmentTable()
}
//巡逻列表渲染
function equipmentTable(params, pageNo, editData) {
  getSelectName()
  var params = {
    orgId: $('#org').val() || null,
    areaId: $('#area').val() || null,
    projectId: $('#project').val() || null,
    districtId: $('#basedistrict').val() || null,
    streetId: $('#street').val() || null,
    buildingId: $('#building').val() || null,
    unitId: $('#unity').val() || null,
    roomId: $('#room').val() || null,
    isAsc: false,
    orderByField: 'createTime',
    status: 1
  }
  var columnsSet = [
    [
      { type: 'checkbox' },
      {
        title: '巡逻点',
        field: 'name'
      },
      {
        title: '地址详情',
        field: 'address'
      },
      {
        title: '地图',
        toolbar: '#viewMap', width: 80
      },
      {
        title: '业务分类',
        'templet': function (d) {
          return getSelectNamePoint(d, editData);
        }
      },
      {
        title: '业务标准',
        'templet': function (data) {
          var $html = '<select class="tableSelect standName" data-id=' + data.id + ' id="standardManageId' + data.id + '" onchange="typeChange(this,' + data.id + ',\'standardManageId\')"><option value="">请选择</option></select>'
          return $html;
        }
      },
    ]
  ]
  layTable({
    'url': 'patrolPoint/selectListPage',
    'param': params || {},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo': pageNo ? pageNo : (params == false || params) ? true : false,
    'limit': 10,
    'limits': [10, 15, 20, 30, 40, 50, 70, 80],
    'height': true,
    'done': function (d) {
      initTypeSelect(d, checkList)
    }
  }, '#subTablePoint')
  return { 'orgId': params.orgId, 'areaId': params.areaId, 'projectId': params.projectId, 'districtId': params.districtId, 'buildingId': params.buildingId, 'streetId': params.streetId, 'unitId': params.unitId, 'roomId': params.roomId, 'equipmentName': params.name }
}
// 初始化类型下拉
function initTypeSelect(d, editData) {
  var data = d.data
  for (var key in data) {
    if (editData) {
      for (var item in editData) {
        $('#standardTypeId' + editData[item].id).val(editData[item].standardTypeId)
        getStandName('#standardManageId' + editData[item].id, editData, editData[item].id, function () {
          $('#standardManageId' + editData[item].id).val(editData[item].standardManageId)

        })


      }
    }
  }
}

// 获取业务分类
function getSelectName(cb) {
  $.adapter_post({
    'areaId': $('#area').val() ? $('#area').val() : '',
    'typeId': '7'
  }, 'management/selectName', function (d) {
    sessionStorage.setItem("selectNameData", JSON.stringify(d.data))
    if (cb) cb(d.data)
  })
}
// 获取业务分类下拉内容
function getSelectNamePoint(data, editData) {
  var selectNameData = JSON.parse(sessionStorage.getItem("selectNameData"))
  var $selectNameHtml = '<select class="tableSelect selectName" id="standardTypeId' + data.id + '" onchange="typeChange(this,' + data.id + ',\'standardTypeId\')"><option value="">请选择</option>'
  var selected = ''
  for (var key in selectNameData) {
    if (editData) {
      if (data.id == editData.id && selectNameData[key].id == editData.standardTypeId) selected = "selected"
    }
    $selectNameHtml += '<option value="' + selectNameData[key].id + '" ' + selected + '>' + selectNameData[key].name + '</option>'
  }
  $selectNameHtml += ' </select>'
  return $selectNameHtml
}
// 获取业务标准
function getStandName(select, editData, id, cb) {
  var select = $(select);
  var param = {
    'areaId': $('#area').val() ? $('#area').val() : '',
    'standId': $('#standardTypeId' + id).val() ? $('#standardTypeId' + id).val() : '',
    'typeId': '7'
  }
  selectAdapterPost(select, param, 'management/selectStandName', function () {
    if (cb) { cb() }
  }, ['id', 'standName'], '', '1')

}


// 业务分类下拉触发
function typeChange(e, id, type) {
  var selVal = $(e).val()
  checkList.forEach(function(index, element){
    if(id==index.id && type == 'standardTypeId'){index.standardTypeId=selVal}else{index.standardManageId=selVal}
  })
  if (type == 'standardTypeId') {
    getStandName('#standardManageId' + id, 'editData', id, function () {
      $('#standardManageId' + id).val('')
    })
  }
  $(".tipGroup .tag").each(function () {
    if ($(this).attr("data-id") == id) {
      $(this).attr("data-selectName", $("#standardTypeId" + id).val())
      if ($("#standardTypeId" + id).val() == '') {
        $(this).attr("data-standName", '')
      } else {
        $(this).attr("data-standName", $("#standardManageId" + id).val())
      }

    }
  })
}
function patrolObjectSave(edits) {
  var flag = false
  if (!$('#name').val()) {
    layer.msg('请输入巡逻名')
    return
  }
  if (!$('#org').val()) {
    layer.msg('请选择公司')
    return
  }
  if (!$('#area').val()) {
    layer.msg('请选择区域')
    return
  }
  if (!$('#project').val()) {
    layer.msg('请选择项目')
    return
  }
  var patrolPointInfos = []
  $(".tipGroup .tag").each(function () {

    var array = {
      "id": $(this).attr("data-id"),
      "name": $(this).attr("data-name"),
      "standardTypeId": $(this).attr("data-selectname"),
      "standardManageId": $(this).attr("data-standname")
    }
    patrolPointInfos.push(array)
    if ($(this).attr("data-selectname") == '' || $(this).attr("data-standName") == '') {
      flag = true
    }
  })
  if (patrolPointInfos.length == 0) {
    layer.msg('请选择巡逻点')
    return
  }
  if (flag) {
    layer.msg('请选择业务分类和业务标准')
    return
  }
  var param = {
    "id": $('#patrolId').val(),
    "orgId": $('#org').val(),
    "areaId": $('#area').val(),
    "name": $.trim($('#name').val()),
    "objectsType": "1",
    "projectId": $('#project').val(),
    "timeSeries": 1,
    "standardTypeId": '',
    "standardManageId": '',
    "patrolPointInfos": patrolPointInfos
  }
  if (edits) {
    $.adapter_post(param, 'globalPatrolObjects/update', function (d) {
      initResult(d)
    })
  } else {
    $.adapter_post(param, 'globalPatrolObjects/save', function (d) {
      initResult(d)
    })
  }
}
function initResult(d) {
  if (d.status == '1') {
    layer.msg(d.msg)
    goBack();
  } else {
    if (d.data && d.data.indexOf('{') != -1 && JSON.parse(d.data).data) {
      if (d.data && JSON.parse(d.data).status == 'sys-0002') {
        var str = ''
        for (var key in JSON.parse(d.data).data) {
          str += JSON.parse(d.data).data[key];
        }
        layer.msg(str)
      }
    } else {
      layer.msg(d.msg)
    }
  }
}
function goBack() {
  $(".container").empty();
  var page = $("<div class='mypage' id='patrolObjectCheck'></div>");
  path = '/integration-admin/common/patrol/global/patrolObject.html'
  $(".container").append(page);
  // 加载目标网页
  window.loadPage(page[0], path);
}
// 地图 
function viewMap(locationStr) {
  layer.open({
    type: 1,
    title: false,
    closeBtn: 1,
    area: ['700px', '450px'],
    shadeClose: true,
    skin: 'yourclass',
    content: $('#pointMaps'),
    cancel: function (index) {
      //右上角关闭回调
      $("#pointMaps").removeClass('mapArea')
      layer.close(index);

    },
    success: function (layero, index) {
      $("#pointMaps").addClass("mapArea")
      // 创建地图实例
      var map = new BMap.Map("pointMaps");
      var poiArr = locationStr.split(',')
      var point = new BMap.Point(poiArr[0], poiArr[1]);
      map.centerAndZoom(point, 18);
      map.enableScrollWheelZoom(true);
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
    }
  });
}
// 设置不可编辑
function disabled() {
  $('.searchable').next().find('.searchable-select-holder').css({
    'background-color': '#fbfbfb',
    'pointer-events': 'none'
  }).siblings('.searchable-select-caret').css({
    'background-color': '#fff',
    'pointer-events': 'none'
  })
}

// 重置
function resetSearchPoint() {
  $("#basedistrict").val('').searchableSelect();
  $("#street").val('').searchableSelect();
  $("#building").val('').searchableSelect();
  $("#unity").val('').searchableSelect();
}
