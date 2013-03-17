
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpmislata.seguros.negocio;

import javax.validation.Valid;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Min;
import org.hibernate.validator.constraints.NotBlank;

/**
 *
 * @author Lorenzo González
 */
public class Seguro {
    private int idSeguro;
    @NotBlank
    private String nombre;
    @NotBlank
    private String ape1;
    @NotBlank
    private String ape2;
    @Min(18)
    private int edad=18;
    private Sexo sexo=Sexo.Mujer;
    private boolean casado;
    @Min(0)
    private int numHijos;
    private boolean embarazada=true;
    @Valid
    private Coberturas coberturas=new Coberturas();
    @Valid
    private Enfermedades enfermedades=new Enfermedades();

    @AssertTrue(message="Si está embarazada debe ser una mujer")
    private boolean isValidacionEmbarazada() {
        if ( (embarazada==true) && (sexo!=Sexo.Mujer)) {
            return false;
        } else {
            return true;
        }
    }
    
    @AssertTrue(message="Si no está casado no puede tener hijos")
    private boolean isNumHijosCasado() {
        if ( (numHijos>0) && (casado==false)) {
            return false;
        } else {
            return true;
        }
    }    
       
    
    /**
     * @return the idSeguro
     */
    public int getIdSeguro() {
        return idSeguro;
    }

    /**
     * @param idSeguro the idSeguro to set
     */
    public void setIdSeguro(int idSeguro) {
        this.idSeguro = idSeguro;
    }

    /**
     * @return the nombre
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * @param nombre the nombre to set
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * @return the ape1
     */
    public String getApe1() {
        return ape1;
    }

    /**
     * @param ape1 the ape1 to set
     */
    public void setApe1(String ape1) {
        this.ape1 = ape1;
    }

    /**
     * @return the ape2
     */
    public String getApe2() {
        return ape2;
    }

    /**
     * @param ape2 the ape2 to set
     */
    public void setApe2(String ape2) {
        this.ape2 = ape2;
    }

    /**
     * @return the edad
     */
    public int getEdad() {
        return edad;
    }

    /**
     * @param edad the edad to set
     */
    public void setEdad(int edad) {
        this.edad = edad;
    }

    /**
     * @return the sexo
     */
    public Sexo getSexo() {
        return sexo;
    }

    /**
     * @param sexo the sexo to set
     */
    public void setSexo(Sexo sexo) {
        this.sexo = sexo;
    }

    /**
     * @return the casado
     */
    public boolean isCasado() {
        return casado;
    }

    /**
     * @param casado the casado to set
     */
    public void setCasado(boolean casado) {
        this.casado = casado;
    }

    /**
     * @return the numHijos
     */
    public int getNumHijos() {
        return numHijos;
    }

    /**
     * @param numHijos the numHijos to set
     */
    public void setNumHijos(int numHijos) {
        this.numHijos = numHijos;
    }

    /**
     * @return the embarazada
     */
    public boolean isEmbarazada() {
        return embarazada;
    }

    /**
     * @param embarazada the embarazada to set
     */
    public void setEmbarazada(boolean embarazada) {
        this.embarazada = embarazada;
    }

    /**
     * @return the coberturas
     */
    public Coberturas getCoberturas() {
        return coberturas;
    }

    /**
     * @param coberturas the coberturas to set
     */
    public void setCoberturas(Coberturas coberturas) {
        this.coberturas = coberturas;
    }

    /**
     * @return the enfermedades
     */
    public Enfermedades getEnfermedades() {
        return enfermedades;
    }

    /**
     * @param enfermedades the enfermedades to set
     */
    public void setEnfermedades(Enfermedades enfermedades) {
        this.enfermedades = enfermedades;
    }

    /**
     * Calcula el precio en función de las siguientes reglas:
     * El precio del seguro médico es de 100 €
     * Por cada enfermedad que padezca de añadirán 10 € más.
     * Si se añade la cobertura “Oftalmología” se incrementa el seguro en 5 €.
     * Si se añade la cobertura “Dental” se incrementa el seguro en 10 €.
     * Si se añade la cobertura “Fecundación in vitro” se incrementa el seguro en 15 €.
     * @return the precio
     */
    public int getPrecio() {
 
        int precio=100;
        
        if (this.getEnfermedades().isAlergia()) {
            precio=precio+10;
        }
        if (this.getEnfermedades().isCorazon()) {
            precio=precio+10;
        }
        if (this.getEnfermedades().isEstomacal()) {
            precio=precio+10;
        }
        if (this.getEnfermedades().isRinyones()) {
            precio=precio+10;
        } 
        
        if (this.getCoberturas().isOftalmologia()) {
            precio=precio+5;
        }    
        
        if (this.getCoberturas().isDental()) {
            precio=precio+10;
        }           
        if (this.getCoberturas().isFecundacionInVitro()) {
            precio=precio+15;
        }           
                
        
        return precio;
    }

}
