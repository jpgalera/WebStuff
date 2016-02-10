/*
	TODO
		Character Select
		Character Spcific PowerUps
		Dynamic Stage Size
		***Different Levels/Difficulties
		Level Bosses
		Extras:
			Portal to Bonus Stage
			Bonus to be Different Type of Game
*/

// Stage
// Note: Yet another way to declare a class, using .prototype.

function Stage(width, height, monsterpresent, boxpresent, smartmonsterctr, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player
	this.monsterpresent = monsterpresent; //Howmany monsters the stage should have
	this.boxpresent = boxpresent; //How many box the stage should have
	this.monsterctr = monsterpresent; //keeps track if all monsters are killed
	this.smartmonsterctr = smartmonsterctr;

	// the logical width and height of the stage
	this.width=width;
	this.height=height;

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
	this.smartMonsterImageSrc=document.getElementById('smartMonsterImage').src;
	this.stickyBoxImageSrc=document.getElementById('stickyboxImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later
	var s='<table cellspacing="0" cellpadding="0" border=0>';
	// YOUR CODE GOES HERE
	var boxcount = 0;
    var monstercount = 0;
    console.log("adding the stage");
    for (var i = 0; i < this.width; i++){
        s += "<tr>";
        for(var j = 0 ; j < this.height ; j++)
        {
                s+= "<td> <img src=" + this.blankImageSrc + " id="+this.getStageId(i,j)+" width = 24 height = 24/> </td>";
        }//for
        s+= '</tr>';
    }//for

	s+="</table>";
	// Put it in the stageElementID (innerHTML)
	document.getElementById("stage").innerHTML = s;

	// Add the player to the center of the stage
	console.log("adding the player");
	this.setImage(this.width/2,this.height/2,this.playerImageSrc);
    this.player = new Player(this.width/2, this.height/2, this, this.playerImageSrc);
    this.addActor(this.player);

	// Add walls around the outside of the stage, so actors can't leave the stage
	for(var i=0; i<this.width;i++)
    {
        for(var j=0;j<this.height;j++)
        {
            if(i==0 || j==0 || i==this.height-1 || j==this.width-1 )
            {
                this.setImage(i,j,this.wallImageSrc);
                this.wall = new Wall(i,j,this,this.wallImageSrc);
                this.addActor(this.wall);
                //add wall actor to actors

            }//if
        }//for
    }//for
	// Add some Boxes to the stage
	console.log("adding the boxes");
	while (boxcount < this.boxpresent)
    {
    	while (boxcount < 3)
    	{
	    	x =  Math.floor(Math.random() * this.width);
	        y = Math.floor(Math.random() * this.height);

	        if (this.getActor(x,y) == null)
	        {
	            this.setImage(x,y,this.stickyBoxImageSrc);
	            this.stickybox = new StickyBox(x,y,this,this.boxImageSrc);
	            this.addActor(this.stickybox);
	            boxcount++;
	        }//if

    	}

        x =  Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);

        if (this.getActor(x,y) == null)
        {
            this.setImage(x,y,this.boxImageSrc);
            this.box = new Box(x,y,this,this.boxImageSrc);
            this.addActor(this.box);
            boxcount++;
        }//if

    }//while
	// Add in some Monsters
	console.log("adding the monsters");
	while (monstercount < this.monsterpresent)
    {
        x =  Math.floor((Math.random() * this.width));
        y = Math.floor((Math.random() * this.height));

        if (this.getActor(x,y) == null)
        {
        	if(monstercount < this.smartmonsterctr){
        		this.setImage(x,y,this.smartMonsterImageSrc);
	            this.smartmonster = new SmartMonster(x,y,this,this.smartMonsterImageSrc);
	            this.addActor(this.smartmonster);//RAAAAAAWWWRRR!
	            monstercount++;
        	}//if 
        	else
        	{
	            this.setImage(x,y,this.monsterImageSrc);
	            this.monster = new Monster(x,y,this,this.monsterImageSrc);
	            this.addActor(this.monster);//RAAAAAAWWWRRR!
	            monstercount++;
	        }
        }//if

    }//while

}//initialize
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){ return x+","+y; }

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}//addActor

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
	var n = this.actors.indexOf(actor);

    if(n > -1){
    	if(this.actors[n] instanceof Monster == true)
	    {
	    	this.monsterpresent--;
	    }
        this.actors.splice(n,1);
    }//if
    this.setImage(actor.x, actor.y,this.blankImageSrc);
    
}//removeActor

//Player wins the game
Stage.prototype.playerWin=function()
{
	if(this.monsterpresent == 0)
	{
		alert("You Win!!!");
		location.reload();
	}//if
	return;
}//playerWin
// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	document.getElementById(x+','+y).src = src;
}//setImage

// Take one step in the animation of the game.  
Stage.prototype.step=function(){
	for(var i=0;i<this.actors.length;i++){
		// each actor takes a single step in the game
		if (this.actors[i] instanceof Monster || this.actors[i] instanceof SmartMonster){
			this.actors[i].step();
		}
	}//for
}//step

// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
	for (var i=0; i<this.actors.length;i++){
        if(this.actors[i].x == x && this.actors[i].y == y){
            return this.actors[i];
        }//if
    }//for
    return null;
}//getActor
// End Class Stage

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------

//Start of Player class
function Player(x, y , stage, image){
	this.x = x;
	this.y = y;

	this.stage = stage;
	this.image = image;
	this.isDead = false;//player not dead  until said otherwise
}//Player

//check if player is dead
Player.prototype.dead=function(){
	if(this.isDead)
	{
		this.stage.removeActor(this.stage.getActor(this.x,this.y));
		alert("GG! :(");	
		location.reload();
	}//if
}
//check if player can move
Player.prototype.canMove=function(dx,dy){
	var flag = false; //player can't move unless stated otheriwse
	newx = this.x+dx;//player wants to move
	newy = this.y+dy;//to these coordinates
	if (this.isDead)
	{
		return flag;
	}//if
	else if (this.stage.getActor(newx, newy) != null)//spot is not empty
	{
		if (this.stage.getActor(newx, newy).canMove(dx,dy) == true)//ask if actor can move
		{
			flag = true;
		}//if
		else//if not, ask the next actor in the way to move
		{
			this.stage.getActor(newx, newy).canMove(dx,dy);
		}//else
	}//if
	else
	{
		flag = true;
	}//else
	return flag;
}//canMove

//player moves
Player.prototype.step=function(dx,dy){
	if(this.canMove(dx,dy) == true){
		newx = this.x+dx;//player wants to move
		newy = this.y+dy;//to these coordinates
		if (this.stage.getActor(newx, newy) != null)//spot is not empty
		{
			if(this.stage.getActor(newx, newy) instanceof Monster)
			{
				this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
				this.isDead = true;
				this.dead();
			}//if
			this.stage.getActor(newx,newy).step(dx,dy);
		}
		this.stage.setImage(this.x, this.y, this.stage.blankImageSrc);
		this.x = this.x + dx;
		this.y = this.y + dy;
		this.stage.setImage(this.x, this.y, this.stage.playerImageSrc);
		

	}//if
	
}//step

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------

//Start of Box class
function Box (x, y, stage, image){
	this.x = x;
	this.y = y;

	this.stage = stage;
	this.stage - image;
}

//can this box move
Box.prototype.canMove=function(dx,dy){
	var flag = false; //box can't move unless stated otheriwse
	newx = this.x+dx;//box wants to move
	newy = this.y+dy;//to these coordinates
	if (this.stage.getActor(newx, newy) != null){//spot is not empty
		if (this.stage.getActor(newx, newy).canMove(dx,dy) == true)//ask if actor can move
		{
			flag = true;
		}//if
		else//if not, ask the next actor in the way to move
		{
			this.stage.getActor(newx, newy).canMove(dx,dy);
		}//else
	}//if
	else{
		flag = true;
	}
	return flag;
}//box.canmove

//box moves
Box.prototype.step=function(dx,dy){
	if(this.canMove(dx,dy) == true){
		newx = this.x+dx;//player wants to move
		newy = this.y+dy;//to these coordinates
		if (this.stage.getActor(newx, newy) != null)//spot is not empty
		{
			this.stage.getActor(newx,newy).step(dx,dy);
		}
		this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);

	    this.x = this.x+dx;
	    this.y = this.y+dy;

	    this.stage.setImage(this.x,this.y,this.stage.boxImageSrc);
	}//if

}

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------

//Sticky Box Class Start

function StickyBox (x, y, stage, image){
	this.x = x;
	this.y = y;

	this.stage = stage;
	this.stage - image;
}

//can this box move
StickyBox.prototype.canMove=function(dx,dy){
	var flag = false; //box can't move unless stated otheriwse
	newx = this.x+dx;//box wants to move
	newy = this.y+dy;//to these coordinates
	if (this.stage.getActor(newx, newy) != null){//spot is not empty
		if (this.stage.getActor(newx, newy).canMove(dx,dy) == true)//ask if actor can move
		{
			flag = true;
		}//if
		else//if not, ask the next actor in the way to move
		{
			this.stage.getActor(newx, newy).canMove(dx,dy);
		}//else
	}//if
	else{
		flag = true;
	}
	return flag;
}//box.canmove

//box moves
StickyBox.prototype.step=function(dx,dy){
	if(this.canMove(dx,dy) == true){
		newx = this.x+dx;//player wants to move
		newy = this.y+dy;//to these coordinates
		if (this.stage.getActor(newx, newy) != null)//spot is not empty
		{
			this.stage.getActor(newx,newy).step(dx,dy);
		}
		this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);

	    this.x = this.x+dx;
	    this.y = this.y+dy;

	    this.stage.setImage(this.x,this.y,this.stage.stickyBoxImageSrc);
	}//if

}

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------ 

//Start of Wall
function Wall(x, y,stage,image){
    this.x = x;
    this.y = y;

    this.stage = stage;
    this.image = image;
}

Wall.prototype.canMove=function(dx,dy){
    return false;
}
Wall.prototype.step=function(dx,dy){
    ;
}

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------

//Start of Monster
function Monster(x,y,stage,image){
	this.x = x;
	this.y = y;
	this.dx = 1;
	this.dy = 1;

	this.stage = stage;
	this.image = image;
}//monster

//can this monster move?
Monster.prototype.canMove=function(dx,dy){
	var flag = false;
	if (this.stage.getActor((this.x-dx),(this.y-dy)) instanceof Player){
		//allow player to move to the same spot
		flag = true;
	}//if
	return flag;
}//monster canmove

//is this monster dead?
Monster.prototype.isDead=function()
{
	var ctr = 0;
	var coord = [-1,0,1];
	for(var i = 0; i < coord.length; i++)
	{
		for (var j = 0; j < coord.length; j++)
		{
			if(this.stage.getActor(this.x + coord[i], this.y + coord[j]) instanceof StickyBox == true || this.stage.getActor(this.x + coord[i], this.y + coord[j]) instanceof Box == true || this.stage.getActor(this.x + coord[i], this.y + coord[j]) instanceof Wall == true)
			{//check if monster is completely surrounded
				ctr++;
			}//if
		}//for
	}//for
	if (ctr == 8)
	{
		this.stage.removeActor(this.stage.getActor(this.x,this.y));
		this.stage.playerWin();
		return true;
	}//if
	return false;
}//isdead

//monster step
//Normal monster moves sideways only
Monster.prototype.step=function()
{
	var coord = [-1,0,1];
	for(var i = 0; i < coord.length; i++)
	{
		for (var j = 0; j < coord.length; j++)
		{
			if(this.stage.getActor(this.x + coord[i], this.y + coord[j]) instanceof StickyBox == true)
			{//check if monster is close to sticky box
				return;
			}//if
		}//for
	}//for

	if (this.stage.getActor((this.x + this.dx),(this.y + this.dy)) != null && this.stage.getActor((this.x - this.dx),(this.y - this.dy)) != null)
	{
    	this.isDead();
    	return;
    }
    else if (this.stage.getActor((this.x + this.dx),(this.y + this.dy)) == null || this.stage.getActor((this.x + this.dx),(this.y + this.dy)) instanceof Player == true)
    {//monster goes south east
    	this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        this.stage.setImage(this.x,this.y,this.stage.monsterImageSrc);
    	if(this.stage.getActor((this.x),(this.y)) instanceof Player == true)
        {
            this.stage.getActor((this.x),(this.y)).isDead = true;
            this.stage.getActor((this.x),(this.y)).dead();
        }//if
    }//if
    else
    {//change monster's direction and recursively call step
    
        this.dx = -this.dx;
        this.dy = -this.dy;
        this.step();

    }//else

}//step

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------ 

//Smart Monster class Start
function SmartMonster(x,y,stage,image){
	this.x = x;
	this.y = y;
	this.dx = 1;
	this.dy = 1;

	this.stage = stage;
	this.image = image;
	this.followpath = true; //smart monster can follow simplest path to player if not obstructed
}//monster

//can this monster move?
SmartMonster.prototype.canMove=function(dx,dy){
	var flag = false;
	if (this.stage.getActor((this.x-dx),(this.y-dy)) instanceof Player){
		//allow player to move to the same spot
		flag = true;
	}//if
	return flag;
}//monster canmove

//is this monster dead?
SmartMonster.prototype.isDead=function()
{
	var ctr = 0;
	var coord = [-1,0,1];
	for(var i = 0; i < coord.length; i++)
	{
		for (var j = 0; j < coord.length; j++)
		{
			if(this.stage.getActor(this.x + coord[i], this.y + coord[j]) instanceof Box == true || this.stage.getActor(this.x + coord[i], this.y + coord[j]) instanceof Wall == true)
			{//check if monster is completely surrounded
				ctr++;
			}//if
			else
			{//move to open spot

			}
		}//for
	}//for
	if (ctr == 8)
	{
		this.stage.removeActor(this.stage.getActor(this.x,this.y));
		this.stage.playerWin();
		return true;
	}//if
	return false;
}//isdead

//monster step
//Normal monster moves sideways only
SmartMonster.prototype.step=function()
{//semi-smart monster chases player but still trapable
	var newx = 0;
	var newy = 0;
	if(this.followpath == true)
	{
		//locate player and set monster coordinates
		if(this.x < this.stage.player.x)
		{
			newx = this.x + this.dx;
		}//if
		else if (this.x > this.stage.player.x)
		{
			newx = this.x - this.dx;
		}//else if
		else // this.x == this.stage.player.x
		{
			newx = this.x
		}//else

		if(this.y < this.stage.player.y)
		{
			newy = this.y + this.dy;
		}//if
		else if( this.y > this.stage.player.y)
		{
			newy = this.y - this.dy;
		}//else if
		else
		{ // this.y == this.stage.player.y
			newy = this.y;
		}//else
		if(this.stage.getActor(newx,newy) == null || this.stage.getActor(newx,newy) instanceof Player)
		{
			this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);
		    this.x = newx;
		    this.y = newy;
		    this.stage.setImage(this.x,this.y,this.stage.smartMonsterImageSrc);
		    if(this.stage.getActor((this.x),(this.y)) instanceof Player == true)
	        {
	            this.stage.getActor((this.x),(this.y)).isDead = true;
	            this.stage.getActor((this.x),(this.y)).dead();
	        }//if
		}//if
		else //recalculate a path
		{
			this.isDead();
			this.followpath = false;
			this.step();
		}
	}
	else
	{//obstructed
		//move monster along x or y axis then try to follow simplest path again
		if(this.stage.getActor(this.x+this.dx,this.y) == null)
		{
			this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);
		    this.x = this.x+this.dx;
		    this.stage.setImage(this.x,this.y,this.stage.smartMonsterImageSrc);
		    this.followpath = true;
		}//if
		else if(this.stage.getActor(this.x-this.dx,this.y) == null)
		{
			this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);
		    this.x = this.x-this.dx;
		    this.stage.setImage(this.x,this.y,this.stage.smartMonsterImageSrc);
		    this.followpath = true;
		}//if
		else if(this.stage.getActor(this.x,this.y+this.dy) == null)
		{
			this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);
		    this.y = this.y+this.dy;
		    this.stage.setImage(this.x,this.y,this.stage.smartMonsterImageSrc);
		    this.followpath = true;
		}
		else if(this.stage.getActor(this.x,this.y-this.dy) == null)
		{
			this.stage.setImage(this.x,this.y,this.stage.blankImageSrc);
		    this.y = this.y-this.dy;
		    this.stage.setImage(this.x,this.y,this.stage.smartMonsterImageSrc);
		    this.followpath = true;
		}
	}

}//step

//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------ 

//PowerUps Class
/*
	TA - meld/traps
	void - timelapse/chrono
	pudge - hook/eat
*/
//------------------------------------------------------------------------------------
//####################################################################################
//------------------------------------------------------------------------------------ 