$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/sys/menufun/";// url命名空间
	// 配置部件是否可见
	bt.config.visible.searchbar = false;// 默认为true
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		aid : "sub_btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			if (bt.fn.getMainSelectRows() == undefined) {
				top.layer.alert('请先选择菜单！', {
					icon : 0,
					title : "提示"
				});
				return;
			}

			if (bt.fn.getMainSelectRows().menuLevel == 1 || bt.fn.getMainSelectRows().menuLevel == 0) {
				top.layer.alert('一级菜单不能添加菜单功能！', {
					icon : 0,
					title : "提示"
				});
				return;
			} else if (bt.fn.getMainSelectRows().menuLevel == 2) {
				top.layer.alert('二级菜单不能添加菜单功能！', {
					icon : 0,
					title : "提示"
				});
				return;
			}

			bt.fn.showAdd('新增数据 ', [ '600px', '390px' ], $("#add_data_div").html(), function(layero, index) {

				// 获取主表菜单代码
				var mainSelectRows = bt.fn.getMainSelectRows().menuCode;
				$("#menuCode", layero).val(mainSelectRows);

				// 获取主表菜单名称
				var mainSelectRowsName = bt.fn.getMainSelectRows().menuName;
				$("#menuName", layero).val(mainSelectRowsName);

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
						top.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
					}
				}, true);
			});
		}
	}, {
		id : "btn_modify",
		aid : "sub_btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			var rows = bt.fn.getSelectRows();
			bt.fn.showModify('修改数据 ', [ '600px', '480px' ], $("#modify_data_div").html(), data, function(layero, index) {

				// 获取主表菜单代码
				var mainSelectRows = bt.fn.getMainSelectRows().menuCode;
				$("#menuCode", layero).val(mainSelectRows);

				// 获取主表菜单名称
				var mainSelectRowsName = bt.fn.getMainSelectRows().menuName;
				$("#menuName", layero).val(mainSelectRowsName);

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
		aid : "sub_btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false
	}, {
		id : "btn_view",
		aid : "sub_btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '600px', '440px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "validFlag":
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
	}, {
		id : "btn_addFunc",
		aid : "sub_btn_addFunc",
		text : "一键添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function(data) {

			// 判断有无选中主表行数据
			if (bt.fn.getMainSelectRows() == undefined) {
				top.layer.alert('请先选择菜单！', {
					icon : 0,
					title : "提示"
				});
				return;
			}

			if (bt.fn.getMainSelectRows().menuLevel == 1 || bt.fn.getMainSelectRows().menuLevel == 0) {
				top.layer.alert('一级菜单不能添加菜单功能！', {
					icon : 0,
					title : "提示"
				});
				return;
			} else if (bt.fn.getMainSelectRows().menuLevel == 2) {
				top.layer.alert('二级菜单不能添加菜单功能！', {
					icon : 0,
					title : "提示"
				});
				return;
			}

			// 获取主表菜单代码
			var mainSelectRows = bt.fn.getMainSelectRows().menuCode;

			var html = $("#add_default_div").html();
			top.layer.open({
				title : '一键添加',
				content : html,
				shadeClose : true, // 点击遮罩关闭层
				area : '870px',
				success : function(layero) {

					// 查询添加过的菜单功能代码，checkbox变为禁用状态
					$.ajax({
						type : 'POST',
						url : basePath + "sys/menufun/getFuncCodeList.htm",
						data : {
							"menuCode" : mainSelectRows
						},
						async : false,
						dataType : "json",
						success : function(data) {
							if (data.success == true) {
								var codeArr = data.data.split("-");
								for (var int = 0; int < codeArr.length; int++) {
									if (codeArr[int] == "add") {
										$("#func1", layero).iCheck('disable'); // 复选框设置禁用
										$("#funcAdd", layero).attr("disabled","disabled"); // 去除name属性
										$("#funcAdd", layero).attr("data-flag", "1"); // 禁用的文本框设置标记“1”，用于恢复状态
									}
									if (codeArr[int] == "delete") {
										$("#func2", layero).iCheck('disable');
										$("#funcDel", layero).attr("disabled","disabled");
										$("#funcDel", layero).attr("data-flag", "1");
									}
									if (codeArr[int] == "modify") {
										$("#func3", layero).iCheck('disable');
										$("#funcModify", layero).attr("disabled","disabled");
										$("#funcModify", layero).attr("data-flag", "1");
									}
									if (codeArr[int] == "view") {
										$("#func4", layero).iCheck('disable');
										$("#funcView", layero).attr("disabled","disabled");
										$("#funcView", layero).attr("data-flag", "1");
									}
									if (codeArr[int] == "importExcel") {
										$("#func5", layero).iCheck('disable');
										$("#func5", layero).iCheck('check');
										$("#funcImportExcel", layero).attr("data-flag", "1");
									}
									if (codeArr[int] == "exportExcel") {
										$("#func6", layero).iCheck('disable');
										$("#func6", layero).iCheck('check');
										$("#funcExportExcel", layero).attr("data-flag", "1");
									}
									if (codeArr[int] == "refresh") {
										$("#func7", layero).iCheck('disable');
										$("#func7", layero).iCheck('check');
										$("#funcRefresh", layero).attr("data-flag", "1");
									}
								}
							} else {
								top.layer.alert(data.errorMsg, {
									icon : 2,
									title : "提示"
								});
							}
						}
					});

					$("#menuCode", layero).val(mainSelectRows);

					// 选中、取消checkbox构造是否提交
					$(".chooseFunc", layero).on('ifChecked', function(event) {
						if ($(event.currentTarget).val() == "1") {
							$("#funcAdd", layero).removeAttr("disabled"); // 勾选复选框，增加name属性
						} else if ($(event.currentTarget).val() == "2") {
							$("#funcDel", layero).removeAttr("disabled"); 
						} else if ($(event.currentTarget).val() == "3") {
							$("#funcModify", layero).removeAttr("disabled"); 
						} else if ($(event.currentTarget).val() == "4") {
							$("#funcView", layero).removeAttr("disabled"); 
						} else if ($(event.currentTarget).val() == "5") {
							$("#funcImportExcel", layero).removeAttr("disabled"); 
						} else if ($(event.currentTarget).val() == "6") {
							$("#funcExportExcel", layero).removeAttr("disabled"); 
						} else if ($(event.currentTarget).val() == "7") {
							$("#funcRefresh", layero).removeAttr("disabled"); 
						}
					});
					$(".chooseFunc", layero).on('ifUnchecked', function(event) {
						if ($(event.currentTarget).val() == "1") {
							$("#funcAdd", layero).attr("disabled", "disabled"); // 取消复选框，去除name属性
						} else if ($(event.currentTarget).val() == "2") {
							$("#funcDel", layero).attr("disabled", "disabled");
						} else if ($(event.currentTarget).val() == "3") {
							$("#funcModify", layero).attr("disabled", "disabled");
						} else if ($(event.currentTarget).val() == "4") {
							$("#funcView", layero).attr("disabled", "disabled");
						} else if ($(event.currentTarget).val() == "5") {
							$("#funcImportExcel", layero).attr("disabled", "disabled");
						} else if ($(event.currentTarget).val() == "6") {
							$("#funcExportExcel", layero).attr("disabled", "disabled");
						} else if ($(event.currentTarget).val() == "7") {
							$("#funcRefresh", layero).attr("disabled", "disabled");
						}
					});
					$("form", layero).baothinkform($("#add_default_form")); // 渲染form表单

					// 当输入分类代码时触发事件
					$("#classifyCode", layero).keyup(function(event) {
						var classifyCode=$("#classifyCode", layero).val();
						// 分类代码文本框有值时，去除所有禁用的文本框和复选框，并自动填写每个文本框的前缀
						if (classifyCode) {
							$("#add_default_form", layero).find("input[type=checkbox]").iCheck('enable'); // 把所有的checkbox设置为启用
							$("#add_default_form", layero).find("input[type=checkbox]").iCheck('check'); // 把所有的checkbox设置为勾选
							$(".colInput input[type=text]", layero).val(function() {
								return classifyCode + $(this).data("default");
							});
							var str = "";
							var $allTextInput = $("input[type=text][id^=func]", layero);
							$.each($allTextInput, function(index, elment) {
								if (index > 0) {
									str = str + ",";
								}
								str = str + $(elment).val();
							});
							$allTextInput.removeAttr("disabled");
							$.ajax({
								type : "post",
								url : basePath + "sys/menufun/addFuncIsHas.htm",
								dataType : "json",
								data : {
									"menuCode" : mainSelectRows,
									"str" : str
								},
								success : function(data) {
									if (data.data.length > 0) {
										$.each(data.data, function(index, item) {
											var $input = $('input[type=text][data-default="'+item.replace(classifyCode,"")+'"]', layero);
											var $check = $input.parent().parent().find("input[type=checkbox]");
											$input.attr("disabled", "disabled");
											$check.iCheck('disable');
										});
									}
								}
							});
						} else { // 当分类代码文本框没有值时，恢复原来的状态
							$(".colInput", layero).find("input[type=text]").val(function() {
								return $(this).data("default");
							});
							$(".colInput", layero).find("input[type=text]").each(function() {
								if ($(this).data("flag") == "1") {
									$(this).parent().parent().find("input[type=checkbox]").iCheck('disable');
									$(this).attr("disabled", "disabled");
								}
							});
							$("form", layero).baothinkform($("#add_default_form"));
						}
					});
					
					// 当输入分类名称时触发事件
					$("#classifyName", layero).keyup(function(event){
						var classifyName=$("#classifyName", layero).val();
						$(".labelClass", layero).text(function() {
							return $(this).data("default") + classifyName;
						});
					});
				},
				btn : [ '确认', '关闭' ],
				yes : function(index, layero) {
					var classifyCodeFlag = $("#classifyCode", layero).val();
					var classifyNameFlag = $("#classifyName", layero).val();
					
					if(classifyCodeFlag && !classifyNameFlag){
						top.layer.alert('请填写分组名称！', {
							icon : 0,
							title : "提示"
						});
						return;
					}
					fromSubmit($("#add_default_form", layero), function(result) {
						top.layer.close(index);
						var data = JSON.parse(result);
						if (data.success == true) {
							top.layer.alert('保存成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						} else {
							top.layer.alert(data.errorMsg, {
								icon : 0,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						}
					}, true);
					$("#add_default_form", layero).submit();
				},
				btn2 : function(index) {
					top.layer.close(index);
				}
			});

		}

	} ];

	bt.config.toolbar.btnGroup = true;// 按钮是否组合,默认false
	bt.config.datatables.pageLength = 100; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'funcCode',
		title : '功能代码',
		width : '250px'
	}, {
		data : 'funcName',
		title : '功能名称',
		width : '250px'
	}, {
		data : 'validFlag',
		title : '是否启用',
		width : '150px',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "启用";
			} else {
				return "禁用";
			}
		}
	}, {
		data : 'notes',
		title : '描述'
	} ];

	bt.config.form = {

	};
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
	function fromSubmit(from, submifun, isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"funcCode" : {
					required : true,
					code : true
				},
				"funcName" : {
					required : true
				},
				"classifyCode" : {
					code : true
				}
			},
			messages : {
				"funcCode" : {
					required : "功能代码不允许为空",
					minlength : "功能代码不能超过10个字符"
				},
				"funcName" : {
					required : "功能名称不允许为空",
					minlength : "功能名称不能超过10个字符"
				}
			}
		};
		if (isAdd == true) {
			v.rules["funcCode"].remote = {
				url : basePath + "sys/menufun/judgeIsExists.htm?menuCode=" + bt.fn.getMainSelectRows().menuCode + "",
				type : "post",
				dataType : "json"
			};
			v.messages["funcCode"].remote = "功能代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
