;
(function($) {
	'use strict';
	var pluginName = 'CutWebsocket';
	var version = '0.1';

	var CutWebsocket = function(options) {
		var $self = $(this) || $(document);
		CutWebsocket.options = $.extend({}, CutWebsocket.options, options);
		if (CutWebsocket.options.sid == undefined) {
			console.log("sid can not be null");
			return false;
		}
		CutWebsocket.options.url = CutWebsocket.options.contextBase + CutWebsocket.options.url;
		CutWebsocket._init($self);
	};

	// 配置
	CutWebsocket.options = {
		contextBase : 'http://127.0.0.1:18080',// 路径路径
		url : '/portfolio',// 初始WS
		initUrl : '/app/msgcenter/init/{sid}',// 初始化登陆用户信息
		sysMsgUrl : '/user/{token}/u/sysmsg',// 订阅站内消息
		callbackSysMsg : function(data) {
			console.log(data);
		},
		publicNoticeUrl : '/queue/publicNotice',// 广播公告
		callbackpublicNotice : function(data) {
			console.log(data);
		},
		enablePublicNotice : false,// 是否启用广播公告
		debug : false,
		sid : undefined
	};

	CutWebsocket._init = function($element) {
		var socket;
		if (/Firefox\/\s/.test(navigator.userAgent)) {
			socket = new SockJS(CutWebsocket.options.url, null, {
				protocols_whitelist : [ 'xhr-polling' ]
			});
		} else if (/MSIE (\d+.\d+);/.test(navigator.userAgent)) {
			socket = new SockJS(CutWebsocket.options.url, null, {
				protocols_whitelist : [ 'iframe-xhr-polling' ]
			});
		} else {
			socket = new SockJS(CutWebsocket.options.url, null, {
				protocols_whitelist : [ 'iframe-xhr-polling' ]
			});
		}

		var stompClient = Stomp.over(socket);
		if (!CutWebsocket.options.debug) {
			stompClient.debug = null;
		}
		stompClient.connect({}, function(frame) {
			if (frame.command == 'CONNECTED') {
				var sid = CutWebsocket.options.sid == undefined ? new Date().getTime() : CutWebsocket.options.sid;

				stompClient.subscribe(getUrlByTemplate(CutWebsocket.options.initUrl, {
					sid : sid
				}), function(data) {
					var $data = JSON.parse(data.body);
					if ($data.success == true) {
						var token = $data.data;

						if (CutWebsocket.options.enablePublicNotice) {
							// 公告
							var publicNoticeUrl = CutWebsocket.options.publicNoticeUrl;
							stompClient.subscribe(publicNoticeUrl, function(data) {
								var $result = JSON.parse(data.body);
								if ($result.success) {
									CutWebsocket.options.callbackpublicNotice($result.data);
								} else {
									console.log($result.errorMsg);
								}
							});
						}

						// sid,userid -> token
						stompClient.subscribe(getUrlByTemplate(CutWebsocket.options.sysMsgUrl, {
							token : token
						}), function(data) {
							var $result = JSON.parse(data.body).data;
							CutWebsocket.options.callbackSysMsg($result);
						});
					}
				}, function(error) {
					stompClient.disconnect();
				});
			}

		});

		function getUrlByTemplate(url, obj) {
			for ( var key in obj) {
				url = url.replace('{' + key + '}', obj[key]);
			}
			return url;
		}

		CutWebsocket.stompClient = stompClient;
	}

	$.fn.CutWebsocket = CutWebsocket;

})(jQuery);
