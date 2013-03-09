/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.presentacion.controller;

import com.fpmislata.seguros.datos.BusinessException;
import com.fpmislata.seguros.datos.BusinessMessage;
import com.fpmislata.seguros.datos.SeguroDAO;
import com.fpmislata.seguros.negocio.Seguro;
import com.fpmislata.seguros.presentacion.json.JsonTransformer;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Lorenzo González
 */
@Controller
public class SeguroController {

    @Autowired
    SeguroDAO seguroDAO;
    @Autowired
    JsonTransformer jsonTransformer;

    @RequestMapping(value = {"/seguro"}, method = RequestMethod.POST, consumes = "application/json")
    public void insert(HttpServletRequest request, HttpServletResponse httpServletResponse, @RequestBody String json) {
        try {
            Seguro seguro = jsonTransformer.fromJson(json, Seguro.class);

            seguroDAO.insert(seguro);
            String datos = jsonTransformer.toJson(seguro);

            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            httpServletResponse.getWriter().println(datos);

        } catch (BusinessException be) {

            Set<BusinessMessage> businessMessages = be.getBussinessMessages();
            String jsonBusinessMessages = jsonTransformer.toJson(businessMessages);

            httpServletResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            try {
                httpServletResponse.getWriter().println(jsonBusinessMessages);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        } catch (Exception ex) {
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("text/plain; charset=UTF-8");
            try {
                ex.printStackTrace(httpServletResponse.getWriter());
            } catch (IOException ex1) {
                throw new RuntimeException(ex1);
            }
        }
    }

    
    @RequestMapping(value = {"/seguro/{idSeguro}"}, method = RequestMethod.GET, consumes = "application/json")
    public void get(HttpServletRequest request, HttpServletResponse httpServletResponse, @PathVariable("idSeguro") int idSeguro) {
        try {
            Seguro seguro = seguroDAO.get(idSeguro);

            String datos = jsonTransformer.toJson(seguro);

            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            httpServletResponse.getWriter().println(datos);

        } catch (BusinessException be) {

            Set<BusinessMessage> businessMessages = be.getBussinessMessages();
            String jsonBusinessMessages = jsonTransformer.toJson(businessMessages);

            httpServletResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            try {
                httpServletResponse.getWriter().println(jsonBusinessMessages);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        } catch (Exception ex) {
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("text/plain; charset=UTF-8");
            try {
                ex.printStackTrace(httpServletResponse.getWriter());
            } catch (IOException ex1) {
                throw new RuntimeException(ex1);
            }
        }
    }
    
    @RequestMapping(value = {"/seguro/search"}, method = RequestMethod.GET, consumes = "application/json")
    public void search(HttpServletRequest request, HttpServletResponse httpServletResponse) {
        try {
            List<Seguro> seguros = seguroDAO.search(null);

            String datos = jsonTransformer.toJson(seguros);

            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            httpServletResponse.getWriter().println(datos);

        } catch (BusinessException be) {

            Set<BusinessMessage> businessMessages = be.getBussinessMessages();
            String jsonBusinessMessages = jsonTransformer.toJson(businessMessages);

            httpServletResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            try {
                httpServletResponse.getWriter().println(jsonBusinessMessages);
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        } catch (Exception ex) {
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("text/plain; charset=UTF-8");
            try {
                ex.printStackTrace(httpServletResponse.getWriter());
            } catch (IOException ex1) {
                throw new RuntimeException(ex1);
            }
        }
    }        
    
}
