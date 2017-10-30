var toolSub;
var bt = new baothink();
$(function() {
	var record = "";// 记录用户是否有效
	toolSub = new toolSuppert();
	bt.config.url.namespace = "sys/role/";
	bt.config.toolbar.search = "角色名称";
	bt.config.toolbar.query = {// 配置高级查询
		sysId : function() {
			return $("#search_sysId").val();
		},
		ptId : function() {
			return $("#search_ptId").val();
		},
		groupName : function() {
			return $("#search_groupName").val();
		}
	};
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'groupName',
		title : '角色名称',
		className : "text-center"
	}, {
		data : 'validFlag',
		title : '是否启用',
		className : "text-center"
	}, {
		data : 'notes',
		width : "200px",
		title : '备注',
		className : "text-center"
	}, {
		className : "text-center",
		data : 'createEName',
		title : '创建人'
	}, {
		className : "text-center",
		data : 'createDate',
		title : '创建时间'
	}, {
		className : "text-center",
		data : 'updateEName',
		title : '修改人'
	}, {
		className : "text-center",
		data : 'updateDate',
		title : '修改时间'
	}, {
		className : "text-center",
		title : "操作",
		render : function(data, type, row, meta) {
			var html = '';
			var name = "";
			html += '<a class="btn btn-primary btn-xs" data-type="true" onclick="authorize(this)">';
			html += '权限设置';
			html += '</a>';
			html += '  <a class="btn btn-primary btn-xs" data-type="true" onclick="userView(this);">';
			html += '查看用户';
			html += '</a>';
			if (record == "1") {
				name = "禁用";
				html += '  <a class="btn btn-primary btn-xs" data-type="false" onClick="topSetOrCancle(this);" >';
			} else {
				name = "启用";
				html += '  <a class="btn btn-primary btn-xs" data-type="true" onClick="topSetOrCancle(this);" >';
			}
			html += name;
			html += '</a>';

			return html;
		}
	} ];
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			record = data;
			if (data == "1") {
				return "是";
			} else if (data == "0") {
				return "否";
			}
		},
		targets : [ 4 ]
	} ];
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '600px', '280px' ], $("#add_data_div").html(), function(layero, index) {
				fromSubmit($("#add_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						parent.layer.alert(result.errorMsg, {
							icon : 3,
							title : "提示"
						});
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
			bt.fn.showModify('修改数据 ', [ '600px', '280px' ], $("#modify_data_div").html(), data, function(layero, index) {
				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						parent.layer.alert(result.errorMsg, {
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
		disable : false
	}, {
		visible : false,
		disable : true
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
				"sysId" : {
					required : true,
					maxlength : 20
				},
				"ptId" : {
					required : true,
					maxlength : 20
				},
				"groupName" : {
					required : true,
					maxlength : 40
				}
			},
			messages : {
				"sysId" : {
					required : "系统代码不允许为空",
					minlength : "系统代码不能超过20个字符"
				},
				"ptId" : {
					required : "平台代码不允许为空",
					minlength : "平台代码不能超过20个字符"
				},
				"groupName" : {
					required : "角色名称不允许为空",
					minlength : "角色名称不能超过40个字符"
				}
			}
		});
	}

});

/**
 * 常用工具对象<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月25日13:30:18<br>
 */
var toolSuppert = function() {
	var tool = {
		// 操作：切换启用/禁用
		vaildFlag_change : function(status, id, obj) {
			$.ajax({
				type : 'post',
				url : basePath + 'sys/role/setEnabledAsync.htm',
				dataType : 'json',
				data : {
					groupId : id,
					status : status
				},
				success : function(data) {
					if (data.success) {
						top.layer.alert(status == "true" ? "启用成功！" : "禁用成功！", {
							icon : 1
						});
					} else {
						top.layer.alert(status == "true" ? "启用失败！" : "禁用失败！", {
							icon : 2
						});
					}
					if (status == "true" || status == true) {
						$(obj).attr("data-type", "false");
						$(obj).text("禁用");
						$('td',$(obj).parent().parent()).eq(3).text("是");
					} else {
						$(obj).attr("data-type", "true");
						$(obj).text("启用");
						$('td',$(obj).parent().parent()).eq(3).text("否");
					}
				},
				error : function(XmlHttpRequest, textStatus, errorThrown) {
					top.layer.alert(status == "true" ? "启用失败！" : "禁用失败！", {
						icon : 2
					});
				}
			});
		}
	}
	return tool;
}

/**
 * 禁用/启用
 * 
 * @param obj
 */
function topSetOrCancle(obj) {
	var status = $(obj).attr("data-type");
	var id = $(obj).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
	var tip = status == "true" ? "是否启用？" : "是否禁用？";
	top.layer.alert(tip, {
		icon : 3
	}, function(index, layero) {
		if (status == null || status == undefined || status == "" || id == null || id == undefined || id == "") {
			top.layer.alert(status == "true" ? "启用失败！" : "禁用失败！", {
				icon : 2
			});
			return;
		}
		toolSub.vaildFlag_change(status, id, obj);
		parent.layer.close(index);
	});
}

/**
 * 角色权限设置
 */
function authorize(data) {
	bt.fn.show("角色权限设置", [ '400px', '600px' ], $("#auth_data_div").html(), function(layero, index) {
		// 重写树初始化事件，新增checkbox按钮
		var $jsTree = $("#jstree", layero);
		var groupId = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
		tree = $jsTree.jstree({
			core : {
				animation : 0,
				multiple : true,
				check_callback : true,
				data : {
					url : basePath + 'sys/role/loadTree.json?groupId=' + groupId + ''
				}
			},
			// 更换节点图标，type参数在树加载时赋值
			types : {
				"func" : {
					"icon" : "glyphicon glyphicon-th-large",
					"valid_children" : []
				}
			},
			plugins : [ "contextmenu", "checkbox", "search", "types", "dnd", "wholerow" ]
		// 添加插件
		}).bind("loaded.jstree", function(e, result) {
			result.instance.open_all(); // 默认展开所有节点

		});
		$("#btn_refresh_tree", layero).click(function() {
			$('#jstree', layero).jstree(true).refresh();
		});

		var to = false;
		$('#search_tree', layero).keyup(function() {
			if (to) {
				clearTimeout(to);
			}
			to = setTimeout(function() {
				$('#jstree', layero).jstree(true).search($('#search_tree', layero).val());
			}, 250);
		});
		$("form", layero).baothinkform($("#add_default_form", layero));

	}, {
		btn : [ "确定", "取消" ],
		yes : function(index, layero) {
			var loadIndex = top.layer.load(2, {
				shade : [ 0.1, '#fff' ]
			});
			var id = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
			var obj = $("#jstree", layero).jstree().get_checked(true);
			var selectNodeId = [];
			$.each(obj, function(i, node) {
				selectNodeId.push(node.id);
				if (node.parents && node.parents.length > 0) {
					$.each(node.parents, function(j, parentNodeId) {
						if ($.inArray(parentNodeId, selectNodeId) == -1 && "#" != parentNodeId) {
							selectNodeId.push(parentNodeId);
						}
					});
				}
			});
			selectNodeId = JSON.stringify(selectNodeId);
			console.info(selectNodeId);
			$.ajax({
				type : 'post',
				url : basePath + 'sys/role/authorize.htm',
				dataType : 'json',
				data : {
					obj : selectNodeId,
					id : id
				},
				success : function(data) {
					if (data.success) {
						top.layer.alert('授权成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(loadIndex);
							top.layer.close(index);
						});
					} else {
						parent.layer.alert(data.errorMsg, {
							icon : 2,
							title : "提示"
						});
					}
					top.layer.close(index);
				}
			});
		}
	});
};

/**
 * 用户查看
 */
function userView(data) {
	var groupId = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
	bt.fn.show("关联用户查看", [ '1000px', '600px' ], $("#user_view_div").html(), function(layero, index) {
		var bk = new baothink(layero);
		bk.config.url.namespace = "sys/role/";
		bk.config.url.loadListByPage = "loadListByGroupId.htm?groupId=" + groupId + "";
		bk.config.toolbar.search = "账号";// 右上角搜索框的提示语句
		bk.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
		bk.config.datatables.tag = $("#dataTable1", layero);
		bk.config.visible.toolbar = true; // 默认为true
		bk.config.toolbar.tag = $("#toolbar", layero);// 配置承载toolbar的容器

		bk.config.datatables.pageLength = 100; // 每页记录数，默认10
		bk.config.datatables.paging = false;// 是否分页，默认true
		bk.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
			visible : false,
			data : 'id'
		}, bk.datatables.columns.cs, bk.datatables.columns.seq, {
			data : 'photo',
			title : '头像',
			width : "200px",
			render : function(data, type, row, meta) {
				return '<div style="border-radius: 100%;width: 40px;height:40px;margin:0 auto;overflow:hidden"><img src="' + basePath + 'fileserver/loadImage/' + data + '" style="height: 40px;width:40px;"></div>';
			}
		}, {
			data : 'empCode',
			title : '账号',
			width : "300px",
			className : "text-center",
			render : function(data, type, row, meta) {
				return '<div class="empCodeDiv" data-empCode="' + data + '">' + data + '</div>';
			}
		}, {
			data : 'empName',
			title : '姓名',
			width : "300px",
			className : "text-center"
		}, {
			data : 'sex',
			title : '性别',
			className : "text-center",
			width : "200px",
			render : function(data, type, row, meta) {
				if (data == "0") {
					return "女";
				} else if (data == "1") {
					return "男";
				}
			}
		}, {
			className : "text-center",
			data : 'phone',
			width : "300px",
			title : '手机号'
		} ];

		// 初始化所有元素
		bk.fn.init(function() {
		});

	}, {
		btn : [ "关闭" ],
		yes : function(index, layero) {
			top.layer.close(index);
		}
	});
}
