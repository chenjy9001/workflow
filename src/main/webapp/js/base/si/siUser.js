$(function() {
	var bt = new baothink();
	bt.config.pageType = '20';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/si/siUser/";// url命名空间
	bt.config.toolbar.search = "接入账号/企业代码/企业名称";// 右上角搜索框的提示语句
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {

			bt.fn.showAdd('新增数据 ', [ '800px', '380px' ], $("#add_data_div").html(), function(layero, index) {

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
			bt.fn.showModify('修改数据 ', [ '800px', '420px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				fromSubmit($("#modify_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							var results = JSON.parse(data);
							var selectTab = {};
							selectTab.id = "siUserContrast";
							selectTab.baothink = $(window).attr("siUserContrast");
							var tabBaothink = selectTab.baothink;
							tabBaothink.event.mainDataTablesClick(results.data);
							
							if(results.data.interfaceFlag == "10"){
								$("#siUserContrast").find("#toolbar_btn").find("button").attr("disabled", "disabled");
							}else{
								$("#siUserContrast").find("#toolbar_btn").find("button").removeAttr("disabled");
							}
							
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
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(ids){
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
								var selectTab = {};
								selectTab.id = "siUserContrast";
								selectTab.baothink = $(window).attr("siUserContrast");
								var tabBaothink = selectTab.baothink;
								//刷新子表数据
								tabBaothink.fn.reload(true);
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
			bt.fn.showView('查看数据 ', [ '800px', '470px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "interfaceFlag":
							switch (value) {
							case "10":
								$input.text("全部接口");
								break;
							case "20":
								$input.text("限制接口");
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
						case "dataFlag":
							switch (value) {
							case "10":
								$input.text("全权限");
								break;
							case "20":
								$input.text("只拥有接入者自身数据权限");
								break;
							case "30":
								$input.text("按接口管控");
								break;
							}
							break;
						case "siType":
							switch (value) {
							case "10":
								$input.text("自营");
								break;
							case "20":
								$input.text("第三方");
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
		id : "btn_modifyPwd",
		text : "修改密码",
		icon : "fa-key",
		visible : true,
		disable : false,
		click : function(data){
			if (bt.fn.getSelectRows().length == 0) {
				top.layer.alert("请选择您要修改的数据", {
					icon : 0
				});
				return;
			}
			bt.fn.show("修改密码", [ '500px', '220px' ], $("#modifyPwd_div").html(), function(layero, index) {
				
			}, {
				btn : [ "确定", "取消" ],
				yes : function(index, layero) {
					var obj = bt.fn.getSelectRows();
					var siaccno = null;
					if(obj != undefined){
						siaccno = obj[0].siaccno;
						$("#siaccno", layero).val(siaccno);
					}else{
						return;
					}
					
					fromSubmit($("#modifyPwd_form", layero), function(data) {
						top.layer.close(index);
						var result = JSON.parse(data);
						if (result.success == true) {
							top.layer.alert('修改密码成功！', {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						} else {
							top.layer.alert(result.errorMsg, {
								icon : 0,
								title : "提示"
							}, function(index, layero) {
								// 刷新数据源
								bt.fn.reload(true);
								top.layer.close(index);
							});
						}
					});
					$("#modifyPwd_form", layero).submit();
				}
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
		data : 'siaccno',
		title : '接入账号',
	}, {
		width : "100px",
		data : 'siType',
		title : '账号类型'
	}, {
		width : "100px",
		data : 'entCode',
		title : '接入方企业代码'
	}, {
		width : "100px",
		data : 'entName',
		title : '接入方企业名称'
	}, {
		width : "100px",
		data : 'interfaceFlag',
		title : '接口权限标识'
	}, {
		width : "80px",
		data : 'validFlag',
		title : '是否启用'
	}, {
		width : "150px",
		data : 'notes',
		title : '备注'
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "自营";
			} else if (data == "20") {
				return "第三方";
			}
		},
		targets : [ 4 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "全部接口";
			} else {
				return "限制接口";
			}
		},
		targets : [ 7 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "禁用";
			} else if (data == "1") {
				return "启用";
			}
		},
		targets : [ 8 ]
	} ];
	
	bt.config.tab.tabs = [ {
		id : "siUserContrast",
		title : "接口权限",
		url : "si/siUserContrast/manage.html",
		query : [ {
			siaccno : "siaccno"
		} ]
	} ];

	bt.config.form = {
		data : {
			siType : {
				list : [ {
					id : '10',
					text : "自营"
				}, {
					id : '20',
					text : "第三方"
				} ]
			},
			interfaceFlag : {
				list : [ {
					id : '10',
					text : "全部接口"
				}, {
					id : '20',
					text : "限制接口"
				} ]
			},
			dataFlag : {
				list : [ {
					id : '10',
					text : "全权限"
				}, {
					id : '20',
					text : "只拥有接入者自身数据权限"
				}, {
					id : '30',
					text : "按接口管控"
				} ]
			},
			entCode : {
				columns : [ {
					data : 'id',
					title : "企业代码",
					width : "80"
				}, {
					data : 'entName',
					title : "企业名称",
					width : "300"
				}, {
					data : 'entShortName',
					title : "企业简称",
					width : "300"
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
				"siaccno" : {
					required : true,
					code : true
				},
				"sipwd" : {
					required : true,
					code : true
				},
				"siType" : {
					required : true
				},
				"entCode" : {
					required : true
				},
				"interfaceFlag" : {
					required : true
				},
				"validFlag" : {
					required : true
				},
				"comfPwd" : {
					required : true,
					equalTo : "#sipwd"
				}
			},
			messages : {
				"siaccno" : {
					code : "只能包括英文字母、数字和下划线"
				},
				"sipwd" : {
					code : "值集类型名称不允许为空"
				}
			}
		};
		if (isAdd == true) {
			v.rules["siaccno"].remote = {
				url : basePath + "si/siUser/judgeIsExists.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["siaccno"].remote = "接入账号不允许重复，请重新输入";
		}
		return from.validate(v);
	}
});
