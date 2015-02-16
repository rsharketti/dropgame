/**
 * The Drop class is a blueprint for each raindrop we generate
 * @author  John Doe
 * @version 1.0, May 2014
 */
 
 var spawntimer;
 var dropArray = new Array();
 var movetimer;
 
function Drop(){
	this.x; //starts empty, will keep track of each drop's left-right position as a #
	this.y; //starts empty, will keep track of each drop's up-down position as a #
	this.item_on_page; //represents drop's physical presence on the screen
	/** 
	*	The create method creates a DIV that looks like a blue drop on the page
	*/
	this.create = function(){
		//make a div tag in the HTML, store it into the item-on-page we set up above.
		this.item_on_page = document.createElement("div");
		//give it a class which styles it in CSS to resemble a drop
		this.item_on_page.className = "raindrop";
		//store a random x position, different for each drop. I'm using screen width of 800, height of 600:
		this.x = Math.floor(Math.random()*800);
		this.y = -50;//puts each new drop above top of screen
		//use those x and y coordinates in the CSS to position the drop:
		this.item_on_page.style.left = this.x + "px";
		this.item_on_page.style.top = this.y + "px";
		//attach the item to our HTML hierarchy, as a child of the body:
		document.body.appendChild(this.item_on_page);
	}
	/** 
	*   The destroy function does lots of cleaning up when a drop is removed from the page
	*/
	this.destroy = function(){
		//remove all splashes from the screen.
		var splashes = document.getElementsByClassName("splash");
		for(var j=0; j<splashes.length; j++){
			document.body.removeChild(splashes[j]);
		}
		//cause a splash animation right where the drop is
		var newSplash = document.createElement("img");
		//we'll reference the animating gif with random query string so browser thinks 
		//anim is difference each time and starts it playing from the beginning. 
		newSplash.src = "img/splash.gif?" + Math.random();
		//give each splash a classname so i can remove them:
		newSplash.className="splash";
		newSplash.style.position = "absolute";
		//position the splash where the drop is.
		newSplash.style.left = this.x + "px";
		newSplash.style.top = this.y + "px";
		document.body.appendChild(newSplash);
		//get this drop out of the array. First, find index # of this drop
		var this_drops_index_num = dropArray.indexOf(this);
		//splice(indexNumber,howManyToRemove)
		dropArray.splice(this_drops_index_num,1)
		//remove its graphic from the screen.
		document.body.removeChild(this.item_on_page);
	}
} //close the Drop class


onload=init;

function init() {
	//when game starts, start causing a spawn function
	//to happen every so ofter.
	spawntimer = setInterval(spawn,1000);
	movetimer = setInterval(moveAllDrops,1000/30);
}
/**
 *generate a new drop objects every so ofter
 */
function spawn(){
	//make an object that's an instance of the Drop Class:
	var anotherdrop = new Drop();
	anotherdrop.create();
	//remember the newly-created drop by storing it in an array
	dropArray.push(anotherdrop);
}
/**
 *loop through all drop objects, add to Y every so ofter
 */
function moveAllDrops(){
	//for each drop in the dropARrray, repeat whats in {}
		for(var i=0; i<dropArray.length; i++){
			//make a short reference to the current drop:
			var currentdrop = dropArray[i];
			//add to the current Y property of this drop
			currentdrop.y += 5;
			//apply the bigger y as the drops top property in CSS
			currentdrop.item_on_page.style.top = currentdrop.y + "px";
			//if the drop hits bottom of game screen, remove it.
			if(currentdrop.y >400){
					currentdrop.destroy();
			}
		}
}


