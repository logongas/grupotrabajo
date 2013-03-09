/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.datos;

import com.fpmislata.seguros.negocio.Usuario;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Lorenzo González
 */
public class UsuarioDAOImplHibernate extends GenericDAOImplHibernate<Usuario, Integer> implements UsuarioDAO {

    @Override
    public Usuario getByLogin(String login) throws BusinessException {
        Map<String, Object> filter = new HashMap<String, Object>();
        filter.put("login", login);
        List<Usuario> usuarios = this.search(filter);

        if (usuarios.size() > 1) {
            throw new RuntimeException("Login duplicado:" + login);
        }

        if (usuarios.size() == 0) {
            return null;
        } else {
            return usuarios.get(0);
        }
    }
}
