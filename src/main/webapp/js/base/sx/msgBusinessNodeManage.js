var bt;
$(function() {
	bt = new baothink();
	var obj = new isFlagObj();
	// 把默认的ID换成实际功能需要的ID
	bt.config.id = "id";
	bt.config.url.namespace = "/sx/msgBusinessNode/";
	bt.config.toolbar.search = "业务节点代码/名称";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.query = {// 配置高级查询
	};
	var receiveData = '';
	$.ajax({
		type : 'POST',
		url : basePath + 'sx/msgBusinessNode/getSmName.htm',
		dataType : "json",
		traditional : true,
		async : true,
		success : function(data, textStatus, jqXHR) {
			if (data.data != null && data.data != '' && data.data.length > 0) {
				receiveData = data.data;
			}
		}
	});
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {

			if (receiveData == '') {
				top.layer.alert("请至少添加一条消息发送方式再进行操作！", {
					icon : 0,
					title : "提示"
				});
				return;
			}

			bt.fn.showAdd('新增数据 ', [ '780px', '500px' ], $("#add_data_div").html(), function(layero, index) {

				// 遍历查询出来的消息发送方式并添加checkbox到页面
				$.each(receiveData, function(index, value) {
					// 获取消息类型作为th
					var headTitle = obj.getTitle(value);
					// 获取消息发送方式
					obj.getHtml(index, value, layero, headTitle);
				});
				
				$("form", layero).baothinkform($("#add_default_form")); // 渲染form表单
				// 控制相同消息类型只能选择一种消息发送方式
				obj.setSingleClick(layero);

				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						if (result.data != null && result.data.hasFlag == false) {
							top.layer.confirm("保存成功！已存在启用的相同业务节点，是否启用当前业务节点？", {
								btn : [ '是', '否' ],
								icon : 1
							}, function() {
								// 启用方法
								obj.changeIsFlag(result.data.id);
							}, function() {
								// 禁用方法
								obj.changeOwnFlag(result.data.id);
							});
						} else {
							top.layer.alert('保存成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						}
					} else {
						top.layer.alert(result.errorMsg);
					}
				});
			});
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '780px', '560px' ], $("#modify_data_div").html(), data, function(layero, index) {

				// 查询所有的消息发送方式并勾选已保存的
				obj.getSmNameByBusinessNodesId(data.id, layero);

				$("#notes", layero).val(data.notes);

				if (data.isFlag == "1") {
					layero.find("input[name=isFlag]").attr("checked", "checked");
				}
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg);
					}
				}, true);
			});
		}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			var layeroData = null;
			bt.fn.showView('查看数据 ', [ '750px' ], $("#view_data_div").html(), data, function(layero, index) {

				$.ajax({
					type : 'POST',
					url : basePath + 'sx/msgBusinessNode/getSmNameByBusinessNodesId.htm?businessNodesId=' + data.id + '',
					dataType : "json",
					traditional : true,
					async : true,
					success : function(data, textStatus, jqXHR) {
						if (data.data != null && data.data != '' && data.data.length > 0) {
							var result = data.data;
							var defaultData = '';
							$.each(result, function(index, value) {
								if (value.isHasFlag == '1') {
									defaultData = defaultData + value.smName + '，';
									$("#smName", layero).val(defaultData);
								}
							});
							var substr = $("#smName", layero).val();
							substr = substr.substring(0, substr.lastIndexOf("，"));
							$("#smName", layero).val(substr);
							$("form", layero).baothinkform($("#add_default_form")); // 渲染form表单
						}
					}
				});

				layeroData = layero;
				layero.find("#proConf").val(data.proConf);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "isFlag":
							switch (value) {
							case "0":
								$input.text("否");
								break;
							case "1":
								$input.text("是");
								break;
							}
							break;
						default:
							$input.text(value);
						}

					}
				});
			});
		}
	} ];
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'snCode',
		title : '业务节点代码',
		className : "text-center"
	}, {
		data : 'snName',
		title : '业务节点名称',
		className : "text-center"
	}, {
		data : 'isFlag',
		title : '是否有效',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "否";
			} else if (data == "1") {
				return "是";
			} else {
				return data;
			}
		}
	}, {
		data : 'notes',
		title : '备注',
		className : "text-center"
	}, {
		data : 'createEName',
		title : '创建人',
		className : "text-center"
	}, {
		data : 'createDate',
		title : '创建时间',
		className : "text-center"
	} ];

	// 初始化所有元素
	bt.fn.init(function() {
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
	function fromSubmit(from, submifun) {
		return from.validate({
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"snCode" : {
					required : true,
					maxlength : 20,
					code : true
				},
				"snName" : {
					required : true,
					maxlength : 40
				},
				"notes" : {
					maxlength : 400
				},
				"smName" : {
					required : true
				}
			},
			messages : {
				"snCode" : {
					required : "业务节点代码不允许为空",
					maxlength : "业务节点代码不能超过20个字符",
					code : "只能录入字母和数字，请重新录入"
				},
				"snName" : {
					required : "业务节点名称不允许为空",
					maxlength : "业务节点名称不能超过40个字符"
				},
				"notes" : {
					maxlength : "备注不能超过400个字符"
				},
				"smName" : {
					required : "消息发送方式不允许为空"
				}
			}
		});
	}
});

/**
 * 设置启用禁用对象方法
 */
var isFlagObj = function() {
	var obj = {
		changeIsFlag : function(id) {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgBusinessNode/changeIsFlag.htm',
				data : {
					"id" : id
				},
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					if (data.success) {
						top.layer.alert("启用成功！", {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
						});
					} else {
						top.layer.alert("启用失败！", {
							icon : 2,
							title : "提示"
						});
					}
				}
			});
		},
		changeOwnFlag : function(id) {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgBusinessNode/changeOwnIsFlag.htm',
				data : {
					"id" : id
				},
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					bt.fn.reload(true);
					top.layer.close();
				}
			});
		},
		getSmNameByBusinessNodesId : function(id, layero) {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgBusinessNode/getSmNameByBusinessNodesId.htm?businessNodesId=' + id + '',
				dataType : "json",
				traditional : true,
				async : true,
				success : function(data, textStatus, jqXHR) {
					if (data.data != null && data.data != '' && data.data.length > 0) {
						var result = data.data;
						$.each(result, function(index, value) {
							// 获取消息类型作为th
							var headTitle = obj.getTitle(value);
							// 获取消息发送方式
							obj.getHtml(index, value, layero, headTitle);
						});
						$("form", layero).baothinkform($("#add_default_form")); // 渲染form表单
						// 控制相同消息类型只能选择一种消息发送方式
						obj.setSingleClick(layero);
					}
				}
			});
		},
		setSingleClick : function(layero) {
			$("input[data-type=SYS_MSG]", layero).on("ifChecked", function(event) {
				$.each($("input[data-type=SYS_MSG]", layero), function(index, value) {
					if (value.id != event.currentTarget.id) {
						$("#"+value.id+"", layero).iCheck('uncheck');
					}
				});
			});
			$("input[data-type=EMAIL]", layero).on("ifChecked", function(event) {
				$.each($("input[data-type=EMAIL]", layero), function(index, value) {
					if (value.id != event.currentTarget.id) {
						$("#"+value.id+"", layero).iCheck('uncheck');
					}
				});
			});
			$("input[data-type=APP_MSG]", layero).on("ifChecked", function(event) {
				$.each($("input[data-type=APP_MSG]", layero), function(index, value) {
					if (value.id != event.currentTarget.id) {
						$("#"+value.id+"", layero).iCheck('uncheck');
					}
				});
			});
			$("input[data-type=SMS]", layero).on("ifChecked", function(event) {
				$.each($("input[data-type=SMS]", layero), function(index, value) {
					if (value.id != event.currentTarget.id) {
						$("#"+value.id+"", layero).iCheck('uncheck');
					}
				});
			});
			$("input[data-type=WEIXIN_MSG]", layero).on("ifChecked", function(event) {
				$.each($("input[data-type=WEIXIN_MSG]", layero), function(index, value) {
					if (value.id != event.currentTarget.id) {
						$("#"+value.id+"", layero).iCheck('uncheck');
					}
				});
			});
		},
		getTitle : function(value) {
			var headTitle = '';
			if (value.msgType == "SYS_MSG") {
				headTitle = '站内消息';
			} else if (value.msgType == "EMAIL") {
				headTitle = '邮件';
			} else if (value.msgType == "APP_MSG") {
				headTitle = 'APP消息';
			} else if (value.msgType == "SMS") {
				headTitle = '短信';
			} else if (value.msgType == "WEIXIN_MSG") {
				headTitle = '微信';
			}
			return headTitle;
		},
		getHtml : function(index, value, layero, headTitle) {
			var html = '';
			if (value.isHasFlag == '1') {
				if ($("#" + value.msgType + "", layero).length > 0) {
					html = '<td style="white-space: pre;"><input type="checkbox" data-type="'+value.msgType+'" checked="checked" id="smName' + index + '" class="form-control" name="smName" value="' + value.id + "&" + value.smName + '"/><label for="smName' + index + '">' + value.smName + ' </label></td>';
					$("#" + value.msgType + "", layero).append(html);
				} else {
					html = '<tr id="' + value.msgType + '"><td style="white-space: pre;"><div style="padding-top:6px;margin-right:10px">' + headTitle + '：</div></td><td style="white-space: pre;"><input type="checkbox" data-type="'+value.msgType+'" checked="checked" id="smName' + index + '" class="form-control" name="smName" value="' + value.id + "&" + value.smName + '"/><label for="smName' + index + '">' + value.smName + ' </label></td></tr>';
					$("#smCode", layero).append(html);
				}
			} else {
				if ($("#" + value.msgType + "", layero).length > 0) {
					html = '<td style="white-space: pre;"><input type="checkbox" data-type="'+value.msgType+'" id="smName' + index + '" class="form-control" name="smName" value="' + value.id + "&" + value.smName + '"/><label for="smName' + index + '">' + value.smName + ' </label></td>';
					$("#" + value.msgType + "", layero).append(html);
				} else {
					html = '<tr id="' + value.msgType + '"><td style="white-space: pre;"><div style="padding-top:6px;margin-right:10px">' + headTitle + '：</div></td><td style="white-space: pre;"><input type="checkbox" data-type="'+value.msgType+'" id="smName' + index + '" class="form-control" name="smName" value="' + value.id + "&" + value.smName + '"/><label for="smName' + index + '">' + value.smName + ' </label></td></tr>';
					$("#smCode", layero).append(html);
				}
			}
			return html;
		}
	}
	return obj;
}
