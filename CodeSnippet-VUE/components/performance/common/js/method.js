    // Rona 于2018/10/15对后台数据进行处理,把前端写死的指标变成动态，主要修改quotaOptionsFirst,quotaOptions

    // 数据从小到大排列
    export const sortByUp = function (a, b) {
      let _a = a.value.toString()
      let _b = b.value.toString()
      let len = _a.length > _b.length ? _a.length : _b.length
      for (let i = 0; i < len; i++) {
        let c = _a[i] != undefined ? _a[i] : 0
        let d = _b[i] != undefined ? _b[i] : 0
        if (c < d) {
          return c - d
        } else if (c > d) {
          return c - d
        }
      }
    }
    // 对于value超过4位进行重组(先删除后插入)
    // export const instertChildren = function (arr) {
    //   let arg = JSON.parse(JSON.stringify(arr)) //深度拷贝，对于value值超过4位的指标进行插入children
    //   for (let i = 0; i < arr.length; i++) {
    //     if (arr[i].value.toString().length > 4) {
    //       for (let j = 0; j < arg.length; j++) { //在arg找到对应的value
    //         if (arr[i].value == arg[j].value) {
    //           let val = arg.splice(j, 1)[0] //删除超过四位的value值,并且暂存,
    //           let value = val.value.toString()
    //           let label = val.label
    //           for (let z = 0; z < arg.length; z++) { //对重建的数组进行插入children
    //             if (value.substring(0, 4) == arg[z].value) {
    //               arg[z]['children'] = arg[z]['children'] ? arg[z]['children'] : []
    //               arg[z]['children'].push({
    //                 value: value,
    //                 label: label
    //               })
    //             }
    //           }
    //           break; //结束本次循环
    //         }
    //       }
    //     }
    //   }
    //   return arg
    // }

    export const instertChildren = function (arr) {
      let arg = JSON.parse(JSON.stringify(arr)) //深度拷贝，对于value值超过4位的指标进行插入children
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value.toString().length > 4) { //对于二级菜单的处理
          for (let j = 0; j < arg.length; j++) { //在arg找到对应的value
            if (arr[i].value == arg[j].value) {
              let val = arg.splice(j, 1)[0] //删除超过四位的value值,并且暂存,
              let value = val.value.toString()
              let label = val.label

                if (arr[i].value.toString().length <= 7) {
                  for (let z = 0; z < arg.length; z++) { //对重建的数组进行插入children
                  if (value.substring(0, 4) == arg[z].value) {
                    arg[z]['children'] = arg[z]['children'] ? arg[z]['children'] : []
                    arg[z]['children'].push({
                      value: value,
                      label: label
                    })
                    break;
                  }
                }
                } else if (arr[i].value.toString().length > 7) {
                  for (let d = 0; d < arg.length; d++) {
                    if (arg[d].children) {
                      for (let e = 0; e < arg[d].children.length; e++) {
                        if (value.substring(0, 7) == arg[d].children[e].value) {
                          arg[d].children[e]['children'] = arg[d].children[e]['children'] ? arg[d].children[e]['children'] : []
                          arg[d].children[e]['children'].push({
                            value: value,
                            label: label
                          })
                          break;
                        }
                      }
                    }
                  }
                }
                break;
              }
            }
          }
        }
      return arg
    }

    export const getDynamicIndex = function (listData, city) {
      var listData = JSON.parse(JSON.stringify(listData))
      var obj = {
        quotaOptionsFirst: [],
        quotaOptions: []
      }
      for (let i = 0; i < listData.length; i++) {
        if (city == '季度') {
          obj.quotaOptionsFirst.push({
            value: listData[i].elementInfo.elementId,
            label: listData[i].elementInfo.name
          })
        } else {
          obj.quotaOptionsFirst.push({
            value: listData[i].elementId,
            label: listData[i].elementName
          })
        }
      }
      obj.quotaOptionsFirst = obj.quotaOptionsFirst.sort(sortByUp)
      obj.quotaOptions = instertChildren(obj.quotaOptionsFirst)
      return obj
    }
    //浮点数的小数乘法
    export const accMul = function (arg1, arg2) {
      if (isNaN(arg1)) {
        arg1 = 0;
      }
      if (isNaN(arg2)) {
        arg2 = 0;
      }
      arg1 = Number(arg1);
      arg2 = Number(arg2);

      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }

