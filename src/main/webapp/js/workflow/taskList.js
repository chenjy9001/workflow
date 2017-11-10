$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/workflow/task/";
	bt.config.toolbar.search = "任务key/任务名称/流程实例ID";// 右上角搜索框的提示语句
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
		data : 'taskDefinitionKey',
		title : '任务key'
	},  {
		data : 'name',
		title : '任务名称'
	}, {
		data : 'processDefinitionId',
		title : '流程定义ID',
	}, {
		data : 'processInstanceId',
		title : '流程实例ID'
	}, {
		data : 'assignee',
		title : '任务执行者'
	}, {
		data : 'owner',
		title : '任务所属人'
	}, {
		data : 'priority',
		title : '优先级'
	}, {
		data : 'createTime',
		title : '任务创建时间'
	}, {
		data : 'dueDate',
		title : '任务逾期日'
	}, {
		data : 'description',
		title : '任务描述'
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
	bt.config.toolbar.btn = [];

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
