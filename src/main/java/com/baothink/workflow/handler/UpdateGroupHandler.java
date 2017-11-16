/*
 * 文件名：UpdateGroupHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年11月13日 下午2:08:57
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
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.GroupQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baothink.interfaces.core.IHandle;
import com.baothink.interfaces.core.SIRequestParam;
import com.baothink.interfaces.core.SIResponseResult;
import com.baothink.interfaces.core.exception.BaothinkIntefaceCoreException;
import com.baothink.workflow.common.InterfaceErrorCode;
import com.baothink.workflow.dto.GroupDto;

/**
 * 修改群组信息接口<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年11月13日 下午2:08:57
 * @since baothink-workflow 0.0.1
 */
@Component
public class UpdateGroupHandler implements IHandle{
	
	Logger log = LoggerFactory.getLogger(UpdateGroupHandler.class);

	@Autowired
	private ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();

	/**  
	 * {@inheritDoc}
	 * 
	 * @see com.baothink.interfaces.core.IHandle#handle(com.baothink.interfaces.core.SIRequestParam)
	 * @since baothink-workflow 0.0.1
	 */
	@Override
	public SIResponseResult handle(SIRequestParam param) throws BaothinkIntefaceCoreException {
		int resCode = InterfaceErrorCode.SUCCESS;
		StringBuilder resText = new StringBuilder("修改工作流群组，");
		try{
			Map<String, Object> paramMap = param.getDataInMap();
			if (paramMap == null || paramMap.isEmpty()) {
				resText.append("请求体不能为空！");
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
			GroupQuery groupQuery = identityService.createGroupQuery();
			for(GroupDto dto:groupList){
				List<Group> list = groupQuery.groupId(dto.getId()).list();
				// 判断群组是否已经存在
				if(null == list || list.isEmpty()){
					continue;
				}
				Group group = list.get(0);
				group.setName(dto.getName());
				group.setType(dto.getType());
				identityService.saveGroup(group);
			}
		}catch(Exception e){
			e.printStackTrace();
			resText.append("同步群组信息异常！").append(e.getMessage());
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
