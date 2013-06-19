<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Seguros</title>
        <link rel="stylesheet" href="/seguros/css/bootstrap.css">
        <link rel="stylesheet" href="/seguros/css/style.css">
        <script src="/seguros/js/jquery.js"></script>
        <script src="/seguros/js/bootstrap.js"></script>
        <script type='text/javascript' src='/seguros/js/knockout-2.2.1.js'></script>
        <script type='text/javascript' src='/seguros/js/knockout.mapping-latest.debug.js'></script>
        <script src="/seguros/js/dao.js"></script>
        <script src="/seguros/nuevoseguro.js"></script>
    </head>
    <body>

        <div class="container" style="width: 80%;padding: 0px;border: 0px;">
            <div class="content">
                <form id="mainForm" >
                    <div class="row">
                        <div class="span12" style="text-align: center" ><h2>Nuevo Seguro</h2></div>
                    </div>
                    <div class="row">
                        <div class="row">
                            <div class="span1" style="text-align: right" >Nombre:</div>
                            <div class="span3" ><input type="text" id="nombre" data-bind="value: seguro.nombre" /></div>

                            <div class="span1" style="text-align: right">1º&nbsp;Apellido:</div>
                            <div class="span3" ><input type="text" id="ape1" data-bind="value: seguro.ape1"  /></div>

                            <div class="span1" style="text-align: right">2º&nbsp;Apellido:</div>
                            <div class="span3" ><input type="text" id="ape2" data-bind="value: seguro.ape2"   /></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span1" style="text-align: right" >Edad</div>
                        <div class="span3" ><input type="number" id="edad" data-bind="value: seguro.edad" /></div>

                        <div class="span1" style="text-align: right">Sexo:</div>
                        <div class="span7" >
                            <select id="sexo"  data-bind="value: seguro.sexo"   >
                                <option value="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span12" style="text-align: left" ><h4>Situación personal</h4></div>
                    </div>
                    <div class="row">
                        <div class="span2" style="text-align: right"><input id="casado" type="checkbox"  data-bind="checked: seguro.casado"  > Casado</div>
                        <div class="span2"  style="text-align: right" >Nº&nbsp;Hijos:</div>
                        <div class="span2" ><input type="number" id="numHijos" class="input-mini"  data-bind="value: seguro.numHijos"   /></div>
                        <div class="span6" ><input id="embarazada" type="checkbox"  data-bind="checked: seguro.embarazada"  > Embarazada</div>
                    </div>
                    <div class="row">
                        <div class="span12" style="text-align: left" ><h4>Enfermedades</h4></div>
                    </div>
                    <div class="row">
                        <div class="span2" style="text-align: right"><input id="corazon" type="checkbox"  data-bind="checked: seguro.enfermedades.corazon"  > Corazon</div>
                        <div class="span2" style="text-align: right"><input id="estomacal" type="checkbox"  data-bind="checked: seguro.enfermedades.estomacal"  > Estomacal</div>
                        <div class="span2" style="text-align: right"><input id="rinyones" type="checkbox"  data-bind="checked: seguro.enfermedades.rinyones"  > Ri&ntilde;ones</div>
                        <div class="span2" style="text-align: right"><input id="alergia" type="checkbox"   data-bind="checked: seguro.enfermedades.alergia"  > Alergia</div>
                        <div class="span4" ><input type="text" id="nombreAlergia" placeholder="nombre de la alergía"   data-bind="value: seguro.enfermedades.nombreAlergia,visible:seguro.enfermedades.alergia"   /></div>
                    </div>

                    <div class="row">
                        <div class="span12" style="text-align: left" ><h4>Coberturas extras</h4></div>
                    </div>
                    <div class="row">
                        <div class="span2" style="text-align: right"><input id="oftalmologia" type="checkbox" data-bind="checked: seguro.coberturas.oftalmologia" > Oftalmologia</div>
                        <div class="span2" style="text-align: center"><input id="dental" type="checkbox" data-bind="checked: seguro.coberturas.dental" > Dental</div>
                        <div class="span8" style="text-align: left"><input id="fecundacionInVitro" type="checkbox" data-bind="checked: seguro.coberturas.fecundacionInVitro" > Fecundacion in vitro</div>
                    </div>

                </form>
                <div class="row">
                    <div class="span11" style="text-align: right" ><button id="btnAceptar" class="btn btn-primary" data-bind="click: btnAceptar" >Aceptar</button> </div>
                    <div class="span1" style="text-align: right" ><button id="btnCancelar" class="btn" data-bind="click: btnCancelar" >Cancelar</button> </div>
                </div>

            </div>
        </div>
    </body>
</html>