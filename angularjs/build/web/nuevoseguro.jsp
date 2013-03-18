<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
%>
<!DOCTYPE html>
<html ng-app="seguro">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Seguros</title>
        <link rel="stylesheet" href="/seguros/css/bootstrap.css"> 
        <link rel="stylesheet" href="/seguros/css/style.css"> 
        <script src="/seguros/js/jquery.js"></script>
        <script src="/seguros/js/bootstrap.js"></script>
        <script src="/seguros/js/underscore.js"></script>
        <script src="/seguros/js/angular.js"></script>
        <script src="/seguros/js/dao.js"></script>  
        <script src="/seguros/nuevoseguro.js"></script>  
    </head>
    <body ng-controller="SeguroCtrl">

        <div class="container" style="width: 80%;padding: 0px;border: 0px;">
            <div class="content">
                <form id="mainForm" >             
                    <div class="row">
                        <div class="span12" style="text-align: center" ><h2>Nuevo Seguro</h2></div>
                    </div>               
                    <div class="row">
                        <div class="row">                    
                            <div class="span1" style="text-align: right" >Nombre:</div>
                            <div class="span3" ><input type="text" id="nombre" ng-model="seguro.nombre"/></div>

                            <div class="span1" style="text-align: right">1º&nbsp;Apellido:</div>
                            <div class="span3" ><input type="text" id="ape1" ng-model="seguro.ape1"/></div>

                            <div class="span1" style="text-align: right">2º&nbsp;Apellido:</div>
                            <div class="span3" ><input type="text" id="ape2" ng-model="seguro.ape2"/></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span1" style="text-align: right" >Edad</div>
                        <div class="span3" ><input type="number" id="edad" ng-model="seguro.edad" /></div>

                        <div class="span1" style="text-align: right">Sexo:</div>
                        <div class="span7" >
                            <select id="sexo" ng-model="seguro.sexo" ng-options="sex.Codigo as sex.Descripcion for sex in sexos" >
                                <option value="">-- Elige sexo --</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span12" style="text-align: left" ><h4>Situación personal</h4></div>

                        <div class="row">
                            <div class="span2" style="text-align: right"><input id="casado" type="checkbox" ng-model="seguro.casado"> Casado</div>
                            <div class="span2"  style="text-align: right" >Nº&nbsp;Hijos:</div>
                            <div class="span2" ><input type="number" id="numHijos" class="input-mini" ng-disabled="seguro.casado==false"  ng-model="seguro.numHijos"/></div>
                            <div class="span6" ><input id="embarazada" type="checkbox" ng-model="seguro.embarazada" ng-disabled="isMujer()==false" clear="isMujer()==false" > Embarazada</div>
                        </div>                    
                    </div>  
                    <div class="row">
                        <div class="span12" style="text-align: left" ><h4>Enfermedades</h4></div>

                        <div class="row">
                            <div class="span2" style="text-align: right"><input id="corazon" type="checkbox" ng-model="seguro.enfermedades.corazon"> Corazon</div>
                            <div class="span2" style="text-align: right"><input id="estomacal" type="checkbox" ng-model="seguro.enfermedades.estomacal"> Estomacal</div>
                            <div class="span2" style="text-align: right"><input id="rinyones" type="checkbox" ng-model="seguro.enfermedades.rinyones"> Ri&ntilde;ones</div>
                            <div class="span2" style="text-align: right"><input id="alergia" type="checkbox" ng-model="seguro.enfermedades.alergia"> Alergia</div>
                            <div class="span4" ><input type="text" id="nombreAlergia" placeholder="nombre de la alergía" ng-model="seguro.enfermedades.nombreAlergia" mostrar="seguro.enfermedades.alergia"  /></div>
                        </div>   
                    </div>  
                    <div class="row">
                        <div class="span12" style="text-align: left" ><h4>Coberturas extras</h4></div>

                        <div class="row">
                            <div class="span2" style="text-align: right"><input id="oftalmologia" type="checkbox" ng-model="seguro.coberturas.oftalmologia"> Oftalmologia</div>
                            <div class="span2" style="text-align: center"><input id="dental" type="checkbox" ng-model="seguro.coberturas.dental"> Dental</div>
                            <div class="span8" style="text-align: left"><input id="fecundacionInVitro" type="checkbox" ng-model="seguro.coberturas.fecundacionInVitro"> Fecundacion in vitro</div>
                        </div>   
                    </div>
                </form>                       
                <div class="row">
                    <div class="span11" style="text-align: right" ><button id="btnAceptar" class="btn btn-primary" ng-click="btnAceptarClick()">Aceptar</button> </div>  
                    <div class="span1" style="text-align: right" ><button id="btnCancelar" class="btn" >Cancelar</button> </div>  
                </div>
                <br />
                <div class="row alert alert-error"  data-ng-show="businessMessages.length>0">
                    <strong>Se ha producido los siguientes errores:</strong><button type="button" class="close" data-ng-click="businessMessages=[]">×</button>
                    <div class="row" data-ng-repeat="businessMessage in businessMessages">
                        <div class="span12"  ><strong data-ng-hide="businessMessage.fieldName==null">{{businessMessage.fieldName}}:&nbsp;&nbsp;</strong>{{businessMessage.message}}</div>  
                    </div>
                </div>                
            </div>
        </div>
    </body>
</html>