$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "iu/operationLog/";
	// bt.config.datatables.dt = $("#dataTable");//配置承载datatable的容器
	// bt.config.toolbar.tb = $("#toolbar");// 配置承载toolbar的容器
	bt.config.toolbar.search = "账号/姓名/企业名称";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.toolbar.query = {// 配置高级查询
		empName : function() {
			return $("#search_empName").val();
		},
		logInTime : function() {
			return $("#search_operaInTime").val();
		}
	};
	bt.config.datatables.columns = [ bt.datatables.columns.seq, {
		data : 'clientIp',
		width : "20%",
		title : '登录IP',
		className : "text-center"
	}, {
		data : 'empName',
		width : "10%",
		title : '操作人'
	}, {
		data : 'operation',
		width : "30%",
		title : '操作记录'
	}, {
		data : 'operaInTime',
		width : "30%",
		title : '操作时间',
		className : "text-center"
	} ];
	
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : false,
		disable : false
	}, {
		id : "btn_modify",
		text : "修改",
		icon : "fa-pencil",
		visible : false,
		disable : false
	}, {
		id : "btn_delete",
		text : "删除",
		icon : "fa-remove",
		visible : false,
		disable : false
	}, {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : false,
		disable : false
	} ];
	bt.toolbar.handler = function() {
		parent.layer.alert("已禁用此功能");
	}
	// 初始化所有元素
	bt.fn.init(function() {
	});
	
	$('#toolbar a').hide();

});
