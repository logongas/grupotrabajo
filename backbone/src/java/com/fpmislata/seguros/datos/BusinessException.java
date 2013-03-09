/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.datos;


import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import javax.validation.ConstraintViolation;

/**
 *
 * @author alumno
 */
public class BusinessException extends Exception {

    private Set<BusinessMessage> bussinessMessages = new TreeSet<BusinessMessage>();

    public BusinessException(List<BusinessMessage> bussinessMessages) {
        this.bussinessMessages.addAll(bussinessMessages);
    }

    public BusinessException(BusinessMessage bussinessMessage) {
        this.bussinessMessages.add(bussinessMessage);
    }

    public BusinessException(Exception ex) {
        bussinessMessages.add(new BusinessMessage(null, ex.toString()));
    }

    public BusinessException(javax.validation.ConstraintViolationException cve) {
        for (ConstraintViolation constraintViolation : cve.getConstraintViolations()) {
            String fieldName;
            String message;

            fieldName = constraintViolation.getPropertyPath().toString();
            message = constraintViolation.getMessage();

            bussinessMessages.add(new BusinessMessage(fieldName, message));
        }
    }

    public BusinessException(org.hibernate.exception.ConstraintViolationException cve) {
        bussinessMessages.add(new BusinessMessage(null, cve.getLocalizedMessage()));
    }

    public Set<BusinessMessage> getBussinessMessages() {
        return bussinessMessages;
    }

}
