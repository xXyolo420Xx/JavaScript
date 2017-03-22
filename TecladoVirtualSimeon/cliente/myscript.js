var url = "http://localhost/TecladoVirtual/servidor/TecladoVirtual.php";
var metodo = 'POST';
var contentType = "application/x-www-form-urlencoded";
var list = document.getElementById('idiomas');
var todasTeclas = Array();
var contenido = document.getElementById('contenido');
var teclasPulsadas = Array();
for(var i=0;i<47;i++){
	var tecla = document.getElementById('tecla_'+i);
	todasTeclas.push(tecla)
}
//(url, funcion, metodo, parametros, contentType)

window.onload = start;
function start(){
	parametros = 'accion='+encodeURIComponent('listaIdiomas');
	var cargaStart = new net.CargadorContenidos(url, startLoad, metodo, parametros, contentType);
}

function startLoad(){
	var jsona = this.req.responseText;
	var json = eval('('+jsona+')');
	list.removeChild(list.firstChild);
	for(lang in json.idiomas){
		var opt = document.createElement('option');
		opt.id = lang;
		var txt = document.createTextNode(json.idiomas[lang]);
		opt.appendChild(txt);
		list.appendChild(opt);
	}
	startKeyboard();
}

function startKeyboard(){
	var parametros = "accion="+encodeURIComponent('cargaTeclado')+"&idioma="+encodeURIComponent('es');
	var startKeyboard = new net.CargadorContenidos(url, function(){
	var json = getJson(this.req.responseText);
	setKeys(json, 'normal');
}, metodo, parametros, contentType);
}


function getJson(responseText){
	var json = eval('('+responseText+')');
	return json;
}

function setKeys(json, tipo){
	switch(tipo){
		case 'normal':
		for(var i=0;i<todasTeclas.length;i++){
			if(json.normal[i] != undefined){
				todasTeclas[i].innerHTML = json.normal[i];
				todasTeclas[i].addEventListener("click",clickTecla,false);
			}else{
				todasTeclas[i].innerHTML = "";
			}
		}
		break;
		case 'caps':
		for(var i=0;i<todasTeclas.length;i++){
			if(json.caps[i] != undefined){
				todasTeclas[i].innerHTML = json.caps[i];
			}else{
				todasTeclas[i].innerHTML = "";
			}
		}
		break;
		case 'shift':
		for(var i=0;i<todasTeclas.length;i++){
			if(json.shift[i] != undefined){
				todasTeclas[i].innerHTML = json.shift[i];
			}else{
				todasTeclas[i].innerHTML = "";
			}
		}
		break;
		case 'altgr':
		for(var i=0;i<todasTeclas.length;i++){
			if(json.altgr[i] != undefined){
				todasTeclas[i].innerHTML = json.altgr[i];
			}else{
				todasTeclas[i].innerHTML = "";
			}
		}
	}
}