/*
 * 文件名：ProcessController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月13日 下午3:15:19
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.activiti;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.ManagementService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.NativeProcessDefinitionQuery;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.ibatis.exceptions.PersistenceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.workflow.common.PageResult;
import com.baothink.workflow.dto.ProcessDefinitionDto;

/**
 * 流程定义控制类<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月13日 下午3:15:19
 * @since baothink-workflow 0.0.1
 */
@Controller
@RequestMapping(value = "/workflow/process")
public class ProcessController {
	
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private ManagementService managementService;
	private Logger log = LoggerFactory.getLogger(ProcessController.class);

	/**
	 * 
	 * 跳转到查询页面<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月13日 下午3:57:02
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "toContent.html")
	public String toContent(){
		return "workflow/processList";
	}
	
	/**
	 * 
	 * 获取流程定义列表<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月13日 下午5:32:44
	 * @param request
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "loadListByPage.htm",produces = "text/html;charset=UTF-8")
	@ResponseBody
	public PageResult getList(PageRequest request){
		NativeProcessDefinitionQuery processDefinitionQuery = repositoryService.createNativeProcessDefinitionQuery();
		Map<String, String> map = request.getSearch();
		String value = map.get("value");
		StringBuilder sql = new StringBuilder();
		sql.append(" select * from " + managementService.getTableName(ProcessDefinition.class) + " P where 1=1");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and (P.KEY_ like '%" + value + "%' or P.NAME_ like '%" + value +"%')");
		}
		sql.append(" order by DEPLOYMENT_ID_ desc");
		processDefinitionQuery = repositoryService.createNativeProcessDefinitionQuery().sql(sql.toString());
        List<ProcessDefinition> list = processDefinitionQuery.listPage(request.getStart(), request.getLength());
        List<ProcessDefinitionDto> dtoList = new ArrayList<>();
        for(ProcessDefinition p:list){
        	ProcessDefinitionDto dto = new ProcessDefinitionDto();
        	dto.setId(p.getId());
        	dto.setDeploymentId(p.getDeploymentId());
        	dto.setKey(p.getKey());
        	dto.setName(p.getName());
        	dto.setVersion(String.valueOf(p.getVersion()));
        	dtoList.add(dto);
        }
        PageResult pageResult = new PageResult();
        pageResult.setDataList(dtoList);
        pageResult.setDraw(request.getDraw());
        pageResult.setRecordsTotal(processDefinitionQuery.list().size());
        pageResult.setRecordsFiltered(processDefinitionQuery.list().size());
        return pageResult;
	}
	
	/**
	 * 
	 * 获取流程的图片或者xml<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月16日 上午9:48:09
	 * @param processDefinitionId
	 * @param resourceType
	 * @param response
	 * @throws Exception
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "/resource/read")
    public void loadByDeployment(String processDefinitionId, String resourceType,
                                 HttpServletResponse response) throws Exception {
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
        String resourceName = "";
        if (resourceType.equals("image")) {
            resourceName = processDefinition.getDiagramResourceName();
        } else if (resourceType.equals("xml")) {
            resourceName = processDefinition.getResourceName();
        }
        InputStream resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(), resourceName);
        byte[] b = new byte[1024];
        int len = -1;
        while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
            response.getOutputStream().write(b, 0, len);
        }
    }
	
	/**
	 * 
	 * 强制删除流程定义<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月27日 上午11:59:20
	 * @param ids
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "deleteAsync.htm")
	@ResponseBody
	public ResultAsync deleteProcess(String[] ids){
		try{
			if(null!=ids&&ids.length>0){
				for(String id:ids){
					repositoryService.deleteDeployment(id, true);
				}
			}
		} catch (Exception e){
			return ResultAsync.error(00000, "删除失败！");
		}
		return ResultAsync.success();
	}
	/**
	 * 
	 * 普通删除流程定义<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月30日 上午10:16:45
	 * @param ids
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "deleteUnused.htm")
	@ResponseBody
	public ResultAsync deleteUnused(String[] ids){
		try{
			if(null!=ids&&ids.length>0){
				for(String id:ids){
					repositoryService.deleteDeployment(id);
				}
			}
		} catch (Exception e){
			log.warn(e.getMessage(), e);
			if(e instanceof PersistenceException){
				return ResultAsync.error(00000, "删除失败,流程正在使用中！");
			}
			return ResultAsync.error(00000, "删除失败！");
		}
		return ResultAsync.success();
	}
}
