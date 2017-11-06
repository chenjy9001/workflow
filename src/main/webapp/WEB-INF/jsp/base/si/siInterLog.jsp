<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>接口日志</title>
<c:import url="../../common/head.jsp" />
</head>
<body class="gray-bg">
	<div class="wrapper wrapper-content animated fadeInRight">
		<div class="ibox float-e-margins">
			<div class="ibox-content">
				<div id="toolbar">
					<!-- 工具栏，显示操作按钮和模糊搜索 -->
				</div>
				<div id="div-advanced-search" style="display: none;">
					<form class="form-horizontal well clearfix">
						<div class="form-group">
							<label class="control-label col-xs-1">接口代码：</label>
							<div class="col-xs-2">
								<input id="search_sicode" name=sicode type="text" class="form-control  input-sm" aria-required="true">
							</div>
							<label class="control-label col-xs-1">接口名称：</label>
							<div class="col-xs-2">
								<input id="search_siname" name=siname type="text" class="form-control  input-sm" aria-required="true">
							</div>
							<label class="control-label col-xs-1">调用者账号：</label>
							<div class="col-xs-2">
								<input id="search_siaccno" name=siaccno type="text" class="form-control  input-sm" aria-required="true">
							</div>
							<label class="control-label col-xs-1">响应结果代码：</label>
							<div class="col-xs-2">
								<input id="search_responseResultCode" name=responseResultCode type="text" class="form-control  input-sm" aria-required="true">
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-xs-1">请求时间：</label>
							<div class="col-xs-2">
								<input data-type="datetimerange" id="search_requestTime" name="requestTime" type="text" class="form-control  input-sm">
							</div>
							<div class="btn-group pull-right" style="margin-right: 15px;">
								<button type="button" class="btn btn-primary btn-sm" id="btn-advanced-rest">
									<i class="fa fa-reset"></i> 重置
								</button>
								<button type="button" class="btn btn-primary btn-sm" id="btn-advanced-search">
									<i class="fa fa-search"></i> 查询
								</button>
							</div>
						</div>
					</form>
				</div>
				<div class="row row-lg">
					<div class="col-xs-12">
						<table id="dataTable" class="table table-striped table-bordered">
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<c:import url="../../common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/js/base/si/siInterLog.js'/>"></script>
</body>
</html>