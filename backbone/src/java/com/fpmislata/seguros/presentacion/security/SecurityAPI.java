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
public interface SecurityAPI {
    boolean permitido(String uri,String method,Usuario usuario);
}
