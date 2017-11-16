/*
 * 文件名：TestHandler.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月25日 下午4:54:06
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.handler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bouncycastle.math.Primes;
import org.springframework.web.bind.annotation.RestController;

import com.baothink.interfaces.core.client.InterfaceHttpClient;
import com.baothink.interfaces.core.client.SIClientResult;
import com.baothink.interfaces.core.exception.BaothinkIntefaceCoreException;
import com.baothink.workflow.dto.MemberDto;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月25日 下午4:54:06
 * @since baothink-workflow 0.0.1
 */
@RestController
public class TestHandler {

	public static void main(String[] args) throws BaothinkIntefaceCoreException {
		
		// 获取授权码
//		String url1 = "http://192.168.18.119:8080/baothink-workflow/getIdCode";
//		String authCode = InterfaceHttpClient.getAuthCode(url1, "activiti", "123456");
//		System.out.println("授权码：" + authCode);
		// 调用接口（通过授权码进行身份验证）
//		String url2 = "http://localhost:8090/ecp-demo-interface/dataSynch";
//		Map<String, Object> dataMap1 = new HashMap<String, Object>();
//		dataMap1.put("code", "测试代码");
//		SIClientResult result1 = InterfaceHttpClient.doPostByAuth(url2, "test", "test", "123456", authCode, dataMap1);
//		System.out.println(result1.getHttpStatus());
//		System.out.println(result1.getCode());
//		System.out.println(result1.getMsg());
//		System.out.println(result1.getData());
//		// 调用接口（通过账号密码进行身份验证）
//		String url3 = "http://localhost:8090/ecp-demo-interface/dataSynch";
//		Map<String, Object> dataMap2 = new HashMap<String, Object>();
//		dataMap2.put("code", "测试代码");
//		SIClientResult result2 = InterfaceHttpClient.doPostByAuth(url3, "test", "test", "123456", dataMap2);
//		System.out.println(result2.getHttpStatus());
//		System.out.println(result2.getCode());
//		System.out.println(result2.getMsg());
//		System.out.println(result2.getData());
		// 调用接口（无需身份）
		String url4 = "http://localhost:8080/baothink-workflow/dataSynch";
		Map<String, Object> dataMap3 = new HashMap<String, Object>();
		List<MemberDto> userList = new ArrayList<>();
		MemberDto dto = new MemberDto();
		dto.setGroupId("employee");
		dto.setUserId("chenjy");
		userList.add(dto);
		dataMap3.put("memberDto", userList);
		SIClientResult result3 = InterfaceHttpClient.doPost(url4, "createUserHandler", "activiti", dataMap3);
		System.out.println(result3.getHttpStatus());
		System.out.println(result3.getCode());
		System.out.println(result3.getMsg());
		System.out.println(result3.getData());
        System.out.println("distinctPrimary result is: ");
	}
	
	
	
}
