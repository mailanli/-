
$(document).ready(function () {
  $('.searchable').searchableSelect();
  sessionStorage.removeItem('seachParams') //移除其它页面存入的session
  getAreaProject(['#orgIdL', '#area', '#projList'])
  computerRoomTable()
})

// 下拉框处理开始
/**
 * @params array [区域，项目，苑区，街道，楼栋，单元]
 */
function selects(array, editDatas) {
  // var address = $('#address')
  var pointName1 = $('#point_name1')
  var pointName2 = $('#point_name2')
  var pointName3 = $('#point_name3')
  var pointName4 = $('#point_name4')
  // 获取区域下拉框数据
  var areaList = $(array[0])
  var proList = $(array[1])
  var basedistrictList = array[2] ? $(array[2]) : null
  var streetList = array[3] ? $(array[3]) : null
  var buildingList = array[4] ? $(array[4]) : null
  var unitList = array[5] ? $(array[5]) : null
  let editData
  if (!editDatas) {
    editData = {
      areaId: '',
      projectId: '',
      districtId: '',
      streetId: '',
      buildingId: '',
      unitId: ''
    }
  } else {
    editData = editDatas
  }
  var areaName = projectName = districtName = bulidingtName = streetName = unitName = roomName = ''
  selectAdapterGet(areaList, '', 'userRole/getBDList', function () {
    areaList.searchableSelect({
      afterSelectItem: function () {
        // 清空选择框
        clear(array.slice(1), 1)
        let areaId = this.holder.data('value')
        if (areaId) {
          areaName = this.holder.text().trim()
          // this.element.data('areaName', areaName)
          selectAdapterGet(proList, '', 'userRole/getProListByAreaId/' + areaId, function () {
            proList.searchableSelect({
              afterSelectItem: function () {
                if (this.holder.data('value')) {
                  projectName = this.holder.text().trim()
                  this.element.data('projectName', projectName)
                  if (basedistrictList) {
                    selectAdapterGet(basedistrictList, {
                      'projectId': this.holder.data('value')
                    }, 'baseDistrict/selectList', function () {
                      basedistrictList.searchableSelect({
                        afterSelectItem: function () {
                          if (this.holder.data('value')) {
                            districtName = this.holder.text().trim()
                            pointName1.val(districtName)
                          } else {
                            // address.val(areaName + projectName)
                            pointName1.val('')
                            pointName2.val('')
                            pointName3.val('')
                            pointName4.val('')
                          }
                          getStreet()
                        }
                      })
                    }, ['id', 'name'], editData.districtId, '2')
                  }

                  function getStreet() {
                    if (streetList) {
                      var streetParam = {
                        'districtId': basedistrictList ? basedistrictList.val() : '',
                        'projectId': proList.val()
                      }
                      selectAdapterGet(streetList, streetParam, 'baseStreet/selectList', function () {
                        streetList.searchableSelect({
                          afterSelectItem: function () {
                            if (this.holder.data('value')) {
                              streetName = this.holder.text().trim()
                              // this.element.data('streetName', streetName)
                              // address.val(areaName + projectName + districtName + streetName)
                              pointName2.val(streetName)
                            } else {
                              streetName = ''
                              // address.val(areaName + projectName + districtName)
                              pointName2.val('')
                              pointName3.val('')
                              pointName4.val('')
                            }
                            getBuilding()
                          }
                        })
                      }, ['id', 'name'], editData.streetId, '3')
                    }
                  }

                  function getBuilding() {
                    if (buildingList) {
                      var buildingParam = {
                        'streetId': streetList ? streetList.val() : '',
                        'districtId': basedistrictList ? basedistrictList.val() : '',
                        'projectId': proList.val()
                      }
                      selectAdapterGet(buildingList, buildingParam, 'baseBuilding/selectList', function () {
                        buildingList.searchableSelect({
                          afterSelectItem: function () {
                            // 地址详情
                            if (this.holder.data('value')) {
                              bulidingtName = this.holder.text().trim()
                              this.element.data('buildingName', bulidingtName)
                              // address.val(areaName + projectName + districtName + streetName + bulidingtName)
                              pointName3.val(bulidingtName)
                            } else {
                              bulidingtName = ''
                              pointName3.val('')
                              pointName4.val('')
                            }
                            getUnit()
                          }
                        })
                      }, ['id', 'name'], editData.buildingId, '4')
                    }
                  }
                  // 单元
                  function getUnit() {
                    if (unitList) {
                      var unitParam = {
                        'buildingId': buildingList && buildingList.val() ? buildingList.val() : '',
                        'streetId': streetList ? streetList.val() : '',
                        'districtId': basedistrictList ? basedistrictList.val() : '',
                        'projectId': proList.val()
                      }
                      selectAdapterGet(unitList, unitParam, 'baseUnit/selectList', function () {
                        unitList.searchableSelect({
                          afterSelectItem: function () {
                            // 地址详情
                            if (this.holder.data('value')) {
                              unitName = this.holder.text().trim()
                              this.element.data('unitName', unitName)
                              // address.val(areaName + projectName + districtName + streetName + bulidingtName)
                              pointName4.val(unitName)
                            } else {
                              unitName = ''
                              pointName4.val('')
                            }
                          }
                        })
                      }, ['id', 'name'], editData.unitId, '5')
                    }
                  }
                } else {
                  projectName = ''
                  clear(array.slice(2), 2)
                }
              }
            })
          }, ['bdId', 'bdName'], editData.projectId, '1')
        }
      }
    })
  }, ['bdId', 'bdName'], editData.areaId, '0')
}
function clear(array, index) {
  for (var key in array) {
    if (array[key]) {
      $(array[key]).html('')
      var order = (key * 1 + index * 1).toString()
      initName($(array[key]), order)
      $(array[key]).searchableSelect({})
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
    case '2':
      select.append('<option value="" selected>请选择苑区...</option>')
      break;
    case '3':
      select.append('<option value="" selected>请选择街道...</option>')
      break;
    case '4':
      select.append('<option value="" selected>请选择楼栋...</option>')
      break;
    case '5':
      select.append('<option value="" selected>请选择单元...</option>')
      break;
    default:
      select.append('<option value="" selected>请选择...</option>')
      break;
  }
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
//重置
function resetSearch() {
  $('.contentHeader').find('input').val('');
  $('.contentHeader').find('select').val('').searchableSelect();
  getAreaProject(['#org_add', '#area_add', '#project_add'])
}


// 查询
function submitForm() {
  var param = {
    orgId: $('#orgIdL').val() ? $('#orgIdL').val() : null,
    areaId: $('#area').val() ? $('#area').val() : null,
    projectId: $('#projList').val() ? $('#projList').val() : null,
    name: $('#name').val().trim(),
    createByName: $('#createByName').val().trim()
  }
  computerRoomTable(param)
  window.sessionStorage.setItem('seachParams', null);
  window.sessionStorage.setItem('seachParams', JSON.stringify(param))
}
// 导出
function pointExport() {
  $.fileDownLoadExport('patrolPoint/export', true)
}
//  列表
function computerRoomTable(params, pageNo) {
  var columnsSet = [[
    { title: '序号', type: 'numbers' },
    { 'title': '巡逻点名称', 'field': 'name', 'width': '13%' },
    { 'title': '地址详情', 'field': 'address', 'width': '20%' },
    { 'title': '区域', 'field': 'areaName', 'width': '13%' },
    { 'title': '项目', 'field': 'projectName', 'width': '13%' },
    { 'title': '创建人', 'field': 'createByName', 'width': '13%' },
    { 'title': '创建时间', 'field': 'createTime', 'width': '13%' },
    {
      'title': '操作',
      'templet': function (d) {
        return ( // 对最后一个元素进行设置
          '<div class="btngroup"> ' +
          '<a  class="td_button_default" onclick=\'qrCode(' + JSON.stringify(d) + ')\'>二维码</a>' +
          '<a  class="td_button_default" onclick=\'deleteItem(' + d.id + ')\'>删除</a>' +
          '</div>'
        )
      }
    }
  ]]
  layTable({
    'url': 'patrolPoint/list',
    'param': params || {},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records',
    'pageNo': pageNo ? pageNo : params == false ? true : false
  }, '#computerRoomTable')
}
// 添加巡逻点
function addCommon() {
  // $('#showMap').hide()
  $('#point_name').val('')
  $('#address').val('')
  $('#locationStr').val('')
  $('#addModal').modal();
  $('#addModalLabel').html('<h4 class="modal-title" id="addModalLabel">巡逻点维护</h4>')
  initData()//初始化

}
// 根据经纬度获取地址
function getMapAddress(point,geoc) {
  geoc.getLocation(point, function (rs) {
    $('#address').val(rs.address);
  })
}
function initData() {
  var $patrolDetail = $('#patrolDetail');
  var map = new BMap.Map("pointMap");
  var geoc = new BMap.Geocoder();
  map.enableScrollWheelZoom(true);
  mapOnClickAddMarker(map, geoc);
  createMap(map, geoc)
  getOrgToAdd(['#org_add', '#area_add', '#project_add', '#district_add', '#street_add', '#building_add', '#unit_add'], '', map, geoc) //初始化下拉
  $patrolDetail.on('input', '#address', function (e) {
    setAddressToPosition(map)
    // updateMap()
    map.centerAndZoom($('#address').val(), 12);
    var local = new BMap.LocalSearch(map, {
      renderOptions: { map: map }
    });
    local.search($('#address').val());
    $('#locationStr').text('')
  })
}
// 初始化下拉
function getOrgToAdd(array, editDatas, map, geoc) {
  getAreaProject(array, editDatas, function (v) {
    $.adapter_get('', 'electronicFence/info/' + v, function (res) {
      res.status == '1' ? createMap(map, geoc, res) : layer.msg(res.msg)
    })
    var param = { 'projectId': $(array[2]).val() }
    var arrays = array.slice(3)
    getEquipmentAddress(arrays, param, editDatas, function () {
    })
  })
}

// 初始化地图
function createMap(map, geoc, res) {
  if (res) {
    updateMap(map, geoc, res)
    // getMapAddress(point, '#address')
  } else {
    // 默认为碧桂园总部
    $('#address').val('佛山碧桂园总部')
    setAddressToPosition(map)
  }
}
// 根据地址定位
function setAddressToPosition(map) {
  map.centerAndZoom($('#address').val(), 12);
  var local = new BMap.LocalSearch(map, {
      renderOptions: { map: map }
  });
  local.search($('#address').val());
  $('#locationStr').text('113.274577,22.930247')
}
//地图定位
function updateMap(map, geoc, res) {
  if (res) {
    //设置中心点
    var poiArr = res.data.locationStr.split(',')
    point = new BMap.Point(poiArr[0], poiArr[1]);
    map.centerAndZoom(point, 18); //设置中心坐标及地图级别
    var marker = new BMap.Marker(point);
    markerOn(marker, geoc)
    map.addOverlay(marker);
    $("#locationStr").html(res.data.locationStr)
    //根据经纬度获取地址
    getMapAddress(point,geoc)

    //已有电子围栏
    if (res.data.lngAndlatInfos.length > 0) {
      var lngAndlatInfos = [];
      var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "#fff",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      }
      res.data.lngAndlatInfos.forEach(function (item, index) {
        lngAndlatInfos[index] = new BMap.Point(item.lng, item.lat);
      })
      polygon = new BMap.Polygon(lngAndlatInfos, styleOptions);  //创建多边形
      map.addOverlay(polygon);
    }
  }
}
//地图点击事件--增加标注，获取经纬度及地址
function mapOnClickAddMarker(map, geoc) {
  map.addEventListener("click", function (e) {
    map.clearOverlays()
    var marker = new BMap.Marker(e.point);
    marker.enableDragging(true) //标注可拖曳
    markerOn(marker, geoc)
    map.addOverlay(marker);

    geoc.getLocation(e.point, function (rs) {
      $('#address').val(rs.address);
      $('#locationStr').text(rs.point.lng + ',' + rs.point.lat)
    });
  });
}
function markerOn(marker, geoc) {
  marker.addEventListener("dragend", function (e) {
    geoc.getLocation(e.point, function (rs) {
      $('#address').val(rs.address);
      $('#locationStr').text(rs.point.lng + ',' + rs.point.lat)
    });
  });
}

// 二维码
function qrCode(d) {
  var page = $("<div class='mypage' id='pageContractQrCode'></div>")
  var path = 'integration-admin/common/patrol/patrolDetailQRCodes.html'
  if (!$("#pageContractQrCode").length) {
    $('.container').append(page)
    $("#pageContractQrCode").prev().hide()
    window.sessionStorage.setItem('pointInfo', JSON.stringify(d))
    window.loadPage(page[0], path)
  }
}
// 添加
function add() {
  addCommon()
  this.flag = 'add'
  $('#lxtj').prop('checked', false)
}
// 添加确定
function addSure() {
  if (!$('#org_add').val()) {
    layer.msg('请选择公司')
    return false
  }
  if (!$('#area_add').val()) {
    layer.msg('请选择区域')
    return false
  } else if (!$('#project_add').val()) {
    layer.msg('请选择项目')
    return false
  }  else if (!$('#address').val()) {
    layer.msg('请填写地址详情')
    return false
  } else if (!$('#locationStr').text()) {
    layer.msg('请填写经纬信息')
    return false
  }
  var params = {
    // name: $('#point_name1').val().trim() + $('#point_name2').val().trim() + $('#point_name3').val().trim() + $('#point_name4').val().trim(),
    orgId: $('#org_add').val(),
    areaId: $('#area_add').val(),
    projectId: $('#project_add').val(),
    districtId: $('#district_add').val() ? $('#district_add').val() : null,
    streetId: $('#street_add').val() ? $('#street_add').val() : null,
    buildingId: $('#building_add').val() ? $('#building_add').val() : null,
    unitId: $('#unit_add').val() ? $('#unitId_add').val() : null,
    buildingId: $('#building_add').val() ? $('#building_add').val() : null,
    address: $('#address').val().trim(),
    locationStr: $('#locationStr').text().trim()
  }
  $.adapter_post(params, 'patrolPoint/save', function (d) {
    var isQuick = $('#lxtj').attr('checked') == true || $('#lxtj').attr('checked') == 'checked'
    if (d.status == '1' && !isQuick) {
      $('#addModal').modal('toggle');
    }
    if (d.status == '1') {
      computerRoomTable()
    }
    layer.msg(d.msg)
  })
}

// function update(id, status) {
//   this.updateId = id;
//    $('#lxtj').prop('checked', false)
//   this.flag = 'update';
//   $('#delete').modal();
//   if (status == '1') {
//     $('#delete .modal-body').html('是否冻结')
//     this.status = '0'
//   } else {
//     $('#delete .modal-body').html('是否解冻')
//     this.status = '1';
//   }
// }
// 删除
function deleteItem(id) {
  $.adapter_get('', 'patrolPoint/check/' + id, function (d) {
    if (d.data) {
      layer.msg("已关联巡逻对象，不能删除哦")
      return
    } else {
      this.deleteId = id;
      this.flag = 'delete';
      $('#delete').modal();
      $('#delete .modal-body').html('是否删除')

    }
  })


}
// 冻结删除确定
function sure() {
  var url, param;
  // if (this.flag == 'update') {
  //   url = 'patrolPoint/updateStatus'
  //   param = {
  //     id: this.updateId,
  //     status: this.status
  //   }
  // } else if (this.flag == 'delete') {
  url = 'patrolPoint/delete/' + this.deleteId
  param = {
    id: this.deleteId
  }
  // }
  var that = this;
  $.adapter_post(param, url, function (d) {
    layer.msg(d.msg)
    $('#delete').modal('toggle');
    if (d.status == '1') {
      that.status = ''
      that.updateId = ''
      that.deleteId = ''
      var pageNo = parseInt($('#computerRoomTable').next().find('em').text());
      var seachParams = JSON.parse(window.sessionStorage.getItem('seachParams'))
      if (!seachParams) seachParams = false;
      computerRoomTable(seachParams, pageNo)
    }
  })
}
