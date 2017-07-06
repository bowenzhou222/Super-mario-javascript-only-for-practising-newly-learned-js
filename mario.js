function splitClassName(originalName){
	return originalName.split(' ')[0];
}


function moveRight(){
	
	if(!this.checkObstacleRight(Math.floor((this.currentXPosition+32)/512))){
		return;
	}
	if(Game.marioObj.moveX == false){
		return;
	}
	
	Game.marioObj.moveX = false;
	var speedX = Game.mario.marioSpeedX;
	var speedY = Game.mario.marioSpeedY;
	

	var left;
	var leftLast;
	marioLeft = this.style.left;
	marioLeft=parseInt(marioLeft.substr(0,marioLeft.length-2));
	if(marioLeft>= 256-32){
			lists = document.getElementsByClassName("map-list");
			for(var i =0; i < lists.length; i++){
				if(lists[i].style.left){
					left=lists[i].style.left;
				}else{
					lists[i].style.left="0px";
					left="0px";
				}
			}
			leftLast = lists[lists.length-1].style.left;
			
			leftLast=parseInt(leftLast.substr(0,leftLast.length-2));
			
			if(leftLast-speedX<=-16*12*32){//boundary of the map
				//window.alert(leftLast);
				if(leftLast>-16*12*32){//leftLast>-6144
					lists[lists.length-1].style.left = "-6144px";
					document.getElementsByClassName("map")[0].style.backgroundPositionX="-6144px";
				}else{//leftLast<=-6144
					left = marioLeft;
					if(left+speedX>480){
						this.style.left = "480px";
						this.currentXPosition=6656-32;
					}else{
						this.style.left = left+speedX+"px";
						this.currentXPosition+=speedX;
					}
				}
			}else{
				for(var i =0; i < lists.length; i++){
					left=lists[i].style.left;
					left=parseInt(left.substr(0,left.length-2));
					lists[i].style.left=left-speedX+"px";
				}
				this.currentXPosition+=speedX;
				if(document.getElementsByClassName("map")[0].style.backgroundPositionX){
					document.getElementsByClassName("map")[0].style.backgroundPositionX=left-speedX+'px';
				}else{
					document.getElementsByClassName("map")[0].style.backgroundPositionX="0px";
				}
			}
	} else {
		this.style.left = marioLeft+speedX+"px";
		this.currentXPosition+=speedX;
	}
	
	if(this.duringJumping!=true){
		this.className = splitClassName(this.className);
		this.className+=' '+Game.mario.rightMoveStyle;
	}else{
		this.className = splitClassName(this.className);
		this.className+=' '+Game.mario.rightJumpStyle;
	}
	
	
	Game.marioObj.moveX = true;
	Game.marioObj.movePx=0;
	
}

function moveLeft(){
	if(!this.checkObstacleLeft(Math.floor(this.currentXPosition/512))){
		return;
	}
	if(this.moveX == false){
		return;
	}
	
	var speedX = Game.mario.marioSpeedX;
	var speedY = Game.mario.marioSpeedY;
	
	var left = this.style.left;
	left=parseInt(left.substr(0,left.length-2));
	if(left-speedX>0){
		this.style.left=(left-speedX)+"px";
		this.currentXPosition-=speedX;
	}else{
		if(left>0){
			this.style.left=0+"px";
			this.currentXPosition-=left;
		}
	}
	if(this.duringJumping!=true){
		this.className = splitClassName(this.className);
		this.className+=' '+Game.mario.leftMoveStyle;
	}else{
		this.className = splitClassName(this.className);
		this.className+=' '+Game.mario.leftJumpStyle;
	}
}

function moveJump(){
	//jump up
	if(this.duringJumping || this.duringFalling){
		return;
	}
	var This = this;
	This. duringJumping= true;
	//Game.marioObj.moveX = false;
	var jumpHeight = Game.mario.jumpHigh;
	//if(This.onGround == true){
		This.onGround=false;
		This.duringJumping=true;
		This.knowWhereToLand =false;
		var yPosition=This.currentYPosition;
		
		
		var speedX = Game.mario.marioSpeedX;
		var speedY = Game.mario.marioSpeedY;
		
		
		var intervalID = setInterval(function(){
			if(This.jumpType=="low"){
				if(This.currentYPosition>=yPosition-64){
					jumpHeight = 64;
				}
			}
			
			This.currentYPosition-=speedY;
			This.style.top=Game.marioObj.currentYPosition+"px";
			var closestObstacleYUp = This.checkObstacleUp(Math.floor((This.currentXPosition)/512),Math.floor((This.currentXPosition+32)/512));
			if(This.currentYPosition <= yPosition - jumpHeight || This.currentYPosition <= closestObstacleYUp){//reach the summit or the block
				This.summit = Math.max(This.summit, yPosition - jumpHeight);
				This.reachSummit=true;
				//if(This.knowWhereToLand == false){
					
					//This.knowWhereToLand = true;
				//}
				//window.alert(closestObstacleYDown);
				var intervalIDDown = setInterval(function(){
					var closestObstacleYDown = This.checkObstacleDown(Math.floor((This.currentXPosition)/512),Math.floor((This.currentXPosition+32)/512));
					if(This.currentYPosition >= closestObstacleYDown){//fall to the obstacle
						This.onGround=true;
						This.knowWhereToLand =false;
						This.reachSummit=false;
						This.summit=0;
						This.duringJumping=false;
						//Game.marioObj.moveX=true;
						clearInterval(intervalIDDown);//when reach the obstacle, stop
					}
					if(This.onGround == false){//keep falling until reach the closest obstacle
						This.currentYPosition+=speedY;
						This.style.top=This.currentYPosition+"px";
						//This.duringJumping=true;
						This.onGround=false;
					}
					
				}, 20);
				clearInterval(intervalID);//after falling to the closest obstacle,stop
			}
		},20);
		This.fallDownAfterJump();
		var subClassName = this.className.split(' ')[1];
		
		if(subClassName.search(/R/)>=0){
			this.className = splitClassName(this.className);
			this.className+=' '+Game.mario.rightJumpStyle;
		}
		if(subClassName.search(/L/)>=0){
			this.className = splitClassName(this.className);
			this.className+=' '+Game.mario.leftJumpStyle;
		}
		/*var subClassName = this.className.split(' ')[1];
		
		if(subClassName.search(/R/)>=0){
			this.className = splitClassName(this.className);
			this.className+=' '+Game.mario.rightJumpStyle;
		}
		if(subClassName.search(/L/)>=0){
			this.className = splitClassName(this.className);
			this.className+=' '+Game.mario.leftJumpStyle;
		}*/
	
}





function stopMove(){
	var subClassName = this.className.split(' ')[1];
	
	if(!Game.marioObj.onGround){return;}
	if(subClassName.search(/R/)>=0){
		this.className = splitClassName(this.className);
		this.className+=' '+Game.mario.rightStyle;
	}
	if(subClassName.search(/L/)>=0){
		this.className = splitClassName(this.className);
		this.className+=' '+Game.mario.leftStyle;
	}
}

function showMarioPosition(){
	document.getElementById("positionX").innerHTML = Game.marioObj.currentXPosition;
	document.getElementById("positionY").innerHTML = Game.marioObj.currentYPosition;
	
	document.getElementById("row").innerHTML = Math.floor(Game.marioObj.currentYPosition/32);
	document.getElementById("col").innerHTML = Math.floor((Game.marioObj.currentXPosition-512*Math.floor(Game.marioObj.currentXPosition/512))/32);
}


function checkObstacle(){
	
	return true;
	
}

function checkObstacleLeft(mapListNumber){
	var mapList = Game.obstacles[mapListNumber];
	
	//row and col of the block in the block-array in the maplist to be checked
	var row = Math.floor(this.currentYPosition/32);
	var col = Math.floor((this.currentXPosition-512*mapListNumber)/32);
	if(mapList[row][col] != '0'){
		if(mapListNumber*512+col*32+32 >= this.currentXPosition){
			this.style.left = parseInt(this.style.left.substr(0,this.style.left.length-2))+1+'px';
			this.currentXPosition+=1;
			return false;
		}
	}
	if(mapList[row+1][col] != '0'){
		if(this.currentYPosition%32 != 0){
			if(mapListNumber*512+col*32+32 >= this.currentXPosition){
				this.style.left = parseInt(this.style.left.substr(0,this.style.left.length-2))+1+'px';
				this.currentXPosition+=1;
				return false;
			}
		}
	}
	
	//if big mario, check row+2
	return true;
}

function checkObstacleRight(mapListNumber){
	var mapList = Game.obstacles[mapListNumber];
	
	//row and col of the block in the block-array in the maplist to be checked
	var row = Math.floor(this.currentYPosition/32);
	var col = Math.floor((this.currentXPosition+32-512*mapListNumber)/32);
	if(mapList[row][col] != '0'){
		document.getElementById("posObs").innerHTML=row+' '+col;
		document.getElementById("length").innerHTML=mapListNumber*512+col*32;
		if(mapListNumber*512+col*32-32 <= this.currentXPosition){
			this.style.left = parseInt(this.style.left.substr(0,this.style.left.length-2))-1+'px';
			this.currentXPosition-=1;
			return false;
		}
	}
	
	if(mapList[row+1][col] != '0'){
		if(this.currentYPosition%32 != 0){
			if(mapListNumber*512+col*32-32 <= this.currentXPosition){
				this.style.left = parseInt(this.style.left.substr(0,this.style.left.length-2))-1+'px';
				this.currentXPosition-=1;
				return false;
			}
		}
	}
	
	//if big mario, check row+2
	return true;
}

function checkObstacleUp(mapListNumberLeft, mapListNumberRight){
	var mapListLeft = Game.obstacles[mapListNumberLeft];
	var mapListRight = Game.obstacles[mapListNumberRight];
	var height = 32;//small mario
	var largerRow=0;
	var currentRow = Math.floor(this.currentYPosition/32);
	
	var col = Math.floor((Game.marioObj.currentXPosition-512*Math.floor(Game.marioObj.currentXPosition/512))/32);
	if(Math.floor((Game.marioObj.currentXPosition+32-512*Math.floor(Game.marioObj.currentXPosition/512))/32)>15){
		var col2 = 0;
	}else{
		var col2 = Math.floor((Game.marioObj.currentXPosition+32-512*Math.floor(Game.marioObj.currentXPosition/512))/32);
	}
		
	row = currentRow;
	for(var row = currentRow; row>=0; row--){
		if(mapListLeft[row][col] != '0'){
			largerRow = Math.max(largerRow, row);
		}
	}
		
	for(var row = currentRow; row>=0; row--){
		if(mapListRight[row][col2] != '0'){
			largerRow = Math.max(largerRow, row);
		}
	}
	document.getElementById("upInfo").innerHTML = col+ ' ' +col2+' '+largerRow;
	return (largerRow+1)*32;
}

function checkObstacleDown(mapListNumberLeft, mapListNumberRight){
	var mapListLeft = Game.obstacles[mapListNumberLeft];
	var mapListRight = Game.obstacles[mapListNumberRight];
	var height = 32;//small mario
	var smallerRow = 16;//infinite
	//1st case: mario is in a single maplist
	//if(mapListNumberLeft == mapListNumberRight){
		//left down
	
		var currentRow = Math.floor(this.currentYPosition/32);
		
		var col = Math.floor((Game.marioObj.currentXPosition-512*Math.floor(Game.marioObj.currentXPosition/512))/32);
		if(Math.floor((Game.marioObj.currentXPosition+32-512*Math.floor(Game.marioObj.currentXPosition/512))/32)>15){
			var col2 = 0;
		}else{
			var col2 = Math.floor((Game.marioObj.currentXPosition+32-512*Math.floor(Game.marioObj.currentXPosition/512))/32);
		}
		
		
		//var col = Math.floor((this.currentXPosition-512*mapListNumberLeft)/32);
		if(this.currentYPosition%32 == 0){
			var row = currentRow;
		}else{
			var row=currentRow+height/32;
		}
		for(; row <= 14; row++){
		//for(var row= Math.floor(this.summit/32)+height/32; row <= 14; row++){
			if(mapListLeft[row][col] != '0'){
				smallerRow = Math.min(smallerRow, row);
			}
		}
		
		//right down
		if(this.currentYPosition%32 == 0){
			row = currentRow;
		}else{
			row=currentRow+height/32;
		}
		
		for(; row <= 14; row++){
		//for(row = Math.floor(this.summit/32)+height/32; row <= 14; row++){
			if(mapListRight[row][col2] != '0'){
				smallerRow = Math.min(smallerRow, row);
			}
		}
		document.getElementById("downInfo").innerHTML = col+ ' ' +col2+' '+smallerRow;
		//document.getElementById("showMapNumber").innerHTML = Math.floor(Game.marioObj.currentXPosition/512)+' '+Math.floor((Game.marioObj.currentXPosition+32)/512);
		document.getElementById("showMapNumber").innerHTML = mapListNumberLeft +' '+mapListNumberRight;
		return (smallerRow-1)*32;
}



function fallDownAfterJump(){
	var This = this;
	if(This.onGround==true){
		This.onGround=false;
		
		var intervalIDDown = setInterval(function(){
			if(This.duringJumping){
				var closestObstacleYDown = This.checkObstacleDown(Math.floor((This.currentXPosition)/512),Math.floor((This.currentXPosition+32)/512));
				if(This.currentYPosition >= closestObstacleYDown){
					This.knowWhereToLand =false;
					This.reachSummit=false;
					This.summit=0;
					This.duringJumping = false;
					This.onGround=true;
					clearInterval(intervalIDDown);//when reach the obstacle, stop
					return;
				}
				if(This.onGround == false){//keep falling until reach the closest obstacle
					This.currentYPosition+=This.marioSpeedY;
					This.style.top=This.currentYPosition+"px";
				}
			}
		}, 20);
	}
	
}


function fallDown(){
	if(this.duringJumping == true){//during jumping, do nothing
		return;
	}
	this.duringFalling = true;
	
	var This = this;
	
	if(This.onGround==true){
		
		This.onGround=false;
		;
		var intervalIDDown = setInterval(function(){
				if(!This.duringJumping){
					var closestObstacleYDown = This.checkObstacleDown(Math.floor((This.currentXPosition)/512),Math.floor((This.currentXPosition+32)/512))
					if(This.currentYPosition >= closestObstacleYDown){
						This.knowWhereToLand =false;
						This.reachSummit=false;
						This.summit=0;
						This.duringJumping = false;
						This.onGround=true;
						This.duringFalling=false;
						clearInterval(intervalIDDown);//when reach the obstacle, stop
						return;
					}
					if(This.onGround == false){//keep falling until reach the closest obstacle
						This.currentYPosition+=This.marioSpeedY;
						This.style.top=This.currentYPosition+"px";
					}
				
				}
			}, 
		20);
	}
	
}


