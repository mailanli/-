$(document).ready(function () {
  $('.searchable').searchableSelect()
  var endDay = window.sessionStorage.getItem('endDay')
  $('#remindTime').val(endDay);
})
// 时间控件
$(function () {
  jeDate("#remindTime", {
    format: "YYYY-MM-DD",
    isTime: false
  })
})
// 保存
function save() {
  var endDay = window.sessionStorage.getItem('endDay')
  var remindAdvance = $('#remindAdvance').val()
  var remindType = $('#remindType').val()
  var remindTime = $('#remindTime').val()
  var content = $('#content').val()
  if (!remindType) {
    layer.msg('请选择提醒类型')
    return
  } else if (!remindAdvance) {
    layer.msg('请填写提前期')
    return
  } else if (remindAdvance <= 0) {
    layer.msg('请填写大于0天的提前期')
    return
  } else if (!remindTime) {
    layer.msg('请选择截止时间')
    return
  } else if (remindTime > endDay) {
    layer.msg('截止时间不能大于' + endDay)
    return
  }
  var param = {
    "businessId": window.sessionStorage.getItem('contractId'),
    "type": remindType,
    "endDay": remindTime,
    "perDay": remindAdvance,
    "content": content
  }
  $.adapter_post(param, 'message/save', function (d) {
    layer.msg(d.msg)
    if (d.status == 1) {
      window.sessionStorage.removeItem('endDay')
      goBack()
    }
  })
}
// 回退页面
function goBack() {
  $('.container').empty()
  var page = $("<div class='mypage' id='pageContractMaintenance'></div>")
  var path = 'integration-admin/common/contract/contractMaintenance/contractMaintenance.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}