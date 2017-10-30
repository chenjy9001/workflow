$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/iu/keyValueSub/";// url命名空间
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

			if (bt.fn.getMainSelectRows().level == 1 || bt.fn.getMainSelectRows().level == 0) {
				top.layer.alert('一级菜单不能添加值集！', {
					icon : 0,
					title : "提示"
				});
				return;
			}

			bt.fn.showAdd('新增数据 ', [ '700px', '480px' ], $("#add_data_div").html(), function(layero, index) {

				// 获取主表菜单代码
				var mainSelectRows = bt.fn.getMainSelectRows().typeCode;
				$("#typeCode", layero).val(mainSelectRows);

				// 获取主表菜单名称
				var mainSelectRowsName = bt.fn.getMainSelectRows().typeName;
				$("#typeName", layero).val(mainSelectRowsName);

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
				}, true, mainSelectRows);
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
			bt.fn.showModify('修改数据 ', [ '700px', '580px' ], $("#modify_data_div").html(), data, function(layero, index) {

				// 获取主表菜单代码
				$("#typeCode", layero).val(data.typeCode);

				// 获取主表菜单名称
				if (bt.fn.getMainSelectRows() != undefined) {
					var mainSelectRowsName = bt.fn.getMainSelectRows().typeName;
					$("#typeName", layero).val(mainSelectRowsName);
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
			bt.fn.showView('查看数据 ', [ '650px', '590px' ], $("#view_data_div").html(), data, function(layero, index) {
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
		id : "btn_up",
		aid : "sub_btn_up",
		text : "上移",
		icon : "fa-level-up",
		visible : true,
		disable : false,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要移动的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			} else if (ids.length > 1) {
				var tip = data.tips && data.tips.selectMore ? data.tips.selectMore : "对不起，一次只能移动一行数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			
			var rowIndex = bt.config.datatables.tag.find("input[type=checkbox].trCheck:checked").attr("data-row");
			if(rowIndex == 0){
				return;
			}
			
			// 加载数据
			$.get(basePath + bt.config.url.namespace + bt.config.url.viewAsync, {
				"id" : ids[0]
			}, function(result, textStatus, jqXHR) {
				if (result.success) {
					$.ajax({
						type : 'POST',
						url : "changeOrderNo.htm",
						data : {
							"code" : result.data.code,
							"flag" : "up",
							"typeCode" : result.data.typeCode,
							"index" : rowIndex
						},
						dataType : "json",
						success : function(data, textStatus, jqXHR) {
							if (data.success) {
								// 刷新数据源
								bt.fn.reload(true);
							}
						}
					});
				} else {
					top.layer.alert(result.errorMsg, {
						icon : 0,
						title : "提示"
					});
					return;
				}
			}, "JSON");
		}
	}, {
		id : "btn_down",
		aid : "sub_btn_down",
		text : "下移",
		icon : "fa-level-down",
		visible : true,
		disable : false,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要移动的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			} else if (ids.length > 1) {
				var tip = data.tips && data.tips.selectMore ? data.tips.selectMore : "对不起，一次只能移动一行数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			
			var rowIndex = bt.config.datatables.tag.find("input[type=checkbox].trCheck:checked").attr("data-row");
			if($("#dataTable tbody tr").length == Number(rowIndex) + 1){
				return;
			}
			// 加载数据
			$.get(basePath + bt.config.url.namespace + bt.config.url.viewAsync, {
				"id" : ids[0]
			}, function(result, textStatus, jqXHR) {
				if (result.success) {
					$.ajax({
						type : 'POST',
						url : "changeOrderNo.htm",
						data : {
							"code" : result.data.code,
							"flag" : "down",
							"typeCode" : result.data.typeCode,
							"index" : rowIndex
						},
						dataType : "json",
						success : function(data, textStatus, jqXHR) {
							if (data.success) {
								// 刷新数据源
								bt.fn.reload(true);
							}
						}
					});
				} else {
					top.layer.alert(result.errorMsg, {
						icon : 0,
						title : "提示"
					});
					return;
				}
			}, "JSON");
		}
	} ];

	bt.config.toolbar.btnGroup = true;// 按钮是否组合,默认false
	bt.config.datatables.pageLength = 100; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, {
		visible : false,
		data : 'typeCode'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'code',
		title : '值集代码',
	}, {
		data : 'name',
		title : '值集名称',
	}, {
		data : 'data1',
		title : '值集扩展1',
	}, {
		data : 'data2',
		title : '值集扩展2',
	}, {
		data : 'data3',
		title : '值集扩展3',

	}, {
		data : 'notes',
		title : '备注',
		width : '400px',
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
	function fromSubmit(from, submifun, isAdd, typeCode) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"code" : {
					required : true,
				},
				"name" : {
					required : true
				}
			},
			messages : {
				"code" : {

				},
				"name" : {
					required : "值集名称不允许为空"
				}
			}
		};
		if (isAdd == true && typeCode != null && typeCode != "") {
			v.rules["code"].remote = {
				url : basePath + "iu/keyValueSub/judgeIsExists.htm?typeCode=" + typeCode + "",
				type : "post",
				dataType : "json"
			};
			v.messages["code"].remote = "值集代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
