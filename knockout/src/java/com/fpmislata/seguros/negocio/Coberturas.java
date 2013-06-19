/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.negocio;

/**
 *
 * @author Lorenzo González
 */
public class Coberturas {
    private boolean oftalmologia=true;
    private boolean dental=true;
    private boolean fecundacionInVitro;

    /**
     * @return the oftalmologia
     */
    public boolean isOftalmologia() {
        return oftalmologia;
    }

    /**
     * @param oftalmologia the oftalmologia to set
     */
    public void setOftalmologia(boolean oftalmologia) {
        this.oftalmologia = oftalmologia;
    }

    /**
     * @return the dental
     */
    public boolean isDental() {
        return dental;
    }

    /**
     * @param dental the dental to set
     */
    public void setDental(boolean dental) {
        this.dental = dental;
    }

    /**
     * @return the fecundacionInVitro
     */
    public boolean isFecundacionInVitro() {
        return fecundacionInVitro;
    }

    /**
     * @param fecundacionInVitro the fecundacionInVitro to set
     */
    public void setFecundacionInVitro(boolean fecundacionInVitro) {
        this.fecundacionInVitro = fecundacionInVitro;
    }
}
