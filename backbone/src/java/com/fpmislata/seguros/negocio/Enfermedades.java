/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.negocio;

import javax.validation.constraints.AssertTrue;

/**
 *
 * @author Lorenzo González
 */
public class Enfermedades {

    private boolean corazon;
    private boolean estomacal;
    private boolean rinyones;
    private boolean alergia;
    private String nombreAlergia;

    @AssertTrue(message = "El nombre de la alergia no puede estar vacio")
    private boolean isValidNombreAlergia() {
        if ((alergia == true) && ((nombreAlergia == null) || (nombreAlergia.trim().equals("")))) {
            return false;
        } else {
            return true;
        }
    }

    @AssertTrue(message = "No se pueden tener más de 3 enfermedades")
    private boolean isValidMax3Enfermedades() {
        int num = 0;

        if (corazon) {
            num++;
        }
        if (estomacal) {
            num++;
        }
        if (rinyones) {
            num++;
        }
        if (alergia) {
            num++;
        }



        if (num > 3) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @return the corazon
     */
    public boolean isCorazon() {
        return corazon;
    }

    /**
     * @param corazon the corazon to set
     */
    public void setCorazon(boolean corazon) {
        this.corazon = corazon;
    }

    /**
     * @return the estomacal
     */
    public boolean isEstomacal() {
        return estomacal;
    }

    /**
     * @param estomacal the estomacal to set
     */
    public void setEstomacal(boolean estomacal) {
        this.estomacal = estomacal;
    }

    /**
     * @return the rinyones
     */
    public boolean isRinyones() {
        return rinyones;
    }

    /**
     * @param rinyones the rinyones to set
     */
    public void setRinyones(boolean rinyones) {
        this.rinyones = rinyones;
    }

    /**
     * @return the alergia
     */
    public boolean isAlergia() {
        return alergia;
    }

    /**
     * @param alergia the alergia to set
     */
    public void setAlergia(boolean alergia) {
        this.alergia = alergia;
    }

    /**
     * @return the nombreAlergia
     */
    public String getNombreAlergia() {
        return nombreAlergia;
    }

    /**
     * @param nombreAlergia the nombreAlergia to set
     */
    public void setNombreAlergia(String nombreAlergia) {
        this.nombreAlergia = nombreAlergia;
    }
}
