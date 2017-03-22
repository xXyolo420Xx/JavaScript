var net = new Object();
net.READY_STATE_UNINITIALIZED=0; 
net.READY_STATE_LOADING=1; 
net.READY_STATE_LOADED=2; 
net.READY_STATE_INTERACTIVE=3; 
net.READY_STATE_COMPLETE=4; 
var xhr = null;

net.CargadorContenidos = function(url, funcion, metodo, parametros, contentType){
this.url = url;
this.onload = funcion;
this.req = null;
this.onerror =  this.defaultError;
this.cargaContenidoXML(metodo, url, parametros, contentType);
}

net.CargadorContenidos.prototype = {
	cargaContenidoXML : function(metodo, url, parametros, contentType){
		if(xhr == null){
			if(window.XMLHttpRequest){
				xhr = new XMLHttpRequest();
				this.req = xhr;
			}else if (window.ActiveXObject){
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
				this.req = xhr;
			}
		}else{
			this.req = xhr;
		}
		if(this.req){
			try{
				var loader = this;
				this.req.onreadystatechange = function(){
					loader.onReadyState.call(loader);
				}
				this.req.open(metodo, url, true);
				if(contentType){
					this.req.setRequestHeader("Content-Type", contentType);
				}
				this.req.send(parametros);
			}catch(err){
				this.onerror.call(this);
			}
		}
	},

	onReadyState : function(){
		var req = this.req;
		var ready = req.readyState;
		if(ready == net.READY_STATE_COMPLETE){
			var httpStatus = req.status;
			if(httpStatus==200 || httpStatus==0){
				this.onload.call(this);
			}else{
				this.onerror.call(this);
			}
		}
	},

	defaultError : function(){
		alert("Se ha producido un error al obtener los datos"
     	+ "\n\nreadyState:" + this.req.readyState
     	+ "\nstatus: " + this.req.status
     	+ "\nheaders: " + this.req.getAllResponseHeaders())
	}
}

