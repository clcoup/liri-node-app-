//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
//var client = new twitter(keys.twitterKeys);
var twitterKeys = require('./keys.js');
var client = new twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    console.log('case: my-tweets');
    showTweets();
    break;

  case "spotify-this-song":
    console.log('case: spotify-this-song');
    if(x){
      spotifySong(x);
    } else{
      spotifySong("Fluorescent Adolescent");
    }
    break;

  case "movie-this":
    console.log('case: movie-this');
    console.log('x', x);
    console.log('nodeArgv[3]', nodeArgv[3]);
//    if(x){
    if (nodeArgv[3]) {
      omdbData(nodeArgv[3])
    } else{
      omdbData("Mr. Nobody")
    }
    break;

  case "do-what-it-says":
    console.log('case: do-what-it-says');
    doThing();
    break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
    break;
}
  var twitterKeys = {
  consumer_key: '4EVAnqz8X8UYZAtBwZ3wiiiFj',
  consumer_secret: 'Jj68XufBnAKu0NNModrmeTzvrzvfB6bVorPUVSgihSlFEkCcju',
  access_token_key: '919673721484222464-osscqEREEhBkMMy8DpBI8CMxIpjbMYv',
  access_token_secret: 'nGCYaYiWKcnv6ASVvHJ2Z52XqqrvSZ17LY2BCgBbKAax4'
}
function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'clcoup_leslie'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(error)
      console.log(error);

    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@clcoup_leslie: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFile('log.txt', "@clcoup_leslie: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFile('log.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
  var spotify = new Spotify({
  id: '0d96df07629c44c4a204e0c8f76f3a66',
  secret: 'e7e14b478a444d9c9ce351e37e2cc89a'
});
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
//      console.log('spotifySong: data ', data);
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name);
        fs.appendFile('log.txt', songData.name);
        fs.appendFile('log.txt', songData.preview_url);
        fs.appendFile('log.txt', songData.album.name);
        fs.appendFile('log.txt', "-----------------------");
      }
      console.log(data);
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true&apikey=40e9cece';

  request(omdbURL, function (error, response, body){
//    console.log('body', body);
//    console.log('response', response);
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      

      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title);
      fs.appendFile('log.txt', "Release Year: " + body.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('log.txt', "Country: " + body.Country);
      fs.appendFile('log.txt', "Language: " + body.Language);
      fs.appendFile('log.txt', "Plot: " + body.Plot);
      fs.appendFile('log.txt', "Actors: " + body.Actors);
     
    } else{
      console.log('Error occurred.')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}