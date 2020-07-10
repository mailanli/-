/**
 * Created by 004928 on 2017/7/10.
 */
/**
 * 加载Html
 * @param containerId 容器id
 * @param filePath 文件路径
 * @param cb 加载完成后的回调 文件路径
 */
function loadPage (containerId , filePath , cb) {
    window.sessionStorage.setItem('nowPath',filePath)
    if(typeof window.$ === 'undefined' || window.$ == null) throw "请先引入jq";
    $.ajax({
        url: filePath ,
        type:'GET',
        dataType:'html',
        success:function (data) {
            $(containerId).html(data);
            if(!$(".contentFooter").length){
                $('.mypage').append('<div class="contentFooter"><p class="registration">Copyright&nbsp;©&nbsp;2018 碧桂园服务控股有限公司&nbsp;&nbsp;&nbsp;&nbsp;Version 2.4.3</p></div>')  
            }
            if(cb) {cb();}
            if (tableObject) {
                window.sessionStorage.removeItem(tableObject.config.id)
            }
            if (interval){
                clearInterval(interval)
            }
        }
    })
}
