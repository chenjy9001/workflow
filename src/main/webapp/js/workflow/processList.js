$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "workflow/process/";
	bt.config.toolbar.search = "工作流名称/key";// 右上角搜索框的提示语句
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
	},{
		data : 'deploymentId',
		title : '部署ID'
	}, {
		data : 'key',
		title : 'Key'
	},  {
		data : 'name',
		title : 'Name'
	}, {
		data : 'version',
		title : 'Version',
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
		id : "view_img",
		text : "查看流程图片",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要查看的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许查看1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				
				return;
			}
			$("#createlink").attr('href', basePath + bt.config.url.namespace + "/resource/read?resourceType=image&processDefinitionId=" + ids[0]);
			document.getElementById('createlink').click();
			
			}
	}, {
		id : "view_bpmn",
		text : "查看资源文件",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function() {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要查看的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许查看1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			$("#createlink").attr('href', basePath + bt.config.url.namespace + "/resource/read?resourceType=xml&processDefinitionId=" + ids[0]);
			document.getElementById('createlink').click(); 
		}
	
	},{
		id : "delete_process",
		text : "强制删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var rows = bt.fn.getSelectRows();
			if (rows.length == 0) {
				var tip = "请选择您要删除的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			var ids = [];
			for(var i = 0;i<rows.length;i++){
				ids.push(rows[i].deploymentId);
			}
			top.layer.confirm("您确认要删除这些数据？", {
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
	} ,{
		id : "delete_unused",
		text : "删除",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var rows = bt.fn.getSelectRows();
			if (rows.length == 0) {
				var tip = "请选择您要删除的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			var ids = [];
			for(var i = 0;i<rows.length;i++){
				ids.push(rows[i].deploymentId);
			}
			top.layer.confirm("您确认要删除这些数据？", {
				icon : 3,
				title : "提示"
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + "deleteUnused.htm",
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
	}];

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
