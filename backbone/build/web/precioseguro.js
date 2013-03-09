$(function() {
    var daoSesion=new DAO("/seguros/api","seguro");
    
    
    daoSesion.search(null,function(seguros, textStatus, jqXHR) {
        var selectIdCiclo = $("#idSeguro");
        
        jQuery.each(seguros,function () {
            selectIdCiclo.append($("<option />").val(this.idSeguro).text(this.idSeguro + ":"+this.nombre + " " + this.ape1 + " " + this.ape2));
        })
    });
        
        
    $("#btnCalcular").click(function() {
        daoSesion.getEntity($("#idSeguro").val()*1,function(seguro, textStatus, jqXHR) {
            if (jqXHR.status===204) {
                alert("El seguro no existe")
            } else {
                $("#precio").val(seguro.precio);
            }
            
            
        });
        
    });
    
    $("#btnSalir").click(function() {
        window.location.href = 'menu.jsp';
    });
})