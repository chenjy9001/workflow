/*
 * 文件名：ProcessRuningController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月16日 上午11:25:06
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.activiti;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.activiti.engine.ManagementService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.NativeProcessInstanceQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.workflow.common.PageResult;
import com.baothink.workflow.dto.ProcessInstanceDto;
import com.baothink.workflow.util.cache.ProcessDefinitionCache;

/**
 * 流程实例处理类<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月16日 上午11:25:06
 * @since baothink-workflow 0.0.1
 */
@RequestMapping(value = "/workflow/processing")
@Controller
public class ProcessRuningController {
	
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private ManagementService managementService;
	
	/**
	 * 
	 * 跳转到流程实例列表页面<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月20日 下午1:23:21
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "toContent.html")
	public String toContent(){
		return "workflow/processInstance";
	}
	
	/**
	 * 
	 * 查询流程实例列表<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月20日 下午1:23:54
	 * @param pageRequest
	 * @param session
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "loadListByPage.htm",produces = "text/html;charset=UTF-8")
	@ResponseBody
    public PageResult running(PageRequest pageRequest, HttpSession session) {
		StringBuilder sql = new StringBuilder();
		sql.append("select DISTINCT RES.*, p.KEY_ AS ProcessDefinitionKey, p.ID_ ProcessDefinitionId, p.NAME_ ProcessDefinitionName, p.VERSION_ ProcessDefinitionVersion, p.DEPLOYMENT_ID_ DeploymentId");
		sql.append(" from "+ managementService.getTableName(ProcessInstance.class)+" RES");
		sql.append(" INNER JOIN ACT_RE_PROCDEF P ON RES.PROC_DEF_ID_ = P.ID_ WHERE	RES.PARENT_ID_ IS NULL");
		Map<String, String> map = pageRequest.getSearch();
		String value = map.get("value");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and (p.KEY_ like '%" + value +"%' or p.NAME_  like '%" + value + "%')"  );
		}
		sql.append(" order by PROC_INST_ID_ desc");
		NativeProcessInstanceQuery processInstanceQuery = runtimeService.createNativeProcessInstanceQuery();
		int count = processInstanceQuery.sql(sql.toString()).list().size();
        List<ProcessInstance> list = processInstanceQuery.sql(sql.toString()).listPage(pageRequest.getStart(), pageRequest.getLength());
        List<ProcessInstanceDto> dtoList = new ArrayList<>();
        RepositoryService repositoryService = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext()).getBean(org.activiti.engine.RepositoryService.class);
    	ProcessDefinitionCache.setRepositoryService(repositoryService);
        for(ProcessInstance p:list){
        	ProcessInstanceDto dto = new ProcessInstanceDto();
        	dto.setId(p.getId());
        	dto.setActivitiyId(p.getActivityId());
        	dto.setProcessDefinitionId(p.getProcessDefinitionId());
        	dto.setProcessInstanceId(p.getProcessInstanceId());
        	dto.setSuspended(String.valueOf(p.isSuspended()));
        	dto.setProcessDefinitionName(p.getProcessDefinitionName());
        	dto.setProcessDefinitionKey(p.getProcessDefinitionKey());
        	dto.setActivityName(ProcessDefinitionCache.getActivityName(p.getProcessDefinitionId(), p.getActivityId()));
        	dtoList.add(dto);
        }
        PageResult pageResult = new PageResult();
        pageResult.setDataList(dtoList);
        pageResult.setDraw(pageRequest.getDraw());
        pageResult.setRecordsFiltered(count);
        pageResult.setRecordsTotal(count);
        return pageResult;
    }
	
	/**
	 * 
	 * 流程实例挂起<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月27日 下午4:33:43
	 * @param id
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "/hangProcess.htm")
	@ResponseBody
	public ResultAsync hangProcess(String id){
		try{
			if(!StringUtil.isEmpty(id)){
				ProcessInstance p = runtimeService.createProcessInstanceQuery().processInstanceId(id).singleResult();
				//判断流程实例是否被挂起
				if(p.isSuspended()){
					return ResultAsync.error(00000, "流程实例已经被挂起！");
				}
				//根据一个流程实例的id挂起该流程实例
				runtimeService.suspendProcessInstanceById(id);
			}else{
				return ResultAsync.error(00000, "id为空！");
			}
		}catch (Exception e){
			return ResultAsync.error(00000, "流程实例挂起失败！");
		}
		return ResultAsync.success();
	}
	
	/**
	 * 
	 * 开启流程实例<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月30日 上午11:28:55
	 * @param id
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "activateProcess.htm")
	@ResponseBody
	public ResultAsync activateProcess(String id){
		try{
			if(!StringUtil.isEmpty(id)){
				ProcessInstance p = runtimeService.createProcessInstanceQuery().processInstanceId(id).singleResult();
				//判断流程实例是否被挂起
				if(!p.isSuspended()){
					return ResultAsync.error(00000, "流程实例未被挂起！");
				}
				//根据一个流程实例的id挂起该流程实例
				runtimeService.activateProcessInstanceById(id);
			}else{
				return ResultAsync.error(00000, "id为空！");
			}
		}catch (Exception e){
			return ResultAsync.error(00000, "流程实例启动失败！");
		}
		return ResultAsync.success();
	}

}
