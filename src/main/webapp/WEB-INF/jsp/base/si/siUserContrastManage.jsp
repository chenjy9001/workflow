<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>接口账号对照管理</title>
<c:import url="../../common/head.jsp" />
</head>
<body>
	<div id="menufunc_panel" class="wrapper wrapper-content animated fadeInRight">
		<div class="ibox float-e-margins">
			<div class="ibox-content">
				<div id="toolbar">
					<!-- 工具栏，显示操作按钮和模糊搜索 -->
				</div>
				<div class="row row-lg">
					<table id="dataTable" class="table table-striped table-bordered">
					</table>
				</div>
			</div>
		</div>
	</div>
	<!--新增表单-->
	<div id="add_data_div" class="ibox-content hide" class="hide">
		<form id="add_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入账号：</label>
				<div class="col-xs-10">
					<input id="siaccno" name="siaccno" type="text" class="form-control" maxlength="15" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口代码：</label>
				<div class="col-xs-10">
					<select id="sicode" name="sicode" data-type="selecttable" data-url="<c:url value='/si/siUserContrast/loadByPage.htm'/>" data-search="true" class="form-control" data-for="siname" data-for-field="siname"></select>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口名称：</label>
				<div class="col-xs-10">
					<input id="siname" type="text" class="form-control" name="siname" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">限制次数：</label>
				<div class="col-xs-2" style="width: 180px;">
					<input type="radio" id="limitFlag1" name="limitFlag" value="0" checked="checked"></input> <label for="limitFlag1">不限制 </label> 
					<input type="radio" id="limitFlag2" name="limitFlag" value="1"></input> <label for="limitFlag2">限制 </label>
				</div>
				<div class="hidelimit hide">
					<label class="col-xs-2 control-label" style="width: 76px;">使用类型：</label>
					<div class="col-xs-3">
						<input type="radio" id="limitType1" name="limitType" value="10" checked="checked"></input> <label for="limitType1">天 </label> 
						<input type="radio" id="limitType2" name="limitType" value="20"></input> <label for="limitType2">时 </label> 
						<input type="radio" id="limitType3" name="limitType" value="30"></input> <label for="limitType3">分 </label>
					</div>
				<label class="col-xs-2 control-label" style="width: 100px;">限制调用次数：</label>
				<div class="col-xs-2">
					<input id="limitCount" type="text" class="form-control" name="limitCount" maxlength="9">
				</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">限制间隔时间：</label>
				<div class="col-xs-4" style="width: 180px;">
					<input type="radio" id="intervalFlag1" name="intervalFlag" value="10" checked="checked"></input> <label for="intervalFlag1">不限制 </label> <input type="radio" id="intervalFlag2" name="intervalFlag" value="20"></input> <label for="intervalFlag2">限制 </label>
				</div>
				<div class="hideinterval hide">
				<label class="col-xs-2 control-label" style="width: 120px;">间隔时间（秒）：</label>
				<div class="col-xs-4" style="width: 388px;">
					<input id="timeInterval" type="text" class="form-control" name="timeInterval" maxlength="9">
				</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">是否启用：</label>
				<div class="col-xs-10">
					<input type="radio" id="validFlag1" name="validFlag" value="1" checked="checked"></input> <label for="validFlag1">启用</label> <input type="radio" id="validFlag2" name="validFlag" value="0"></input> <label for="validFlag2">禁用</label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="3" style="resize: none;" id="notes" name="notes" class="form-control" maxlength="200"></textarea>
				</div>
			</div>
		</form>
	</div>
	<!--修改表单-->
	<div id="modify_data_div" class="ibox-content hide" class="hide">
		<form id="modify_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<input id="id" name="id" type="hidden" /> <input id="orderNo" name="orderNo" type="hidden" />
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入账号：</label>
				<div class="col-xs-10">
					<input id="siaccno" name="siaccno" type="text" class="form-control" maxlength="15" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口代码：</label>
				<div class="col-xs-10">
					<input id="sicode" name="sicode" type="text" class="form-control" maxlength="15" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接口名称：</label>
				<div class="col-xs-10">
					<input id="siname" type="text" class="form-control" name="siname" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">限制次数：</label>
				<div class="col-xs-2" style="width: 180px;">
					<input type="radio" id="limitFlag1" name="limitFlag" value="0" checked="checked"></input> <label for="limitFlag1">不限制 </label> 
					<input type="radio" id="limitFlag2" name="limitFlag" value="1"></input> <label for="limitFlag2">限制 </label>
				</div>
				<div class="hidelimit hide">
					<label class="col-xs-2 control-label" style="width: 76px;">使用类型：</label>
					<div class="col-xs-3">
						<input type="radio" id="limitType1" name="limitType" value="10" checked="checked"></input> <label for="limitType1">天 </label> 
						<input type="radio" id="limitType2" name="limitType" value="20"></input> <label for="limitType2">时 </label> 
						<input type="radio" id="limitType3" name="limitType" value="30"></input> <label for="limitType3">分 </label>
					</div>
				<label class="col-xs-2 control-label" style="width: 100px;">限制调用次数：</label>
				<div class="col-xs-2">
					<input id="limitCount" type="text" class="form-control" name="limitCount" maxlength="9">
				</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">限制间隔时间：</label>
				<div class="col-xs-4" style="width: 180px;">
					<input type="radio" id="intervalFlag1" name="intervalFlag" value="10" checked="checked"></input> <label for="intervalFlag1">不限制 </label> 
					<input type="radio" id="intervalFlag2" name="intervalFlag" value="20"></input> <label for="intervalFlag2">限制 </label>
				</div>
				<div class="hideinterval hide">
				<label class="col-xs-2 control-label" style="width: 120px;">间隔时间（秒）：</label>
				<div class="col-xs-4" style="width: 400px;">
					<input id="timeInterval" type="text" class="form-control" name="timeInterval" maxlength="9">
				</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">是否启用：</label>
				<div class="col-xs-10">
					<input type="radio" id="validFlag1" name="validFlag" value="1" checked="checked"></input> <label for="validFlag1">启用</label> <input type="radio" id="validFlag2" name="validFlag" value="0"></input> <label for="validFlag2">禁用</label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="3" style="resize: none;" id="notes" name="notes" class="form-control" maxlength="200"></textarea>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">创建人：</label>
				<div class="col-xs-4">
					<input id="createEName" name="createEName" class="form-control" readonly="readonly"></input>
				</div>
				<label class="col-xs-2 control-label">创建时间：</label>
				<div class="col-xs-4">
					<input id="createDate" name="createDate" class="form-control" readonly="readonly"></input>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">修改人：</label>
				<div class="col-xs-4">
					<input id="updateEName" name="updateEName" class="form-control" readonly="readonly"></input>
				</div>
				<label class="col-xs-2 control-label">修改时间：</label>
				<div class="col-xs-4">
					<input id="updateDate" name="updateDate" class="form-control" readonly="readonly"></input>
				</div>
			</div>
		</form>
	</div>
	<!--查看表单-->
	<div id="view_data_div" class="ibox-content hide" class="hide">
		<form id="view_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<input id="id" name="id" type="hidden">
			<div class="form-group">
				<label class="col-xs-2 control-label">接入账号：</label>
				<div class="col-xs-4">
					<span id="siaccno" name="siaccno" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">接口代码：</label>
				<div class="col-xs-4">
					<span id="sicode" name="sicode" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">接口名称：</label>
				<div class="col-xs-4">
					<span id="siname" name="siname" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">限制次数：</label>
				<div class="col-xs-4">
					<span id="limitFlag" name="limitFlag" class="form-control"></span>
				</div>
			</div>
			<div class="form-group hidelimit">
				<label class="col-xs-2 control-label">使用类型：</label>
				<div class="col-xs-4">
					<span id="limitType" name="limitType" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">限制调用次数：</label>
				<div class="col-xs-4">
					<span id="limitCount" name="limitCount" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">限制间隔时间：</label>
				<div class="col-xs-4">
					<span id="intervalFlag" name="intervalFlag" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">间隔时间（秒）：</label>
				<div class="col-xs-4">
					<span id="timeInterval" name="timeInterval" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">是否启用：</label>
				<div class="col-xs-10">
					<span id="validFlag" name="validFlag" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="3" readonly="readonly" style="resize: none;" id="notes" name="notes" class="form-control"></textarea>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">创建人：</label>
				<div class="col-xs-4">
					<span id="createEName" name="createEName" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">创建时间：</label>
				<div class="col-xs-4">
					<span id="createDate" name="createDate" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">修改人：</label>
				<div class="col-xs-4">
					<span id="updateEName" name="updateEName" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">修改时间：</label>
				<div class="col-xs-4">
					<span id="updateDate" name="updateDate" class="form-control"></span>
				</div>
			</div>
		</form>
	</div>

	<c:import url="../../common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/js/base/si/siUserContrast.js'/>"></script>
</body>
</html>