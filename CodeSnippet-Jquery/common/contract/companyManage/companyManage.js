$(document).ready(function () {
  var pageFlag = window.sessionStorage.getItem('page')
  var seachParams = sessionStorage.getItem('seachParams')
  var pageNo = window.sessionStorage.getItem('pageNo')
  if (seachParams && (pageFlag == 'editPage' || pageFlag == 'lookPage')) {
    var data = JSON.parse(seachParams);
    companyTable(data,pageNo)
    $('#companyName').val(data.name)
    $('#companyCode').val(data.orgCode)
    $('#createBy').val(data.createByName)
  } else if(pageFlag == 'editPage' || pageFlag == 'lookPage'){
    companyTable('',pageNo)
  } else {
    companyTable('',pageNo)
    sessionStorage.removeItem('seachParams')
  }
  sessionStorage.removeItem('page')
  sessionStorage.removeItem('pageNo')
})

function companyTable(params,pageNo) {
  var columnsSet = [[
    {'title': '序号',type: 'numbers'},
    {'title': '供应商名称','field': 'name'},
    {'title': '公司地址','field': 'address'},
    {'title': '统一社会信用代码', 'field': 'orgCode', 'width': '17%'},
    {'title': '状态', 
      'templet': function (d) {
        return d.status == 1 ? '正常' : '禁用'
      }
    },
    {'title': '创建人','field': 'createByName'},
    {'title': '创建时间','field': 'createTime', 'width': '17%'},
    { 'title': '操作', 'width': '18%',
      'templet': function (d) {
        if (d.status == '1') {
          return (
            '<div>' +
            '<a class="td_button_default btn_right" onclick=\'look(' + d.id + ")'>查看 </a>" +
            '<a class="td_button_default btn_right" onclick=\'edit(' + d.id + ")'>编辑 </a> " +
            '<a class="td_button_default btn_right" onclick=\'stop(' + d.id + ")'>禁用 </a> " +
            '<a class="td_button_default" onclick=\'remove(' + d.id + ")'>删除</a>" +
            '</div>'
          )
        } else {
          return (
            '<div> ' +
            '<a class="td_button_default btn_right" onclick=\'look(' + d.id + ")'>查看 </a>" +
            '<a class="td_button_default" onclick=\'start(' + d.id + ")'>启用 </a>" +
            '</div>'
          )
        }
      }
    }]]
    layTable({
      'url': 'company/list',
      'param': params || {},
      'method': 'post',
      'tablecols': columnsSet,
      'data': 'records',
      'pageNo':pageNo ? pageNo : params == false ? true : false
    }, '#companyTables')
}

// 搜索
function search() {
  var params = {
    'name': $('#name').val() ? $('#name').val().trim() : null,
  }
  sessionStorage.setItem('seachParams', JSON.stringify(params))
  companyTable(params)
}

// 重置
function resetForm () {
  $('.contentHeader').find('input').val('')
}

// 导出
function exports() {
  $.fileDownLoadExport('company/export', true)
}

// 新增
function add() {
  sessionStorage.removeItem('seachParams')
  $('.container').empty()
  window.sessionStorage.removeItem('companyId')
  window.sessionStorage.setItem('page', 'addPage');
  var page = $("<div class='mypage' id='pageCompanyChange'></div>")
  var path = 'integration-admin/common/contract/companyManage/companyChange.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 编辑
function edit(id) {
  sessionStorage.setItem('pageNo',parseInt($('#companyTables').next().find('em').text()));
  $('.container').empty()
  window.sessionStorage.setItem('companyId', id)
  window.sessionStorage.setItem('page', 'editPage');
  var page = $("<div class='mypage' id='pageCompanyChange'></div>")
  var path = 'integration-admin/common/contract/companyManage/companyChange.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

// 禁用
function stop(id) {
  this.companyId = id;
  $('#stop').modal()
  this.status = '0'
}
// 启用
function start(id) {
  this.companyId = id;
  $('#stop').modal()
  this.status = '1'
}
function stopSure() {
  var id = this.companyId;
  var status = this.status;
  $.adapter_put({'id': id, 'status': status}, 'company/disable', function (d) {
    layer.msg(d.msg)
    $('#stop').modal().modal('toggle')
      if (d.status == '1') {
        var seachParams = sessionStorage.getItem('seachParams')
        var pageNo=parseInt($('#computerRoomTable').next().find('em').text());
        companyTable(JSON.parse(seachParams),pageNo)
      }
   })
}

// 删除
function remove(id) {
  this.companyId = id;
  $('#delete').modal()
}
function deleteSure() {
  var id = this.companyId;
  $.adapter_delete({'id': id}, 'company/delete/'+ id, function (d) {
    layer.msg(d.msg)
    $('#delete').modal('toggle')
    if (d.status == '1') {
      var pageNo=parseInt($('#computerRoomTable').next().find('em').text());
      companyTable(JSON.parse(window.sessionStorage.getItem('seachParams')),pageNo );
    }
  })
}

function look(id) {
  sessionStorage.setItem('pageNo',parseInt($('#companyTables').next().find('em').text()));
  $('.container').empty()
  window.sessionStorage.setItem('companyId', id)
  window.sessionStorage.setItem('page', 'lookPage');
  var page = $("<div class='mypage' id='pageCompanyChange'></div>")
  var path = 'integration-admin/common/contract/companyManage/companyChange.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}