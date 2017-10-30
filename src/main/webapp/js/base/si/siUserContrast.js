$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/si/siUserContrast/";// url命名空间
	// 配置部件是否可见
	bt.config.toolbar.search = "接口代码/接口名称";// 右上角搜索框的提示语句
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
				top.layer.alert("请先选择接口账号", {
					icon : 0
				});
				return;
			}

			bt.fn.showAdd('新增数据 ', [ '850px', '480px' ], $("#add_data_div").html(), function(layero, index) {

				// 点击限制次数时显示类型和次数
				$("#limitFlag2", layero).on('ifChecked', function(event) {
					$(".hidelimit", layero).removeClass("hide");
				});
				$("#limitFlag1", layero).on('ifChecked', function(event) {
					$(".hidelimit", layero).addClass("hide");
				});

				// 点击间隔时间标识显示间隔时间
				$("#intervalFlag2", layero).on('ifChecked', function(event) {
					$(".hideinterval", layero).removeClass("hide");
				});
				$("#intervalFlag1", layero).on('ifChecked', function(event) {
					$(".hideinterval", layero).addClass("hide");
				});

				// 获取主表菜单代码
				var mainSelectRows = bt.fn.getMainSelectRows().siaccno;
				$("#siaccno", layero).val(mainSelectRows);

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
			bt.fn.showModify('修改数据 ', [ '880px', '570px' ], $("#modify_data_div").html(), data, function(layero, index) {

				// 获取主表菜单代码
				$("#siaccno", layero).val(data.siaccno);

				// 点击限制次数时显示类型和次数
				$("#limitFlag2", layero).on('ifChecked', function(event) {
					$(".hidelimit", layero).removeClass("hide");
				});
				$("#limitFlag1", layero).on('ifChecked', function(event) {
					$(".hidelimit", layero).addClass("hide");
				});
				if ($("#limitFlag1", layero).is(':checked')) {
					$(".hidelimit", layero).addClass("hide");
				} else {
					$(".hidelimit", layero).removeClass("hide");
				}

				// 点击间隔时间标识显示间隔时间
				$("#intervalFlag2", layero).on('ifChecked', function(event) {
					$(".hideinterval", layero).removeClass("hide");
				});
				$("#intervalFlag1", layero).on('ifChecked', function(event) {
					$(".hideinterval", layero).addClass("hide");
				});
				if ($("#intervalFlag1", layero).is(':checked')) {
					$(".hideinterval", layero).addClass("hide");
				} else {
					$(".hideinterval", layero).removeClass("hide");
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
			bt.fn.showView('查看数据 ', [ '750px', '500px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);

				if (data.limitFlag == "0") {
					$(".hidelimit", layero).addClass("hide");
				}

				if (data.intervalFlag == "10") {
					$(".hideinterval", layero).addClass("hide");
				}

				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "limitFlag":
							switch (value) {
							case "0":
								$input.text("不限制");
								break;
							case "1":
								$input.text("限制");
								break;
							}
							break;
						case "limitType":
							switch (value) {
							case "10":
								$input.text("每天");
								break;
							case "20":
								$input.text("小时");
								break;
							case "30":
								$input.text("分钟");
								break;
							case "":
								$input.text("");
								break;
							}
							break;
						case "intervalFlag":
							switch (value) {
							case "10":
								$input.text("不控制");
								break;
							case "20":
								$input.text("控制");
								break;
							}
							break;
						case "userFlag":
							switch (value) {
							case "0":
								$input.text("否");
								break;
							case "20":
								$input.text("是");
								break;
							}
							break;
						case "depoFlag":
							switch (value) {
							case "0":
								$input.text("否");
								break;
							case "20":
								$input.text("是");
								break;
							}
							break;
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

	bt.config.toolbar.btnGroup = true;// 按钮是否组合,默认false
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'sicode',
		title : '接口代码',
	}, {
		data : 'siname',
		title : '接口名称',
	}, {
		data : 'limitFlag',
		title : '限制次数',
	}, {
		data : 'limitType',
		title : '使用类型',
	}, {
		data : 'limitCount',
		title : '限制使用次数',

	}, {
		data : 'intervalFlag',
		title : '限制间隔时间',

	}, {
		data : 'timeInterval',
		title : '间隔时间（秒）',

	}, {
		data : 'validFlag',
		title : '是否启用',

	}, {
		data : 'notes',
		title : '备注',
		width : '200px',
	} ];

	// 如果选择的主表接口权限是全部接口，则禁用工具栏
	bt.event.mainDataTablesClick = function(tr, rowData) {
		if (tr != undefined) {
			var interfaceFlag = tr.interfaceFlag;
			if (interfaceFlag == "10") {
				$("#toolbar_btn").find("button").attr("disabled", "disabled");
			} else {
				$("#toolbar_btn").find("button").removeAttr("disabled");
			}
		}
	}

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "不限制";
			} else if (data == "1") {
				return "限制";
			}
		},
		targets : [ 5 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "每天";
			} else if (data == "20") {
				return "小时";
			} else if (data == "30") {
				return "分钟";
			} else {
				return "";
			}

		},
		targets : [ 6 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "不限制";
			} else if (data == "20") {
				return "限制";
			}
		},
		targets : [ 8 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "禁用";
			} else if (data == "1") {
				return "启用";
			}
		},
		targets : [ 10 ]
	} ];

	bt.config.form = {
		data : {
			limitType : {
				list : [ {
					id : '10',
					text : "每天"
				}, {
					id : '20',
					text : "小时"
				}, {
					id : '30',
					text : "分钟"
				} ]
			},
			sicode : {
				columns : [ {
					data : 'id',
					title : "接口账号",
					width : "80"
				}, {
					data : 'siname',
					title : "接口名称",
					width : "100"
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
	function fromSubmit(from, submifun, isAdd, siaccno) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"sicode" : {
					required : true,
					code : true
				},
				"siname" : {
					required : true
				},
				"limitCount" : {
					digits : true
				},
				"timeInterval" : {
					digits : true
				}
			},
			messages : {
				"sicode" : {

				}
			}
		};
		if (isAdd == true && siaccno != null && siaccno != "") {
			v.rules["sicode"].remote = {
				url : basePath + "si/siUserContrast/judgeIsExists.htm?siaccno=" + siaccno + "",
				type : "post",
				dataType : "json"
			};
			v.messages["sicode"].remote = "接口代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
