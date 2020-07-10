$(document).ready(function () {
  getDetails()
})
var fileList = []
function getDetails() {
  var contracId = window.sessionStorage.getItem('contracId')
  if (contracId) {
    $.adapter_get('', 'contract/info/' + contracId, function (d) {
      if (d.status == 1) {
        var contractDetails = d.data;
        $('#orgName').html(contractDetails.orgName)
        $('#areaName').html(contractDetails.areaName)
        $('#projectName').html(contractDetails.projectName)
        $('#typeName').html(contractDetails.typeName)
        $('#companyName').html(contractDetails.companyName) //供应商
        $('#name').html(contractDetails.name) //合同名称
        $('#companyShortName').html(contractDetails.companyShortName) //供应商
        $('#contractType').html(contractDetails.contractTypeName) //合同业务

        $('#companyPhone').html(contractDetails.companyPhone) //供应商电话
        $('#companyContact').html(contractDetails.companyContact) //供应商联系人
         
        $('#secondTelephone').html(contractDetails.secondTelephone) //供应商电话2
        $('#secondContact').html(contractDetails.secondContact) //供应商联系人2

        $('#contractNum').html(contractDetails.contractNum) // 合同编号
        $('#remark').html(contractDetails.remark) //状态备注
        $('#executer').html(contractDetails.executer) //联系人
        $('#executerPhone').html(contractDetails.executerPhone) //联系电话

        $('#beginDay').html(contractDetails.startDay.slice(0, 10))
        $('#endDay').html(contractDetails.endDay.slice(0, 10))
        initFile(contractDetails.fileList);
        fileList = contractDetails.fileList;
      }
    })
  }
}

function initFile(fileList) {
  // var fileList = fileList;
  if (!fileList || !fileList.length) {
    return false
  }
  var html = '';
  for (var i = 0; i < fileList.length; i++) {
    var ele = fileList[i];
    var fileName = ''
    if (ele.fileName) {
      fileName = ele.fileName
    }
    if (ele) {
       html += '<p>' +
         '<span class="filename" >' + fileName + '</span>' +
         '<button class="btn" onclick=\"downloadFile(\'' + i + '\')\">下载</button>' +
         '<button class="btn" onclick=\"printFile(\'' + ele.url + '\')\">打印</button>' +
         '</p>'
    }
    $('#fileList').html(html)
  }
}

function downloadFile(index) {
  var name = fileList[index].fileName
  var url = fileList[index].url
  downloadFileGet(url)
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
function printFile(url) {
  $("#printFile").attr('src', url)
  $("#printFile").print();
}
