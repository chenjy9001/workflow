<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<script type="text/javascript">
	var basePath = "<c:url value='/'/>";
	var menuCode = "${param.menuCode}";
	parents = parent.parents;
</script>
<script type="text/javascript" src="<c:url value='/jquery/jquery-1.12.4.min.js'/>"></script>

<script type="text/javascript" src="<c:url value='/bootstrap/js/bootstrap.min.js'/>"></script>

<script type="text/javascript" src="<c:url value='/plugins/slimScroll/jquery.slimscroll.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/layer/layer.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/pace/pace.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/splitter/splitter.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/artTemplate/template.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/dot/dot.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/datatables/datatables.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/jstree/jstree.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/jquery-mousewheel/jquery.mousewheel.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/sockjs/sockjs-1.0.0.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/stomp/stomp.min.js'/>"></script>
<!-- echart -->
<script type="text/javascript" src="<c:url value='/plugins/echart/echarts.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/echart/theme/dark.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/echart/theme/infographic.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/echart/theme/macarons.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/echart/theme/roma.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/echart/theme/shine.js'/>"></script>
<script type="text/javascript" src="<c:url value='/plugins/echart/theme/vintage.js'/>"></script>


<script type="text/javascript" src="<c:url value='/form/jquery.form.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/validate/jquery.validate.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/validate/btValidator.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/daterangepicker/moment.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/datetimepicker/bootstrap-datetimepicker.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/daterangepicker/daterangepicker.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/icheck/icheck.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/select2/select2.full.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/select2/zh-CN.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/jqfileupload/vendor/jquery.ui.widget.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/jqfileupload/jquery.iframe-transport.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/jqfileupload/jquery.fileupload.js'/>"></script>
<!-- 
<script type="text/javascript" src="<c:url value='/form/umeditor/umeditor.config.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/umeditor/umeditor.min.js'/>"></script>
 -->
<script type="text/javascript" src="<c:url value='/form/ueditor/ueditor.config.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/ueditor/ueditor.all.min.js'/>"></script>

<script type="text/javascript" src="<c:url value='/form/bootstrap-jasny/jasny-bootstrap.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/city-picker/city-picker.data.js'/>"></script>
<script type="text/javascript" src="<c:url value='/form/city-picker/city-picker.js'/>"></script>

<script type="text/javascript" src="<c:url value='/base/js/baothink/baothink.util.js'/>"></script>
<script type="text/javascript" src="<c:url value='/base/js/baothink/baothink.common.js'/>"></script>
<script type="text/javascript" src="<c:url value='/base/js/baothink/baothink.tab.js'/>"></script>
<script type="text/javascript" src="<c:url value='/base/js/baothink/baothink.page.js'/>"></script>
<script type="text/javascript" src="<c:url value='/base/js/baothink/baothink.form.js'/>"></script>
<script type="text/javascript" src="<c:url value='/base/js/baothink/baothink.cutwebsocket.js'/>"></script>


