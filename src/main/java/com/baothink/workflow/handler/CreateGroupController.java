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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baothink.workflow.AcResponseResult;
import com.baothink.workflow.dto.GroupDto;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月26日 下午3:35:38
 * @since baothink-workflow 0.0.1
 */
@RestController
@RequestMapping(value = "/handler" )
public class CreateGroupController {
	Logger log = LoggerFactory.getLogger(CreateGroupController.class);

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
	
	
	 
}
