
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
        function setValue(obj,key,newValue) {
            var keys = key.split('.');
            for(var i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
                if(obj === undefined) {
                    return;
                }
            }
            if(obj[keys[keys.length - 1]] === undefined) {
                return;
            }
            obj[keys[keys.length - 1]] = newValue;
        }        
        

        var clear = attributes.clear;
        var clearValue=attributes.clearValue;
        var ngModel=attributes.ngModel;
        if (clearValue===undefined) {
            clearValue="null";//Es un String pq luego se hace un "$eval"
        }
        
        if ($scope.$eval(clear)===true ) {
            setValue($scope,ngModel,$scope.$eval(clearValue));
        }

        $scope.$watch(clear,function( newValue, oldValue ) {    
            
            if ( newValue === oldValue ) {
                return;
            }
            if ( newValue===true ) {
                setValue($scope,ngModel,$scope.$eval(clearValue));
            }
 
        });  
        
    }
});


function SeguroCtrl($scope,$http) { 
    regula.bind(); 
    
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
        
        if ($scope.validate()==false) {
            return;
        }
        
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
                    message:data + ".Estado HTTP:"+status
                }];
            }
        });  
    }
    
    $scope.validate=function() {
        function getFieldName(element) {
            var fieldName;
            function isValidName(name) {
                if ((typeof(name)==="string") && (name!="") ) {
                    return true;
                } else {
                    return false;
                }
            }
            
            fieldName=element.name;
            if (isValidName(fieldName)==false) {
                var ngModel=element.attributes["ng-model"].value;
                var fieldNames = ngModel.split('.');
                if (fieldNames.length==1) {
                    fieldName=fieldNames[0]
                } else {
                    for(var i = 1; i < fieldNames.length; i++) {
                        if (i==1) {
                            fieldName=fieldNames[i];
                        } else {
                            fieldName=fieldName+"."+fieldNames[i]
                        }
                    }
                }
                if (isValidName(fieldName)==false) {
                    fieldName=element.id+"";
                    if (isValidName(fieldName)==false) {
                        fieldName=null;
                    }                    
                }
            }
            
            return fieldName;
        }
        
        
        $scope.businessMessages=[];
        var validationResults = regula.validate();

        for(var i = 0; i < validationResults.length; i++) {
            var validationResult = validationResults[i];
            var message=validationResult.message;
            var fieldName;
            if (validationResult.failingElements.length==0) {
                fieldName=null;
            } else {
                fieldName=getFieldName(validationResult.failingElements[0])
            }
            
            $scope.businessMessages.push(
            {
                fieldName:fieldName,
                message:message
            }
            )
        } 
        
        return ($scope.businessMessages.length==0)
    }
    
}