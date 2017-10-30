var bt;
$(function() {
	bt = new baothink();
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/job/log/";// url命名空间
	bt.config.url.loadListByPage = "loadListByPage.htm?jobGroup=" + jobGroup + "&jobName=" + jobName + "&flag=" + flag + "";// 分页查询的url
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_views",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			bt.fn.show("查看数据", [ '650px' ], $("#view_data_div").html(), function(layero, index) {
				var rows = bt.fn.getSelectRows();
				$("#id", layero).html($(rows)[0].id);
				$("#jobGroup", layero).html($(rows)[0].jobGroup);
				$("#jobDesc", layero).html($(rows)[0].jobDesc);
				$("#executorParam", layero).html($(rows)[0].executorParam);
				$("#jobCron", layero).html($(rows)[0].jobCron);
				$("#childJobKey", layero).html($(rows)[0].childJobKey);
				$("#jobName", layero).html($(rows)[0].jobName);
				$("#alarmEmail", layero).html($(rows)[0].alarmEmail);
				$("#author", layero).html($(rows)[0].author);
				$("form", layero).baothinkform($("#view_data_form", layero));
			}, {
				btn : [ "关闭" ],
				yes : function(index, layero) {
					top.layer.close(index);
				}
			});
		}
	} ];
	bt.config.toolbar.search = "";// 右上角搜索框的提示语句
	bt.config.visible.searchbar = false;// 默认为true
	bt.config.toolbar.query = {// 配置高级查询
		jobGroup : function() {
			return $("#search_jobGroup option:selected").val();
		},
		jobName : function() {
			return $("#search_jobName option:selected").val();
		},
		triggerTime : function() {
			return $("#search_triggerTime").val();
		}
	};
	bt.config.toolbar.search = "执行器/描述";// 右上角搜索框的提示语句
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
	bt.config.visible.searchbar = true;// 默认为true
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'jobName',
		visible : false
	}, {
		data : 'executorAddress',
		title : "执行器地址"
	}, {
		data : 'executorHandler',
		title : 'JobHandler'
	}, {
		data : 'executorParam',
		title : '任务参数'
	}, {
		data : 'triggerTime',
		title : '调度时间'
	}, {
		data : 'triggerStatus',
		title : '调度结果'
	}, {
		data : 'handleTime',
		title : '执行时间',
	}, {
		data : 'handleStatus',
		title : '执行结果'
	}, {
		data : 'handleMsg',
		title : '执行备注',
	}, {
		data : 'triggerMsg',
		title : '调度备注',
		className : "text-center",
		render : function(data, type, row, mata) {
			return '<a class="btn btn-primary btn-xs job_operate" type="job_pause" data-content="' + data + '" onclick="view(this);">查看</a> ';
		}
	}, {
		title : "操作",
		render : function(data, type, row, mata) {
			if (row.triggerStatus == 'SUCCESS' || row.handleStatus) {
				var temp = '<a href="javascript:;" class="logDetail" _id="' + row.id + '">执行日志</a>';
//				if (!row.handleStatus) {
//					temp += '<br><a href="javascript:;" class="logKill" _id="' + row.id + '">终止任务</a>';
//				}
				return temp;
			}
			return "";
		}
	} ];

	// 初始化所有元素
	bt.fn.init(function(table) {
	});

	getJobGroup();
	$("#search_jobGroup").on("change", function() {
		var jobGroup = $(this).children('option:selected').val();
		$("#search_jobName").html("");
		$("#search_jobName").select2("val", ""); 
		renderDesc(jobGroup);
	});
});

/**
 * 查看调度备注
 * 
 * @param data
 */
function view(data) {
	var content = $(data).data("content");
	top.layer.open({
		type : 1,
		skin : 'layui-layer-demo', // 样式类名
		closeBtn : 1, // 不显示关闭按钮
		anim : 0,
		area : [ '380px' ],
		shadeClose : true, // 开启遮罩关闭
		content : content,
		btn : [ "关闭" ],
		yes : function(index, layero) {
			top.layer.close(index);
		}
	});
}

// 查看执行器详细执行日志
$('#dataTable').on('click', '.logDetail', function() {
	var _id = $(this).attr('_id');

	window.open(basePath + '/job/log/logDetail.html?id=' + _id);
	return;
});

/**
 * 渲染执行器下拉数据
 */
function getJobGroup() {
	$.ajax({
		type : 'POST',
		url : basePath + "job/group/getDataList.htm",
		success : function(data, textStatus, jqXHR) {
			if (data.success) {
				if (data.data) {
					$("#search_jobGroup").html('<option value="0" >请选择</option>');
					$.each(data.data, function(index, value) {
						$("#search_jobGroup").append('<option value="' + value.id + '">' + value.title + '</option>');
					});
					$("#search_jobGroup").select2("val", jobGroup); 
					$("#search_jobName").select2("val", jobName); 
					
					if (triggerTime) {
						$('#search_triggerTime').val(triggerTime);
					}
				}
			} else {
				top.layer.alert(data.errorMsg, {
					icon : 2,
					title : "查询失败"
				});
			}
		},
		dataType : "json",
		traditional : true
	});
}

/**
 * 点击执行器渲染描述
 */
function renderDesc(jobGroup) {
	$.ajax({
		type : 'POST',
		async : false, // async, avoid js invoke pagelist before jobName data init
		url : basePath + '/job/log/getJobsListByGroup.htm',
		data : {
			"jobGroup" : jobGroup
		},
		dataType : "json",
		success : function(data) {
			if (data.success) {
				$("#search_jobName").html('<option value=" " >请选择</option>');
				$.each(data.data, function(n, value) {
					$("#search_jobName").append('<option value="' + value.jobName + '" >' + value.jobDesc + '</option>');
				});
			}
		},
	});

}
