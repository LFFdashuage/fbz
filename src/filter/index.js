import Vue from 'vue'
// 数字转货币格式
Vue.filter('numToCash', function(value) {
    // 返回处理后的值
    value = parseFloat(value);
    if (value == null || value == undefined || value == "") {
        return 0;
    } else if (value == 0) {
        return value;
    } else {
        let end = "",
            start = "";
        value = value.toFixed(2);

        if (value < 0) {
            start = "-";
            value += "";
            value = value.substring(1);
        }
        value += "";
        if (!/^-?\d+$/.test(value)) {
            end = value.split(".")[1];
            value = value.split(".")[0];
        }
        value = value.split("").reverse();
        let arr = [];
        value.map(function(elem, index) {
            arr.push(elem);
            if (index % 3 == 2 && index != value.length - 1) {
                arr.push(",");
            }
        });

        let respond = arr.reverse().join("");
        if (end != "" && end > 0) {
            return start + respond + "." + end;
        } else {
            return start + respond;
        }
    }
});

// 证件号码中间隐藏
Vue.filter('centerToStar', function(value, numBefore, numAfter) {
    if (value > numBefore + numAfter) {
        let len = value.length,
            endNum = len - numBefore - numAfter,
            star = '',
            re = new RegExp("\^(\\w\{" + numBefore + "\}\)\\w\{" + endNum + "\}\(.*\)\$");

        for (let i = 0; i < endNum; i++) star += '*';

        return value.replace(re, '$1' + star + '$2');
    } else {
        return value
    }
});

// 数字超过最大数字变为最大数加+，例：99+
Vue.filter('numMaxToChange', function(value = 0, max = 99) {
    console.log(value, max);
    if (value > max) {
        return max + '+';
    } else {
        return value
    }
});

function numCompletion(value = '0', length = 2) {
    value += "";
    if (value.length < length) {
        return numCompletion('0' + value, length);
    }
    return value || '00'
}

// 数字转换为时间格式
Vue.filter('numToTime', function(value, type = 's') {
    let data = Math.ceil(value),
        sec = 0,
        min = 0,
        hour = 0,
        transData = 0;

    if (type == 's') {
        sec = data % 60;
        transData = parseInt(data / 60);

        if (transData > 0) {
            min = transData % 60;
            hour = parseInt(transData / 60);
        }

        data = "";
        if (hour > 0) {
            data = numCompletion(hour, 2) + ':';
        }
        data += numCompletion(min, 2) + ':' + numCompletion(sec, 2);
        return data;
    } else if (type == 'ms') {

    }
});

// 保留小数
Vue.filter('retainedDecimal', function(value) {
    value = Number(value);
    return value.toFixed(2);
});

const myFilter = Vue.filter(['numToCash', 'centerToStar', 'numMaxToChange', 'retainedDecimal'])

export default myFilter