/*
 * 文件名：UserController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月27日 上午10:05:40
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.activiti;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.activiti.engine.IdentityService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.identity.NativeUserQuery;
import org.activiti.engine.identity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.workflow.common.PageResult;
import com.baothink.workflow.dto.UserDto;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月27日 上午10:05:40
 * @since baothink-workflow 0.0.1
 */
@Controller
@RequestMapping(value = "/workflow/user")
public class UserController {
	
	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	
	@Autowired
	private IdentityService identityService;

	@Autowired
	private ManagementService managementService;

	@RequestMapping(value = "toContent.html")
	public String toContent(){
		return "workflow/userList";
	}
	
	@RequestMapping(value = "loadListByPage.htm")
	@ResponseBody
	public PageResult getUserPage(PageRequest request){
		Map<String, String> map = request.getSearch();
		String value = map.get("value");
		NativeUserQuery nativeUserQuery = identityService.createNativeUserQuery();
		StringBuilder sql = new StringBuilder();
		sql.append(" select * from " + managementService.getTableName(User.class) + " U where 1=1 ");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and U.id_ like '%" + value + "%' or U.FIRST_ like '%" + value + "%' or U.LAST_ like '%" + value + "%'");
		}
		int count = nativeUserQuery.sql(sql.toString()).list().size();
		List<User> list = nativeUserQuery.sql(sql.toString()).listPage(request.getStart(), request.getLength());
		List<UserDto> dtoList = new ArrayList<>();
		for(User u:list){
			UserDto dto = new UserDto();
			dto.setId(u.getId());
			dto.setFirstName(u.getFirstName());
			dto.setLastName(u.getLastName());
			dto.setEmail(u.getEmail());
			dto.setPassword(u.getPassword());
			dtoList.add(dto);
		}
		PageResult result = new PageResult();
		result.setDataList(dtoList);
		result.setDraw(request.getDraw());
		result.setRecordsFiltered(count);
		result.setRecordsTotal(count);
		return result;
	}
}
