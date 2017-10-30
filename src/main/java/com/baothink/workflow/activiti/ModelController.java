package com.baothink.workflow.activiti;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.ManagementService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.NativeModelQuery;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.baothink.framework.base.controller.ResultAsync;
import com.baothink.framework.base.page.PageRequest;
import com.baothink.framework.core.util.DateUtil;
import com.baothink.framework.core.util.StringUtil;
import com.baothink.workflow.common.PageResult;
import com.baothink.workflow.dto.ModelDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * 
 * 工作流画图控制类<br>
 * <br>
 * @author 陈敬尧
 * @version 1.0,2017年10月10日 下午1:10:20
 * @since baothink-workflow 0.0.1
 */
@Controller
@RequestMapping(value = "/workflow/model")
public class ModelController {
	
	private Logger log = LoggerFactory.getLogger(ModelController.class);
	
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private ManagementService managementService;
	
	/**
	 * 
	 * 跳转到工作流列表<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月10日 下午1:10:48
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "list")
    public ModelAndView modelList() {
        ModelAndView mav = new ModelAndView("workflow/modelList");
        
        return mav;
    }
	
	/**
	 * 
	 * 工作流模板分页查询<br>
	 * <br>
	 * @author 陈敬尧<br>
	 * @version 1.0,2017年10月10日 下午1:17:37
	 * @param pageRequest
	 * @return
	 * @since baothink-workflow 0.0.1
	 */
	@RequestMapping(value = "loadListByPage.htm")
	@ResponseBody
	public PageResult getPageList(PageRequest pageRequest){
		Map<String, String> map = pageRequest.getSearch();
		String value = map.get("value");
		NativeModelQuery modelQuery = repositoryService.createNativeModelQuery();
		StringBuilder sql = new StringBuilder();
		sql.append(" select * from " + managementService.getTableName(Model.class) + " M where 1=1");
		if(!StringUtil.isEmpty(value)){
			sql.append(" and (M.key_ like '%" + value + "%' or M.NAME_ like '%" + value + "%') ");
		}
		
		int count = modelQuery.sql(sql.toString()).list().size();
		List<Model> list = modelQuery.sql(sql.toString()).listPage(pageRequest.getStart(), pageRequest.getLength());
		List<ModelDto> dtoList = new ArrayList<>();
		for(Model model:list){
			ModelDto dto = new ModelDto();
			dto.setId(model.getId());
			dto.setKey(model.getKey());
			dto.setCategory(model.getCategory());
			dto.setCreateTime(DateUtil.format(model.getCreateTime(), "yyyy-MM-dd HH:mm:ss"));
			dto.setDeploymentId(model.getDeploymentId());
			dto.setLastUpdateTime(DateUtil.format(model.getLastUpdateTime(), "yyyy-MM-dd HH:mm:ss"));
			dto.setMetaInfo(model.getMetaInfo());
			dto.setName(model.getName());
			dto.setVersion(model.getVersion().toString());
			dtoList.add(dto);
		}
		PageResult result = new PageResult();
		result.setDraw(pageRequest.getDraw());
		result.setDataList(dtoList);
		result.setRecordsTotal(count);
		result.setRecordsFiltered(count);
		return result;
	}
	
	 /**
     * 创建模型
     */
    @RequestMapping(value = "create", method = RequestMethod.POST)
    @ResponseBody
    public ResultAsync create(@RequestParam("name") String name, @RequestParam("key") String key, @RequestParam("description") String description,
                       HttpServletRequest request, HttpServletResponse response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode editorNode = objectMapper.createObjectNode();
            editorNode.put("id", "canvas");
            editorNode.put("resourceId", "canvas");
            ObjectNode stencilSetNode = objectMapper.createObjectNode();
            stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
            editorNode.put("stencilset", stencilSetNode);
            Model modelData = repositoryService.newModel();

            ObjectNode modelObjectNode = objectMapper.createObjectNode();
            modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME, name);
            modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION, 1);
            description = StringUtils.defaultString(description);
            modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, description);
            modelData.setMetaInfo(modelObjectNode.toString());
            modelData.setName(name);
            modelData.setKey(StringUtils.defaultString(key));

            repositoryService.saveModel(modelData);
            repositoryService.addModelEditorSource(modelData.getId(), editorNode.toString().getBytes("utf-8"));
            return ResultAsync.success(modelData.getId());
//            response.sendRedirect(request.getContextPath() + "/modeler.html?modelId=" + modelData.getId());
        } catch (Exception e) {
            log.error("创建模型失败：", e);
            return ResultAsync.error(00000, e.getMessage());
        }
    }

    /**
     * 根据Model部署流程
     */
    @RequestMapping(value = "deploy.htm")
    @ResponseBody
    public ResultAsync deploy(String modelId) {
        try {
            Model modelData = repositoryService.getModel(modelId);
            ObjectNode modelNode = (ObjectNode) new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
            byte[] bpmnBytes = null;

            BpmnModel model = new BpmnJsonConverter().convertToBpmnModel(modelNode);
            bpmnBytes = new BpmnXMLConverter().convertToXML(model);

            String processName = modelData.getName() + ".bpmn20.xml";
            Deployment deployment = repositoryService.createDeployment().name(modelData.getName()).addString(processName, new String(bpmnBytes, "UTF-8")).deploy();
            return ResultAsync.success(deployment.getId());
        } catch (Exception e) {
            log.error("根据模型部署流程失败：modelId={}", modelId, e);
            return ResultAsync.error(00000, "根据模型部署流程失败：modelId=" + modelId);
        }
    }

    /**
     * 导出model对象为指定类型
     *
     * @param modelId 模型ID
     * @param type    导出文件类型(bpmn\json)
     */
    @RequestMapping(value = "export/{modelId}/{type}")
    public void export(@PathVariable("modelId") String modelId,
                       @PathVariable("type") String type,
                       HttpServletResponse response) {
        try {
            Model modelData = repositoryService.getModel(modelId);
            BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
            byte[] modelEditorSource = repositoryService.getModelEditorSource(modelData.getId());

            JsonNode editorNode = new ObjectMapper().readTree(modelEditorSource);
            BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(editorNode);

            // 处理异常
            if (bpmnModel.getMainProcess() == null) {
                response.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
                response.getOutputStream().println("no main process, can't export for type: " + type);
                response.flushBuffer();
                return;
            }

            String filename = "";
            byte[] exportBytes = null;

            String mainProcessId = bpmnModel.getMainProcess().getId();

            if (type.equals("bpmn")) {

                BpmnXMLConverter xmlConverter = new BpmnXMLConverter();
                exportBytes = xmlConverter.convertToXML(bpmnModel);

                filename = mainProcessId + ".bpmn20.xml";
            } else if (type.equals("json")) {

                exportBytes = modelEditorSource;
                filename = mainProcessId + ".json";

            }

            ByteArrayInputStream in = new ByteArrayInputStream(exportBytes);
            IOUtils.copy(in, response.getOutputStream());

            response.setHeader("Content-Disposition", "attachment; filename=" + filename);
            response.flushBuffer();
        } catch (Exception e) {
            log.error("导出model的xml文件失败：modelId={}, type={}", modelId, type, e);
        }
    }

    /**
     * 
     * 删除模型<br>
     * <br>
     * @author 陈敬尧<br>
     * @version 1.0,2017年10月10日 下午1:18:08
     * @param id
     * @return
     * @since baothink-workflow 0.0.1
     */
    @RequestMapping("deleteAsync.htm")
    @ResponseBody
    public ResultAsync delete( String id) {
        repositoryService.deleteModel(id);
        return ResultAsync.success();
    }
}
