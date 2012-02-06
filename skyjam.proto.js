if (typeof(SkyJam)=="undefined") {SkyJam = {};}

SkyJam.Track = PROTO.Message("SkyJam.Track",{
	clientId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 2
	},
	creation: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 3
	},
	lastPlayed: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 4
	},
	title: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 6
	},
	artist: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 7
	},
	composer: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 8
	},
	album: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 9
	},
	albumArtist: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 10
	},
	year: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 11
	},
	comment: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 12
	},
	track: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 13
	},
	genre: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 14
	},
	durationMilliseconds: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 15
	},
	beatsPerMinute: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 16
	},
	playCount: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 20
	},
	totalTracks: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 26
	},
	disc: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 27
	},
	totalDiscs: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 28
	},
	u11: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 31
	},
	fileSize: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 32
	},
	u13: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 37
	},
	u14: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 38
	},
	bitrate: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 44
	},
	u15: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 53
	},
	u16: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 61
	}});
SkyJam.MetadataRequest = PROTO.Message("SkyJam.MetadataRequest",{
	tracks: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return SkyJam.Track;},
		id: 1
	},
	address: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 2
	}});
SkyJam.QueuedUpload = PROTO.Message("SkyJam.QueuedUpload",{
	clientIds: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 1
	},
	u0: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 2
	},
	serverId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 3
	}});
SkyJam.Status = PROTO.Message("SkyJam.Status",{
	u0: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 1
	},
	u1: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 2
	},
	u2: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 3
	},
	u3: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 4
	},
	u4: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 5
	},
	u5: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 6
	}});
SkyJam.TrackResponse = PROTO.Message("SkyJam.TrackResponse",{
	clientIds: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.string;},
		id: 2
	},
	uploads: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return SkyJam.QueuedUpload;},
		id: 3
	}});
SkyJam.MetadataResponse = PROTO.Message("SkyJam.MetadataResponse",{
	u0: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 1
	},
	response: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return SkyJam.TrackResponse;},
		id: 2
	},
	state: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return SkyJam.Status;},
		id: 6
	}});
SkyJam.UploadAuth = PROTO.Message("SkyJam.UploadAuth",{
	address: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 1
	},
	hostname: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 2
	}});
SkyJam.Quota = PROTO.Message("SkyJam.Quota",{
	maximumTracks: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 1
	},
	totalTracks: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 2
	},
	availableTracks: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 3
	}});
SkyJam.ClientState = PROTO.Message("SkyJam.ClientState",{
	address: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 1
	}});
SkyJam.ClientStateResponse = PROTO.Message("SkyJam.ClientStateResponse",{
	u0: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 1
	},
	status: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return SkyJam.Status;},
		id: 6
	},
	quota: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return SkyJam.Quota;},
		id: 8
	}});
SkyJam.UploadAuthResponse = PROTO.Message("SkyJam.UploadAuthResponse",{
	u0: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 1
	},
	status: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return SkyJam.Status;},
		id: 6
	},
	u1: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 11
	},
	u2: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.int32;},
		id: 12
	}});
