<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>欢迎页</title>
<c:import url="common/head.jsp" />
<!-- Morris图表插件 -->
</head>
<body class="gray-bg">
	<div class="wrapper wrapper-content" style="padding: 15px;">
		<div class="row">
			<div class="col-sm-3">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<span class="label label-success pull-right">全部</span>
						<h5>累计访客数</h5>
					</div>
					<div class="ibox-content">
						<h1 class="no-margins" data-name="cumulativeNumberOfVisitors"></h1>
						<div class="stat-percent font-bold text-success" style="display: none;">
							98% <i class="fa fa-bolt"></i>
						</div>
						<small>&nbsp;</small>
					</div>
				</div>
			</div>
			<div class="col-sm-3">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<span class="label label-info pull-right">今天</span>
						<h5>在线用户数</h5>
					</div>
					<div class="ibox-content">
						<h1 class="no-margins" data-name="onlineUser"></h1>
						<div class="stat-percent font-bold text-info">
							<span data-name="onlieUserRate"></span> <i class="fa fa-level-up"></i>
						</div>
						<small>新在线用户比</small>
					</div>
				</div>
			</div>
			<div class="col-sm-3">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<span class="label label-primary pull-right">全部</span>
						<h5>注册用户数</h5>
					</div>
					<div class="ibox-content">
						<h1 class="no-margins" data-name="regeditUser"></h1>
						<div class="stat-percent font-bold text-navy" style="display: none;">
							44% <i class="fa fa-level-up"></i>
						</div>
						<small>&nbsp;</small>
					</div>
				</div>
			</div>
			<div class="col-sm-3">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<span class="label label-danger pull-right">今天</span>
						<h5>新独立访客</h5>
					</div>
					<div class="ibox-content">
						<h1 class="no-margins" data-name="newCumulativeNumberOfVisitors"></h1>
						<div class="stat-percent font-bold text-danger">
							<span data-name="newCumulativeNumberOfVisitorsRate"></span> <i class="fa fa-level-down"></i>
						</div>
						<small>新独立访客比</small>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12">
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<h5>订单</h5>
						<div class="pull-right">
							<!-- Nav tabs -->
							<ul class="nav nav-tabs" role="tablist">
								<li role="presentation" class="active"><a href="#echart-day" role="tab" data-toggle="tab">当月</a></li>
								<li role="presentation"><a href="#echart-month" role="tab" data-toggle="tab">当年</a></li>
								<li role="presentation"><a href="#echart-year" role="tab" data-toggle="tab">十年</a></li>
							</ul>
						</div>
					</div>
					<div class="ibox-content">
						<div class="row">
							<div class="col-sm-9 tab-content">
								<div role="tabpanel" class="tab-pane active" id="echart-day">
									<div data-type="echart" id="day" style="height: 300px"></div>
								</div>
								<div role="tabpanel" class="tab-pane" id="echart-month">
									<div data-type="echart" id="month" style="height: 300px;"></div>
								</div>
								<div role="tabpanel" class="tab-pane" id="echart-year">
									<div data-type="echart" id="year" style="height: 300px"></div>
								</div>
							</div>
							<div class="col-sm-3">
								<ul class="stat-list">
									<li>
										<h2 class="no-margins">
											<span data-field="countOrder"></span>
										</h2> <small>订单总数</small>
										<div class="stat-percent">
											48% <i class="fa fa-level-up text-navy"></i>
										</div>
										<div class="progress progress-mini">
											<div style="width: 48%;" class="progress-bar"></div>
										</div>
									</li>
									<li>
										<h2 class="no-margins ">
											<span data-field="countLastMonthOrder"></span>
										</h2> <small>最近一个月订单</small>
										<div class="stat-percent">
											60% <i class="fa fa-level-down text-navy"></i>
										</div>
										<div class="progress progress-mini">
											<div style="width: 60%;" class="progress-bar"></div>
										</div>
									</li>
									<li>
										<h2 class="no-margins ">
											<span data-field="countLastMonthSales"></span>
										</h2> <small>最近一个月销售额</small>
										<div class="stat-percent">
											22% <i class="fa fa-bolt text-navy"></i>
										</div>
										<div class="progress progress-mini">
											<div style="width: 22%;" class="progress-bar"></div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>


				</div>
			</div>
		</div>


		<div class="row">
			<div class="col-sm-12">
				<div class="row">
					<div class="col-sm-6">
						<div class="ibox float-e-margins">
							<div class="ibox-title">
								<h5>系统信息</h5>
								<div class="ibox-tools">
									<a class="collapse-link"> <i class="fa fa-chevron-up"></i>
									</a> <a class="close-link"> <i class="fa fa-times"></i>
									</a>
								</div>
							</div>
							<div class="ibox-content" style="height: 321px;">
								<div class="row">
									<div class="col-sm-12">
										<table class="table table-striped table-bordered">
											<tr><td style="line-height: 30px;font-weight: bold;">产品版本：</td><td>ecp-demo-web-admin 0.0.1</td></tr>
											<tr><td style="line-height: 30px;font-weight: bold;">License类型：</td><td>试用版/企业版/无限制</td></tr>
											<tr><td style="line-height: 30px;font-weight: bold;">License有效期：</td><td>2017年01月01日</td></tr>
											<tr><td style="line-height: 30px;font-weight: bold;">授权版块：</td><td>系统模块，前台组件，消息中心，任务调度中心等</td></tr>
											<tr><td style="line-height: 30px;font-weight: bold;">操作系统：</td><td><span data-field="os.name"><%=System.getProperty("os.name") %></span></td></tr>
											<tr><td style="line-height: 30px;font-weight: bold;">JDK版本：</td><td><span data-field="java.version"><%=System.getProperty("java.version") %></span></td></tr>
											<tr><td style="line-height: 30px;font-weight: bold;">临时目录：</td><td><span data-field="java.io.tmpdir"><%=System.getProperty("java.io.tmpdir") %></span></td></tr>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="ibox float-e-margins">
							<div class="ibox-title">
								<h5>服务器信息</h5>
								<div class="ibox-tools">
									<a class="collapse-link"> <i class="fa fa-chevron-up"></i>
									</a> <a class="close-link"> <i class="fa fa-times"></i>
									</a>
								</div>
							</div>
							<div class="ibox-content">
								<div class="row">
									<div id="world-map" style="height: 300px;" class="col-sm-6"></div>
									<div class="col-sm-6">
										<ul class="stat-list">
											<li>
												<h5 class="no-margins">
													<small>硬盘总空间：</small> <span data-field="countTotal"></span>G
												</h5>
												<div class="progress progress-mini">
													<div style="width: 48%;" class="progress-bar"></div>
												</div>
											</li>
											<li>
												<h5 class="no-margins">
													<small>应用服务器剩余空间：</small><span data-field="countAppFreeTotal"></span>G
												</h5>
												<div class="progress progress-mini">
													<div style="width: 60%;" class="progress-bar"></div>
												</div>
											</li>
											<li>
												<h5 class="no-margins">
													<small>剩余硬盘空间：</small><span data-field="countFreeTotal"></span>G
												</h5>
												<div class="progress progress-mini">
													<div style="width: 22%;" class="progress-bar"></div>
												</div>
											</li>
										</ul>
										<hr />
										<ul class="stat-list">
											<li>
												<h5 class="no-margins">
													<small>物理内存总容量：</small><span data-field="totalPhysicalMemorySize"></span>M
												</h5>
												<div class="progress progress-mini">
													<div style="width: 48%;" class="progress-bar"></div>
												</div>
											</li>
											<li>
												<h5 class="no-margins">
													<small>剩余物理内存容量：</small><span data-field="freePhysicalMemorySize"></span>M
												</h5>
												<div class="progress progress-mini">
													<div style="width: 60%;" class="progress-bar"></div>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<c:import url="common/bottom.jsp"></c:import>
	<script src="js/demo/peity/jquery.peity.min.js"></script>
	<script src="js/demo/peity-demo.min.js"></script>
	<script src="js/demo/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
	<script src="js/demo/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
	<script src="js/demo/easypiechart/jquery.easypiechart.js"></script>
	<script src="js/demo/sparkline/jquery.sparkline.min.js"></script>
	<script src="js/demo/sparkline-demo.min.js"></script>

	<!-- <script type="text/javascript" src="/ecp-demo-web-admin/common/plugins/mock/mock-min.js"></script> -->

	<script>
		$(function() {
			//访问日志统计，头部4个统计
			$.getJSON(basePath + 'log/vsitelog/tjindex', function(data) {
				if (data.success) {
					var $data = data.data;
					for ( var key in $data) {
						$('[data-name=' + key + ']').html($data[key]);
					}
				}
			});
			/* Mock.mock(basePath + 'tj/order', {
				'success' : true,
				'data' : {
					'echart' : {
						'day' : {
							'title' : '订单数及销售额统计',
							'x' : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
							'y' : [ {
								'legend' : '订单数',
								'data' : [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3 ]
							}, {
								'legend' : '销售额',
								'data' : [ 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3 ]
							} ]
						},
						'month' : {
							'title' : '订单数及销售额统计1',
							'x' : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
							'y' : [ {
								'legend' : '订单数',
								'data' : [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3 ]
							}, {
								'legend' : '销售额',
								'data' : [ 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3 ]
							} ]
						},
						'year' : {
							'title' : '订单数及销售额统计2',
							'x' : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
							'y' : [ {
								'legend' : '订单数',
								'data' : [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3 ]
							}, {
								'legend' : '销售额',
								'data' : [ 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3 ]
							} ]
						}
					},
					'overview' : {
						'countOrder' : '2,346',
						'countLastMonthOrder' : '4,422',
						'countLastMonthSales' : '9,180'
					}
				}
			}); */

			//订单统计
			$.getJSON(basePath + '/demo/monitor/order', function(data) {
				if (data.success) {
					$overview = data.data.overview;
					for ( var key in $overview) {
						$('span[data-field=' + key + ']').html($overview[key]);
					}
					var $data = data.data.echart;
					for ( var key in $data) {
						var $result = $data[key];
						var $series = new Array();
						var $legend = new Array();
						$.each($result.y, function(index) {
							var vjson = {
								name : this.legend,
								type : 'bar',
								data : this.data,
								markPoint : {
									data : [ {
										type : 'max',
										name : '最大值'
									}, {
										type : 'min',
										name : '最小值'
									} ]
								}
							};
							$legend.push(this.legend);
							$series.push(vjson);
						})

						var myChart = echarts.init(document.getElementById(key));
						var option = {
							title : {
								text : $result.title
							},
							tooltip : {
								trigger : 'axis'
							},
							legend : {
								data : $legend
							},
							toolbox : {
								show : true,
								feature : {
									magicType : {
										show : true,
										type : [ 'line', 'bar' ]
									},									
									saveAsImage : {
										show : true
									}
								}
							},
							calculable : true,
							xAxis : [ {
								type : 'category',
								data : $result.x
							} ],
							yAxis : [ {
								type : 'value'
							} ],
							series : $series
						};
						myChart.setOption(option);
						//window.onresize = myChart.resize;
					}
					//重新渲染图象的大小
					$('ul[role=tablist] li a').click(function(e) {
						e.preventDefault();
						$(this).tab('show');
						$.each($("[data-type=echart]"), function() {
							echarts.getInstanceByDom($(this)[0]).resize();
						});
					});
				}
			});

			//服务器使用情况
			function serverInfo() {
				$.getJSON(basePath + '/demo/monitor/serverInfo', function(data) {
					if(!data.success){
						return;
					}
					var $data = data.data;
					
					//
					for ( var key in $data.usedDisk) {
						$('span[data-field=' + key + ']').html($data.usedDisk[key]);
					}
					for ( var key in $data.memory) {
						$('span[data-field=' + key + ']').html($data.memory[key]);
					}
					
					//JVM
					var option = {
						tooltip : {
							formatter : "{a} <br/>{b} : {c}%"
						},
						series : [ {
							name : 'JVM使用情况',
							type : 'gauge',
							detail : {
								formatter : '{value}%',
								offsetCenter:[0, '60%']
							},
							data : [ {
								value : ((1 - $data.jvm.freeMemory /$data.jvm.memory)*100).toFixed(1),
								name : 'JVM使用率'
							} ]
						} ]
					};
					
					var myChart = echarts.getInstanceByDom(document.getElementById("world-map"))
					if (myChart == undefined) {
						myChart = echarts.init(document.getElementById("world-map"));
					}
					myChart.setOption(option);
				});
			}
			serverInfo();
			//setInterval(serverInfo, 2000);

		});
	</script>
</body>
</html>