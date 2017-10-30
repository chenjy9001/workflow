var toolSub;
var bt = new baothink();
$(function() {
	toolSub = new toolSuppert();
	var vaildFlagData = "";// 记录有效状态
	bt.config.url.namespace = "/sys/user/";
	bt.config.toolbar.search = "账号/姓名";// 右上角搜索框的提示语句
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
	bt.config.toolbar.query = {// 配置高级查询
		empCode : function() {
			return $("#search_empCode").val();
		},
		empName : function() {
			return $("#search_empName").val();
		}
	};
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '700px','470px' ], $("#add_data_div").html(), function(layero, index) {
				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('保存成功！', {
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
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '700px','610px' ], $("#modify_data_div").html(), data, function(layero, index) {
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
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			var layeroData = null;
			bt.fn.showView('查看数据 ', [ '700px' ], $("#view_data_div").html(), data, function(layero, index) {
				layeroData = layero;
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "sex":
							switch (value) {
							case "0":
								$input.text("女");
								break;
							case "1":
								$input.text("男");
								break;
							}
							break;
						case "vaildFlag":
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
							$input.val(value);
						}

					}
				});
			});
			toolSub.showViewPhoto(data.photo, layeroData, data.notes);
		}
	}, {
		id : "btn_resetPwd",
		text : "重置密码",
		icon : "fa-key",
		visible : true,
		disable : false,
		click : function(data) {
			toolSub.resetPasswork();
		}
	} ];
	bt.config.datatables.pageLength = 100; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'photo',
		title : '头像',
		render : function(data, type, row, meta) {
			return '<div style="border-radius: 100%;width: 40px;height:40px;margin:0 auto;overflow:hidden"><img src="' + basePath + 'fileserver/loadImage/' + data + '" style="height: 40px;width:40px;"></div>';
		}
	}, {
		data : 'empCode',
		title : '账号',
		className : "text-center",
		render : function(data, type, row, meta) {
			return '<div class="empCodeDiv" data-empCode="' + data + '">' + data + '</div>';
		}
	}, {
		data : 'empName',
		title : '姓名',
		className : "text-center"
	}, {
		data : 'sex',
		title : '性别',
		className : "text-center",
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
		title : '手机号'
	}, {
		data : 'createEName',
		title : '创建人',
		className : "text-center"
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
		data : 'vaildFlag',
		title : '是否启用',
		className : "text-center",
		render : function(data, type, row, meta) {
			vaildFlagData = data;
			if (data == "1") {
				return "是";
			} else {
				return "否";
			}
		}
	}, {
		title : '操作',
		className : "text-center",
		render : function(data, type, row, meta) {
			return toolSub.vaildFlag_html(vaildFlagData);
		}
	}

	/*
	 * ,{ data : 'notes', title : '备注', width:'200px', className : "text-center" }, { data : 'createEName', title : '创建人', width : "100px", className : "text-center" }, { width : "130px", className : "text-center", data : 'createDate', title : '创建时间' },{ className : "text-center", data : 'updateEName', width : "100px", title : '修改人' },{ width : "130px", className : "text-center", data : 'updateDate', title : '修改时间' }
	 */];
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
				"empCode" : {
					required : true,
					maxlength : 20
				},
				"empName" : {
					required : true,
					maxlength : 10
				},
				"email" : {
					email : true
				},
				"password" : {
					required : true,
					minlength : 6
				},
				"password2" : {
					required : true,
					minlength : 6,
					equalTo : "#password"
				},
				"phone" : {
					mobile : true
				},
				"notes" : {
					maxlength : 50
				}
			},
			messages : {
				"empCode" : {
					required : "账号不允许为空！",
					minlength : "账号长度不能超过20个字符!"
				},
				"empName" : {
					required : "姓名不允许为空!",
					minlength : "姓名不能超过10个字符"
				},
				"password" : {
					required : "密码不能为空！",
					minlength : '密码长度不能少于6位!',
				},
				"password2" : {
					required : "密码不能为空！",
					minlength : '密码长度不能少于6位!',
					equalTo : "两次密码不一致"
				},
				"notes" : {
					maxlength : "备注不能超过50个字"
				}
			}
		};
		if (isAdd == true) {
			v.rules["empCode"].remote = {
				url : basePath + "sys/user/checkEmpCode.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["empCode"].remote = "账号不允许重复，请重新录入";
		}

		return from.validate(v);
	}
});

/**
 * 常用工具对象<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月18日15:44:54<br>
 */
var toolSuppert = function() {
	var tool = {
		// 操作：拼接html
		vaildFlag_html : function(obj) {
			var name = "";
			if (obj == "1") {
				name = "禁用";
			} else {
				name = "启用";
			}
			var html = '';
			html += '<a class="btn btn-primary btn-xs" data-type="true" onclick="authorize(this)">';
			html += '关联角色';
			html += '</a>';
			html += '  <a  data-type="' + obj + '"  class="btn btn-primary btn-xs" onClick="vaildFlagDivClick(this);">';
			html += name;
			html += '</a>';
			return html;
		},
		// 操作：切换启用/禁用
		vaildFlag_change : function(type, empCodeDate, obj) {
			if (type == "1") {
				type = false;
			} else {
				type = true;
			}
			$.ajax({
				type : 'post',
				url : basePath + 'sys/user/setEnabledAsync.htm',
				dataType : 'json',
				data : {
					empCode : empCodeDate,
					status : type
				},
				success : function(data) {
					if (data.success) {
						tool.vaildFlag_success(obj, type);
						top.layer.alert("操作成功！", {
							icon : 1
						});
					} else {
						top.layer.alert("操作失败！", {
							icon : 2
						});
					}
				},
				error : function(XmlHttpRequest, textStatus, errorThrown) {
					top.layer.alert("操作失败！", {
						icon : 2
					});
				}
			});

		},
		// 成功后动态更改页面元素
		vaildFlag_success : function(obj, type) {
			if (type == true) {
				$(obj).attr("data-type", "1");
				$(obj).text("禁用");
				$(obj).parent().prev().text("是");
			} else {
				$(obj).attr("data-type", "0");
				$(obj).text("启用");
				$(obj).parent().prev().text("否");
			}
		},
		// 重置密码操作
		resetPasswork : function() {
			var $tr = null;
			$("tr[role=row]").each(function() {
				if ($(this).hasClass("selected")) {
					$tr = $(this);
					return false;
				}
			});
			if ($tr == null) {
				top.layer.alert("至少选择一条数据！", {
					icon : 0
				});
			}
			var empCode = $tr.find(".empCodeDiv").attr("data-empcode");
			$.ajax({
				type : 'post',
				url : basePath + 'sys/user/resetPassworkAsync.htm',
				dataType : 'json',
				data : {
					empCode : empCode
				},
				success : function(data) {
					if (data.success) {
						top.layer.alert("重置密码成功，新密码为" + data.data, {
							icon : 1
						});
					} else {
						top.layer.alert(data.errorMsg, {
							icon : 2
						});
					}
				},
				error : function(XmlHttpRequest, textStatus, errorThrown) {
					top.layer.alert("操作失败！", {
						icon : 2
					});
				}
			});
		},
		// 根据photo在查看框创建头像
		showViewPhoto : function(photo, layero, notes) {
			var src = '';
			src += basePath + 'fileserver/loadImage/' + photo;
			$(layero).find("#viewImg").attr("src", src);
			$(layero).find("#notes").val(notes);
		}
	}
	return tool;
}

/**
 * 启用/禁用按钮<br>
 * 
 * @author 陈培坤<br>
 *         2016年10月18日15:54:01<br>
 */
function vaildFlagDivClick(obj) {
	var type = $(obj).attr("data-type");
	if (type != "1" && type != "0") {
		top.layer.alert("操作失败！", {
			icon : 2
		});
	}
	var empCode = $(obj).parent().parent().find(".empCodeDiv").attr("data-empcode");
	if (empCode == null || empCode == undefined || empCode == "") {
		top.layer.alert("操作失败！", {
			icon : 2
		});
	}
	toolSub.vaildFlag_change(type, empCode, obj);
}

/**
 * 用户角色设置
 */
function authorize(data) {
	var empCode = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
	bt.fn.show("用户角色设置", [ '800px', '600px' ], $("#user_auth_div").html(), function(layero, index) {
		var bk = new baothink(layero);
		bk.config.url.namespace = "sys/role/";
		bk.config.url.loadListByPage = "loadListByPage";
		bk.config.toolbar.search = "角色名称";// 右上角搜索框的提示语句
		bk.config.toolbar.tag = $("#toolbar", layero);// 配置承载toolbar的容器
		bk.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
		bk.config.datatables.tag = $("#dataTable1", layero);
		bk.config.datatables.multiSelect = true;
		bk.config.visible.toolbar = true; // 默认为true

		bk.config.datatables.pageLength = 100; // 每页记录数，默认10
		bk.config.datatables.paging = false;// 是否分页，默认true
		bk.config.datatables.columns = [ {
			visible : false,
			data : 'id'
		}, bk.datatables.columns.cs, bk.datatables.columns.seq, {
			data : 'groupName',
			title : '角色名称'
		}, {
			data : 'validFlag',
			title : '是否启用',
			className : "text-center",
			render : function(data, type, row, meta) {
				vaildFlagData = data;
				if (data == "1") {
					return "是";
				} else {
					return "否";
				}
			}
		} ];

		// 初始化所有元素
		bk.fn.init(function() {
			//默认勾选已保存的角色
			$.ajax({
				type : 'post',
				url : basePath + 'iu/userRole/getGroupByEmpCode.htm',
				dataType : 'json',
				async : false,
				data : {
					empCode : empCode
				},
				success : function(data) {
					var allGroup = $("input[name = iCheck]", layero);
					for (var i = 0; i < data.data.length; i++) {
						$("input[name = iCheck]", layero).each(function() {
							if(data.data[i].id == $(this).val()){
								$(this).iCheck('check');
							}
						});
					}
				}
			});
		});
		


	}, {
		btn : [ "确定", "取消" ],
		yes : function(index, layero) {
			var id = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
			var str = "";
			$("input[name='iCheck']:checkbox", layero).each(function() {
				if (true == $(this).is(':checked')) {
					str += $(this).val() + ",";
				}
			});

			$.ajax({
				type : 'post',
				url : basePath + 'iu/userRole/addAsync.htm',
				dataType : 'json',
				data : {
					groupId : str,
					empId : id
				},
				success : function(data) {
					if (data.success) {
						top.layer.alert('关联角色成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
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
