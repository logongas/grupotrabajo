/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.presentacion.security;

import com.fpmislata.seguros.datos.BusinessException;
import com.fpmislata.seguros.datos.BusinessMessage;
import com.fpmislata.seguros.datos.UsuarioDAO;
import com.fpmislata.seguros.negocio.Usuario;
import com.fpmislata.seguros.presentacion.json.JsonTransformer;
import java.io.IOException;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrador
 */
public class FilterImplSecurityAPI implements Filter {

    @Autowired
    SecurityAPI securityAPI;
    @Autowired
    UsuarioDAO usuarioDAO;
    @Autowired
    JsonTransformer jsonTransformer;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

        try {


            String uri = httpServletRequest.getRequestURI();
            String method = httpServletRequest.getMethod();

            Usuario usuario;
            Integer idUsuario = (Integer) httpServletRequest.getSession(true).getAttribute("idUsuario");
            if (idUsuario == null) {
                usuario = null;
            } else {
                usuario = usuarioDAO.get(idUsuario);
            }

            if (securityAPI.permitido(uri, method, usuario) == true) {
                filterChain.doFilter(servletRequest, servletResponse);
            } else {
                httpServletResponse.setContentType("text/plain; charset=UTF-8");
                httpServletResponse.getWriter().println("Su sesión ha caducado o no tiene permisos");
                httpServletResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
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

    @Override
    public void destroy() {
    }
}
