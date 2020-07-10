var webConfig = true;
var uri = webConfig ? 'http://47.107.20.19:9001/integration/' : 'http://47.107.20.19:18000/integration/';
var uriApi = webConfig ? 'http://47.107.20.19:9001/integration/api/' : 'http://47.107.20.19:18000/integration/api/';

var baseUrl = location.href.split('frame.html')[0];
var tableObject;
var interval = null
webConfig ? '' : console.log = function (text) { };
$(function () {
    var token = getCookie('token');
    if (window.sessionStorage.getItem('token') == null) {
        if (typeof (token) != "string" && location.href.indexOf('login.html') == -1 && location.href.indexOf('Qrcode') == -1) {
            location.href = '/login'
        }
    } else {
        setCookie('token', window.sessionStorage.getItem('token'))
        setCookie('userNameInteger', window.sessionStorage.getItem('userName'))
        setCookie('userInteger', window.sessionStorage.getItem('user'))
    }
    $('.top-tool').on('click', function () {
        layer.closeAll('dialog')
    })
    // 弹框新皮肤
    layer.config({
        extend: 'myskin/layer-ext-skin.css' //加载弹框新皮肤
    });
});
$.extend({
    layerPage: function (html) {
        layer.open({
            type: 1 //Page层类型
            ,
            shade: 0.6 //遮罩透明度
            ,
            anim: 1 //0-6的动画形式，-1不开启
            ,
            content: html
        });
    },
    adapter_post: function (param, fun, callback) {
        var index = layer.load()
        $.ajax({
            type: "POST",
            url: fun.indexOf('login') != -1 ? uri + fun : uriApi + fun,
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (fun.indexOf('login') == -1) {
                    if (getCookie('token') == null) {
                        request.setRequestHeader("Authorization", window.sessionStorage.getItem('token'));
                    } else {
                        request.setRequestHeader("Authorization", getCookie('token'));
                    }
                }
            },
            data: param == "" ? '' : JSON.stringify(param),
            // dataType: "application/json",
            success: function (data) {
                layer.close(index);
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status,
                    data: rep.responseText ? rep.responseText : null
                }
                // if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                    delCookie('token')
                    if (location.href.indexOf('login.html') == -1) {
                        location.href = '/login'
                    }
                } else if (rep.responseJSON.status == 'sys-0002') {
                    data.msg = rep.responseJSON.msg
                }
                layer.close(index);
                callback(data)
            }
        });
    },
    adapterFile: function (inputID, param, fun, callback, fileName) {
        var index = layer.load()
        var formData = new FormData();
        var params = '';
        if (!$.isEmptyObject(param)) {
            for (var item in param) {
                params += "&" + item + "=" + param[item]
            }
        }
        var file = document.getElementById(inputID).files[0];
        if (fileName) {
            for (var key in fileName) {
                formData.append(key, fileName[key]);
            }
        }
        formData.append("file", file);

        $.ajax({
            url: fun.indexOf('login') != -1 ? uri + fun + '?' + params : uriApi + fun + '?' + params,
            type: "POST",
            beforeSend: function (request) {
                if (fun.indexOf('login') == -1) {
                    if (getCookie('token') == null) {
                        request.setRequestHeader("Authorization", window.sessionStorage.getItem('token'));
                    } else {
                        request.setRequestHeader("Authorization", getCookie('token'));
                    }
                }
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                layer.close(index);
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status
                }
                if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                    delCookie('token')
                    if (location.href.indexOf('login.html') == -1) {
                        location.href = '/login'
                    }
                }
                layer.close(index);
                callback(data)
            }
        });
    },
    adapterFiles: function (inputID, param, fun, callback, fileName) {
        var index = layer.load()
        var formData = new FormData();
        var params = '';
        if (!$.isEmptyObject(param)) {
            for (var item in param) {
                params += "&" + item + "=" + param[item]
            }
        }
        var file = document.getElementById(inputID).files;
        for (let i = 0; i < file.length; i++) {
            var ele = file[i];
            if (fileName) {
                for (var key in fileName) {
                    formData.append(key, fileName[key]);
                }
            }
            formData.append("file", ele);

        }
        $.ajax({
            url: fun.indexOf('login') != -1 ? uri + fun + '?' + params : uriApi + fun + '?' + params,
            type: "POST",
            beforeSend: function (request) {
                if (fun.indexOf('login') == -1) {
                    if (getCookie('token') == null) {
                        request.setRequestHeader("Authorization", window.sessionStorage.getItem('token'));
                    } else {
                        request.setRequestHeader("Authorization", getCookie('token'));
                    }
                }
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                layer.close(index);
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status
                }
                layer.close(index);
                callback(data)
            }
        });
    },
    fileDownLoad: function (fileName, token) {
        var url = uriApi + 'import/export?name=' + fileName
        if (token) {
            url += '&token=' + getCookie('token')
        }
        window.open(url)
    },
    fileDownLoadExport: function (url, token, params) {
        var downloadUrl = uriApi + url;
        if (token) {
            downloadUrl += '?token=' + getCookie('token')
        }
        if ($('.layui-table-view').length > 0 || params) {
            var param;
            var keyList = '';
            params ? param = params : param = tableObject.config.where
            for (var key in param) {
                if (param[key] && param[key] != '')
                    keyList += '&' + (key + '=' + param[key])
            }
            if (downloadUrl.indexOf('?') != -1) {
                downloadUrl += keyList
            }
        }
        window.open(downloadUrl)
    },
    adapter_get: function (param, fun, callback) {
        var index = layer.load()
        var params = '';
        if (!$.isEmptyObject(param)) {
            for (var item in param) {
                params += "&" + item + "=" + param[item]
            }
        }
        var a = 'token=' + getCookie('token');
        $.ajax({
            type: "GET",
            url: fun.indexOf('login') != -1 ? uri + fun + '?' + params : uriApi + fun + '?' + params,
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                request.setRequestHeader("Authorization", getCookie('token'))
            },
            // },
            // dataType: "application/json",
            success: function (data) {
                layer.close(index);
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status,
                    data: rep.responseText ? rep.responseText : null
                }
                if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                    delCookie('token')
                    if (location.href.indexOf('login.html') == -1) {
                        location.href = '/login'
                    }
                }
                layer.close(index);
                callback(data)
            }
        });
    },
    adapter_get_async: function (param, fun, callback) {
        var params = '';
        if (!$.isEmptyObject(param)) {
            for (var item in param) {
                params += "&" + item + "=" + param[item]
            }
        }
        $.ajax({
            type: "GET",
            async: false,
            url: fun.indexOf('login') != -1 ? uri + fun + '?' + params : uriApi + fun + '?' + params,
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                request.setRequestHeader("Authorization", getCookie('token'))
            },
            // },
            // dataType: "application/json",
            success: function (data) {
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status
                }
                if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                    delCookie('token')
                    if (location.href.indexOf('login.html') == -1) {
                        location.href = '/login'
                    }
                }
                callback(data)
            }
        });
    },
    adapter_delete: function (param, fun, callback) {
        $.ajax({
            type: 'delete',
            url: fun.indexOf('login') != -1 ? uri + fun : uriApi + fun,
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (fun.indexOf('login') == -1) {
                    if (getCookie('token') == null) {
                        request.setRequestHeader("Authorization", window.sessionStorage.getItem('token'));
                    } else {
                        request.setRequestHeader("Authorization", getCookie('token'));
                    }

                }
            },
            data: param == "" ? '' : JSON.stringify(param),
            // dataType: "application/json",
            success: function (data) {
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status
                }
                if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                    delCookie('token')
                    if (location.href.indexOf('login.html') == -1) {
                        location.href = '/login'
                    }
                }
                callback(data)
            }
        })
    },
    adapter_put: function (param, fun, callback) {
        $.ajax({
            type: 'put',
            url: fun.indexOf('login') != -1 ? uri + fun : uriApi + fun,
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (fun.indexOf('login') == -1) {
                    if (getCookie('token') == null) {
                        request.setRequestHeader("Authorization", window.sessionStorage.getItem('token'));
                    } else {
                        request.setRequestHeader("Authorization", getCookie('token'));
                    }

                }
            },
            data: param == "" ? '' : JSON.stringify(param),
            // dataType: "application/json",
            success: function (data) {
                callback(data)
            },
            error: function (rep) {
                var data = {
                    msg: '接口请求错误',
                    status: rep.status
                }
                if (rep.status == 401 && rep.responseJSON.status == 'sys-0001') {
                    delCookie('token')
                    if (location.href.indexOf('login.html') == -1) {
                        location.href = '/login'
                    }
                }
                callback(data)
            }
        })
    }
})

var commFile = function (f) {
    return '<from style="min-height: 90px;border: 1px solid #eee;background: #fafafa;padding: 10px 10px;padding-left:15px;cursor:pointer;box-sizing: border-box;display: block;margin-top: 0em;width: 60%;float: left;" onclick="' + f + '">' +
        '<div style="text-align: center;line-height: 90px;" >拖拽或点击上传文件</div></from>'
}
var fileContent = '<div style="text-align: center;line-height: 90px;" >拖拽或点击上传文件</div>'
var chooseImg = function (src, index, file) {
    return '<div class="fileDiv"><img style="height:90px;border-radius:8px;max-width: 100%;" src="' + src + '" index="' + index + '"><div class="fileDeleteImg" style=""><div><span class="fileDeleteName">' + file.name + '</span></div><div><span>' + time(file.lastModifiedDate) + '</span></div><div><span class="fileDeleteBtn" >删除</span></div></div></div>'
}

function time(Date) {
    return Date.getMonth() + "-" + Date.getDay() + ' ' + Date.getHours() + ':' + Date.getMinutes();
}
// 文件下载
function downloadFileGet(url) {
    // window.open(url)
    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("method", "get");
    form.attr("action", url);
    $("body").append(form);
    form.submit();
}

/**
 * 文件上传
 * params inserFile [Array]默认显示
 * */
function createUpload(e, maxIndex) {
    const that = this;
    that.MaxIndex = maxIndex === undefined ? 4 : maxIndex;
    that.elem = $(e);
    that.fileList = [];
    that.readFile = function (e, files) {
        const file = files;
        for (var i = 0; i < file.length; i++) {
            if (that.fileList.length >= that.MaxIndex) {
                alert('单次只允许同时上传' + that.MaxIndex + '个文件')
                return
            }
            that.fileList.push(file[i])
            var f = $(that.elem).next();
            var img = '';
            var fileName = file[i].name;
            var suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length)
            if (suffix.toLowerCase() == 'jpg' || suffix.toLowerCase() == 'png' || suffix.toLowerCase() == 'jpeg') {
                if (file[i].url) {
                    img = chooseImg(file[i].url, that.fileList.length - 1, file[i])
                } else {
                    img = chooseImg(window.URL.createObjectURL(file[i]), that.fileList.length - 1, file[i])
                }
            } else {
                img = chooseImg('/integration-admin/images/fileIcon/' + suffix + '.png', that.fileList.length - 1, file[i])
            }
            if (f.find('img').length === 0) {
                f.html('').css('display', 'flex')
            }
            f.append(img);
            $('.fileDiv').hover(function (e) {
                e.preventDefault();
                if (e.target.tagName != 'IMG' && e.target.className != "fileDeleteImg") {
                    $(e.target).find('.fileDeleteImg').show();
                } else {
                    $(e.target).parent().find('.fileDeleteImg').show();
                }
                return;
            }, function (e) {
                e.preventDefault();
                $(this).find('.fileDeleteImg').hide();
                return;
            })
            $('.fileDeleteBtn').click(function (e) {
                if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {
                    event.cancelBubble = true;
                } else {
                    event.stopPropagation();
                }
                var index = $(e.target).parent().parent().prev().attr('index')
                that.deleteFile(index);
            })
        }
    }
    that.init = function () {
        that.elem.hide();
        const fileHTML = commFile("$('" + e + "').click()");
        that.elem.parent().append(fileHTML);
        that.elem.change(function (e) {
            var files = $(e.currentTarget).prop('files');
            that.readFile(e, files)
        })
        $(this.elem).next().bind('dragover', function (e) {
            e.preventDefault();
        })
        $(this.elem).next().bind('drop', function (e) {
            e.preventDefault();
            var dt = e.originalEvent.dataTransfer;
            var files = dt.files;
            that.readFile(e, files)
        })
        return this
    }
    that.initInserFile = function (inserFile) {
        if (inserFile) {
            that.fileList = [];
            that.elem.hide();
            const fileHTML = commFile("$('" + e + "').click()");
            that.elem.parent().append(fileHTML);
            var files = inserFile;
            that.readFile(e, files)
        }
        return this
    }
    that.clearFile = function (index) {
        index ? that.deleteFile(index) : that.deleteFile(0)
    }
    that.getFile = function () {
        return that.fileList;
    }
    that.deleteFile = function (index) {
        that.fileList.splice(index, 1);
        $($(that.elem).next().find('.fileDiv')[index]).remove();
        if ($(that.elem).next().find('.fileDiv').length > 1) {
            $(that.elem).next().find('.fileDiv').each(function (index, e) {
                $(e).find('img').attr('index', index);
            })
        }
        if ($(that.elem).next().find('.fileDiv').length === 0) {
            $(that.elem).next().css('display', 'block').html(fileContent);
        }
    }
    return that.init();
}

function setCookie(name, value) {
    var Days = 8;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return '';
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/**
 * 树状图
 *@param option [code,level,name,parentCode,child]
 * */
function tree(data, option, checkCode) {
    var optionKey = option;
    for (var i = 0; i < data.length; i++) {
        var level = 'data-level='
        if (option[1] != undefined) {
            level += data[i][optionKey[1]]
        } else {
            level += '';
        }
        if (data[i][optionKey[1]] == "0" || (data.length > 0 && data[i][optionKey[1]] == '1')) {
            $("#rootUL").append("<li data-name='" + data[i][optionKey[0]] + "' " + level + "><span><i class='icon-th'></i> " + data[i][optionKey[2]] + "</span></li>");
        } else {
            var children = $("li[data-name='" + data[i][optionKey[3]] + "']").children("ul");
            if (children.length == 0) {
                $("li[data-name='" + data[i][optionKey[3]] + "']").append("<ul class='treeUl'></ul>")
            }
            if (checkCode && checkCode.indexOf(Math.ceil(data[i][optionKey[0]])) != -1) {
                $("li[data-name='" + data[i][optionKey[3]] + "'] > ul").append(
                    "<li data-name='" + data[i][optionKey[0]] + "' " + level + " >" +
                    "<span title='展开' class='treeChoose'>" +
                    "<i class='icon-plus-sign'></i> " +
                    data[i][optionKey[2]] +
                    "</span>" +
                    "</li>")
            } else {
                $("li[data-name='" + data[i][optionKey[3]] + "'] > ul").append(
                    "<li data-name='" + data[i][optionKey[0]] + "' " + level + " >" +
                    "<span>" +
                    "<i class='icon-minus-sign'></i> " +
                    data[i][optionKey[2]] +
                    "</span>" +
                    "</li>")
            }

        }
        for (var j = 0; j < data[i][optionKey[4]].length; j++) {
            var child = data[i][optionKey[4]][j];
            var childLevel = 'data-level='
            if (option[1] != undefined) {
                childLevel += child[optionKey[1]]
            } else {
                childLevel += '';
            }
            var children = $("li[data-name='" + child[optionKey[3]] + "']").children("ul");
            if (children.length == 0) {
                $("li[data-name='" + child[optionKey[3]] + "']").append("<ul class='treeUl'></ul>")
            }
            if (checkCode && checkCode.indexOf(Math.ceil(child[optionKey[0]])) != -1) {
                $("li[data-name='" + child[optionKey[3]] + "'] > ul").append(
                    "<li data-name='" + child[optionKey[0]] + "' " + childLevel + " >" +
                    "<span title='展开' class='treeChoose'>" +
                    "<i class='icon-plus-sign'></i> " +
                    child[optionKey[2]] +
                    "</span>" +
                    "</li>")
            } else {
                $("li[data-name='" + child[optionKey[3]] + "'] > ul").append(
                    "<li data-name='" + child[optionKey[0]] + "' " + childLevel + " >" +
                    "<span >" +
                    "<i class='icon-minus-sign'></i> " +
                    child[optionKey[2]] +
                    "</span>" +
                    "</li>")
            }
            var child2 = data[i][optionKey[4]][j][optionKey[4]];
            tree(child2, option, checkCode)
        }
        tree(data[i], option, checkCode);
    }
}

function createTree(data, option, cb, checkCode) {
    var that = this
    that.cb = cb;
    that.mulit = $('.tree').attr('mulit') == undefined ? false : true;
    that.allSubnode = $('.tree').attr('allSubnode') == undefined ? false : true;
    that.treeData = that.mulit == false ? {} : [];
    that.init = function () {
        if (data[0].length) {
            tree(data[0], option, checkCode)
        } else {
            tree(data, option, checkCode);
        }
        var children = $('.tree').find('span').parent('li').find(' > ul > li');
        if (checkCode) {
            if (!that.mulit) {
                $('.tree').find('span').removeClass('treeChoose');
            }
            children.hide('fast');
            if ($('.tree').find('span').hasClass('treeChoose')) {
                children.show('fast');
            }
        }
        // children.hide('fast')
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', '关闭');
        $('.tree li  > span').on('click', function (e) {
            var children = $(this).parent('li').find(' > ul > li');
            if (children.is(":visible") || (children.length == 0 && !$(this).hasClass('treeChoose'))) {
                children.hide('fast');
                if (!that.mulit) {
                    $('.tree').find('span').removeClass('treeChoose');
                }
                $(this).attr('title', '展开').addClass('treeChoose').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
                if (that.allSubnode) {
                    children.find('span').attr('title', '展开').addClass('treeChoose').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
                }
            } else {
                if (!that.mulit) {
                    that.treeData = {};
                }
                children.show('fast');
                $(this).attr('title', '关闭').removeClass('treeChoose').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
                // children.find('span').attr('title', '关闭').removeClass('treeChoose').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
            }
            var checkList = $(e.target)
            var data = {};
            data['text'] = checkList.text()
            data['code'] = checkList.parent().data('name');
            data['level'] = checkList.parent().data('level');
            if (!that.mulit) {
                that.treeData = data;
            }
            that.cb(that);
            e.stopPropagation();
        });
    }
    that.getTreeData = function () {
        if (that.mulit) {
            that.treeData = [];
            $('.treeChoose').each(function (index, e) {
                var data = {};
                data['text'] = $(e).text()
                data['code'] = $(e).parent().data('name');
                data['level'] = $(e).parent().data('level');
                that.treeData.push(data)
            })
        }
        return that.treeData;
    }
    that.init();
    return that;
}

function test() {
    /*
    * <div id="full-pic">
    <img src="image/1.jpg">
    <span id="pic-span"></span>
    <div id="big-pic">
        <img src="image/1.jpg" alt="">
    </div>
</div>
    * */
    var pic_div = document.getElementById('full-pic'); //拿到整个大的div
    var normal_pic = pic_div.getElementsByTagName('img')[0]; //拿到div中的图片
    var span_move = document.getElementById('pic-span'); //拿到显示当前图片位置的span
    var big_div = document.getElementById('big-pic'); //拿到右边放置放大图片的div
    var pic_move = big_div.getElementsByTagName('img')[0]; //拿到右侧放大的图片本身
    //当鼠标在最外层div中滑动的时候触发事件，因为要获取当前的鼠标位置所以要拿到事件源evt
    pic_div.onmousemove = function (evt) {
        // 获取事件
        var e = evt || window.event;
        // 获取大图和小图之间的倍数     
        var bigSize = pic_move.offsetHeight;
        var littleSize = normal_pic.offsetHeight;
        var n = bigSize / littleSize;
        //获取pic对于页面的绝对位置
        var pic_x = normal_pic.getBoundingClientRect().left;
        var pic_y = normal_pic.getBoundingClientRect().top + document.documentElement.scrollTop;
        // 获取鼠标相对full-pic的位置
        var mouse_x = e.pageX - pic_x;
        var mouse_y = e.pageY - pic_y;
        console.log("y----" + mouse_y)
        console.log("x----" + mouse_x)
        //将两个div的设置为显示
        big_div.style.display = 'block';
        span_move.style.display = 'block';
        span_move.style.width = normal_pic.offsetWidth / 2 + 'px';
        span_move.style.height = normal_pic.offsetWidth / 2 + 'px';
        //设置边际以及图片移动的算法
        if (mouse_y <= span_move.offsetWidth / 2) {
            pic_move.style.top = '0px';
            span_move.style.top = '0px';
        } else if (mouse_y > span_move.offsetHeight / 2 && mouse_y < normal_pic.offsetHeight - span_move.offsetHeight / 2) {
            var tempY = mouse_y - span_move.offsetHeight / 2;
            pic_move.style.top = -n * tempY + 'px';
            span_move.style.top = tempY + 'px';
        } else {
            pic_move.style.top = -(n - 1) * normal_pic.offsetHeight + 'px';
            span_move.style.top = normal_pic.offsetHeight - span_move.offsetHeight + 'px';
        }
        if (mouse_x <= span_move.offsetWidth / 2) {
            pic_move.style.left = '0px';
            span_move.style.left = '0px';
        } else if (mouse_x > span_move.offsetHeight / 2 && mouse_x < normal_pic.offsetHeight - span_move.offsetHeight / 2) {
            var tempX = mouse_x - span_move.offsetHeight / 2;
            pic_move.style.left = -n * tempX + 'px';
            span_move.style.left = tempX + 'px';
        } else {
            pic_move.style.left = -(n - 1) * normal_pic.offsetHeight + 'px';
            span_move.style.left = normal_pic.offsetHeight - span_move.offsetHeight + 'px';
        }
    }
    pic_div.onmouseout = function () {
        span_move.style.display = 'none';
        big_div.style.display = 'none';
    }

}

function selectAdapterPost(selectID, param, fun, cb, option, editDataID, order) {
    $.adapter_post(param, fun, function (d) {

        adapterDataToArry(selectID, d, option, editDataID, order)

        if (cb) {
            cb(d)
        }
    })
}
function selectAdapterPostN(selectID, param, fun, cb, option, editDataID, order) {
    $.adapter_post(param, fun, function (d) {
        adapterDataToArryN(selectID, d, option, editDataID, order)

        if (cb) {
            cb(d)
        }
    })
}

function selectAdapterGet(selectID, param, fun, cb, option, editDataID, order) {
    $.adapter_get(param, fun, function (d) {
        adapterDataToArry(selectID, d, option, editDataID, order)
        if (cb) {
            cb(d)
        }
    })
}

function adapterDataToArry(select, data, option, editDataID) {
    if (data) {
        for (var key in data) {
            var placeholder = select.children('option').eq(0).text();
            if (Array.isArray(data[key])) {
                select.html('')
                // select.append('<option value="">请选择....</option>')
                for (var i = 0; i < data[key].length; i++) {
                    var listData = data[key][i]
                    var selectType = '';
                    if (editDataID && typeof (editDataID) == 'string' && editDataID.toString().split(',').length > 1) {
                        selectType = editDataID.split(',').indexOf(listData[option[0]].toString()) == -1 ? '' : 'selected'
                    } else if (editDataID && typeof (editDataID) == 'object' && editDataID.length > 0) {
                        selectType = editDataID.indexOf(listData[option[0]].toString()) == -1 ? '' : 'selected'
                    } else {
                        selectType = editDataID == listData[option[0]] ? 'selected' : '';
                    }
                    if (data[key].length == 1) selectType = 'selected'
                    select.append('<option value="' + listData[option[0]] + '" ' + selectType + '>' + listData[option[1]] + '</option>')
                }
                return
            } else if (typeof (data[key]) == 'object') {
                if (data[key] == null) {
                    select.html('')
                    // select.append('<option value="">请选择....</option>')
                } else {
                    adapterDataToArry(select, data[key], option, editDataID)
                    return
                }
            }
        }
    }
}

function clear(array) {
    for (var key in array) {
        if (array[key]) {
            $(array[key]).html('')
            $(array[key]).append('<option value="">请选择....</option>')
            $(array[key]).searchableSelect({})
        }
    }
}

function initData(array) {
    var data = []
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        for (var key in item) {
            item[key] = item[key] || ''
        }
        data.push(item)
    }
    return data;
}

$.fn.searchInput = function (option) {
    var _this = this;
    _this.holder;
    _this.option = option;
    var createFun = {
        init: function () {
            var input = _this.find('input');
            if (_this.find('div.searchInput-select-items').length > 0) {
                _this.find('div.searchInput-select-items').html('');
            } else {
                input.after('<div class="searchInput-select-items"></div>');
                input.on('change', function (e) {
                    var item = _this.find('div.searchInput-select-items');
                    item.html('');
                    var param = {}
                    param[option['param']] = e.target.value
                    $.adapter_post(param, option.fun, function (d) {
                        if (d.status == 1) {
                            for (var i = 0; i < d.data.length; i++) {
                                var list = $('<div class="searchInput-select-item"></div>');
                                for (var key in d.data[i]) {
                                    var item = d.data[i];
                                    if (key.indexOf('name') != -1) {
                                        list.text(item[key])
                                    } else {
                                        list.data(key, item[key]);
                                    }
                                }
                                _this.find('div.searchInput-select-items').append(list);
                            }
                            _this.find('div.searchInput-select-items').click(function (e) {
                                _this.find('input').val($(e.target).text());
                                var dataList = $(e.target).data();
                                for (var key in dataList) {
                                    _this.find('input').data(key, dataList[key])
                                }
                                _this.find('div.searchInput-select-items').html('');
                                if (_this.option.afterSelectItem) {
                                    _this.option.afterSelectItem()
                                }
                            })
                        }
                    })
                })
            }
        }
    }
    createFun.init();
}

function checkFun(e) {
    if ($(e).attr('checked') == 'checked') {
        $(e).attr('checked', false)
    } else {
        $(e).attr('checked', true)
    }
}

function isInteger(e) {
    var thhat = $(e);
    if (thhat.val() < 0) {
        layer.msg('输入有误，数字不能为负数')
        thhat.val(0)
    }
}

/*
* by songhuihui 2019-6-19
* 增加数据表格动态表头，如果业务需要后台定义表头，则postOption.tablecols不传入值
* */
function layTable(postOption, elemtID) {
    layui.use('table', function () {
        var table = layui.table;
        var pageNo = postOption.pageNo ? (postOption.pageNo === true ? parseInt($(elemtID).next().find('em').text()) : postOption.pageNo) : 1;
        function redenTable(table,pageNo,postOption,elemtID){
            tableObject = table.render({
                elem: elemtID,
                url: uriApi + postOption.url,
                method: postOption.method || 'get',
                where: postOption.param || {},
                contentType: postOption.method ? 'application/json' : '',
                limit: postOption.limit ? postOption.limit : 10,
                limits: postOption.limits ? postOption.limits : [10, 20, 30, 40, 50, 60, 70, 80, 90],
                page: postOption.page ? '' : { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                    layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
                    ,
                    curr: pageNo //设定初始在第 5 页
                    ,
                    groups: 3 //只显示 1 个连续页码
                    ,
                    first: 1 //不显示首页
                    ,
                    last: '末页' //不显示尾页
                },
                headers: {
                    'Authorization': getCookie('token')
                },
                parseData: function (res) { //res 即为原始返回的数据
                    if (postOption.autoWidth) {
                        var tableStyle = this.elem.next().find('style')
                        var oldStyle = tableStyle.html();
                        var newStyle = '';
                        var widthList = [];
                        //取出所有要自定义长度的字符
                        for (var j = 0; j < this.cols[0].length; j++) {
                            if (this.cols[0][j].field) {
                                var josn = {'name': this.cols[0][j].field, 'key': this.cols[0][j].key}
                                widthList.push(josn)
                            }
                        }
                        var data = postOption.data == '' ? res.data : res.data[postOption.data]
                        var maxList = {};
                        //取出所有数据中长度最长的数据
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < widthList.length; j++) {
                                if (!maxList[widthList[j].name] || (data[i][widthList[j].name] && data[i][widthList[j].name].toString().length > maxList[widthList[j].name].length)) {
                                    maxList[widthList[j].name] = {
                                        'length': data[i][widthList[j].name].toString().length,
                                        'key': this.index + '-' + widthList[j].key
                                    };
                                }
                            }
                        }
                        for (var key in maxList) {
                            if (maxList[key].length) {
                                if (newStyle.length > 0) {
                                    oldStyle = newStyle
                                }
                                var width = 0;
                                var titleContent = $('th[data-key="'+maxList[key].key+'"]').text();
                                if ((titleContent.length*14)+30 > ((maxList[key].length * 14) + 30)) {
                                    width =(titleContent.length*14)+30
                                }else{
                                    width = ((maxList[key].length * 14) + 30)
                                }
                                var a = oldStyle.split('.laytable-cell-' + maxList[key].key)[0]
                                var b = oldStyle.split('.laytable-cell-' + maxList[key].key)[1] ? oldStyle.split('.laytable-cell-' + maxList[key].key)[1].substr(oldStyle.split('.laytable-cell-' + maxList[key].key)[1].indexOf('}') + 1, oldStyle.split('.laytable-cell-' + maxList[key].key)[1].length) : ''
                                newStyle = a + '.laytable-cell-' + maxList[key].key + '{ width:' + width + 'px}' + b
                            }
                        }
                        setTimeout(function () {
                            tableStyle.html(newStyle);
                            tableObject.config.elem.next().find('th').each(function (i,e) {
                                var c = i == 0 ? 1 : 0;
                                var width = $($('td[data-key="'+$(e).data('key')+'"]')[0]).width()+c
                                $(e).find('div').css('width',width+'px')
                            })
                        },100)
                    }
                    return {
                        "code": res.status == 1 ? 0 : res.status, //解析接口状态
                        "msg": res.msg, //解析提示文本
                        "count": res.data.total ? res.data.total : res.data.length, //解析数据长度
                        "data": postOption.data == '' ? res.data : res.data[postOption.data] //解析数据列表
                    };
                },
                request: {
                    pageName: 'pageNo' //页码的参数名称，默认：page
                    ,
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                cols: postOption.tablecols,
                height: postOption.height == true ? '' : 'full-190',
                done: function (res) {
                    //消息提示显示判断
                    if (tableObject.config.id == 'msgListTable') {
                        if (res.count > 0) {
                            $('.msgTip em').show()
                        } else {
                            $('.msgTip em').hide()
                        }
                    }
                    function tableClick(e) {
                        if ($(e.target).closest(".layui-table-tips").length == 0 && $(".layui-table-tips").length > 0 && $(e.target).closest(".layui-table-grid-down").length == 0) { //点击id为menu之外且id不是不是open，则触发 close(); }
                            layer.closeAll();
                        }
                    }
                    $('.main').off('click')
                    $('.main').on('click', tableClick)
                    if (tableObject.config.id == 'subTableEquipment' || tableObject.config.id == 'subTablePoint' || tableObject.config.id == 'selectPatrolPointTable') {
                        if (tableObject.config.id == 'selectPatrolPointTable') {
                            checkList = JSON.parse(window.sessionStorage.getItem(tableObject.config.id)) //为巡逻点保存
                        }
                        if ($.isArray(checkList) && checkList && checkList.length > 0) {
                            for (var i = 0; i < res.data.length; i++) {
                                for (var j = 0; j < checkList.length; j++) {
                                    if (res.data[i].id == checkList[j].id) {
                                        res.data[i]["LAY_CHECKED"] = 'true';
                                        var index = res.data[i]['LAY_TABLE_INDEX'];
                                        $('tr[data-index="' + index + '"] input:checkbox')
                                        $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').prop('checked', true);
                                        $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:checkbox').next().addClass('layui-form-checked');
                                    }
                                }
                            }
                        } else if (checkList && $.isPlainObject(checkList)) {
                            for (var i = 0; i < res.data.length; i++) {
                                if (res.data[i].id == checkList.id) {
                                    res.data[i]["LAY_CHECKED"] = 'true';
                                    var index = res.data[i]['LAY_TABLE_INDEX'];
                                    $('tr[data-index="' + index + '"] input:checkbox')
                                    $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:radio').prop('checked', true);
                                    $('#' + tableObject.config.id).parent().find('tr[data-index="' + index + '"] input:radio').next().addClass('layui-form-radioed').find('.layui-icon').addClass('layui-anim-scaleSpring').html('&#xe643;');
                                }

                            }
                        }
                    }
                    var nowPath = window.sessionStorage.getItem('nowPath');
                    var permsList = JSON.parse(window.sessionStorage.getItem('permsList'))
                    var permssions = ['list', 'add', 'delete', 'update', 'addPatRol', 'addExternal', 'run', 'push', 'addAdmin', 'export', 'status', 'addXunjian', 'addWeibao', 'addShenji', 'addGlobalPatrol', 'addGreenPatrol', 'addCleanPatrol', 'addExternal', 'exportExternal', 'listExternal', 'updateExternal', 'deleteExternal', 'statusExternal', 'listPlan', 'exportPlan', 'addPlan', 'updatePlan', 'approve', 'endUp', 'addMessage', 'electronicFence'];
                    var permssionList = JSON.parse(window.sessionStorage.getItem('permssion'));
                    if (nowPath.split('/integration-admin/').length > 1) {
                        nowPath = nowPath.split('/integration-admin/')[1]
                    }
                    if (nowPath.split('/').pop() == 'externalPlanDetail.html') {
                        permsList[nowPath] = permsList['common/strategy/externalStrategy/externalStrategy.html'];
                    }
                    if (nowPath.split('/').pop() == 'firePlanDetail.html') {
                        permsList[nowPath] = permsList['common/strategy/firePlan/firePlan.html'];
                    }
                    if (permsList[nowPath] && permssionList) {
                        var list = permssionList[permsList[nowPath].split(':')[0] + ':' + permsList[nowPath].split(':')[1]]
                        var a = arrayParse(permssions, list);
                        for (var i = 0; i < a.length; i++) {
                            switch (a[i]) {
                                case 'list':
                                    $('.layui-btn:contains("查看")').remove();
                                    $('.layui-btn:contains("详情")').remove();
                                    $('.td_button_default:contains("查看")').remove();
                                    $('.td_button_default:contains("详情")').remove();
                                    $('.td_button_listQuery:contains("查询")').remove();
                                    break;
                                case 'delete':
                                    $('.layui-btn:contains("删除")').remove();
                                    $('.td_button_default:contains("删除")').remove();
                                    break;
                                case 'update':
                                    $('.td_button_default:contains("编辑")').remove();
                                    $('.td_button_default:contains("修改")').remove();
                                    $('.layui-btn:contains("编辑")').remove();
                                    $('.layui-btn:contains("修改")').remove();
                                    break;
                                case 'add':
                                    $('.bgy-add-btn').remove();
                                    break;
                                case 'addPatRol':
                                    $('.bgy-addPatRol-btn').remove();
                                    break;
                                case 'addExternal':
                                    $('.bgy-addExternal-btn:contains("添加")').remove();
                                    break;
                                case 'run':
                                    $('.layui-btn:contains("跑一次")').remove();
                                    $('.td_button_default:contains("跑一次")').remove();
                                    break;
                                case 'push':
                                    $('.layui-btn:contains("同步")').remove();
                                    $('.td_button_default:contains("同步")').remove();
                                    break;
                                case 'addAdmin':
                                    $('.bgy-addAdmin-btn').remove();
                                    break;
                                case 'export':
                                    $('.bgy-export-btn:contains("导出")').remove();
                                    $('.bgy-export-btn').remove();
                                    $('.td_button_default:contains("导出")').remove();
                                    break;
                                case 'status':
                                    $('.td_button_default:contains("暂停")').remove();
                                    $('.td_button_default:contains("启动")').remove();
                                    break;
                                case 'addXunjian': //内部策略添加巡检
                                    $('.td_button_add_xunjian').remove();
                                    break;
                                case 'addWeibao': //内部策略添加维保
                                    $('.td_button_add_weibao').remove();
                                    break;
                                case 'addShenji': //内部策略添加监评
                                    $('.td_button_add_shenji').remove();
                                    break;
                                case 'addGlobalPatrol': //内部策略综合巡逻
                                    $('.td_button_add_global').remove();
                                    break;
                                case 'addGreenPatrol': //内部策略绿化巡逻
                                    $('.td_button_add_green').remove();
                                    break;
                                case 'addCleanPatrol': //内部策略保洁巡逻
                                    $('.td_button_add_clean').remove();
                                    break;
                                // case 'addExternal':  //外部策略---添加
                                //     $('.td_button_exAdd').remove();
                                //     break;
                                case 'exportExternal':  //外部策略--导出
                                    $('.td_button_exExport').remove();
                                    break;
                                case 'listExternal':  //外部策略--列表查看
                                    $('.td_button_exCheck').remove();
                                    break;
                                case 'updateExternal':  //外部策略--列表编辑
                                    $('.td_button_exUpdate').remove();
                                    break;
                                case 'statusExternal':  //外部策略--列表暂停和启动
                                    $('.td_button_exStatus').remove();
                                    break;
                                case 'deleteExternal':  //外部策略--列表删除
                                    $('.td_button_exDelete').remove();
                                    break;
                                case 'listPlan':  //外部策略--列表查看计划
                                    $('.td_button_exPlan').remove();
                                    break;
                                case 'updatePlan':  //外部策略 --计划列表编辑
                                    $('.td_button_exUpdatePlan').remove();
                                    break;
                                case 'exportPlan':  //外部策略--计划导出
                                    $('.td_button_exExportPlan').remove();
                                    break;
                                case 'addPlan':  //外部策略--计划添加
                                    $('.td_button_exAddPlan').remove();
                                    break;
                                case 'approve':  //消防计划
                                    $('.td_button_default:contains("通过")').remove();
                                    $('.td_button_default:contains("驳回")').remove();
                                    break;
                                case 'endUp': //合同维护--终止
                                    $('.td_button_default:contains("终止")').remove();
                                    break;
                                case 'addMessage': //合同维护--添加提醒
                                    $('.td_button_default:contains("添加提醒")').remove();
                                    break;
                                case 'electronicFence': //项目--电子围栏
                                    $('.td_button_default:contains("电子围栏")').remove();
                                    break;
                            }
                        }
                        if (nowPath == "common/strategy/internalStrategy/internalStrategy.html") {
                            var intervalAddBtnFlag = ['addXunjian', 'addWeibao', 'addShenji', 'addGlobalPatrol', 'addGreenPatrol', 'addCleanPatrol'].some(function (currentValue) {
                                return list.indexOf(currentValue) >= 0;
                            })
                            if (!intervalAddBtnFlag) {
                                $('.listAddBtn:contains("添加")').remove();
                            }
                        }

                    }
                    postOption.done ? postOption.done(res) : '';
                }
            })
            table.on('checkbox(test)', function (obj) {
                window.sessionStorage.setItem(tableObject.config.id, JSON.stringify(table.checkStatus(tableObject.config.id).data)) //为巡逻点保存
                if (tableObject.config.id == 'subTableEquipment' || tableObject.config.id == 'subTablePoint') {
                    var selectData = [], $tagContainer = $('#' + tableObject.config.id).closest('div').prev('.tipGroup');
                    if (obj.type == "all") { //全选按钮
                        selectData = table.checkStatus(tableObject.config.id).data; //array
                        if (selectData.length == 0) {
                            selectData = layui.table.cache[tableObject.config.id]
                        }
                    } else { //单选按钮
                        selectData = [obj.data]
                    }
                    if (obj.checked) { //选中
                        if (tableObject.config.id == 'subTablePoint') { // 巡逻管理模块巡逻点选中事件
                            var checkFlag = true;
                            $(obj.tr).find(".tableSelect").each(function (index, element) {
                                if (!$(this).val() && obj.checked == true) {
                                    checkFlag = false
                                    $(obj.tr).find('input:checkbox').prop('checked', false);
                                    $(obj.tr).find('input:checkbox').next().removeClass('layui-form-checked');
                                    layer.msg('请先选择业务分类和业务标准哦！')
                                    return
                                }
                            })
                            if (checkFlag) {
                                var selectName = $(obj.tr).find(".selectName").val()
                                var standName = $(obj.tr).find(".standName").val()
                                if (selectName == undefined || standName == undefined) {
                                    $("#" + tableObject.config.id).next().find('input:checkbox').prop('checked', false);
                                    $("#" + tableObject.config.id).next().find('input:checkbox').next().removeClass('layui-form-checked');
                                    $tagContainer.find("#clearAllTip").nextAll().remove()
                                    layer.msg('请先选择业务分类和业务标准哦！')
                                    return
                                }
                                for (var i = 0; i < selectData.length; i++) {
                                    var filterflag = false
                                    checkList.forEach(function (item, index) {
                                        if (item.id == selectData[i].id) filterflag = true;
                                    })
                                    if (!filterflag) {

                                        $tagContainer.append('<span  class="tag column"  draggable="true"  data-id="' + selectData[i].id + '" data-name="' + selectData[i].name + '" data-selectName="' + selectName + '" data-standName="' + standName + '">' + selectData[i].name + '<i class="btnClose layui-icon">&#x1006;</i></span>')
                                        checkList.push({ 'id': selectData[i].id, 'name': selectData[i].name,'standardManageId':standName,'standardTypeId':selectName })
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < selectData.length; i++) {
                                var filterflag = false
                                checkList.forEach(function (item, index) {
                                    if (item.id == selectData[i].id) filterflag = true;
                                })
                                if (!filterflag) {
                                    $tagContainer.append('<span  class="tag column"  draggable="true" data-id="' + selectData[i].id + '" data-name="' + selectData[i].name + '">' + selectData[i].name + '<i class="btnClose layui-icon">&#x1006;</i></span>')
                                    checkList.push({ 'id': selectData[i].id, 'name': selectData[i].name })
                                }
                            }
                        }


                    } else { //未选中
                        for (var i = 0; i < selectData.length; i++) {
                            $tagContainer.find('.tag').each(function (index, item) {
                                if ($(item).data('id') == selectData[i].id) {
                                    $(item).remove();
                                    checkList = checkList.filter(function (item, index) {
                                        return item.id !== selectData[i].id
                                    })
                                }
                            })
                        }
                    }
                }
            });
            table.on('radio(test)', function (obj) {
                window.sessionStorage.setItem(tableObject.config.id, JSON.stringify(obj.data))

                var selectData = obj.data, $tagContainer = $('#' + tableObject.config.id).closest('div').prev('.tipGroup');
                if (checkList.id !== selectData.id) {
                    $tagContainer.empty();
                    $tagContainer.append('<span class="tag" data-id="' + selectData.id + '" data-name="' + selectData.name + '">' + selectData.name + '<i class="btnClose layui-icon">&#x1006;</i></span>')
                    checkList = { 'id': selectData.id, 'name': selectData.name };
                }
            });
        }
        function cteateCols(d){
            var titleData=[];
            if (d.status == '1') {
                var title = d.data.title
                var list = [];
                for (var key in title){
                    var field = {'title': title[key], 'field':key}
                    list.push(field)
                }
                titleData.push(list)
            }
            return titleData;
        }
        if(!postOption.tablecols){
            var param = postOption.param;
            param['pageSize'] = 1;
            param['pageNo'] = 1;
            if (postOption.method.toLowerCase() == 'get'){
                $.adapter_get(postOption.param,postOption.url,function (d) {
                    postOption.tablecols =  cteateCols(d);
                    delete postOption.param['pageSize'];
                    delete postOption.param['pageNo'];
                    redenTable(table,pageNo,postOption,elemtID)
                })
            }else{
                $.adapter_post(postOption.param,postOption.url,function (d) {
                    postOption.tablecols =  cteateCols(d);
                    delete postOption.param['pageSize'];
                    delete postOption.param['pageNo'];
                    redenTable(table,pageNo,postOption,elemtID)
                })
            }
        }else{
            redenTable(table,pageNo,postOption,elemtID)
        }

    })

}

function changeJSON(d) {
    var result = '';
    for (var key in d) {
        result += key + '=' + d[key] + '&'
    }
    return result.substr(0, result.length - 1)
}

function changeInput(e) {
    e.value = e.value.replace(/\D/g, '')
    var that = this;
    that.e = e;
    $(e).unbind('paste');
    $(e).bind('paste', function (el) {
        setTimeout(function () {
            that.e.value = that.e.value.replace(/\D/g, '')
        }, 10)
    })
}

function arrayParse(array1, array2) {
    var result = [];
    for (var i = 0; i < array1.length; i++) {
        var obj = array1[i];
        var isExist = false;
        for (var j = 0; j < array2.length; j++) {
            var aj = array2[j];
            if (obj == aj) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            result.push(obj);
        }
    }
    return result;
}

function showMsgList() {
    var page = $(".container")
    var path = 'integration-admin/common/system/message/msgList.html'
    // 加载目标网页
    window.loadPage(page[0], path)
}

/**
 * GET获取下拉接口公用方法
 * @method selectAdapterGetN()
 * @param
 * selectID：元素ID
 * param： 接口请求参数
 * fun：接口
 * cb:回调函数
 * option：
 * editDataID：编辑时的值
 * order：下拉名称号码
 * @return
 */

function selectAdapterGetN(selectID, param, fun, cb, option, editDataID, order) {
    $.adapter_get(param, fun, function (d) {
        adapterDataToArryN(selectID, d, option, editDataID, order)
        if (cb) {
            cb(d)
        }
    })
}

/**
 * 用于初始化区域项目，判断下拉是否唯一值，若为唯一，则默认选中
 * @method adapterDataToArryN()
 * @param
 * selectID：元素ID
 * data:接口返回值
 * option：
 * editDataID：编辑时的值
 * order：下拉名称号码
 * @return
 */
function adapterDataToArryN(select, data, option, editDataID, order) {
    for (var key in data) {
        var placeholder = select.children('option').eq(0).text();
        if (Array.isArray(data[key])) {
            var unEditDataIdNum = 0;
            select.html('').siblings('.searchable-select').remove();
            if (data[key].length == 1 && !editDataID && (order == 0 || order == 1 || order == 2)) {
                select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
            } else {
                for (var i = 0; i < data[key].length; i++) {
                    var listData = data[key][i]
                    var selectType = (editDataID == listData[option[0]]) ? 'selected' : ''
                    // var selectType = (editDataID == listData[option[0]] && (order == '0' || order == '1' ||  order == '2')) ? 'selected' : ''
                    select.append('<option value="' + listData[option[0]] + '" ' + selectType + '>' + listData[option[1]] + '</option>')
                    if (!selectType) unEditDataIdNum++ // 不存在相应id数量
                }
            }
            unEditDataIdNum !== data[key].length ? select.prepend('<option value= "">' + placeholder + '</option>') : select.prepend('<option value= "" selected>' + placeholder + '</option>')
            return
        } else if (typeof (data[key]) == 'object') {
            if (data[key] == null) {
                select.html('');
                select.prepend('<option value= "" selected>' + placeholder + '</option>');
            } else {
                adapterDataToArryN(select, data[key], option, editDataID, order)
                return
            }
        }
    }
}
// 清空选择框
function clearN(array, index) {
    for (var key in array) {
        if (array[key]) {
            var placeholder = $(array[key]).children('option').eq(0).text(); //保存选项空时的提示
            $(array[key]).html('')
            var order = (key * 1 + index).toString()
            $(array[key]).prepend('<option value= "" selected>' + placeholder + '</option>');
            $(array[key]).searchableSelect({})
        }
    }
}

// 搜索公司区域项目下拉框处理
function getAreaProject(array, editDatas, cb, isArea,isOrg) {
    var orgList = $(array[0])
    var areaList = $(array[1])
    var proList = $(array[2])
    var editData = editDatas || { orgId: '', areaId: '', projectId: '' }
    clearN(array.slice(0))
    for (var i = 0; i < array.length; i++) {
        $(array[i]).removeData()
    }
    // 公司下拉
    getOrg(orgList, '', editDatas, function (v1) {
        clearN(array.slice(1))
        if(isOrg && cb) cb()
        if (v1) {
            // 区域下拉
            getArea(areaList, v1, editData, function (v2) {
                clearN(array.slice(2))
                if (v2) {
                    if (isArea && cb) cb(v2)
                    // 项目下拉
                    getProject(proList, { 'areaId': v2 }, editData, function (v3) {
                        clearN(array.slice(3))
                        if (v3 && !isArea && cb) cb(v3)
                    })
                }

            })
        }
    })
}
// 搜索公司区域项目到楼栋下拉框处理
function getAreaProjectToAddress(array, editDatas) {
    getAreaProject(array, editDatas, function () {
        var param = { 'projectId': $(array[2]).val() }
        var arrays = array.slice(3)
        getEquipmentAddress(arrays, param, editDatas, function () {
        })
    })
}

// 公司下拉
function getOrg(select, param, editData, cb) {
    var select = $(select);
    selectAdapterGetN(select, '', 'userRole/getOrgList', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['bdId', 'bdName'], editData && editData.orgId ? editData.orgId : null, '0')
}
// 区域下拉
function getArea(select, param, editData, cb) {
    var select = $(select);
    selectAdapterGetN(select, {}, 'userRole/getAreaListByOrgId/' + param, function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['bdId', 'bdName'], editData.areaId, '1')
}
// 项目下拉
function getProject(select, param, editData, cb) {
    var select = $(select);
    selectAdapterGetN(select, '', 'userRole/getProListByAreaId/' + param.areaId, function () {
        select.searchableSelect({
            afterSelectItem: function (d) {
                if (this.holder.data('value')) { //x
                    var projectName = this.holder.text().trim()
                    this.element.data('projectName', projectName)
                }
                var selVal = this.holder.data('value')
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['bdId', 'bdName'], editData.projectId, '2')
}
//  业务标准下拉
function getManagement(select, param, editData, cb) {
    var select = $(select);
    selectAdapterPost(select, param, 'management/selectAll', function () {
        select.searchableSelect({
            afterSelectItem: function (d) {
                if (this.holder.data('value')) { //x
                    var projectName = this.holder.text().trim()
                    this.element.data('projectName', projectName)
                }
                if (cb) {
                    cb()
                }
            }
        })
    }, ['id', 'standName'], editData ? editData.standId : '', '9')
}
//  业务分类下拉
function getManagement(select, param, editData, cb) {
    var select = $(select);
    selectAdapterPost(select, param, 'management/selectAll', function () {
        select.searchableSelect({
            afterSelectItem: function (d) {
                if (this.holder.data('value')) { //x
                    var projectName = this.holder.text().trim()
                    this.element.data('projectName', projectName)
                }
                if (cb) {
                    cb()
                }
            }
        })
    }, ['id', 'standName'], editData ? editData.standId : '', '9')
}


// 苑区下拉
function getDistrict(array, param, editData, cb) {
    var select = $(array[0]);
    selectAdapterGetN(select, { 'projectId': param.projectId }, 'baseDistrict/selectList', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (selVal) {
                    var districtName = this.holder.text().trim()
                }
                this.element.data('basedistrictListName', districtName)
                if (cb) {
                    cb(selVal)
                }

            }
        })
    }, ['id', 'name'], editData ? editData.districtId : '', '3')
}
// 街道下拉
function getStreet(array, param, editData, cb) {
    var select = $(array[1]);
    var params = {
        'districtId': $(array[0]).val(),
        'projectId': param.projectId
    }
    selectAdapterGetN(select, params, 'baseStreet/selectList', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (selVal) {
                    var streetName = this.holder.text().trim()
                }
                this.element.data('streetName', streetName)
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['id', 'name'], editData ? editData.streetId : '', '4')
}
// 楼栋下拉
function getBuilding(array, param, editData, cb) {
    var select = $(array[2]);
    var params = {
        'streetId': $(array[1]).val(),
        'districtId': $(array[0]).val(),
        'projectId': param.projectId
    }
    selectAdapterGetN(select, params, 'baseBuilding/selectList', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (selVal) {
                    var bulidingtName = this.holder.text().trim()
                }
                this.element.data('buildingName', bulidingtName)
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['id', 'name'], editData ? editData.buildingId : '', '5')
}

// 单元下拉
function getUnit(array, param, editData, cb) {
    var select = $(array[3]);
    var params = {
        'buildingId': $(array[2]).val(),
        'streetId': $(array[1]).val(),
        'districtId': $(array[0]).val(),
        'projectId': param.projectId
    }
    selectAdapterGetN(select, params, 'baseUnit/selectList', function () {
        select.searchableSelect({
            afterSelectItem: function () {
                var selVal = this.holder.data('value')
                if (selVal) {
                    var unitName = this.holder.text().trim()
                }
                this.element.data('unitName', unitName)
                if (cb) {
                    cb(selVal)
                }
            }
        })
    }, ['id', 'name'], editData ? editData.unitId : '', '6')
}
// 机房下拉
function getRoom(array, param, editData, cb) {
    var select = $(array[4]);
    var params = {
        'unitId': $(array[3]).val(),
        'buildingId': $(array[2]).val(),
        'streetId': $(array[1]).val(),
        'districtId': $(array[0]).val(),
        'projectId': param.projectId
    }
    if (select) {
        selectAdapterPostN(select, params, 'machineRoom/selectAll', function () {
            select.searchableSelect({
                afterSelectItem: function () {
                    if (this.holder.data('value')) {
                        var machineRoomName = this.holder.text().trim()
                    }
                    this.element.data('machineRoomName', machineRoomName)
                    if (cb) {
                        cb()
                    }
                }
            })
        }, ['id', 'name'], editData ? editData.roomId : null, '7')
    }
}


// 机房地址联动
function getEquipmentAddress(array, param, editData, cb) {
    var basedistrictList = array[0] ? $(array[0]) : null
    var streetList = array[1] ? $(array[1]) : null
    var buildingList = array[2] ? $(array[2]) : null
    var unitList = array[3] ? $(array[3]) : null
    var roomList = array[4] ? $(array[4]) : null
    var projectId = param.projectId
    if (!editData) {
        editData = {
            areaId: '',
            projectId: '',
            districtId: '',
            streetId: '',
            buildingId: '',
            unitId: '',
            roomId: '',
            equipmentIds: ''
        }
    }
    // 获取苑区下拉
    if (basedistrictList) {
        getDistrict(array, param, editData, function (e) {
            // 街道下拉
            if (streetList) {
                // clearN(array.slice(3))
                getStreet(array, param, editData, function (e) {
                    // 楼栋下拉
                    if (buildingList) {
                        // clearN(array.slice(4))
                        getBuilding(array, param, editData, function (e) {
                            // 单元下拉
                            if (unitList) {
                                // clearN(array.slice(5))
                                getUnit(array, param, editData, function () {
                                    if (roomList) getRoom(array, param, editData);
                                })
                            } else {
                                if (roomList) getRoom(array, param, editData);
                            }
                        })
                    } else {
                        if (roomList) getRoom(array, param, editData);
                    }
                })
            } else {
                getRoom(array, param, editData);
            }
        })
    }
}

// 获取天数
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
    return y + "-" + m + "-" + d;
}

//删除，跑一次，启动，暂停 弹框函数封装
function getTipOpen(data, tipDomNote, yesFun) {
    var domContent = '<strong>【' + data.name + '</strong>】' + tipDomNote
    layer.open({
        type: 1,
        skin: 'layer-ext-wjlskin', // 自定义的弹框皮肤
        title: ['提示'],//标题内容展示，默认为[提示]
        area: ['420px'], //宽,高自适应
        shadeClose: true, //点击遮罩关闭
        content: domContent,
        btn: ['确定', '取消'],
        closeBtn: 0,
        yes: function (index, layero) {
            //按钮【确定】的回调
            layer.close(index);
            yesFun();
        },
        btn2: function (index, layero) {
            //按钮【取消】的回调
            layer.close(index);
        },
        cancel: function (index) {
            //右上角关闭回调
            layer.close(index);
        },
    });
}

// 鼠标拖拽
function handleTagDrag() {
    $(".tipGroup ").mousedown(function (e) {
        if (e.target && e.target.nodeName == "SPAN") {
            tagDrag()
        }
    })
}
