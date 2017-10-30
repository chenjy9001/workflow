// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 判断字符串是否是日期时间
 */
String.prototype.isDateTime = function() {
	var reg1 = /^(\d{4})(-|\/)([1][0-2]|[1-9]|[0][1-9])\2([1-2][0-9]|[1-9]|[0][1-9]|[3][0-1])$/;
	var reg2 = /^(\d{4})(-|\/)([1][0-2]|[1-9]|[0][1-9])\2([1-2][0-9]|[1-9]|[0][1-9]|[3][0-1]) ([0-1][0-9]|[2][0-3]|[0-9]):([0-5][0-9]|[0-9])$/;
	var reg3 = /^(\d{4})(-|\/)([1][0-2]|[1-9]|[0][1-9])\2([1-2][0-9]|[1-9]|[0][1-9]|[3][0-1]) ([0-1][0-9]|[2][0-3]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])$/;
	var reg4 = /^(\d{4})([1][0-2]|[1-9]|[0][1-9])([1-2][0-9]|[1-9]|[0][1-9]|[3][0-1])([0-1][0-9]|[2][0-3]|[0-9])([0-5][0-9]|[0-9])([0-5][0-9]|[0-9])$/;
	var reg5 = /^(\d{4})([1][0-2]|[1-9]|[0][1-9])([1-2][0-9]|[1-9]|[0][1-9]|[3][0-1])([0-1][0-9]|[2][0-3]|[0-9])([0-5][0-9]|[0-9])$/;
	var reg6 = /^(\d{4})([1][0-2]|[1-9]|[0][1-9])([1-2][0-9]|[1-9]|[0][1-9]|[3][0-1])$/;
	if (reg1.test(this)) {
		return true;
	} else if (reg2.test(this)) {
		return true;
	} else if (reg3.test(this)) {
		return true;
	} else if (reg4.test(this)) {
		return true;
	} else if (reg5.test(this)) {
		return true;
	} else if (reg6.test(this)) {
		return true;
	}
	return false;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423 (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function equals(objA, objB) {
	if (typeof arguments[0] != typeof arguments[1])
		return false;

	// 数组
	if (arguments[0] instanceof Array) {
		if (arguments[0].length != arguments[1].length)
			return false;

		var allElementsEqual = true;
		for (var i = 0; i < arguments[0].length; ++i) {
			if (typeof arguments[0][i] != typeof arguments[1][i])
				return false;

			if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number')
				allElementsEqual = (arguments[0][i] == arguments[1][i]);
			else
				allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]); // 递归判断对象是否相等
		}
		return allElementsEqual;
	}

	// 对象
	if (arguments[0] instanceof Object && arguments[1] instanceof Object) {
		var result = true;
		var attributeLengthA = 0, attributeLengthB = 0;
		for ( var o in arguments[0]) {
			// 判断两个对象的同名属性是否相同（数字或字符串）
			if (typeof arguments[0][o] == 'number' || typeof arguments[0][o] == 'string')
				result = eval("arguments[0]['" + o + "'] == arguments[1]['" + o + "']");
			else {
				// 如果对象的属性也是对象，则递归判断两个对象的同名属性
				// if (!arguments.callee(arguments[0][o], arguments[1][o]))
				if (!arguments.callee(eval("arguments[0]['" + o + "']"), eval("arguments[1]['" + o + "']"))) {
					result = false;
					return result;
				}
			}
			++attributeLengthA;
		}

		for ( var o in arguments[1]) {
			++attributeLengthB;
		}

		// 如果两个对象的属性数目不等，则两个对象也不等
		if (attributeLengthA != attributeLengthB)
			result = false;
		return result;
	}
	return arguments[0] == arguments[1];
}