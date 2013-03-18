
var app = angular.module('seguro', []);

app.directive('mostrar', function() {

    return function($scope, element, attributes) {
        function mostrar(element) {
            $(element).css({
                visibility:"visible"
            })
        }
        function ocultar(element) {
            $(element).css({
                visibility:"hidden"
            })
        }
        
        var expression = attributes.mostrar;
        if ($scope.$eval( expression )===true ) {
            mostrar(element);
        } else {
            ocultar(element);
        }
        
        $scope.$watch(expression,function( newValue, oldValue ) {
            if ( newValue === oldValue ) {
                return;
            }
 
            if ( newValue===true ) {
                mostrar(element);
            } else { 
                ocultar(element);
            }
 
        });        
    }
});

app.directive('clear', function() {

    return function($scope, element, attributes) {
        function setDeep(obj, keyString, newValue) {
            for(var keys = keyString.split('.'), i = 0, l = keys.length; i < l - 1; i++) {
                obj = obj[keys[i]];
                if(obj === undefined) {
                    return undefined;
                }
            }
            if(obj[keys[l - 1]] === undefined) {
                return undefined;
            }
            obj[keys[l - 1]] = newValue;
            return newValue;
        }        
        
        function clear($scope,model) {
            setDeep($scope,model,null);
        }

        var expression = attributes.clear;
        if ($scope.$eval( expression )===true ) {
            clear($scope,attributes.ngModel);
        }

        $scope.$watch(expression,function( newValue, oldValue ) {           
            if ( newValue === oldValue ) {
                return;
            }
 
            if ( newValue===true ) {
                clear($scope,attributes.ngModel);
            }
 
        });  
        
    }
});


function SeguroCtrl($scope,$http) {         
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
                $scope.businessMessages=[{
                    fieldName:null,
                    message:"Se ha producido un error en la aplicación:"+status+"\n"+data
                }];
            }
        });  
    }
    
}