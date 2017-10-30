$(function() {
	var bt = new baothink();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.visible.splitter = true; // 显示分隔条， 默认为false
	bt.config.tree.query = {// 点击搜索条件,格式{参数名:"节点属性（id或者text）"}
		controllerClass : "id",
	};

	// 重写初始化树的方法，增加图标
	bt.fn.initTree = function(callback) {
		var $jsTree = $("#jstree");
		tree = $jsTree.jstree({
			core : {
				animation : 0,
				multiple : false,
				check_callback : true,
				data : {
					url : basePath + 'log/configDescription/loadTree.json'
				}
			},
			// 更换节点图标，type参数在树加载时赋值
			types : {
				"controllerClass" : {
					"icon" : "iconfont icon-package",
					"valid_children" : [ "nodeClassName" ]
				},
				"nodeClassName" : {
					"icon" : "iconfont icon-JAVA",
					"valid_children" : []
				}
			},
			plugins : [ "search", "types" ]
		// 添加插件
		}).bind("loaded.jstree", function(e, result) {
			result.instance.open_all(); // 默认展开所有节点
		});
		$("#btn_refresh_tree").click(function() {
			$('#jstree').jstree(true).refresh();
		});
		$jsTree.on("changed.jstree", function(e, data) {
			bt.event.treeClick(data.node);
		});
		var to = false;
		$('#search_tree').keyup(function() {
			if (to) {
				clearTimeout(to);
			}
			to = setTimeout(function() {
				$('#jstree').jstree(true).search($('#search_tree').val());
			}, 250);
		});
	}
	bt.config.splitter.splitVertical.maxAsize = 900;
	bt.config.url.namespace = "/log/configDescription/";// url命名空间
	bt.config.toolbar.search = "类名/方法";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		controllerMapping : function() {
			return $("#search_controllerMapping").val();
		},
		controllerMethod : function() {
			return $("#search_controllerMethod").val();
		},
		controllerMethodMapping : function() {
			return $("#search_controllerMethodMapping").val();
		},
		isAdvice : function() {
			if ($('#search_isAdvice1').is(':checked')) {
				return "1";
			} else if ($('#search_isAdvice2').is(':checked')) {
				return "0";
			}
		},
		operDesc : function() {
			return $("#search_operDesc").val();
		}

	};

	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false

	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_modify",
		text : "配置",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('日志配置 ', [ '700px', '430px' ], $("#modify_data_div").html(), data, function(layero, index) {

				var controllerClass = $("#dataTable .selected td").eq(2).html();
				var controllerMethod = $("#dataTable .selected td").eq(3).html();
				var controllerMethodMapping = $("#dataTable .selected td").eq(4).html();
				$("#controllerClass", layero).val(controllerClass);
				$("#controllerMethod", layero).val(controllerMethod);
				$("#controllerMethodMapping", layero).val(controllerMethodMapping);

				$("#operDesc", layero).val(data.operDesc);
				$("#notes", layero).val(data.notes);
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							top.layer.close(index);
							$("#btn_refresh_tree").trigger('click');
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
		id : "btn_refresh",
		text : "刷新配置",
		icon : "fa-refresh",
		visible : true,
		disable : false,
		click : function(data) {
			top.layer.confirm('刷新配置可能需要耗费较长的时间，是否立即刷新？', {
				btn : [ '是', '否' ],
				title : "提示",
				icon : 3
			// 按钮
			}, function(index) {
				top.layer.close(index);
				var indexs = top.layer.msg('刷新中', {
					icon : 16,
					shade : 0.3,
					time : 0
				});
				$.ajax({
					type : 'POST',
					url : basePath + 'log/configDescription/refreshConfig.htm',
					dataType : "json",
					traditional : true,
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							top.layer.close(indexs);
							$("#btn_refresh_tree").trigger('click');
							bt.fn.reload(true);
						} else {
							top.layer.alert(data.errorMsg, {
								icon : 2,
								title : "刷新配置失败"
							});
						}
					},
				});
			}, function(index) {
				top.layer.close(index);
			});
		}
	} ];

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'controllerClass',
		title : '类名',
		render : function(data, type, row, meta) {
			return data.substring(data.lastIndexOf(".") + 1);
		}
	}, {
		data : 'controllerMethod',
		title : '方法',
		render : function(data, type, row, meta) {
			var displayData = "";
			var strs = data.substring(0, data.lastIndexOf("(")).split(" ");
			$.each(strs, function(i, str) {
				if (str.indexOf(".") >= 0) {
					displayData = displayData + str.substring(str.lastIndexOf(".") + 1);
				} else {
					displayData = displayData + str;
				}
				displayData += " ";
			});
			var str2 = data.substring(data.lastIndexOf("(") + 1, data.lastIndexOf(")"));
			str2 = str2.substring(str2.lastIndexOf(".") + 1);
			return displayData + "(" + str2 + ")";
		}
	}, {
		title : 'URL',
		render : function(data, type, row, meta) {
			var controllerMapping = row["controllerMapping"];
			var controllerMethodMapping = row["controllerMethodMapping"];
			if (controllerMapping.lastIndexOf("/") == controllerMapping.length || controllerMethodMapping.indexOf("/") == 0) {
				return (controllerMapping + controllerMethodMapping).replace("//", "/");
			} else {
				return controllerMapping + "/" + controllerMethodMapping;
			}

		}
	}, {
		data : 'isAdvice',
		title : '记录日志',
		className : "text-center",
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "否";
			} else if (data == "1") {
				return "是";
			}
		}
	}, {
		data : 'operDesc',
		title : '操作描述',
		width : '600px'
	}, {
		data : 'notes',
		title : '备注'
	} ];

	bt.config.tab.tabs = [ {
		id : "handleLog",
		title : "操作日志",
		url : "log/handle/log.html",
		query : [ {
			log009Id : "id"
		} ]
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
	function fromSubmit(from, submifun, isAdd) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {

			},
			messages : {

			}
		};
		return from.validate(v);
	}
});
