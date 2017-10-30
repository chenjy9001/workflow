package com.baothink.workflow.admin;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebsiteController 
{

  @RequestMapping({"/welcome.html"})
  public String welcome(HttpSession session)
  {
    return "welcome";
  }


  @RequestMapping({"/index.html"})
  public String hemo(HttpSession session)
  {
    return "index";
  }

  @RequestMapping({"/importExcel.html"})
  public String importExcel(HttpServletResponse response)
  {
    return "importExcel";
  }
}