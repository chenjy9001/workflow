/*
 * 文件名：DeleteProcessInstancesHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月15日 上午9:34:25
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.baothink.workflow.AcResponseResult;

/**
 * 删除流程实例接口<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年11月15日 上午9:34:25
 * @since baothink-workflow 0.0.1
 */
@RequestMapping(value = "/internal/delete")
@RestController
public class DeleteProcessInstancesHandler {

	Logger log = LoggerFactory.getLogger(DeleteProcessInstancesHandler.class);
	@Autowired
	private RuntimeService runtimeService;
	
	/**
	 * 
	 * 删除流程实例处理方法<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月15日 上午9:55:39
	 * @param processInstanceId
	 * @param deleteReason
	 * @param response
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value="/process-instances/{processInstanceId}", method = RequestMethod.DELETE)
	  public AcResponseResult deleteProcessInstance(@PathVariable String processInstanceId, 
	      @RequestParam(value="deleteReason", required=false) String deleteReason, HttpServletResponse response) {
		if (null == processInstanceId) {
			response.setStatus(400);
			return AcResponseResult.error(00000, "请求实例ID不能为空！");
		}
		 ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
		           .processInstanceId(processInstanceId).singleResult();
		 if (null == processInstance) {
				response.setStatus(400);
				return AcResponseResult.error(00000, "无法找到对应实例！");
			}
	    runtimeService.deleteProcessInstance(processInstance.getId(), deleteReason);
	    response.setStatus(HttpStatus.OK.value());
		return AcResponseResult.success();
	  }
	
}
