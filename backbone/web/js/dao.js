  

function DAO(urlBase,entityName) {
    this.urlBase=urlBase;
    this.entityName=entityName;
        
    this.onSuccessCallback=function(data, textStatus, jqXHR) {
    }
        
    this.onErrorCallback=function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status===400) {
            var businessMessages=jQuery.parseJSON(jqXHR.responseText);
            for(var i=0;i<businessMessages.length;i++) {
                var businessMessage=businessMessages[i];
                if (businessMessage.fieldName===null) {
                    alert(businessMessage.message);
                } else {
                    alert(businessMessage.fieldName+":"+businessMessage.message);
                }
            }
        } else {
            alert("Falló la petición:"+textStatus+"\n"+errorThrown);
        }
    }        
        
}

DAO.prototype.getEntity=function(key,onSuccessCallback,onErrorCallback,params) {
        
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }
                
    var queryString;
    if ((typeof(params)==="object") && (params!=null)) {
        queryString = "?" + jQuery.param(params);
    } else {
        queryString="";
    }
    
    var keyString;
    if (key===null) {
        keyString="";
    } else {
        keyString="/"+key;
    }
    
    jQuery.ajax({
        type: 'GET',
        contentType: 'application/json',
        dataType: "json",
        url: this.urlBase + '/' + this.entityName + keyString+queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    });   
}

DAO.prototype.insertEntity=function(entity,onSuccessCallback,onErrorCallback,params) {
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }

    var queryString;
    if ((typeof(params)==="object") && (params!=null)) {
        queryString = "?" + jQuery.param(params);
    } else {
        queryString="";
    }

    jQuery.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: "json",
        data:JSON.stringify(entity),
        url: this.urlBase + '/' + this.entityName + "/"+queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    });
}

DAO.prototype.updateEntity=function(key,entity,onSuccessCallback,onErrorCallback,params) {
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }
    
    var queryString;
    if ((typeof(params)==="object") && (params!=null)) {
        queryString = "?" + jQuery.param(params);
    } else {
        queryString="";
    }
    
    var keyString;
    if (key===null) {
        keyString="";
    } else {
        keyString="/"+key;
    }    
    
    jQuery.ajax({
        type: 'PUT',
        contentType: 'application/json',
        dataType: "json",
        data:JSON.stringify(entity),
        url: this.urlBase + '/' + this.entityName +keyString+queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    });
}


DAO.prototype.deleteEntity=function(key,onSuccessCallback,onErrorCallback,params) {
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }
                
    var queryString;
    if ((typeof(params)==="object") && (params!=null)) {
        queryString = "?" + jQuery.param(params);
    } else {
        queryString="";
    }
    
    var keyString;
    if (key===null) {
        keyString="";
    } else {
        keyString="/"+key;
    }    
    
    jQuery.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        dataType: "json",
        url: this.urlBase + '/' + this.entityName +keyString+queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    });         
}


DAO.prototype.createEntity=function(onSuccessCallback,onErrorCallback,params) {
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }
    
    var queryString;
    if ((typeof(params)==="object") && (params!=null)) {
        queryString = "?" + jQuery.param(params);
    } else {
        queryString="";
    }
        
    jQuery.ajax({
        type: 'GET',
        contentType: 'application/json',
        dataType: "json",
        url: this.urlBase + '/' + this.entityName + "/" + queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    }); 
}

DAO.prototype.search=function(filter,onSuccessCallback,onErrorCallback) {
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }

    var queryString;
    if ((typeof(filter)==="object") && (filter!=null)) {
        queryString = "?" + jQuery.param(filter);
    } else {
        queryString="";
    }
        
    jQuery.ajax({
        type: 'GET',
        contentType: 'application/json',
        dataType: "json",
        url: this.urlBase + '/' + this.entityName + "/search"+queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    });     
}  


DAO.prototype.paginatedSearch=function(filter,page,pageSize,onSuccessCallback,onErrorCallback) {
    if (typeof(onSuccessCallback)!="function") {
        onSuccessCallback= this.onSuccessCallback;
    }
    if (typeof(onErrorCallback)!="function") {
        onErrorCallback= this.onErrorCallback;
    }

    filter.page=page;
    filter.pageSize=pageSize;
    
    var queryString;
    if ((typeof(filter)==="object") && (filter!=null)) {
        queryString = "?" + jQuery.param(filter);
    } else {
        queryString="";
    }
        
    jQuery.ajax({
        type: 'GET',
        contentType: 'application/json',
        dataType: "json",
        url: this.urlBase + '/' + this.entityName + "/paginatedsearch"+queryString,
        success: onSuccessCallback,
        error: onErrorCallback
    });     
} 


