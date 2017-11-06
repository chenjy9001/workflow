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
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.NativeUserQuery;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.persistence.entity.UserEntity;
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
import com.baothink.workflow.dto.GroupDto;
import com.baothink.workflow.dto.UserDto;

/**
 * 用户管理控制类<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月27日 上午10:05:40
 * @since baothink-workflow 0.0.1
 */
@Controller
@RequestMapping(value = "/workflow/user")
public class UserController {
	
	Logger log = LoggerFactory.getLogger(UserController.class);
	
	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	
	@Autowired
	private IdentityService identityService;

	@Autowired
	private ManagementService managementService;

	/**
	 * 
	 * 跳转到页面<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月1日 下午1:29:32
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "toContent.html")
	public String toContent(){
		return "workflow/userList";
	}
	
	/**
	 * 
	 * 用户列表查询<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月1日 下午1:29:48
	 * @param request
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "loadListByPage.htm")
	@ResponseBody
	public PageResult getUserPage(PageRequest request){
		Map<String, String> map = request.getSearch();
		String value = map.get("value");
		NativeUserQuery nativeUserQuery = identityService.createNativeUserQuery();
		StringBuilder sql = new StringBuilder();
		sql.append(" select * from " + managementService.getTableName(User.class) + " U where 1=1 ");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and (U.id_ like '%" + value + "%' or U.FIRST_ like '%" + value + "%' or U.LAST_ like '%" + value + "%')");
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
	
	/**
	 * 
	 * 新增用户<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月30日 下午5:06:48
	 * @param dto
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "createUser.htm")
	@ResponseBody
	public ResultAsync createUser(UserDto dto){
		if(null == dto){
			return ResultAsync.error(00000, "提交用户信息为空！");
		}
		if(StringUtil.isEmpty(dto.getId())){
			return ResultAsync.error(00000, "用户ID为空！");
		}
		try{
			User userquery = identityService.createUserQuery().userId(dto.getId()).singleResult();
			if(null != userquery){
				return ResultAsync.error(00000, "用户已存在！");
			}
			UserEntity user = new UserEntity();
			user.setId(dto.getId());
			User u = identityService.newUser(dto.getId());
			u.setFirstName(dto.getFirstName());
			u.setLastName(dto.getLastName());
			u.setPassword(dto.getPassword());
			u.setEmail(dto.getEmail());
			identityService.saveUser(u);
		} catch (Exception e) {
			log.warn(e.getMessage(), e);
			return ResultAsync.error(00000, "新增用户失败！");
		}
		return ResultAsync.success();
	}
	  
	/**
	 * 
	 * 删除用户<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月30日 下午5:11:09
	 * @param userId
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "deleteUser.htm")
	@ResponseBody
	public ResultAsync deleteUser(String userId){
		if(StringUtil.isEmpty(userId)){
			return ResultAsync.error(00000, "用户ID为空!");
		}
		try{
			identityService.deleteUser(userId);
		}catch (Exception e) {
			return ResultAsync.error(00000, "用户删除失败！");
		}
		return ResultAsync.success();
	}
	
	/**
	 * 
	 * 群组列表<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月1日 下午1:43:31
	 * @param request
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "groupList.htm")
	@ResponseBody
	public PageResult getGroupList(PageRequest request){
		List<Group> list = identityService.createGroupQuery().list();
		List<GroupDto> dtoList = new ArrayList<>();
		if(null!=list&&!list.isEmpty()){
			for(Group g:list){
				GroupDto dto = new GroupDto();
				dto.setId(g.getId());
				dto.setName(g.getName());
				dto.setType(g.getType());
				dtoList.add(dto);
			}
		}
		PageResult result = new PageResult();
		result.setDraw(request.getDraw());
		result.setDataList(dtoList);
		result.setRecordsFiltered(list.size());
		result.setRecordsTotal(list.size());
		return result;
	}
	
	/**
	 * 
	 * 获取用户所在的群组<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月1日 下午2:23:50
	 * @param userId
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "selectedGroup.htm")
	@ResponseBody
	public ResultAsync getSelectedGroup(String userId){
		if(StringUtil.isEmpty(userId)){
			return ResultAsync.error(00000, "userId为空！");
		}
		List<Group> list = identityService.createGroupQuery().groupMember(userId).list();
		List<GroupDto> dtoList = new ArrayList<>();
		if(null!=list&&!list.isEmpty()){
			GroupDto dto = new GroupDto();
			for(Group g:list){
				dto.setId(g.getId());
				dto.setName(g.getName());
				dto.setType(g.getType());
				dtoList.add(dto);
			}
		}
		return ResultAsync.success(dtoList);
	}
	
	/**
	 * 
	 * 添加群组<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年11月1日 下午4:18:58
	 * @param userId
	 * @param str
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "addGroup.htm")
	@ResponseBody
	public ResultAsync addGroup(String userId, String str){
		if(StringUtil.isEmpty(userId)){
			return ResultAsync.error(00000, "用户ID为空");
		}
		if(StringUtil.isEmpty(str)){
			return ResultAsync.error(00000, "群组ID为空");
		}
		try{
			//删除现有的关联关系
			List<Group> list = identityService.createGroupQuery().groupMember(userId).list();
			if(null!=list&&!list.isEmpty()){
				for(Group g:list){
					identityService.deleteMembership(userId, g.getId());
				}
			}
			String[] ids = str.split(",");
			for(String id:ids){
				identityService.createMembership(userId, id);
			}
		}catch(Exception e){
			log.warn(e.getMessage(), e);
			return ResultAsync.error(00000, "关联群组失败！");
		}
		return ResultAsync.success();
	}
}