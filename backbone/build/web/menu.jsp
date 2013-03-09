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
        <script src="/seguros/menu.js"></script>          
    </head>
    <body>


        <div class="container" style="width: 450px;">
            <div class="content">
                <div class="row">
                    <div class="formulario" >
                        <h2><span id="nombre" /></h2>
                        <a href="nuevoseguro.jsp" class="btn btn-primary" >Nuevo seguro</a>
                        <a href="precioseguro.jsp" class="btn btn-primary" >Calcular seguro</a>
                        <button id="btnLogout" class="btn btn-primary" >Salir</a>
                    </div>
                </div>
            </div>
        </div> 
    </body>
</html>