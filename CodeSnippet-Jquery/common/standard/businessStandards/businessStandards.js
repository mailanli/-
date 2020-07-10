$(document).ready(function () {
    window.sessionStorage.removeItem('query_param') //移除其它页面存入的session 
    businessStandardsTable()
    // getAreaProject(['#orgList','#areaList'])
    dialogEdit1(['#orgList', '#areaList'])
    $('#serviceName').searchableSelect({
        afterSelectItem: function () { }
    })
})

function dialogEdit1(array, editDatas) {
    // 获取区域下拉框数据
    var orgList = $(array[0])
    var areaList = $(array[1])
    var editData
    if (!editDatas) {
        editData = {
            orgId: '',
            areaId: '',
            standId: ''
        }
    } else {
        editData = editDatas
    }
    selectAdapterGet(orgList, '', 'userRole/getOrgList', function () {  //公司
        orgList.searchableSelect({
            afterSelectItem: function () {
                clearN(array.slice(1)) //清除该select联动的其它select数据   
                selectAdapterGet(areaList, '', 'userRole/getAreaListByOrgId/' + this.holder.data('value'), function () {  //区域
                    areaList.searchableSelect({
                        afterSelectItem: function () {
                            editData.standId ? typeName(editData.standId) : typeName()
                        }
                    })
                }, ['bdId', 'bdName'], editData.areaId, '1')
            }
        })
    }, ['bdId', 'bdName'], editData.orgId, '0')
}

function adapterDataToArry(select, data, option, editDataID, order) {
    for (var key in data) {
        if (Array.isArray(data[key])) {
            var placeholder = select.children('option').eq(0).text();
            var unEditDataIdNum = 0;
            select.html('').siblings('div').remove();
            if (data[key].length == 1 && !editDataID && (order == '0' || order == '1')) {
                select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
            } else {
                for (var i = 0; i < data[key].length; i++) {
                    var listData = data[key][i]
                    var selectType = editDataID == listData[option[0]] ? 'selected' : ''
                    select.append('<option value="' + listData[option[0]] + '" ' + selectType + '>' + listData[option[1]] + '</option>')
                    if (!selectType) unEditDataIdNum++ // 不存在相应id数量
                }
            }
            unEditDataIdNum !== data[key].length ? select.prepend('<option value= "">' + placeholder + '</option>') : select.prepend('<option value= "" selected>' + placeholder + '</option>')
            return
        } else if (typeof (data[key]) == 'object') {
            if (data[key] == null) {
                select.html('')
                initName(select, order)
            } else {
                adapterDataToArry(select, data[key], option, editDataID, order)
                return
            }
        }
    }
}

function initName(select, order) {
    switch (order) {
        case '0':
            select.append('<option value="" selected>请选择区域...</option>')
            break;
        default:
            select.append('<option value="" selected>请选择...</option>')
            break;
    }
}

function businessStandardsTable(params, pageNo) {
    var columnsSet = [
        [{
            title: '序号',
            type: 'numbers'
        },
        {
            title: '区域',
            field: 'areaName'
        },
        {
            title: '标准名称',
            field: 'standName'
        },
        {
            title: '业务大类',
            field: 'typeName'
        },
        {
            title: '创建人',
            field: 'createByName'
        },
        {
            title: '创建时间',
            field: 'createTime'
        },
        {
            title: '服务性质',
            field: 'serverTypeName'
        },
        {
            title: '操作',
            toolbar: '#barDemo'
        }
        ]
    ]
    layTable({
        'url': 'management/list',
        'param': params || {},
        'method': 'post',
        'tablecols': columnsSet,
        'data': 'records',
        'pageNo': pageNo ? pageNo : (params == false || params) ? true : false
    }, '#businessStandardsTable')
}

function submitForm() {
    var param = {
        "standName": $('.standardName').val(),
        "orgId": $('.orgList').val(),
        "areaId": $('.areaList').val(),
        "typeId": $('#serviceName').val(),
        "createByName": $('.createByName').val(),
    }
    businessStandardsTable(param, 1)
    window.sessionStorage.setItem('query_param', JSON.stringify(param))
}

function add() {
    $('#businessStandardsModal').modal();
    $('#myModalLabel').html('<h4 class="modal-title addBusinessStandards" id="myModalLabel">添加标准</h4>')
    dialogEdit1(['#orgList1', '#areaList1'])
    // getAreaProject(['#orgList1','#areaList1'])
    $('#serviceName2').val('')
    $('#workTime').removeAttr('disabled').css('background', 'none').css('cursor', 'default')
    $('#workTime').val('')
    $('#standardName1').val('')
    $('#serviceName1').val('')
    $('.step').val('')
    $('.accord').prop('checked', false)
    $('#addStep').html('')
    $('#addStep').append('<input class="step steps" type="text" placeholder="">' +
        '<input type="checkbox" name="accord" class="accord accords">' +
        '<label class="lables labless">提供支持依据</label>')
    $('#serviceName2').change(function () {
        if ($(this).val() == '2') {
            $('#serviceName1').html('')
            $('#serviceName1').append('<option value="2" data-id="2">' + "维保" + '</option>')
            typeName()
        } else {
            $('#serviceName1').html('')
            $('#serviceName1').append(
                '<option value="">请选择业务大类 </option>\
                <option value="1" data-id="1">巡检</option>\
                <option value="2" data-id="2">维保</option>\
                <option value="4" data-id="4">检测</option> \
                <option value="7" data-id="7">综合巡逻</option>\
                <option value="8" data-id="8">绿化巡逻</option>\
                <option value="9" data-id="9">保洁巡逻</option>'
                // '<option value="1" data-id="1">' + "巡检" + '</option>' +
                // '<option value="2" data-id="2">' + "维保" + '</option>' +
                // '<option value="3" data-id="3">' + "巡逻" + '</option>'+
                // '<option value="4" data-id="4">' + "检测" + '</option>'
            )
            $('#workTime').removeAttr('disabled').css('background', 'none').css('cursor', 'default')
            $("#serviceName1").removeAttr('disabled').css({
                'background': 'none',
                'cursor': 'text'
            })
        }
    })
    $('#serviceName2').change()
    var standTypeList = $('#typeisName')
    standTypeList.html('')
    standTypeList.append('<option value="" selected>请选择分类名称</option>')
    standTypeList.searchableSelect({
        afterSelectItem: function () { }
    })
    $('#serviceName1').change(function () {
        typeName()
    })
}
function update(data) {
    $('#businessStandardsModal').modal();
    $('#myModalLabel').html('<h4 class="modal-title editBusinessStandards">修改标准</h4>')
    $('#addStep').html('')
    for (i = 0; i < data.descriptions.length; i++) {
        $('#addStep').append('<input class="step steps" type="text" placeholder="">' +
            '<input type="checkbox" name="accord" class="accord accords">' +
            '<label class="lables labless">提供支持依据</label>')
    }
    var a = $('#addStep').find('.step')
    for (i = 0; i < a.length; i++) {
        $(a[i]).val(data.descriptions[i].description)
    }
    var l = $('#addStep').find('.accord')
    for (i = 0; i < l.length; i++) {
        if (data.descriptions[i].provideEvidence == 1) {
            $(l[i]).attr('checked', true)
        } else {
            $(l[i]).attr('checked', false)
        }
    }
    // getAreaProject(['#orgList1','#areaList1'],data)
    dialogEdit1(['#orgList1', '#areaList1'], data)
    $('#serviceName2').change(function (e) {
        if ($(this).val() == '2') {
            $('#serviceName1').html('')
            $('#serviceName1').append('<option value="2" data-id="2">' + "维保" + '</option>')
            $("#workTime").attr('disabled', 'true').css('background', '#ccc').val('0')
            $("#serviceName1").attr('disabled', 'true').css({
                'background': '#ccc',
                'cursor': 'not-allowed'
            })
        } else {
            $('#serviceName1').html('')
            $('#serviceName1').append(
                '<option value="">' + "请选择..." + '</option>' +
                '<option value="1" data-id="1">' + "巡检" + '</option>\
                <option value="2" data-id="2">维保</option>\
                <option value="4" data-id="4">检测</option> \
                <option value="7" data-id="7">综合巡逻</option>\
                <option value="8" data-id="8">绿化巡逻</option>\
                <option value="9" data-id="9">保洁巡逻</option>'
            )
            $('#workTime').removeAttr('disabled').css('background', 'none').css('cursor', 'default')
            $("#serviceName1").removeAttr('disabled').css({
                'background': 'none',
                'cursor': 'text'
            })
        }
        typeName()
    })


    $('#serviceName1').change(function (e) {
        typeName()
        // typeName()

    })
    //change()保证初始化窗口触发change事件
    $('#serviceName2').val(data.serverType)
    $('#workTime').val(data.standardHours)
    $('#standardName1').val(data.standName)
    $('#serviceName1').val(data.typeId)
    $('#typeisName').val(data.standName)
    this.editID = data.id
}

function typeName(id) {
    var type = true;
    if (!$('#serviceName1').val() || !$('#serviceName2').val() || !$('#areaList1').val() || $('#areaList1').val() == 'null') {
        type = false;
    } else {
        $('#workTime').removeAttr('disabled').css('background', 'none').css('cursor', 'default')
    }
    // added by weijulian -s
    if ($('#serviceName2').val() == 2) {
        var isEdit = $('#myModalLabel h4').hasClass('editBusinessStandards');
        $("#workTime").attr('disabled', 'true').css({
            'background': '#ccc',
            'cursor': 'not-allowed'
        }).val('0');
        $("#serviceName1").attr('disabled', 'true').css({
            'background': '#ccc',
            'cursor': 'not-allowed'
        })
    } else {
        $("#workTime").removeAttr('disabled').css({
            'background': 'none',
            'cursor': 'text'
        })
        $("#serviceName1").removeAttr('disabled').css({
            'background': 'none',
            'cursor': 'text'
        })
    }
    // added by weijulian -e
    if (type == true) {
        var param = {
            typeId: $('#serviceName1').val(),
            serverType: $('#serviceName2').val(),
            areaId: $('#areaList1').val(),
            orgId: $('#orgList1').val()
        }
        $.adapter_post(param, 'management/selectName', function (res) {
            var data = res.data;
            var standTypeList = $('#typeisName')
            standTypeList.html('')
            var unEditDataIdNum = 0;
            var placeholder = '请选择分类名称';
            // standTypeList.append('<option value="">请选择分类名称</option>')
            for (var i = 0; i < data.length; i++) {
                var selected = data[i].id == id ? 'selected' : ''
                standTypeList.append('<option value="' + data[i].id + '" ' + selected + '>' + data[i].name + '</option>')
                if (!selected) unEditDataIdNum++ // 不存在相应id数量
            }
            unEditDataIdNum !== data.length ? standTypeList.prepend('<option value= "">' + placeholder + '</option>') : standTypeList.prepend('<option value= "" selected>' + placeholder + '</option>')
            standTypeList.searchableSelect({
                afterSelectItem: function () { }
            })
        })
    }

}

function save() {
    var l = $('#addStep').find('.accord')
    for (i = 0; i < l.length; i++) {
        if ($(l[i]).is(':checked')) {
            $(l[i]).val('1')
        } else {
            $(l[i]).val('0')
        }
    }
    var a = $('#addStep').find('input')
    var b = []
    for (var i = 0; i < a.length; i = i + 2) {
        var c = {
            "description": $(a[i]).val(),
            "provideEvidence": $(a[i + 1]).val()
        }
        b.push(c)
    }
    var isEdit = $('#myModalLabel h4').hasClass('editBusinessStandards')
    var editID = this.editID
    layui.use(['layer'], function () {
        var layer = layui.layer
        if ($('#areaList1').val() == '') {
            layer.msg('区域不能为空')
            return false
        } else if ($('#serviceName1').val() == '') {
            layer.msg('业务大类不能为空')
            return false
        } else if ($('#serviceName2').val() == '') {
            layer.msg('服务性质不能为空')
            return false
        } else if ($('#typeisName').val() == '') {
            layer.msg('分类名称不能为空')
            return false
        }
        var reg = /.*\..*/;
        if ($('#serviceName2').val() == 1 && $('#serviceName1').val() != 7 && $('#serviceName1').val() != 8 && $('#serviceName1').val() != 9 && ($('#workTime').val() == '' || $('#workTime').val() <= 0 || reg.test($('#workTime').val()))) {
            layer.msg('工时不能为空且必须为大于0的正整数')
            return false
        } else if ($('#serviceName2').val() == 2) {
            $('#workTime').val('0')
        }
        if ($('#standardName1').val() == '') {
            layer.msg('标准名称不能为空')
            return false
        } else if ($('.step').val() == '') {
            layer.msg('步骤不能为空')
            return false
        }

        var Param = {
            standId: $('#typeisName').val(),
            standName: $('#standardName1').val(),
            id: isEdit ? editID : null,
            typeId: $('#serviceName1').val(),
            areaId: $('#areaList1').val(),
            orgId: $('#orgList1').val(),
            descriptions: b,
            serverType: $('#serviceName2').val(),
            standardHours: $('#workTime').val(),
        }
        var url = isEdit ? 'management/update' : 'management/save'
        $.adapter_post(Param, url, function (data) {
            if (data.status == '1') {
                layer.msg(data.msg || '添加成功！')
                $('#businessStandardsModal').modal('hide')
                var query_param;
                if (!isEdit) {
                    query_param = '';
                    window.sessionStorage.removeItem('query_param');
                } else {
                    query_param = JSON.parse(window.sessionStorage.getItem('query_param'));
                    if (!query_param) query_param = false;
                }
                businessStandardsTable(query_param)
            } else {
                layer.msg(data.msg)
            }
        })
    })
}
//删除
function deleteItem(data) {
    $('#delete').modal('toggle')
    $('#delete .modal-body').html(data.name + '将被删除')
    this.deleteID = data.id
}

function deleteSure() {
    var id = this.deleteID
    layui.use(['layer'], function () {
        var layer = layui.layer
        $.adapter_post('', 'management/delete/' + id, function (d) {
            $('#delete').modal('toggle')
            if (d.status == '1') {
                layer.msg(d.msg)
                var query_param = JSON.parse(window.sessionStorage.getItem('query_param'))
                if (!query_param) query_param = false;
                businessStandardsTable(query_param)
            } else {
                layer.msg(d.msg)
            }
        })
    })
}
//导出
function businessStandardsExports() {
    $.fileDownLoadExport('management/export', true)
}
//阻止默认行为
$("form").on("submit", function (event) {
    event.preventDefault();
})
$("#addSteps").click(function () {
    $("#addStep").append('<input class="step steps" type="text" placeholder="">' +
        '<input type="checkbox" name="accord" class="accord accords">' +
        '<label class="lables labless">提供支持依据</label>')
})
$("#delStep").click(function () {
    $('.steps').eq(-1).remove()
    $('.accords').eq(-1).remove()
    $('.labless').eq(-1).remove()
})


//重置
function resetForm(){
    $('.contentHeader').find('input').val('');
    $('.contentHeader').find('select').val('').searchableSelect();
    dialogEdit1(['#orgList', '#areaList'])
}