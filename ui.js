var polar_state = 0;
function updatePolar(p1, p2){
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

	ctx.font = '14pt Syncopate'
	//adding text makes a bit too much noise for my taste

	//ctx.fillText((p2*100).toFixed(0) + '%', 150 - 10, 150 - 90 + 7)
	//ctx.fillText('%', 150 - 10, 150)

	//ctx.fillText((p1*100).toFixed(0) + '%', 150 - 10, 150 - 130 + 7)
	//ctx.fillText('%', 150 - 10, 150)
	//ctx.fillText((p2*100).toFixed(1), 150, 150)
	//ctx.fillText('%', 150, 150)
}


function revealQueue(){
	document.getElementById("logo").className = 'fade';
	document.getElementById("queue").style.display = '';
	var n = 0;setInterval(function(){updatePolar(n / 20, n % 1);n+= 0.01}, 100)
}