/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.datos;

import java.util.List;
import java.util.Map;

/**
 *
 * @author alumno
 */
public interface GenericDAO<TIPO_ENTIDAD, TIPO_PK> {
    TIPO_ENTIDAD create()throws BusinessException;
    void insert(TIPO_ENTIDAD entity)throws BusinessException;
    void update(TIPO_ENTIDAD entity)throws BusinessException;
    TIPO_ENTIDAD get(TIPO_PK id)throws BusinessException;
    void delete(TIPO_PK id)throws BusinessException;
    List<TIPO_ENTIDAD> search(Map<String,Object> filter)throws BusinessException;
}