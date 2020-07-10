var map = null;
var markerClusterer;
var a;
$(document).ready(function () {
    var random = Math.round(Math.random() * 10000000);
    $.adapter_get('', 'userRole/getOrgList?_i=' + random, function (d) {
        var orgList = $('#orgList');
        var data = d.data.orgList;
        orgList.append('<option value>请选择公司...</option>')
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                orgList.append('<option value="' + data[i].bdId + '" selected>' + data[i].bdName + '</option>')
            } else {
                orgList.append('<option value="' + data[i].bdId + '" >' + data[i].bdName + '</option>')
            }
        }
       
        orgList.searchableSelect({
            afterSelectItem:function(){
                var orgId = this.holder.data('value');
                
                $.adapter_get('', 'userRole/getAreaListByOrgId/' + orgId, function (d) {
                    var areaList = $('#areaList').empty();
                    var data = d.data.areaList;
                    areaList.append('<option value>请选择区域...</option>')
                    for (var i = 0; i < data.length; i++) {
                        if (i == 0) {
                            areaList.append('<option value="' + data[i].bdId + '" selected>' + data[i].bdName + '</option>')
                        } else {
                            areaList.append('<option value="' + data[i].bdId + '" >' + data[i].bdName + '</option>')
                        }
                    }
                    a = areaList.searchableSelect({
                        afterSelectItem: function () {
                            this.element.data('text', this.holder.text());
                            // var statusParam = {
                            //     orgId:orgId,
                            //     areaId: this.holder.data("value"),
                            //     projectId: ""
                            // }
                            // getStatus(statusParam)
                            let areaId = this.holder.data("value")
                            let param = {}
                            $.adapter_get(param, 'userRole/getProListByAreaId/' + areaId, function (dd) {
                                var proList = $('#proList');
                                proList.find('option').remove();
                                proList.append('<option value="" selected>请选择项目...</option>')
                                if (dd.status == 1) {
                                    var data = dd.data;
                                    for (var i = 0; i < data.length; i++) {
                                        if (i == 0) {
                                            proList.append('<option value="' + data[i].bdId + '" selected>' + data[i].bdName + '</option>')
                                        } else {
                                            proList.append('<option value="' + data[i].bdId + '" >' + data[i].bdName + '</option>')
                                        }
                                    }
                                    if (proList.next().hasClass("searchable-select")) {
                                        proList.next().remove();
                                    }
                                }
                                proList.searchableSelect({
                                    afterSelectItem: function () {
                                        var statusParam = {
                                            orgId: orgId,
                                            areaId: areaId,
                                            projectId: this.holder.data("value")
                                        }
                                        getStatus(statusParam)
                                        creatPoint(statusParam)
                                    }
                                })
                            })
                        }
                    });
                })
            }
        })
        
    })

})
function getStatus(option) {
    var param = option;
    $.adapter_post(param, 'equipmentArchives/status', function (data) {
        if (data.status == 1) {
            $('#count').text(data.data.count);
        }
    })
    $.adapter_get(param, 'indexMsg/standardManageCount', function (data) {
        if (data.status == 1) {
            $('#important').text(data.data)
        }
    })
    $.adapter_get(param, 'indexMsg/taskManageCount', function (data) {
        if (data.status == 1) {
            $('#online').text(data.data)
        }
    })
    $.adapter_get(param, 'indexMsg/taskManageCompleteCount', function (data) {
        if (data.status == 1) {
            $('#status').text(data.data)
        }
    })
    $.adapter_get(param, 'indexMsg/contractInfoCount', function (data) {
        if (data.status == 1) {
            $('#scrap').text(data.data)
        }
    })

}
function creatPoint(p) {
    if (markerClusterer != null) {
        markerClusterer.clearMarkers()
    }
    $.adapter_get(p, 'equipmentArchives/lsList', function (d) {
        if (d.status == 1) {
            var data = d.data;
            // map.clearOverlays();
            var markers = [];
            for (var i = 0; i < data.length; i++) {
                var p = data[i].locationStr.split(',')
                var point = new BMap.Point(eval(p[0]), eval(p[1]));
                var marker = new BMap.Marker(point);// 创建标注
                markers.push(marker);              // 将标注添加到地图中
                if (i < 1) {
                    if (map == null) {
                        map = new BMap.Map("map", { enableMapClick: false, minZoom: 4, maxZoom: 20 });
                        map.centerAndZoom(point, 15);
                        map.enableScrollWheelZoom(true);

                    }
                    if (data.length > 1) {
                        map.setZoom(10);
                    } else {
                        map.setZoom(18);
                    }
                    map.panTo(point);
                }
            }
            markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers });
        }
    })
}

