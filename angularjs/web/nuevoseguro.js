$(function() {
    var Seguro = Backbone.Model.extend({
        defaults: {
            nombre:"Hola",
            ape1:null,
            ape2:null,            
            edad:null,            
            sexo:null,            
            casado:true,            
            numHijos:null,            
            embarazada:null,            
            coberturas:{
                oftalmologia:null,            
                dental:null,            
                fecundacionInVitro:null
            },
            enfermedades:{
                corazon:null,            
                estomacal:null,            
                rinyones:null,            
                alergia:true,            
                nombreAlergia:null         
            }
        },
        urlRoot:"/seguros/api/seguro"
    });


    var SeguroView = Backbone.View.extend({
        el: $('body'), 
        model:{},
        events: {
            'click #btnAceptar': 'btnAceptar',
            'click #btnCancelar': 'btnCancelar',
            'click #alergia' : 'alergia'
        },
        initialize: function(){
            _.bindAll(this,"btnAceptar","btnCancelar","alergia");
            this.render();
        },
        render: function(){
            modelToView(this.model);
        },
        btnAceptar: function(){
            this.model.save(viewToModel(),{
                success:function () {
                    window.location.href = 'menu.jsp';
                },
                error: function (model, xhr, options) {
                    if (xhr.status===400) {
                        var businessMessages=jQuery.parseJSON(xhr.responseText);
                        for(var i=0;i<businessMessages.length;i++) {
                            var businessMessage=businessMessages[i];
                            if (businessMessage.fieldName===null) {
                                alert(businessMessage.message);
                            } else {
                                alert(businessMessage.fieldName+":"+businessMessage.message);
                            }
                        }
                    } else {
                        alert("Falló la petición");
                    }
                }
            })
        },
        btnCancelar: function(){
            window.location.href = 'menu.jsp';
        },
        alergia: function () {
            if($("#alergia").prop("checked")){
                $("#nombreAlergia").css({
                    visibility:"visible"
                })
            } else {
                $("#nombreAlergia").css({
                    visibility:"hidden"
                })
            }
        }
    });

    var seguro=new Seguro();

    var seguroView = new SeguroView({
        model:seguro
    });

    
    function modelToView(seguro) {
        $("#nombre").val(seguro.get("nombre"));
        $("#ape1").val(seguro.get("ape1"));
        $("#ape2").val(seguro.get("ape2"));            
        $("#edad").val(seguro.get("edad"));            
        $("#sexo").val(seguro.get("sexo"));            
        if (seguro.get("casado")) {
            $("#casado").prop("checked","checked");           
        }else {
            $("#casado").removeAttr('checked');
        }           
        $("#numHijos").val(seguro.get("numHijos")); 
        if (seguro.get("embarazada")) {
            $("#embarazada").prop("checked","checked");           
        }else {
            $("#embarazada").removeAttr('checked');
        }
        if (seguro.get("coberturas").oftalmologia) {
            $("#oftalmologia").prop("checked","checked");           
        }else {
            $("#oftalmologia").removeAttr('checked');
        }
        if (seguro.get("coberturas").dental) {
            $("#dental").prop("checked","checked");           
        }else {
            $("#dental").removeAttr('checked');
        }			
        if (seguro.get("coberturas").fecundacionInVitro) {
            $("#fecundacionInVitro").prop("checked","checked");           
        }else {
            $("#fecundacionInVitro").removeAttr('checked');
        }				
			
        if (seguro.get("enfermedades").corazon) {
            $("#corazon").prop("checked","checked");           
        }else {
            $("#corazon").removeAttr('checked');
        }			
        if (seguro.get("enfermedades").estomacal) {
            $("#estomacal").prop("checked","checked");           
        }else {
            $("#estomacal").removeAttr('checked');
        }			
        if (seguro.get("enfermedades").rinyones) {
            $("#rinyones").prop("checked","checked");           
        }else {
            $("#rinyones").removeAttr('checked');
        }			
        if (seguro.get("enfermedades").alergia) {
            $("#alergia").prop("checked","checked");
            $("#nombreAlergia").css({
                visibility:"visible"
            })
        }else {
            $("#alergia").removeAttr('checked');
            $("#nombreAlergia").css({
                visibility:"hidden"
            })
        }			
        $("#nombreAlergia").val(seguro.get("enfermedades").nombreAlergia); 
    }
    
    function viewToModel(seguro) {
        var newModel={
            nombre:$("#nombre").val(),
            ape1:$("#ape1").val(),
            ape2:$("#ape2").val(),            
            edad:$("#edad").val(),            
            sexo:$("#sexo").val(),            
            casado:$("#casado").prop("checked"),            
            numHijos:$("#numHijos").val(),            
            embarazada:$("#embarazada").prop("checked"),            
            coberturas:{
                oftalmologia:$("#oftalmologia").prop("checked"),            
                dental:$("#dental").prop("checked"),            
                fecundacionInVitro:$("#fecundacionInVitro").prop("checked")
            },
            enfermedades:{
                corazon:$("#corazon").prop("checked"),            
                estomacal:$("#estomacal").prop("checked"),            
                rinyones:$("#rinyones").prop("checked"),            
                alergia:$("#alergia").prop("checked"),            
                nombreAlergia:$("#nombreAlergia").val()            
            }        
        }
        
        if (seguro) {
            seguro.set(newModel);
        }
        
        return newModel;
    }
    
})