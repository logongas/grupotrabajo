/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.presentacion.security;

import com.fpmislata.seguros.negocio.Usuario;

/**
 *
 * @author Administrador
 */
public class SecurityImplPaginas implements SecurityPaginas {

    @Override
    public boolean permitido(String uri, Usuario usuario) {
        boolean allow;

        if ("/seguros/index.jsp".equals(uri)) {
            allow = true;
        } else if ("/seguros/".equals(uri)) {
            allow = true;
        } else {
            if (usuario == null) {
                allow = false;
            } else {
                allow = true;
            }
        }
        
         System.out.println("Seguridad Pagina:"+uri+"="+allow);       
        
        return allow;
    }
}
