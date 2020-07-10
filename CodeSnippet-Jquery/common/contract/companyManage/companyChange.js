var fileChooseCompany = new createUpload('.uploadFile', 5);
var fileList = []
$(document).ready(function () {
  var page = window.sessionStorage.getItem('page')
  var companyId = window.sessionStorage.getItem('companyId')
  if (page == 'addPage') {
    $('#title').html('供应商新增')
    $('#contractType').val('').searchableSelect()
    fileList = []
  } else {
    $.adapter_get('', 'company/info/'+companyId, function (d) {
      if (d.status == 1) {
        $('#companyName_change').val(d.data.name)
        $('#companyShortName_change').val(d.data.shortName)
        $('#companyCode_change').val(d.data.orgCode)
        $('#address_change').val(d.data.address)
        $('#contractType').val(!d.data.contractType ? '':d.data.contractType).searchableSelect()
        
        $('#person_change').val(d.data.contact)
        $('#phone_change').val(d.data.telephone)
        $('#secondContact').val(d.data.secondContact)
        $('#secondTelephone').val(d.data.secondTelephone)
        fileList = d.data.fileList;
        $('#fileList').show()
        initFile(fileList)
        if (page == 'editPage') {
          $('#title').html('供应商编辑')
        } else if (page == 'lookPage') {
          $('#fileList_change').hide()
          $('#btn_save').hide()
          $('#btn_cancel').show()
          $('#title').html('供应商详情')
          $('#companyName_change, #companyShortName_change, #companyCode_change, #address_change,#contractType, #person_change, #phone_change,#secondContact,#secondTelephone').attr('disabled', 'disabled')
          $('#contractType').siblings('.searchable-select').css('pointer-events', 'none').find('.searchable-select-holder').css({
            'pointer-events': 'none',
            'background-color': '#eee'
          });
        }
      }
    })
  }
})

// 查看
function initFile(fileList) {
  // var fileList = fileList;
  if (!fileList.length) {
    $('#fileList').html('')
    return false
  }
  var html = '';
  for (var i = 0; i < fileList.length; i++) {
    var ele = fileList[i];
    if (ele) {
      var url = ele.url;
      var fileName = ''
      if (ele.fileName) {
        fileName = ele.fileName;
      }
      if (window.sessionStorage.getItem('page') == 'editPage') {
         html += '<p>' +
           '<span class="filename" >' + fileName + '</span>' +
           '<button class="btn" onclick=\"downloadFile(\'' + i + '\')\">下载</button>' +
           '<button class="btn" onclick=\"printFile(\'' + url + '\')\">打印</button>' +
           '<button class="btn" onclick=\"deleteFile(\'' + ele.id + '\')\">删除</button>' +
           '</p>'
      } else {
        html += '<p>' +
          '<span class="filename" >' + fileName + '</span>' +
          '<button class="btn" onclick=\"downloadFile(\'' + i +'\')\">下载</button>' +
          '<button class="btn" onclick=\"printFile(\'' + url + '\')\">打印</button>' +
          '</p>'
      }
    }
    $('#fileList').html(html)
  }
}

function save() {
  var isAdd = window.sessionStorage.getItem('page') === 'addPage';
  var isEdit = window.sessionStorage.getItem('page') === 'editPage';
  var url = isAdd ? 'company/save': 'company/update'
  if (!$('#companyName_change').val()) {
    layer.msg('公司名称不能为空')
    return false
  } else if (!$('#companyCode_change').val()) {
    layer.msg('社会统一代码不能为空')
    return false
  } else if (!$('#contractType').val()) {
    layer.msg('合同业务不能为空')
    return false
  } 
  var params = {
    "id": isAdd ? null : window.sessionStorage.getItem('companyId'),
    "name": $('#companyName_change').val().trim(),
    "shortName": $('#companyShortName_change').val().trim(),
    "orgCode": $('#companyCode_change').val().trim(),
    "address": $('#address_change').val().trim(),
    "contractType": $('#contractType').val().trim(),
    "contact": $('#person_change').val().trim(),
    "telephone": $('#phone_change').val().trim(),
    "secondContact":$('#secondContact').val().trim(),
    "secondTelephone":$('#secondTelephone').val().trim(),
    "fileList": null
  }
  if (isAdd) {
    if (fileChooseCompany.fileList.length !== 0) {
      var fileLists = []
      var str = {
        "projectId": "00", 
        "moduleId": 2
      }
      $.adapterFiles('file_change', {}, 'cos/uploadByMultipartFiles', function (d) {
        if (d.status == '1') {
          for (var i = 0; i < d.data.length; i++) {
            var item = d.data[i];
            fileLists.push({
              fileName: item.fileName,
              url: item.fileUrl
            })
          }
          params.fileList = fileLists;
          $.adapter_post(params, url, function (data) {
            initResult(data);
          })
        }
      }, str)
    } else {
      $.adapter_post(params, url, function (d) {
        initResult(d);
      })
    }
  } else if (isEdit) {
    if (fileChooseCompany.fileList.length + fileList.length > 5) {
      layer.msg('文件上传总个数不能超过五个')
      return false
    }
    if (fileChooseCompany.fileList.length !== 0) {
      
      var fileLists = []
      var str = {
        "projectId": "00",
        "moduleId": 2
      }
      $.adapterFiles('file_change', {}, 'cos/uploadByMultipartFiles', function (d) {
        if (d.status == '1') {
          for (var i = 0; i < d.data.length; i++) {
            var item = d.data[i];
            fileLists.push({
              fileName: item.fileName,
              url: item.fileUrl
            })
          }
          var param = {
            businessId: window.sessionStorage.getItem('companyId'),
            module: '2',
            fileList: fileLists
          }
          $.adapter_post(param, 'file/fileUpload', function (data) {
            if (data.status == '1') {
              $.adapter_put(params, url, function (datas) {
                initResult(datas);
              })
            } else {
              layer.msg(data.msg)
            }
          })
        }
      }, str)
    } else {
      $.adapter_put(params, url, function (d) {
        initResult(d);
      })
    }
  } else {
    $.adapter_put(params, url, function (d) {
      initResult(d);
    })
  }
}
function toLower() {
  var code = $('#companyCode_change').val().toUpperCase();
  $('#companyCode_change').val(code)
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

// 回退页面
function goBack() {
  $('.container').empty()
  var page = $("<div class='mypage' id='pageCompanyManage'></div>")
  var path = 'integration-admin/common/contract/companyManage/companyManage.html'
  $('.container').append(page)
  // 加载目标网页
  window.loadPage(page[0], path)
}

function downloadFile(index) {
  var name = fileList[index].fileName
  var url = fileList[index].url
  downloadFileGet(url)
}
function printFile(url) {
  $("#printIframe").attr('src', url)
  $("#printIframe").print();
}
function deleteFile(id) {
  $('#deleteFile').modal('toggle')
  this.deleteId = id
  
}
function deleteFileSure() {
  var files = []
  var id = this.deleteId;
  $.adapter_delete('', 'file/delete/' + id, function (d) {
    if (d.status == '1') {
      for (var i = 0; i < fileList.length; i++) {
        var ele = fileList[i];
        if (ele.id != id) {
          files.push(ele)
        }
      }
      initFile(files)
      fileList = files;
    }
    $('#deleteFile').modal('toggle')
    layer.msg(d.msg)
  })
}