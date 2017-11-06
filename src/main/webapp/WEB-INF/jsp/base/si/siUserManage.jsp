<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>接口账号管理</title>
<c:import url="../../common/head.jsp" />
</head>
<body>
	<div class="wrapper wrapper-content wrapper_tree animated fadeInRight">
		<div class="ibox">
			<div class="ibox-content">
				<div id="divDatatable" class="datatable  col-xs-12">
					<div class="main" style="height: 50%">
						<div id="toolbar">
							<!-- 工具栏，显示操作按钮和模糊搜索 -->
						</div>
						<div class="row row-lg">
							<table id="dataTable" class="table table-striped table-bordered">
							</table>
						</div>
					</div>
					<div class="sub" style="height: 50%"></div>
				</div>
			</div>
		</div>
	</div>
	<input type="hidden" id="search_menuCode">
	<!--新增表单-->
	<div id="add_data_div" class="ibox-content hide" class="hide">
		<form id="add_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入账号：</label>
				<div class="col-xs-4">
					<input id="siaccno" type="text" name="siaccno" class="form-control" maxlength="15">
				</div>
				<label class="col-xs-2 control-label required">接口权限标识：</label>
				<div class="col-xs-4">
					<input type="radio" id="interfaceFlag1" name="interfaceFlag" value="10" checked="checked"></input> <label for="interfaceFlag1">全部接口 </label> <input type="radio" id="interfaceFlag2" name="interfaceFlag" value="20"></input> <label for="interfaceFlag2">限制接口 </label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入方企业代码：</label>
				<div class="col-xs-4">
					<input id="entShortName" name="entShortName" type="hidden"> <select id="entCode" data-type="selecttable" data-url="<c:url value='/si/siUser/loadUserByPage.htm'/>" data-select-field="entCode" data-search="true" class="form-control" name="entCode" data-for="entName,entShortName" data-for-field="entName,entShortName"></select>
				</div>
				<label class="col-xs-2 control-label">接入方企业名称：</label>
				<div class="col-xs-4">
					<input id="entName" name="entName" type="text" class="form-control" maxlength="25" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入密码：</label>
				<div class="col-xs-4">
					<input id="sipwd" name="sipwd" type="password" class="form-control" maxlength="15">
				</div>
				<label class="col-xs-2 control-label required">确认新密码：</label>
				<div class="col-xs-4">
					<input id="comfPwd" name="comfPwd" type="password" class="form-control" autocomplete="off" maxlength="15">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">账号类型：</label>
				<div class="col-xs-4">
					<input type="radio" id="siType1" name="siType" value="10" checked="checked"></input> <label for="siType1">自营 </label> 
					<input type="radio" id="siType2" name="siType" value="20"></input> <label for="siType2">第三方 </label>
				</div>
				<label class="col-xs-2 control-label required">是否启用：</label>
				<div class="col-xs-4">
					<input type="radio" id="validFlag1" name="validFlag" value="1" checked="checked"></input> <label for="validFlag1">启用 </label> <input type="radio" id="validFlag2" name="validFlag" value="0"></input> <label for="validFlag2">禁用 </label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="2" style="resize: none;" id="notes" name="notes" class="form-control"></textarea>
				</div>
			</div>
		</form>
	</div>
	<!--修改表单-->
	<div id="modify_data_div" class="ibox-content hide" class="hide">
		<form id="modify_data_form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
			<input id="id" name="id" type="hidden" />
			<input id="sipwd" name="sipwd" type="hidden">
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入账号：</label>
				<div class="col-xs-4">
					<input id="siaccno" type="text" name="siaccno" class="form-control" maxlength="15">
				</div>
				<label class="col-xs-2 control-label required">接口权限标识：</label>
				<div class="col-xs-4">
					<input type="radio" id="interfaceFlag1" name="interfaceFlag" value="10" checked="checked"></input> <label for="interfaceFlag1">全部接口 </label> <input type="radio" id="interfaceFlag2" name="interfaceFlag" value="20"></input> <label for="interfaceFlag2">限制接口 </label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">接入方企业代码：</label>
				<div class="col-xs-4">
					<input id="entShortName" name="entShortName" type="hidden"> 
					<input id="entCode" name="entCode" type="text" class="form-control" readonly="readonly"> 
				</div>
				<label class="col-xs-2 control-label required">接入方企业名称：</label>
				<div class="col-xs-4">
					<input id="entName" name="entName" type="text" class="form-control" maxlength="25" readonly="readonly">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label required">账号类型：</label>
				<div class="col-xs-4">
					<input type="radio" id="siType1" name="siType" value="10" checked="checked"></input> <label for="siType1">自营 </label> 
					<input type="radio" id="siType2" name="siType" value="20"></input> <label for="siType2">第三方 </label>
				</div>
				<label class="col-xs-2 control-label required">是否启用：</label>
				<div class="col-xs-4">
					<input type="radio" id="validFlag1" name="validFlag" value="1" checked="checked"></input> <label for="validFlag1">启用 </label> <input type="radio" id="validFlag2" name="validFlag" value="0"></input> <label for="validFlag2">禁用 </label>
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">备注：</label>
				<div class="col-xs-10">
					<textarea rows="2" style="resize: none;" id="notes" name="notes" class="form-control"></textarea>
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
				<label class="col-xs-2 control-label">接口权限标识：</label>
				<div class="col-xs-4">
					<span id="interfaceFlag" name="interfaceFlag" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
			    <label class="col-xs-2 control-label">接口方企业代码：</label>
				<div class="col-xs-4">
					<span id="entCode" name="entCode" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">接口方企业名称：</label>
				<div class="col-xs-4">
					<span id="entName" name="entName" class="form-control"></span>
				</div>
			</div>
			<div class="form-group">
			    <label class="col-xs-2 control-label">接口方企业简称：</label>
				<div class="col-xs-4">
					<span id="entShortName" name="entShortName" class="form-control"></span>
				</div>
				<label class="col-xs-2 control-label">账号类型：</label>
				<div class="col-xs-4">
					<span id="siType" name="siType" class="form-control"></span>
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
					<textarea rows="2" readonly="readonly" style="resize: none;" id="notes" name="notes" class="form-control"></textarea>
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
	
	<div id="modifyPwd_div" class="ibox-content hide" class="hide">
		<form id="modifyPwd_form" class="form-horizontal" action="si/siUser/modifyPwd.htm" method="post" enctype="application/x-www-form-urlencoded">
		<input name="token" type="hidden" value="${token }">
		<input id="siaccno" name="siaccno" type="hidden">
			<div class="form-group">
				<label class="col-xs-2 control-label">输入密码：</label>
				<div class="col-xs-10">
					<input id="sipwd" name="sipwd" type="password" class="form-control" maxlength="15">
				</div>
			</div>
			<div class="form-group">
				<label class="col-xs-2 control-label">确认密码：</label>
				<div class="col-xs-10">
					<input id="comfPwd" name="comfPwd" type="password" class="form-control" maxlength="15">
				</div>
			</div>
		</form>
	</div>

	<c:import url="../../common/bottom.jsp"></c:import>
	<script type="text/javascript" src="<c:url value='/js/base/si/siUser.js'/>"></script>
</body>
</html>