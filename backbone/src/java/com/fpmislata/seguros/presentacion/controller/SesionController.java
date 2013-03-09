/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.presentacion.controller;

import com.fpmislata.seguros.datos.BusinessException;
import com.fpmislata.seguros.datos.BusinessMessage;
import com.fpmislata.seguros.datos.UsuarioDAO;
import com.fpmislata.seguros.negocio.Usuario;
import com.fpmislata.seguros.presentacion.json.JsonTransformer;
import java.io.IOException;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Lorenzo González
 */
@Controller
public class SesionController {

    @Autowired
    UsuarioDAO usuarioDAO;
    @Autowired
    JsonTransformer jsonTransformer;

    @RequestMapping(value = {"/sesion"}, method = RequestMethod.POST, consumes = "application/json")
    public void login(HttpServletRequest request, HttpServletResponse httpServletResponse,@RequestBody String jsonUsuario) {
        try {
            Usuario inputUsuario=jsonTransformer.fromJson(jsonUsuario, Usuario.class);

            if ((inputUsuario.getLogin() == null) || (inputUsuario.getLogin().trim().equals(""))) {
                throw new BusinessException(new BusinessMessage("login", "No puede estar vacío"));
            }
            if ((inputUsuario.getPassword() == null) || (inputUsuario.getPassword().trim().equals(""))) {
                throw new BusinessException(new BusinessMessage("password", "No puede estar vacío"));
            }


            Usuario usuario = usuarioDAO.getByLogin(inputUsuario.getLogin());

            if (usuario == null) {
                throw new BusinessException(new BusinessMessage("login", "No existe el login"));
            }

            if (inputUsuario.getPassword().equals(usuario.getPassword()) == false) {
                throw new BusinessException(new BusinessMessage("password", "No es válido"));
            }

            //Creamos la sesión y la el idUsuario
            HttpSession httpSession = request.getSession();
            httpSession.setAttribute("idUsuario", usuario.getIdUsuario());


            //Retornamos el usuario
            String datos = jsonTransformer.toJson(usuario);
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

    @RequestMapping(value = {"/sesion"}, method = RequestMethod.GET, consumes = "application/json")
    public void logged(HttpServletRequest request, HttpServletResponse httpServletResponse) {
        try {
            Usuario usuario;

            HttpSession httpSession = request.getSession();
            Integer idUsuario = (Integer) httpSession.getAttribute("idUsuario");

            if (idUsuario == null) {
                usuario = null;
            } else {
                usuario = usuarioDAO.get(idUsuario);

            }

            if (usuario != null) {
                String datos = jsonTransformer.toJson(usuario);

                httpServletResponse.setStatus(HttpServletResponse.SC_OK);
                httpServletResponse.setContentType("application/json; charset=UTF-8");
                httpServletResponse.getWriter().println(datos);
            } else {
                httpServletResponse.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }

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

    @RequestMapping(value = {"/sesion"}, method = RequestMethod.DELETE, consumes = "application/json")
    public void logout(HttpServletRequest request, HttpServletResponse httpServletResponse) {
        HttpSession httpSession = request.getSession();
        httpSession.setAttribute("idUsuario", null);

        httpServletResponse.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
