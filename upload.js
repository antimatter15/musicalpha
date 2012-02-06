
var fileQueue = [], addQueue = [];

function addFiles(files){
	revealQueue();
	if(addQueue.length == 0){
		setTimeout(processAddQueue, 1000)
	}
	for(var i = 0; i < files.length; i++){
		addQueue.push(files[i])
	};
}

function makeObjectURL(f){
	var url;
	if(window.createObjectURL){
		url = window.createObjectURL(f)
	}else if(window.createBlobURL){
		url = window.createBlobURL(f)
	}else if(window.URL && window.URL.createObjectURL){
		url = window.URL.createObjectURL(f)
	}else if(window.webkitURL && window.webkitURL.createObjectURL){
		url = window.webkitURL.createObjectURL(f)
	}
	return url;
}

function measureDuration(file, callback){
	var url = makeObjectURL(file);
	var audio = new Audio(url);
	audio.addEventListener('loadedmetadata', function(){
		var durationMilliseconds = Math.floor(audio.duration * 1000);
		callback(durationMilliseconds);
	}, false)
}

function processAddQueue(){
	var file = addQueue.shift();
	if(file.name == "."){
		return processAddQueue();
	}
	ID3v2.parseFile2(file, function(meta){
		measureDuration(file, function(e){
			meta.durationMilliseconds = e;
			file.meta = meta;
			meta.html = addToList(meta);

			if(!fileQueue.length)
				setTimeout(processUploadQueue, 1000);
			fileQueue.push(file);
			if(addQueue.length)
				setTimeout(processAddQueue, 100);
		})
	})
}


function processUploadQueue(){
	var file = fileQueue.shift();
	var meta = file.meta;
	meta.html.className = 'current';

}

function UploadAuth(){
	var uauth = new SkyJam.UploadAuth();
	uauth.hostname = "musicalpha";
	uauth.address = ""
}

var SID = '';
function checkLogin(){
	chrome.cookies.get({
		url: 'http://music.google.com/music',
		name:'SID'
	}, function(info){
		if(!info){
			document.getElementById('login').style.display = ''
			document.getElementById('uploader').style.display = 'none'
			document.addEventListener("webkitvisibilitychange", checkLogin, false);
		}else{
			document.getElementById('uploader').style.display = ''
			document.getElementById('login').style.display = 'none'
			SID = info.value
		}
	})
}

checkLogin();