$(function() {

    var viewModel = {
        seguro:{
            "idSeguro":ko.observable(),
            "nombre":ko.observable(),
            "ape1":ko.observable(),
            "ape2":ko.observable(),
            "edad":ko.observable(),
            "sexo":ko.observable(),
            "casado":ko.observable(true),
            "numHijos":ko.observable(),
            "embarazada":ko.observable(),
            "coberturas":{
                "oftalmologia":ko.observable(),
                "dental":ko.observable(),
                "fecundacionInVitro":ko.observable()
            },
            "enfermedades":{
                "corazon":ko.observable(),
                "estomacal":ko.observable(),
                "rinyones":ko.observable(),
                "alergia":ko.observable(),
                "nombreAlergia":ko.observable()
            },
            "precio":ko.observable()
        },
        btnAceptar:function() {
            var seguro = ko.mapping.toJS(viewModel.seguro);
            seguroDAO.insertEntity(seguro,function(data) {
                alert("Nuevo seguro añadido con id="+data.idSeguro);
                window.location.href = 'menu.jsp';
            });

        },
        btnCancelar: function(){
            window.location.href = 'menu.jsp';
        }
    }


    ko.applyBindings(viewModel);

    var seguroDAO=new DAO("/seguros/api/","seguro");
    seguroDAO.createEntity(function(data) {
        ko.mapping.fromJS(data,{}, viewModel.seguro);

    });

})