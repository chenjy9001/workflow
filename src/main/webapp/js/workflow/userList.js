var bt = new baothink();
$(function() {
	bt.config.url.namespace = "workflow/user/";
	bt.config.toolbar.search = "用户id/用户名";// 右上角搜索框的提示语句
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
		data : 'lastName',
		title : '姓氏'
	}, {
		data : 'firstName',
		title : '名字'
	},   {
		data : 'email',
		title : '电子邮箱',
	}, {
		title : '操作',
		className : 'text-center',
		render : function(data){
			var html = '';
			html += '<a class="btn btn-primary btn-xs" data-type="true" onclick="addGroup(this)">';
			html += '关联群组';
			html += '</a>';
			return html;
		}
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
	bt.config.toolbar.btn = [{
		id : "btn_add",
		text : "新增用户",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function(){
			bt.fn.show('新增数据 ', [ '450px', '300px' ], $("#add_data_div").html(), function(layero, index) {
				fromSubmit($("#add_data_form", layero), function(data) {
					top.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
							// 刷新数据源
							bt.fn.reload(true);
							top.layer.close(index);
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
						$form.attr("action", basePath + bt.config.url.namespace + "createUser.htm");
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
		id : "delete_user",
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
					url : basePath + bt.config.url.namespace + "deleteUser.htm",
					data : {
						"userId" : ids[0]
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
	}  ];

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
				"id" : {
					required : true
				},
				"firstName" : {
					required : true
				},
				"lastName" : {
					required : true
				}
			},
			messages : {
				"id" : {
					required : "id不允许为空"
				},
				"firstName" : {
					required : "名字不允许为空"
				},
				"lastName" : {
					required : "姓氏不允许为空"
				}
			}
		};
		return from.validate(v);
	}
	

});

//关联群组
function addGroup(data){
	var userId = $(data).parent().parent().find("td:first").find("input[type=checkbox]").attr("value");
	bt.fn.show("关联用户查看", [ '1000px', '600px' ], $("#view_group_div").html(), function(layero, index) {
		var bk = new baothink(layero);
		bk.config.url.namespace = "workflow/user/";
		bk.config.url.loadListByPage = "groupList.htm";
		bk.config.toolbar.search = "群组";// 右上角搜索框的提示语句
		bk.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
		bk.config.datatables.tag = $("#dataTable1", layero);
		bk.config.visible.toolbar = true; // 默认为true
		bk.config.toolbar.tag = $("#toolbar", layero);// 配置承载toolbar的容器

		bk.config.datatables.pageLength = 100; // 每页记录数，默认10
		bk.config.datatables.paging = false;// 是否分页，默认true
		bk.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
			visible : false,
			data : 'id'
		}, bk.datatables.columns.cs, bk.datatables.columns.seq, {
			data : 'id',
			title : 'ID'
		}, {
			data : 'name',
			title : '群组名'
		}, {
			data : 'type',
			title : '群组类型'
		} ];

		// 初始化所有元素
		bk.fn.init(function() {
			//默认勾选已保存的角色
			$.ajax({
				type : 'post',
				url : basePath + 'workflow/user/selectedGroup.htm',
				dataType : 'json',
				async : false,
				data : {
					userId : userId
				},
				success : function(data) {
					var allGroup = $("input[name = iCheck]", layero);
					for (var i = 0; i < data.data.length; i++) {
						$("input[name = iCheck]", layero).each(function() {
							if(data.data[i].id == $(this).val()){
								$(this).iCheck('check');
							}
						});
					}
				}
		});
	});
	}, {
		btn : [ "保存","关闭" ],
		yes : function(index, layero) {
			var str = '';
			$("input[name='iCheck']:checkbox", layero).each(function(){
				if(true == $(this).is(":checked")){
					str += $(this).val() + ",";
				}
			});
			str = str.substring(0, str.length-1);
			$.ajax({
				type : 'post',
				url : basePath + 'workflow/user/addGroup.htm',
				dataType : 'json',
				async : false,
				data : {
					userId : userId,
					str : str
				},
				success : function(data) {
					if(data.success){
						top.layer.alert("关联成功！", {
							icon : 1,
							title : "提示"
						});
						top.layer.close(index);
					}else{
						top.layer.alert(data.errorMsg, {
							icon : 2,
							title : "提示"
						});
					}
				}
			});
		},
		btn2 : function(index, layero){
			top.layer.close(index);
		}
	});
}
