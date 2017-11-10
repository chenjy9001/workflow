/*
 * 文件名：TaskOperationHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月8日 上午9:13:41
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.ActivitiException;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.rest.service.api.engine.variable.RestVariable;
import org.activiti.rest.service.api.runtime.task.TaskActionRequest;
import org.activiti.rest.service.api.runtime.task.TaskBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baothink.workflow.AcResponseResult;
import com.baothink.workflow.dto.TaskActionDto;

/**
 * 任务操作接口<br>
 * <br>
 * 
 * @author 陈敬尧
 * @version 1.0,2017年11月8日 上午9:13:41
 * @since baothink-workflow 0.0.1
 */
@RestController
@RequestMapping(value = "/internal/runtime")
public class TaskOperationHandler extends TaskBaseResource {
	
	Logger log = LoggerFactory.getLogger(TaskOperationHandler.class);
	@Autowired
	private RuntimeService runtimeService;

	/**
	 * 
	 * 工作流任务操作方法<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月8日 下午5:20:45
	 * @param actionRequest
	 * @param response
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "/tasks", method = RequestMethod.POST)
	public AcResponseResult executeTaskAction(@RequestBody TaskActionDto actionRequest, HttpServletResponse response) {
		if (actionRequest == null) {
			response.setStatus(400);
			return AcResponseResult.error(0000, "请求体不能为空！");
		}
		String processInstanceId = actionRequest.getProcessInstanceId();
		String userCode = actionRequest.getUserCode();
		//通过实例ID与执行者查询活动的任务
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId)
				.taskCandidateOrAssigned(userCode).active().list();
		if(null == tasks || tasks.isEmpty()){
			response.setStatus(404);
			return AcResponseResult.error(0000, "找不到任务！");
		}
		Task task = tasks.get(0);
		AcResponseResult result = null;
		if (TaskActionRequest.ACTION_COMPLETE.equals(actionRequest.getAction())) {
				result = completeTask(task, actionRequest);
		} else if (TaskActionRequest.ACTION_CLAIM.equals(actionRequest.getAction())) {
				result = claimTask(task, actionRequest);
		} else if (TaskActionRequest.ACTION_DELEGATE.equals(actionRequest.getAction())) {
				result = delegateTask(task, actionRequest);
		} else if (TaskActionRequest.ACTION_RESOLVE.equals(actionRequest.getAction())) {
				result = resolveTask(task, actionRequest);
		} else {
			return AcResponseResult.error(00000, actionRequest.getAction() + "没有该项操作");
		}
		//工作流操作失败，返回500错误
		if(!result.isSuccess()){
			response.setStatus(500);
		}
		return result;
	}

	/**
	 * 
	 * 任务完成<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月8日 上午11:00:17
	 * @param task
	 * @param actionRequest
	 * @since baothink-workflow 0.0.1
	 */
	protected AcResponseResult completeTask(Task task, TaskActionDto actionRequest) {
		AcResponseResult result = null;
		try{
			if (actionRequest.getVariables() != null) {
				Map<String, Object> variablesToSet = new HashMap<String, Object>();
				for (RestVariable var : actionRequest.getVariables()) {
					if (var.getName() == null) {
						return AcResponseResult.error(00000, "参数格式不正确，缺少name!");
					}
					
					Object actualVariableValue = restResponseFactory.getVariableValue(var);
					variablesToSet.put(var.getName(), actualVariableValue);
				}
				
				taskService.complete(task.getId(), variablesToSet);
			} else {
				taskService.complete(task.getId());
			}
			ProcessInstance pi = runtimeService//表示正在执行的流程实例和执行对象  
					.createProcessInstanceQuery()//创建流程实例查询  
					.processInstanceId(task.getProcessInstanceId())//使用流程实例ID查询  
					.singleResult();
			//流程是否已经结束
			boolean flag = false;
			if(null == pi){
				flag = true;
			}
			Map<String, Object> map = new HashMap<>();
			map.put("flag", flag);
			result = AcResponseResult.success(map);
		} catch(Exception e){
			e.printStackTrace();
			log.warn(e.getMessage());
			result = AcResponseResult.error(00000, "工作流执行失败！");
		}
		return result;
	}

	/**
	 * 
	 * 还原指派审批人<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月8日 上午11:00:46
	 * @param task
	 * @param actionRequest
	 * @since baothink-workflow 0.0.1
	 */
	protected AcResponseResult resolveTask(Task task, TaskActionDto actionRequest){
		try{
			taskService.resolveTask(task.getId());
			return AcResponseResult.success();
		}catch (Exception e) {
			e.printStackTrace();
			log.warn(e.getMessage());
			return AcResponseResult.error(00000, "工作流执行失败！");
		}
	}

	/**
	 * 
	 * 指派代理人<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月8日 上午11:03:46
	 * @param task
	 * @param actionRequest
	 * @since baothink-workflow 0.0.1
	 */
	protected AcResponseResult delegateTask(Task task, TaskActionDto actionRequest) {
		if (actionRequest.getAssignee() == null) {
			return AcResponseResult.error(00000, "需要指定用户成为代理人！");
		}
		try{
			taskService.delegateTask(task.getId(), actionRequest.getAssignee());
			return AcResponseResult.success();
		}catch (Exception e) {
			e.printStackTrace();
			log.warn(e.getMessage());
			return AcResponseResult.error(00000, "工作流执行失败！");
		}
	}

	/**
	 * 
	 *认领任务<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月8日 上午11:07:56
	 * @param task
	 * @param actionRequest
	 * @since baothink-workflow 0.0.1
	 */
	protected AcResponseResult claimTask(Task task, TaskActionDto actionRequest) throws ActivitiException {
		// In case the task is already claimed, a
		// ActivitiTaskAlreadyClaimedException is thrown and converted to
		// a CONFLICT response by the ExceptionHandlerAdvice
		try{
			taskService.claim(task.getId(), actionRequest.getAssignee());
			return AcResponseResult.success();
		}catch (Exception e){
			return AcResponseResult.error(00000, "工作流执行失败！");
		}
	}
}
