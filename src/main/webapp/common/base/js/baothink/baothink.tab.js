/**
 * tab控件 使用方法如下： 
 * $("#testTab").iniTab({ 
 * tabs : [ 
 * { 
 * title : "tab1", 
 * url : "demo/single_table/single_table_demo.html" 
 * }, { title : "tab2", url : "demo/single_table/single_table_demo.html" 
 * }, { title : "tab3", url : "demo/single_table/single_table_demo.html" } ] });
 */
;
(function($) {
	var BaothinkTab = function(element, options) {
		var that = this;
		// 存储tab标签iframe里面可操作的对象
		this.iframeBindBaothink = {};
		var iframeBindBaothink = this.iframeBindBaothink;
		this.bindCompleteTemp = options.bindComplete;
		this.tabTemplate = '';
		this.tabTemplate = this.tabTemplate + '<ul class="nav nav-tabs">';
		this.tabTemplate = this.tabTemplate + '	{{each tabs}}';
		this.tabTemplate = this.tabTemplate + '	<li {{if $index==0}}class="active"{{/if}}><a href="#tab_{{$index}}" data-toggle="tab" data-id="{{$index}}">{{$value.title}}</a></li>';
		this.tabTemplate = this.tabTemplate + '	{{/each}}';
		this.tabTemplate = this.tabTemplate + '</ul>';
		this.tabTemplate = this.tabTemplate + '<div class="tab-content">';
		this.tabTemplate = this.tabTemplate + '	{{each tabs}}';
		this.tabTemplate = this.tabTemplate + '	<div class="tab-pane {{if ($index==0)}}active{{/if}}" id="tab_{{$index}}">';
		this.tabTemplate = this.tabTemplate + '	</div>';
		this.tabTemplate = this.tabTemplate + '	{{/each}}';
		this.tabTemplate = this.tabTemplate + '</div>';
		this.element = $(element);
		var $element = this.element;
		this.container = options.container || 'body';

		var render = template.compile(this.tabTemplate);
		var html = render(options);
		$element.append(html);
		// tab点击切换事件
		$element.find(".nav-tabs a").click(function(e) {
			e.preventDefault();
			$(this).tab('show');
			if (options.tabs.length > 0) {
				var divId = $(this).attr("href");
				var index = $(this).attr("data-id");
				var $div = $element.find(divId);
				var tab = options.tabs[index];
				if (!$div.html() || $div.html().trim().length == 0) {
					// 判断是否是通过url链接来加载页面
					if (tab.url) {
						var url = "";
						if (tab.url.indexOf("http") == 0) {
							url = tab.url;
						} else {
							url = basePath + '' + tab.url;
							if (url.indexOf("?") > 0) {
								url = url + "&menuCode=" + menuCode;
							} else {
								url = url + "?menuCode=" + menuCode;
							}
						}
						$div.html('<iframe id="' + tab.id + '" src="' + url + '" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"/>');
					} else {
						$div.html(tab.content);
					}
				} else if (tab.reload) {
					var bt = iframeBindBaothink[tab.id];
					if (bt) {
						bt.fn.reload();
					}
				}
				var iframe = $("#" + tab.id)[0];
				if (iframe) {
					var tabSwitchAfter = function() {
						if (options.switchAfter) {
							options.switchAfter(tab.id, $(this));
						}
					}
					if (iframe.attachEvent) {
						iframe.attachEvent("onload", tabSwitchAfter);
					} else {
						iframe.onload = tabSwitchAfter;
					}
				} else {
					if (options.switchAfter) {
						options.switchAfter(tab.id, $(this));
					}
				}
				if (options.switchBefor) {
					options.switchBefor(tab.id);
				}
				// 存储当前选中的tab标签的id，供tab标签页面内部使用
				$(window).attr("SUB_TAB_ID", tab.id);
				// 存储tab标签
				$(window).attr("MAIN_TAB_TAG", $element);
			}
		});
		$element.find(".nav-tabs li.active a").click();
		$(window).resize(function() {
			$element.find(".tab-content").height($element.outerHeight() - $element.find(".nav-tabs").outerHeight());
		});
		$element.find(".tab-content").height($element.outerHeight() - $element.find(".nav-tabs").outerHeight());
	};
	BaothinkTab.prototype = {
		constructor : BaothinkTab,
		bindComplete : function(tabId, baothink) {
			this.iframeBindBaothink[tabId] = baothink;
			if (this.bindCompleteTemp) {
				this.bindCompleteTemp(tabId, baothink, this.element.find("iframe"));
			}
		}
	};
	$.fn.baothinkTab = function(option) {
		this.defaults = {
			tabs : [],
			switchBefor : function(id) {
			},
			switchAfter : function(id, iframeObj) {
			},
			bindComplete : function(id, baohitnk, iframeObj) {
			}
		};
		var args = Array.apply(null, arguments);
		args.shift();
		var $this = $(this);
		var internal_return;
		this.each(function() {
			var data = $this.data('baothinktab');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('baothinktab', (data = new BaothinkTab(this, $.extend({}, this.defaults, options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined) {
					return false;
				}
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	}
})(jQuery);
