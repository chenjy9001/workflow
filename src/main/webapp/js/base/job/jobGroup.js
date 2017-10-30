var bt;
$(function() {
	bt = new baothink();
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/job/group/";// url命名空间
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '600px' ], $("#add_data_div").html(), function(layero, index) {
				fromSubmit($("#add_data_form", layero), function(data) {
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(aindex, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(aindex);
							top.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
						top.layer.close(index);
					}
				});
			});
		}
	}, {
		id : "btn_modifys",
		text : "修改",
		icon : "fa-pencil",
		visible : true,
		disable : false,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要修改的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}

			bt.fn.show("修改数据", [ '650px' ], $("#modify_data_div").html(), function(layero, index) {
				var rows = bt.fn.getSelectRows();
				$("#id", layero).val($(rows)[0].id);
				$("#appName", layero).val($(rows)[0].appName);
				$("#title", layero).val($(rows)[0].title);
				$("#order", layero).val($(rows)[0].order);
				$("form", layero).baothinkform($("#modify_data_form", layero));
				fromSubmit($("#modify_data_form", layero), function(data) {
					var result = JSON.parse(data);
					if (result.success) {
						top.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(aindex, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(aindex);
							top.layer.close(index);
						});
					} else {
						top.layer.alert(result.errorMsg, {
							icon : 2,
							title : "提示"
						});
						top.layer.close(index);
					}
				});
			}, {
				btn : [ "确定", "取消" ],
				yes : function(index, layero) {
					var $form = $($("#modify_data_div").html());
					if (!$form) {
						$form = $($("#modify_data_div").html()).find("form");
					}
					var formId = $form.attr("id");
					if (formId) {
						$form = layero.find("#" + formId);
						$form.attr("action", basePath + bt.config.url.namespace + bt.config.url.modifyAsync);
						$form.submit();
					} else {
						throw new Error("没有找到form表单。");
					}
				}
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
				var obj = $("#" + ids);
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + bt.config.url.deleteAsync,
					data : {
						"id" : ids
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
	} ];
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
	bt.config.visible.searchbar = false;// 默认为true
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'appName',
		title : "AppName"
	}, {
		data : 'title',
		title : '名称'
	}, {
		data : 'order',
		title : '排序'
	}, {
		data : 'registryList',
		title : 'OnLine 机器',
		render : function(data, type, row, meta){
			return '<span class="badge bg-green" style="background-color: #00a65a !important; color: #fff;">'+data+'</span>';
		}
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
				"appName" : {
					required : true
				},
				"title" : {
					required : true
				},
				"order" : {
					required : true,
					range : [1, 127]
				}
			}
		});
	}
});
