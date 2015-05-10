var autoComplete;
var lng = "";
var lat = "";
var infowindow =  new google.maps.InfoWindow();
function initialize(){
	jQuery('#datetimepicker').datetimepicker({
		 format:'Y-m-d H:i',
		 minDate:'-1970/01/02',
		//yesterday is minimum date(for today use 0 or -1970/01/01
		 maxDate:'+1970/01/30'
	});
lat = "44.649858";
lng = "-93.391269";
	maps(lat,lng);
}

var directionsDisplay ;
var directionsService = new google.maps.DirectionsService();
function maps(lat,lng){

	var latlng = new google.maps.LatLng(lat,lng);
	var rendererOptions = {
			draggable:false,
		polylineOptions: { strokeColor: 'black',strokeOpacity:'.7', strokeWeight: 5}
			};

	directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	myOptions = {
			zoom:5,
			center:latlng,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			mapTypeControl:false		
	};

     
	var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	
	var trafficLayer = new google.maps.TrafficLayer();  
	$(document).ready(function() {
	    $('#traffic').change(function() {  	
	        if($(this).is(":checked")) { 
	        	trafficLayer.setMap(map);   
	        }else{
	        	trafficLayer.setMap(null);
	        }     
	    });
	});
	var input = document.getElementById('routeStart');
	var input2 = document.getElementById('routeEnd');
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds',map);
	
	var autocomplete = new google.maps.places.Autocomplete(input2);
	autocomplete.bindTo('bounds',map);
	
	google.maps.event.addListener(autocomplete,'place_changed',function(){
	});
	directionsDisplay.setMap(map);
	var marker = new google.maps.Marker({
		position:latlng,
		map:map,
		draggable:true,
		title:"Drag for weather info"
	});
	//marker.setMap(null);

//	google.maps.event.addListener(marker,"click",function(event){
//		//infowindow.close();
//		lat = event.latLng.lat();
//		lng = event.latLng.lng();
//
//		calcRoute(lat,lng,marker,map,infowindow);
//	});
	google.maps.event.addListener(marker, "dragstart", function(event){
		infowindow.close()});
	google.maps.event.addListener(marker, "dragend", function(event) { 
		lat = event.latLng.lat();
		lng = event.latLng.lng();

		calcRoute(lat,lng,marker,map,infowindow);
 });
	 $(function(){
			$("#button").click(function(){
				infowindow.close();
				var doSubmit = false;
				var startObj = document.getElementById("routeStart");
				var endObj = document.getElementById("routeEnd");
				var getDateTimeObj = document.getElementById("datetimepicker");
				var start = document.getElementById("routeStart").value;
				var end = document.getElementById("routeEnd").value;
				var getDateTime = document.getElementById('datetimepicker').value;
				if(start == ""){
					doSubmit = false;
					startObj.style.border = "2px solid #B40404";
				}
				if(start != ""){
					doSubmit = true;
					startObj.style.border = "1px solid black";
				}
				if(end == ""){
					doSubmit = false;
					endObj.style.border = "2px solid #B40404";
				}
				if(end != ""){
					doSubmit = true;
					endObj.style.border = "1px solid black";
				}
				if(getDateTime == ""){
					doSubmit = false;
					getDateTimeObj.style.border = "2px solid #B40404";
				}
				if(getDateTime != ""){
					doSubmit = true;
					getDateTimeObj.style.border = "1px solid black";
				}
				//alert(doSubmit);
				if(doSubmit){
					calcRouteSearch(map,marker);
				}
			})
		 });
}	
//google.maps.event.addDomListener(window,'load',initialize);


 
 function calcRouteSearch(map,marker){
	 
	 var start = document.getElementById('routeStart').value;
	 var end = document.getElementById('routeEnd').value;
	 var waypts = [];
	 var duration = "";
	 var durationText = "";
	 var request = {
			 origin:start,
			 destination:end,
			 //waypoints:waypts,
			 provideRouteAlternatives:true,
			 travelMode:google.maps.DirectionsTravelMode.DRIVING
	 };
	 directionsService.route(request, function(response,status){
		 var seconds;
		 if(status == google.maps.DirectionsStatus.OK){
			 document.getElementById("errorMsg").style.visibility = "hidden";
			 lat = response.routes[0].overview_path[0].A;
			 lng = response.routes[0].overview_path[0].F;
			 var latlng = new google.maps.LatLng(lat,lng);
			 marker.setPosition(latlng);
			 infowindow.setContent("Drag and drop marker on a<br>place to see weather info");
			 infowindow.open(map,marker);
			 directionsDisplay.setPanel(document.getElementById('directionsPanel'));
			 directionsDisplay.setDirections(response);
			
			
		 }
		 else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
			 directionsDisplay.setPanel(null);
			 document.getElementById("errorMsg").style.visibility = "visible";
			 document.getElementById('errorMsg').innerHTML = "No routes found";
		 }
		 else if(status == google.maps.DirectionsStatus.NOT_FOUND){
			 directionsDisplay.setPanel(null);
			 document.getElementById("errorMsg").style.visibility = "visible";
			 document.getElementById('errorMsg').innerHTML = "Directions not found, please check the origin and destination address and try again";
		 }
		 else{
			 directionsDisplay.setPanel(null);
			 document.getElementById("errorMsg").style.visibility = "visible";
			 document.getElementById('errorMsg').innerHTML = "Directions not found, please try again later";
		 }
	 })
  } 
function calcRoute(lat,lng,marker,map,infowindow){
	 
	 var start = document.getElementById('routeStart').value;
	 var end = document.getElementById('routeEnd').value;
	 var waypts = [];
	 var duration = "";
	 var durationText = "";
	 if(start != "" && end !=""){
	 if(lat != undefined){
		 waypts.push({
			 location:new google.maps.LatLng(lat,lng),
			 stopover:true});
	 }
	 var request = {
			 origin:start,
			 destination:end,
			 waypoints:waypts,
			 provideRouteAlternatives:false,
			 travelMode:google.maps.DirectionsTravelMode.DRIVING
	 };
	 directionsService.route(request, function(response,status){
		 var seconds;
		 if(status == google.maps.DirectionsStatus.OK){
			 document.getElementById("errorMsg").style.visibility = "hidden";
			 var durationText = response.routes[0].legs[0].duration.text;
			 duration = parseInt(response.routes[0].legs[0].duration.value);
			 directionsDisplay.setDirections(response);			
			 var getDateTime = document.getElementById('datetimepicker').value;
			 if(getDateTime != ""){
				 getDateTime = getDateTime+":00";
				 var match = getDateTime.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
				 var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6])
				 // month must be between 0 and 11, not 1 and 12
				 console.log(date);
				 console.log(date.getTime() / 1000);
				 seconds = date.getTime() / 1000;
			 }
			 else{
				 seconds = parseInt(new Date().getTime()/1000);
			 }
		
			 if(lat!= undefined){
				
				 seconds = seconds + duration;
				 getWeather(lat,lng,seconds,marker,map,infowindow,durationText);
			 }
		 }
		 else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
			 document.getElementById("errorMsg").style.visibility = "visible";
			 document.getElementById('errorMsg').innerHTML = "No routes found";
		 }
		 else if(status == google.maps.DirectionsStatus.NOT_FOUND){
			 document.getElementById("errorMsg").style.visibility = "visible";
			 document.getElementById('errorMsg').innerHTML = "Directions not found, please check the origin and destination address and try again";
		 }
		 else{
			 document.getElementById("errorMsg").style.visibility = "visible";
			 document.getElementById('errorMsg').innerHTML = "Directions not found, please try again later";
		 }
	 })
	} 
  }
 getWeather = function(lat,lng,seconds,marker,map,infowindow,durationText){
	 
	 var apiKey = '65ed76720f28f51b12d908c6c9a2450f';
     var url = 'https://api.forecast.io/forecast/'+apiKey + "/" + lat + "," + lng +","+seconds+ "?callback=?";
     var data;
     $.ajax({
    	  url: url,
    	  dataType: "jsonp",
    	  success: function (data) {
    		 // alert(data.hourly.icon);
    		 var temp = data.currently.temperature;
    	     var summary = data.currently.summary;
    	     var hourlySummary = data.hourly.summary;
    	     var time = data.currently.time;
    	     var windSpeed = data.currently.windSpeed + " mph";
    	     var humidity = data.currently.humidity + "&#37;";
    	     var visibility = data.currently.visibility + " mi";
    	     var cloudCover = data.currently.cloudCover;
    	  var date = new Date(time*1000);
    	  var hours = date.getHours() == 0 ? "12" : date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    	  var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    	  var ampm = date.getHours() < 12 ? "AM" : "PM";
    	  var arrivalTime = hours + ":" + minutes + " " + ampm;
    	  var timezone = data.timezone;
    	             infowindow.setContent("ETA: "+arrivalTime+"<br>" +"Time Zone: "+timezone+"<br>"+
    	            		 "Duration: "+durationText + "<br>"+
    	             		"<B>Weather Forecast at Arrival:</B> <br> Temparature: "+temp+"&#186;F<br>"+summary+"<br>"+
    	             		hourlySummary+"<br>"+"WindSpeed: "+windSpeed+"<br>"+"Humidity: "+humidity+"<br>"+"Visibility: "+visibility+"<br>"+"CloudCover: "+cloudCover);
    	    		 infowindow.open(map,marker);  	      
    	  },
    	  error: function() {
    		    alert("Unable to get the weather info. Please try again later")
    		  }
    	});
 };
	 
	 
