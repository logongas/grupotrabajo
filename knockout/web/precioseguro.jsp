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
        <script src="/seguros/js/dao.js"></script>  
        <script src="/seguros/precioseguro.js"></script>  

    </head>
    <body>
        <div class="container" style="width: 80%;padding: 0px;border: 0px;">
            <div class="content">

                <div class="row">
                    <div class="span12" ><h3>Obtener precio del seguro</h3></div>  
                </div>
                
                <div class="row">
                    <div class="span1" style="text-align: right">Seguro:</div>
                    <div class="span8" >
                        <select id="idSeguro" >
                        </select>
                    </div>
 
                </div>
                <div class="row">
                                       <div class="span12" ><button id="btnCalcular" class="btn btn-primary" >Calcular</button> </div>  

                </div>
                <br />
                <div class="row">
                    <div class="span1" style="text-align: right">Precio:</div>
                    <div class="span11" >
                        <input type="number" id="precio"  />
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="span12" ><button id="btnSalir" class="btn" >Salir</button> </div>  

                </div>
            </div>
        </div>
    </body>
</html>