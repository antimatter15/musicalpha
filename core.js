function uploadFile(file){
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
		}
		xhr.upload.addEventListener('progress', function(evt){
  		document.getElementById('upload').value = evt.loaded/evt.total;
	  }, false)
		
		xhr.setRequestHeader('Content-Type', transfer.content_type);
		xhr.send(file);
	}
	xhr.send(JSON.stringify(
	/*
		{
			"clientId": "Jumper Uploader",
			"createSessionRequest": {
				"fields": [
					{
						"external": {
							"filename": file.fileName,
							"name": file.fileName,
							"put": {},
							"size": file.fileSize
						}
					},
			{
				"inlined": {
					"content": [0,0,0,0,0].map(function(){return Math.random().toString(16).substr(3);console.log('blah')}).join('-'),
					"name": "ServerId"
				}
			},
			{
				"inlined": {
					"content": "jumper-uploader-title-"+Math.floor(Math.random()*10000),
					"contentType": "text/plain",
					"name": "title"
				}
			},
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
					"content": "true",
					"name": "SyncNow"
				}
			},
			{
				"inlined": {
					"content": "false",
					"name": "TrackDoNotRematch"
				}
			}
			
				]
			},
			"protocolVersion": "0.8"
		}*/
		
		{
	"clientId": "Jumper Uploader",
	"createSessionRequest": {
		"fields": [
			{
				"inlined": {
					"content": "jumper-uploader-title-18468",
					"contentType": "text/plain",
					"name": "title"
				}
			},
			{
				"external": {
							"filename": file.fileName,
							"name": file.fileName,
							"put": {},
							"size": file.fileSize
				}
			},
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
					"content": "3m6oBqQe9iB9C%2BJDHuHmfA",
					"name": "ClientId"
				}
			},
			{
				"inlined": {
					"content": "00:1F:BC:00:21:E4",
					"name": "MachineIdentifier"
				}
			},
			{
				"inlined": {
					"content": "c79d5887-55da-380b-8244-"+Math.random().toString(16).substr(2),
					"name": "ServerId"
				}
			},
			{
				"inlined": {
					"content": "true",
					"name": "SyncNow"
				}
			},
			{
				"inlined": {
					"content": "153",
					"name": "TrackBitRate"
				}
			},
			{
				"inlined": {
					"content": "false",
					"name": "TrackDoNotRematch"
				}
			}
		]
	},
	"protocolVersion": "0.8"
}
	))
}
