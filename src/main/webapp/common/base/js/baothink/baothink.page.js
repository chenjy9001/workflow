function baothink(baothinko) {
	var table;
	var tree;
	// 工具栏按钮div的id
	var toolbarBtnId = "toolbar_btn";
	// 工具栏搜索div的id
	var searchbarId = "searchbar";
	// 是否是高级查询
	var isAdvancedSearch = false;
	// 子页面的iframe jquery对象
	var $iframeDoc;
	// 是否已经初始化
	var isInit = false;
	// 选中的tab页
	var selectTab = {};
	// datatables查询条件
	var dataTableDefultQuery = {};
	// datatables是否已加载完成
	var isDataTablesLoad = false;
	// 当前选中的行
	var selectRows = [];
	// 高级搜索的条件
	var searchQuery;

	baothinko = baothinko ? baothinko : $("body");
	var bt = new Object();
	bt.dialog = {
		add : 0,
		modify : 0,
		view : 0
	}
	bt.config = {
		// 页面类型（10：单表维护；11：带树单表维护；20：多表维护；21：带树多表维护）
		pageType : "10",
		// 是否是tab页面
		tabPage : false,
		// 配置唯一标示字段名，对应bt.config.datatabls.columns里面的data属性
		id : "id",
		// 所有url请求配置
		url : {
			// 命名空间
			namespace : "",
			// 分页查询
			loadListByPage : "loadListByPage.htm",
			// 新增
			addAsync : "addAsync.htm",
			// 修改
			modifyAsync : "modifyAsync.htm",
			// 删除
			deleteAsync : "deleteAsync.htm",
			// 查看
			viewAsync : "viewAsync.htm",
			// 加载tree
			loadTree : "loadTree.json"
		},
		// 配置显示的部件
		visible : {
			toolbar : true,// 工具栏
			searchbar : true,// 搜索框
			splitVertical : false
		// 垂直分隔条
		},
		// 工具栏
		toolbar : {
			// 承载工具栏的标签
			tag : $("#toolbar", baothinko),
			// 按钮配置
			btn : [],
			// 按钮大小(1：大按钮，2：小按钮，3：超小按钮)
			btnSize : 2,
			// 按钮是否组合
			btnGroup : false,
			// 右上角搜索框的提示语句
			search : "",
			// 搜索条件
			query : {}
		},
		// datatables的配置
		datatables : {
			// 承载datatables的标签
			tag : $("#dataTable", baothinko),
			// 承载按钮的标签
			// btn : null,
			// 是否允许选择多行，默认单选
			multiSelect : false,
			// 列配置
			columns : [],
			// 列渲染配置
			columnDefs : [],
			// 每页记录数，默认10
			pageLength : 10,
			// 是否显示分页
			paging : true,
			// 是否固定模式,默认为true
			// 1、固定:工具类栏、搜索栏、标题栏、分页栏固定不动
			// 2、非固定：工具类栏、搜索栏、标题栏、分页栏会随页面上下滚动而滚动
			fixed : true,
			// 是否允许水平滚动,默认为false
			scrollX : false,
			// 刷新datatable时，是否清除行选中状态，true：清除，false：不清楚，默认false
			reloadClearSelect : false,
			// 固定查询条件
			fixedParam : {}
		},
		// tree配置
		tree : {
			// 承载tree的标签
			tag : $("#jstree", baothinko),
			// 搜索条件,格式{参数名:"节点属性（id或者text）"}
			query : {
				isHasChildNode : false
			// 当前选中的节点是否有子节点
			}
		},
		// 设置分隔条
		splitter : {
			// 垂直分隔条
			splitVertical : {
				tag : $(".wrapper", baothinko),
				minAsize : 150,
				maxAsize : 300,
				splitVertical : true,
				A : $('#divTree', baothinko),
				B : $('#divDatatable', baothinko),
				closeableto : 0
			},
			// 水平分隔条
			splitHorizontal : {
				tag : $(".wrapper", baothinko),
				minAsize : 150,
				maxAsize : 300,
				splitVertical : true,
				A : $('#divTree', baothinko),
				B : $('#divDatatable', baothinko),
				closeableto : 0
			}
		},
		// 配置多表操作时，显示的子表
		tab : {
			tag : $(".sub", baothinko),
			tabs : []
		},
		// form 表单配置
		form : {}
	}
	bt.datatables = {
		columns : {
			cs : { // 复选框单元格
				data : "auto_icheck",
				searchable : false,
				orderable : false,
				width : "35px",
				className : "text-center",
				title : '<input type="checkbox" id="selectAllRow" class="iCheck"/>',
				render : function(data, type, row, meta) {
					return '<input type="checkbox" class="iCheck trCheck" name="iCheck" id="dt_check_' + meta.row + '" data-row="' + meta.row + '" value="' + row[bt.config.id] + '"/>';
				}
			},
			seq : { // 序号
				data : "auto_seq",
				searchable : false,
				orderable : false,
				width : "35px",
				className : "text-center",
				title : '序号',
				render : function(data, type, row, meta) {
					return meta.row + 1;
				}
			}
		}
	}
	bt.toolbar = {
		btn : [ {
			id : "btn_add",
			text : "添加",
			tip : "添加",
			icon : "fa-plus",
			visible : true,
			disable : false,
			click : function() {
			}
		}, {
			id : "btn_modify",
			text : "修改",
			tip : "修改",
			icon : "fa-pencil",
			visible : true,
			disable : false,
			click : function(data) {
			}
		}, {
			id : "btn_delete",
			text : "删除",
			tip : "删除",
			icon : "fa-remove",
			visible : true,
			disable : false,
			click : function(ids) {
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
			tip : "查看",
			icon : "fa-search",
			visible : true,
			disable : false,
			click : function(data) {
			}
		}, {
			id : "btn_refresh",
			text : "刷新",
			tip : "刷新",
			icon : "fa-refresh",
			visible : false,
			disable : false,
			click : function() {
				bt.fn.reload();
			}
		}, {
			id : "btn_import",
			text : "导入",
			tip : "导入",
			icon : "iconfont icon-daoru",
			visible : false,
			isTemplate : true,/* 是否启用模板下载 */
			templateUrl : '',/* 自定义模板下载链接 ，默认为自动生成的模板 */
			templateName : '模板',/* 设置模板名称，模板文件名默认为时间戳，不要后缀 */
			click : function(isTemplate, templateUrl, templateName) {
				var iIndex = bt.fn.show("数据导入", [ "450px", "500px" ], [ basePath + 'importExcel.html' ], function(layero, index) {
					var columns = new Array();
					var columnsTmp = $.extend(true, [], bt.config.datatables.columns);
					$.each(columnsTmp, function(index, item) {
						if (item && item.data) {
							if (item.visible == false) {
							} else if (item.importIgnore == true) {
							} else if ("auto_icheck" == item.data) {
							} else if ("auto_seq" == item.data) {
							} else {
								columns.push(item);
							}
						}
					});
					$("iframe", layero)[0].contentWindow.init(columns, isTemplate, templateUrl, templateName);
				}, {
					type : 2,
					btn : [ '确定', '取消' ],
					yes : function(index, layero) {
						var lindex = top.layer.load(3);
						var jsonData = $("iframe", layero)[0].contentWindow.getConfig();
						if (jsonData == null) {
							top.layer.close(lindex);
							return false;
						}
						$.ajax({
							type : 'POST',
							url : basePath + bt.config.url.namespace + "/importExcel.htm",
							data : {
								columns : JSON.stringify(jsonData.columns),
								fileId : jsonData.fileId
							},
							success : function(data, textStatus, jqXHR) {
								top.layer.close(lindex);
								if (data.success) {
									top.layer.alert("导入成功！", {
										icon : 1,
										title : "提示"
									});
									// 刷新数据源
									bt.fn.reload(true);
									top.layer.close(iIndex);
								} else {
									if (data.errorCode == "-1") {// style="position: absolute;top: 16px;left: 15px;left: -40px;width: 30px;height: 30px"
										var html = '<div class="layui-layer-dialog" style="height: 60px;overflow: hidden;"><div class="layui-layer-content layui-layer-padding" style="height:auto;"><i class="layui-layer-ico layui-layer-ico2"></i>Excel导入失败，数据验证有错误：</div></div>'
										html = html + "<div style='line-height: 25px;overflow-y: auto;max-height:400px; border: 1px solid #ddd; margin-top: 10px;'>" + data.errorMsg + "</div>";
										bt.fn.show("数据导入失败", [], html, function(layero, index) {

										}, {
											btn : [ '确定' ]
										});
									} else {
										top.layer.alert(data.errorMsg, {
											icon : 2,
											title : "提示"
										});
									}
								}
							},
							dataType : "json",
							traditional : true
						});

					},
					btn2 : function(index, layero) {
						top.layer.close(index);
					}
				});
			}
		}, {
			id : "btn_export",
			text : "导出",
			tip : "导出",
			icon : "iconfont icon-daochu",
			visible : false,
			disable : false,
			fileName : new Date().getTime(),
			click : function(fileName) {
				var fixedParam = bt.config.datatables.fixedParam;
				var columns = new Array();
				var columnsTmp = $.extend(true, [], bt.config.datatables.columns);
				$.each(columnsTmp, function(index, item) {
					if (item && item.data) {
						if (item.visible == false) {
						} else if (item.exportIgnore == true) {
						} else if ("auto_icheck" == item.data) {
						} else if ("auto_seq" == item.data) {
						} else {
							columns.push(item);
						}
					}
				});
				$.ajax({
					type : 'POST',
					url : basePath + bt.config.url.namespace + "/exportExcel.htm",
					data : {
						fixedParam : JSON.stringify(fixedParam),
						columns : JSON.stringify(columns),
						fileName : fileName
					},
					success : function(data, textStatus, jqXHR) {
						if (data.success) {
							// 判断是否存在该iframe，如果不存在，则构建一个；
							if ($("#iframeExportExcel", baothinko).length == 0) {
								$("body").append('<iframe id="iframeExportExcel" style="display: none; height: 0px; width: 0px; border: 0px"/>');
							}
							$("#iframeExportExcel", baothinko)[0].src = basePath + "fileserver/exportExcel/" + data.data;
						} else {
							top.layer.alert(data.errorMsg, {
								icon : 2,
								title : "提示"
							});
						}
					},
					dataType : "json",
					traditional : true
				});
			}
		} ],
		/**
		 * 初始化工具栏
		 */
		initToolbar : function() {
			if (!bt.config.visible.toolbar) {
				return false;
			}
			var tempBtns = [];
			// 合并内置配置
			$.each(bt.toolbar.btn, function(i, bb) {
				$.each(bt.config.toolbar.btn, function(j, bc) {
					if (bb.id == bc.id) {
						bb = $.extend({}, bb, bc);
						tempBtns.push(bb);
					}
				});
			});
			// 新增自定义按钮
			var isExists = false;
			$.each(bt.config.toolbar.btn, function(j, bc) {
				isExists = false;
				$.each(tempBtns, function(i, bb) {
					if (bb.id == bc.id) {
						isExists = true;
					}
				});
				if (!isExists) {
					tempBtns.push(bc);
				}
			});
			// 设置排序
			var btnConfig = [];
			$.each(bt.config.toolbar.btn, function(j, bc) {
				$.each(tempBtns, function(i, bb) {
					if (bb.id == bc.id) {
						btnConfig.push(bb);
					}
				});
			});
			var toolbar = '';
			var toolbarBtnLegnth = $("div[id^=" + toolbarBtnId + "]", baothinko).length;
			if (toolbarBtnLegnth > 1) {
				toolbarBtnId = toolbarBtnId + (toolbarBtnLegnth + 1);
			}
			var searchbarLegnth = $("div[id^=" + searchbarId + "]", baothinko).length;
			if (searchbarLegnth > 1) {
				searchbarId = searchbarId + (searchbarLegnth + 1);
			}
			var btnSize = "btn-sm";
			var inputSize = "input-sm";
			if (bt.config.toolbar.btnSize == 1) {
				btnSize = "btn-lg";
				inputSize = "input-lg";
			} else if (bt.config.toolbar.btnSize == 3) {
				btnSize = "btn-xs";
				inputSize = "input-xs";
			}
			toolbar = toolbar + '<div id="{{tbId}}" class="toolbarBtn {{if btnGroup}}btn-group{{/if}}">';
			toolbar = toolbar + '{{each btns}}';
			toolbar = toolbar + '{{if $value.visible}}';
			toolbar = toolbar + '		<button class="btn btn-primary {{btnClass}}" title="{{$value.tip}}" id="{{$value.id}}" {{if $value.disable}}disabled="disabled"{{/if}}>';
			toolbar = toolbar + '			{{$value.text}}<i class="fa {{$value.icon}} icon-white"></i>';
			toolbar = toolbar + '		</button>';
			toolbar = toolbar + '{{/if}}';
			toolbar = toolbar + '{{/each}}';
			toolbar = toolbar + '</div>';
			if (bt.config.visible.searchbar) {
				toolbar = toolbar + '<div id="{{sId}}" class="pull-right">';
				toolbar = toolbar + '	<div class="input-group">';
				toolbar = toolbar + '		<input type="text" id="search_keyword" class="form-control {{inputClass}}" placeholder="{{searchText}}" />';
				toolbar = toolbar + '		<div class="btn-group">';
				toolbar = toolbar + '			<button type="button" class="btn btn-primary {{btnClass}}" id="btn-simple-search">';
				toolbar = toolbar + '				<i class="fa fa-search"></i>';
				toolbar = toolbar + '			</button>';
				toolbar = toolbar + '			<button type="button" class="btn btn-primary {{btnClass}}" title="高级查询" id="toggle-advanced-search">';
				toolbar = toolbar + '				<i class="fa fa-angle-double-down"></i>';
				toolbar = toolbar + '			</button>';
				toolbar = toolbar + '		</div>';
				toolbar = toolbar + '	</div>';
				toolbar = toolbar + '</div>';
			}
			toolbar = toolbar + '	<div class="clear"></div>';
			$toolbar = bt.config.toolbar.tag;
			$toolbar.empty();

			var render = template.compile(toolbar);
			
						// 通过权限控制按钮是否显示
						$.each(btnConfig, function(index1, func) {
							// 首先重置为false，隐藏按钮
							func.visible = true;
							
						});
						var html = render({
							tbId : toolbarBtnId,
							sId : searchbarId,
							btns : btnConfig,
							btnClass : btnSize,
							inputClass : inputSize,
							btnGroup : bt.config.toolbar.btnGroup,
							searchText : bt.config.toolbar.search
						});
						$toolbar.html(html);
						var $toolbarBtnDiv = $("#" + toolbarBtnId, baothinko);
						var $searchbarDiv = $("#" + searchbarId, baothinko);
						// 高级查询展开收起
						$searchbarDiv.find("#toggle-advanced-search").click(function() {
							$("i", this).toggleClass("fa-angle-double-down fa-angle-double-up");
							$("#div-advanced-search", baothinko).slideToggle("5000", function() {
								bt.fn.relayout();
							});
						});
						var $divAdvancedSearch = $("#div-advanced-search", baothinko);
						// 判断高级查询的form表单是否存在，不存在则删除展开高级查询的按钮
						if ($divAdvancedSearch.length > 0) {
							// 初始化高级查询的控件
							$divAdvancedSearch.baothinkform(bt.config.form);
						} else {
							$searchbarDiv.find("#toggle-advanced-search").remove();
						}
						// 工具栏按钮事件注册
						$.each(btnConfig, function(index, data) {
							var btnId = data.id;
							var $btn = $toolbarBtnDiv.find("#" + btnId).unbind("click");
							if (btnId == "btn_modify") {
								$btn.click(function() {
									// 获取选中的id
									var ids = bt.fn.getSelectIds();
									if (ids.length == 0) {
										var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要修改的数据！";
										top.layer.alert(tip, {
											icon : 0,
											title : "提示"
										});
										return;
									} else if (ids.length > 1) {
										var tip = data.tips && data.tips.selectMore ? data.tips.selectMore : "对不起，只能选择一行数据进行修改！";
										top.layer.alert(tip, {
											icon : 0,
											title : "提示"
										});
										return;
									}
									// 加载数据
									$.get(basePath + bt.config.url.namespace + bt.config.url.viewAsync, {
										"id" : ids[0]
									}, function(result, textStatus, jqXHR) {
										if (result.success) {
											data.click(result.data);
										} else {
											top.layer.alert(result.errorMsg, {
												icon : 0,
												title : "提示"
											});
											return;
										}
									}, "JSON");
								});
							} else if (btnId == "btn_delete") {
								$btn.click(function() {
									// 获取选中的id
									var ids = bt.fn.getSelectIds();
									if (ids.length == 0) {
										var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要删除的数据！";
										top.layer.alert(tip, {
											icon : 0,
											title : "提示"
										});
										return;
									}
									data.click(ids);
								});
							} else if (btnId == "btn_view") {
								$btn.click(function() {
									// 获取选中的id
									var ids = bt.fn.getSelectIds();
									if (ids.length == 0) {
										var tip = data.tips && data.tips.notSelect ? data.tips.notSelect : "请选择您要查看的数据！";
										top.layer.alert(tip, {
											icon : 0,
											title : "提示"
										});
										return;
									} else if (ids.length > 1) {
										var tip = data.tips && data.tips.selectMore ? data.tips.selectMore : "对不起，一次只能查看一行数据！";
										top.layer.alert(tip, {
											icon : 0,
											title : "提示"
										});
										return;
									}
									// 加载数据
									$.get(basePath + bt.config.url.namespace + bt.config.url.viewAsync, {
										"id" : ids[0]
									}, function(result, textStatus, jqXHR) {
										if (result.success) {
											data.click(result.data);
										} else {
											top.layer.alert(result.errorMsg, {
												icon : 0,
												title : "提示"
											});
											return;
										}
									}, "JSON");
								});
							} else if (btnId == "btn_export") {
								$btn.click(function() {
									data.click(data.fileName);
								});
							} else if (btnId = "btn_import") {
								$btn.click(function() {
									data.click(data.isTemplate, data.templateUrl, data.templateName);
								});
							} else {
								$btn.click(data.click);
							}
						});
		}
	}
	bt.fn = {
		/**
		 * 初始化所有
		 */
		init : function(callback) {
			if (!table) {
				bt.toolbar.initToolbar();
				bt.fn.initDatatables(function(table) {
					// 如果是tab页面，则需要通知baothinkTab加载完成
					var tabId = $(parent.window).attr("SUB_TAB_ID");
					var tabTag = $(parent.window).attr("MAIN_TAB_TAG");
					if (tabId && tabTag) {
						$(parent.window).attr(tabId, bt);
						// 通知baothinkTab,加载完成
						tabTag.baothinkTab("bindComplete", tabId, bt);
					}

					if (bt.config.datatables.fixed) {
						$(window).resize(function() {
							bt.fn.relayout();
						});
					}
					bt.fn.relayout();
					switch (bt.config.pageType) {
					case "10":
						break;
					case "11":
						bt.fn.initTree();
						bt.fn.initSplitter();
						break;
					case "20":
						bt.fn.initBaothinkTab();
						break;
					case "21":
						bt.fn.initTree();
						bt.fn.initBaothinkTab();
						bt.fn.initSplitter();
						break;
					default:
						break;
					}
					if (callback) {
						callback(table);
					}
					// 统一按钮大小
					$("#div-advanced-search input", baothinko).addClass("input-sm");
				});
			}
		},
		/**
		 * 初始化主子表的子表tab页
		 */
		initBaothinkTab : function(callback) {
			bt.config.tab.tag.baothinkTab({
				tabs : bt.config.tab.tabs,
				switchBefor : function(id) {// 切换前的事件
					// 设置当前选中的tab标签的id
					selectTab.id = id;
					// 获取绑定的baothink对象
					selectTab.baothink = $(window).attr(id);
					// 刷新tab标签页的数据
					bt.fn.reloadSubTab();
				},
				bindComplete : function(id, baohitnk, iframeObj) {// 绑定baothink对象完成事件
					selectTab.baothink = baohitnk;
				}
			});
			if (callback) {
				callback();
			}
		},
		/**
		 * 根据主表选中的数据刷新tab标签页面
		 */
		reloadSubTab : function(rowData) {
			if (!rowData && bt.fn.getSelectRows() && bt.fn.getSelectRows()[0]) {
				rowData = bt.fn.getSelectRows()[0];
				$(window).attr("MAIN_SELECT_ROWS", rowData);
			}
			var tabs = bt.config.tab.tabs;
			// 设置当前选中的tab标签的id
			var selectTabId = selectTab.id;
			// 获取绑定的baothink对象
			var tabBaothink = selectTab.baothink;
			var query = [];
			$.each(tabs, function(index, data) {
				if (selectTabId == data.id) {
					query = data.query;
				}
			});
			if (query) {
				var value = {};
				if (rowData) {
					$.each(query, function(index, data) {
						if (data) {
							$.each(data, function(key, val) {
								value[key] = rowData[val];
							});
						}
					});
				}
				// tab首次加载时
				if (!tabBaothink || !tabBaothink.fn) {
					$(window).attr("TAB_LOAD_PARAM", value);
				} else {
					var oldValue = $(window).attr("OLD_VALUE_" + selectTabId);
					if (!equals(oldValue, value)) {
						$(window).attr("TAB_LOAD_PARAM", value);
						// 刷新子表数据
						tabBaothink.fn.reload(true);
						// 触发主表点击事件
						tabBaothink.event.mainDataTablesClick(rowData);
						$(window).attr("OLD_VALUE_" + selectTabId, value);
					}
				}
			}
		},
		/**
		 * 初始化可移动分隔条
		 */
		initSplitter : function(callback) {
			if (bt.config.visible.splitter) {
				var splitVertical = bt.config.splitter.splitVertical;
				splitVertical.tag.splitter(splitVertical);
			}
			if (callback) {
				callback();
			}
		},
		/**
		 * 初始化tree
		 */
		initTree : function(callback) {
			var $jsTree = bt.config.tree.tag;
			tree = $jsTree.jstree({
				core : {
					animation : 0,
					multiple : false,
					check_callback : true,
					data : {
						url : basePath + bt.config.url.namespace + bt.config.url.loadTree
					}
				},
				plugins : [ "search" ]
			}).bind("loaded.jstree", function(e, result) {
				result.instance.open_all(); // 默认展开所有节点
			});
			$("#btn_refresh_tree", baothinko).click(function() {
				$('#jstree').jstree(true).refresh();
			});
			$jsTree.on("changed.jstree", function(e, data) {
				bt.event.treeClick(data.node);
			});
			var to = false;
			$('#search_tree', baothinko).keyup(function() {
				if (to) {
					clearTimeout(to);
				}
				to = setTimeout(function() {
					$('#jstree', baothinko).jstree(true).search($('#search_tree', baothinko).val());
				}, 250);
			});
			if (callback) {
				callback();
			}
		},
		/**
		 * 初始化dataTable
		 */
		initDatatables : function(callback) {
			var $table = bt.config.datatables.tag;
			var targets = [];
			$.each(bt.config.datatables.columns, function(index, item) {
				if (item.format) {
					targets.push(index);
				}
			});
			bt.config.datatables.columnDefs.push({
				render : function(data, type, row, meta) {
					var format = bt.config.datatables.columns[meta.col].format;
					if (format) {
						return format[data];
					} else {
						return data;
					}
				},
				targets : targets
			});

			var dataTableOption = {
				ajax : {
					url : basePath + bt.config.url.namespace + bt.config.url.loadListByPage,
					type : 'POST'
				},
				// 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
				deferRender : true,
				paging : true,
				scrollX : bt.config.datatables.scrollX,
				pageLength : bt.config.datatables.pageLength,
				columns : $.extend(true, [], bt.config.datatables.columns),
				columnDefs : bt.config.datatables.columnDefs,
				fnServerParams : function(aoData) {
					var value = $(parent.window).attr("TAB_LOAD_PARAM");

					// 默认查询条件
					if (bt.config.datatables.fixedParam) {
						aoData["fixedParam"] = bt.config.datatables.fixedParam;
					}
					if (value) {
						aoData["fixedParam"] = $.extend(aoData["fixedParam"], value);
						$.each(value, function(index, item) {
							aoData["fixedParam"][index] = item;
						});
					}

					if (isAdvancedSearch && searchQuery) {
						var newQuery = {};
						// 判断高级查询的参数返回的是否为空，为空则返回空字符串
						$.each(searchQuery, function(index, item) {
							if (typeof (item) == "function" && !item()) {
								newQuery[index] = "";
							} else {
								newQuery[index] = item;
							}
						});
						aoData.query = newQuery;
					}
				},
				initComplete : function(settings, json) {
					// 注册模糊搜索框回车事件
					$("#search_keyword", baothinko).unbind().keyup(function(e) {
						if (e.keyCode == 13) {
							isAdvancedSearch = false;
							table.search($("#search_keyword", baothinko).val()).draw();
							bt.fn.getSelectRows();
						}
					});
					// 注册搜索按钮点击事件
					$("#btn-simple-search", baothinko).unbind().click(function() {
						isAdvancedSearch = false;
						table.search($("#search_keyword", baothinko).val()).draw();
						bt.fn.getSelectRows();
					});
					// 高级搜索按钮点击事件
					$("#btn-advanced-search", baothinko).unbind().click(function() {
						isAdvancedSearch = true;
						// table.search("").draw();
						bt.fn.search(true, bt.config.toolbar.query);
						bt.fn.getSelectRows();
					});
					// 重置按钮点击事件
					$("#btn-advanced-rest", baothinko).unbind().click(function() {
						bt.fn.resetAdvancedSearch();
						bt.event.resetAdvancedSearch();
					});

					var $this = $(settings.nTableWrapper);
					// 全选按钮
					var $checkAll = $this.find("input[type=checkbox]#selectAllRow");
					// 判断是否允许多选
					if (bt.config.datatables.multiSelect) {
						// 全选按钮的选中和取消选中事件
						$this.on('ifChecked ifUnchecked', "input[type=checkbox]#selectAllRow", function(event) {
							// 所有的checkbox按钮
							var $allCheck = $this.find("input[type=checkbox].trCheck");
							if (event.type == 'ifChecked') {
								$allCheck.iCheck('check');
								// 触发行选中事件
								rowClick();
							} else {
								bt.fn.clearMainSelectRows();
								$allCheck.iCheck('uncheck');
							}
						});
						// 每行的checkbox选中和取消选中事件
						$this.on('ifChecked ifUnchecked', "input[type=checkbox].trCheck", function(event) {
							event.stopPropagation();
							var $tr = $(this).parent().parent().parent();
							if (event.type == 'ifChecked') {
								$tr.addClass("selected");
								// 触发行选中事件
								rowClick($tr, $(this));
							} else {
								$tr.removeClass("selected");
								if ($this.find("tbody tr").find(".selected").length == 0) {
									bt.fn.clearMainSelectRows();
								}
							}
						});
					} else {
						// 删除全选按钮
						$checkAll.iCheck('destroy');
						$checkAll.remove();
						// checkbox点击事件，取消选中
						$this.on("ifClicked", "input[type=checkbox].trCheck", function(event) {
							$this.find("tbody tr").removeClass("selected");
							$this.find("input[type=checkbox].trCheck").iCheck('uncheck');
						});
						// checkbox选中和取消选中事件
						$this.on('ifChecked ifUnchecked', "input[type=checkbox].trCheck", function(event) {
							var $tr = $(this).parent().parent().parent();
							if ($(this).is(':checked')) {
								$tr.addClass("selected");
								// 触发行选中事件
								rowClick($tr, $(this));
							} else {
								$tr.removeClass("selected");
								if ($this.find("tbody tr").find(".selected").length == 0) {
									bt.fn.clearMainSelectRows();
								}
							}
						});
					}
					// tr行点击事件
					$this.on('click', "tbody tr", function() {
						$this.find("input[type=checkbox].trCheck").iCheck('uncheck');
						$checkAll.iCheck('uncheck');
						$(this).addClass('selected');
						var $selectCheck = $(this).find("input[type=checkbox].trCheck");
						// 选中行同时选中checkbox按钮
						$selectCheck.iCheck('check');
						// 触发行选中事件
						// rowClick($(this), $selectCheck);
					});
					// 行选中事件
					function rowClick(tr, checkBtn) {
						if (bt.event.rowClick) {
							if (tr && checkBtn) {
								var rowIndex = checkBtn.attr("data-row");
								bt.event.rowClick(tr, table.data()[rowIndex]);
							} else {
								bt.event.rowClick($this.find("tbody tr"), table.data());
							}
						}
					}

					if (!isDataTablesLoad && callback) {
						isDataTablesLoad = true;
						callback(table);
					}
				},
				drawCallback : function(settings) {// 绘制完成事件
					var $this = $(settings.nTableWrapper);
					// 所有的checkbox按钮
					var $allCheck = $this.find("input[type=checkbox].trCheck");
					// 全选按钮
					var $checkAll = $this.find("input[type=checkbox]#selectAllRow");
					// 调整check的样式
					$allCheck.iCheck({
						checkboxClass : 'icheckbox_minimal-blue'
					});
					// 调整check的样式
					$checkAll.iCheck({
						checkboxClass : 'icheckbox_minimal-blue'
					});

					bt.fn.relayout();
					// 判断是否清除行选中状态，如果不清楚，则在刷新数据以后，再重新设置为选中。
					if (!bt.config.datatables.reloadClearSelect) {
						var $table = bt.config.datatables.tag;
						$.each(selectRows, function(i, data) {
							var $checkbox = $table.find("input[type=checkbox][value='" + data[bt.config.id] + "']");
							$checkbox.iCheck('check');
						});
					}
				}
			};
			if (bt.config.datatables.fixed) {
				$.extend(true, dataTableOption, {
					scrollY : 1000,
				});
			}
			if (!bt.config.datatables.paging) {
				$.extend(true, dataTableOption, {
					dom : 'rt'
				});
			} else {
				$.extend(true, dataTableOption, {
					dom : 'rt<"pageToolbar"<"col-xs-6 pageleft"il><"col-xs-6"p><"clear">>'
				});
			}
			table = $table.DataTable(dataTableOption);
		},
		/**
		 * 重新布局
		 */
		relayout : function(advancedSearchHeight) {
			var wrapper_height = $("#toolbar", baothinko).parent().height();
			var toolbar_height = $("#toolbar", baothinko).outerHeight();
			var advancedSearch_height = 0;
			if (advancedSearchHeight) {
				advancedSearch_height = advancedSearchHeight * 1;
			} else if ($("#div-advanced-search", baothinko).is(':visible')) {
				advancedSearch_height = $("#div-advanced-search", baothinko).outerHeight() + 20;
			}
			var dataTablesScrollHead_height = $(".dataTables_scrollHead", baothinko).outerHeight();
			var pageToolbar_height = $(".pageToolbar", baothinko).outerHeight() * 1;
			var height = (wrapper_height - toolbar_height - advancedSearch_height - dataTablesScrollHead_height - pageToolbar_height);
			var bodyTable_height = $(".dataTables_scrollBody table", baothinko).height();
			if (bodyTable_height > height) {
				$(".dataTables_scrollBody", baothinko).addClass("dataTables_scrollBody_bottom_line");
				// $(".dataTables_scrollHeadInner").css("padding-right","0").width($(".dataTables_scroll").width());
			} else {
				$(".dataTables_scrollBody", baothinko).removeClass("dataTables_scrollBody_bottom_line");
			}
			// 判断是否固定
			if (bt.config.datatables.fixed) {
				$("div.wrapper", baothinko).addClass("wrapper_fixed");
				$("div.pageToolbar", baothinko).addClass("pageToolbar_fixed");
				$(".pageToolbar_fixed", baothinko).width($(".dataTables_scroll").width());
				$(".dataTables_scrollBody", baothinko).css("max-height", height).height(height);
				// console.info(wrapper_height + "\t" + toolbar_height + "\t" + advancedSearch_height + "\t" + dataTablesScrollHead_height + "\t" + pageToolbar_height);
			}
		},
		/**
		 * 刷新数据
		 * 
		 * @author tanrq
		 * @param isRestPage
		 *            是否重置分页
		 */
		reload : function(isRestPage) {
			bt.fn.getSelectRows();
			bt.fn.clearMainSelectRows();
			if (isRestPage) {
				table.ajax.reload();
			} else {
				table.ajax.reload(null, false);
			}
		},
		/**
		 * 搜索
		 * 
		 * @author tanrq
		 * @param isAdvancedSearch
		 *            是否高级搜索：true高级搜索，false全局搜索
		 * @param value
		 *            高级搜索，格式{参数名:参数值} 全局搜索，value=keyword
		 */
		search : function(isAdvanced, value) {
			bt.fn.getSelectRows();
			isAdvancedSearch = isAdvanced;
			if (isAdvancedSearch) {
				if (value) {
					searchQuery = value;
				}
				table.search("").draw();
			} else {
				if (!value || "") {
					value = $("#search_keyword", baothinko).val();
				}
				table.search(value).draw();
			}
		},
		/**
		 * 重置高级查询的form表单
		 */
		resetAdvancedSearch : function() {
			var $form = $("#div-advanced-search form", baothinko);
			if ($form.length > 0) {
				$form[0].reset();
				$form.find("select").val("").trigger("change");
				$form.find("input:checkbox,input:radio").iCheck('uncheck');
			}
		},
		showAdd : function(title, area, html, btn, fnSuccess) {// 弹出数据新增窗口
			// 弹出之前，把原来的关闭，防止重复打开
			top.layer.close(bt.dialog.add);
			// 自定义按钮
			var layerBtn = [ '保存', '取消' ];
			if (btn && btn.constructor == Array) {
				$.each(btn, function(index, item) {
					layerBtn[index] = item;
				});
			}
			if (btn && typeof (btn) == "function" && !fnSuccess) {
				fnSuccess = btn;
			}
			bt.dialog.add = bt.fn.show(title, area, html, function(layero, index) {
				$("form", layero).baothinkform(bt.config.form);
				if (fnSuccess) {
					fnSuccess(layero, index);
				}
			}, {
				btn : layerBtn,
				yes : function(index, layero) {
					var $form = $(html);
					if (!$form) {
						$form = $(html).find("form");
					}
					var formId = $form.attr("id");
					if (formId) {
						$form = layero.find("#" + formId);
						$form.attr("action", basePath + bt.config.url.namespace + bt.config.url.addAsync);
						$form.submit();
					} else {
						throw new Error("没有找到form表单。");
					}
				},
				btn2 : function(index, layero) {
					top.layer.close(index);
				}
			});
		},
		showModify : function(title, area, html, data, btn, fnSuccess) {// 弹出数据修改窗口
			top.layer.close(bt.dialog.modify);// 弹出之前，把原来的关闭，防止重复打开
			var layerBtn = [ '保存', '取消' ];
			if (btn && btn.constructor == Array) {
				$.each(btn, function(index, item) {
					layerBtn[index] = item;
				});
			}
			if (btn && typeof (btn) == "function" && !fnSuccess) {
				fnSuccess = btn;
			}
			bt.dialog.modify = bt.fn.show(title, area, html, function(layero, index) {
				var formConfig = $.extend({}, bt.config.form, {
					value : data
				});
				$("form", layero).baothinkform(formConfig);
				if (fnSuccess) {
					fnSuccess(layero, index);
				}
			}, {
				btn : layerBtn,
				yes : function(index, layero) {
					var $form = $(html);
					if (!$form) {
						$form = $(html).find("form");
					}
					var formId = $form.attr("id");
					if (formId) {
						$form = layero.find("#" + formId);
						$form.attr("action", basePath + bt.config.url.namespace + bt.config.url.modifyAsync);
						$form.submit();
					} else {
						throw new Error("没有找到form表单。");
					}
				},
				btn2 : function(index, layero) {
					top.layer.close(index);
				}
			});
		},
		showView : function(title, area, html, data, btn, fnSuccess) {// 弹出数据查看窗口
			// 弹出之前，把原来的关闭，防止重复打开
			top.layer.close(bt.dialog.view);
			// 自定义按钮
			var layerBtn = [ '关闭' ];
			if (btn && btn.constructor == Array) {
				$.each(btn, function(index, item) {
					layerBtn[index] = item;
				});
			}
			if (btn && typeof (btn) == "function" && !fnSuccess) {
				fnSuccess = btn;
			}
			bt.dialog.view = bt.fn.show(title, area, html, function(layero, index) {
				$.each(data, function(name, value) {
					var $span = layero.find("span[name=" + name + "]");
					if ($span.length > 0) {
						// 判断是否解析html，默认为true，不解析，当为false的时候，解析html
						var escape = $span.attr("data-escape");
						if (escape == "false") {
							$span.html(value);
						} else {
							$span.text(value);
						}
					}
				});
				if (fnSuccess) {
					fnSuccess(layero, index);
				}
			}, {
				btn : layerBtn,
				yes : function(index, layero) {
					top.layer.close(index);
				}
			});
		},
		show : function(title, area, html, fnSuccess, options) {
			return top.layer.open($.extend({
				type : 1,
				area : area,
				maxmin : true,
				shadeClose : true,
				title : title,
				content : html,
				success : function(layero, index) {
					if (fnSuccess) {
						fnSuccess(layero, index);
					}
				}
			}, options));
		},
		getSelectIds : function() {
			var selectIds = [];
			var $table = bt.config.datatables.tag;
			// 所有的checkbox按钮
			var $selectCheck = $table.find("input[type=checkbox].trCheck:checked");
			if ($selectCheck && $selectCheck.length > 0) {
				$selectCheck.each(function() {
					selectIds.push($(this).val());
				});
			}
			return selectIds;
		},
		/**
		 * 获取datatable选中数据
		 */
		getSelectRows : function() {
			selectRows = [];
			var $table = bt.config.datatables.tag;
			// 所有的checkbox按钮
			var $selectCheck = $table.find("input[type=checkbox].trCheck:checked");
			if ($selectCheck && $selectCheck.length > 0) {
				$selectCheck.each(function() {
					var rowIndex = $(this).attr("data-row");
					selectRows.push(table.data()[rowIndex]);
				});
			}
			return selectRows;
		},
		/**
		 * datatable行点击事件
		 */
		tableRowClick : function(tr, rowData) {
			bt.fn.getSelectRows();
		},
		/**
		 * 获取树的选中节点
		 */
		getSelectTreeNodes : function() {
			return tree.jstree(true).get_selected(true);
		},
		/**
		 * 获取主表的选中行数据
		 */
		getMainSelectRows : function() {
			return $(parent.window).attr("MAIN_SELECT_ROWS");
		},
		/**
		 * 清除主表的选中行数据
		 */
		clearMainSelectRows : function() {
			$(window).attr("MAIN_SELECT_ROWS", null);
		},
		/**
		 * 树的点击搜索
		 */
		treeClickQuery : function(node) {
			var treeQuery = bt.config.tree.query;
			if (node && treeQuery) {
				var value = {};
				$.each(treeQuery, function(param, val) {
					value[param] = node[val];
				});
				$.extend(value, {
					isHasChildNode : (node.children.length > 0)
				});
				bt.fn.clearMainSelectRows();
				bt.fn.search(true, value);
			}
		}
	}
	bt.event = {
		/**
		 * datatables行选中事件
		 */
		rowClick : function(tr, rowData) {
			bt.fn.tableRowClick(tr, rowData);
			if (bt.config.pageType == '20' || bt.config.pageType == '21') {
				bt.fn.reloadSubTab();
			}
		},
		/**
		 * 主表datatables行选中事件
		 */
		mainDataTablesClick : function(tr, rowData) {

		},
		/**
		 * tree点击事件
		 */
		treeClick : function(node) {
			bt.fn.treeClickQuery(node);
			if (bt.config.pageType == '21') {
				bt.fn.reloadSubTab(true);
			}
		},
		/**
		 * tab加载完成事件
		 */
		tabLoadComplete : function() {

		},
		/**
		 * 重置高级查询的form表单
		 */
		resetAdvancedSearch : function() {

		}
	}
	return bt;
};
