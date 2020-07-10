// 区域项目绑定 s
var associated_Obj = [{
    url: 'userRole/getBDList', //请求的地址
    is_associated: false, //请求的地址是否动态获取
    elem: '#area', //dom selector
    placeholder: '请选择区域', // 输入框提示内容
    pro_name: 'areaList' // 请求返回参数所需数据字段，默认 data:{arealist:[],status:1}
}, {
    url: 'userRole/getProListByAreaId',
    is_associated: true,
    elem: '#project',
    placeholder: '请选择项目',
    pro_name: ''
}];
$(document).ready(function () {
    // 检查结果列表初始化
    initMainTable()
    getAreaProject(['#org','#area', '#project'])
    scrollDialogClose()
    //检查结果检查分类弹框隐藏
    $('body').on('click',function(){
        if(!$('body').has('#resultDetails') || !$('#resultDetails').css('display')|| $('#resultDetails').css('display') == 'none'){
            $('.classify-clone-wrap').remove();
        }
    })
});
// 主表函数
function initMainTable(params) {
    var columnsSet = [
        [{
                title: '区域',
                field: 'areaName'
            },
            {
                title: '项目',
                field: 'projectName'
            },
            {
                title: '满分',
                field: 'score'
            },
            {
                title: '得分',
                field: 'checkScore'
            },
            {
                title: '处理人',
                field: 'dealPeople'
            },
            {
                title: '检查时间',
                field: 'checkTime'
            },
            {
                title: '操作',
                toolbar: '#operate'
            }
        ]
    ]
    layTable({
        'url': 'checkResult/list', //checkResult/list
        'param': params || {},
        'method': 'post',
        'tablecols': columnsSet,
        'data': 'records'
    }, '#m-table-inspection-result')
}
// 主表 导出
function inspectionResultExports(data) {
    var id = data.id
    $.fileDownLoadExport('checkResult/export/' + id, true)
}
// 主表 查询
function submitForm() {
    var params = {
        orgId: $('#org').val() ? $('#org').val() * 1 : null,
        areaId: $('#area').val() ? $('#area').val() * 1 : null,
        projectId: $('#project').val() ? $('#project').val() : null,
        dealPeople: $('#create_by').val() ? $('#create_by').val() : null
    }
    initMainTable(params)
}
// 主表 重置
function resetSearch() {
    getAreaProject(['#org','#area', '#project'])
    $('#create_by').val('');
}
//加载详情页
function inspectionResultDetails(archive) {
    if (!archive.id) {
        return;
    }
    $.adapter_get('', 'checkResult/info/' + archive.id, function (res) {
        
        //resultExport
        $('#resultExport').off('click').on('click',function(){
            var id = archive.id
            $.fileDownLoadExport('checkResult/export/' + id, true)
        })

        if (res.status == 1) {
            var d = res;
            $('#inspectionResult').hide();
            var dom_result_detail_body = $('#resultDetails').show().find('.resultDetailsBody').empty();
            $('#resultDetails').find('.title_style').text(d.data.areaName + d.data.projectName + '检查结果')
            dom_result_detail_body.prepend('<div class="intro-row"><h3 class="line-title mt10">总体检查情况</h3><div class="intro-cont"><dl><dd>' + d.data.projectCheckScore + '</dd><dt>总得分</dt></dl><dl><dd>' + d.data.projectScore + '</dd><dt>满分</dt></dl></div></div>')

            //所在类型数据循环处理包括子分类、图片、意见
            var classifies_arr = d.data.resultClassifies //所有分类set
            var buildClassifies = function(){
                if (classifies_arr.length !== 0) {
                    var dom_wrap_calssfies = $('<div class="wrap_calssfies"></div>');
                    var dom_classfies = $('<form class="classify layui-form"></form>')
                    for (var i = 0; i < classifies_arr.length; i++) {
                        //分类罗列出页面
                        dom_classfies.append('<input type="radio" name="classify" lay-filter="aa" id="classify_' + i + '"  value="' + i + '" title="' + classifies_arr[i].classifyName + '" >')
                    }
                    dom_classfies.on('change', function (e) {
                        //隐藏检查分类溢出展示窗口
                        if($('.classify-clone-wrap').length!==0){$('.classify-clone-wrap').hide();}
                        
                        var index = e.target.value;
                        var classifies_s = classifies_arr[index] //单个分类获取
                        if (dom_wrap_calssfies.find('.classify-container-' + index).length == 0) {
                            dom_wrap_calssfies.append('<div class="classify-container classify-container-' + index + '"></div>')
                            var dom_sub_classfies = dom_wrap_calssfies.find('.classify-container-' + index)
                        } else {
                            dom_wrap_calssfies.find('.classify-container-' + index).show().siblings('.classify-container').hide()
                            return;
                        }
                        dom_sub_classfies.show().siblings('.classify-container').hide()
                        dom_sub_classfies.append('<div class="intro-row pro-intro-row"><h3 class="line-title">' + classifies_s.classifyName + '检查详情</h3><div class="tip">(本页只显示0分项，更多详情请导出查看)</div><div class="intro-cont"><dl><dd>' + classifies_s.classifyCheckScore + '</dd><dt>得分</dt></dl><dl><dd>' + classifies_s.classifyScore + '</dd><dt>满分</dt></dl></div></div>');
    
                        //子分类详情获取
                        var sub_classifies_arr = classifies_s.criterionDescriptions // 子分类集合
                        if (sub_classifies_arr.length !== 0) {
                            for (var j = 0; j < sub_classifies_arr.length; j++) {
                                dom_sub_classfies.append('<div class="classify-item"></div>');
                                var dom_sub_classfies_item = dom_sub_classfies.find('.classify-item').eq(j);
                                dom_sub_classfies_item.append('<table id="details-table-' + index + j + '" lay-filter="LAY-table-' + index + j + '" cellspacing="0" style="width: 100%;"></table>')
                                //子分类
                                var sub_classifies_s = sub_classifies_arr[j];
                                //子分类中的二级分类
                                var sub_classifies_arr_othr = sub_classifies_s.resultSubclasses; //二级分类集合
                                var format_dym_header = [{
                                        field: 'effectDesc',
                                        title: '效果标准',
                                        fixed: 'right',
                                        minWidth: 150,
                                        templet: toolbalModal(sub_classifies_s.effectDesc)
                                    },
                                    {
                                        field: 'criterionDesc',
                                        title: '检查标准',
                                        fixed: 'right',
                                        minWidth: 150,
                                        templet: toolbalModal(sub_classifies_s.criterionDesc)
                                    },
                                    {
                                        field: 'subclassCheckScore',
                                        title: '得分',
                                        fixed: 'right',
                                        width: 60,
                                        templet:'<div><span class="emp">{{d.subclassCheckScore}}</span>分</div>'
                                    },
                                    {
                                        field: 'isHandle',
                                        title: '是否处理',
                                        fixed: 'right',
                                        width: 105,
                                        templet:function(d){
                                            if(d.isHandle == 0)
                                            return '<span>否</span>'
                                            else return '<span class="emp"> 是</span>'
                                        }
                                    }
                                ];
                                for (var m = sub_classifies_arr_othr.length - 1; m >= 0; m--) {
                                    //layui header格式化
                                    var $width = sub_classifies_arr_othr[m].subclassName.length * 14 + 30;
                                    var item = {
                                        field: 'subclassDesc',
                                        title: sub_classifies_arr_othr[m].subclassName,
                                        templet: toolbalModal(sub_classifies_arr_othr[m].subclassDesc),
                                        minWidth: $width
                                    }
                                    format_dym_header.unshift(item)
                                }
    
                                // 检查结果详情table生成
                                var table = layui.table;
                                //展示已知数据
                                table.render({
                                    elem: '#details-table-' + index + j,
                                    filter: 'LAY-table-' + index + j,
                                    cols: [format_dym_header],
                                    data: [sub_classifies_s],
                                    text: {
                                        none: '/' //默认：无数据。注：该属性为 layui 2.2.5 开始新增
                                    },
                                    id: index + j,
                                    done: function (res, curr, count) {
                                        $(dom_sub_classfies_item).on('click', '.table-cell-text-control', function (e) {
                                            var offsetleft = $(e.target).parent().parent().offset().left;
                                            var offsettop = $(e.target).parents('tr').offset().top;
                                            var tipHeight = $(e.target).parents('tr').height();
                                            var tipWidth = '30';
                                            if (($(document).width() - offsetleft) / $(document).width() > tipWidth / 200) {
                                                tipWidth = '20'
                                            } else {
                                                tipWidth = '30'
                                            }
                                            layer.open({
                                                type: 0 //此处以iframe举例
                                                    ,
                                                title: false,
                                                btn: [],
                                                skin: 'result-dialog',
                                                area: [tipWidth + '%', tipHeight + 'px'],
                                                shade: 0,
                                                maxmin: true,
                                                offset: [ //为了演示，随机坐标
                                                    offsettop + 'px', offsetleft + 'px'
                                                ],
                                                content: $(e.target).data('text')
                                            });
                                        })
                                        //悬浮列不显示及高度问题
                                        var $tableViews = $(this.elem.parent()).find(".layui-table-view");
                                        $tableViews.each(function () {
                                            var $fixed = $(this).find(".layui-table-fixed");
                                            // 判断div宽度是否小于table宽度
                                            var dif = Math.abs($(this).width() - $(this).find("table").width())
                                            if (dif >= 1) {
                                                $fixed.removeClass("layui-hide");
                                            }
                                            $fixed.find('.layui-table-body tr').each(function (index, val) {
                                                $(this).height($fixed.siblings('.layui-table-main').eq(index).height());
                                            });
                                        });
                                    }
    
                                })
                                //检查意见
                                sub_classifies_s.subclassCheckSuggestion ? sub_classifies_s.subclassCheckSuggestion : sub_classifies_s.subclassCheckSuggestion = '无'
                                dom_sub_classfies_item.append('<div class="suggest-row">检查意见：<span class="check-suggestion">' + sub_classifies_s.subclassCheckSuggestion + '</span></div>');
    
                                //图片
                                var sub_classifies_s_img_arr = sub_classifies_s.pictures;
                                if (sub_classifies_s_img_arr.length !== 0) {
                                    var dom_img_item = $('<div class="x-row image-row"></div>');
                                    for (var n = 0; n < sub_classifies_s_img_arr.length; n++) {
                                        dom_img_item.append('<img src="' + sub_classifies_s_img_arr[n] + '" />')
                                    }
                                    dom_sub_classfies_item.append(dom_img_item);
                                } else {
                                    dom_sub_classfies_item.append('<div class="x-row image-row">检查图片：无</div>');
                                }
    
                            }
                        }else{
                            dom_sub_classfies.find('.pro-intro-row .intro-cont').append('<div class="no-pro-tip"><img src="/integration-admin/images/right.jpg">没有需要整改的项目哦！</div>')
                        }
                    })
                    dom_wrap_calssfies.append(dom_classfies)
                    dom_result_detail_body.append(dom_wrap_calssfies)
                    dom_result_detail_body.find('.classify input').eq(0).attr('checked', 'true').change();
                }
            }
            buildClassifies();
            // 检查图片反馈
            $(dom_result_detail_body).on('click', '.image-row', function (event) {
                var src = $(event.target).data('src') ? $(event.target).data('src') : $(event.target).attr('src');
                var big_src = src ? src.split('?')[0] : src
                if (big_src) {
                    $("#resultImages .modal-content").empty()
                    $("#resultImages").modal().find('.modal-content').append('<span class="imgclose" data-dismiss="modal" aria-hidden="true">关闭</span><img src = "' + big_src + '" >')
                }
                return;
            })
            layui.use('form', function () {
                var form = layui.form;

                form.on('radio(aa)', function (data) {
                    $(data.elem).change();
                    form.render()
                });
                form.render()
            });

            var $classify = dom_result_detail_body.find('.wrap_calssfies')
            if (dom_result_detail_body.find('.classify').width() > dom_result_detail_body.width() * 0.7) {
                dom_result_detail_body.find('.classify').css({
                    'right':'36px',
                    'max-width':'80%'
                });
                var $classifyTips = $('<div class="classify-tips"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>')
                $classifyTips.off('click').on('click', function (e) {
                    e.stopPropagation();
                    if($('body').find('.classify-clone-wrap').length !==0){
                        $('body').find('.classify-clone-wrap').toggle();
                    }else{
                        var left = $(e.target).offset().left - 268;
                        var top = $(e.target).offset().top + 26;
                        var wrap_calssfies = $('<div class="classify-clone-wrap" style="position:absolute; z-index:999;background:#fff; border:1px solid #ccc; left:'+ left +'px;top:'+ top +'px;"><span class="arrow"></span><span class="arrow2"></span></div>')
                        var dom_classfies = $('<form class="classify-clone layui-form"></form>')
                        for (var i = 0; i < classifies_arr.length; i++) {
                            //分类罗列出页面
                            dom_classfies.append('<input type="radio" name="classifyClone" lay-filter="bb" id="classifyClone_' + i + '"  value="' + i + '" title="' + classifies_arr[i].classifyName + '" >')
                        }
                        wrap_calssfies.append(dom_classfies);
                        $('body').append(wrap_calssfies)
                        dom_classfies.off('change').on('change',function(e){
                            dom_result_detail_body.find('.classify input').eq(e.target.value).attr('checked', 'true').change();
                        })
                    }
                    $('body').find('.classify-clone input').eq(dom_result_detail_body.find('.classify input:checked').val()).prop('checked', true)
                    layui.use('form', function () {
                        var form = layui.form;
                        form.on('radio(bb)', function (data) {
                            $(data.elem).change();
                            form.render()
                        });
                        form.render()
                    });
                })

                $classify.prepend($classifyTips)
            // Firefox和Chrome早期版本中带有前缀
            // var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            // // 选择目标节点
            // var target = document.querySelector('.classify');
            // // Options for the observer (which mutations to observe)
            // var config = {
            //     attributes: true,
            //     childList: true,
            //     subtree: true
            // };

            // // Callback function to execute when mutations are observed
            // var callback = function (mutationsList) {
            //     console.log(mutationsList)
            //     for (var mutation of mutationsList) {
            //         if (mutation.type == 'childList') {
            //             console.log('A child node has been added or removed.');
            //         } else if (mutation.type == 'attributes') {
            //             console.log('The ' + mutation.attributeName + ' attribute was modified.');
            //         }
            //     }
            //     
            //     var $classify = dom_result_detail_body.find('.classify')
            //     if($classify.width() > dom_result_detail_body.width()*0.7){
            //         console.log(1)
            //         $classify.append('<div class="classify-tips"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>')
            //     }
            // };

            // // Create an observer instance linked to the callback function
            // var observer = new MutationObserver(callback);
            // // 传入目标节点和观察选项
            // observer.observe(target, config);
            // /停止观察
            //           observer.disconnect(); 

            //s
            }
            layui.use('form', function () {
                var form = layui.form;

                form.on('radio(bb)', function (data) {
                    $(data.elem).change();
                    form.render()
                });
                form.render()
            });

        } else {
            layer.msg('请求数据失败')
        }
    })

    
}

// 详情表自定义模板字段，控制字体展示数字
function toolbalModal(field_value) {
    return function () {
        if (field_value.length > 30) {
            field_value = field_value.replace(/"/g,'&quot;').replace(/'/g,"&apos;")
            return '<div>' + field_value.substring(0, 30) + '...' + '<a class="table-cell-text-control layui-icon layui-icon-down" data-text="' + field_value + '"></a></div>'
        } else {
            return '<div>' + field_value + '</div>'
        }
    }
}

//返回结果列表页
function backResultList() {
    $('#resultDetails').hide()
    $('#inspectionResult').show();
    layer.closeAll('dialog');
}
//拉动滚动条，弹框关闭
function scrollDialogClose() {
    $("#resultDetails").closest('.container').scroll(function () {
        layer.closeAll('dialog');
        $('.classify-clone-wrap').remove();
    });
}
//区域查询下拉调用函数
function getSelectData(option) {
    var associated_Obj;
    option ? associated_Obj = option : associated_Obj = [];

    function getList(index, prevParams, related_id, query_params) {
        index ? index : index = 0;
        var cur_related_id = related_id;
        related_id = prevParams;
        if (index == associated_Obj.length) return;
        var url = associated_Obj[index].url;
        var params = {};

        if (associated_Obj[index].is_associated) {
            url = url + '/' + prevParams
        }
        if (associated_Obj[index].query_string) {
            params[associated_Obj[index].query_string] = prevParams;
            if (associated_Obj[index].double_related) {
                var prev_query_string = associated_Obj[index - 1].query_string;
                params[prev_query_string] = cur_related_id;
                if (!query_params) {
                    query_params = {};
                    query_params[prev_query_string] = cur_related_id;
                }
                query_params[associated_Obj[index].query_string] = prevParams
                params = query_params;
            }
        } else {
            params = ''
            related_id = prevParams
            query_params = ''
        }
        $.adapter_get(params, url, function (res) {
            var current_elem,
                symbol_elem = associated_Obj[index].elem.substring(0, 1),
                pro_name = associated_Obj[index].pro_name,
                data = pro_name ? res.data[pro_name] : res.data,
                placeholder = associated_Obj[index].placeholder,
                data_id = associated_Obj[index].data_id ? associated_Obj[index].data_id : 'bdId',
                data_name = associated_Obj[index].data_name ? associated_Obj[index].data_name : 'bdName';
            if (symbol_elem) {
                if (symbol_elem == '#') {
                    current_elem = $(associated_Obj[index].elem)
                } else if (symbol_elem == '.') {
                    current_elem = $(associated_Obj[index].elem).eq(0)
                }
            }
            if (res.status != 1) return;
            current_elem.html('').append('<option value selected>' + placeholder + '</option>')
            for (var j = 0; j < data.length; j++) {
                current_elem.append('<option value="' + data[j][data_id] + '" >' + data[j][data_name] + '</option>')
                if (data.length == 1) {
                    current_elem.append('<option selected value="' + data[0][data_id] + '" >' + data[0][data_name] + '</option>')
                }
            }
            current_elem.searchableSelect({
                afterSelectItem: function () {
                    if (this.holder.data('value') == '') {
                        for (var m = index + 1; m < associated_Obj.length; m++) {
                            var current_elem = $(associated_Obj[m].elem)
                            current_elem.html('').append('<option value>' + associated_Obj[m].placeholder + '</option>')
                            current_elem.searchableSelect()
                        }
                        return
                    }
                    //循环开始
                    return getList(index + 1, this.holder.data('value'), related_id, query_params)
                }
            })
        })
    };
    getList()
}

