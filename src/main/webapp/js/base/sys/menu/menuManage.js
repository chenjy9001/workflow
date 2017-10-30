$(function() {
	var bt = new baothink();
	bt.config.id = "menuId";
	bt.config.pageType = '21';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/sys/menu/";// url命名空间
	bt.config.visible.splitter = true; // 显示分隔条， 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		parentMenuCode : "id"
	}
	bt.config.toolbar.search = "菜单代码/菜单名称/菜单地址";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		menuCode : function() {
			return $("#search_menuCode").val();
		},
		menuName : function() {
			return $("#search_menuName").val();
		},
		optionsInfo1 : function() {
			return $("#search_optionsInfo1").val();
		}
	};

	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			// 获取父菜单代码和名称
			var node = bt.fn.getSelectTreeNodes();
			if (node && node[0]) {
				if (node[0].parents.length >= 4) {
					top.layer.alert("对不起，最多只能添加三级菜单！", {
						icon : 0
					});
					return false;
				}
			}

			bt.fn.showAdd('新增菜单 ', [ '600px', '430px' ], $("#add_data_div").html(), function(layero, index) {
				
				// 菜单等级
				var node = bt.fn.getSelectTreeNodes();
				if(node.length == 0){
					$("#level", layero).val(1);
				}else{
					$("#level", layero).val(node[0].parents.length);
				}

				// 键盘松开时渲染图标，预览
				$("#imageFile", layero).keyup(function(data) {
					var src = data.currentTarget.value;
					$("#renderImg", layero).removeClass();
					$("#renderImg", layero).addClass("fa " + src);
				});
				// 获取父菜单代码和名称
				var node = bt.fn.getSelectTreeNodes();
				if (node && node[0]) {
					if (node[0].id == 0) {
						$('#parentMenuCode', layero).val();
					} else {
						$('#parentMenuName', layero).val(node[0].text);
						$('#parentMenuCode', layero).val(node[0].id);
					}
				} else {
					$('#parentMenuName', layero).val("菜单");
					$('#parentMenuCode', layero).val();
				}
				// 获取新的菜单代码
				$.ajax({
					type : 'POST',
					url : "getMaxMenuCodeAsync.htm",
					data : {
						"parentMenuCode" : $('#parentMenuCode', layero).val()
					},
					dataType : "json",
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							$('#menuCode', layero).val(data.data);
						}
					}
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
			bt.fn.showModify('修改菜单 ', [ '600px', '520px' ], $("#modify_data_div").html(), data, function(layero, index) {

				$("#renderImg", layero).removeClass();
				$("#renderImg", layero).addClass("fa " + data.imageFile);
				$("#level", layero).val(data.menuLevel);

				// 键盘松开时渲染图标，预览
				$("#imageFile", layero).keyup(function(data) {
					var src = data.currentTarget.value;
					$("#renderImg", layero).removeClass();
					$("#renderImg", layero).addClass("fa " + src);
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
			var flag = true;
			$.ajax({
				type : 'POST',
				url : 'getSubMenuById.htm',
				data : {
					"id" : ids[0]
				},
				dateType : 'json',
				async : false,
				success : function(data) {
					var jsonData = JSON.parse(data);
					if (jsonData.success == false) {
						top.layer.alert("该菜单下包含子菜单，请删除子菜单后再重新删除！", {
							icon : 0,
							title : "提示"
						});
						flag = false;
					}
				}
			});
			if (flag == true) {
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
		}
	}, {
		id : "btn_import",
	}, {
		id : "btn_export",
		fileName : "菜单"
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		click : function(data) {
			bt.fn.showView('查看菜单信息 ', [ '600px', '531px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#imageFile", layero).addClass("fa " + data.imageFile + "");
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
	} ];
	bt.config.datatables.pageLength = 50; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'menuId'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		width : "80px",
		data : 'menuCode',
		title : '菜单代码',
		className : "td_menuCode"
	}, {
		width : "100px",
		data : 'menuName',
		title : '菜单名称'
	}, {
		width : "80px",
		data : 'imageFile',
		title : '菜单图标',
		className : "text-center",
		render : function(data, type, row, meta) {
			return '<i class="fa ' + data + '"/>';
		}
	}, {
		data : 'optionsInfo1',
		title : '菜单地址'
	}, {
		width : "80px",
		data : 'validFlag',
		title : '是否启用',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "启用";
			} else {
				return "禁用";
			}
		}
	}, {
		width : "80px",
		data : 'orderno',
		title : '菜单排序',
		className : "text-center"
	} ];

	bt.config.tab.tabs = [ {
		id : "menuFuncTab",
		title : "菜单功能",
		url : "sys/menufun/manage.html",
		query : [ {
			menuCode : "menuCode"
		} ]
	} ];

	// 重写树点击事件，刷新子表数据
	bt.event.treeClick = function(node) {
		var selectTab = {};
		bt.fn.treeClickQuery(node);
		bt.fn.reloadSubTab(true);
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
				"menuCode" : {
					required : true,
					code : true
				},
				"menuName" : {
					required : true
				},
				"validFlag" : {
					required : true
				},
				"orderno" : {
					required : true,
					digits : true
				}

			},
			messages : {
				"menuCode" : {
					required : "菜单代码不允许为空",
					code : "请输入正确格式的菜单代码"
				},
				"menuName" : {
					required : "菜单名称不允许为空",
					minlength : "菜单名称不能超过10个字符"
				},
				"validFlag" : {
					required : "请选择是否有效"
				},
				"orderno" : {
					required : "排序不允许为空"
				}
			}
		};
		if (isAdd == true) {
			v.rules["menuCode"].remote = {
				url : basePath + "sys/menu/judgeIsExists.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["menuCode"].remote = "菜单代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
