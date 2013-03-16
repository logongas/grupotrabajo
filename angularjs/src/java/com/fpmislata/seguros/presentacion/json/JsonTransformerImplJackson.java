/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.presentacion.json;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 *
 * @author Alumno
 */
public class JsonTransformerImplJackson implements JsonTransformer {

    
    
    @Override
    public String toJson(Object model) {
        ObjectMapper objectMapper = new ObjectMapper();        
        try {
            return objectMapper.writeValueAsString(model);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public <T> T fromJson(String json, Class<T> clazz) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true); 
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); 
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
