package com.baothink.workflow.admin;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.baothink.framework.base.exception.BaseControllerException;
import com.baothink.framework.core.login.AdminLoginUserInfo;
import com.baothink.framework.web.base.admin.BaseAdminController;

@Controller
public class WebsiteController extends BaseAdminController
{

  @RequestMapping({"/welcome.html"})
  public String welcome(HttpSession session)
  {
    return "welcome";
  }


  @RequestMapping({"/login.html"})
  public String login()
  {
    Object obj = this.session.getAttribute(this.baseConfigProperties.getLoginInfoKey());
    if (obj != null) {
      return "redirect:/index.html";
    }
    return "login";
  }

  @RequestMapping({"/importExcel.html"})
  public String importExcel(HttpServletResponse response)
  {
    return "importExcel";
  }
  
  @RequestMapping({"/index.html"})
  public String index(ModelMap map)
  {
	  AdminLoginUserInfo userInfo = null;
    try
    {
      userInfo = getAdminLoginUserInfo();
    }
    catch (BaseControllerException e)
    {
      userInfo = null;
      return "login";
    }
    map.put("loginName", userInfo.getEmpName());
    map.put("loginPtName", userInfo.getPtName());
    map.put("loginPhoto", userInfo.getPhoto());
    return "index";
  }

  @RequestMapping({"/"})
  public String hemo(HttpSession session)
  {
    return "index";
  }
}