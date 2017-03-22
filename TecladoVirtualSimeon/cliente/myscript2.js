list.addEventListener("change", changeLang, false);
document.addEventListener("keydown", keypressed, false);
document.addEventListener("keyup", keythrow, false);
var space = document.getElementById('tecla_especial_espaciadora');
space.addEventListener("click",clickTecla,false);
var enter = document.getElementById('tecla_especial_enter');
enter.addEventListener("click", clickTecla, false);
var del = document.getElementById('tecla_especial_borrado');
del.addEventListener("click", clickTecla,false);
var tab = document.getElementById('tecla_especial_tabulador');
tab.addEventListener("click", clickTecla, false);
var lshift = document.getElementById('tecla_especial_shift_izquierdo');
var rshift = document.getElementById('tecla_especial_shift_derecho');
lshift.addEventListener("click", clickTecla, false);
rshift.addEventListener("click", clickTecla, false);
var bloqmayus = document.getElementById('tecla_especial_mayusculas');
bloqmayus.addEventListener("click",clickTecla,false);
var altgr = document.getElementById('tecla_especial_altgr');
altgr.addEventListener("click",clickTecla,false);
var saveDiv = document.getElementById('contenidoGuardado');
var specKeys = {caps : false, shiftwaspressed : false, altgrpressed : false}
//(url, funcion, metodo, parametros, contentType)
function changeLang(tipo){
	if(tipo != 'caps' && tipo != 'shift' && tipo != 'altgr'){
		tipo = 'normal';
	}
	var lang = list.options[list.selectedIndex].id;
	var parametros = 'accion='+encodeURIComponent('cargaTeclado')+"&idioma="+encodeURIComponent(lang);
	var cargaChange = new net.CargadorContenidos(url, function(){
		var json = getJson(this.req.responseText);
		setKeys(json, tipo);
	}, metodo, parametros, contentType);
}

function keypressed(e){
	switch(e.keyCode){
		case 20:
			if(!specKeys.caps){
				specKeys.caps = true;
				changeLang('caps');
			}else{
				specKeys.caps = false;
				changeLang('normal');
			}
		break;
		case 16:
			changeLang('shift');
		break;
		case 18:
		changeLang('altgr');
	}
}
function keythrow(e){
	switch(e.keyCode){
		case 16:
			if(specKeys.caps){
				changeLang('caps');
			}else{
				changeLang();
			}
		break;
		case 18:
			if(specKeys.caps){
				changeLang('caps');
			}else{
				changeLang();
			}
	}
}

function clickTecla(){
	if(this == enter){
		var puls = "\n";
	}else if(this == space){
		var puls = " ";
	}else if(this == del){
		teclasPulsadas.pop();
	}else if(this == tab){
		var puls = "\t"
	}else if(this == rshift || this == lshift){
		specKeys.shiftwaspressed = true;
		if(!specKeys.caps){
			specKeys.caps = true;
			changeLang('caps');
		}else{
			specKeys.caps = false;
			changeLang('normal');
		}
	}else if(this == bloqmayus){
		specKeys.shiftwaspressed = false;
		if(!specKeys.caps){
			specKeys.caps = true;
			changeLang('caps');
		}else{
			specKeys.caps = false;
			changeLang('normal');
		}
	}else if(this == altgr){
		specKeys.altgrpressed = true;
		changeLang('altgr');
	}else{
		if(specKeys.shiftwaspressed){
			specKeys.shiftwaspressed = false;		
			if(specKeys.caps){
				specKeys.caps = false;
				changeLang('normal');
			}else if(!specKeys.caps){
				specKeys.caps = true;
				changeLang('caps');
			}
		}else if(specKeys.altgrpressed){
			specKeys.altgrpressed = false;
			if(specKeys.caps){
				changeLang('caps');
			}else if(!specKeys.caps){
				changeLang('normal');
			}
		}
		var puls = this.innerHTML;
	}
	if(puls){
		teclasPulsadas.push(puls);
	}
	showContent.call(this);
}
function showContent(){
	if(contenido.firstChild){
	contenido.removeChild(contenido.firstChild);
	}
	var strink = "";
	for(var i=0;i<teclasPulsadas.length;i++){
		if (teclasPulsadas[i] == "\n"){
			var char = "<br>";
		}else if(teclasPulsadas[i] == " "){
		var char = "&nbsp;";
		strink +=char;
		}else if(teclasPulsadas[i] == "\t"){
			var char = "&nbsp;&nbsp;&nbsp;&nbsp;";
		}else{
			var char = teclasPulsadas[i];
		}
		strink += char;
	}
	contenido.innerHTML = strink;
}
setInterval(function(){
	var parametros = "accion="+encodeURIComponent('guardar')+"&contenido="+encodeURIComponent(contenido.innerHTML);
	var cargaSave = new net.CargadorContenidos(url, function(){
		saveDiv.innerHTML = this.req.responseText;
	}, metodo, parametros, contentType);
}, 10000);