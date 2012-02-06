
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
var polar_state = 0;

function renderPolar(){
	var p1 = polar_p1.get();
	var p2 = polar_p2.get();

	var ctx = document.getElementById("polar").getContext('2d')
	ctx.clearRect(0, 0, 300, 300);
	ctx.beginPath()
	ctx.arc(150, 150, 120, Math.PI * (-.5), Math.PI * (-.5 + 2 * p1) , false);
	ctx.strokeStyle = "#aaa"
	ctx.lineWidth = 15;
	ctx.stroke()

	ctx.beginPath()
	//invert polar state every revolution!
	if(!polar_state && p2 == 0){
		ctx.arc(150, 150, 80, 0, Math.PI * 2, true);
	}else{
		ctx.arc(150, 150, 80, Math.PI * (-.5), Math.PI * (-.5 - 2 * p2) , !!polar_state);
	}
	ctx.strokeStyle = "#ccc"
	ctx.lineWidth = 15;
	ctx.stroke()

	ctx.font = '14pt Syncopate';


	//adding text makes a bit too much noise for my taste

	//ctx.fillText((p2*100).toFixed(0) + '%', 150 - 10, 150 - 90 + 7)
	//ctx.fillText('%', 150 - 10, 150)

	//ctx.fillText((p1*100).toFixed(0) + '%', 150 - 10, 150 - 130 + 7)
	//ctx.fillText('%', 150 - 10, 150)
	//ctx.fillText((p2*100).toFixed(1), 150, 150)
	//ctx.fillText(polar_p2.diff().toFixed(2)+'?', 150, 150)

	//if(current_p1 != polar_p1 || current_p2 != polar_p2){
	if(!(polar_p1.diff() < 1e-5 && polar_p2.diff() < 1e-5)){
		requestAnimFrame(renderPolar);
	}
	//}
}



function Interpolator(degree){
	var inter = [];
	
	function interpolate(a,b) {
		return a + (b-a) * 0.04;
	}
	var fn = {
		set: function(n){
			inter[0] = n;
		},
		diff: function(){
			return Math.abs(inter[0] - inter[degree])
		},
		inter: function(){
			return inter
		},
		reset: function(){
			for(var i = 0; i < degree + 1; i++){
				inter[i] = 0;
			}
		},
		get: function(){
			for(var i = 0; i < degree; i++){
				inter[i+1] = interpolate(inter[i+1], inter[i])
			}
			return inter[degree]
		}
	};
	fn.reset();
	return fn;
}

var polar_p1 = new Interpolator(2);
var polar_p2 = new Interpolator(2)

function updatePolar(p1, p2){
	if(polar_p1.diff() < 1e-5 && polar_p2.diff() < 1e-5){
		requestAnimFrame(renderPolar);
	}

	polar_p1.set(p1);
	polar_p2.set(p2);
}


function revealQueue(){
	if(document.getElementById("logo").className != 'fade'){
		document.getElementById("logo").className = 'fade';
		document.getElementById("queue").style.display = '';
		updatePolar(0.0001,0.0001);
	}
	/*
	var n = 0;
	updatePolar(0.0001,0.0001);
	function blah(){
		var onm = n % 1;
		n += Math.random() / 10;
		var nmn = n % 1;
		if(nmn < onm){
			//reset
			
			
			updatePolar(n/20, 1);
			setTimeout(function(){
				polar_state = !polar_state;
				polar_p2.reset()
				blah()
			}, 2000);
		}else{
			
			updatePolar( n/ 20, nmn)
			setTimeout(blah, Math.random() * 1000)
		}
		
	}*/
	//blah()
}


document.addEventListener("dragenter", function(e){e.preventDefault();e.stopPropagation()}, false);
document.addEventListener("dragexit", function(e){e.preventDefault();e.stopPropagation()}, false);
document.addEventListener("dragover", function(e){e.preventDefault();e.stopPropagation()}, false);
document.addEventListener("drop", function(e){
	e.preventDefault();
	e.stopPropagation();
	var files = e.dataTransfer.files;
	if(files.length > 0) addFiles(files);
}, false);

document.getElementById("upload").onchange = function(){
	var files = document.getElementById("upload").files;
	if(files.length) addFiles(files);
	document.getElementById("upload").webkitdirectory = false;

}

//document.getElementById('folders').onclick = function(){
//	document.getElementById("upload").webkitdirectory = true;
//	document.getElementById("upload").focus()
//}

function addToList(meta){
	var li = document.createElement('li');
	document.getElementById('list').appendChild(li);
	li.innerText = meta.Title;
	return li;
}

var carousel_direction = 0;
setInterval(function(){
	var n = 0;
	carousel_direction = !carousel_direction;
	function animate(){
		if(n < 1){
			n += 0.02;
			var v = carousel_direction ? n : (1 - n);
			document.getElementById('carousel').scrollLeft = 220 * v;
			setTimeout(animate, 10)	
		}
	}
	animate();
}, 1000 * 10)

onkeydown = function(e){
	if(e.keyCode == 16){
		document.getElementById("upload").webkitdirectory = true;
		//document.getElementById('folders').style.display = '';
		//document.getElementById('upload').style.display = 'none'
	}
}

onkeyup = function(e){
	if(e.keyCode == 16){
		document.getElementById("upload").webkitdirectory = false;
		//document.getElementById('folders').style.display = '';
		//document.getElementById('upload').style.display = 'none'
	}
}