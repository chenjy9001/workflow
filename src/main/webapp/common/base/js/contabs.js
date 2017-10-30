$(function() {
	$('.J_menuTabs').on('click', '.J_menuTab', activeTab);

	$('.J_menuTabs').on('click', '.J_menuTab i', closeTab);

	$('.J_menuTabs').on('dblclick', '.J_menuTab', refreshTab);

	// 左移按扭
	$('.J_tabLeft').on('click', scrollTabLeft);

	// 右移按扭
	$('.J_tabRight').on('click', scrollTabRight);

	// 关闭全部
	$('.J_tabCloseAll').on('click', function() {
		$('.page-tabs-content').children("[data-id]").not(":first").each(function() {
			$('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
			$(this).remove();
		});
		$('.page-tabs-content').children("[data-id]:first").each(function() {
			$('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
			$(this).addClass("active");
		});
		$('.page-tabs-content').css("margin-left", "0");
	});
	$('.J_tabCloseOther').on('click', closeOtherTabs);

	$('.J_tabShowActive').on('click', showActiveTab);
});

function initMenuClick() {
	// 通过遍历给菜单项加上data-index属性
	$(".J_menuItem").each(function(index) {
		if (!$(this).attr('data-index')) {
			$(this).attr('data-index', index);
		}
	});
	$('.J_menuItem,#personalData').unbind('click').on('click', menuItem);
	$("#personalData").on('click', function() {
		$(this).parents("li.dropdown").removeClass("open");
	});
}
// 计算元素集合的总宽度
function calSumWidth(elements) {
	var width = 0;
	$(elements).each(function() {
		width += $(this).outerWidth(true);
	});
	return width;
}
// 滚动到指定选项卡
function scrollToTab(element) {
	var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
	// 可视区域非tab宽度
	var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
	// 可视区域tab宽度
	var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
	// 实际滚动宽度
	var scrollVal = 0;
	if ($(".page-tabs-content").outerWidth() < visibleWidth) {
		scrollVal = 0;
	} else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
		if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
			scrollVal = marginLeftVal;
			var tabElement = element;
			while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
				scrollVal -= $(tabElement).prev().outerWidth();
				tabElement = $(tabElement).prev();
			}
		}
	} else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
		scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
	}
	$('.page-tabs-content').animate({
		marginLeft : 0 - scrollVal + 'px'
	}, "fast");
}
// 查看左侧隐藏的选项卡
function scrollTabLeft() {
	var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
	// 可视区域非tab宽度
	var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
	// 可视区域tab宽度
	var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
	// 实际滚动宽度
	var scrollVal = 0;
	if ($(".page-tabs-content").width() < visibleWidth) {
		return false;
	} else {
		var tabElement = $(".J_menuTab:first");
		var offsetVal = 0;
		while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {// 找到离当前tab最近的元素
			offsetVal += $(tabElement).outerWidth(true);
			tabElement = $(tabElement).next();
		}
		offsetVal = 0;
		if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
			while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
				offsetVal += $(tabElement).outerWidth(true);
				tabElement = $(tabElement).prev();
			}
			scrollVal = calSumWidth($(tabElement).prevAll());
		}
	}
	$('.page-tabs-content').animate({
		marginLeft : 0 - scrollVal + 'px'
	}, "fast");
}
// 查看右侧隐藏的选项卡
function scrollTabRight() {
	var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
	// 可视区域非tab宽度
	var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
	// 可视区域tab宽度
	var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
	// 实际滚动宽度
	var scrollVal = 0;
	if ($(".page-tabs-content").width() < visibleWidth) {
		return false;
	} else {
		var tabElement = $(".J_menuTab:first");
		var offsetVal = 0;
		while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {// 找到离当前tab最近的元素
			offsetVal += $(tabElement).outerWidth(true);
			tabElement = $(tabElement).next();
		}
		offsetVal = 0;
		while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
			offsetVal += $(tabElement).outerWidth(true);
			tabElement = $(tabElement).next();
		}
		scrollVal = calSumWidth($(tabElement).prevAll());
		if (scrollVal > 0) {
			$('.page-tabs-content').animate({
				marginLeft : 0 - scrollVal + 'px'
			}, "fast");
		}
	}
}
// 关闭选项卡菜单
function closeTab() {
	var closeTabId = $(this).parents('.J_menuTab').data('id');
	var currentWidth = $(this).parents('.J_menuTab').width();

	// 当前元素处于活动状态
	if ($(this).parents('.J_menuTab').hasClass('active')) {

		// 当前元素后面有同辈元素，使后面的一个元素处于活动状态
		if ($(this).parents('.J_menuTab').next('.J_menuTab').size()) {

			var activeId = $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').data('id');
			$(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').addClass('active');

			$('.J_mainContent .J_iframe').each(function() {
				if ($(this).data('id') == activeId) {
					$(this).show().siblings('.J_iframe').hide();
					return false;
				}
			});

			var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
			if (marginLeftVal < 0) {
				$('.page-tabs-content').animate({
					marginLeft : (marginLeftVal + currentWidth) + 'px'
				}, "fast");
			}

			// 移除当前选项卡
			$(this).parents('.J_menuTab').remove();

			// 移除tab对应的内容区
			$('.J_mainContent .J_iframe').each(function() {
				if ($(this).data('id') == closeTabId) {
					$(this).remove();
					return false;
				}
			});
		}

		// 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
		if ($(this).parents('.J_menuTab').prev('.J_menuTab').size()) {
			var activeId = $(this).parents('.J_menuTab').prev('.J_menuTab:last').data('id');
			$(this).parents('.J_menuTab').prev('.J_menuTab:last').addClass('active');
			$('.J_mainContent .J_iframe').each(function() {
				if ($(this).data('id') == activeId) {
					$(this).show().siblings('.J_iframe').hide();
					return false;
				}
			});

			// 移除当前选项卡
			$(this).parents('.J_menuTab').remove();

			// 移除tab对应的内容区
			$('.J_mainContent .J_iframe').each(function() {
				if ($(this).data('id') == closeTabId) {
					$(this).remove();
					return false;
				}
			});
		}
	}
	// 当前元素不处于活动状态
	else {
		// 移除当前选项卡
		$(this).parents('.J_menuTab').remove();

		// 移除相应tab对应的内容区
		$('.J_mainContent .J_iframe').each(function() {
			if ($(this).data('id') == closeTabId) {
				$(this).remove();
				return false;
			}
		});
		scrollToTab($('.J_menuTab.active'));
	}
	return false;
}
// 关闭其他选项卡
function closeOtherTabs() {
	$('.page-tabs-content').children("[data-id]").not(":first").not(".active").each(function() {
		$('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
		$(this).remove();
	});
	$('.page-tabs-content').css("margin-left", "0");
}
// 滚动到已激活的选项卡
function showActiveTab() {
	scrollToTab($('.J_menuTab.active'));
}
// 点击选项卡菜单
function activeTab() {
	if (!$(this).hasClass('active')) {
		var currentId = $(this).data('id');
		// 显示tab对应的内容区
		$('.J_mainContent .J_iframe').each(function() {
			if ($(this).data('id') == currentId) {
				$(this).show().siblings('.J_iframe').hide();
				return false;
			}
		});
		$(this).addClass('active').siblings('.J_menuTab').removeClass('active');
		scrollToTab(this);
	}
}
// 刷新iframe
function refreshTab() {
	var target = $('.J_iframe[data-id="' + $(this).data('id') + '"]');
	var url = target.attr('src');
	// //显示loading提示
	// var loading = layer.load();
	// target.attr('src', url).load(function () {
	// //关闭loading提示
	// layer.close(loading);
	// });
}
function menuItem() {
	// 获取标识数据
	var dataUrl = $(this).attr('href');
	var dataIndex = $(this).data('index');
	var menuName = $.trim($(this).text());
	var flag = true;
	if (dataUrl == undefined || $.trim(dataUrl).length == 0 || $.trim(dataUrl) == "#") {
		return false;
	} else if (dataUrl.indexOf("login.html") > 0) {
		top.document.location.href = basePath + 'login.html';
	}
	// 选项卡菜单已存在
	$('.J_menuTab').each(function() {
		// 判断菜单操作类型（oType=1，说明替换一打开的标签，默认，相同url，不同参数，会打开不同的标签页）
		if (dataUrl.indexOf("oType=1") > 0) {
			if ($(this).data('id').split("?")[0] == dataUrl.split("?")[0]) {
				if (!$(this).hasClass('active')) {
					$(this).addClass('active').siblings('.J_menuTab').removeClass('active');
					scrollToTab(this);
					$(this).data("id", dataUrl);
				}
				// 显示tab对应的内容区
				$('.J_mainContent .J_iframe').each(function() {
					if ($(this).data('id') == dataUrl) {
						$(this).show().siblings('.J_iframe').hide();
						flag = false;
						return false;
					} else if ($(this).data('id').split("?")[0] == dataUrl.split("?")[0]) {
						$(this).remove().siblings('.J_iframe').hide();
						// 添加选项卡对应的iframe
						var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
						$('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
						$(this).data('id', dataUrl);
						flag = false;
						return false;
					}
				});
			}
		} else {
			if ($(this).data('id') == dataUrl) {
				if (!$(this).hasClass('active')) {
					$(this).addClass('active').siblings('.J_menuTab').removeClass('active');
					scrollToTab(this);
					// 显示tab对应的内容区
					$('.J_mainContent .J_iframe').each(function() {
						if ($(this).data('id') == dataUrl) {
							$(this).show().siblings('.J_iframe').hide();
							return false;
						}
					});
				}
				flag = false;
				return false;
			}
		}
	});

	// 选项卡菜单不存在
	if (flag) {
		var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
		$('.J_menuTab').removeClass('active');

		// 添加选项卡对应的iframe
		var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
		$('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);

		// 显示loading提示
		// var loading = layer.load();
		//
		// $('.J_mainContent iframe:visible').load(function() {
		// // iframe加载完成后隐藏loading提示
		// layer.close(loading);
		// });
		// 添加选项卡
		$('.J_menuTabs .page-tabs-content').append(str);
		scrollToTab($('.J_menuTab.active'));
	}
	return false;
}