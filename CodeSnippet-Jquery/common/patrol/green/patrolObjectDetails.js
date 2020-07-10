$(document).ready(function () {
    var targetID = window.sessionStorage.getItem('targetData_protro');
    $.adapter_get('', 'greenPatrolObjects/pointInfo/' + targetID, function (d) {
        var detailsData = d.data;
        $("#patrol-object-details").html('')
        var marks = [];
        for (var i = 0; i < detailsData.length; i++) {
            // var mark = detailsData[i].locationStr.split(',')
            // var localStr = mark[1] + ',' + mark[0]
            marks.push(detailsData[i].locationStr)
            $("#patrol-object-details").append('<li><p>巡逻点'+(i+1)+'：'+detailsData[i].pointName+'</p>'+
            '<p>业务类型：'+detailsData[i].typeName+'</p>'+
            '<p>扫描标识：<div id="qrcode'+ i +'" style="margin-bottom:10px;"/>'+
            '<button type="button" class="btn btn-default" aria-label="Left Align" onclick="exportQrcode(' + i + ')">导出</button></p>' +
            '</li> ')
            // $("#qrcode'+detailsData[i].order+'").html('')
            var str = '?pointId=' + detailsData[i].pointId;
            var qrcode = new QRCode('qrcode'+ i, {
              text: baseUrl + 'integration-admin/common/patrol/patrolDetailQrcode.html'+ str,
              width: 128,
              height: 128,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });
        }

      // 百度地图API功能
      var map = new BMap.Map("patrolMap", {
          enableMapClick: false,
          minZoom: 4,
          maxZoom: 20
      });
      map.enableScrollWheelZoom(true);
      if (marks.length !== 0) {
        
        // 向地图添加标注
        for (var i = 0; i < marks.length; i++) {
          var poiArr = marks[i].split(',')
          var point = new BMap.Point(poiArr[0], poiArr[1]);
          map.centerAndZoom(point, 15);
          var marker = new BMap.Marker(point);
          map.addOverlay(marker);
        }
      }
      // if (marks.length !== 0) {
      //   // 点为数字类型！！！
      //   var l = Number(marks[0].split(',')[0])
      //   var h = Number(marks[0].split(',')[1])
      //   var point = new BMap.Point(l, h);
      //   map.centerAndZoom(point, 15);
      //   // 向地图添加标注
      //   for (var i = 0; i < marks.length; i++) {
      //     var l = Number(marks[i].split(',')[0])
      //     var h = Number(marks[i].split(',')[1])
      //     var marker = new BMap.Marker(new BMap.Point(l, h));
      //     map.addOverlay(marker);
      //   }
      // }
    })
})
function exportQrcode (id) {
  // var src = $('#qrcode'+id).find('img')[0].src;
  var canvas = $('#qrcode' + id).find("canvas")[0];
  var base64Text = canvas.toDataURL("image/png");
  var blob = getBlob(base64Text);
  var fileNamwe = '巡逻点' + (id + 1)
  downloadFile(blob, fileNamwe)
}

function getBlob(base64) {
  var mimeString = base64.split(',')[0].split(':')[1].split(';')[0]; // mime类型
  var byteString = atob(base64.split(',')[1]); //base64 解码
  var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  var intArray = new Uint8Array(arrayBuffer); //创建视图
  for (i = 0; i < byteString.length; i += 1) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], {
    type: mimeString
  });
}
 function downloadFile(blob, fileName) {
  if (navigator.msSaveBlob) {
    // IE的Blob保存方法
    navigator.msSaveBlob(blob, fileName);
  } else {
    var link = document.createElement('a');
    var href = window.URL.createObjectURL(blob);
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link); // firefox需要把a添加到dom才能正确执行click
    link.click();

    // 延时保证下载成功执行，否则可能下载未找到文件的问题
    setTimeout(function () {
      window.URL.revokeObjectURL(href); // 释放Url对象
      document.body.removeChild(link);
    }, 100);
  }
};
function goBack() {
  $(".container").empty();
  var page = $("<div class='mypage' id='patrolObjectCheck'></div>");
  var path = '/integration-admin/common/patrol/green/patrolObject.html'
  $(".container").append(page);
  // 加载目标网页
  window.loadPage(page[0], path);
}