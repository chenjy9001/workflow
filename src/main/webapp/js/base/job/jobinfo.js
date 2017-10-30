var bt;
$(function() {
	bt = new baothink();
	bt.config.pageType = '10';// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
	bt.config.url.namespace = "/job/info/";// url命名空间
	bt.config.url.loadListByPage = "loadListByPage.htm?jobGroup=" + jobGroup;// 分页查询的url
	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_add",
		text : "添加",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.showAdd('新增数据 ', [ '650px' ], $("#add_data_div").html(), function(layero, index) {
				$("#title", layero).val(title);
				$("#jobGroup", layero).val(jobGroup);
				$("#alarmEmail", layero).val(alarmEmail);
				$("#author", layero).val(author);
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

			bt.fn.show("修改数据", [ '650px' ], $("#modifys_data_div").html(), function(layero, index) {
				$("#title", layero).val(title);
				var rows = bt.fn.getSelectRows();
				$("#id", layero).val($(rows)[0].id);
				$("#jobGroup", layero).val($(rows)[0].jobGroup);
				$("#jobDesc", layero).val($(rows)[0].jobDesc);
				$("#executorHandler", layero).val($(rows)[0].executorHandler);
				$("#executorParam", layero).val($(rows)[0].executorParam);
				$("#jobCron", layero).val($(rows)[0].jobCron);
				$("#childJobKey", layero).val($(rows)[0].childJobKey);
				$("#jobName", layero).val($(rows)[0].jobName);
				$("#alarmEmail", layero).val($(rows)[0].alarmEmail);
				$("#author", layero).val($(rows)[0].author);
				$("form", layero).baothinkform($("#modifys_data_form", layero));
				fromSubmit($("#modifys_data_form", layero), function(data) {
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
					var $form = $($("#modifys_data_div").html());
					if (!$form) {
						$form = $($("#modifys_data_div").html()).find("form");
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
						"jobGroup" : $(obj).attr("jobGroup"),
						"jobName" : $(obj).attr("jobName")
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
	}, {
		id : "btn_views",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要查看的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			bt.fn.show("查看数据", [ '650px' ], $("#view_data_div").html(), function(layero, index) {
				var rows = bt.fn.getSelectRows();
				$("#id", layero).html($(rows)[0].id);
				$("#jobGroup", layero).html(title);
				$("#jobDesc", layero).html($(rows)[0].jobDesc);
				$("#executorParam", layero).html($(rows)[0].executorParam);
				$("#jobCron", layero).val($(rows)[0].jobCron);
				$("#childJobKey", layero).html($(rows)[0].childJobKey);
				$("#jobName", layero).html($(rows)[0].jobName);
				$("#alarmEmail", layero).html($(rows)[0].alarmEmail);
				$("#author", layero).html($(rows)[0].author);
				$("#executorHandler", layero).html($(rows)[0].executorHandler);
				$("form", layero).baothinkform($("#view_data_form", layero));
			}, {
				btn : [ "关闭" ],
				yes : function(index, layero) {
					top.layer.close(index);
				}
			});
		}
	}, {
		id : "btn_refresh",
		text : "刷新",
		icon : "fa-refresh",
		visible : true,
		disable : false,
		click : function() {
			bt.fn.reload(false);
		}
	} ];
	bt.config.toolbar.search = "JobHandler";// 右上角搜索框的提示语句
	bt.config.toolbar.query = {// 配置高级查询
		executorHandler : function() {
			return $("#search_executorHandler").val();
		}
	};
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false
	bt.config.datatables.fixed = true;// 是否限制datatable高度，固定工具栏和分页栏，默认true
	bt.config.visible.searchbar = true;// 默认为true
	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'childJobKey',
		title : '任务key',
		render : function(data, type, row) {
			var jobKey = row.jobGroup + "_" + row.jobName;
			return jobKey;
		}
	}, {
		data : 'jobDesc',
		title : '任务描述'
	}, {
		data : 'jobCron',
		title : '任务计划'
	}, {
		data : 'executorHandler',
		title : 'JobHandler',
		render : function(data, type, row) {
			return (row.glueSwitch > 0) ? "GLUE模式" : data;
		}
	}, {
		data : 'executorParam',
		title : '执行参数',
	}, {
		data : 'addTime',
		title : '创建时间',
	}, {
		data : 'author',
		title : '创建者',
	}, {
		data : 'glueSwitch',
		visible : false
	}, {
		title : "操作",
		render : function(data, type, row) {
			return function() {
				// status
				var pause_resume = "";
				if ('NORMAL' == row.jobStatus) {
					pause_resume = '<a class="btn btn-primary btn-xs job_operate" type="job_pause" onclick="pause(this);">暂停</a>  ';
				} else if ('PAUSED' == row.jobStatus) {
					pause_resume = '<a class="btn btn-primary btn-xs job_operate" type="job_resume" onclick="resume(this);">恢复</a>  ';
				}
				var codeBtn = "";
				if (row.glueSwitch > 0) {
					var codeUrl = basePath + 'jobcode?jobGroup=' + row.jobGroup + '&jobName=' + row.jobName;
					codeBtn = '<button class="btn btn-warning btn-xs" type="button" onclick="javascript:window.open(\'' + codeUrl + '\')" >GLUE</button>  '
				}

				var html = '<p style="height: auto;margin-top: 10px;text-align: center;" id="' + row.id + '" ' + ' jobGroup="' + row.jobGroup + '" ' + ' jobName="' + row.jobName + '" ' + ' jobCron="' + row.jobCron + '" ' + ' jobDesc="' + row.jobDesc + '" ' + ' author="' + row.author + '" ' + ' alarmEmail="' + row.alarmEmail + '" ' + ' executorHandler="' + row.executorHandler + '" ' + ' executorParam="' + row.executorParam + '" ' + ' glueSwitch="' + row.glueSwitch + '" ' + ' childJobKey="' + row.childJobKey + '" ' + '>' + '<a class="btn btn-primary btn-xs job_operate" type="job_trigger" onclick="trigger(this)">执行</a>  ' + pause_resume + '<a class="btn btn-primary btn-xs" type="job_del" onclick="toJobLog(this)" >日志</a><input type="hidden" value="' + row.jobGroup + "&" + row.jobName + '"/>  ' + '</p>';

				return html;
			};
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
				"jobDesc" : {
					required : true
				},
				"executorHandler" : {
					required : true
				},
				"jobCron" : {
					required : true
				},
				"alarmEmail" : {
					required : true
				},
				"author" : {
					required : true
				}
			}
		});
	}
});

/**
 * 执行方法
 * 
 * @param data
 */
function trigger(data) {
	top.layer.confirm("您确认要执行这条数据？", {
		icon : 3,
		title : "提示"
	}, function() {
		var obj = $(data).parent();
		$.ajax({
			type : 'POST',
			url : basePath + bt.config.url.namespace + "/trigger.htm",
			data : {
				"jobGroup" : $(obj).attr("jobGroup"),
				"jobName" : $(obj).attr("jobName")
			},
			success : function(data, textStatus, jqXHR) {
				if (data.success) {
					top.layer.alert("执行成功！", {
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
						title : "执行失败"
					});
				}
			},
			dataType : "json",
			traditional : true
		});
	})
}

/**
 * 恢复方法
 * 
 * @param data
 */
function resume(data) {
	top.layer.confirm("您确认要恢复这条数据？", {
		icon : 3,
		title : "提示"
	}, function() {
		var obj = $(data).parent();
		$.ajax({
			type : 'POST',
			url : basePath + bt.config.url.namespace + "/resume.htm",
			data : {
				"jobGroup" : $(obj).attr("jobGroup"),
				"jobName" : $(obj).attr("jobName")
			},
			success : function(data, textStatus, jqXHR) {
				if (data.success) {
					top.layer.alert("恢复成功！", {
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
						title : "恢复失败"
					});
				}
			},
			dataType : "json",
			traditional : true
		});
	})
}

/**
 * 暂停方法
 * 
 * @param data
 */
function pause(data) {
	top.layer.confirm("您确认要暂停这条数据？", {
		icon : 3,
		title : "提示"
	}, function() {
		var obj = $(data).parent();
		$.ajax({
			type : 'POST',
			url : basePath + bt.config.url.namespace + "/pause.htm",
			data : {
				"jobGroup" : $(obj).attr("jobGroup"),
				"jobName" : $(obj).attr("jobName")
			},
			success : function(data, textStatus, jqXHR) {
				if (data.success) {
					top.layer.alert("暂停成功！", {
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
						title : "暂停失败"
					});
				}
			},
			dataType : "json",
			traditional : true
		});
	})
}

/**
 * 跳转到调度日志管理界面
 * 
 * @param data
 */
function toJobLog(data) {
	var row = $(data).next("input").val();
	$("#simulateJobLog", top.document).parent().attr("href", '' + basePath + '/job/log/manage.html?jobGroup=' + row.split("&")[0] + '&jobName=' + row.split("&")[1] + '&flag=true');
	$("#simulateJobLog", top.document).click();
}
