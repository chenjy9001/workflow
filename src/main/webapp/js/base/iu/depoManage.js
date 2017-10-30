$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/iu/depo/";// url命名空间
	bt.config.toolbar.search = "仓库代码/仓库名称";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		depoId : function() {
			return $("#search_depoId").val();
		},
		depoName : function() {
			return $("#search_depoName").val();
		},
		districtid : function(){
			return $("#search_districtid").val();
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

			bt.fn.showAdd('新增数据 ', [ '650px', '430px' ], $("#add_data_div").html(), function(layero, index) {

				// 获取仓库编号
				$.ajax({
					type : 'POST',
					url : basePath + 'iu/depo/toAdd.htm',
					dataType : "json",
					success : function(data) {
						if (data.success == true && data.data != null) {
							$("#depoId", layero).val(data.data);
						} else {
							top.layer.alert("获取仓库编号失败", {
								icon : 0,
								title : "提示"
							});
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
				});
			});
		}
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showModify('修改数据 ', [ '700px', '520px' ], $("#modify_data_div").html(), data, function(layero, index) {

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
			bt.fn.showView('查看数据 ', [ '700px', '530px' ], $("#view_data_div").html(), data, function(layero, index) {
				$("#depoIntr", layero).val(data.depoIntr);
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
						case "isOut":
							switch (value) {
							case "0":
								$input.text("否");
								break;
							case "1":
								$input.text("是");
								break;
							}
							break;
						case "oftenUseFlag":
							switch (value) {
							case "10":
								$input.text("常用");
								break;
							case "20":
								$input.text("不常用");
								break;
							}
							break;
						case "depoCapa":
							switch (value) {
							case null:
								$input.text("0");
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

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'depoId',
		title : '仓库代码'
	}, {
		data : 'depoName',
		title : '仓库名称'
	}, {
		title : '仓库容量(吨)',
		data : 'depoCapa',
	}, {
		data : 'linkUserName',
		title : '联系人',
	}, {
		data : 'linkPhone',
		title : '联系电话',
	}, {
		data : 'isOut',
		title : '是否外仓',
		className : "text-center"
	}, {
		data : 'districtname',
		title : '所在地区'
	}, {
		data : 'validFlag',
		title : '是否启用',
		className : "text-center"
	}, {
		data : 'oftenUseFlag',
		title : '常用标记',
		className : "text-center"
	} ];
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "是";
			} else {
				return "否";
			}
		},
		targets : [ 8 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "启用";
			} else {
				return "禁用";
			}
		},
		targets : [ 10 ]
	}, {
		render : function(data, type, row, meta) {
			if (data == "10") {
				return "常用";
			} else {
				return "不常用";
			}
		},
		targets : [ 11 ]
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
	function fromSubmit(from, submifun) {
		return from.validate({
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"depoId" : {
					required : true
				},
				"depoName" : {
					required : true
				},
				"depoCapa" : {
					number : true,
					range : [ 1, 9999999999 ]
				},
				"linkPhone" : {
					phone : true
				}
			},
			messages : {
				"depoId" : {
					required : "请输入仓库代码"
				},
				"depoName" : {
					required : "请输入仓库名称"
				}
			}
		});
	}
});