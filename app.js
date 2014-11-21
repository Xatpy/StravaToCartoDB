/*
** CONFIG USER
*/
var user = '{Your_CDB_user}'; //CDB
var CDB_api_key = '{Your_CDB_api_key}'; //CDB
var access_token = '{Your_Strava_access_token}'; //Strava


/*
**  'Global' variables
*/
var activities = [];


/*
** FUNCTIONS
*/
function main(){
  console.log('main');
  //getStravaDataActivity();
  //getStravaActivities();
  //checkCartoDBTables();
}

//TODO: Cartodibify tables 
function checkCartoDBTables(){

    query = 'SELECT * FROM strava';

    var url = "http://" + user + ".cartodb.com/api/v2/sql?q=";
    url += query;
    url += "&api_key=" + CDB_api_key;

    var createTable = false;
    
    $.getJSON( url, function (data) {
      console.log('query');
      console.log(data);
    })
    .error(function(data){
      var errorMsg = data.responseText;

      //check if the error contains ¡does not exist' 
      var tableExist = (errorMsg.indexOf('does not exist') > 1)

      //if we are here and tableExist is false, we have other type of error;
      //..........
    })
}

/*
Insert data to CartoDB
*/
function insertToCartoDB(steps){
  if (steps.length > 0) {

    var table = 'strava_2';

    var query = "INSERT INTO " + table + "(the_geom, time) VALUES ";
    var length = steps.length;
    var lat,long;
    for (var i = 0; i < length; ++i) {
      lat = steps[i][0];
      long = steps[i][1];
      query += "(ST_GeomFromText('POINT(" + long + " " + lat + ")',4326)," + steps[i][2] + ")";
      if (i != length -1) {
        query += ",";
      }
    }
    query += ";";

    var url = "http://" + user + ".cartodb.com/api/v2/sql?q=" + query + "&api_key=" + CDB_api_key;

    var url_post = "https://" + user + ".cartodb.com/api/v2/sql";

    $.post( url_post, {type: 'post', datatype: 'json', q: query, crossDomain: true, api_key:CDB_api_key} )
      .done(function (data) {
        console.log('abc');
      })
      .error(function(){
        console.log('error!!!!!');
      });
  } else {
    console.log('Steps is empty!');
  }
}

/*
  Fill the activities list with the data
*/
function fillListActivities(data) {
  if (data.length) {
    for (var i = 0; i < data.length; ++i) {
      var act = {};
      
      act.id = data[i].id;
      act.name = data[i].name;
      act.date = data[i].start_date;
      act.type = data[i].type;

      activities[i] = act;
    }
  }
}

/*
  Get all Strava activities - API CALL
*/
function getStravaActivities() {

  var url = "https://www.strava.com/api/v3/activities?access_token=";
  url += access_token + "&callback=?";

  $.getJSON( url, function (data) {
    console.log(data);
    fillListActivities(data);
    showStravaActivities();
  })
  .error(function(err) {
    console.log('Error getting Strava activities ' + err);
  });
}

function getStravaDataActivity() {

  var url = "https://www.strava.com/api/v3/activities/214545474/streams/latlng?&access_token=" + access_token + "&callback=?";
  $.getJSON( url, function (data) {

    var steps = [];
    var dt;
    var i = 0,
        length = data[0].data.length;
    for (i = 0; i < length; ++i) {
      dt = data[0].data[i];     //Coordinates
      dt[2] = data[1].data[i];  //Seconds

      steps[i] = dt;
    }

    insertToCartoDB(steps);
  });
}

/*
Show all activities in an HTML list
*/
function showStravaActivities(){
  var lengthActivities = activities.length;
  if (lengthActivities > 0) {
    var listHTML = '<ul>';

    for (var i = 0; i < lengthActivities; ++i) {
      console.log(activities[i].id);   
      listHTML += '<li>' + activities[i].name + " - " + activities[i].date + " - " + activities[i].id + '</li>';
    }

    listHTML += '</ul>';
    $( ".listActivities" ).append( listHTML );
  }
}

/*
  Create a runtime visualization with CartoDB.js
*/
function createMap(){
  //TODO: Calcular punto de centro automáticamente
  var map = new L.Map('map', {
      center: [40.1916,-3.6692],
      zoom: 13
    });

  cartodb.createLayer(map, {
        user_name: user,
        type: 'cartodb',
        sublayers: [{
          sql: "SELECT * FROM strava",
          cartocss: '#strava {marker-fill: #FF0100;}'
        }]
  })
  .addTo(map)
  .on('done', function(layer) {
        //do stuff
      })
  .done(function(vis, layers) {
      console.log('map loaded');
  })
  .error(function(err) {
    console.log(err);
  });
}