$(function() {
	var bt = new baothink();
	// bt.config.id = "id" ; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	bt.config.pageType = '20';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "iu/userRole/";// url命名空间
	// bt.config.url.loadListByPage = "loadListByPage.htm";// 分页查询的url
	// bt.config.url.addAsync = "addAsync.htm";// 分页查询的url
	// bt.config.url.modifyAsync = "modifyAsync.htm";// 新增的url
	// bt.config.url.deleteAsync = "deleteAsync.htm";// 修改的url
	// bt.config.url.viewAsync = "viewAsync.htm";// 查看的url
	// 配置初始化的部件
	// bt.config.init.tree = false;// 默认为false
	// bt.config.init.toolbar = true; // 默认为true
	// bt.config.init.datatables = true; // 默认为true
	// bt.config.init.splitter = false; // 默认为false
	// 工具栏按钮配置
	// bt.config.toolbar.tag = $("#toolbar");// 配置承载toolbar的容器
	bt.config.url.loadListByPage = "getGorupsAsync.htm";
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '600px', '380px' ], $("#add_data_div").html(), function(layero, index) {
				
				
				fromSubmit($("#add_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('保存成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
							// 刷新数据源
							bt.fn.reload(true);
							parent.layer.close(index);
						});
					} else {
						parent.layer.alert(result.errorMsg, {
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
			bt.fn.showModify('修改数据 ', [ '600px', '450px' ], $("#modify_data_div").html(), data, function(layero, index) {
				
				

				fromSubmit($("#modify_data_form", layero), function(data) {
					parent.layer.close(index);
					var result = JSON.parse(data);
					if (result.success) {
						parent.layer.alert('修改成功！', {
							icon : 1,
							title : "提示"
						}, function(index, layero) {
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
		disable : false
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.showView('查看数据 ', [ '600px', '450px' ], $("#view_data_div").html(), data, function(layero, index) {
				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "empSex":
							switch (value) {
							case "0":
								$input.text("保密");
								break;
							case "1":
								$input.text("男");
								break;
							case "2":
								$input.text("女");
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
	// bt.config.toolbar.btnSize=2;//按钮大小(1：大按钮，2：小按钮，3：超小按钮),默认2
	// bt.config.toolbar.btnGroup=false;//按钮是否组合,默认false
	bt.config.toolbar.search = "账号/姓名/企业名称";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
			groupName : function() {
				return $("#search_groupName").val();
			}
	};
	// datatables配置
	// bt.config.datatables.tag = $("#dataTable");//配置承载datatable的容器
	// bt.config.datatables.pageLength = 10; //每页记录数，默认10
	// bt.config.datatables.paging = true;// 是否分页，默认true
	bt.config.datatables.scrollX = true;// 是否允许水平滚动，默认false
	// bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	// bt.config.datatables.multiSelect = false;// 是否允许选择多行，默认false
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'groupId'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'groupName',
		title : '角色名称',
		width : "100px",
		className : "text-center"
	}, {
		data : 'notes',
		title : '备注',
		width : "120px",
		className : "text-center"
	} ];
	bt.config.datatables.columnDefs = [];

	bt.config.tabs = [ {
		id : "subTab",
		title : "子表",
		url : "iu/userRole/toUserRoleSubPage.html",
		callback:function(){
			
		}
	} ];

	// 初始化所有元素
	bt.fn.init(function(table) {
		
		
		$("#toolbar").html("");
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
	/*function fromSubmit(from, submifun) {
		return from.validate({
			submitHandler : function(form) {
				$(form).ajaxSubmit(submifun);
				return false;
			},
			rules : {
				"empCode" : {
					required : true,
					maxlength : 30
				},
				"empName" : {
					required : true,
					maxlength : 10
				},
				"empPhone" : {
					required : true,
					mobile : true
				},
				"empSex" : {
					required : true
				}
			},
			messages : {
				"empCode" : {
					required : "账号不允许为空",
					minlength : "账号不能超过30个字符"
				},
				"empName" : {
					required : "姓名不允许为空",
					minlength : "姓名不能超过10个字符"
				},
				"empPhone" : {
					required : "电话号码不允许为空"
				},
				"empSex" : {
					required : "性别不允许为空"
				}
			}
		});
	}*/
});
