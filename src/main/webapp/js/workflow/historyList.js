$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "/workflow/history/";
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
		data : 'name',
		title : '实例名'
	},  {
		data : 'businessKey',
		title : '实例key'
	}, {
		data : 'startActivityId',
		title : '开始节点ID',
	}, {
		data : 'startUserId',
		title : '开始流程者'
	}, {
		data : 'startTime',
		title : '开始时间'
	}, {
		data : 'endActivityId',
		title : '结束节点ID'
	}, {
		data : 'endTime',
		title : '结束时间'
	}, {
		data : 'deleteReason',
		title : '删除理由'
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
