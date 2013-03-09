/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.presentacion.json;

/**
 *
 * @author alumno
 */
public interface JsonTransformer {

    /**
     * Transforma un objeto a String en formato JSON.
     * @param model
     * @return 
     */
    String toJson(Object model);

    /**
     * Transforma un String en formato JSON a un objeto.
     *
     * @param <T>
     * @param json
     * @param clazz
     * @return
     */
    <T> T fromJson(String json, Class<T> clazz);
}
