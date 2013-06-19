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
public class SecurityImplAPI implements SecurityAPI {

    @Override
    public boolean permitido(String uri, String method, Usuario usuario) {
        boolean allow;

        if (uri.indexOf("/seguros/api/seguro") >= 0) {
            if (usuario == null) {
                allow = true;
            } else {
                allow = true;
            }
        } else if (uri.indexOf("/seguros/api/sesion") >= 0) {
            allow = true;
        } else {
            allow = true;
        }

        System.out.println("Seguridad API:" + uri + "=" + allow);

        return allow;
    }
}
