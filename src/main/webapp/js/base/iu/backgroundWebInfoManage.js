$(function() {
	/**
	 * 渲染数据
	 */
	$.ajax({
		type : 'POST',
		url : 'viewAsync.htm?flag=20',
		dateType : 'json',
		success : function(data) {
			var dataObj = eval("("+data+")");
	        for(var i=0;i<dataObj.data.length;i++){
	        	//console.log(dataObj.data.length);
	        	if(dataObj.data[i].paramCode == "Logo"){
					$("#Logo").parent().parent().find(".fileinput-return").html("<img src='" + basePath + "fileserver/loadImage/" + dataObj.data[i].paramValue + "' style='max-width:200px; max-height: 60px !important;width: auto !important;height: auto !important;' />");
				    $("input[name=photo]").val(dataObj.data[i].paramValue);
				}else{
					$("#"+dataObj.data[i].paramCode+"").val(dataObj.data[i].paramValue);
				}
	        	$("#"+dataObj.data[i].paramCode+"Id").val(dataObj.data[i].id);
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
				"title" : {
					required : true,
					maxlength : 200
				},
				"keyword" : {
					required : true,
					maxlength : 200
				},
				"description" : {
					maxlength : 200
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
				top.layer.alert('后台网站信息保存成功！', {
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