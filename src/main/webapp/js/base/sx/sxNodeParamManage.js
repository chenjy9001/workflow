var preview;
var bt;
$(function() {
	bt = new baothink();
	preview = new modelPreview();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/sx/nodeParam/";// url命名空间
	bt.config.visible.splitter = true; // 显示分隔条， 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		businessNodesId : "id"
	}
	bt.config.toolbar.search = "字段代码/字段名称";// 右上角搜索框的提示语句

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
					icon : 3,
					title : "提示"
				});
				return;
			}

			bt.fn.showAdd('新增字段 ', [ '700px', '530px' ], $("#add_data_div").html(), function(layero, index) {

				var node = bt.fn.getSelectTreeNodes();
				if (node[0].parents > 2) {
					$("#businessNodesId", layero).val(node[0].parent);
				} else {
					$("#businessNodesId", layero).val(node[0].id);
				}
				
				// 动态获取节点下的字段，并显示在页面上
				preview.isView = false;
				preview.init($("#businessNodesId", layero).val(), layero);
				// 字段集合
				var codeArr = preview.codeArr;

				// 点击字段动态添加到模板内容
				preview.clickParam(layero, "paramClick");

				// 点击预览模板弹出框
				$("#preview", layero).on("click", function(event) {
					preview.title = "预览模板";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#contentTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#fieldCode", layero).val(), $("#syntheticData", layero).val(), $("#contentTemplate", layero).val());
				});
				
				$(("#fieldCode", layero), ("#fieldName", layero), ("#syntheticData", layero)).bind("keyup", function(){
					preview.contentKeyup(layero);
				});

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
							icon : 2,
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
			bt.fn.showModify('修改字段 ', [ '730px', '620px' ], $("#modify_data_div").html(), data, function(layero, index) {

				$("#businessNodesId", layero).val(data.businessNodesId);
				$("#syntheticData", layero).val(data.syntheticData);
				
				// 动态获取节点下的字段，并显示在页面上
				preview.isView = false;
				preview.init($("#businessNodesId", layero).val(), layero);
				// 字段集合
				var codeArr = preview.codeArr;

				// 点击字段动态添加到模板内容
				preview.clickParam(layero, "paramClick");
				
				// 点击预览模板弹出框
				$("#preview", layero).on("click", function(event) {
					preview.title = "预览模板";
					preview.clickPreviewObj = $(this);
					preview.content = $(this).parent().next().find("#contentTemplate").val();
					preview.clickPreview(layero, $("#businessNodesId", layero).val(), $("#fieldCode", layero).val(), $("#syntheticData", layero).val(), $("#contentTemplate", layero).val());
				});
				
				$(("#fieldCode", layero), ("#fieldName", layero), ("#syntheticData", layero)).bind("keyup", function(){
					preview.contentKeyup(layero, true);
				});

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
				});
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
			bt.fn.showView('查看字段信息 ', [ '700px', '580px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				$("#syntheticData", layero).val(data.syntheticData);
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
					preview.clickPreview(layero, data.businessNodesId, $("#fieldCode", layero).val(), $("#syntheticData", layero).val(), $("#contentTemplate", layero).val());
				});
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
		data : 'fieldCode',
		title : '字段代码',
	}, {
		data : 'fieldName',
		title : '字段名称'
	}, {
		data : 'syntheticData',
		title : '字段模拟数据'
	}, {
		data : 'isFlag',
		title : '是否启用'
	}, {
		data : 'notes',
		title : '备注'
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
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
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"fieldCode" : {
					required : true,
					code : true
				},
				"fieldName" : {
					required : true
				},
				"syntheticData" : {
					required : true
				}
			},
			messages : {
				"fieldCode" : {
					required : "字段代码不允许为空",
					code : "只能包括英文字母、数字和下划线"
				},
				"fieldName" : {
					required : "字段名称不允许为空"
				},
				"syntheticData" : {
					required : "字段模拟数据不允许为空"
				}
			}
		};
		if (isAdd == true) {
			v.rules["fieldCode"].remote = {
				url : basePath + "sx/nodeParam/judgeIsExists.htm?businessNodesId="+businessNodesId+"",
				type : "post",
				dataType : "json"
			};
			v.messages["fieldCode"].remote = "字段代码不允许重复，请重新录入";
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
			$(".paramClick", layero).unbind('click');
			$(".paramClick", layero).on('click', function(event) {
				previewObj.clickObj = $(this);
				if (classType == "paramClick") {
					var html = $("#contentTemplate", layero).val();
					$("#contentTemplate", layero).val(html + "${" + previewObj.clickObj.attr("id") + "}");
				}
			});
			
		},
		clickPreview : function(layero, businessNodesId, fieldCode, syntheticData, contentTemplate) {
			if(contentTemplate != null && contentTemplate != ""){
				$.ajax({
					type : "POST",
					url : basePath + "sx/nodeParam/preview.htm",
					dataType : "json",
					data : {"businessNodesId" : businessNodesId, "fieldCode" : fieldCode, "syntheticData" : syntheticData, "contentTemplate" : contentTemplate},
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
		contentKeyup : function(layero, isModify){
			var fieldCode = $("#fieldCode", layero).val();
			var fieldName = $("#fieldName", layero).val();
			var syntheticData = $("#syntheticData", layero).val();
			if(fieldCode != "" && fieldCode != null){
				previewObj.codeArr.push(fieldCode);
			}
			if(fieldName != "" && fieldName != null){
				if(!isModify){
					if($("a[data-default = addKeyup]", layero).length > 0){
						$("a[data-default = addKeyup]", layero).attr("id", fieldCode);
						$("a[data-default = addKeyup]", layero).attr("data-code", syntheticData);
						$("a[data-default = addKeyup]", layero).html(fieldName);
					}else{
						$("#contentTemplate", layero).before("<a class='form-control paramClick' data-default='addKeyup' style='width:auto' id='" + fieldCode + "' data-code='" + syntheticData + "'>" + fieldName + "</a>");
						previewObj.clickParam(layero, "paramClick");
					}
				}else{
					$("#"+fieldCode+"", layero).attr("data-code", syntheticData);
					$("#"+fieldCode+"", layero).html(fieldName);
				}
			}
		}
	};
	return previewObj;
}
