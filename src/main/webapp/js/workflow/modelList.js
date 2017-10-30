$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/workflow/model/";
	bt.config.toolbar.search = "模板名称/key";// 右上角搜索框的提示语句
	bt.config.datatables.pageLength = 10; // 每页记录数，默认10
	bt.config.datatables.paging = true;// 是否分页，默认true
	/*bt.config.datatables.fixedParam = {
			keyword : function() {
			return keyword;
		}
	};*/
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq,  {
		data : 'id',
		title : 'ID'
	}, {
		data : 'key',
		title : 'Key'
	},  {
		data : 'name',
		title : 'Name'
	}, {
		data : 'version',
		title : 'Version',
	}, {
		data : 'metaInfo',
		title : '元数据',
	}, {
		data : 'createTime',
		title : '创建时间'
	}, {
		data : 'lastUpdateTime',
		title : '最后更新时间'
	}];
//	bt.config.datatables.columnDefs = [ {
//		render : function(data, type, row, meta) {
//			if (data == "10") {
//				return "文字";
//			} else if (data == "20") {
//				return "图片";
//			}else {
//				return "";
//			}
//		},
//		targets : [ 3 ]
//	} ];
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "创建模型",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.show('新增数据 ', [ '450px', '300px' ], $("#add_data_div").html(), function(layero, index) {
				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
							window.open(basePath + "modeler.html?modelId=" + result.data);
//							var $link = $("#createlink");
//							$link.attr("href", basePath + "/modeler.html?modelId=" + result.data);
//							$link.click();
					} else {
						top.layer.alert(result.errorMsg);
					}
				});
				
			},{
				btn : [ '保存', '取消' ],
				yes : function(index, layero) {
					var $form = $("#add_data_div");
					$form = $("#add_data_div").find("form");
					var formId = $form.attr("id");
					if (formId) {
						$form = layero.find("#" + formId);
						$form.attr("action", basePath + bt.config.url.namespace + "create");
						$form.submit();
					} else {
						throw new Error("没有找到form表单。");
					}
					
				},
				btn2 : function(index, layero) {
					top.layer.close(index);
				}
			});
		}
	}, {
		id : "modify_model",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function() {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要修改的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许修改1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			window.open(basePath + "modeler.html?modelId=" + ids[0]);  
		}
	}, {
		id : "delete_model",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要删除的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许删除1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			top.layer.confirm("您确认要删除该条数据？", {
				icon : 3,
				title : "提示"
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + bt.config.url.deleteAsync,
					data : {
						"id" : ids[0]
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							top.layer.alert("删除成功！", {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
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
		id : "deploy_model",
		text : "部署",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要部署的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许部署1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			top.layer.confirm("您确认要部署该流程？", {
				icon : 3,
				title : "提示"
			}, function(confirmI) {
				layer.close(confirmI);
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + "deploy.htm",
					data : {
						"modelId" : ids[0]
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							top.layer.alert("部署成功，部署ID="+data.data, {
								icon : 1,
								title : "提示"
							}, function(index, layero) {
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
		id : "export_bpmn",
		text : "导出BPMN",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要导出的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许导出1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			top.layer.confirm("您确认要导出该流程？", {
				icon : 3,
				title : "提示"
			}, function(index) {
				top.layer.close(index);
				var $link = $("#createlink");
				$link.attr("href", basePath + bt.config.url.namespace + "export/" + ids[0] + "/bpmn");
				document.getElementById("createlink").click();
			});
		}
	}, {
		id : "export_json",
		text : "导出json",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要导出的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许导出1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			top.layer.confirm("您确认要导出该流程？", {
				icon : 3,
				title : "提示"
			}, function(index) {
				top.layer.close(index);
				var $link = $("#createlink");
				$link.attr("href", basePath + bt.config.url.namespace + "export/" + ids[0] + "/json");
				document.getElementById("createlink").click();
			});
		}
	} ];

	// 初始化所有元素
	bt.fn.init(function() {

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
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"name" : {
					required : true
				},
				"key" : {
					required : true
				}
			},
			messages : {
				"name" : {
					required : "名称不允许为空"
				},
				"key" : {
					required : "Key不允许为空"
				}
			}
		};
		return from.validate(v);
	}

});
