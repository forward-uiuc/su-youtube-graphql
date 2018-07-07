var Promise = require('promise');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.CALLBACK
);

function youtubeAPI(context, resolveName, id, args){

		let authorization = JSON.parse(context.headers.authorization)

	return new Promise((resolve,reject) =>{

		let unauthorized =  !authorization || !authorization.accessToken
							|| !authorization.refreshToken;
							
		
		if (unauthorized) {
			reject(new Error('Unauthorized Request'));
		}


		oauth2Client.setCredentials({
		  access_token: authorization.accessToken,
		  refresh_token: authorization.refreshToken
			//expiry_date: true
		});

		var youtube = google.youtube({
			version: 'v3',
			auth:oauth2Client
		});
	
		
		switch(resolveName){
			case 'search':
				youtube.search.list({
					part: 				'id,snippet',
					maxResults:			args['maxResults'] ? args['maxResults'] : 50,
					order:				args['order'] ? args['order'] : 'relevance',
					publishedAfter:		args['publishedAfter'] ? args['publishedAfter'] : '',
					publishedBefore:	args['publishedBefore'] ? args['publishedBefore'] : '',
					q: 					args['q'],
					type:				args['type'] ? args['type'] : 'video',
				  }, (error, data) => {
					if (error){
						console.log('ERROR!')
						console.log(error);
						reject(error);
					}else{
						resolve(data.items);
					}
				  });
				break;

			case 'playlist':
				youtube.playlists.list({
					part: 'contentDetails,id,player,snippet,status',
					id: id
				}, function (err, data) {
					if (err){
						console.log(err);
						reject(err);
					}else{
						//console.log(data.items);
						resolve(data.items);
					}
				});
				break;
				
			case 'channel':
				youtube.channels.list({
					part: 'invideoPromotion,brandingSettings,contentDetails,contentOwnerDetails,id,snippet,statistics,status,topicDetails',
					id: id
				}, function (err, data) {
					if (err){
						console.log(err);
						reject(err);
					}else{
						//console.log(data.items);
						resolve(data.items);
					}
				});
				break;
				
			case 'video':
				youtube.videos.list({
					part: `contentDetails,id,liveStreamingDetails,player,
					recordingDetails,snippet,statistics,status,topicDetails`,
					id: id
				}, function (err, data) {
					if (err){
						console.log(err);
						reject(err);
					}else{
						//console.log(data.items);
						resolve(data.items);
					}
				});
				break;
				
			case 'videoCommentthread':
				//console.log(args);
				youtube.commentThreads.list({
					part:'id,snippet',
					videoId: id,
					maxResults: args['maxResults'],
					searchTerms:args['searchTerms']
				}, function(err,data){
				if (err){
						console.log(err);
						reject(err);
					}else{
						//console.log(data.items);
						resolve(data.items);
					}
				});
				break;
				
			case 'channelCommentthread':
				console.log(args);
				youtube.commentThreads.list({
					part:'id,snippet',
					channelId: id,
					maxResults: args['maxResults'],
					searchTerms:args['searchTerms']
				}, function(err,data){
				if (err){
						console.log(err);
						reject(err);
					}else{
						console.log(data.items);
						resolve(data.items);
					}
				});
				break;
		}
	})
}

module.exports = youtubeAPI;
