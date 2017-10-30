var msgSub;
var bt;
var selectList = "";
var allList;
var newLayero;
$(function() {
	bt = new baothink();
	msgSub = new msgSuppert();
	// 把默认的ID换成实际功能需要的ID
	msgSub.initSelect();
	bt.config.id = "id";
	bt.config.url.namespace = "/sx/msgMode/";
	bt.config.toolbar.search = "发送方式代码/名称";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.query = {// 配置高级查询
	};
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '700px', '560px' ], $("#add_data_div").html(), function(layero, index) {
				// 渲染页面
				msgSub.changeProConf("", layero, true, false);
				// 获取执行类下拉数据
				newLayero = layero;
				msgSub.loadSelect("SYS_MSG", layero);
				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						if (result.data != null && result.data.hasDefault == false) {
							top.layer.confirm("保存成功！相同消息类型的发送方式只允许一个为默认，是否设置默认？", {
								btn : [ '是', '否' ],
								icon : 1
							}, function() {
								// 设置默认方法
								msgSub.changeIsFlag(result.data.id);
							}, function() {
								// 设置不默认方法
								msgSub.changeOwnIsFlag(result.data.id);
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
				}, true);

			});
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '700px', '650px' ], $("#modify_data_div").html(), data, function(layero, index) {
				newLayero = layero;
				if (data.isFlag == "1") {
					$('#isFlag1', layero).iCheck('check');
				}

				// 渲染页面
				var viewProConf = data.viewProConf;
				msgSub.loadParamTable(data.msgType, data.proConf, layero, false, viewProConf);

				$("#executeClass", layero).val(data.executeClass);
				if ($("#proConf", layero)) {
					$("#proConf", layero).val(data.proConf);
				}
				// 根据消息类型代码显示名称
				$("#msgTypeName", layero).val(msgSub.getMsgTypeName(data.msgType));
				// 获取执行类下拉数据
				msgSub.loadSelect(data.msgType, layero, data.executeClass);
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						if (result.data != null && result.data.hasDefault == false) {
							top.layer.confirm("修改成功！相同消息类型的发送方式只允许一个为默认，是否设置默认？", {
								btn : [ '是', '否' ],
								icon : 1
							}, function() {
								// 设置默认方法
								msgSub.changeIsFlag(result.data.id);
							}, function() {
								// 设置不默认方法
								msgSub.changeOwnIsFlag(result.data.id);
							});
						} else {
							top.layer.alert('修改成功！', {
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
				}, null);
			});
		}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(ids) {
			top.layer.confirm("删除后相关的消息模板和参数将会同时删除，您确认要删除这" + ids.length + "条数据？", {
				icon : 3,
				title : "提示"
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + bt.config.url.deleteAsync,
					data : {
						"ids" : ids
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							if (data.data == false) {
								top.layer.alert("该消息发送方式已关联业务节点，请取消关联后重新删除！", {
									icon : 0,
									title : "提示"
								});
								return;
							} else {
								top.layer.alert("删除成功！", {
									icon : 1,
									title : "提示"
								}, function(index, layero) {
									// 刷新数据源
									bt.fn.reload(true);
									top.layer.close(index);
								});
							}
						} else {
							top.layer.alert(data.errorMsg, {
								icon : 2,
								title : "删除失败"
							});
						}
					},
					dataType : "json",
					traditional : true
				});
			});
		}
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '700px', '670px' ], $("#view_data_div").html(), data, function(layero, index) {
				if (data.msgType == "SYS_MSG") {
					$("#proConfDiv", layero).addClass("hide");
				}
				if (data.msgType == "SMS") {
					$("#executeClassDiv", layero).removeClass("hide");
				}
				// 渲染页面
				var viewProConf = data.viewProConf;
				msgSub.loadParamTable(data.msgType, data.proConf, layero, true, viewProConf);
				var flag = true;
				var backData;
				$.each(allList, function(index, value) {
					$.each(value, function(index1, value1) {
						if (data.executeClass == value1.id) {
							flag = false;
							backData = value1.text
							return false;
						}
					});
				});
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
						case "msgType":
							$input.text(msgSub.getMsgTypeName(value));
							break;
						case "isDefault":
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
				$("#executeClass", layero).html(backData);
			});
		}
	} ];
	bt.config.form = {
		data : {
			msgType : {
				list : [ {
					id : 'SYS_MSG',
					text : "站内消息"
				}, {
					id : 'SMS',
					text : "短信"
				}, {
					id : 'EMAIL',
					text : "邮件"
				}, {
					id : 'APP_MSG',
					text : "app消息"
				} ]
			}
		},
		event : {
			msgType : {
				// 消息类型点击事件
				select : function(tag, data, ev, a) {
					// console.info("选中,显示值：" + data.text + "\t选中值：" + data.id);
					msgSub.changeProConf(data.id, tag, false, false);
					// 获取执行类下拉数据
					msgSub.loadSelect(data.id, newLayero);
				}
			}
		}
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, {
		visible : false,
		data : 'msgTypeStr',
		render : function(data, type, row, meta) {
			return msgSub.initMsgTypeMap(data);
		}
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'smCode',
		title : '发送方式代码',
	}, {
		data : 'smName',
		title : '发送方式名称',
	}, {
		data : 'msgType',
		title : '消息类型',
	}, {
		data : 'executeClass',
		title : '执行类',
	}, {
		data : 'proConfName',
		title : '参数类型',
	}, {
		data : 'isDefault',
		title : '是否默认',
		className : "text-center"
	}, {
		data : 'isFlag',
		title : '是否有效',
		className : "text-center"
	}, {
		data : 'notes',
		title : '备注',
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			var html = '<a onclick="msgSub.toParameter(this)">' + data + '</a>';
			html += '<input type="hidden" value="' + row.proConf + '"/>';
			return html;
		},
		targets : [ 8 ]
	}, {
		render : function(data, type, row, meta) {
			var symbol = '';
			if (data == "0") {
				symbol = "否";
			} else if (data == "1") {
				symbol = "是";
			} else {
				symbol = data;
			}
			return '<a onclick="msgSub.changeDefault(this);">' + symbol + '</a>';
		},
		targets : [ 9 ]
	}, {
		render : function(data, type, row, meta) {
			var symbol = '';
			if (data == "0") {
				symbol = "否";
			} else if (data == "1") {
				symbol = "是";
			} else {
				symbol = data;
			}
			return '<a onclick="msgSub.changeFlag(this);">' + symbol + '</a>';
		},
		targets : [ 10 ]
	}, {
		render : function(data, type, row, meta) {
			var name = msgSub.getMsgTypeName(data);
			return name;
		},
		targets : [ 6 ]
	}, {
		render : function(data, type, row, meta) {
			var flag = true;
			var backData;
			$.each(allList, function(index, value) {
				$.each(value, function(index1, value1) {
					if (data == value1.id) {
						flag = false;
						backData = value1.text
						return false;
					}
				});
			});
			if (flag) {
				return data;
			} else {
				return backData;
			}
		},
		targets : [ 7 ]
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
	function fromSubmit(from, submifun, isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"smCode" : {
					required : true,
					maxlength : 50
				},
				"smName" : {
					required : true,
					maxlength : 200
				},
				"msgType" : {
					required : true
				},
				"executeClass" : {
					maxlength : 200
				},
				"proConf" : {
					maxlength : 1000
				},
				"notes" : {
					maxlength : 400
				}
			},
			messages : {
				"smCode" : {
					required : "发送方式代码不允许为空！",
					maxlength : "发送方式代码长度不能超过50个字符!"
				},
				"smName" : {
					required : "发送方式名称不允许为空!",
					maxlength : "发送方式名称不能超过200个字符"
				},
				"msgType" : {
					required : "消息类型不允许为空！"
				},
				"executeClass" : {
					maxlength : '执行类长度不能超过200个字符',
					required : "执行类不允许为空！"
				},
				"proConf" : {
					required : '属性文件不允许为空！',
					maxlength : '属性文件长度不能超过1000个字符',
				},
				"notes" : {
					maxlength : '备注长度不能超过400个字符',
				}
			}
		};
		if (isAdd == true) {
			v.rules["smCode"].remote = {
				url : basePath + "sx/msgMode/checkSmCode.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["smCode"].remote = "发送方式代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});

/**
 * 消息对象：提供常用的消息工具使用<br>
 * 
 * @author 陈培坤<br>
 *         2016年11月5日14:26:17<br>
 */
var msgSuppert = function() {
	var msg = {
		// 消息发送类型
		msgType : "",
		// 渲染属性文本框
		changeProConf : function(id, obj, boolean, isView) {
			if (id == "" || id == undefined || id == null) {
				id = "SYS_MSG";
			}
			var $div = null;
			if (boolean) {
				$div = $(obj);
			} else {
				$div = $(obj).parent().parent().parent().parent().parent();
			}
			// 设置属性文件和执行类隐藏或显示
			msg.setHideOrDisplay($div, id);
			msg.renderHtml(id, $div, isView);
		},
		// 初始化消息类型数据
		initMsgTypeMap : function(obj) {
			if (msg.msgType != "") {
				return "";
			}
			var msgT = {};
			obj = eval('(' + obj + ')');
			for ( var p in obj) {
				msgT[p] = obj[p];
			}
			msg.msgType = msgT;
			return "";
		},
		// 根据类型代码获取类型名称
		getMsgTypeName : function(data) {
			if (data == null || data == undefined || data == "" || msg.msgType == "") {
				return "";
			}
			var name = msg.msgType[data];
			if (name == null || name == undefined || name == "") {
				return "";
			}
			return name;
		},
		// 根据类型名称获取类型代码
		getMsgTypeData : function(name) {
			if (name == null || name == undefined || name == "" || msg.msgType == "") {
				return "";
			}
			for ( var data in msg.msgType) {
				if (msg.msgType[data] == name) {
					return data;
				}
			}
			return "";
		},
		changeIsFlag : function(id) {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgMode/changeIsFlag.htm',
				data : {
					"id" : id
				},
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					if (data.success) {
						top.layer.alert("设置成功！", {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
						});
					} else {
						top.layer.alert("设置失败！", {
							icon : 2,
							title : "提示"
						});
					}
				}
			});
		},
		changeOwnIsFlag : function(id) {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgMode/changeOwnIsFlag.htm',
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
		// 设置属性配置隐藏或显示
		setHideOrDisplay : function($div, id) {
			var proConfHtml = '<textarea id="proConf" name="proConf" class="form-control required" rows="5" style="resize:none;" readonly="readonly"></textarea>'; // 属性文件
			$("#proConfDiv", $div).find(".col-xs-10").html("");
			$("#proConfDiv", $div).addClass("hide");
			if (id == "WEIXIN_MSG") {
				$("#proConfDiv", $div).find(".col-xs-10").html(proConfHtml);
				$("#proConfDiv", $div).removeClass("hide");
				$("#executeClassDiv", $div).removeClass("hide");
			} else if (id == "SMS") {
				$("#proConfDiv", $div).find(".col-xs-10").html(proConfHtml);
				$("#proConfDiv", $div).removeClass("hide");
				$("#executeClassDiv", $div).removeClass("hide");
			} else if (id == "EMAIL") {
				$("#proConfDiv", $div).find(".col-xs-10").html(proConfHtml);
				$("#proConfDiv", $div).removeClass("hide");
				$("#executeClassDiv", $div).removeClass("hide");
			} else if (id == "APP_MSG") {
				$("#proConfDiv", $div).find(".col-xs-10").html(proConfHtml);
				$("#proConfDiv", $div).removeClass("hide");
				$("#executeClassDiv", $div).removeClass("hide");
			} else if (id == "SYS_MSG") {
				$("#executeClassDiv", $div).addClass("hide");
			}
		},
		// 动态显示属性配置的内容
		renderHtml : function(msgType, layeros, isView) {
			var editHtml = '';
			if (msgType == "SMS") {
				editHtml = $("#sms_div").html();
			} else if (msgType == "APP_MSG") {
				editHtml = $("#app_div").html();
			} else if (msgType == "WEIXIN_MSG") {
				editHtml = $("#weixin_div").html();
			} else if (msgType == "EMAIL") {
				editHtml = $("#email_div").html();
			}
			$("#proConfDiv", layeros).find(".col-xs-10").html(editHtml);
			if (isView) {
				$("#datatables", layeros).css("background", "#eee");
				$("table.sub tbody tr", layeros).css("background", "#eee");
				$("#datatables", layeros).find("input[type=text]").each(function() {
					$(this).attr("readonly", "readonly");
				});
			}
		},
		// 快速编辑参数
		toParameter : function(data) {
			var flag = $(data).next("input").val();
			// 定位到index.jsp上隐藏的a标签，并手动触发
			$("#simulateParameter", parent.document).parent().attr("href", "iu/parameter/manage.html?moudleCode=" + flag + "&oType=1");
			$("#simulateParameter", parent.document).click();
		},
		// 修改和查看表单显示属性配置的内容
		viewProConf : function(viewProConf, layero) {
			if (viewProConf != null && viewProConf != "") {
				var arr = viewProConf.split(",");
				if (arr != null && arr != "" && arr.length > 0) {
					$.each(arr, function(index, value) {
						if (value != null && value != "") {
							var vaArr = value.split("`");
							if (vaArr != null && vaArr != "" && vaArr.length > 0) {
								$("#" + vaArr[0], layero).val(vaArr[1]);
							}
						}
					});
				}
			}
		},
		// 加载消息类型下的执行类
		loadSelect : function(msgType, obj, defaultData) {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgMode/loadSelectData.htm',
				data : {
					"msgType" : msgType
				},
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					if (data.success) {
						selectList = "";
						selectList = data.data[msgType];
						$("#executeClassDiv", obj).find(".col-xs-10").html('<select id="executeClass" class="form-control" name="executeClass"></select>');
						// 执行类下拉框赋值
						$("#executeClass", obj).attr("data-type", "select").baothinkform({
							data : {
								"executeClass" : {
									list : selectList,
									value : defaultData
								}
							}
						});
					}
				}
			});
		},
		// 初始化全部的执行类
		initSelect : function() {
			$.ajax({
				type : 'POST',
				url : basePath + 'sx/msgMode/loadAllSelectData.htm',
				dataType : "json",
				traditional : true,
				success : function(data, textStatus, jqXHR) {
					if (data.success) {
						allList = data.data;
					}
				}
			});
		},
		loadParamTable : function(msgType, moudleCode, layero, isView, viewProConf) {
			if (msgType == "SYS_MSG") {
				$("#executeClassDiv", layero).addClass("hide");
			}
			if (moudleCode != '' && moudleCode != null) {
				$("#proConfDiv", layero).removeClass("hide");
				$.ajax({
					type : 'POST',
					url : basePath + "iu/parameter/loadListByPage.htm",
					dataType : 'json',
					data : {
						"paramType" : "10",
						"moudleCode" : moudleCode
					},
					traditional : true,
					success : function(data, textStatus, jqXHr) {
						if (data.data.length > 0) {
							var nameP = ''; // 参数代码和参数名称提交的Name值
							var valueP = ''; // 参数值提交的Name值
							var notesP = ''; // 参数描述提交的Name值
							if (msgType == "SMS") {
								nameP = 'smsName';
								valueP = 'smsParam';
								notesP = 'smsNotes';
							} else if (msgType == "EMAIL") {
								nameP = 'emailName';
								valueP = 'emailParam';
								notesP = 'emailNotes';
							} else if (msgType == "APP_MSG") {
								nameP = 'appMsgName';
								valueP = 'appMsgParam';
								notesP = 'appMsgNotes';
							}

							var html = '';
							html += '<div id="datatables" style="max-height: 200px; overflow: auto;border: 1px solid #e7e7e7;">';
							html += '<style type="text/css">';
							html += 'table.sub tbody tr:HOVER{background: white;}';
							html += 'table.sub tbody th{font-weight: normal;text-align: right !important;}';
							html += '</style>';
							html += '<table class="table table-bordered sub" style="table-layout: fixed;margin: -1px;">';
							html += '<tbody id="tableBody">';
							$.each(data.data, function(index, value) {
								html += '<tr>';
								html += '<th style="width: 130px;">' + value.paramName + '<input name="' + nameP + '" type="hidden" value="' + value.paramCode + '`' + value.paramName + '"></th>';
								html += '<td><input type="text" class="form-control" maxlength="100" name="' + valueP + '" id="' + value.paramCode + '"/></td>';
								if (value.notes == '' || value.notes == null) {
									html += '<td></td>';
								} else {
									html += '<td>(' + value.notes + ')<input name="' + notesP + '" type="hidden" value="' + value.notes + '"></td>';
								}
								html += '</tr>';
							});
							html += '</tbody>';
							html += '</table>';
							html += '</div>';
							$("#proConfDiv", layero).find(".col-xs-10").html(html);
							if (isView) {
								$("#datatables", layero).css("background", "#eee");
								$("table.sub tbody tr", layero).css("background", "#eee");
								$("#datatables", layero).find("input[type=text]").each(function() {
									$(this).attr("readonly", "readonly");
								});
							}
							msg.viewProConf(viewProConf, layero);
						}
					}
				});
			}
		},
		changeDefault : function(row) {
			var id = $(row).parent().parent().find("input[type=checkbox]").val();
			var flag = '';
			var url = '';
			if ($(row).html() == "是") {
				flag = '是否取消默认？';
				url = 'sx/msgMode/changeOwnIsFlag.htm';
			} else {
				flag = '相同消息类型的发送方式只允许一个为默认，是否设置默认？';
				url = 'sx/msgMode/changeDefault.htm';
			}
			top.layer.confirm(flag, {
				btn : [ '是', '否' ],
				icon : 3
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + url,
					dataType : "json",
					data : {
						"id" : id
					},
					traditional : true,
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							if (data.data == "1") {
								top.layer.alert("设置默认成功！", {
									icon : 1,
									title : "提示"
								}, function(index, layero) {
									// 刷新数据源
									bt.fn.reload(true);
									top.layer.close(index);
								});
							} else {
								top.layer.alert("取消默认成功！", {
									icon : 1,
									title : "提示"
								}, function(index, layero) {
									// 刷新数据源
									bt.fn.reload(true);
									top.layer.close(index);
								});
							}
						}
					}
				});
			});
		},
		changeFlag : function(row) {
			var id = $(row).parent().parent().find("input[type=checkbox]").val();
			var flag = '';
			if ($(row).html() == "是") {
				flag = '禁用';
			} else {
				flag = '启用';
			}

			top.layer.confirm("是否" + flag + "？", {
				btn : [ '是', '否' ],
				icon : 3
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + 'sx/msgMode/changeFlag.htm',
					dataType : "json",
					data : {
						"id" : id
					},
					traditional : true,
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							if (data.data == "1") {
								top.layer.alert("启用成功！", {
									icon : 1,
									title : "提示"
								}, function(index, layero) {
									// 刷新数据源
									bt.fn.reload(true);
									top.layer.close(index);
								});
							} else {
								top.layer.alert("禁用成功！", {
									icon : 1,
									title : "提示"
								}, function(index, layero) {
									// 刷新数据源
									bt.fn.reload(true);
									top.layer.close(index);
								});
							}
						}
					}
				});
			});
		}
	}
	return msg;
}
