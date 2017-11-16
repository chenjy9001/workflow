/*
 * 文件名：CompleteProcessHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月15日 上午10:29:46
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.baothink.framework.core.util.StringUtil;
import com.baothink.workflow.AcResponseResult;
import com.baothink.workflow.dto.ProcessInstanceInfoDto;
import com.baothink.workflow.dto.TaskDto;

/**
 * 流程实例是否已经结束<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年11月15日 上午10:29:46
 * @since baothink-workflow 0.0.1
 */
@RequestMapping(value = "/internal/info")
@RestController
public class ProcessInfoHandler {

	Logger log = LoggerFactory.getLogger(ProcessInfoHandler.class);
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private TaskService taskService;
	
	@RequestMapping(value="/process-instances", method = RequestMethod.GET)
	public AcResponseResult getProcessInfo(String processInstanceId, HttpServletResponse response){
		if(StringUtil.isEmpty(processInstanceId)){
			response.setStatus(400);
			return AcResponseResult.error(00000, "请求实例ID不能为空！");
		}
		ProcessInstanceInfoDto dto = new ProcessInstanceInfoDto();
		dto.setId(processInstanceId);
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
		           .processInstanceId(processInstanceId).singleResult();
		if(null == processInstance){
			dto.setIsHave(false);
			return AcResponseResult.success(dto);
		}else{
			dto.setIsHave(true);
		}
		List<Task> taskList = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
		if(null == taskList || taskList.isEmpty()){
			dto.setIsComplete(true);
			return AcResponseResult.success(dto);
		}else{
			dto.setIsComplete(false);
			List<TaskDto> dtoList = new ArrayList<>();
			for(Task task:taskList){
				TaskDto taskDto = new TaskDto();
				taskDto.setId(task.getId());
				taskDto.setName(task.getName());
				taskDto.setProcessDefinitionId(task.getProcessDefinitionId());
				taskDto.setProcessInstanceId(task.getProcessInstanceId());
				taskDto.setAssignee(task.getAssignee());
				dtoList.add(taskDto);
			}
			dto.setTaskList(dtoList);
		}
		Task task = taskList.get(0);
		ProcessDefinitionEntity processDefinition = (ProcessDefinitionEntity)repositoryService
				.getProcessDefinition(processInstance.getProcessDefinitionId());
		// 根据节点ID，获取对应的活动节点  
        ActivityImpl activityImpl = ((ProcessDefinitionImpl) processDefinition)  
                .findActivity(task.getTaskDefinitionKey());  
        boolean flag = findEndEventId(activityImpl);
        dto.setIsEnd(flag);
		return AcResponseResult.success(dto);
	}
	
	private boolean findEndEventId(ActivityImpl activityImpl) {  
        List<PvmTransition> outgoingTransitions = activityImpl  
                .getOutgoingTransitions();  
        PvmTransition p = outgoingTransitions.iterator().next();
        TransitionImpl transitionImpl = (TransitionImpl) p;  
        activityImpl = transitionImpl.getDestination();  
        String type = (String) activityImpl.getProperty("type");
        if("endEvent".equals(type)){
        	return true;
        }else{
        	return false;
        }
    }  
}
