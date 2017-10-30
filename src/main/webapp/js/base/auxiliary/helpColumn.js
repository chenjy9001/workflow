var typeCodeJS;
var typeNameJS;
var typeLeave;
$(function() {
	var bt = new baothink();
	bt.config.pageType = '11';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "iu/helpColumn/";// url命名空间
	bt.config.visible.splitter = true; // 默认为false
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			if(!typeLeave){parent.layer.alert("请选择左侧菜单树所需添加的栏目", {icon : 0,title : "提示"});
				return false;
			}else if(typeLeave == "3"){
				parent.layer.alert("对不起，最多只能添加三级栏目！", {icon : 0,title : "提示"});
				return false; 
			}
			bt.fn.showAdd('新增数据 ', [ '600px', '310px' ], $("#add_data_div").html(), function(layero, index) {
				if(typeLeave == "2"){
					//添加三级栏目
					$("#parentColumnCode",layero).val(typeCodeJS);
					$("#columnLevel",layero).val(3);
				}else if(typeLeave == "1"){
					//添加二级栏目 
					$("#columnLevel",layero).val(2);
				}
				$('#columnType1',layero).on('ifChecked', function(event){
					$("#addURL",layero).css("display","none");
				});
				$('#columnType2',layero).on('ifChecked', function(event){
					$("#addURL",layero).css("display","");
				});
				fromSubmit($("#add_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新树的数据
							$("#btn_refresh_tree").trigger('click');
							bt.fn.reload(true);
							parent.layer.close(index);
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
			bt.fn.showModify('修改数据 ', [ '600px', '400px' ], $("#modify_data_div").html(), data, function(layero, index) {
				$('#columnType1',layero).on('ifChecked', function(event){
					$("#addURL",layero).css("display","none");
				});
				$('#columnType2',layero).on('ifChecked', function(event){
					$("#addURL",layero).css("display","");
				});
				if(data && data.columnType == "10"){
					$("#addURL",layero).css("display","none");
				}
				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新树的数据
							$("#btn_refresh_tree").trigger('click');
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						parent.layer.alert(result.errorMsg, {
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
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '600px', '400px' ], $("#view_data_div").html(), data, function(layero, index) {
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "columnType":
							switch (value) {
							case "10":
								$input.text("富文本");
								$("#addURL",layero).css("display","none");
								break;
							case "20":
								$input.text("站内链接");
								break;
							}
							break;
						case "isShow":
							switch (value) {
							case "0":
								$input.text("隐藏");
								break;
							case "1":
								$input.text("显示");
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
	bt.config.toolbar.search = "栏目代码/栏目名称";// 右上角搜索框的提示语句
	bt.config.datatables.fixedParam = {// 固定默认查询条件
		userType : "10"
	}
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'columnCode',
		className : "text-center",
		title : '栏目代码'
	}, {
		data : 'columnName',
		className : "text-center",
		title : '栏目名称'
	}, {
		data : 'columnType',
		className : "text-center",
		title : '栏目类型',
		format : {
			10 : "富文本",
			20 : "站内链接",
			"" : "富文本"
		},
		exportIgnore : true
	}, {
		data : 'isShow',
		className : "text-center",
		title : '是否显示',
		format : {
			0 : "隐藏",
			1 : "显示",
			"" : "隐藏"
		},
		exportIgnore : true
	}];
	bt.config.form = {};
	// 行选中事件
	bt.event.rowClick = function(row) {
	}
	bt.config.datatables.paging = true;// 是否分页，默认true
	//点击左侧菜单树
	bt.event.treeClick = function(node){
		if(node){
			var value = {"id":node.id};
			typeCodeJS = node.id;
			typeLeave = node.parents.length;
			typeNameJS = node.text;
			$.extend(value, {
				isHasChildNode : (node.children.length > 0)
			});
		}
		bt.fn.clearMainSelectRows();
		bt.fn.search(true, value);
		if (bt.config.pageType == '21') {
			bt.fn.reloadSubTab(true);
		}
	}
	
	bt.fn.init(function(table) {
	});

	/**
	 * 表单提交，并且增加验证器
	 * 
	 * @param from
	 *            待提交的form表单（Jquery对象）
	 * @param submifun
	 *            提交成功事件
	 */
	function fromSubmit(from, submifun,isAdd, id) {
		var v = {
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"columnCode" : {
					required : true,
					maxlength : 20
				},
				"columnName" : {
					required : true,
					maxlength : 40
				},
				"url" : {
					url:true,
					maxlength:200
				},
				"sort" : {
					number:true,
					maxlength:11
				},
				"notes" : {
					maxlength:400
				}
			},
			messages : {
				"columnCode" : {
					required : "栏目代码不允许为空",
					maxlength : "不能超过20个字符"
				},
				"columnName" : {
					required : "栏目名称不允许为空",
					maxlength : "不能超过40个字符"
				},
				"url" : {
					url:"请输入有效的网址",
					maxlength : "不能超过200个字符"
				},
				"sort" : {
					number:"只能输入数字" ,
					maxlength : "不能超过11个字符"
				},
				"notes" : {
					maxlength : "不能超过400个字符"
				}
			}
		};
		if(isAdd == true){
				v.rules["columnCode"].remote = {
						url : basePath + "iu/helpColumn/checkCode.htm",
						type : "post",
						dataType : "json"
				};
				v.messages["columnCode"].remote = "栏目代码不允许重复";
		}
		return from.validate(v);
	}
});