/*
 * 文件名：CreateUserHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月26日 上午10:05:58
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.activiti.engine.IdentityService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.persistence.entity.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baothink.framework.core.util.UUIDUtil;
import com.baothink.interfaces.core.IHandle;
import com.baothink.interfaces.core.SIRequestParam;
import com.baothink.interfaces.core.SIResponseResult;
import com.baothink.interfaces.core.exception.BaothinkIntefaceCoreException;
import com.baothink.workflow.AcResponseResult;
import com.baothink.workflow.common.InterfaceErrorCode;
import com.baothink.workflow.dto.UserDto;

/**
 * 新增用户接口<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月26日 上午10:05:58
 * @since baothink-workflow 0.0.1
 */
//@RestController
//@RequestMapping(value = "/handler")
@Component
public class CreateUserHandler implements IHandle{
	
	Logger log = LoggerFactory.getLogger(CreateUserHandler.class);
	
	@Autowired
	private ProcessEngine  processEngine = ProcessEngines.getDefaultProcessEngine();

	@PostMapping(value = "/user", produces={"application/json;charset=UTF-8"})
	public AcResponseResult createUser(@RequestBody(required = false) Map<String, Object> body){
		AcResponseResult result = null;
		try{
			String jsonstr = JSON.toJSONString(body);
			JSONObject object = JSONObject.parseObject(jsonstr);
			List<UserDto> userList = JSON.parseArray(object.getString("userDto"), UserDto.class);
			IdentityService identityService = processEngine.getIdentityService();
			for(UserDto dto:userList){
				UserEntity user = new UserEntity();
				user.setId(dto.getId());
				user.setFirstName(dto.getFirstName());
				user.setLastName(dto.getLastName());
				user.setEmail(dto.getEmail());
				user.setPassword(dto.getPassword());
				identityService.saveUser(user);
			}
			result = AcResponseResult.success();
		}catch (Exception e){
			String errorid = UUIDUtil.createShortUUID();
			StringBuilder errorStr = new StringBuilder("\n");
			errorStr.append("错误标识码：").append(errorid).append("\n");
			errorStr.append("结果代码：").append(300).append("\n");
			errorStr.append("结果描述：").append("请求失败，内部发生未知错误。").append("\n");
			errorStr.append("接收的参数：").append(body).append("\n");
			this.log.error(errorStr.toString(), e);
			result = AcResponseResult.failure(300, new Object[] { errorid });
		}
		return result;
	}
	
	@GetMapping(value = "/user")
	public AcResponseResult queryUser(){
		IdentityService identityService = processEngine.getIdentityService();
		List<User> list = identityService.createUserQuery().list();
		List<UserDto> dtoList = new ArrayList<>();
		for(User user:list){
			UserDto dto = new UserDto();
			dto.setId(user.getId());
			dto.setFirstName(user.getFirstName());
			dto.setLastName(user.getLastName());
			dto.setEmail(user.getEmail());
			dto.setPassword(user.getPassword());
			dtoList.add(dto);
		}
		return AcResponseResult.success(dtoList);
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
		StringBuilder resText = new StringBuilder("工作流用户同步，");
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
			List<UserDto> userList = JSON.parseArray(object.getString("userDto"), UserDto.class);
			if(null == userList){
				resText.append("请求参数不能为空！");
				String warnMsg = resText.toString();
				log.warn(warnMsg);
				return SIResponseResult.error(00000,resText.toString());
			}
			IdentityService identityService = processEngine.getIdentityService();
			for(UserDto dto:userList){
				UserEntity user = new UserEntity();
				user.setId(dto.getId());
				user.setFirstName(dto.getFirstName());
				user.setLastName(dto.getLastName());
				user.setEmail(dto.getEmail());
				user.setPassword(dto.getPassword());
				identityService.saveUser(user);
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
