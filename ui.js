
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
	ctx.arc(150, 150, 80, Math.PI * (-.5), Math.PI * (-.5 - 2 * p2) , !!polar_state);
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
	ctx.fillText(polar_p2.diff().toFixed(2)+'?', 150, 150)

	//if(current_p1 != polar_p1 || current_p2 != polar_p2){
	requestAnimFrame(renderPolar);
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
			return inter[0]	- inter[degree]
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
	//if(current_p1 == polar_p1 && current_p2 == polar_p2){
	//	requestAnimFrame(renderPolar);
	//}

	polar_p1.set(p1);
	polar_p2.set(p2);
}


function revealQueue(){
	document.getElementById("logo").className = 'fade';
	document.getElementById("queue").style.display = '';
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
			}, 1000);
		}else{
			
			updatePolar( n/ 20, nmn)
			setTimeout(blah, Math.random() * 1000)
		}
		
	}
	blah()
}