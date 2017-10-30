$(function() {

	/**
	 * 渲染数据
	 */
	$.ajax({
		type : 'POST',
		url : 'viewAsync.htm',
		dateType : 'json',
		success : function(data) {
			var d = eval("(" + data + ")");
			$("#id").val(d.data.id);// 主键
			$("#ptId").val(d.data.ptId);
			$("#empCode").val(d.data.empCode);
			$("#empName").val(d.data.empName);
			$("#email").val(d.data.email);
			$("#phone").val(d.data.phone);
			$("#qq").val(d.data.qq);
			$("#address").val(d.data.address);
			
			if(d.data.photo != "" && d.data.photo != null){
				$("#photo").parent().parent().find(".fileinput-return").html("<img src='" + basePath + "fileserver/loadImage/" + d.data.photo + "' class='img-thumbnail' style='width: 120px;height: 100px;' />");
			    $("input[name=photo]").val(d.data.photo);
			}
			if(d.data.sex == "1"){
				$('#empSex1').iCheck('check');
			}else if(d.data.sex == "2"){
				$('#empSex2').iCheck('check');
			}else if(d.data.sex == "0"){
				$('#empSex3').iCheck('check');
			}
		}
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
				"phone" : {
					phone : true
				},
				"email" : {
					email : true
				},
				"qq" : {
					qq : true
				}
			}
		};
		return from.validate(v);
	}

	/**
	 * 点击保存，修改平台用户信息
	 */
	$("#btn_add_usb").click(function() {
		fromSubmit($("#add_data_form"), function(data) {
			var result = JSON.parse(data);
			if (result.success) {
				top.layer.alert('平台用户保存成功！', {
					icon : 1,
					title : "提示"
				}, function(index, layero){
					top.layer.close(index);
					$.ajax({
						type : "post",
						url : basePath + "loadToken.htm",
						dataType : "json",
						traditional : true,
						success : function (data, textStatus, jqXHR){
							$("#add_data_form").find("input[name=token]").val(data.data);
						}
					});
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
							$("#add_data_form").find("input[name=token]").val(data.data);
						}
					});
				});
			}
		});
		$("#add_data_form").submit();
	});
})