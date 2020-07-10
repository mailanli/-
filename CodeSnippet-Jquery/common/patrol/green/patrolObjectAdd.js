var checkList = [];
$(document).ready(function () {
  var patrolId = window.sessionStorage.getItem('updatePatrol'); //编辑ID
  if (patrolId) {
    $(".addBtn").attr("onclick", "patrolObjectSave(" + patrolId + ")")
    $.adapter_get('', 'greenPatrolObjects/info/' + patrolId, function (d) {
      var data = d.data
      $('#patrolId').val(data.id);
      $('#name').val(data.name);
      getAreaToProject(['#org', '#area', '#project'], data)
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
  var arrays=['#org', '#area', '#project','#standardTypeId','#standardManageId']
  var editData = editDatas || { orgId: '', areaId: '', projectId: '' }
  if (editDatas) {
    orgList.append('<option value=' + editDatas.orgId + ' selected=selected>' + editDatas.orgName + '</option>').searchableSelect();
    areaList.append('<option value=' + editDatas.areaId + ' selected=selected>' + editDatas.areaName + '</option>').searchableSelect();
    proList.append('<option value=' + editDatas.projectId + ' selected=selected>' + editDatas.projectName + '</option>').searchableSelect();
    $("#standardTypeId").append('<option value=' + editDatas.patrolPointInfos[0].standardTypeId + ' selected=selected>' + editDatas.patrolPointInfos[0].standardTypeName + '</option>').searchableSelect();
    $("#standardManageId").append('<option value=' + editDatas.patrolPointInfos[0].standardManageId + ' selected=selected>' + editDatas.patrolPointInfos[0].standardManageName + '</option>').searchableSelect();
    disabled()
  } else {
    for (var i = 0; i < array.length; i++) {
      $(array[i]).removeData()
    }
    // 公司下拉
    getOrg(orgList, '', '', function (v1) {
      clearN(arrays.slice(1))
      if (v1) {
        // initPoint(editDatas)
        // 区域下拉
        getArea(areaList, v1, '', function (v2) {
          clearN(arrays.slice(2))
          if (v2) {
            initPoint(editDatas)
            if (isArea && cb) cb(v2)
            // 项目下拉
            getProject(proList, { 'areaId': v2 }, '', function (v3) {
              clearN(arrays.slice(3))
              if (v3) {
                initPoint(editDatas)
                getSelectName('#standardTypeId',editDatas,function (v4) {
                  clearN(arrays.slice(4))
                  if(v4){
                    getStandName('#standardManageId',editDatas,function (v5) {
                      if(v5){
                        initPoint(editDatas)
                      }
                    })
                  }
                  
                })

              }
            })
          }

        })
      }
    })
  }
}
// 加载巡逻点模块
function loadPointPag(editData) {
  var $pointList = '#pointList';
  path = '/integration-admin/common/patrol/point.html'
  window.loadPage(pointList, path, function () {
    $(".pointPag").find("table").attr("id","subTableEquipment")
    initPoint(editData)
  });
}
// 初始化巡逻点
function initPoint(editData) {
  handleTagDrag()
  if (editData) {
    editData.forEach(function (item, index) {
      $('#subTableEquipment').closest('div').prev('.tipGroup').append('<span  class="tag column"  draggable="true" data-id="' + item.id + '" data-name="' + item.name + '" data-selectName="' + item.standardTypeId + '" data-standName="' + item.standardManageId + '">' + item.name + '<i class="btnClose layui-icon">&#x1006;</i></span>')
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
  // debugger
  // params = equipmentTable();

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
  // debugger
  // 业务分类、标准下拉和列表数据
  params = equipmentTable('', '', editData)
  // getSelectName(function () {
  //   getStandName(function () {
  //     
  //   })
  // })
  // // 标签拖
  // $(".tag").Tdrag({
  //   scope: ".boxList",
  //   pos: true,
  //   dragChange: true,
  //   changeMode: "sort",
  //   moveClass: "abc"
  // });
}
// 全部清除
function clearAllTip(e) {
  $("#clearAllTip").nextAll().remove()
  var curTableData = layui.table.cache[tableObject.config.id];
  if (curTableData) {
    for (var i = 0; i < curTableData.length; i++) {
      // if (curTableData[i].id == $(e.target).parent().data('id')) {
      curTableData[i]["LAY_CHECKED"] = 'false';
      var index = curTableData[i]["LAY_TABLE_INDEX"];
      $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').prop('checked', false);
      $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').next().removeClass('layui-form-checked');
      // }
    }
    checkList = []
    // $(e).closest('.tag').remove();
  }


}
//设备查询
function submitFormEquipment() {
  // debugger
  checkList = [];
  $('.tipGroup').empty();
  equipmentTable()
}
//巡逻列表渲染
function equipmentTable(params, pageNo, editData) {
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
      // {
      //   title: '业务分类',
      //   'templet': function (d) {
      //     return getSelectNamePoint(d, editData);
      //   }
      // },
      // {
      //   title: '业务标准',
      //   'templet': function (d) {
      //     return getStandNamePoint(d, editData);
      //   }
      // },
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
    'limits': [ 10, 15, 20, 30, 40, 50, 70, 80],
    'height': true
  }, '#subTableEquipment')
  return { 'orgId': params.orgId, 'areaId': params.areaId, 'projectId': params.projectId, 'districtId': params.districtId, 'buildingId': params.buildingId, 'streetId': params.streetId, 'unitId': params.unitId, 'roomId': params.roomId, 'equipmentName': params.name }
}
// 获取业务分类
function getSelectName(select,editData, cb) {
  var select = $(select);
  var param={
    'areaId': $('#area').val() ? $('#area').val() : '',
    'typeId': '8'
  }
  selectAdapterPostN(select, param, 'management/selectName', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['id', 'name'], '', '1')
}
// 获取业务标准
function getStandName(select,editData, cb) {
  var select = $(select);
  var param={
      'areaId': $('#area').val() ? $('#area').val() : '',
      'standId':$('#standardTypeId').val() ? $('#standardTypeId').val() : '',
      'typeId': '8'
    }
    selectAdapterPostN(select, param, 'management/selectStandName', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['id', 'standName'], '', '1')

}
// 业务分类、业务标准下拉触发
function typeChange(e, id, type) {
  var selVal = $(e).val()
  $(".tipGroup .tag").each(function () {
    if ($(this).attr("data-id") == id) {
      type == 'selectName' ? $(this).attr("data-selectName", 'selVal') : $(this).attr("data-standName", 'selVal')
    }
  })
}
function patrolObjectSave(edits) {
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
  if (!$('#standardTypeId').val()) {
    layer.msg('请选择业务分类')
    return
  }
  if (!$('#standardManageId').val()) {
    layer.msg('请选择业务标准')
    return
  }
  var patrolPointInfos = []
  $(".tipGroup .tag").each(function () {
    var array = {
      "id": $(this).attr("data-id"),
      "name": $(this).attr("data-name"),
      "standardTypeId": '',
      "standardManageId": ''
    }
    patrolPointInfos.push(array)
  })
  if (patrolPointInfos.length == 0) {
    layer.msg('请选择巡逻点')
    return
  }
  // var objectsType = sessionStorage.getItem('objectTypeId');
  var param = {
    "id": $('#patrolId').val(),
    "orgId": $('#org').val(),
    "areaId": $('#area').val(),
    "name": $.trim($('#name').val()),
    "objectsType": "2",
    "projectId": $('#project').val(),
    "timeSeries": 1,//是否有时序
    "standardTypeId": $('#standardTypeId').val(),
    "standardManageId": $('#standardManageId').val(),
    "patrolPointInfos": patrolPointInfos
  }

  if (edits) {
    $.adapter_post(param, 'greenPatrolObjects/update', function (d) {
      initResult(d)
    })
  } else {
    $.adapter_post(param, 'greenPatrolObjects/save', function (d) {
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
  path = '/integration-admin/common/patrol/green/patrolObject.html'
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
// // 获取业务分类
// function getType(cb) {
//   var that = this;
//   $.adapter_post({
//     'areaId': $('#area').val(),
//     'typeId': '8'
//   }, 'management/selectName', function (res) {
//     that.selectName = res.data
//     if (cb) cb(res.data)
//   })
// }
// // 获取业务标准
// function getBuseType(cb) {
//   var that = this;
//   $.adapter_post({
//     'areaId': $('#area').val(),
//     'typeId': '8'
//   }, 'management/selectStandName', function (res) {
//     that.selectName = res.data
//     if (cb) cb(res.data)
//   })
// }