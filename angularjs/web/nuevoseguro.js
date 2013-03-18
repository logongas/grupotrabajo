function SeguroCtrl($scope,$http) { 
    var scope=$scope;
    
    $scope.log=function(msg) {
        console.log(msg)
    }
    
    $http.get("/seguros/api/seguro").success(function(data) {
        $scope.seguro = data;
    });    
    
    $scope.sexos=[
    {
        Codigo:"Hombre",
        Descripcion:"Hombree"
    },        
    {
        Codigo:"Mujer",
        Descripcion:"Mujerrr"
    }        
    ]
    
    $scope.isMujer=function() {
        if ($scope.seguro) {
            if ($scope.seguro.sexo!="Mujer") {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    
    $scope.$watch('seguro.sexo', function(newVal, oldVal){
        if ($scope.seguro) {
            if ($scope.isMujer()==false) {
                scope.seguro.embarazada=false;
            }
        }
    });

    
    $scope.btnAceptarClick=function() {
        $http.post("/seguros/api/seguro",$scope.seguro).success(function(data) {
            $scope.seguro = data;
            $scope.businessMessages=[];
            alert("Nuevo seguro añadido con id="+data.idSeguro);
            window.location.href = 'menu.jsp';
        }).error(function(data, status, headers, config) {
            if (status===400) {
                $scope.businessMessages=data;                
            } else {
                $scope.businessMessages=[{fieldName:null,message:"Se ha producido un error en la aplicación:"+status+"\n"+data}];
            }
        });  
    }
    
}