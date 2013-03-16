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
        <script src="/seguros/index.js"></script>  
        
    </head>
    <body>
        
            
        <div class="container">
            <div class="content">
                <div class="row">
                    <div class="formulario">
                        <h2>Identificarse</h2>
                            <fieldset>
                                <div class="clearfix">
                                    <input type="text" name="login" id="login" placeholder="usuario">
                                </div>
                                <div class="clearfix">
                                    <input type="password" name="password" id="password" placeholder="contrase&ntilde;a">
                                </div>
                                <button class="btn btn-primary" id="btnLogin" >Entrar</button>
                            </fieldset>
                    </div>
                </div>
            </div>
        </div>0.3 <!-- /container -->
    </body>
</html>