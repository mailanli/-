this.selectName = []
var type = window.sessionStorage.getItem('patrolUpdate') == 'null' ? false : true;
$(document).ready(function () {
    $('.searchable').searchableSelect();
    
    changeType()
    if (type) {
      $('.searchable').searchableSelect();

        window.sessionStorage.setItem('patrolUpdate', null);
        $.adapter_get('', 'patrolObjects/info/' + window.sessionStorage.getItem('updatePatrol'), function (d) {
            createAreaList({'area': 'area', 'project': 'project'}, d.data)
            window.sessionStorage.setItem('infoSession', d.data.pointIds)
        })
    } else {
        createAreaList({'area': 'area', 'project': 'project'})
    }
})
function getType() {
  var that = this;
  $.adapter_post({
        'areaId': $('#area').val(),
        'typeId': '3'
      }, 'management/selectName', function (res) {
    that.selectName = res.data
    selectPatrolPoint()
  })
}
function initSelect(d) {
  var html = '<div class="layui-input-block">'+
    '<select class="tableSelect" id="'+ d.id +'" name="interest" onchange="typeChange(event)">' +
      '<option value="">请选择...</option>'
  if (this.selectName.length !== 0) {
    for (var i = 0; i < this.selectName.length; i++) {
      var ele = this.selectName[i];
      if (ele.id) {
        var selected = d.typeId == ele.id ? 'selected' : ''
        html += '<option value="' + ele.id + '" ' + selected + '>' + ele.name + '</option>'
      }
    }
  }
  html += '</select></div>'
  return html
}
function typeChange(e) {
  console.log('888')
  var selected = JSON.parse(window.sessionStorage.getItem('selected'))
  var obj = {
    pointId: e.target.id,
    typeId: e.target.value
  }
  if (selected && selected.length > 0) {
    var flag = true
    for (var i = 0; i < selected.length; i++) {
      var element = selected[i];
      if (element.pointId == obj.pointId) {
        selected[i]['typeId'] = obj.typeId
        flag = false;
        break;
      }
    }
    flag ? selected.push(obj) : flag = true
  } else {
    selected = [obj]
  }
  window.sessionStorage.setItem('selected', JSON.stringify(selected))
}
function selectPatrolPoint() {
    var columnsSet = [[
        {type: 'checkbox'},
        {title: '巡逻点', field: 'name'},
        {title: '地址详情',field: 'address'},
        {title: '业务分类',
        'templet': function (d) {
          return initSelect(d);
        }
      }
    ]];
    layTable({
        'url': 'patrolPoint/selectListPage',
        'param':{ areaId: $('#area').val(), projectId:$('#project').val() },
        'method':'post',
        'tablecols':columnsSet,
        'data':'records'
    },'#selectPatrolPointTable')
}

// 控制业务类型显隐
function changeType() {
    $('#objectType').searchableSelect({
      afterSelectItem: function () {
        if (this.holder.data('value') == '1') {
          $('#businessType1').hide()
          $('#buseType').val('')
          $('#name').html('空间维护')
        } else {
          $('#businessType1').show()
          $('#name').html('线路维护')
        }
      }
    })
}
$("#all").click(function () {
    var check = $(this).prop("checked");
    $(".checkchild").prop("checked", check);
});
// 选择巡逻点
function selectPoint() {
    if (!$('#area').val()) {
      layer.msg('请选择区域')
      return false
    }
    // window.sessionStorage.removeItem('selected')
    $('#selectModal').modal();
    $('#selectPatrolPointTable').find('input:checked').prop('checked');
    var list = [];
    for (var i = 0;i<window.sessionStorage.getItem('infoSession').split(',').length ;i++){
      var data = {'id':window.sessionStorage.getItem('infoSession').split(',')[i]}
      list.push(data)
    }
    window.sessionStorage.setItem('selectPatrolPointTable',JSON.stringify(list))
    getType()
}
function createAreaList(idList, data) {
    var that = this;
    that.idList = idList;
    that.data = data;
    that.update = data ? true : false;
    if (that.update) {
      $('#patrolId').val(data.id);
      $('#timeSeries').val(data.timeSeries);
      $('#objectType').val(data.objectsType);
      $('#pointIds').val(data.pointNames);
      $("#pointIds").attr("data-d", data.pointIds);
      $('#patrolName').val(data.name)
      initUpdateSelectd('#objectType', 'objectsType')
      initUpdateSelectd('#timeSeries', 'timeSeries')
      if ($('#objectType').val() == '1') {
          $('#businessType1').hide()
          $('#buseType').val('')
          $('#name').html('空间维护')
      }
    }
    $.adapter_get('', 'userRole/getBDList', function (d) {
        var areaList = $('#' + that.idList.area);
        var data = d.data.areaList;
        areaList.find('option').remove();
        areaList.append('<option value selected>请选择区域...</option>>')
        for (var i = 0; i < data.length; i++) {
            var select = '';
            if (that.update && that.data.areaId == data[i].bdId) {
                select = 'selected'
            }
            areaList.append('<option value="' + data[i].bdId + '" ' + select + '>' + data[i].bdName + '</option>')
        }
        areaList.searchableSelect({
            afterSelectItem: function () {
              if (this.holder.data("value") == '') {
                    var proList = $('#projList');
                    proList.append('<option value selected>请选择项目...</option>>')
                    proList.searchableSelect({
                        afterSelectItem: function () {
                        }
                    })
                    return;
                }
                var statusParam = {
                    areaId: this.holder.data("value"),
                    projectId: ""
                }
                $.adapter_post({
                    'areaId': this.holder.data('value'),
                    'typeId': 3
                }, 'management/selectStandName', function (dd) {
                    var buseType = $('#buseType');
                    var dataS = dd.data;
                    buseType.find('option').remove();
                    buseType.append('<option value="" selected>请选择业务标准...</option>>')
                    for (var i = 0; i < dataS.length; i++) {
                        var select = '';
                        if (that.update && that.data.typeId == dataS[i].id) {
                            select = 'selected'
                        }
                        buseType.append('<option value="' + dataS[i].id + '" ' + select + '>' + dataS[i].standName + '</option>')
                    }
                    buseType.searchableSelect({
                      afterSelectItem: function () {
                        if (type) {
                          $('.searchable').next().find('.searchable-select-holder').css({
                            'background-color': '#fbfbfb',
                            'pointer-events': 'none'
                          }).siblings('.searchable-select-caret').css({
                            'background-color': '#fff',
                            'pointer-events': 'none'
                          })
                        }
                      }
                    })
                })
                //获取项目下拉框数据
                $.adapter_get({}, 'userRole/getProListByAreaId/' + this.holder.data("value"), function (dd) {
                    var proList = $('#' + that.idList.project);
                    var dataP = dd.data;
                    proList.find('option').remove();
                    proList.append('<option value selected>请选择项目...</option>>')
                    for (var i = 0; i < dataP.length; i++) {
                        var select = '';
                        if (that.update && that.data.projectId == dataP[i].bdId) {
                            select = 'selected'
                        }
                        proList.append('<option value="' + dataP[i].bdId + '" ' + select + '>' + dataP[i].bdName + '</option>')
                    }
                    if (proList.next().hasClass("searchable-select")) {
                        proList.next().remove();
                    }
                    proList.searchableSelect({
                        afterSelectItem: function () {
                          if (type) {
                            $('.searchable').next().find('.searchable-select-holder').css({
                              'background-color': '#fbfbfb',
                              'pointer-events': 'none'
                            }).siblings('.searchable-select-caret').css({
                              'background-color': '#fff',
                              'pointer-events': 'none'
                            })
                          }
                        }
                    })
                });
            }
        });
    })
}

function patrolObjectSave() {
    var param = {
        "id": $('#patrolId').val(),
        "name": $.trim($('#patrolName').val()),
        "areaId": $('#area').val(),
        "projectId": $('#project').val(),
        "objectsType": $('#objectType').val(),
        "timeSeries": $('#timeSeries').val(),
        "typeId": $('#objectType').val() == '1' ? null : $('#buseType').val(),
        "pointIds":$("#pointIds").attr("data-d") // window.sessionStorage.getItem('selectIDs')
    }
    if(type){
      $.adapter_post(param, 'patrolObjects/update', function (d) {
          initResult(d)
      })
    }else{
      $.adapter_post(param, 'patrolObjects/save', function (d) {
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
function initUpdateSelectd(select, key) {
  var ele = $(select)
  var select = ele.next().find('.searchable-select-items .searchable-select-item')
  for (var i = 0; i < select.length; i++) {
    if (select[i].dataset.value == data[key]) {
      $(select[i]).click()
    }
  }
}
function goBack() {
    $(".container").empty();
    var page = $("<div class='mypage' id='patrolObjectCheck'></div>");
    // window.sessionStorage.removeItem('patrolUpdate');
    // window.sessionStorage.removeItem('updatePatrol')
    var path = '/integration-admin/common/patrol/patrolObjectCheck.html'
    $(".container").append(page);
    // 加载目标网页
    window.loadPage(page[0], path);
}
// 巡逻点
function submit_points() {
    var points = JSON.parse(window.sessionStorage.getItem(tableObject.config.id));
    
    console.log("aa",points)
    var ids = '';
    var names = '';
    
    for (var i = 0; i < points.length; i++) {
        ids += points[i].id + ','
        names += points[i].name + ','
    }
    if(points[0].name){
      $('#pointIds').val('')
      $('#pointIds').val(names.substr(0, names.length - 1));
    }
    var idList = ids.substr(0, ids.length - 1);
    $("#pointIds").attr("data-d",idList)
    window.sessionStorage.setItem('selectIDs', idList)
    
    // 业务分类接口
    // $('#selectModal').modal('hide');
    // window.sessionStorage.setItem('infoSession',idList)
    var pointIdArray = idList.split(',')
    var param = [];
    var selected = JSON.parse(window.sessionStorage.getItem('selected'))
    
    if (selected && selected.length !== 0) {
      for (var i = 0; i < pointIdArray.length; i++) {
        var pointId = pointIdArray[i];
        for (var j = 0; j < selected.length; j++) {
          var item = selected[j];
          if (item['pointId'] == pointId) {
            param.push(item)
          }
        }
      }
    }
    
    if (param.length !== 0) {
      $.adapter_post(param, 'patrolPointType/save', function (d) {
        layer.msg(d.msg)
        if (d.status == '1') {
          $('#selectModal').modal('hide');
          window.sessionStorage.removeItem('selected')
         
        }
      })
    } else {
      $('#selectModal').modal('hide');
    }
    window.sessionStorage.setItem('infoSession',idList)
}

function checkAll(e) {
    var type = $(e).prop('checked');
    var allCheck = $(e).parents('thead').next().find('input:checkbox');
    if (type) {
        $(e).prop('checked', true);
    } else {
        $(e).prop('checked', false);
    }
    allCheck.click()
}
