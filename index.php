<!DOCTYPE html>
<html>
<head>
	<title>Car service</title>
	<link rel="stylesheet" href="./css/styles.css">
	<link rel="stylesheet" href="./css/accordion.css">
	 <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<div class="work_area">
		<div class="controls">
			<div class="event_window">
				<div class="move_events"></div>
				<div class="other_events"></div>
			</div>
			<div class="buttons">
				<button id="reloadButton">Reload</button>
				<button id="stopButton">Stop</button>
				<button id="startButton">Start</button>
				<button id="closeButton">Close</button>
			</div>
		</div>
		<div class="anim" >
			<img src="background.jpg" alt="" id="backgroundImage" style="display: none">
			<canvas id="animCanvas">
				
			</canvas>
		</div>
	</div>



	<header>
		<div class="logo">Car service</div>
		<div class="discount-banner">
			-10% discount
		</div>
	</header>
	<div class="wrapper">
		<div class="content">
			<main>
				<aside>
					<div class="feedback side-block">
						<div class="title">Last Feedback</div>
						<div class="text">“ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam feugiat vitae sem non varius. ”
							<div class="author"> – Dillan Sullivan</div></div>
					</div>
					<div class="contact-form side-block">
						<div class="title">Need support?</div>
						<form action="">
							<input type="text" placeholder="Name">
							<input type="text" placeholder="Phone">
							<textarea placeholder="I have a problem..." id="" rows="6"></textarea>
							<input type="submit" >
						</form>
					</div>
				</aside>
				<section>
					<div class="title">Animation</div>
					<div class="playButton_wrapper">
						<button id="playButton">Play</button>	
					</div>
				</section>
			</main>
			<footer>
				<div class="title">Contacts</div>
				<div class="info">
					<span id="phone">+38 068 7777 777</span>
					<span id="email">carservice@gmail.com</span>
				</div>
			</footer>
		</div>
		<nav>
			<ul>
				<li><a href="#" class="active">Перша сторінка</a></li>
				<li><a href="second.html" >Друга сторінка</a></li>
			</ul>
		</nav>
	</div>

	<script type="text/javascript" src="./js/script.js"></script>
</body>
</html>