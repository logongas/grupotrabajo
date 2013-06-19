/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.datos;

import com.fpmislata.seguros.negocio.Usuario;

/**
 *
 * @author Lorenzo González
 */
public interface UsuarioDAO extends GenericDAO<Usuario,Integer>  {
    Usuario getByLogin(String login) throws BusinessException ;
}
