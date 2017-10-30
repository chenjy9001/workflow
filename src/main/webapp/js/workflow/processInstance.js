$(function() {
	var bt = new baothink();
	bt.config.url.namespace = "workflow/processing/";
	bt.config.toolbar.search = "流程定义ID/流程定义名称";// 右上角搜索框的提示语句
	bt.config.datatables.pageLength = 10; // 每页记录数，默认10
	bt.config.datatables.paging = true;// 是否分页，默认true
//	bt.config.visible.searchbar = false;//关闭查询框
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
		title : '执行ID'
	},{
		data : 'processDefinitionId',
		title : '流程定义ID'
	}, {
		data : 'processDefinitionKey',
		title : '流程定义key'
	},{
		data : 'processDefinitionName',
		title : '流程定义名称'
	},{
		data : 'processInstanceId',
		title : '流程实例ID'
	},   {
		data : 'activityName',
		title : '当前节点'
	}, {
		data : 'suspended',
		title : '是否挂起',
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
	bt.config.toolbar.btn = [ {
		id : "view_img",
		text : "查看流程图片",
		icon : "fa-plus",
		visible : true,
		disable : false,
		click : function() {
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要查看的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许查看1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				
				return;
			}
			var imageUrl = basePath + "/workflow/resource/process-instance?pid=" + ids[0] + "&type=image";
			$.getJSON(basePath + '/workflow/process/trace?pid=' + ids[0], function(infos) {

		        var positionHtml = "";

		        // 生成图片
		        var varsArray = new Array();
		        $.each(infos, function(i, v) {
		            var $positionDiv = $('<div/>', {
		                'class': 'activity-attr'
		            }).css({
		                position: 'absolute',
		                left: (v.x - 1),
		                top: (v.y - 1),
		                width: (v.width - 2),
		                height: (v.height - 2),
		                backgroundColor: 'black',
		                opacity: 0
		            });

		            // 节点边框
		            var $border = $('<div/>', {
		                'class': 'activity-attr-border'
		            }).css({
		                position: 'absolute',
		                left: (v.x - 1),
		                top: (v.y - 1),
		                width: (v.width - 4),
		                height: (v.height - 3)
		            });

		            if (v.currentActiviti) {
		                $border.addClass('ui-corner-all-12').css({
		                    border: '3px solid red'
		                });
		            }
		            positionHtml += $positionDiv.outerHTML() + $border.outerHTML();
		            varsArray[varsArray.length] = v.vars;
		        });

		        if ($('#workflowTraceDialog').length == 0) {
		            $('<div/>', {
		                id: 'workflowTraceDialog',
		                title: '查看流程（按ESC键可以关闭）<button id="changeImg">如果坐标错乱请点击这里</button><button id="diagram-viewer">Diagram-Viewer</button>',
		                html: "<div><img src='" + imageUrl + "' style='position:absolute; left:0px; top:0px;' />" +
		                "<div id='processImageBorder'>" +
		                positionHtml +
		                "</div>" +
		                "</div>"
		            }).appendTo('body');
		        } else {
		            $('#workflowTraceDialog img').attr('src', imageUrl);
		            $('#workflowTraceDialog #processImageBorder').html(positionHtml);
		        }
		        $("#workflowTraceDialog").css('display','none');
		        // 设置每个节点的data
		        $('#workflowTraceDialog .activity-attr').each(function(i, v) {
		            $(this).data('vars', varsArray[i]);
		        });

		        // 打开对话框
//		        $('#workflowTraceDialog').dialog({
//		            modal: true,
//		            resizable: false,
//		            dragable: false,
//		            open: function() {
//		                $('#workflowTraceDialog').dialog('option', 'title', '查看流程（按ESC键可以关闭）<button id="changeImg">如果坐标错乱请点击这里</button><button id="diagram-viewer">Diagram-Viewer</button>');
//		                $('#workflowTraceDialog').css('padding', '0.2em');
//		                $('#workflowTraceDialog .ui-accordion-content').css('padding', '0.2em').height($('#workflowTraceDialog').height() - 75);
//
//		                // 此处用于显示每个节点的信息，如果不需要可以删除
//		                $('.activity-attr').qtip({
//		                    content: function() {
//		                        var vars = $(this).data('vars');
//		                        var tipContent = "<table class='need-border'>";
//		                        $.each(vars, function(varKey, varValue) {
//		                            if (varValue) {
//		                                tipContent += "<tr><td class='label'>" + varKey + "</td><td>" + varValue + "<td/></tr>";
//		                            }
//		                        });
//		                        tipContent += "</table>";
//		                        return tipContent;
//		                    },
//		                    position: {
//		                        at: 'bottom left',
//		                        adjust: {
//		                            x: 3
//		                        }
//		                    }
//		                });
//		                // end qtip
//		            },
//		            close: function() {
//		                $('#workflowTraceDialog').remove();
//		            },
//		            width: document.documentElement.clientWidth * 0.95,
//		            height: document.documentElement.clientHeight * 0.95
//		        });
		        bt.fn.show('查看数据',[ '1250px', '650px' ],$("#workflowTraceDialog").html(),function(layero, index) {
		        	
		        	}
		        	,{
						btn : [ '取消' ],
						
						btn1 : function(index, layero) {
							top.layer.close(index);
						}
					});
		        

		    });
		}
	}, {
		id : "hang_process",
		text : "挂起",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要挂起的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许挂起1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			top.layer.confirm("您确认要挂起该数据？", {
				icon : 3,
				title : "提示"
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + "hangProcess.htm",
					data : {
						"id" : ids
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							top.layer.alert("挂起成功！", {
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
								title : "挂起失败"
							});
						}
					},
					dataType : "json",
					traditional : true
				});
			});
		}
	}, {
		id : "activate_process",
		text : "启动",
		icon : "fa-remove",
		visible : true,
		disable : false,
		click : function(){
			var ids = bt.fn.getSelectIds();
			if (ids.length == 0) {
				var tip = "请选择您要启动的数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}else if(ids.length != 1){
				var tip = "每次只允许启动1条数据！";
				top.layer.alert(tip, {
					icon : 0,
					title : "提示"
				});
				return;
			}
			top.layer.confirm("您确认要启动该数据？", {
				icon : 3,
				title : "提示"
			}, function() {
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + "activateProcess.htm",
					data : {
						"id" : ids
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							top.layer.alert("启动成功！", {
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
								title : "启动失败"
							});
						}
					},
					dataType : "json",
					traditional : true
				});
			});
		}
	} ];

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

jQuery.fn.outerHTML = function(s) {
	return s
	? this.before(s).remove()
	: jQuery("<p>").append(this.eq(0).clone()).html();
	};
