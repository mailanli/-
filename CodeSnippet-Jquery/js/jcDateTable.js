(function ($) {
    $.fn.bgyDate = function (options) {
        var _that = this;
        var that = {};
        that.default = {
            isShow: false,
            format: 'yyyy-MM-dd',
            minDate: '2014-01-01',
            maxDate: '',
            marks: [],
            targetFun: null,
            language: {                                  //多语言设置
                name: "cn",
                month: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                weeks: ["日", "一", "二", "三", "四", "五", "六"],
                times: ["小时", "分钟", "秒数"],
                titText: "请选择日期时间",
                clear: "清空",
                today: "今天",
                yes: "确定",
                close: "关闭"
            },
            initDate: new Date(),
            isTime: true,
            isClear: true,
        };
        var settings =  $.extend({}, that.default, options)
        that = {
            settings:settings,
            data:{},
            targetData:{},
            elem:_that,
            getDate: function (date, fmt) {
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
                    "H+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                var week = {
                    "0": "/u65e5",
                    "1": "/u4e00",
                    "2": "/u4e8c",
                    "3": "/u4e09",
                    "4": "/u56db",
                    "5": "/u4e94",
                    "6": "/u516d"
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return fmt;
            },
            init: function () {
                _that.html('')
                that.updateDate()
                that.createTableHead();
                var table = document.createElement('table');
                var thead = document.createElement('thead');
                var tbody = document.createElement('tbody');
                var tr = document.createElement('tr');
                for (var i = 0; i < that.settings.language.weeks.length; i++){
                    var td = document.createElement('td');
                    var div = document.createElement('div');
                    var span = document.createElement('span');
                    span.textContent = that.settings.language.weeks[i];
                    $(div).append(span);
                    $(td).append(div);
                    $(tr).append(td);
                }
                // $(table).addClass('jcDate');
                $(thead).append(tr);
                $(table).append(thead).append(tbody);
                var div = document.createElement('div');
                $(_that).addClass('jcDate').append(div);
                $(_that).append(table);
                that.createDayListView();
            },
            getDayList: function (year, month) {
                var nextMonth = month + 1;
                var nextMonthFirstDay = new Date(year, (nextMonth - 1), 1);
                var oneDay = 1000 * 60 * 60 * 24;
                var newDate = new Date(nextMonthFirstDay - oneDay);
                var prevMonthLathDay = new Date(year, (month - 1), 1);
                var startLength = prevMonthLathDay.getDay();
                var dayList = [];
                var startList = [];
                var contentList = [];
                var endList = [];
                for (var i = 0; i < startLength; i++) {
                    var day = new Date(prevMonthLathDay.getTime() - (oneDay * (startLength - i)));
                    startList.push(day)
                }
                var result = dayList.concat(startList);
                for (var n = 0; n < newDate.getDate(); n++) {
                    var day = new Date(prevMonthLathDay.getTime() + (oneDay * n));
                    contentList.push(day)
                }
                result = result.concat(contentList)
                for (var j = 0; j < (42 - result.length); j++) {
                    var day = new Date(nextMonthFirstDay.getTime() + (oneDay * j));
                    endList.push(day)
                }
                result = result.concat(endList);
                return result;
            },
            getTargetData : function(){
                return that.targetData;
            },
            setTargetData : function(key,value){
                that.targetData[key] = value;
            },
            createDayListView : function(){
                if ($('.jcDate').find('tbody').length > 0){
                    $('.jcDate').find('tbody').html('')
                }
                that.updateDate()
                var dayList = that.getDayList(that.data.year, that.data.month);
                var tr1 = document.createElement('tr');
                for (var i = 0; i < dayList.length; i++) {
                    var td = document.createElement('td');
                    var div = document.createElement('div');
                    var span = document.createElement('span');
                    span.textContent = dayList[i].getDate();
                    var initDate = new Date(that.settings.initDate);
                    if (that.getDate(dayList[i],'yyyy-MM-dd') == that.getDate(initDate,'yyyy-MM-dd')){
                        $(div).addClass('jcDate_choose');
                    }
                    if (dayList[i].getMonth() == new Date(that.settings.initDate).getMonth()){
                        $(div).addClass('normalDay')
                    } else{
                        $(div).addClass('notNowMonthDay')
                    }
                    $(div).append(span);
                    if (that.settings.marks.indexOf(that.getDate(dayList[i],'yyyy-MM-dd')) != -1){
                        $(div).addClass('marksTip')
                    }
                    $(td).data('dateValue',that.getDate(dayList[i],'yyyy-MM-dd'))
                    that.setTargetData('date',that.getDate(dayList[i],'yyyy-MM-dd'))
                    $(td).append(div);
                    $(tr1).append(td)
                    if (Math.floor((i+1)/7) == (i+1)/7){
                        $('.jcDate').find('tbody').append(tr1);
                        tr1 = document.createElement('tr');
                    }
                }
                $('.notNowMonthDay').on('click',function(e){
                    $('.jcDate_choose').removeClass('jcDate_choose');
                    var el;
                    if (e.target.tagName == 'DIV'){
                        $(e.target).addClass('jcDate_choose')
                        el = $(e.target);
                    } else if (e.target.tagName == 'TD') {
                        $(e.target).find('div').addClass('jcDate_choose');
                        el = $(e.target).find('div')
                    }else{
                        $($(e.target).parents('div')[0]).addClass('jcDate_choose');
                        el =  $($(e.target).parents('div')[0])
                    }
                    if (that.settings.targetFun){
                        that.settings.targetFun(el,that);
                    }else{
                        var td = el.parents('td');
                        var date =  td.data('dateValue');
                        that.setTargetData('date',date);
                        that.setTargetData('year',date.split('-')[0]);
                        that.setTargetData('month',date.split('-')[1]);
                        that.setTargetData('day',date.split('-')[2]);
                        that.settings.initDate = date;
                        that.createDayListView();
                        that.createTableHead();
                    }
                })
                $('.normalDay').on('click',function(e){
                    $('.jcDate_choose').removeClass('jcDate_choose');
                    var el;
                    if (e.target.tagName == 'DIV'){
                        $(e.target).addClass('jcDate_choose')
                        el = $(e.target);
                    } else if (e.target.tagName == 'TD') {
                        $(e.target).find('div').addClass('jcDate_choose');
                        el = $(e.target).find('div')
                    }else{
                        $($(e.target).parents('div')[0]).addClass('jcDate_choose');
                        el =  $($(e.target).parents('div')[0])
                    }
                    var td = $(e.target).parents('td');
                    var date =  td.data('dateValue');
                    that.setTargetData('date',date);
                    that.setTargetData('year',date.split('-')[0]);
                    that.setTargetData('month',date.split('-')[1]);
                    that.setTargetData('day',date.split('-')[2]);
                    if (that.settings.targetFun){
                        that.settings.targetFun(el,that);
                    }
                })
            },
            createTableHead : function(){
                if ($('.tableHead').length > 0){
                    $('.headYear').text(that.data.year+'年')
                    $('.headMonth').text(that.data.month+'月');
                } else{
                    var div = $(document.createElement('div')).addClass('tableHead');
                    var year = $(document.createElement('span')).addClass('headYear');
                    var month = $(document.createElement('span')).addClass('headMonth');
                    var left = $(document.createElement('span')).addClass('headLeft');
                    var right = $(document.createElement('span')).addClass('headRight');
                    year.text(that.data.year+'年');
                    month.text(that.data.month+'月');
                    left.text('〈');
                    right.text('〉');
                    div.append([month,year,right,left]);
                    that.elem.append(div)
                    $('.headYear').on('click',function(){
                        that.createYearList();
                    })
                    $('.headLeft').on('click',function(e){
                        if (that.data.month == 1){
                            $('.headYear').text((that.data.year-1)+'年')
                            $('.headMonth').text('12月');
                            that.settings.initDate = (that.data.year-1)+'-'+12+'-'+that.data.day
                        } else{
                            $('.headMonth').text((that.data.month-1)+'月');
                            that.settings.initDate = that.data.year+'-'+(that.data.month-1)+'-'+that.data.day
                        }
                        that.createDayListView()
                    })
                    $('.headRight').on('click',function(e){
                        if (that.data.month == 12){
                            $('.headYear').text((that.data.year+1)+'年')
                            $('.headMonth').text('1月');
                            that.settings.initDate = (that.data.year+1)+'-'+1+'-'+that.data.day
                        } else{
                            $('.headMonth').text((that.data.month+1)+'月');
                            that.settings.initDate = that.data.year+'-'+(that.data.month+1)+'-'+that.data.day
                        }
                        that.createDayListView()
                    })
                }
            },
            updateDate : function () {
                var nowData = new Date(that.settings.initDate);
                that.data['year'] = nowData.getFullYear();
                that.setTargetData('year',nowData.getFullYear())
                that.data['month'] =  nowData.getMonth() + 1 ;
                that.setTargetData('month',nowData.getMonth() + 1)
                that.data['day'] = nowData.getDate();
                that.setTargetData('day',nowData.getDate())
            },
            createYearList : function(){
                $('.jcDate').find('table').html('');
                var tbody = document.createElement('tbody');
                var tr1 = document.createElement('tr');
                var l = 0;
                for (var i = -24; i < 24; i++) {
                    l++
                    var td = document.createElement('td');
                    var div = document.createElement('div');
                    var span = document.createElement('span');
                    span.textContent = that.data.year + i;
                    if (i==0){
                        $(div).addClass('jcDate_choose')
                    }
                    $(div).addClass('normalDay')
                    $(div).append(span);
                    $(td).append(div);
                    $(tr1).append(td)
                    if (l==7){
                        l=0
                        $(tbody).append(tr1);
                        tr1 = document.createElement('tr');
                    }
                }
                $('.jcDate').find('table').append(tbody);
                $('.normalDay').on('click',function(e){
                    $('.jcDate_choose').removeClass('jcDate_choose');
                    var year;
                    if (e.target.tagName == 'DIV'){
                        year = $(e.target).find('span').text()
                        $(e.target).addClass('jcDate_choose')
                    } else if (e.target.tagName == 'TD') {
                        year = $(e.target).find('span').text()
                        $(e.target).find('div').addClass('jcDate_choose');
                    }else{
                        year = $(e.target).text();
                        $($(e.target).parents('div')[0]).addClass('jcDate_choose');
                    }
                    that.setTargetData('year',year);
                    that.setTargetData('date',that.getTargetData().year+'-'+that.getTargetData().month+'-'+that.getTargetData().day);
                    that.settings.initDate = new Date( that.getTargetData().date)
                    that.init()
                })
            }
        }
        that.init();
    }
})(jQuery)
