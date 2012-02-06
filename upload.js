
var fileQueue = [], addQueue = [];
var totalTracks = 0, uploadedTracks = 0;

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

			fileQueue.push(file);
			totalTracks++;

			if(addQueue.length){
				setTimeout(processAddQueue, 100);
			}else{
				setTimeout(processUploadQueue, 100);
			}
		})
	})
}


function processUploadQueue(){
	var file = fileQueue.shift();
	if(!file) return;
	var meta = file.meta;
	meta.html.className = 'current';
	if(meta.html.scrollIntoViewIfNeeded){
		meta.html.scrollIntoViewIfNeeded()
	}
	Metadata(file);
}
function finalizeUpload(file){
	updateProgress(1);
	
	setTimeout(function(){
		polar_state = !polar_state;
		uploadedTracks++;
		polar_p2.reset();
		renderPolar();
		file.meta.html.className = 'finished';
		processUploadQueue()
	}, 1000);
}

function updateProgress(current){
	updatePolar((current + uploadedTracks) / totalTracks, current)
}

function protopost(path, proto, resp, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://music-alpha.appspot.com/'+path);
	xhr.responseType = 'arraybuffer'
	xhr.setRequestHeader('X-Cookie', 'SID='+SID);
	//console.log(proto.SerializeToArray())
	var array = new Uint8Array(proto.SerializeToArray());
	xhr.send(array.buffer);
	xhr.onload = function(){
		//console.log(xhr.response)
		var array = new Uint8Array(xhr.response);
		//console.log(array);
		resp.ParseFromArray([].slice.call(array,0));
		callback(resp);
	}
}

function UploadAuth(callback){
	var uauth = new SkyJam.UploadAuth();
	uauth.hostname = "musicalpha";
	uauth.address = MAC;
	protopost('upauth', uauth, new SkyJam.UploadAuthResponse(), function(e){
		//console.log(e);
		callback();
	})
}

function ClientState(callback){
	var cstate = new SkyJam.ClientState();
	cstate.address = MAC;
	protopost('clientstate', cstate, new SkyJam.ClientStateResponse(), function(e){
		var quota = e.quota;
		console.log(quota.totalTracks, quota.maximumTracks);
		callback(quota)
	})
}

function Metadata(file){
	var metadata = new SkyJam.MetadataRequest();
	metadata.address = MAC;
	var track = metadata.tracks.push();
	var id = Math.random().toString(36).slice(2);
	track.clientId = id;
	var meta = file.meta;
	track.fileSize = file.fileSize;
	track.bitrate = 192; //TODO: actually know this
	track.durationMilliseconds = meta.durationMilliseconds;
	track.album = meta.Album;
	track.artist = meta.Artist;
	track.genre = meta.Genre;
	track.year = parseInt(meta.Year);
	track.title = meta.Title;
	/*
	track.track 
	track.totalTracks
	track.discnumber
	track.totalDiscs
	*/
	protopost('metadata?version=1', metadata, new SkyJam.MetadataResponse(), function(e){
		var uploads = e.response.uploads;
		updateProgress(0.05);
		//WARNING: this runs under the assumption that this loop only has one element
		//sure it's useless, but whatever, mabye it'll get better one day
		for(var i = 0; i < uploads.length; i++){
			var upload = uploads[i];
			file.meta.clientId = upload.clientId;
			file.meta.serverId = upload.serverId;
		}

		BeginUpload(file);
		//console.log(e)

	})
}


function BeginUpload(file){
	var meta = file.meta;
	var inlined = {
		"title": "jumper-uploader-title-42",
		"ClientId": meta.clientId,
		"ClientTotalSongCount": "1",
		"CurrentTotalUploadedCount": "0",
		"CurrentUploadingTrack": meta.Title,
		"ServerId": meta.serverId,
		"SyncNow": "true",
		"TrackBitRate": "192",
		"TrackDoNotRematch": "false",
		"UploaderId": MAC
	};
	var payload = {
	  "clientId": "Jumper Uploader",
	  "createSessionRequest": {
	    "fields": [
			{
				"external": {
		          "filename": file.fileName,
		          "name": file.webkitRelativePath,
		          "put": {},
		          "size": file.size
		        }
			}
	    ]
	  },
	  "protocolVersion": "0.8"
	};
	for(var key in inlined){
		payload.createSessionRequest.fields.push({inlined: {
			content: inlined[key],
			name: key
		}})
	}
	var attempts = 0;
	function tryUpload(){
		attempts++;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://uploadsj.clients.google.com/uploadsj/rupio', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(JSON.stringify(payload));
		xhr.onload = function(){
			var json = JSON.parse(xhr.responseText);
			if(json.errorMessage){
				setTimeout(tryUpload, 500)
				updateProgress(Math.min(1, attempts/7) * 0.10 + 0.05)
			}else{
				var upload = json.sessionStatus.externalFieldTransfers[0];
				updateProgress(0.25);
				UploadFile(file, upload);
			}
		}
	}
	tryUpload();
}

//6679,7588,6668,6595,7364,6201,6600,5646,7805,8799,6142

function UploadFile(file, params){
	var xhr = new XMLHttpRequest();
	xhr.open('PUT', params.putInfo.url, true);
	xhr.setRequestHeader('Content-Type', params.content_type);
	xhr.upload.addEventListener('progress', function(evt){
		var up = (evt.loaded/evt.total);
		updateProgress(0.15 + up * 0.60);
	}, false);
	var uploaded = 0;
	xhr.upload.addEventListener('load', function(evt){
		var n = 0.01, c = 0;
		uploaded = +new Date;
		function update(){
			c += (n+=0.02);
			if(xhr.readyState != 4 && c < 1){
				updateProgress(0.75 + 0.24 * c);
				setTimeout(update, 800)
			}
		}
		update();
	}, false);	
	xhr.onload = function(){
		updateProgress(1);
		//console.log(new Date - uploaded)
		var json = JSON.parse(xhr.responseText);
		finalizeUpload(file);
	}
	xhr.send(file)
}


var SID = '';
//if(!localStorage.uuid) localStorage.uuid = "musicalpha-"+Math.random();

var MAC = '13:32:42:'+SHA1("musicalpha").replace(/(..)/g,'$1:').slice(0, 8); //pseudo-MAC;


function checkLogin(){
	if(SID) return;
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
			SID = info.value;
			UploadAuth(function(){
				ClientState(function(quota){
					updatePolar((quota.totalTracks + quota.availableTracks) / quota.maximumTracks, 1)
				})
			})
		}
	})
}

checkLogin();