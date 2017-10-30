/* 
 默认校验规则
 (1)required:true               必输字段
 (2)remote:"check.php"          使用ajax方法调用check.php验证输入值
 (3)email:true                  必须输入正确格式的电子邮件
 (4)url:true                    必须输入正确格式的网址
 (5)date:true                   必须输入正确格式的日期
 (6)dateISO:true                必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
 (7)number:true                 必须输入合法的数字(负数，小数)
 (8)digits:true                 必须输入正整数
 (9)creditcard:                 必须输入合法的信用卡号
 (10)equalTo:"#field"           输入值必须和#field相同
 (11)accept:                    输入拥有合法后缀名的字符串（上传文件的后缀）
 (12)maxlength:5                输入长度最多是5的字符串(汉字算一个字符)
 (13)minlength:10               输入长度最小是10的字符串(汉字算一个字符)
 (14)rangelength:[5,10]         输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
 (15)range:[5,10]               输入值必须介于 5 和 10 之间
 (16)max:5                      输入值不能大于5
 (17)min:10                     输入值不能小于10

 */

var validatorPasswordVal = null;
var validatorQuantityVal = 0;
var validatorDateVal = 0;

/* 添加验证方法 */
$(function() {
	$.extend($.validator.messages, {
		required : "这是必填字段",
		remote : "请修正此字段",
		email : "请输入有效的电子邮件地址",
		url : "请输入有效的网址",
		date : "请输入有效的日期",
		dateISO : "请输入有效的日期 (YYYY-MM-DD)",
		number : "请输入有效的数字",
		digits : "只能输入整数",// modify by xiehf 修改挂牌单价提示
		creditcard : "请输入有效的信用卡号码",
		equalTo : "你的输入不相同",
		extension : "请输入有效的后缀",
		maxlength : $.validator.format("最多可以输入 {0} 个字符"),
		minlength : $.validator.format("最少要输入 {0} 个字符"),
		rangelength : $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
		range : $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
		max : $.validator.format("请输入不大于 {0} 的数值"),
		min : $.validator.format("请输入不小于 {0} 的数值")
	});

	$(".required").each(function() {
		var title = $(this).parent();
		if (!title.children()) {
			title.append("<span style='color:red' class='star'>*</span>");
		}
	});
	// 字符验证
	jQuery.validator.addMethod("string", function(value, element) {
		return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
	}, "只能包括中文字、英文字母、数字和下划线");
	// 字符验证
	jQuery.validator.addMethod("code", function(value, element) {
		return this.optional(element) || /^[\w]+$/.test(value);
	}, "只能包括中文字、英文字母、数字和下划线");

	// 不能输入中文字符的验证
	jQuery.validator.addMethod("chinese", function(value, element) {
		return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
	}, "只能包含中文字符或特殊字符");

	// 中文字两个字节
	jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {
		var length = value.length;
		for (var i = 0; i < value.length; i++) {
			if (value.charCodeAt(i) > 127) {
				length++;
			}
		}
		return this.optional(element) || (length >= param[0] && length <= param[1]);
	}, "请确保输入的值在3-15个字节之间(一个中文字算2个字节)");

	// 身份证号码验证
	jQuery.validator.addMethod("card", function(value, element) {
		// 身份证正则表达式(18位)
		isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|X)$/;

		// return this.optional(element) || isIdCardNo(value);
		return this.optional(element) || (isIDCard2.test(value));
	}, "请输入正确的身份证号码");

	// 特种作业证书号码验证
	jQuery.validator.addMethod("trace", function(value, element) {

		// 特种作业证正则表达式(12位)
		isIDCard1 = /^TS6[A-Z]{4}[A-Z0-9]{1}\d{4}$/;

		// return this.optional(element) || isIdCardNo(value);
		return this.optional(element) || (length == 12 && isIDCard1.test(value));
	}, "请输入正确的特种设备作业人员证书编号");

	// 手机号码验证
	jQuery.validator.addMethod("mobile", function(value, element) {
		var length = value.length;
		var mobile = /^([1][3,4,5,8,7])\d{9}$/;
		// var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		return this.optional(element) || (length == 11 && mobile.test(value));
	}, "请正确填写手机号码");

	// 电话号码验证
	jQuery.validator.addMethod("tel", function(value, element) {
		var tel = /^\d{3,4}-?\d{7,8}$/; // 电话号码格式010-12345678
		var tel1 = /^\d{4}-?\d{7,8}$/;
		var tel2 = /^[1-9]\d{6,7}$/;
		return this.optional(element) || (tel.test(value)) || (tel1.test(value) || (tel2.test(value)));
	}, "请正确填写电话号码");

	// 联系电话(手机/电话皆可)验证
	jQuery.validator.addMethod("phone", function(value, element) {
		var length = value.length;
		var mobile = /^[\d]{11}$/;
		var tel = /^\d{3,4}-\d{7,8}$/;
		var tel1 = /^[1-9]\d{6,7}$/;
		var tel3 = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
		return this.optional(element) || (tel.test(value) || mobile.test(value) || tel1.test(value) || tel3.test(value));

	}, "请正确填写电话号码");
	// 联系传真验证
	jQuery.validator.addMethod("faxs", function(value, element) {
		var fax1 = /^\d{3}-?\d{8}$/;
		var fax2 = /^\d{4}-?\d{7,8}$/;
		var fax3 = /^[1-9]\d{6,7}$/;
		return this.optional(element) || (fax1.test(value)) || (fax2.test(value) || (fax3.test(value)));

	}, "请正确填写传真号码");

	// 邮政编码验证
	jQuery.validator.addMethod("zip", function(value, element) {
		var tel = /^[0-9]{6}$/;
		return this.optional(element) || (tel.test(value));
	}, "请正确填写邮政编码");

	// IP地址
	jQuery.validator.addMethod("ip", function(value, element) {
		var ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return this.optional(element) || (ip.test(value));
	}, "请正确填写IP地址");

	// QQ号
	jQuery.validator.addMethod("qq", function(value, element) {
		var qq = /^[1-9]\d{4,9}$/;
		return this.optional(element) || (qq.test(value));
	}, "请正确填写QQ号码");

	// Email
	jQuery.validator.addMethod("vemail", function(value, element) {
		var qq = /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/;
		return this.optional(element) || (qq.test(value));
	}, "请输入正确格式的电子邮件");

	// Email
	jQuery.validator.addMethod("email", function(value, element) {
		var qq = /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/;
		return this.optional(element) || (qq.test(value));
	}, "请输入正确格式的电子邮件");

	// 验证密码最大长度和最小长度
	jQuery.validator.addMethod("passwordlength", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length >= 6 && length < 16);
	}, "请输入字母或数字，密码长度6~16个字符");

	// textarea长度验证
	jQuery.validator.addMethod("rangelength64", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length < 64);
	}, "请输入长度小于64的字符串");

	// textarea长度验证
	jQuery.validator.addMethod("rangelength128", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length < 128);
	}, "请输入长度小于64的字符串");

	// textarea长度验证
	jQuery.validator.addMethod("rangelength256", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length < 256);
	}, "请输入长度小于256的字符串");

	// textarea长度验证
	jQuery.validator.addMethod("rangelength512", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length < 512);
	}, "请输入长度小于512的字符串");

	// textarea长度验证
	jQuery.validator.addMethod("rangelength1000", function(value, element) {
		var length = value.length;
		return this.optional(element) || (length < 1000);
	}, "请输入长度小于1000的字符串");

	// 密码格式验证
	jQuery.validator.addMethod("password", function(value, element) {
		var length = value.length;
		validatorPasswordVal = value
		return this.optional(element) || (length >= 6);
	}, "请输入大于6位的密码");

	// 密码确认验证
	jQuery.validator.addMethod("pwAffirm", function(value, element) {
		return this.optional(element) || (value == validatorPasswordVal);
	}, "两次输入的密码不一致");

	// 数量(价格)格式验证
	jQuery.validator.addMethod("quantity", function(value, element) {
		var quantity = /^\d{0,7}\.?\d+$/;
		validatorQuantityVal = value == null ? 0 : value;
		return this.optional(element) || (quantity.test(value));
	}, "请输入正确的数字");

	// 数量(价格)比较验证
	jQuery.validator.addMethod("compare", function(value, element) {
		var quantity = /^\d{0,7}\.?\d+$/;
		return this.optional(element) || (parseFloat(value) <= parseFloat(validatorQuantityVal)) && (quantity.test(value));
	}, "输入的数字超出范围");

	// 日期比较验证
	jQuery.validator.addMethod("endDate", function(value, element) {
		var bVal = $("#" + element.getAttribute("beginDate")).val();
		if (bVal == null || bVal == "") {
			var date = new Date();
			var m = date.getMonth() + 1;
			if (m < 10) {
				m = "0" + m;
			}
			bVal = date.getFullYear() + "-" + m + "-" + date.getDate();
		}
		var date1 = new Date(bVal);
		var date2 = new Date(value);
		return this.optional(element) || (parseInt(date2.getTime()) - parseInt(date1.getTime()) >= 0);
	}, "输入的日期超出限制");
	// 验证上传的是否是图片 add by tanrq 20150119
	jQuery.validator.addMethod("checkPic", function(value, element) {
		// 获得上传文件名
		var fileArr = value.split("\\");
		var fileTArr = fileArr[fileArr.length - 1].toLowerCase().split(".");
		var filetype = fileTArr[fileTArr.length - 1];
		// 切割出后缀文件名
		if (filetype != "jpg" && filetype != "JPG" && filetype != "png" && filetype != "PNG" && filetype != "gif" && filetype != "GIF") {
			return false;
		} else {
			return true;
		}
	}, "上传图片格式不适合");
	// 验证组织机构代码 add by tanrq 20150119
	jQuery.validator.addMethod("orgCode", function(value, element) {
		var qq = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$/;
		return this.optional(element) || (qq.test(value));
	}, "上传图片格式不适合");
	// 税务登记号
	jQuery.validator.addMethod("taxNo", function(value, element) {
		var qq = /^([a-z]|[A-Z]|[0-9]){15}$/;
		return this.optional(element) || (qq.test(value));
	}, "税务登记号格式不正确");
	// 组织机构代码
	jQuery.validator.addMethod("groupCode", function(value, element) {
		var qq = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$/;
		return this.optional(element) || (qq.test(value));
	}, "组织机构代码格式不正确");
	// 营业执照号码
	jQuery.validator.addMethod("licenceNo", function(value, element) {
		var qq = /^[0-9a-zA-Z]{15}$/;
		return this.optional(element) || (qq.test(value));
	}, "营业执照号码格式不正确");
	// 银行卡账号
	jQuery.validator.addMethod("bankAccountNo", function(value, element) {
		var qq = /^\d{16}|\d{19}$/;
		return this.optional(element) || (qq.test(value));
	}, "银行卡账号格式不正确");
});