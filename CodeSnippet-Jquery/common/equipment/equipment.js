var tabledata_type2 = [];
$(document).ready(function () {
  equipTable()
  // getAreaProjectRoom(['#orgId','#area', '#projList', '#roomId'])
  getAreaProjectRoom(['#orgId','#areaId', '#projectId', '#roomId'])
  layui.config({
    base: '/integration-admin/plugins/treeTable/'
  }).extend({
    treetable: 'treetable-lay/treetable'
  })
  clearTypeId()
  getTreeData()
});
// 时间控件
$(function () {
  jeDate("#beginCreateTime", {
    format: "YYYY-MM-DD",
    isTime: false
  })
  jeDate("#endCreateTime", {
    format: "YYYY-MM-DD",
    isTime: false
  })
  jeDate("#beginFinishTime", {
    format: "YYYY-MM-DD",
    isTime: false
  })
  jeDate("#endFinishTime", {
    format: "YYYY-MM-DD",
    isTime: false
  })
});
function equipTable (params) {
  var columnsSet = [[
    { title: '序号',type: 'numbers'},
    { title: '设备名',field: 'name'},
    { title: '机房',field: 'roomName'},
    { title: '项目',  field: 'projectName' },
    { title: '区域', field: 'areaName' },
    { title: '创建人', field: 'createByName'},
    {
      title: '创建时间',
      'templet': function (d) {
        return d.createTime
      }
    },
    { title: '操作', toolbar: '#barDemo'}
  ]]
    layTable({
        'url' :'equipmentArchives/list',
        'param':params || {},
        'method':'post',
        'tablecols':columnsSet,
        'data':'records'
    },'#equipTable')
}

function periodicTask (taskId, params) {
   var columnsSet = [[
    { title: '序号',type: 'numbers'},
    { title: '设备名',field: 'name'},
    { title: '项目',field: 'projectName'},
    { title: '设备类型',field: 'type'},
    { title: '任务名称',field: 'jobName'},
    { title: '实施标准',field: 'policyName'},
    { title: '执行人',field: 'dealPeople'},
    {
      title: '上次维保时间',
      templet: function (d) {
        return d.dealTime
      }
    },
    { title: '处理意见',field: 'dealResult'}
  ]]
  if (params) {
    params.id = taskId
  }
  layTable({
      'url': 'equipmentArchives/selectPolicy',
      'param':params || {id: taskId},
      'method':'post',
      'tablecols':columnsSet,
      'data':'records'
  },'#periodicTask')
}
// 设备修改状态
function equipmentStatus (id) {
  var columnsSet = [[
    {
      title: '序号',
      type: 'numbers',
      align: 'center'
    },
    { 'title': '设备名', field: 'name', align:'center'},
    { 'title': '设备机房', 'field': 'roomName', align:'center'},
    { 'title': '所属项目', 'field': 'projectName', align:'center'},
    { 'title': '所属区域', 'field': 'areaName', align:'center'},
    {
      'title': '操作时间',
      'templet': function (d) {
        return d.operationTime
      }
    },
    { 'title': '操作人', 'field': 'operationPeople'},
    { 'title': '操作内容', 'field': 'operationContent'},
    { 'title': '备注', 'field': 'remake'}
  ]]
  layTable({
    'url': 'equipmentArchives/selectRecode',
    'param': {id: id},
    'method': 'post',
    'tablecols': columnsSet,
    'data': 'records'
  }, '#equipmentStatus')
}
/* function initTime(d,key) {
  if (d[key]) {
    var time = new Date(d[key]);
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() +
    ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
  } else {
    return ''
  }
} */
function viewFile (archives) {
  $('#viewFiles').modal()
  $('#equipmentNameLook').html(archives.name)
  $('#equipmentCodeLook').html(archives.inputCode)
  $('#brandNameLook').html(archives.brandName)
  $('#versionNameLook').html(archives.versionName)
  $('#areaLook').html(archives.areaName)
  $('#roomNameLook').html(archives.roomName)
  $('#projectLook').html(archives.projectName)
  $('#yearLook').html(archives.keepYears)
  $('#inWorkTimeLook').html(archives.inWorkTime)
  $('#statusLook').html(archives.status)
  $('#addressLook').html(archives.address)
  $('#equipmentPicture').attr('src', '/integration-admin/images/img_default.jpg')
  if (archives.picture && archives.picture.length > 5) {
    var url= archives.picture
    $('#equipmentPicture').attr('src', url)
  }
  periodicTask(archives.id)
  this.archivesId = archives.id;
  equipmentStatus(archives.id)
}

// 导出
function equipmentExports() {
  $.fileDownLoadExport('equipmentArchives/exportEquipment', true)
}

// 周期任务记录导出
function exportTask() {
  var id = this.archivesId;
  var dealPeople = $('#person').val().trim() ? $('#person').val().trim() : null
  var beginDealTime = $('#beginFinishTime').val() ? $('#beginFinishTime').val() : null
  var endDealTime = $('#endFinishTime').val() ? $('#endFinishTime').val() : null
  var str = '?id='+ id +'&dealPeople=' + dealPeople + '&beginDealTime=' + beginDealTime + '&endDealTime=' + endDealTime + '&token=' + getCookie('token');
  $.fileDownLoadExport('equipmentArchives/export' + str)
}
// 查询数据
function submitForm () {
  var param = {
    createByName: $('#create_by').val().trim() ? $('#create_by').val().trim(): null,
    orgId: $('#orgId').val() ? $('#orgId').val() * 1 : null,
    areaId: $('#areaId').val() ? $('#areaId').val() * 1 : null,
    beginCreateTime: $('#beginCreateTime').val() ? $('#beginCreateTime').val() : null,
    endCreateTime: $('#endCreateTime').val() ? $('#endCreateTime').val() : null,
    equipmentName: $('#name').val().trim() ? $('#name').val().trim() : null,
    projectId: $('#projectId').val() ? $('#projectId').val() : null,
    roomId: $('#roomId').val() ? $('#roomId').val() : null,
    typeId: this.typeId2 ? this.typeId2 : null
  }
  equipTable(param)
}
// 周期任务查询
function searchForm() {
  var params = {};
  params.dealPeople = $('#person').val().trim() ? $('#person').val().trim() : null
  params.beginDealTime = $('#beginFinishTime').val() ? $('#beginFinishTime').val() : null
  params.endDealTime = $('#endFinishTime').val() ? $('#endFinishTime').val() : null
  periodicTask(this.archivesId, params)
}
// 搜索公司区域项目机房下拉框处理
function getAreaProjectRoom(array, editDatas) {
  getAreaProject(array,editDatas,function(){
      // 机房下拉
      var arrays=['','','','',array[3]],
          proList=$(array[2]);
          getRoom(arrays, {'projectId': proList.val() }, editDatas, function () {
                                  
      })
  })
}

// // 下拉框
// function selects(array, editDatas) {
//   // 获取区域下拉框数据
//   var areaList = $(array[0])
//   var proList = $(array[1])
//   var roomList = $(array[2])
//   var editData
//   if (!editDatas) {
//     editData = {
//       areaId: '',
//       projectId: '',
//       roomId: ''
//     }
//   } else {
//     editData = editDatas
//   }
//   selectAdapterGet(areaList, '', 'userRole/getBDList', function () {
//     areaList.searchableSelect({
//       afterSelectItem: function () {
//         // 清空选择框
//         clear(array.slice(1), 1)
//         var areaId = this.holder.data('value')
//         if (areaId) {
//           selectAdapterGet(proList, '', 'userRole/getProListByAreaId/'+ areaId, function () {
//             proList.searchableSelect({
//               afterSelectItem: function () {
//                 if (this.holder.data('value')) {
//                   // 机房
//                   if (roomList) {
//                     var roomParam = {
//                       'projectId': proList.val()
//                     }
//                     selectAdapterPost(roomList, roomParam, 'machineRoom/selectAll', function () {
//                       roomList.searchableSelect({
//                         afterSelectItem: function () {}
//                       })
//                     }, ['id', 'name'], editData.roomId, '2')
//                   }
//                 } else {
//                   clear(array.slice(2), 2)
//                 }
//               }
//             })
//           }, ['bdId', 'bdName'], editData.projectId, '1')
//         }
//       }
//     })
//   }, ['bdId', 'bdName'], editData.areaId, '0')
// }



// function adapterDataToArry(select, data, option, editDataID, order) {
//   // if (!data || data.length == 0) {
//   //   select.html('')
//   //   select.append('<option value="">请选择....</option>')
//   // }
//   for (var key in data) {
//     if (Array.isArray(data[key])) {
//       select.html('')
//       initName(select, order)
//       if (data[key].length == 1 && !editDataID && (order == '0' || order == '1')) {
//         select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
//       } else {
//         for (var i = 0; i < data[key].length; i++) {
//           var listData = data[key][i]
//           var selectType = editDataID == listData[option[0]] ? 'selected' : ''
//           select.append('<option value="' + listData[option[0]] + '" ' + selectType + '>' + listData[option[1]] + '</option>')
//         }
//       }
//       return
//     } else if (typeof (data[key]) == 'object') {
//       if (data[key] == null) {
//         select.html('')
//         initName(select, order)
//       } else {
//         adapterDataToArry(select, data[key], option, editDataID, order)
//         return
//       }
//     }
//   }
// }


// function clear(array, index) {
//   for (var key in array) {
//     if (array[key]) {
//       $(array[key]).html('')
//       var order = (key * 1 + index).toString()
//       initName($(array[key]), order)
//       $(array[key]).searchableSelect({})
//     }
//   }
// }
// function initName(select, order) {
//   switch (order) {
//     case '0':
//       select.append('<option value="" selected>请选择区域...</option>')
//       break;
//     case '1':
//       select.append('<option value="" selected>请选择项目...</option>')
//       break;
//     case '2':
//       select.append('<option value="" selected>请选择机房...</option>')
//       break;
//     default:
//       select.append('<option value="" selected>请选择...</option>')
//       break;
//   }
// }

function clearTypeId() {
  this.typeId2 = ''
}
/* 类型选择开始 */
// 获取树的list
function getTreeData() {
  layui.use(['form', 'element', 'treetable'], function () {
    var treetable = layui.treetable
    var tabledata = []
    $.adapter_post('', 'type/list', function (d) {
      if (d.status == '1') {
        tabledata = flatten(d.data.rows)
        tabledata_type2 = tabledata
      }
    })
  })
}
// 编辑新增弹窗数据
function dialogRender() {
  // 渲染表格
  layui.use(['form', 'element', 'treetable'], function () {
    var treetable = layui.treetable
    var renderTable3 = function () {
      layer.load(2)
      treetable.render({
        treeColIndex: 1, // 树形图标显示在第几列
        treeSpid: 0, // 最上级的父级id
        treeIdName: 'id',
        treePidName: 'parentId',
        elem: '#table3',
        data: tabledata_type2,
        page: false,
        treeLinkage: false, // 父级展开时是否自动展开所有子级
        treeDefaultClose: true, // 全部关闭，默认是全部展开的
        cols: [
          [{
            width: 80,
            align: 'center',
            templet: function (d) {
              return '<input type="radio" name="selectType_single" id=' + d.id + ' value=' + d.id + '>' +
                '<input type="hidden" value=' + d.name + '>'
            }
          }, {
            field: 'name',
            title: '设备类型名称'
          }]
        ],
        done: function () {
          layer.closeAll('loading')
        }
      })
    }
    renderTable3()
  })
}
// 扁平化树形数据
/* function flatten(data) {
  return data.reduce((arr, {
    id,
    name,
    parentId,
    isFocused,
    rows = []
  }) => arr.concat([{id,
    name,
    parentId,
    isFocused
  }], flatten(rows)), [])
}
 */
function initData (arr, item) {
  var rows = item.rows;
  var obj = {
    id: item.id,
    name: item.name,
    parentId: item.parentId
  }
  return arr.concat([obj], flatten(rows))
}
function flatten(data) {
  return data.reduce(initData, [])
}
// 选择类型
function secetion() {
  this.typeId2 = $("input[name='selectType_single']:checked").val()
  var type = $("input[name='selectType_single']:checked").nextAll('input[type=hidden]').val()
  $('#type_fix').val(type)
}
// 打开选择类型框
function dialogType() {
  $('#selecttype').modal()
  dialogRender()
  // var typeId2 = this.typeId2
  // if (typeId2) {
    // $('input[value = ' + typeId2 + ']').attr('checked', true)
    // layui.form.render()
  // }
}
/* 类型选择结束 */
