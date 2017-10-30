$(function() {
	var bt = new baothink();
	bt.config.id = "ptId"; // 配置行的唯一标示，对应bt.config.datatabls.columns里面的data属性
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/sys/platformInfo/";// url命名空间
	bt.config.toolbar.search = "平台ID/平台名称";// 右上角搜索框的提示语句
	bt.config.datatables.pageLength = 100; // 每页记录数，默认10
	bt.config.datatables.paging = false;// 是否分页，默认true
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '600px', '300px' ], $("#add_data_div").html(), function(layero, index) {
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
			var rows = bt.fn.getSelectRows();
			bt.fn.showModify('修改数据 ', [ '600px', '400px' ], $("#modify_data_div").html(), data, function(layero, index) {

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
		visible : false,
		disable : false
	} ];
	bt.config.datatables.columns = [ bt.datatables.columns.cs, bt.datatables.columns.seq, {
		width : '80px',
		data : 'ptId',
		title : '平台代码'
	}, {
		width : '100px',
		data : 'ptName',
		title : '平台名称'
	}, {
		data : 'notes',
		title : '备注',
		width : "150px"
	}, {
		data : 'createEName',
		title : '创建人',
		width : "100px",
		className : "text-center"
	}, {
		data : 'createDate',
		title : '创建时间',
		width : "120px",
		className : "text-center"
	}, {
		width : "100px",
		className : "text-center",
		data : 'updateEName',
		title : '修改人'
	}, {
		width : "120px",
		className : "text-center",
		data : 'updateDate',
		title : '修改时间'
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
				"ptId" : {
					required : true,
					maxlength : 10
				},
				"ptName" : {
					required : true,
					maxlength : 100
				},
				"notes" : {
					maxlength : 100
				}
			},
			messages : {
				"ptId" : {
					required : "平台代码不允许为空",
					minlength : "平台代码不能超过10个字符"
				},
				"ptName" : {
					required : "平台名称不允许为空",
					minlength : "平台名称不能超过100个字符"
				},
				"notes" : {
					minlength : "备注不能超过100个字符"
				}
			}
		};
		if (isAdd == true) {
			v.rules["ptId"].remote = {
				url : basePath + "sys/platformInfo/judgeIsExists.htm",
				type : "post",
				dataType : "json"
			};
			v.messages["ptId"].remote = "平台代码不允许重复，请重新录入";
		}
		return from.validate(v);
	}
});
