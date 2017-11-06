/*
 * 文件名：CreateGroupController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月26日 下午3:35:38
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import java.util.List;
import java.util.Map;

import org.activiti.engine.IdentityService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.impl.persistence.entity.GroupEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baothink.interfaces.core.IHandle;
import com.baothink.interfaces.core.SIRequestParam;
import com.baothink.interfaces.core.SIResponseResult;
import com.baothink.interfaces.core.exception.BaothinkIntefaceCoreException;
import com.baothink.workflow.AcResponseResult;
import com.baothink.workflow.common.InterfaceErrorCode;
import com.baothink.workflow.dto.GroupDto;

/**
 * 同步群组信息接口<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月26日 下午3:35:38
 * @since baothink-workflow 0.0.1
 */
//@RestController
//@RequestMapping(value = "/handler" )
@Component
public class CreateGroupHandler implements IHandle{
	Logger log = LoggerFactory.getLogger(CreateGroupHandler.class);

	@Autowired
	private ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	
	@PostMapping(value = "/group", produces = "application/json;charset=UTF-8")
	public AcResponseResult createGroup(@RequestBody(required = false) Map<String, Object> body){
		AcResponseResult result = new AcResponseResult();
		try{
			String jsonstr = JSON.toJSONString(body);
			JSONObject object = JSONObject.parseObject(jsonstr);
			List<GroupDto> list = JSON.parseArray(object.getString(jsonstr), GroupDto.class);
			IdentityService identityService = processEngine.getIdentityService();
			for(GroupDto dto:list){
				GroupEntity group = new GroupEntity();
				group.setId(dto.getId());
				group.setName(dto.getName());
				group.setType(dto.getType());
				identityService.saveGroup(group);
			}
			result = AcResponseResult.success();
		}catch(Exception e){
			result = AcResponseResult.failure(9999, "");
		}
		return result;
	}

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.interfaces.core.IHandle#handle(com.baothink.interfaces.core.SIRequestParam)
	 * @since baothink-workflow 0.0.1
	 */
	@Override
	public SIResponseResult handle(SIRequestParam param) throws BaothinkIntefaceCoreException {
		int resCode = InterfaceErrorCode.SUCCESS;
		StringBuilder resText = new StringBuilder("工作流群组同步，");
		try{
			Map<String, Object> paramMap = param.getDataInMap();
			if (paramMap == null || paramMap.isEmpty()) {
				resText.append("请求参数不能为空！");
				String warnMsg = resText.toString();
				log.warn(warnMsg);
				return SIResponseResult.error(00000,resText.toString());
			}
			String jsonstr = JSON.toJSONString(paramMap);
			JSONObject object = JSONObject.parseObject(jsonstr);
			List<GroupDto> groupList = JSON.parseArray(object.getString("groupDto"), GroupDto.class);
			if(null == groupList){
				resText.append("请求参数不能为空！");
				String warnMsg = resText.toString();
				log.warn(warnMsg);
				return SIResponseResult.error(00000,resText.toString());
			}
			IdentityService identityService = processEngine.getIdentityService();
			for(GroupDto dto:groupList){
				GroupEntity group = new GroupEntity();
				group.setId(dto.getId());
				group.setName(dto.getName());
				group.setType(dto.getType());
				identityService.saveGroup(group);
			}
		}catch(Exception e){
			e.printStackTrace();
			resText.append("同步用户信息异常！").append(e.getMessage());
			resCode = InterfaceErrorCode.SERVICE_ERROR;
			log.warn(resText.toString());
		}
		if(resCode == InterfaceErrorCode.SUCCESS){
			return SIResponseResult.success();
		}else{
			return SIResponseResult.error(resCode,resText.toString());
		}
	}
	
	
	 
}
