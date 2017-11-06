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
import org.activiti.engine.identity.NativeGroupQuery;
import org.activiti.engine.identity.NativeUserQuery;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.persistence.entity.GroupEntity;
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
 * 群组管理控制类<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月27日 上午10:05:40
 * @since baothink-workflow 0.0.1
 */
@Controller
@RequestMapping(value = "/workflow/group")
public class GroupController {
	
	Logger log = LoggerFactory.getLogger(GroupController.class);
	
	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	
	@Autowired
	private IdentityService identityService;

	@Autowired
	private ManagementService managementService;

	/**
	 * 
	 * 跳转页面<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月31日 上午11:06:32
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "toContent.html")
	public String toContent(){
		return "workflow/groupList";
	}
	
	/**
	 * 
	 * 查询群组列表<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月31日 上午11:06:46
	 * @param request
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "loadListByPage.htm")
	@ResponseBody
	public PageResult getUserPage(PageRequest request){
		Map<String, String> map = request.getSearch();
		String value = map.get("value");
		NativeGroupQuery nativeGroupQuery = identityService.createNativeGroupQuery();
		StringBuilder sql = new StringBuilder();
		sql.append(" select * from " + managementService.getTableName(Group.class) + " U where 1=1 ");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and (U.id_ like '%" + value + "%' or U.NAME_ like '%" + value + "%')");
		}
		int count = nativeGroupQuery.sql(sql.toString()).list().size();
		List<Group> list = nativeGroupQuery.sql(sql.toString()).listPage(request.getStart(), request.getLength());
		List<GroupDto> dtoList = new ArrayList<>();
		for(Group u:list){
			GroupDto dto = new GroupDto();
			dto.setId(u.getId());
			dto.setName(u.getName());
			dto.setType(u.getType());
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
	@RequestMapping(value = "createGroup.htm")
	@ResponseBody
	public ResultAsync createGroup(GroupDto dto){
		if(null == dto){
			return ResultAsync.error(00000, "提交群组信息为空！");
		}
		if(StringUtil.isEmpty(dto.getId())){
			return ResultAsync.error(00000, "群组ID为空！");
		}
		try{
			Group groupquery = identityService.createGroupQuery().groupId(dto.getId()).singleResult();
			if(null != groupquery){
				return ResultAsync.error(00000, "群组已存在！");
			}
			GroupEntity group = new GroupEntity();
			group.setId(dto.getId());
			Group g = identityService.newGroup(dto.getId());
			g.setName(dto.getName());
			g.setType(dto.getType());
			identityService.saveGroup(g);
		} catch (Exception e) {
			log.warn(e.getMessage(), e);
			return ResultAsync.error(00000, "新增群组失败！");
		}
		return ResultAsync.success();
	}
	  
	/**
	 * 
	 * 删除群组<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月30日 下午5:11:09
	 * @param userId
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "deleteGroup.htm")
	@ResponseBody
	public ResultAsync deleteGroup(String[] groupId){
		if(null == groupId){
			return ResultAsync.error(00000, "群组ID为空!");
		}
		try{
			for(String id:groupId){
				identityService.deleteGroup(id);
			}
		}catch (Exception e) {
			return ResultAsync.error(00000, "群组删除失败！");
		}
		return ResultAsync.success();
	}
	
	@RequestMapping(value = "sub.html")
	public String toSubContent(){
		return "workflow/subUserList";
	}
	
	@RequestMapping(value = "loadSubList.htm")
	@ResponseBody
	public PageResult getUserForGroup(PageRequest request, String groupId){
		StringBuilder sql = new StringBuilder();
		PageResult page = new PageResult();
		
		sql.append(" select * from " + managementService.getTableName(User.class) + " u left join act_id_membership m on u.ID_ = m.user_id_ where 1=1 " );
			if(!StringUtil.isEmpty(groupId)){
				sql.append(" AND m.GROUP_ID_ = '" + groupId +"'");
			}
		NativeUserQuery userQuery =  identityService.createNativeUserQuery();
		List<User> list = userQuery.sql(sql.toString()).list();
		long count = list.size();
		List<UserDto> dtoList = new ArrayList<UserDto>();
		for(User u:list){
			UserDto dto = new UserDto();
			dto.setId(u.getId());
			dto.setFirstName(u.getFirstName());
			dto.setLastName(u.getLastName());
			dto.setEmail(u.getEmail());
			dto.setPassword(u.getPassword());
			dtoList.add(dto);
		}
		page.setDataList(dtoList);
		page.setDraw(request.getDraw());
		page.setRecordsFiltered(count);
		page.setRecordsTotal(count);
		return page;
	}
	

}
