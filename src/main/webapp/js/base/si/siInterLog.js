$(function() {
	var bt = new baothink();
	// 把默认的ID换成实际功能需要的ID
	bt.config.id = "id";
	bt.config.url.namespace = "/si/siInterLog/";
	bt.config.toolbar.search = "接口代码/接口名称";
	bt.config.datatables.multiSelect = false;// 是否多选
	bt.config.datatables.scrollX = true;// 是否水平滚动
	bt.config.toolbar.query = {// 配置高级查询
		sicode : function() {
			return $("#search_sicode").val();
		},
		siname : function() {
			return $("#search_siname").val();
		},
		requestTime : function() {
			return $("#search_requestTime").val();
		},
		siaccno : function() {
			return $("#search_siaccno").val();
		},
		responseResultCode : function() {
			return $("#search_responseResultCode").val();
		}
	};

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'sicode',
		title : '接口代码',
		width : "100px",
		className : "text-center"
	}, {
		data : 'siname',
		title : '接口名称',
		width : "100px",
		className : "text-center"
	}, {
		data : 'siaccno',
		title : '调用者账号',
		width : "100px",
		className : "text-center"
	}, {
		data : 'entCode',
		title : '调用者企业代码',
		width : "100px",
		className : "text-center"
	}, {
		data : 'entName',
		title : '调用者企业名称',
		width : "100px",
		className : "text-center"
	}, {
		data : 'entShortName',
		title : '调用者企业简称',
		width : "100px",
		className : "text-center"
	}, {
		data : 'ip',
		title : '调用者IP',
		width : "100px",
		className : "text-center"
	}, {
		data : 'requestTime',
		title : '请求时间',
		width : "150px",
		className : "text-center"
	}, {
		data : 'responseTime',
		title : '响应时间',
		width : "150px",
		className : "text-center"
	}, {
		data : 'responseResultCode',
		title : '响应结果代码',
		width : "100px",
		className : "text-center"
	}, {
		data : 'responseResultMsg',
		title : '响应结果描述',
		width : "380px",
		className : "text-center"
	} ];

	// 初始化所有元素
	bt.fn.init(function() {
	});

});
