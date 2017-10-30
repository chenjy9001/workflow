$(function() {
	var bt = new baothink();
	bt.config.pageType = '21';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/iu/keyValue/";// url命名空间
	bt.config.visible.splitter = true; // 显示分隔条， 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		classify : "id"
	}
	bt.config.toolbar.search = "值集类型代码/值集类型名称";// 右上角搜索框的提示语句

	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {

			bt.fn.showAdd('新增数据 ', [ '700px', '350px' ], $("#add_data_div").html(), function(layero, index) {

				// 获取父菜单代码和名称
				var node = bt.fn.getSelectTreeNodes();
				if (node && node[0]) {
					if (node[0].parents.length >= 3) {
						$("#classify", layero).val(node[0].parent);
						if (node[0].parent == "10") {
							$("#classifyName", layero).val("系统");
						} else {
							$("#classifyName", layero).val("业务");
						}
					} else {
						if (bt.fn.getSelectTreeNodes()[0].id == "10" || bt.fn.getSelectTreeNodes()[0].id == " ") {
							$("#classifyName", layero).val("系统");
							$("#classify", layero).val("10");

						} else if (bt.fn.getSelectTreeNodes()[0].id == "20") {
							$("#classifyName", layero).val("业务");
							$("#classify", layero).val("20");
						}
					}
				} else {
					$("#classifyName", layero).val("系统");
					$("#classify", layero).val("10");
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
			bt.fn.showModify('修改数据 ', [ '700px', '450px' ], $("#modify_data_div").html(), data, function(layero, index) {

				if ($("#classify", layero).val() == "10") {
					$("#classifyName", layero).val("系统");
				} else if ($("#classify", layero).val() == "20") {
					$("#classifyName", layero).val("业务");
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
			bt.fn.showView('查看数据 ', [ '700px', '400px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
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
		width : "80px",
		data : 'typeCode',
		title : '值集类型代码',
	}, {
		width : "80px",
		data : 'typeName',
		title : '值集类型名称'
	}, {
		width : "400px",
		data : 'notes',
		title : '备注'
	} ];

	bt.config.tab.tabs = [ {
		id : "keyValueSub",
		title : "值集",
		url : "iu/keyValueSub/keyValueSub.html",
		query : [ {
			typeCode : "typeCode"
		} ]
	} ];

	// 重写树点击事件，刷新子表数据
	bt.event.treeClick = function(node) {
		var selectTab = {};
		bt.fn.treeClickQuery(node);
		bt.fn.reloadSubTab(true);
	};

	bt.config.form = {
		data : {
			classify : {
				list : [ {
					id : '10',
					text : "系统"
				}, {
					id : '20',
					text : "业务"
				} ]
			},
			type : {
				list : [ {
					id : '0',
					text : "数据库"
				}, {
					id : '1',
					text : "生成js文件"
				}, {
					id : '2',
					text : "缓存"
				} ]
			}
		}
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
				"typeCode" : {
					required : true,
					code : true
				},
				"typeName" : {
					required : true
				},
				"type" : {
					required : true
				}
			},
			messages : {
				"typeCode" : {
					required : "值集类型代码不允许为空",
					code : "只能包括英文字母、数字和下划线"
				},
				"typeName" : {
					required : "值集类型名称不允许为空"
				},
				"type" : {
					required : "值集类型不允许为空"
				}
			}
		};
		if (isAdd == true) {
			v.rules["typeCode"].remote = {
				url : basePath + "iu/keyValue/judgeIsExists.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["typeCode"].remote = "值集类型代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
