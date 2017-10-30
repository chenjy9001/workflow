$(function() {
	// 模块代码
	var moudleCodeValue = "";
	// 参数代码
	var paramCodeValue = "";
	// 参数类型
	var paramTypeValue = "";
	var isSetValue = false;
	var bt = new baothink();
	// bt.config.id = "id" ; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/dev/parameter/";// url命名空间
	bt.config.visible.splitter = true; // 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		paramMoudle : "text",
		paramType : "id"
	}
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			var SelectTree = bt.fn.getSelectTreeNodes();
			if (SelectTree.length == 1) {// 选中树的任意位置
				bt.fn.showAdd('新增数据 ', [ '600px' ], $("#add_data_div").html(), function(layero, index) {
					addSelectValue(layero);
					fromSubmit($("#add_data_form", layero), function(data) {
						parent.layer.close(index);
						var result = JSON.parse(data);
						if (result.success) {
							parent.layer.alert('保存成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								$("#btn_refresh_tree").trigger('click');
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
					}, true, layero);

				});
			} else {
				var tip = "请选着一个参数类型再进行新增操作!";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
			}
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '600px' ], $("#modify_data_div").html(), data, function(layero, index) {
				if (data.paramType == "10") {
					$(layero).find("input[name=paramTypeValue]").val("系统");
				}
				if (data.paramType == "20") {
					$(layero).find("input[name=paramTypeValue]").val("业务");
				}
				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							$("#btn_refresh_tree").trigger('click');
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
				}, false, layero);
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
			bt.fn.showView('查看数据 ', [ '600px' ], $("#view_data_div").html(), data, function(layero, index) {
				var $inputparamType = $(layero).find("span[name=paramType]");
				if (data.paramType == "10") {
					$inputparamType.text("系统");
				}
				if (data.paramType == "20") {
					$inputparamType.text("业务");
				}
				$(layero).find("span[name=notes]").text(data.notes);
			});
		}
	}, {
		id : "btn_refresh",
		text : "刷新",
		icon : "fa-refresh",
		visible : false,
		disable : false,
		click : function() {
			bt.fn.reload(true);
		}
	}, {
		id : "btn_up",
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
			if (rowIndex == 0) {
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
							"id" : result.data.id,
							"flag" : "up",
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
					top.layer.alert("上移失败，请检查是否有维护排序字段！", {
						icon : 0,
						title : "提示"
					});
					return;
				}
			}, "JSON");
		}
	}, {
		id : "btn_down",
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
			if ($("#dataTable tbody tr").length == Number(rowIndex) + 1) {
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
							"id" : result.data.id,
							"flag" : "down",
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
					top.layer.alert("下移失败，请检查是否有维护排序字段！", {
						icon : 0,
						title : "提示"
					});
					return;
				}
			}, "JSON");
		}
	} ];
	bt.config.toolbar.search = "参数代码/参数名称/参数值";// 右上角搜索框的提示语句
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		title : "模块代码",
		data : 'moudleCode',
		width : '100px',
		className : "text-center"
	}, {
		title : "模块名称",
		data : 'moudleName',
		width : '130px',
		className : "text-center"
	}, {
		title : "参数代码",
		data : 'paramCode',
		width : '80px',
		className : "text-center"
	}, {
		title : "参数名称",
		data : 'paramName',
		width : '130px',
		className : "text-center"
	}, {
		title : "参数值",
		data : 'paramValue',
		width : '130px',
		className : "text-center"
	}, {
		title : "描述",
		data : 'notes',
		width : '130px',
		className : "text-center"
	} ];
	bt.config.formFillData = {
		related : [ {
			list : [ {
				id : '10',
				text : "企业会员"
			}, {
				id : '20',
				text : "个人会员"
			} ],
			"key" : "userType"
		} ]
	};
	// 初始化所有元素
	bt.fn.init(function(table) {

	});

	/**
	 * 重写树的点击事件 创建人: 梁涛洽 创建时间:2016年10月31日15:22:21
	 */
	bt.event.treeClick = function(node) {
		// 点击树的参数
		var treeQuery = bt.config.tree.query;
		if (node && treeQuery) {
			var value = {};
			// param(参数的名字)val(id或者text)
			$.each(treeQuery, function(param, val) {
				if (node.parent == "#") {// 点击20或者10
					if (param == "paramType") {// 精确查找
						value[param] = node['id'];
					} else if (param == "paramMoudle") {
						value[param] = "";
					}
					/*
					 * if (param == "paramType") {//不查找 value[param] = "-"; }
					 * else if (param == "paramMoudle") { value[param] = ""; }
					 */
				} else if (node.parent == "10" || node.parent == "20") {// 点击20下面或者10下面的
					if (param == "paramType") {
						value[param] = node['parent'];
					} else if (param == "paramMoudle") {
						value[param] = node['id'];
					}
				}
			});
			$.extend(value, {
				isHasChildNode : (node.children.length > 0)
			});
			bt.fn.search(true, value);
		}
	}

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 * @param addWords
	 */
	function fromSubmit(from, submifun, isAdd, layero) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"paramType" : {
					required : true,
					maxlength : 2
				},
				"moudleCode" : {
					required : true,
					maxlength : 20,
					code : true,
					value : function(data) {
						moudleCodeValue = $(data).val();
					}
				},
				"moudleName" : {
					required : true,
					maxlength : 40
				},
				"paramCode" : {
					required : true,
					maxlength : 20,
					value : function(data) {
						paramCodeValue = $(data).val();
					}
				},
				"paramName" : {
					required : true,
					maxlength : 40
				},
				"paramValue" : {
					maxlength : 200
				},
				"notes" : {
					maxlength : 400
				}
			},
			messages : {
				"paramType" : {
					required : "请输入参数类型",
					maxlength : "参数类型不能超过2个字符"
				},
				"moudleCode" : {
					required : "模块代码不能为空",
					maxlength : "模块分类不能超过20个字符",
					code : "只能包括英文字母、数字和下划线"
				},
				"moudleName" : {
					required : "模块名称不能为空",
					maxlength : "模块分类不能超过40个字符"
				},
				"paramCode" : {
					required : "参数代码不能为空",
					maxlength : "参数代码不能超过20个字符",
				},
				"paramName" : {
					required : "参数名称不能为空",
					maxlength : "参数名称不能超过40个字符"
				},
				"paramValue" : {
					maxlength : "参数值不能超过200个字符"
				},
				"notes" : {
					maxlength : "参数描述不能超过400个字符"
				}
			}
		};
		if (isAdd == true) {// 同一模块分类下不能有重复的参数代码
			v.rules["paramCode"].remote = {
				url : basePath + "dev/parameter/paramCodeIsExists.htm",
				type : "post",
				dataType : "json",
				data : {
					moudleCode : function() {
						if (moudleCodeValue.indexOf("10_") > -1 || moudleCodeValue.indexOf("20_") > -1) {// 找到
							return moudleCodeValue.substring(3, moudleCodeValue.length);
						}
						return moudleCodeValue;
					}
				}
			};
			v.messages["paramCode"].remote = "同一模块下参数代码不允许重复，请重新录入";

			// 手动输入需要验证, 自动填充不需要验证
			if (!isSetValue) {
				v.rules["moudleCode"].remote = {
					url : basePath + "dev/parameter/moudleCodeIsExists.htm",
					type : "post",
					dataType : "json"/*
										 * , data : { paramType : function() {
										 * return paramTypeValue; } }
										 */
				};
				v.messages["moudleCode"].remote = "此模块代码已被占用，请重新录入";
			}
		}
		return from.validate(v);
	}
	/**
	 * 选中树的业务或者系统时,点击添加按钮,下拉选默认选中对应的值,如果选中 点中的是业务或系统下的子项,点击添加按钮,自动填写模块代码和模块名称
	 * 创建人:梁涛洽 创建时间:2016年10月28日09:27:31
	 */
	function addSelectValue(layero) {
		var SelectTree = bt.fn.getSelectTreeNodes();
		if (SelectTree[0] != undefined) {// 选中树的任意位置
			// 选中的值不是10和20,则获取上一级的值
			if (SelectTree[0].id == "10" || SelectTree[0].id == "20") {
				// 用于模块代码的验证
				paramTypeValue = SelectTree[0].id;
				setValueForParamTypeText(layero, SelectTree[0].id);
				isSetValue = false;
			} else {
				setValueForParamTypeText(layero, SelectTree[0].parent);
				setValueForMoudleCodAndMoudleNameText(layero, SelectTree[0].id, SelectTree[0].text);
				isSetValue = true;
			}
		}
	}

	/**
	 * 点中树的位置,默认填写参数类型的的值(ParamType参数类型) ,并且设置为只读 创建人:梁涛洽
	 * 创建时间:2016年10月31日09:57:38
	 */
	function setValueForParamTypeText(layero, str) {
		if (str == "10") {
			$(layero).find('input[name=paramType]').val("10");
			$(layero).find('input[name=paramTypeValue]').val("系统").attr("readonly", "true");
		} else if (str == "20") {
			$(layero).find('input[name=paramType]').val("20");
			$(layero).find('input[name=paramTypeValue]').val("业务").attr("readonly", "true");
		}
	}

	/**
	 * 点中树的位置,自动填写模块代码和模块名称的值(moudleCod模块代码,moudleName模块名称) 并且改为只读 创建人:梁涛洽
	 * 创建时间:2016年10月31日09:57:38
	 */
	function setValueForMoudleCodAndMoudleNameText(layero, moudleCod, moudleName) {
		$(layero).find("input[name=moudleCode]").val(moudleCod.substring(3, moudleCod.length));
		$(layero).find("input[name=moudleCode]").attr("readonly", "true");
		$(layero).find("input[name=moudleName]").val(moudleName);
		$(layero).find("input[name=moudleName]").attr("readonly", "true");
		moudleCodeValue = moudleCod;
	}
});
