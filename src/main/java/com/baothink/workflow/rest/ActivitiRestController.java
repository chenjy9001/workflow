/*
 * 文件名：ActivitiRestController.java
 * 版权：Copyright 2012-2016 广州宝锶信息技术有限公司
 * 创建人：陈敬尧
 * 创建时间：2017年10月24日 下午5:52:19
 * 修改人：
 * 修改时间：
 * 修改内容：
 */
package com.baothink.workflow.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * TODO<一句话功能描述><br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月24日 下午5:52:19
 * @since baothink-workflow 0.0.1
 */
@RequestMapping(value = "/refect")
@Controller
public class ActivitiRestController {

	@RequestMapping(value = "testPut", method = RequestMethod.PUT, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public void testPut(){
		System.out.println("成功调用！");
	}
}
