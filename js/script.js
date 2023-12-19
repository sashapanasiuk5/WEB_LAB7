let playButton = document.querySelector("#playButton");

let closeButton = document.querySelector("#closeButton");
let startButton = document.querySelector("#startButton");
let stopButton = document.querySelector("#stopButton");
let reloadButton = document.querySelector("#reloadButton");

let workArea = document.querySelector(".work_area");
let anim = document.querySelector(".anim");
let canvas = document.querySelector("#animCanvas");

let image = document.querySelector("#backgroundImage");

const collideEvent = new Event("circleCollided");
const outsideEvent = new Event("circleOutside");

let events = [];
let eventCounter = 0;
localStorage.clear();

async function sendEvent(action,event, type){
	if( (event != "") && (type != "") ){
		let date = new Date();
		let time = date.getHours() +":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
		localStorage.setItem(eventCounter, JSON.stringify({name:event, time:time, type:type}));
		eventCounter++;
	}
	await fetch("api.php", {
		method: "POST",
		headers: {
			"Content-type" : "application/x-www-form-urlencoded"
		},
		body: "action="+action+"&name="+event+"&type="+type
	});
}

let max_X = window.innerWidth*0.7 -10;
let max_Y = window.innerHeight*0.9 -10;
let min_X = 0;
let min_Y = 0;
canvas.width = max_X;
canvas.height = max_Y;

playButton.addEventListener("click", function (e) {
	workArea.style.display = "block";
	sendEvent("startSession","","");
});

closeButton.addEventListener("click", function (e) {
	workArea.style.display = "none";
	sendEvent("endSession","","");
});

let isStoped = false;

let ctx = canvas.getContext("2d");
ctx.drawImage(image, 0, 0, max_X, max_Y);
let velocity = 120;

let directionX = -1;
let directionY = 1;

function isCollideYMax(y){
	if(y >= max_Y-10){
		return true;
	}
}

function isCollideYMin(y){
	if(y <= 10){
		return true;
	}
}

function isCollideXMin(x){
	if(x <= 10){
		return true;
	}
}


function isCollideXMax(x){
	if(x >= max_X-10){
		return true;
	}
}

let x = max_X-11;
let y = 10;

let angle = Math.random()*Math.PI/2;

function draw(startTime){
	if(isStoped){
		return;
	}

	var time = new Date();
	let milliseconds = time.getMinutes()*60 + time.getSeconds() + time.getMilliseconds()*0.001;
	ctx.clearRect(0, 0, max_X, max_Y);
	ctx.drawImage(image, 0, 0, max_X, max_Y);
	ctx.beginPath();
	ctx.fillStyle = "#E3D946";
	let dx = directionX * velocity * (milliseconds - startTime) * Math.cos(angle);
	let dy = directionY * velocity * (milliseconds - startTime) * Math.sin(angle);;
	x = x+dx;
	y = y+dy;
	ctx.arc(x, y, 10, 0, 2*Math.PI, true);
	ctx.fill();

	if( (isCollideYMax(y) && directionY == 1) || (isCollideYMin(y) && directionY == -1) ){
		directionY = directionY * -1;
		canvas.dispatchEvent(collideEvent);
	}

	if(isCollideXMax(x)){
		canvas.dispatchEvent(outsideEvent);
	}

	if(isCollideXMin(x)){
		directionX = directionX * -1;
		canvas.dispatchEvent(collideEvent);
	}

	 var circleMoved = new CustomEvent("circleMoved", {
	    "detail": {"x": Math.round(x),"y": Math.round(y) }
	  });

	 canvas.dispatchEvent(circleMoved);
	startTime = milliseconds;
	setTimeout( ()=>{
		window.requestAnimationFrame( (time) => draw(startTime));
	}, 15);
}


let moveEventWindow = document.querySelector(".move_events");
let otherEventsWindow = document.querySelector(".other_events");

startButton.addEventListener("click", function (e) {
	var time = new Date();
	let startTime = time.getMinutes()*60 + time.getSeconds() + time.getMilliseconds()*0.001;
	isStoped = false;
	 window.requestAnimationFrame( (time) => draw(startTime));
	 startButton.style.display = "none";
	 stopButton.style.display = "block";

	 let message = "Шар почав рух";
	 otherEventsWindow.innerText = message;
	 sendEvent("addOneEvent",message, "start");
});

stopButton.addEventListener("click", function (e) {
	isStoped = true;

	startButton.style.display = "block";
	stopButton.style.display = "none";

	let message = "Шар зупинився";
	otherEventsWindow.innerText = message;
	sendEvent("addOneEvent",message, "stop");
});



canvas.addEventListener("circleCollided", function (e) {
	let message = "Шар зіткнувся з стіною!"; 
	otherEventsWindow.innerText = message;
	sendEvent("addOneEvent",message, "collide");
	setTimeout(()=>{
		otherEventsWindow.innerText = message;
	}, 2000);
});


canvas.addEventListener("circleOutside", function (e) {
	 startButton.style.display = "none";
	 stopButton.style.display = "none";
	 reloadButton.style.display = "block";

	 let message = "Шар вийшов за межі екрану";
	 otherEventsWindow.innerText = message;
	 sendEvent("addOneEvent",message, "outside");
	 setTimeout(()=>{
		otherEventsWindow.innerText = "";
	}, 2000);
});

canvas.addEventListener("circleMoved", function (e) {
	let message = "Шар перемістився у координати X: "+e.detail.x +" Y: "+e.detail.y; 
	moveEventWindow.innerText = message;
	sendEvent("addOneEvent",message, "move");
});

reloadButton.addEventListener("click", function (e) {
	x = max_X-11;
	y = 10;
	isStoped = true;
	angle = Math.random()*Math.PI/2;
	startButton.style.display = "block";
	reloadButton.style.display = "none";
});

setInterval(()=>{
	if(localStorage.length > 0){
		let events = [];
		for (var i = 0; i < localStorage.length; i++){
		    let item = JSON.parse(localStorage.getItem(i));
		    events.push(item);
		}
		var send = new FormData();
			send.append("action", "addlocalStorageChunck");
	  		send.append("data", JSON.stringify(events));
		fetch("api.php", {
			method: "POST",
			body: send
		});
		localStorage.clear();
		eventCounter = 0;
	}
}, 2000);