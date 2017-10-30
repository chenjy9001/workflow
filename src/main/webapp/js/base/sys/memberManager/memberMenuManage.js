$(function() {
	var bt = new baothink();
	 bt.config.id = "id" ; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "mc/menu/";// url命名空间
	// bt.config.url.loadListByPage = "loadListByPage.htm";// 分页查询的url
	// bt.config.url.addAsync = "addAsync.htm";// 分页查询的url
	// bt.config.url.modifyAsync = "modifyAsync.htm";// 新增的url
	// bt.config.url.deleteAsync = "deleteAsync.htm";// 修改的url
	// bt.config.url.viewAsync = "viewAsync.htm";// 查看的url
	bt.config.url.loadTree = "loadTree.json";// 加载tree的url
	// 配置部件是否可见
	// bt.config.visible.toolbar = true; // 默认为true
	// bt.config.visible.searchbar=true;//默认为true
	// bt.config.visible.splitter = false; // 默认为false
	bt.config.visible.splitter = true; // 默认为false
	// tree配置
	bt.config.tree.tag = $("#jstree");//默认$("#jstree");
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		menuCode : "id"
	}
	// bt.config.toolbar.tag = $("#toolbar");// 配置承载toolbar的容器
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			var node=bt.fn.getSelectTreeNodes();
			// 获取父菜单代码和名称
			if (node && node[0]) {
				if (node[0].parents.length >= 4) {
					top.layer.alert("对不起，最多只能添加三级菜单！", {
						icon : 0
					});
					return false;
				}
			}
			bt.fn.showAdd('新增数据 ', [ '600px', '380px' ], $("#add_data_div").html(), function(layero, index) {
				//获取父菜单的信息
				if (node && node[0]) {
					if (node[0].id == 0) {
						$('#parentMenuCode', layero).val("");
					} else {
						$('#parentMenuName', layero).val(node[0].text);
						$('#parentMenuCode', layero).val(node[0].id);
					}
				} else {
					$('#parentMenuName', layero).val("菜单");
					$('#parentMenuCode', layero).val("");
				}
				
				
				// 键盘松开时渲染图标，预览
				$("#imageFile", layero).keyup(function(data) {
					var src = data.currentTarget.value;
					$("#renderImg", layero).removeClass();
					$("#renderImg", layero).addClass("fa " + src);
				});
				// 获取新的菜单代码
				$.ajax({
					type : 'POST',
					url : "getMaxMenuCodeAsync.htm",
					data : {
						"parentMenuCode" : $('#parentMenuCode', layero).val()
					},
					dataType : "json",
					success : function(data) {
						if (data.success) {
							$('#menuCode', layero).val(data.data);
						}
					}
				});
				
				fromSubmit($("#add_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert(result.data, {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							$("#btn_refresh_tree").trigger('click');
							bt.fn.reload(true);
							parent.layer.close(index);
							bt.fn.treeClickQuery(node);
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
			bt.fn.showModify('修改数据 ', [ '600px', '450px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$("#renderImg", layero).removeClass();
				$("#renderImg", layero).addClass("fa " + data.imageFile);
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
			var flag = true;
			$.ajax({
				type : 'POST',
				url : 'getSubMenuById.htm',
				data : {
					"ids" : ids.toString()
				},
				dateType : 'json',
				async : false,
				success : function(data) {
					var data = JSON.parse(data);
					if (data.data == "1") {
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
						success : function(data) {
							if (data.success) {
								top.layer.alert(data.data, {
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
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '600px', '450px' ], $("#view_data_div").html(), data, function(layero, index) {
				if($("#parentMenuName",layero).text() == "")
					$("#parentMenuName",layero).text("会员菜单");
				
				
					$("#renderImg", layero).removeClass();
					$("#renderImg", layero).addClass("fa " + data.imageFile);
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
	bt.config.toolbar.search = "菜单名称";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		menuCode1 : function() {
			return $("#search_menuCode").val();
		},
		menuName : function() {
			return $("#search_menuName").val();
		},
		optionsInfo1 : function() {
			return $("#search_optionsInfo1").val();
		}
	};
	// datatables配置
	 bt.config.datatables.tag = $("#dataTable");//配置承载datatable的容器
	// bt.config.datatables.pageLength = 10; // 每页记录数，默认10
	// bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	// bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	// bt.config.datatables.multiSelect = false;// 是否允许选择多行，默认false
	bt.config.datatables.fixedParam = {// 固定默认查询条件
		userType : "10"
	}
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq,  {
		width: "80px",
		data : 'menuCode',
		title : '菜单代码',
		className : "td_menuCode"
	}, {
		width: "80px",
		data : 'menuName',
		title : '菜单名称'
	}, {
		width: "350px",
		data : 'optionsInfo1',
		title : '菜单地址'
	}, {
		width : "80px",
		data : 'validFlag',
		title : '是否启用',
		className : "text-center"
	}, {
		width: "80px",
		data : 'orderno',
		title : '菜单排序',
		className : "text-center"
	}  ];
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "启用";
			} else {
				return "禁用";
			}
		},
		targets : [ 6 ]
	} ];
	// 行选中事件
	bt.event.rowClick = function(row) {
	}
	// tree选中事件，会覆盖默认的事件处理
	// bt.event.treeClick = function(node) { }
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
				url : basePath + "mc/menu/judgeIsExists.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["menuCode"].remote = "菜单代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
