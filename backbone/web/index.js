$(function() {
    var daoSesion=new DAO("/seguros/api","sesion");
    
    $("#btnLogin").click(function() {
        var user={
            login:$("#login").val(),
            password:$("#password").val()
        }
        
        
        daoSesion.insertEntity(user,function(data, textStatus, jqXHR) {
            window.location.href = 'menu.jsp';
        });
        
    });
    
})