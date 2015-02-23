/**
 * The Drop class is a blueprint for each raindrop we generate
 * @author  John Doe
 * @version 1.0, May 2014
 */
 
 var spawntimer;
 var dropArray = new Array();
 var movetimer;
 var user_bucket = new bucket(50,375,100,100);
 
 /**
  *this class is the user-controlled element that catches the drops
   */
 function bucket(ux, uy, uwidth, uheight){
		this.x=ux;
		this.y=uy;
		this.width=uwidth;
		this.height=uheight;
		this.item_on_page;
		
		/** 
		 *	The create method creates a DIV that looks like a red violet drop on the page
		 */ 
		 
		 this.create = function(){
			 this.item_on_page = document.createElement("div");
			 this.item_on_page.style.left = this.x + 'px';
			 this.item_on_page.style.top = this.y + 'px';
			 this.item_on_page.style.width = this.width + 'px';
			 this.item_on_page.style.height = this.height + 'px';
			 this.item_on_page.style.position = 'absolute';
			 this.item_on_page.style.backgroundColor = "rgba(20,0,125,.5)";
			 document.body.appendChild(this.item_on_page);
		 }//end create function
 }//end bucket class
 
function Drop(){
	this.x; //starts empty, will keep track of each drop's left-right position as a #
	this.y; //starts empty, will keep track of each drop's up-down position as a #
	this.width=50;//keep track of drops width, for collisions.
	this.height=50;
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
	//spawn();
	movetimer = setInterval(moveAllDrops,1000/30);
	//make a user controlled bucket object on the screen.
	user_bucket.create();
	//event handler:when a key is pressed, do the checkKey function
	document.onkeydown = function(e){
		checkKey(e);	
	}
}
/**
 *this method moves the bucket if appropriate key was hit.
 */
 
function checkKey(e){
	e = e||window.event;//redefine the event references for all browsers
	//if the key pressed was the right arrow
	if(e.keyCode == 39){
		//add to bucket's x
		user_bucket.x += 20;
	}else if(e.keyCode == 37){
		//subtract from bucket's x
		user_bucket.x += -20;
	}
	//apply its new x to its CSS position.
	user_bucket.item_on_page.style.left = user_bucket.x + 'px';
	
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
			//if this drop is colliding with the bucket...
			if(collisionCheck(user_bucket, currentdrop)){
			//get rid of this drop 
				currentdrop.destroy();
			//update counter and display
			}
			
		}
}
/**
 * this method returns true if the two elements are touching.
 * @param	big_obj an HTML element 
 * @param	sm_obj an HTML element 
 * @return 	Boolean
 */
function collisionCheck(big_obj, sm_obj){
	var bigL = big_obj.x;
	var bigR = big_obj.x + big_obj.width;
	var smL = sm_obj.x;
	var smR = sm_obj.x + sm_obj.width;
	var bigT = big_obj.y;
	var bigB = big_obj.y + big_obj.height;
	var smT = sm_obj.y;
	var smB = sm_obj.y + sm_obj.height;
		//if big_obj is touching sm_obj..
		//Stricter: (smR < bigR) && (smL > bigL) 
		if((smR > bigL )&&(smL < bigR)){
			if((smT < bigB )&&(smB > bigT)){
			//console.log(smR + " " + bigR + "and" + smL + " "+  bigL);
			return true  
			//otherwise return false
			}//end height check
		}//end width check
}//end function collisionCheck

