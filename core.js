/*
	Be warned, it's pretty hacky and doesn't really separate functionality from UI
*/

function getXt(cb){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://music.google.com/music/listen?u=0", true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 0){
			alert("Please login to your Google Music Account before using MusicAlpha");
			chrome.tabs.create({
				url: 'https://www.google.com/accounts/ServiceLogin?service=sj&passive=1209600&continue=http://music.google.com/music/listen?u%3D0&followup=http://music.google.com/music/listen?u%3D0'
			});
			location.reload();
		}
	}
	xhr.onload = function(){
		chrome.cookies.get({
			url: 'http://music.google.com/music', 
			name: 'xt'
		}, function(info){
			cb(info.value);
		})
	}
	xhr.send(null);
}


function uploadCover(xt, tags, cb){
	if(tags.pictures.length == 0) return; //I used to want you dead/but/now I ONLY WANT YOU GONE
	//if the cb is never called, then there is just the blank default value
	console.log('Found Album Art!');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://music.google.com/music/services/imageupload?u=0&xt="+xt+'&zx='+Math.random().toString(36).substr(2), true);
	var fd = new FormData();
	fd.append("json", '{}');
	fd.append("albumArt", tags.pictures[0].blob);

	xhr.onload = function(){
		var json = JSON.parse(xhr.responseText);
		cb(json.imageUrl);
	}
	xhr.send(fd);
}


function modifyEntries(xt, json, cb){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://music.google.com/music/services/modifyentries?u=0&xt="+xt, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function(){
		var json = JSON.parse(xhr.responseText);
		console.log(json);
		cb();
		console.assert(json.success == true);
	}
	xhr.send('json='+encodeURIComponent(JSON.stringify({
		entries: [
			json
		]
	})))
}

function measureDuration(f, cb){
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
	var a = new Audio(url);
	a.addEventListener('loadedmetadata', function(){
		console.log("Measured Duration", a.duration);
		cb(Math.floor(a.duration * 1000)); //milliseconds because well, thats what google uses
	}, false);
}
function startUpload(file, cb){
	console.log(file);
	document.getElementById('upload').style.display = ''
	var stage = 0, stages = 5;
	measureDuration(file, function(millis){
		document.getElementById('upload').value = 0.03;
		ID3v2.parseFile(file, function(tags){
			console.log('Got ID3 Tags', tags);
			document.getElementById('upload').value = 0.06;
			getXt(function(xt){
				document.getElementById('upload').value = 0.09;
				//there's a reasonable expectation that uploadFile will take eons more than uploadCover
				//so a race condition is virtually impossible. But future readers of this code, may
				//want to proof this from a purely theoretical risk.
				var albumArtUrl = '';
				uploadCover(xt, tags, function(url){
					albumArtUrl = url;
				});
				uploadFile(file, function(file_id){
					var startTime = +new Date, delta = 1000, end = startTime + delta + 500;
					var ended = false;
					(function(){
						if(+new Date < end && !ended){
							document.getElementById('upload').value = 0.90 + 0.1 * (+new Date - startTime)/delta;
							setTimeout(arguments.callee, 100)
						}
					})();
					setTimeout(function(){

						var tracks = "", tracktotal = "";
						
						tags.Title = tags.Title || file.name; 
						
						if(tags['Track number']){
							if(tags['Track number'].split('/').length == 2){
								tracks = tags['Track number'].split('/')[0]
								tracktotal = tags['Track number'].split('/')[1]
							}else if(/^\d+$/.test(tags['Track number'])){
								tracks = tags['Track number']
							}
						}
						
						var metadata = {
							"genre": tags.Genre|| '',
							"beatsPerMinute":tags.BPM || 0,
							"albumArtistNorm":"",
							"album": tags.Album|| '',
							"artistNorm":"",
							"lastPlayed": (+new Date)*1000,
							"durationMillis": millis,
							"url":"",
							"id": file_id,
							"composer":tags.Composer || "",
							"creationDate": (+new Date)*1000,
							"title":tags.Title|| '',
							"albumArtist":tags.Artist|| '',
							"playCount":tags["Play counter"] || 0,
							"name":tags.Title|| '',
							"artist":tags.Artist|| '',
							"titleNorm":"",
							"rating":0,
							"comment":tags.Comments,
							"albumNorm":"",
							"year":tags.Year || '',
							"track":tracks,
							"totalTracks":tracktotal,
							"disc":"",
							"totalDiscs":""
						};
						
						if(albumArtUrl) metadata.albumArtUrl = albumArtUrl;
						
						modifyEntries(xt, metadata, function(){
							ended = true;
							document.getElementById('upload').value = 0;
							document.getElementById('upload').style.display = 'none';
							cb();
						});
					}, delta); //wait a second for google to do magic
				})
			});
		})
	});
}

function uploadFile(file, cb){
	var file_id = 'antimatter15-'+Math.random().toString(16).substr(2)+'-'+Math.random().toString(16).substr(2);
	//this file_id is primarily to indulge my narcissism. I guess.
	console.log('Created file ID', file_id);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://uploadsj.clients.google.com/uploadsj/rupio', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
	xhr.onload = function(){
		var json = JSON.parse(xhr.responseText);
		var transfer = json.sessionStatus.externalFieldTransfers[0];
		var url = transfer.putInfo.url;
		xhr.open('PUT', url, true);
		xhr.onload = function(){ //a callback within a callback! callbackception!
			console.log("Yay Done Uploading");
			var json = JSON.parse(xhr.responseText);
			console.assert(json.sessionStatus.state == "FINALIZED");
			cb(file_id, json);
		}
		xhr.upload.addEventListener('progress', function(evt){
			document.getElementById('upload').value = (evt.loaded/evt.total) * 0.8 + 0.1;
		}, false)
		
		xhr.setRequestHeader('Content-Type', transfer.content_type);
		xhr.send(file);
	}
	xhr.send(JSON.stringify({
		//"clientId": "Jumper Uploader",
		"createSessionRequest": {
			"fields": [
			/*
				{
					"inlined": {
						"content": "jumper-uploader-title-18468",
						"contentType": "text/plain",
						"name": "title"
					}
				},
				*/
				{
					"external": {
						"filename": file.fileName,
						"name": file.fileName,
						"put": {},
						"size": file.fileSize
					}
				},
				/*
				{
					"inlined": {
						"content": "0",
						"name": "AlbumArtLength"
					}
				},
				{
					"inlined": {
						"content": "0",
						"name": "AlbumArtStart"
					}
				},
				{
					"inlined": {
						"content": Math.random().toString(16).substr(2),
						"name": "ClientId"
					}
				},
				{
					"inlined": {
						"content": "00:11:22:33:44:55",
						"name": "MachineIdentifier"
					}
				},*/
				{
					"inlined": {
						"content": file_id,
						"name": "ServerId"
					}
				},{
					"inlined": {
						"content": "153", //It won't play without TrackBitRate. Though this is probably not quite the right number.
						"name": "TrackBitRate"
					}
				}/*,
				{
					"inlined": {
						"content": "true",
						"name": "SyncNow"
					}
				},
				
				{
					"inlined": {
						"content": "false",
						"name": "TrackDoNotRematch"
					}
				}*/
			]
		},
		"protocolVersion": "0.8"
	}))
}
