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
			$("#ptId").val(d.data.ptId);// 主键
			$("#ptName").val(d.data.ptName);
			$("#recSrc").val(d.data.recSrc);
			$("#entName").val(d.data.entName);
			$("#entShortName").val(d.data.entShortName);
			$("#registerDate").val(d.data.registerDate);
			$("#taxNo").val(d.data.taxNo);
			$("#groupCode").val(d.data.groupCode);

			$("#registerAddress").val(d.data.registerAddress);
			$("#workTel").val(d.data.workTel);
			$("#workFax").val(d.data.workFax);
			$("#lxrName").val(d.data.lxrName);
			$("#vocationCode").val(d.data.vocationCode);
			$("#vocationName").val(d.data.vocationName);
			$("#lxrPhone").val(d.data.lxrPhone);
			$("#bankName").val(d.data.bankName);
			$("#bankAddress").val(d.data.bankAddress);
			$("#bankAccountNo").val(d.data.bankAccountNo);
			
			$('#vocationCode').trigger('change');
			
			// 如果为三证
			if (d.data.certificateType == "10" || d.data.certificateType == "") {
				$("#radioOne").attr("checked", "checked");
				$("#radioOne").parent().addClass("checked");
				$(".toOne").hide();
				$("#licenceNo").val(d.data.licenceNo);

				if (d.data.taxNoId != null && d.data.taxNoId != "") {
					$("input[name=taxNoId]").val(d.data.taxNoId);
					$("#taxNoId").parent().parent().find(".fileinput-return").html("<img class='img-thumbnail' src=" + basePath + "fileserver/loadImage/" + d.data.taxNoId + " style='width:100%' />");
				}
				if (d.data.groupCodeId != null && d.data.groupCodeId != "") {
					$("input[name=groupCodeId]").val(d.data.groupCodeId);
					$("#groupCodeId").parent().parent().find(".fileinput-return").html("<img class='img-thumbnail' src=" + basePath + "fileserver/loadImage/" + d.data.groupCodeId + " style='width:100%' />");
				}
				if (d.data.licenceNoId != null && d.data.licenceNoId != "") {
					$("input[name=licenceNoId]").val(d.data.licenceNoId);
					$("#licenceNoId").parent().parent().find(".fileinput-return").html("<img class='img-thumbnail' src=" + basePath + "fileserver/loadImage/" + d.data.licenceNoId + " style='width:100%' />");
					$("#licenceNoId1").parent().parent().find(".fileinput-return").html("");
				}
			} else if (d.data.certificateType == "20") { // 如果为三证合一
				$("#radioTwo").attr("checked", "checked");
				$("#radioTwo").parent().addClass("checked");
				$("#taxNo").val("");
				$("#groupCode").val("");
				$(".toThree").hide();

				$("#licenceNo1").val(d.data.licenceNo);

				if (d.data.licenceNoId != null && d.data.licenceNoId != "") {
					$("input[name=licenceNoId]").val(d.data.licenceNoId);
					$("#licenceNoId1").parent().parent().find(".fileinput-return").html("<img class='img-thumbnail' src=" + basePath + "fileserver/loadImage/" + d.data.licenceNoId + " style='width:100%' />");
					$("#licenceNoId").parent().parent().find(".fileinput-return").html("");
				}
			}
		}
	});


	/**
	 * 点击单选框时切换div
	 */
	$('input[name=certificateType]').on('ifChecked', function(event) {
		var id = $(event.currentTarget).attr("id");
		if (id == "radioOne") {
			$(".toOne").hide();
			$(".toThree").show();
		} else if (id == "radioTwo") {
			$(".toThree").hide();
			$(".toOne").show();
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
				"ptId" : {
					required : true
				},
				"entName" : {
					required : true
				},
				"entShortName" : {
					required : true
				},
				"workTel" : {
					tel : true
				},
				"workFax" : {
					faxs : true
				},
				"lxrPhone" : {
					phone : true
				},
				"taxNo" : {
					taxNo : true
				},
				"groupCode" : {
					groupCode : true
				},
				"licenceNo" : {
					licenceNo : true
				},
				"bankAccountNo" : {
					bankAccountNo : true
				}
			},
			messages : {
				"entName" : {
					required : "企业名称不允许为空"
				},
				"entShortName" : {
					required : "企业简称不允许为空"
				}
			}
		};
		return from.validate(v);
	};

	/**
	 * 点击保存，修改平台企业信息
	 */
	$("#btn_add_usb").click(function() {

		var oneChecked = $("#radioOne").attr("checked");
		var twoChecked = $("#radioTwo").attr("checked");

		if($("#vocationCode").val() == "10"){
			$("#vocationName").val("钢铁行业");
		}else if($("#vocationCode").val() == "20"){
			$("#vocationName").val("电商行业");
		}
		
		// 验证
		if (oneChecked == "checked") {// 如果选择三证
			$("#licenceNo1").parent().html("");
			$("#licenceNoId1").parent().parent().find(".fileinput-return").html("");
			if($("#licenceNoId").parent().parent().find(".fileinput-return").html()==""){
				$("input[name=licenceNoId]").val("");
			}
			fromSubmit($("#add_data_form"), function(data) {
				var result = JSON.parse(data);
				if (result.success) {
					top.layer.alert('平台企业保存成功！', {
						icon : 1,
						title : "提示"
					}, function(index, layero) {
						$("#appLicence1").html("<input id='licenceNo1' name='licenceNo' type='text'  class='form-control input-sm'>");
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
		} else if (twoChecked == "checked") { //如果选择三证合一
			if($("#licenceNoId1").parent().parent().find(".fileinput-return").html()==""){
				$("input[name=licenceNoId]").val("");
			}
			$("#taxNoId").val("");
			$("#groupCodeId").val("");
			$("#licenceNo").parent().html("");
			fromSubmit($("#add_data_form"), function(data) {
				var result = JSON.parse(data);
				if (result.success) {
					top.layer.alert('平台企业保存成功！', {
						icon : 1,
						title : "提示"
					}, function(index, layero) {
						$("#appLicence").html("<input id='licenceNo' name='licenceNo' type='text'  class='form-control input-sm'>");
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
		}
	});
})