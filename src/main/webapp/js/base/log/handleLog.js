$(function() {
	var jf = new jsonFunction();
	var bt = new baothink();
	bt.config.url.namespace = "/log/handle/";// url命名空间
	 bt.config.url.loadListByPage = "loadListByPage.htm?sysId=" + sysId;// 分页查询的url
	bt.config.toolbar.search = "会员代码/会员姓名/IP地址";// 右上角搜索框的提示语句
	// 配置部件是否可见
	bt.config.datatables.scrollX = false;// 是否允许水平滚动，默认false

	bt.config.datatables.fixedParam = {
		sysId : function() {
			return sysId;
		}
	};
	bt.config.toolbar.query = {// 配置高级查询
		ip : function() {
			return $("#search_ip").val();
		},
		empCode : function() {
			return $("#search_empCode").val();
		},
		empName : function() {
			return $("#search_empName").val();
		},
		operDesc : function() {
			return $("#search_operDesc").val();
		},
		invokeStarttime : function() {
			return $("#search_invokeStarttime").val();
		},
		isSuccess : function() {
			if ($('#search_isSuccess1').is(':checked')) {
				return "1";
			} else if ($('#search_isSuccess2').is(':checked')) {
				return "0";
			}
		}
	};

	// 工具栏按钮配置
	bt.config.toolbar.btn = [ {
		id : "btn_view",
		text : "查看",
		icon : "fa-search",
		visible : true,
		disable : false,
		click : function(data) {
			var operDesc = bt.fn.getSelectRows()[0].operDesc;
			bt.fn.showView('查看操作日志详细 ', [ '1200px', '570px' ], $("#view_data_div").html(), data, function(layero, index) {

				$("#interIn", layero).html(data.interIn);
				$("#interOut", layero).html(data.interOut);
				$("input#operDesc", layero).val(operDesc);

				// 格式化json数据
				jf.processIn(layero);
				jf.processOut(layero);
				jf.CollapseLevel(4, layero, "in");
				jf.CollapseLevel(4, layero, "out");

				// 格式化类名
				var controllerClass = data.controllerClass.substring(data.controllerClass.lastIndexOf(".") + 1);
				$("#controllerClass", layero).html(controllerClass);

				// 格式化方法名
				var displayData = "";
				var strs = data.controllerMethod.substring(0, data.controllerMethod.lastIndexOf("(")).split(" ");
				$.each(strs, function(i, str) {
					if (str.indexOf(".") >= 0) {
						displayData = displayData + str.substring(str.lastIndexOf(".") + 1);
					} else {
						displayData = displayData + str;
					}
					displayData += " ";
				});
				var str2 = data.controllerMethod.substring(data.controllerMethod.lastIndexOf("(") + 1, data.controllerMethod.lastIndexOf(")"));
				str2 = str2.substring(str2.lastIndexOf(".") + 1);
				$("#controllerMethod", layero).val(displayData + "(" + str2 + ")");
				$("input#controllerMethodMapping", layero).val(data.controllerMethodMapping);

				// json展开收起符号点击触发事件
				$(".imgExp", layero).click(function() {
					jf.ExpImgClicked(this);
				});

				$.each(data, function(name, value) {
					var $input = layero.find("span[name=" + name + "]");
					if ($input.length > 0) {
						switch (name) {
						case "isSuccess":
							switch (value) {
							case 0:
								$input.text("失败");
								break;
							case 1:
								$input.text("成功");
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

	bt.config.datatables.columns = [ {// 配置datatable的数据结构，以及列属性
		visible : false,
		data : 'id'
	}, bt.datatables.columns.cs, bt.datatables.columns.seq, {
		data : 'empCode',
		title : '会员代码',

	}, {
		data : 'empName',
		title : '会员姓名',

	}, {
		data : 'operDesc',
		title : '操作描述',

	}, {
		data : 'ip',
		title : 'IP地址',
	}, {
		className : "text-center",
		data : 'isSuccess',
		title : '执行标记',
	}, {
		data : 'invokeStarttime',
		title : '操作开始时间',
	}, {
		data : 'invokeEndtime',
		title : '操作结束时间',
	} ];

	bt.config.datatables.columnDefs = [ {
		render : function(data, type, row, meta) {
			if (data == "0") {
				return "失败";
			} else if (data == "1") {
				return "成功";
			}
		},
		targets : [ 7 ]
	} ];

	// 初始化所有元素
	bt.fn.init(function(table) {
	});
});

/**
 * json格式化方法
 */
var jsonFunction = function() {
	var jsonStr = {
		dateObj : new Date(),
		regexpObj : new RegExp(),
		ImgCollapsed : "images/Collapsed.gif",
		ImgExpanded : "images/Expanded.gif",
		IsCollapsible : true,
		processIn : function(layero) {
			jsonStr.SetTab();
			var json = $("#interIn", layero).val();
			var html = "";
			try {
				if (json == "")
					json = "\"\"";
				var obj = eval("[" + json + "]");
				html = jsonStr.ProcessObject(obj[0], 0, false, false, false);
				$("#interInDiv", layero).html("<PRE class='CodeContainer'>" + html + "</PRE>");
			} catch (e) {
				alert("JSON数据格式不正确:\n" + e.message);
				$("#interInDiv", layero).html("");
			}
		},
		processOut : function(layero) {
			jsonStr.SetTab();
			var json = $("#interOut", layero).val();
			var html = "";
			try {
				if (json == "")
					json = "\"\"";
				var obj = eval("[" + json + "]");
				html = jsonStr.ProcessObject(obj[0], 0, false, false, false);
				$("#interOutDiv", layero).html("<PRE class='CodeContainer'>" + html + "</PRE>");
			} catch (e) {
				alert("JSON数据格式不正确:\n" + e.message);
				$("#interOutDiv", layero).html("");
			}
		},
		ProcessObject : function(obj, indent, addComma, isArray, isPropertyContent) {
			var html = "";
			var comma = (addComma) ? "<span class='Comma'>,</span> " : "";
			var type = typeof obj;
			var clpsHtml = "";
			if (jsonStr.IsArray(obj)) {
				if (obj.length == 0) {
					html += jsonStr.GetRow(indent, "<span style='color: #0033FF;font-weight: bold;' class='ArrayBrace'>[ ]</span>" + comma, isPropertyContent);
				} else {
					clpsHtml = jsonStr.IsCollapsible ? "<span><img src=\"" + jsonStr.ImgExpanded + "\" class='imgExp' /></span><span class='collapsible'>" : "";
					html += jsonStr.GetRow(indent, "<span style='color: #0033FF;font-weight: bold;' class='ArrayBrace'>[</span>" + clpsHtml, isPropertyContent);
					for (var i = 0; i < obj.length; i++) {
						html += jsonStr.ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
					}
					clpsHtml = jsonStr.IsCollapsible ? "</span>" : "";
					html += jsonStr.GetRow(indent, clpsHtml + "<span class='ArrayBrace' style='color: #0033FF;font-weight: bold;'>]</span>" + comma);
				}
			} else if (type == 'object') {
				if (obj == null) {
					html += jsonStr.FormatLiteral("null", "", comma, indent, isArray, "Null");
				} else if (obj.constructor == jsonStr.dateObj) {
					html += jsonStr.FormatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString() + "*/", "", comma, indent, isArray, "Date");
				} else if (obj.constructor == jsonStr.regexpObj) {
					html += jsonStr.FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
				} else {
					var numProps = 0;
					for ( var prop in obj)
						numProps++;
					if (numProps == 0) {
						html += jsonStr.GetRow(indent, "<span style='color: #00AA00;font-weight: bold;' class='ObjectBrace'>{ }</span>" + comma, isPropertyContent);
					} else {
						clpsHtml = jsonStr.IsCollapsible ? "<span><img src=\"" + jsonStr.ImgExpanded + "\" class='imgExp'/></span><span class='collapsible'>" : "";
						html += jsonStr.GetRow(indent, "<span style='color: #00AA00;font-weight: bold;' class='ObjectBrace'>{</span>" + clpsHtml, isPropertyContent);
						var j = 0;
						for ( var prop in obj) {
							var quote = window.QuoteKeys ? "\"" : "";
							html += jsonStr.GetRow(indent + 1, "<span style='color: #CC0000;font-weight: bold;' class='PropertyName'>" + quote + prop + quote + "</span>: " + jsonStr.ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true));
						}
						clpsHtml = jsonStr.IsCollapsible ? "</span>" : "";
						html += jsonStr.GetRow(indent, clpsHtml + "<span style='color: #00AA00;font-weight: bold;' class='ObjectBrace'>}</span>" + comma);
					}
				}
			} else if (type == 'number') {
				html += jsonStr.FormatLiteral(obj, "", comma, indent, isArray, "Number");
			} else if (type == 'boolean') {
				html += jsonStr.FormatLiteral(obj, "", comma, indent, isArray, "Boolean");
			} else if (type == 'function') {
				if (obj.constructor == jsonStr.regexpObj) {
					html += jsonStr.FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
				} else {
					obj = FormatFunction(indent, obj);
					html += jsonStr.FormatLiteral(obj, "", comma, indent, isArray, "Function");
				}
			} else if (type == 'undefined') {
				html += jsonStr.FormatLiteral("undefined", "", comma, indent, isArray, "Null");
			} else {
				html += jsonStr.FormatLiteral(obj.toString().split("\\").join("\\\\").split('"').join('\\"'), "\"", comma, indent, isArray, "String");
			}
			return html;
		},
		GetRow : function(indent, data, isPropertyContent) {
			var tabs = "";
			for (var i = 0; i < indent && !isPropertyContent; i++)
				tabs += window.TAB;
			if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n")
				data = data + "\n";
			return tabs + data;
		},
		IsArray : function(obj) {
			return obj && typeof obj === 'object' && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
		},
		FormatLiteral : function(literal, quote, comma, indent, isArray, style) {
			if (typeof literal == 'string') {
				literal = literal.split("<").join("&lt;").split(">").join("&gt;");
			}
			var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
			if (isArray) {
				str = jsonStr.GetRow(indent, str);
			}
			return str;
		},
		SetTab : function() {
			var select = "2";
			window.TAB = jsonStr.MultiplyString(parseInt(select), "  ");
		},
		MultiplyString : function(num, str) {
			var sb = [];
			for (var i = 0; i < num; i++) {
				sb.push(str);
			}
			return sb.join("");
		},
		ExpImgClicked : function(img) {
			if (img.parentNode) {
				var container = img.parentNode.nextSibling;
				if (!container) {
					return;
				}
				var disp = "none";
				var src = jsonStr.ImgCollapsed;
				if (container.style.display == "none") {
					disp = "inline";
					src = jsonStr.ImgExpanded;
				}
				container.style.display = disp;
				img.src = src;
			}
		},
		CollapseLevel : function(level, layero, flag) {
			if (flag == "in") {
				jsonStr.TraverseChildren($("#interInDiv", layero)[0], function(element, depth) {
					if (element.className == 'collapsible') {
						if (depth >= level) {
							jsonStr.MakeContentVisible(element, false);
						} else {
							jsonStr.MakeContentVisible(element, true);
						}
					}
				}, 0);
			} else if (flag == "out") {
				jsonStr.TraverseChildren($("#interOutDiv", layero)[0], function(element, depth) {
					if (element.className == 'collapsible') {
						if (depth >= level) {
							jsonStr.MakeContentVisible(element, false);
						} else {
							jsonStr.MakeContentVisible(element, true);
						}
					}
				}, 0);
			}
		},
		TraverseChildren : function(element, func, depth) {
			for (var i = 0; i < element.childNodes.length; i++) {
				jsonStr.TraverseChildren(element.childNodes[i], func, depth + 1);
			}
			func(element, depth);
		},
		MakeContentVisible : function(element, visible) {
			var img = element.previousSibling.firstChild;
			if (!!img.tagName && img.tagName.toLowerCase() == "img") {
				element.style.display = visible ? 'inline' : 'none';
				element.previousSibling.firstChild.src = visible ? jsonStr.ImgExpanded : jsonStr.ImgCollapsed;
			}
		}
	}
	return jsonStr;
}
