var key;
/**
 * 加密
 */
function bodyRSA() {
	setMaxDigits(130);
	key = new RSAKeyPair("10001", "", "e871d2ec7a9f807ed40e17306be71a0782c8e1b56197f6f1af6ab1461172791e2e324a67ac3fc8802e4a15058878500985c3e1d5bf720485a7141a5c7b4c9e9f5dbc37098b7b75d2790ff581ee3e4668c54ed02c5b2c63312d4eb9a1284e20da098f1c60830bfbb24a6e2ee6a7fa9423bd414c4e4186e87ee1ce00173ea836af");
}

/**
 * 点击保存按钮进行保存
 */
$("#btn_save_usb").click(function() {
	fromSubmit($("#modifyPassword"), function(data) {
		var result = JSON.parse(data);
		if (result.success) {
			top.layer.alert(result.data, {
				icon : 1,
				title : "提示"
			}, function(){
				window.location.href = ctxpath+"/login.html";
			});
		} else {
			top.layer.alert(result.errorMsg, {
				icon : 2,
				title : "提示"
			}, function(index){
				top.layer.close(index);
				$.ajax({
					type : "post",
					url : basePath + "loadToken.htm",
					dataType : "json",
					traditional : true,
					success : function (data, textStatus, jqXHR){
						$("#modifyPassword").find("input[name=token]").val(data.data);
					}
				
				});
			});
		}
	});
	var oldPwd = $("#oldPwd").val();
	var newPwd = $("#newPwd").val();
	bodyRSA();
	var modifyStr = encryptedString(key, encodeURIComponent(oldPwd + "#" + newPwd + "#" + newPwd));
	$("input[name=modifyStr]").val(modifyStr);
	$("#modifyPassword").submit();
});

/**
 * 表单提交，并且增加验证器
 * 
 * @param from
 *            待提交的form表单（Jquery对象）
 * @param submifun
 *            提交成功事件
 * @param addWords
 */
function fromSubmit(from, submifun, isAdd) {
	var v = {
		submitHandler : function(form) {
			$(form).ajaxSubmit(submifun);
			return false;
		},
		rules : {
			"oldPwd" : {
				minlength : 6,
				required : true
			},
			"newPwd" : {
				minlength : 6,
				required : true
			},
			"comfPwd" : {
				equalTo : "#newPwd"
			},
		}
	};
	return from.validate(v);
}