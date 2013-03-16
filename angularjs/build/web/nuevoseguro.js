function SeguroCtrl($scope,$http) {  
    $http.get("/seguros/api/seguro").success(function(data) {
        $scope.seguro = data;
    });    
    
    $scope.sexos=[
        {Codigo:"Hombre",Descripcion:"Hombree"},        
        {Codigo:"Mujer",Descripcion:"Mujerrr"}        
    ]
    
    $scope.visibleTexto=function() {
        
        if ($scope.seguro && $scope.seguro.enfermedades.alergia) {
            return {visibility:"visible"};
        } else {
            return {visibility:"hidden"};
        }
    }
    
    $scope.btnAceptarClick=function() {
        alert("epep")
        $http.post("/seguros/api/seguro",$scope.seguro).success(function(data) {
            $scope.seguro = data;
            alert("Nuevo seguro añadido con id="+data.idSeguro);
            window.location.href = 'menu.jsp';
        }).error(function(data, status, headers, config) {
            if (status===400) {
                var businessMessages=data;
                for(var i=0;i<businessMessages.length;i++) {
                    var businessMessage=businessMessages[i];
                    if (businessMessage.fieldName===null) {
                        alert(businessMessage.message);
                    } else {
                        alert(businessMessage.fieldName+":"+businessMessage.message);
                    }
                }
            } else {
                alert("Falló la petición:"+status+"\n"+data);
            }
        });  
    }
    
}