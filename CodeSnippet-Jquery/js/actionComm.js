/**
 * 用于初始化区域项目，判断下拉是否唯一值，若为唯一，则默认选中
 * @method adapterDataToArry()
 * @param  select:
 * @return 
 */
function adapterDataToArry (select, data, option, editDataID, order) {
    for (var key in data) {
      var placeholder = select.children('option').eq(0).text();
      if (Array.isArray(data[key])) {
        var unEditDataIdNum = 0;
        select.html('').siblings('div').remove();
        if (data[key].length == 1 && !editDataID) {
          select.append('<option value="' + data[key][0][option[0]] + '" selected >' + data[key][0][option[1]] + '</option>')
        } else {
          for (var i = 0; i < data[key].length; i++) {
            var listData = data[key][i]
            var selectType = (editDataID == listData[option[0]] && (order == '0' || order == '1')) ? 'selected' : ''
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
          adapterDataToArry(select, data[key], option, editDataID, order)
          return
        }
      }
    }
}

// 加载layUI皮肤
layer.config({
  extend: 'myskin/layer-ext-skin.css' //加载弹框新皮肤
});