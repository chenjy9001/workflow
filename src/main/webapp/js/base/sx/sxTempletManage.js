var preview;
var bt;
var record;
$(function() {
	bt = new baothink();
	preview = new modelPreview();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/sx/templet/";// url命名空间
	bt.config.visible.splitter = true; // 显示分隔条， 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		businessNodesId : "id"
	}
	bt.config.toolbar.search = "模板代码/模板名称";// 右上角搜索框的提示语句

	bt.config.toolbar.query = {// 配置高级查询
		sx002Id : function() {
			return $("#search_sx002Id").val();
		},
		businessNodesId : function() {
			return $("#search_businessNodesId").val();
		}
	};
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {

			var node = bt.fn.getSelectTreeNodes();
			if (!node || !node[0] || node[0].parent == "#") {
				top.layer.alert("请选择业务节点再进行添加", {
					icon : 0,
					title : "提示"
				});
				return;
			}

			preview.businessNodesId = node[0].id;
			preview.loadSelectData(); // 根据业务节点获取消息发送方式下拉数据

			bt.fn.showAdd('新增模板 ', [ '700px', '550px' ], $("#add_data_div").html(), function(layero, index) {

				var node = bt.fn.getSelectTreeNodes();
				if (node[0].parents > 2) {
					$("#businessNodesId", layero).val(node[0].parent);
				} else {
					$("#businessNodesId", layero).val(node[0].id);
				}

				var dataUrl = $("#sx002Id", layero).attr("data-url");
				dataUrl = dataUrl + "?businessNodesId=jie1";
				$("#sx002Id", layero).attr("data-url", dataUrl);

				// 动态获取节点下的字段，并显示在页面上
				preview.isView = false;
				preview.init($("#businessNodesId", layero).val(), layero);
				// 字段集合
				var codeArr = preview.codeArr;

				// 点击字段动态添加到模板内容
				$(".paramClick", layero).on('click', function(event) {
					preview.clickObj = $(this);
					preview.clickParam(layero, "paramClick");
				});

				// 点击字段动态添加到标题模板
				$(".titleClick", layero).on('click', function(event) {
					preview.clickObj = $(this);
					preview.clickParam(layero, "titleClick");
				});

				// 点击预览模板弹出框
				$("#preview", layero).on("click", function(event) {
					preview.title = "预览模板";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#contentTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#contentTemplate", layero).val());
				});

				// 点击预览标题弹出框
				$("#previewTitle", layero).on("click", function(event) {
					preview.title = "预览标题";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#titleTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#titleTemplate", layero).val());
				});
				// 若下拉选择消息发送方式为短信，则隐藏标题模板
				preview.selectSx002Id(layero);

				// 如果消息发送方式为短信，则不显示标题模板
				if ($("#sx002Id option:selected", layero).html() == "短信") {
					$("#titleTemplate", layero).parent().parent().addClass("hide");
					$("#titleTemplate", layero).removeAttr("name");
					$("#sx002SmName", layero).val("短信");
				}else{
					$("#sx002SmName", layero).val($("#sx002Id option:selected", layero).html());
				}

				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新树的数据
							$("#btn_refresh_tree").trigger('click');
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
							bt.fn.treeClickQuery(node);
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 3,
							title : "提示"
						});
					}
				}, true, $("#businessNodesId", layero).val());
			});
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {

			bt.fn.showModify('修改模板 ', [ '700px', '610px' ], $("#modify_data_div").html(), data, function(layero, index) {

				$("#businessNodesId", layero).val(data.businessNodesId);
				$("#contentTemplate", layero).val(data.contentTemplate);

				// 动态获取节点下的字段，并显示在页面上
				preview.isView = false;
				preview.init($("#businessNodesId", layero).val(), layero);
				// 字段集合
				var codeArr = preview.codeArr;

				// 点击字段动态添加到模板内容
				$(".paramClick", layero).on('click', function(event) {
					preview.clickObj = $(this);
					preview.clickParam(layero, "paramClick");
				});

				// 点击字段动态添加到标题模板
				$(".titleClick", layero).on('click', function(event) {
					preview.clickObj = $(this);
					preview.clickParam(layero, "titleClick");
				});

				// 点击预览模板弹出框
				$("#preview", layero).on("click", function(event) {
					preview.title = "预览模板";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#contentTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#contentTemplate", layero).val());
				});

				// 点击预览标题弹出框
				$("#previewTitle", layero).on("click", function(event) {
					preview.title = "预览标题";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#titleTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#titleTemplate", layero).val());
				});

				// 如果消息发送方式为短信，则不显示标题模板
				if (data.sx002SmName == "短信") {
					$("#titleTemplate", layero).parent().parent().remove();
				}

				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新树的数据
							$("#btn_refresh_tree").trigger('click');
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
							bt.fn.treeClickQuery(bt.fn.getSelectTreeNodes());
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
					}
				}, false, data.businessNodesId);
			});
		}
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(ids) {
			top.layer.confirm("您确认要删除这" + ids.length + "条数据？", {
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
							top.layer.alert("删除成功！", {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新树的数据
								$("#btn_refresh_tree").trigger('click');
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
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
			bt.fn.showView('查看模板信息 ', [ '700px', '560px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				$("#contentTemplate", layero).val(data.contentTemplate);

				// 动态获取节点下的字段
				preview.isView = true;
				preview.init(data.businessNodesId, layero);
				// 字段集合
				var codeArr = preview.codeArr;

				// 点击预览模板弹出框
				$("#preview", layero).on("click", function(event) {
					preview.title = "预览模板";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#contentTemplate").val();
					preview.clickPreview(layero, data.businessNodesId, $("#contentTemplate", layero).val());
				});

				// 点击预览标题弹出框
				$("#previewTitle", layero).on("click", function(event) {
					preview.title = "预览标题";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#titleTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#titleTemplate", layero).val());
				});

				// 如果消息发送方式为短信，则不显示标题模板
				if (data.sx002SmName == "短信") {
					$("#titleTemplate", layero).parent().parent().addClass("hide");
				}

				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "isFlag":
							switch (value) {
							case "0":
								$input.text("禁用");
								break;
							case "1":
								$input.text("启用");
								break;
							}
							break;
						case "sx002Id":
							switch (value) {
							case "SYS_MSG":
								$input.text("站内消息");
								break;
							case "SMS":
								$input.text("短信");
								break;
							case "EMAIL":
								$input.text("邮件");
								break;
							case "APP_MSG":
								$input.text("APP消息");
								break;
							case "WEIXIN_MSG":
								$input.text("微信");
								break;
							}
							break;
						default:
							$input.val(value);
						}
					}
				});
			});
		}
	} ];
	bt.config.datatables.pageLength = 50; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'templateCode',
		title : '模板代码',
	}, {
		data : 'templateName',
		title : '模板名称'
	}, {
		data : 'sx002SmName',
		title : '消息发送方式'
	}, {
		data : 'isFlag',
		title : '是否启用',
		className : "text-center"
	}, {
		data : 'notes',
		title : '备注'
	}, {
		title : '操作',
		className : "text-center",
		render : function(data, type, row, meta) {
			var html = '';
			var name = "";
			if (record == "0" && row.sx002SmName != "") {
				name = "启用";
				html += '  <a class="btn btn-primary btn-xs" data-type="true" onClick="preview.setValid(this);" >';
			}
			html += name;
			html += '</a>';
			return html;
		}
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			record = data;
			if (data == "0") {
				return "禁用";
			} else if (data == "1") {
				return "启用";
			}
		},
		targets : [ 6 ]
	} ];

	// 初始化所有元素
	bt.fn.init(function(table) {
	});

	// 重写点击树查询事件
	bt.fn.treeClickQuery = function(node) {
		var treeQuery = bt.config.tree.query;
		if (node && treeQuery) {
			var value = {};
			$.each(treeQuery, function(param, val) {
				value[param] = node[val];
			});
			$.extend(value, {
				isHasChildNode : (node.children.length > 0)
			});
			bt.fn.search(true, value);
			$("#search_businessNodesId").val(value.businessNodesId);
		}
	};

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 * @param addWords
	 */
	function fromSubmit(from, submifun, isAdd, businessNodesId) {
		var v = {
			submitHandler : function(form) {
				if (isAdd == true) {
					if ($(form[6]).is(':checked') == true) {
						var flag = preview.isHasValid(businessNodesId, $(form[4]).val()); //返回是否有启用的模板，true：有 false：无
						if (flag == true) {
							top.layer.confirm('已存在启用的模板，是否启用【'+$(form[2]).val()+'】模板？', {
								title : "提示",
								icon : 3,
								btn : [ '是', '否' ]
							}, function(index) {
								top.layer.close(index);
								$(form).ajaxSubmit(submifun);
								return false;
							}, function(index) {
								$(form[1]).val("N");//如果选择“否”，提交表单到后台把启用改为禁用
								top.layer.close(index);
								$(form).ajaxSubmit(submifun);
								return false;
							});
						} else {
							$(form).ajaxSubmit(submifun);
							return false;
						}
					} else {
						$(form).ajaxSubmit(submifun);
						return false;
					}
				} else {
					if ($(form[7]).is(':checked') == true) {
						var flag = preview.isHasValid(businessNodesId, $(form[6]).val()); //返回是否有启用的模板，true：有 false：无
						if (flag == true) {
							top.layer.confirm('已存在启用的模板，是否启用【'+$(form[3]).val()+'】模板？', {
								title : "提示",
								icon : 3,
								btn : [ '是', '否' ]
							}, function(index) {
								top.layer.close(index);
								$(form).ajaxSubmit(submifun);
								return false;
							}, function(index) {
								$(form[2]).val("N"); //如果选择“否”，提交表单到后台把启用改为禁用
								top.layer.close(index);
								$(form).ajaxSubmit(submifun);
								return false;
							});
						} else {
							$(form).ajaxSubmit(submifun);
							return false;
						}
					} else {
						$(form).ajaxSubmit(submifun);
						return false;
					}
				}
			},
			rules : {
				"templateCode" : {
					required : true,
					code : true
				},
				"templateName" : {
					required : true
				},
				"titleTemplate" : {
					required : true
				},
				"sx002Id" : {
					required : true
				},
				"contentTemplate" : {
					required : true
				}

			},
			messages : {
				"templateCode" : {
					required : "模板代码不允许为空",
					code : "只能包括英文字母、数字和下划线"
				},
				"templateName" : {
					required : "模板名称不允许为空"
				},
				"titleTemplate" : {
					required : "标题模板不允许为空"
				},
				"sx002Id" : {
					required : "消息发送方式不允许为空"
				},
				"contentTemplate" : {
					required : "内容模板不允许为空"
				}
			}
		};
		if (isAdd == true) {
			v.rules["templateCode"].remote = {
				url : basePath + "sx/templet/judgeIsExists.htm?businessNodesId=" + businessNodesId + "",
				type : "post",
				dataType : "json"
			};
			v.messages["templateCode"].remote = "模板代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});

/**
 * 数据操作对象
 */
var modelPreview = function() {
	var previewObj = {
		codeArr : [], // 字段代码集合
		isView : null,
		clickObj : {}, // 点击字段对应的对象
		clickPreviewObj : {}, // 点击预览时对应的对象
		content : null,
		title : null,
		businessNodesId : null,
		init : function(businessNodesId, layero) {
			// 查询业务节点下的所有字段
			$.ajax({
				type : 'POST',
				url : basePath + "sx/templet/getParam.htm",
				dataType : "json",
				async : false,
				data : {
					"businessNodesId" : businessNodesId
				},
				success : function(data, textStatus, jqXHR) {
					if (data.success) {
						if (data.data != null && data.data.length > 0) {
							// 如果为查看页面，则不显示字段
							if (preview.isView == true) {
								// 遍历字段，动态加载到页面
								for (var i = 0; i < data.data.length; i++) {
									$("#contentTemplate", layero).before("<a class='hide paramClick' id='" + data.data[i].fieldCode + "' data-code='" + data.data[i].syntheticData + "'></a>");
									$("#titleTemplate", layero).before("<a class='hide titleClick' data-id='" + data.data[i].fieldCode + "' data-code='" + data.data[i].syntheticData + "'></a>");
									previewObj.codeArr.push(data.data[i].fieldCode);
								}
							} else {
								// 遍历字段，动态加载到页面
								for (var i = 0; i < data.data.length; i++) {
									$("#contentTemplate", layero).before("<a class='form-control paramClick' style='width:auto' id='" + data.data[i].fieldCode + "' data-code='" + data.data[i].syntheticData + "'>" + data.data[i].fieldName + "</a>");
									$("#titleTemplate", layero).before("<a class='form-control titleClick' style='width:auto' data-id='" + data.data[i].fieldCode + "' data-code='" + data.data[i].syntheticData + "'>" + data.data[i].fieldName + "</a>");
									previewObj.codeArr.push(data.data[i].fieldCode);
								}
								$("#contentTemplate", layero).after("<span>说明：可点击输入框上方的超链接动态插入属性变量。</span>");
							}
						}
					} else {
						top.layer.alert(data.errorMsg, {
							icon : 2,
							title : "获取字段失败"
						});
					}
				},
			});
		},
		clickParam : function(layero, classType) {
			if (classType == "paramClick") {
				var html = $("#contentTemplate", layero).val();
				$("#contentTemplate", layero).val(html + "${" + previewObj.clickObj.attr("id") + "}");
			} else if (classType == "titleClick") {
				var html = $("#titleTemplate", layero).val();
				$("#titleTemplate", layero).val(html + "${" + previewObj.clickObj.attr("data-id") + "}");
			}
		},
		clickPreview : function(layero, businessNodesId, contentTemplate) {
			if(contentTemplate != null && contentTemplate != ""){
				$.ajax({
					type : "POST",
					url : basePath + "sx/nodeParam/preview.htm",
					dataType : "json",
					data : {"businessNodesId" : businessNodesId, "contentTemplate" : contentTemplate},
					success : function(data) {
						if (data.success == true) {
							previewObj.content = data.data;
						}
						top.layer.open({
							type : 1,
							id : "openPreview",
							title : previewObj.title,
							area : [ "500px", "400px" ],
							maxmin : true,
							shadeClose : true,
							content : previewObj.content,
							success : function(layero, index) {
								$("#openPreview", layero).css("padding-top", "35px");
								$(".layui-layer-min", layero).addClass("hide");
							}
						});
					}
				});
			}else{
				top.layer.open({
					type : 1,
					id : "openPreview",
					title : previewObj.title,
					area : [ "500px", "400px" ],
					maxmin : true,
					shadeClose : true,
					content : previewObj.content,
					success : function(layero, index) {
						$("#openPreview", layero).css("padding-top", "35px");
						$(".layui-layer-min", layero).addClass("hide");
					}
				});
			}
		},
		selectSx002Id : function(layero) {
			$("#sx002Id", layero).change(function() {
				if ($(this).find("option:selected").html() == "短信") {
					$("#titleTemplate", layero).parent().parent().addClass("hide");
					$("#titleTemplate", layero).removeAttr("name");
					$("#sx002SmName", layero).val("短信");
				} else {
					$("#titleTemplate", layero).parent().parent().removeClass("hide");
					$("#titleTemplate", layero).attr("name", "titleTemplate");
					$("#sx002SmName", layero).val($(this).find("option:selected").html());
				}
			})
		},
		isHasValid : function(businessNodesId, sx002Id) {
			var flag = false;
			$.ajax({
				type : 'POST',
				url : basePath + "sx/templet/isHasValid.htm",
				dataType : "json",
				async : false,
				data : {
					"businessNodesId" : businessNodesId,
					"sx002Id" : sx002Id
				},
				success : function(data) {
					if (data == true) {
						flag = true;
					} else {
						flag = false;
					}
				}
			});
			return flag;
		},
		loadSelectData : function() {
			$.ajax({
				type : 'POST',
				url : basePath + "sx/templet/loadSendTypeData.htm",
				dataType : "json",
				async : false,
				data : {
					"businessNodesId" : previewObj.businessNodesId
				},
				success : function(result) {
					bt.config.form = {
						data : {
							sx002Id : {
								list : []
							}

						}
					};
					for (var i = 0; i < result.result.length; i++) {
						bt.config.form.data.sx002Id.list[i] = {
							id : result.result[i].id,
							text : result.result[i].text
						};
					}

				}
			});
		},
		setValid : function(result){
			
			top.layer.confirm('已存在启用的模板，是否启用【'+$(result).parent().parent().find("td:nth-child(3)").html()+'】模板？', {
				title : "提示",
				icon : 3,
				btn : [ '是', '否' ]
			}, function(index) {
				var id = $(result).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
				$.ajax({
					type : 'POST',
					url : basePath + "sx/templet/setValid.htm",
					dataType : "json",
					async : false,
					data : {
						"id" : id
					},
					success : function(data) {
						if(data.success){
							top.layer.alert('启用成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新树的数据
								$("#btn_refresh_tree").trigger('click');
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
								bt.fn.treeClickQuery(bt.fn.getSelectTreeNodes());
							});
						}else{
							top.layer.alert("启用失败", {
								icon : 3,
								title : "提示"
							});
						}
					}
				});
			}, function(index) {
				top.layer.close(index);
			});
		}
	};
	return previewObj;
}
