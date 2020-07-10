$(document).ready(function () {
  var d =window.sessionStorage.getItem('pointInfo');
  var data=JSON.parse(d)
  $(".title_style").text("巡查点"+data.id+"二维码")
  show_ma (d)
})
// 返回
function handleGoBack(){
  $("#pageContractQrCode").prev().show()
  $("#pageContractQrCode").remove()
}
//生成并显示二维码
function show_ma (d) {
  
  var data=JSON.parse(d)
  // console.log("aa",JSON.parse(data))
  window.sessionStorage.removeItem("pointInfo");
  var str = '?objectsId=""&pointId='+ data.id;
  var qrcode = new QRCode('qrcode', {
    text: baseUrl + 'integration-admin/common/patrol/patrolDetailQrcode.html' + str,
    width:188,
    height: 188,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: 2
  });
  $(".mypage").find("#title").html("巡逻点"+data.id)
  $(".mypage").find("#name").html(data.name)
  $(".mypage").find("#address").html(data.address)
  $(".mypage").find("#address1").html(data.address)
  $(".mypage").find("#downLoadBtn").attr("onclick","downLoad('"+data.name+"')")
}

function downLoad(name) {
 //使用html2canvas 转换html为canvas
 html2canvas(document.getElementById('downFileContent')).then(function (canvas) {
  var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url 　
  var saveLink = document.createElement('a');
  saveLink.href = imgUri;
  saveLink.download = name+'.png';
  saveLink.click();
});
}