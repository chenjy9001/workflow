$(function() {

	// 浏览器分辨率判断
	if ((screen.width < 1200) || (screen.height < 900)) {
		// alert("您显示的分辨率不高，页面可能无法正常显示，建议更改分辨率为1280*1024");
	}
	var key;
	function bodyRSA() {
		setMaxDigits(130);
		key = new RSAKeyPair("10001", "", "e871d2ec7a9f807ed40e17306be71a0782c8e1b56197f6f1af6ab1461172791e2e324a67ac3fc8802e4a15058878500985c3e1d5bf720485a7141a5c7b4c9e9f5dbc37098b7b75d2790ff581ee3e4668c54ed02c5b2c63312d4eb9a1284e20da098f1c60830bfbb24a6e2ee6a7fa9423bd414c4e4186e87ee1ce00173ea836af");
	}
	// 验证密码不能为空格和#号
	function checkPassword(p) {
		var arr = p.split(' ');
		if (arr.length != 1) {
			return true;
		}
		arr = p.split('#');
		if (arr.length != 1) {
			return true;
		}
		return false;
	}
	var subFlag = true;
	// 登录
	$("#loginbtn").click(function() {
		if (!subFlag)
			return;
		subFlag = false;
		var ptid = $("#txtPtId").val();
		var username = $("#txtUserName").val();
		var userpwd = $("#txtPassword").val();
		var checkcode = $("#checkcode").val();
		// 进行空值判断
		if (!check()) {
			subFlag = true;
			return false;
		} else if (checkPassword(userpwd)) {
			subFlag = true;
			layer.msg("用户名与密码输入有误,请重新输入！", {
				icon : 2,
				time : 1000
			});
			return false;
		}

		bodyRSA();
		var userinfo = encryptedString(key, encodeURIComponent(ptid + "#" + username + "#" + userpwd + "#" + checkcode));
		// 进行登录
		$.ajax({
			type : "post",
			dataType : "json",
			url : basePath + "login/loginAsync.htm",
			data : {
				"loginStr" : userinfo,
				"checkcode" : checkcode
			},
			success : function(content) {
				layer.closeAll();
				if (content.success == true) {
					window.location.href = basePath + "index.html";
				} else {
					console.info(content.errorCode);
					if (content.errorCode == "300001") {
						$("#checkcode").focus();
					} else {
						$("#txtPtId").focus();
					}
					$("#cheekcord").val("");
					$("#radom").click();
					layer.msg(content.errorMsg, {
						icon : 2,
						time : 1000
					});
				}
				subFlag = true;// 返回信息后把按钮标识设为true
			},
			error : function(a, b) {
				layer.closeAll();
				subFlag = true;
				layer.msg("登录失败，服务器无响应！", {
					icon : 2,
					time : 2000
				});
				$("#txtPtId").focus();
			}
		});
	});
	// 重置按钮
	$("#restbtn").click(function() {
		$("#txtUserName,#txtPassword,,#checkcode").val("");
		$("#txtUserName").focus();
		return false;
	});
	// 敲回车
	$("#txtUserName,#txtPassword,#checkcode").keypress(function(e) {
		if (e.keyCode == 13) {
			$("#loginbtn").click();
		}
	});
	// 验证码
	$("#radom").click(function() {
		var imgsrc = $(this).attr("src");
		if (imgsrc.indexOf("?") > 0) {
			imgsrc = imgsrc.substring(0, imgsrc.indexOf("?"));
		}
		$(this).attr("src", imgsrc + "?s=" + Math.random());
	});
});

$(document).keyup(function(event) {
	if (event.keyCode == 13) {
		$("#to-recover").trigger("click");
	}
});

function genTimestamp() {
	var time = new Date();
	return time.getTime();
}
// 客户端校验
function check() {
	if ($("#txtPtId").val() == "") {
		layer.tips('平台账号不能为空！', '#txtPtId');
		$("#txtPtId").focus();
		return false;
	} else {
		$("#txtUserName").val(jQuery.trim($('#txtUserName').val()));
	}
	if ($("#txtUserName").val() == "") {
		layer.tips('用户名不能为空！', '#txtUserName');
		$("#txtUserName").focus();
		return false;
	} else {
		$("#txtUserName").val(jQuery.trim($('#txtUserName').val()));
	}
	if ($("#txtPassword").val() == "") {
		layer.tips('密码不能为空！', '#txtPassword');
		$("#txtPassword").focus();
		return false;
	}
	if ($("#checkcode").val() == "") {
		layer.tips('验证码不能为空！', '#radom');
		$("#checkcode").focus();
		return false;
	}
	layer.load(3);
	return true;
}

function savePaw() {
	if (!$("#saveid").attr("checked")) {
		$.cookie('loginname', '', {
			expires : -1
		});
		$.cookie('password', '', {
			expires : -1
		});
		$("#loginname").val('');
		$("#password").val('');
	}
}

function saveCookie() {
	if ($("#saveid").attr("checked")) {
		$.cookie('loginname', $("#loginname").val(), {
			expires : 7
		});
		$.cookie('password', $("#password").val(), {
			expires : 7
		});
	}
}
function quxiao() {
	$("#loginname").val('');
	$("#password").val('');
}

jQuery(function() {
	var loginname = $.cookie('loginname');
	var password = $.cookie('password');
	if (typeof (loginname) != "undefined" && typeof (password) != "undefined") {
		$("#loginname").val(loginname);
		$("#password").val(password);
		$("#saveid").attr("checked", true);
		$("#code").focus();
	}
});