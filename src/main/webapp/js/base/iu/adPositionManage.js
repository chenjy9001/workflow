var minCount = 0;
$(function() {
	var bt = new baothink();
	bt.config.pageType = '20';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/iu/adPosition/";// url命名空间
	bt.config.toolbar.search = "广告位代码/广告位名称";// 右上角搜索框的提示语句
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {

			bt.fn.showAdd('新增广告位 ', [ '700px', '360px' ], $("#add_data_div").html(), function(layero, index) {

				// 获取广告位代码
				$.ajax({
					type : 'POST',
					url : basePath + 'iu/adPosition/toAdd.htm',
					dataType : "json",
					success : function(data) {
						if (data.success == true && data.data != null) {
							$("#adsCode", layero).val(data.data);
						} else {
							top.layer.alert("获取广告位代码失败", {
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
			bt.fn.showModify('修改广告位 ', [ '700px', '450px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$("#notes", layero).val(data.notes);
				
				minCount = $("#adMaterial").contents().find("#dataTable tbody tr").length;
				if(data.adCount == 0){
					minCount = 0;
				}
				
				$("#adCount", layero).keyup(function(event){
					if($(this).val() == 0){
						$("#adCount", layero).rules("remove", "min");
					}else{
						$("#adCount", layero).rules("add", {min:minCount});
					}
				});
				
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
								// 刷新数据源
								bt.fn.reload(true);
								bt.fn.reloadSubTab(true);
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
			bt.fn.showView('查看广告位详细信息 ', [ '700px', '460px' ], $("#view_data_div").html(), data, function(layero, index) {
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
	} ];
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'adsCode',
		title : '广告位代码',
	}, {
		data : 'adsName',
		title : '广告位名称'
	}, {
		data : 'adsWidth',
		title : '广告位宽度(px)'
	}, {
		data : 'adsHeight',
		title : '广告位高度(px)'
	}, {
		data : 'adCount',
		title : '广告个数'
	}, {
		data : 'validFlag',
		title : '是否启用',
		className : "text-center"
	}, {
		data : 'notes',
		title : '备注'
	} ];
	
	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "1") {
				return "启用";
			} else if (data == "0") {
				return "禁用";
			}
		},
		targets : [ 8 ]
	} ];

	bt.config.tab.tabs = [ {
		id : "adMaterial",
		title : "广告物料",
		url : "iu/adMaterial/manage.html",
		query : [ {
			adsCode : "adsCode"
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
				"adsCode" : {
					required : true
				},
				"adsName" : {
					required : true
				},
				"adsWidth" : {
					required : true,
					digits : true
				},
				"adsHeight" : {
					required : true,
					digits : true
				},
				"adCount" : {
					required : true,
					digits : true,
					min : minCount
				}
			},
			messages : {
				"adCount" : {
					min : "不可小于已有的广告物料个数"
				}
			}
		};
		return from.validate(v);
	}
});
