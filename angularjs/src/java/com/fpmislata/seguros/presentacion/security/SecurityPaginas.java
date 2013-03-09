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
public interface SecurityPaginas {
    boolean permitido(String uri,Usuario usuario);
}
