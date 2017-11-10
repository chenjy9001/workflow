/*
 * 文件名：TaskRejectedHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月9日 下午12:00:28
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.rest.service.api.runtime.process.BaseProcessInstanceResource;
import org.activiti.rest.service.api.runtime.process.ProcessInstanceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baothink.workflow.AcResponseResult;
import com.baothink.workflow.dto.TaskRejectedDto;

/**
 * 任务驳回操作<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月9日 下午12:00:28
 * @since baothink-workflow 0.0.1
 */
@RestController
@RequestMapping(value = "/internal/runtime")
public class TaskRejectedHandler extends BaseProcessInstanceResource{

	Logger log = LoggerFactory.getLogger(TaskRejectedHandler.class);
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private TaskService taskService;

	/**
	 * 
	 * 工作流驳回操作，删除原有工作流，重新创建<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月9日 下午3:38:39
	 * @param actionRequest
	 * @param request
	 * @param response
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "/rejected", method = RequestMethod.POST, produces="application/json")
	public AcResponseResult taskRejected(@RequestBody TaskRejectedDto rejectedRequest, HttpServletRequest request,
			HttpServletResponse response) {
		if (null == rejectedRequest) {
			response.setStatus(400);
			return AcResponseResult.error(00000, "请求体不能为空！");
		}
		//获取流程实例id
		String processInstanceId = rejectedRequest.getProcessInstanceId();
		//判断该用户是否可以驳回
		List<Task> taskList = taskService.createTaskQuery().processInstanceId(processInstanceId)
				.taskCandidateOrAssigned(rejectedRequest.getUserCode()).list();
		
		if(null == taskList|| taskList.isEmpty()){
			response.setStatus(500);
			return AcResponseResult.error(00000, "当前用户无权操作！");
		}
		//获取已有的参数
		Task task = taskList.get(0);
		Map<String, Object> variables = taskService.getVariables(task.getId());
		AcResponseResult result = null;
		try {
			// 通过流程实例ID查询实例相关信息
			ProcessInstance oldProcess = runtimeService.createProcessInstanceQuery()
					.processInstanceId(processInstanceId).singleResult();
			// 删除现有流程
			runtimeService.deleteProcessInstance(processInstanceId, rejectedRequest.getMsg());
			ProcessInstance instance = null;
			//根据流程的唯一标准key，重新开始新的流程
			instance = runtimeService.startProcessInstanceByKey(oldProcess.getProcessDefinitionKey(),
					oldProcess.getBusinessKey(), variables);

			response.setStatus(HttpStatus.CREATED.value());
			ProcessInstanceResponse resoponsee = restResponseFactory.createProcessInstanceResponse(instance);
			result = AcResponseResult.success(resoponsee);
			
		} catch (ActivitiObjectNotFoundException e) {
			String msg = "未找到相关流程无法删除！";
			log.warn(msg);
			response.setStatus(404);
			result = AcResponseResult.error(00000, msg);
		} catch (Exception e){
			log.warn(e.getMessage());
			response.setStatus(500);
			result = AcResponseResult.error(00000, "工作流驳回操作失败！");
		}
		return result;
	}
	

}
