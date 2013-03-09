$(function() {
    var daoSesion=new DAO("/seguros/api","sesion");
    
    
        daoSesion.getEntity(null,function(usuario, textStatus, jqXHR) {
            var nombre;
            if (jqXHR.status===204) {
                nombre="No hay sesión"
            } else {
                nombre="Bienvenido " + usuario.nombre + "&nbsp;" + usuario.ape1 + "&nbsp;" + usuario.ape2;
            }
            
            $("#nombre").html(nombre);
        });
        
        
    $("#btnLogout").click(function() {
        
        daoSesion.deleteEntity(null,function() {
            window.location.href = 'index.jsp';
        });
    });
    
})