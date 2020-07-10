$(document).ready(function () {
    var data = [];
    $.adapter_get_async('', 'menu/getMenuList', function (d) {
        if (d.status == 1) {
            data = d.data.children
            $.adapter_get('', 'userRole/getPemission', function (permsData) {
                if (permsData.status == 1) {
                    var permsList = {};
                    for (var i = 0; i < permsData.data.length; i++) {
                        var l = permsData.data[i];
                        var list = l.split(':');
                        if (permsList[list[0] + ':' + list[1]]) {
                            permsList[list[0] + ':' + list[1]].push(list[2])
                        } else {
                            permsList[list[0] + ':' + list[1]] = [list[2]]
                        }
                    }
                    window.sessionStorage.setItem('permssion', JSON.stringify(permsList))
                }
            })
        }
    })
    //获取消息提醒内容判断红点是否显示
    $.adapter_post({}, 'message/list', function (d) {
        if (d.status == '1') {
            if (d.data.total > 0) {
                $('.msgTip em').show()
            } else {
                $('.msgTip em').hide()
            }
        }
    })
    // 每个菜单id对应的单个数据，children.length == 0 的数据
    var idMapData = {};
    // 每个菜单id对应的孩子数据，children.length > 0 的数据
    var idChildrenData = {};
    ;
    // 当前活动的Page
    var currPage = null;
    // 当前菜单是否是展开状态
    var expendMenu = true;
    /**
     * 左侧菜单栏展开关闭事件
     */
    window.leftMenuToggleEvent = function (e) {
        toggleMenu();
        $(e.currentTarget).toggleClass('open', '');
    }

    // 监听鼠标滚轮事件
    $(".left").mouseenter(function () {
        if (expendMenu) {
            window._Wheel.registerWheelEvent(onScrollMenu);
        }
    });

    $(".left").mouseleave(function () {
        if (expendMenu) {
            window._Wheel.unregisterWheelEvent(onScrollMenu);
        }
    });

    /**
     * 通过鼠标滚轮的滚动，来控制菜单的滚动
     */
    function onScrollMenu(e) {
        e = e || window.event;
        var distance = e.wheelDelta || e.detail;
        if (e.detail) {
            distance = distance > 0 ? 50 : -50;
        } else {
            distance = distance > 0 ? -50 : 50;
        }
        $(".left ul.first").scrollTop($(".left ul.first").scrollTop() + distance);
    }

    /**
     * 初始化菜单
     */
    function initMenu() {
        loopCreateMenu($(".first"), data);
        $(".first li").click(onMenuItemClick);
        // $(".left ul.first li").hover(onHoverInMenuItem, onHoverOutMenuItem);
        initData(data);
        // 监听左侧菜单hover
        $('.menu.first li').hover(function (e) {
            var ele = $(this).children(":first").children(":first")[0];
            var currentclassName = $(this).children(":first").children(":first")[0].classList[0]
            var classHover = currentclassName.split('-')[1]
            if (classHover) {
                $(ele).attr('class', classHover + ' ' + 'menu-icon')
            }
        }, function (e) {
            var ele = $(this).children(":first").children(":first")[0];
            var currentclassName = $(this).children(":first").children(":first")[0].classList[0]
            if (currentclassName.indexOf('icon') == -1) {
                var classHover = 'icon-' + currentclassName
                $(ele).attr('class', classHover + ' ' + 'menu-icon')
            }
        })
    }

    /**
     * 初始化数据
     */
    function initData(list) {
        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            if (obj.children.length > 0) {
                idChildrenData[obj.id] = obj.children;
                arguments.callee(obj.children);
            }
        }
    }

    /**
     * 递归创建菜单
     */
    function loopCreateMenu(parent, menuData) {
        var menuList = {};
        for (var i = 0; i < menuData.length; i++) {
            var menu = menuData[i];
            var $menuItem = $(createMenuItem(menu));
            parent.append($menuItem);
            if (menuData[i]['perms'] != '') {
                menuList[menuData[i]['path']] = menuData[i]['perms'];
            }
            if (menu.children.length > 0) {
                var $childMenuBox = $("<ul class='menu hide inner-menu'></ul>");
                $menuItem.append($childMenuBox);
                arguments.callee($childMenuBox, menu.children);
            }
        }
        if (window.sessionStorage.getItem('permsList')) {
            var j1 = JSON.parse(window.sessionStorage.getItem('permsList'));
            window.sessionStorage.setItem('permsList', JSON.stringify(parseJson(j1, menuList)))
        } else {
            window.sessionStorage.setItem('permsList', JSON.stringify(menuList));
        }
    }

    function createMenuItem(menu) {
        if (menu.children.length == 0) idMapData[menu.id] = menu;
        var arrowCls = menu.children.length > 0 ? '' : 'hide';
        var pl = ((menu.level == 1 ? 0 : 2) - 1) * 50;
        return "<li menu-id='" + menu.id + "'>" +
            "<div class='box' style='padding-left: " + pl + "px'>" +
            "<i class='" + menu.icon + " menu-icon'></i>" +
            "<a style='float:left;'>" + menu.title + "</a>" +
            "<i class='menu-arrow icon-sk027 " + arrowCls + "' style='display: none'></i>" +
            "</div>" +
            "</li>";
    }

    /**
     * 响应菜单项的点击事件
     */
    function onMenuItemClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if ($(ev.target).closest(".layui-table-tips").length == 0 && $(".layui-table-tips").length > 0 && $(ev.target).closest(".layui-table-grid-down").length == 0) {
            layer.closeAll();
        }
        layer.closeAll('dialog'); //关闭检查结果列表dialog；added by weijvlian

        if ($(ev.currentTarget).has("ul").length > 0) {
            if (!$(ev.currentTarget).find(".menu-arrow").first().hasClass("hide")) {
                $(ev.currentTarget).find(".menu-arrow").first().toggleClass('icon-sk039', 'icon-sk027');
            }
            if (!expendMenu) return;
            $(ev.currentTarget).find("ul").first().slideToggle(300);
        } else {
            $(ev.currentTarget).closest('.first').find('li').removeClass('current') //added by weijvlian 点击后li增加current样式
            $(ev.target).closest('li').addClass('current') //added by weijvlian 点击后li增加current样式
            excuteMenuEvent(ev);
        }
        //关闭检查结果分类dialog；added by weijvlian
        if (!$('body').has('#resultDetails') || !$('#resultDetails').css('display') || $('#resultDetails').css('display') == 'none') {
            $('.classify-clone-wrap').remove();
        }
    }

    /**
     * 执行菜单事件
     */
    function excuteMenuEvent(ev) {
        var id = $(ev.currentTarget).attr("menu-id");
        addTab({
            id: idMapData[id].id,
            title: idMapData[id].title,
            path: idMapData[id].path
        });
        // TODO 菜单点击之后的操作

    }


    function addTab(tab) {
        createTabPage(tab.id, tab.path);
    }

    /**
     * 创建新的页面
     * @param path
     */
    function createTabPage(id, path) {
        var page = $("<div class='mypage' id='page" + id + "' ></div>");
        if (currPage != null) {
            currPage.addClass('hide');
        }
        $(".container").html('').append(page);
        page.removeClass('hide');
        currPage = page;
        // 加载目标网页
        if (path.indexOf('integration-admin') == -1)
            path = '/integration-admin/' + path
        window.loadPage(page[0], path);
    }

    /**
     * 展开/关闭菜单
     */
    function toggleMenu() {
        toggleLeftMenu();
        toggleTopBar();
        reSetContainerSize();
    }

    /**
     * 展开/收缩左侧菜单
     */
    function toggleLeftMenu() {
        expendMenu = !expendMenu;
        $(".left").toggleClass('slide-left-out', '');
        $(".inner-menu").slideUp();
    }

    /**
     * 展开/收缩顶部导航
     */
    function toggleTopBar() {
        $(".top").toggleClass('slide-top-out', '');
    }

    /**
     * 重置内容区域宽高
     */
    function reSetContainerSize() {
        $(".container").toggleClass('zoom-container', '');
    }

    /**
     * 上一页
     */
    function onPrePage() {
        $(".tab-scroll").scrollLeft($(".tab-scroll").scrollLeft() - 135);
    }

    /**
     * 下一页
     */
    function onNextPage() {
        $(".tab-scroll").scrollLeft($(".tab-scroll").scrollLeft() + 135);
    }

    function onHoverInMenuItem(ev) {
        if (expendMenu) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        var menuId = $(ev.currentTarget).attr("menu-id");
        var floatMenu = document.getElementById("f" + menuId);
        if (floatMenu == null) {
            if (idChildrenData[menuId]) {
                createFloatMenu(ev.currentTarget, menuId);
            }
        }
    }

    function onHoverOutMenuItem(ev) {
        if (expendMenu) {
            return;
        }
        var menuId = $(ev.currentTarget).attr("menu-id");
        var floatMenu = document.getElementById("f" + menuId);
        if (floatMenu != null) {
            $(floatMenu).fadeOut(function () {
                $(floatMenu).remove();
            })
        }
    }

    /**
     * 创建悬浮菜单
     */
    function createFloatMenu(target, menuId) {
        var menuData = idChildrenData[menuId];
        var $floatMenu = $("<div class='float-menu hide' id='f" + menuId + "'></div>");
        $floatMenu.append("<div class='float-arrow'></div><ul></ul>");
        for (var i = 0; i < menuData.length; i++) {
            var menu = menuData[i];
            var $menuItem = $(createFloatMenuItem(menu));
            $menuItem.hover(onHoverInMenuItem, onHoverOutMenuItem);
            $menuItem.click(onFloatMenuItemClick);
            $floatMenu.find("ul").append($menuItem);
        }
        $(target).append($floatMenu);
        setFloatMenuPosition(target, $floatMenu);
    }

    /**
     * 设置悬浮菜单的位置
     * 如果下级菜单的高度大于上级菜单的top值，则底部对其
     * 在菜单显示之前是无法获取高度的，所以这里用菜单的固定高度*菜单的数量来计算
     */
    function setFloatMenuPosition(target, $floatMenu) {
        var offset = $(target).offset();
        offset.left += target.clientWidth;
        var floatMenuHeight = $floatMenu.find("ul").first().children().length * 50;
        if ($("body").height() - offset.top < floatMenuHeight) {
            offset.top -= (floatMenuHeight - 50);
            var arrowOffset = $(".float-arrow").offset();
            arrowOffset.top += (floatMenuHeight - 50);
            $(".float-arrow").offset(arrowOffset);
        }
        $floatMenu.offset(offset);
        $floatMenu.fadeIn();
    }

    /**
     * 创建悬浮菜单项
     */
    function createFloatMenuItem(obj) {
        var arrCls = obj.children.length > 0 ? "icon-sk027" : "icon-sk027 hide";
        return "<li menu-id='" + obj.id + "'><a>" + obj.title + "</a><i class='" + arrCls + "'></i></li>";
    }

    /**
     * 浮动菜单的点击事件
     */
    function onFloatMenuItemClick(e) {
        e.preventDefault();
        e.stopPropagation();
        var menuId = $(e.currentTarget).attr("menu-id");
        if (!idChildrenData[menuId]) {
            excuteMenuEvent(e);
            $(".float-menu").remove();
        }
    }

    $(".tab-pre").click(onPrePage);
    $(".tab-next").click(onNextPage);
    $('.logo').click(function () {
        if ($('#page000').length > 0) {
            $('.mypage').hide();
            $('#page000').show();
        } else {
            createTabPage('000', '/integration-admin/common/main/index.html')
        }
    })
    $('#userName').text(getCookie('userNameInteger'))
    initMenu();
    createTabPage('000', '/integration-admin/common/main/index.html')
    $('.userName').click(function (e) {
        e = window.event || e;
        e.stopPropagation();
        if (!$('.dropdown_ul').is(':visible')) {
            $('.dropdown_ul').show();
        }
    })
    $('body').click(function (e) {
        e = window.event || e;
        var obj = e.srcElement || e.target;
        if ($('.dropdown_ul').is(':visible')) {
            $(".dropdown_ul").hide();
        }
    })
})

function loginOut() {
    delCookie('token');
    window.sessionStorage.setItem('token', null);
    location.href = '/login';
}

function udateUserPassword() {
    $('input:password').val('')
    $('#user').val(getCookie('userInteger'));
    $('#frameModal').modal();
}

function savePassword() {
    if ($('#newPassword').val() != $('#submitPassword').val()) {
        layer.msg('确认密码与新密码不一致')
        return;
    } else if ($('#newPassword').val() == $('#oldPassword').val()) {
        layer.msg('修改后密码不能与原密码一致')
        return
    }
    var param = {
        newPassword: $.md5($('#newPassword').val()),
        password: $.md5($('#oldPassword').val()),
        telephone: $('#user').val()
    }
    $.adapter_put(param, 'user/changePwd', function (d) {
        layer.msg(d.msg)
        if (d.status == 1) {
            $('#frameModal').modal('hide');
            loginOut()
        }
    })
}
function parseJson(j1, j2) {
    var result = {};
    for (var key in j1) {
        result[key] = j1[key]
    }
    for (var key2 in j2) {
        result[key2] = j2[key2]
    }
    return result;
}



