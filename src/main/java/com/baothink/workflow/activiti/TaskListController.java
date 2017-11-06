/*
 * 文件名：TaskListController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月20日 下午3:14:41
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.activiti;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.activiti.engine.ManagementService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.NativeTaskQuery;
import org.activiti.engine.task.Task;
import org.apache.commons.httpclient.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.workflow.common.PageResult;
import com.baothink.workflow.dto.TaskDto;

/**
 * 任务列表<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月20日 下午3:14:41
 * @since baothink-workflow 0.0.1
 */
@RequestMapping(value = "workflow/task")
@Controller
public class TaskListController {
	
	@Autowired
	private TaskService taskService;
	@Autowired
	private ManagementService managementService;

	@RequestMapping(value = "taskList.html")
	public String toContent(){
		return "workflow/taskList";
	}
	
	@RequestMapping(value = "loadListByPage.htm")
	@ResponseBody
	public PageResult getTaskPage(PageRequest pageRequest){
		Map<String, String> map = pageRequest.getSearch();
		String value = map.get("value");
		NativeTaskQuery taskQuery = taskService.createNativeTaskQuery();
		StringBuilder sql = new StringBuilder();
		sql.append(" select * from " + managementService.getTableName(Task.class) + " t where 1=1 ");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and (t.TASK_DEF_KEY_ like '%" + value + "%' or t.NAME_ like '%" + value + "%' or t.PROC_INST_ID_ like '%" + value + "%')");
		}
		List<Task> taskList = taskQuery.sql(sql.toString()).listPage(pageRequest.getStart(), pageRequest.getLength());
		long count = taskQuery.list().size();
		List<TaskDto> dtoList = new ArrayList<>();
		for(Task t:taskList){
			TaskDto dto = new TaskDto();
			dto.setId(t.getId());
			dto.setName(t.getName());
			dto.setPriority(String.valueOf(t.getPriority()));
			dto.setProcessDefinitionId(t.getProcessDefinitionId());
			dto.setProcessInstanceId(t.getProcessInstanceId());
			dto.setDescription(t.getDescription());
			dto.setTaskDefinitionKey(t.getTaskDefinitionKey());
			dto.setOwner(t.getOwner());
			dto.setCreateTime(DateUtil.formatDate(t.getCreateTime(), "yyyy-MM-dd HH:mm:ss"));
			dto.setDueDate(t.getDueDate()!=null?DateUtil.formatDate(t.getDueDate(), "yyyy-MM-dd HH:mm:ss"):"");
			dtoList.add(dto);
		}
		PageResult result = new PageResult();
		result.setDataList(dtoList);
		result.setDraw(pageRequest.getDraw());
		result.setRecordsFiltered(count);
		result.setRecordsTotal(count);
		return result;
	}
	
	
}
