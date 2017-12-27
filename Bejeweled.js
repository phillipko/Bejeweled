/*
Phillip Ko
p_ko1@u.pacific.edu
Comp 127 Project4
Nov 11, 2014
Project4.js
*/
var maxZindex = 1;
var first = 1; //first == 1 means it's the first click 
				// first == 0 means it's the second click
var board = [[],[], [],[], [],[], [],[]]; // 8 by 8 stores the board information 
var firstClickR; //keep track of what the user clicks (Row)
var firstClickC; //keep track of what the user clicks (Column)
var firstClickObject;  //Save firstClickObject for other functions to use 
var secondClickObject; //save secondClickObject for other functions to use 
var moves = 0; //Keep track of how many times the user has clicked 
var addScore = 0;
var score = 0; //keep track of the user's score 
var blanksCount = [0,0,0,0,0,0,0,0]; // 

				
window.onload = function ()
{
	for (var j = 0; j < 8; j++) //initialize the board information
		for (var i = 0; i < 8; i++)
			board[i][j] = "0";
	$("bottom").innerHTML = "Score: " + score + "  Moves: " + moves;
	
	var newElement = document.createElement("div");
	newElement.classList.add("element");
	
	initBoard(); //put jewels
	var removed = 1;
	while (removed == 1) //if some jewels can be removed, we update the board 
	{
		removed = checkBoard(); //check and remove 
		//alert(removed);
		if (removed == 1)
		{
			updateBoard();
			printBoard();
		}		
	}
}

//The following function initiates the game board. It fills the board with random jewels 
function initBoard()
{
	var random = ["blue.png", "green.png", "orange.png", "purple.png", "red.png", "white.png", "yellow.png"];
	var randomJewel  = random[Math.floor(Math.random() * 7)]; // a random pic

	for (var c = 0; c < 8; c++) //col 
		for (var r = 0; r < 8 ; r++) //row 
		{
			randomJewel = random[Math.floor(Math.random() * 7)]; //randomJewel
			board[r][c] = randomJewel; //save the board information
			
			$("middle" + r + "" + c + "").insert('<img id="r' + r + 'c' + c + '" src="resources/'+ randomJewel +'"></img>'); //Insert images
			$("middle" + r + "" + c + "").select(":last-child")[0].onclick = clicked;  //attach an onclick handler
		}
	
}

//This function shifts down each jewel if the board is not complete 
//afterwards, it fills the empty spots 
function updateBoard()
{
	//arrays which save the blank spots 
	var blanksR = [];  
	var blanksC = [];
	var index = 0;
	for ( var c = 0; c < 8; c++) //each col 
	{
		for (var r = 0; r < 8; r++) //each row 
		{
			if (board[r][c] == "0") //if it's empty 
			{
				var temp = 0; //for true/false 
				for (var i = r-1; i >= 0; i--)  
				{
					if (board[i][c] != "0") //if it's not empty 
					{
						temp = 1;
					}
				}
				if (temp == 1) //this means it is empty 
				{
					blanksR[index] = r; //fill in 
					blanksC[index] = c;
					index++;
				}
			}
		}
	}
	
	var r = 0;
	var c = 0;
	while (blanksR.length != 0) //if the length is not zero, it means there's still some blank spot 
	{
		//use the same algorithm first to renew the blank arrays 
		blanksR = [];
		blanksC = [];
		index = 0;
		for ( var c = 0; c < 8; c++) // col 
		{
			for (var r = 0; r < 8; r++) //row 
			{
				if (board[r][c] == "0") //if it's empty 
				{
					var temp = 0;
					for (var i = r-1; i >= 0; i--)
					{
						if (board[i][c] != "0")
						{
							temp = 1;
						}
					}
					if (temp == 1)
					{
						blanksR[index] = r; //save the positions 
						blanksC[index] = c;
						index++;
					}
				}
			}
		}
		r = blanksR[0];
		c = blanksC[0];
		for ( var k = r; k > 0; k--)
		{
			board[k][c] = board[k-1][c]; //shift down 
		}
		board[0][c] = "0"; //the top should be zero 
	}
	
	//fill in blanks 
	for (var c = 0; c < 8; c++) //col 
		for (var r = 0; r < 8; r++) //row 
		{
			if ( board[r][c] == "0")
			{
				//fill in random jewels 
				var random = ["blue.png", "green.png", "orange.png", "purple.png", "red.png", "white.png", "yellow.png"];
				var randomJewel  = random[Math.floor(Math.random() * 7)]; // a random pic
				board[r][c] = randomJewel;
			}
		}
	
	//reprint board with blanks 
}

//The function updates the content the player sees on his/her browser 
function printBoard()
{
	for (var c = 0; c < 8; c++) //col 
		for (var r = 0; r < 8 ; r++) //row 
		{
			if (board[r][c] != "0")
			{
				$("middle" + r + "" + c + "").update(''); //make it nothing first and then insert 
				$("middle" + r + "" + c + "").insert('<img id="r' + r + 'c' + c + '" src="resources/'+ board[r][c] +'"></img>');
				$("middle" + r + "" + c + "").select(":last-child")[0].onclick = clicked;
			}
			else  //if it is empty 
			{
				//make it empty 
				$("middle" + r + "" + c + "").update('');
			}
			if ($("middle" + (-r-1) + "" + c + "") != null)
			{
				$("middle" + (-r-1) + "" + c + "").parentNode.removeChild($("middle" + (-r-1) + "" + c + ""));
				//$("middle" + (-r-1) + "" + c + "").update('');
			}
		}
}

//onclick even handler 
function clicked()
{
	var xPos = this.offsetLeft; //positions 
	var yPos = this.offsetTop;
	var div = document.querySelectorAll(".element");
	if (first == 1) //First click 
	{
		//Put highlight 
		if ($("highlight") == null)
			$("box").insert('<div  id = "highlight"><img src ="resources/highlight.png"></img></div>');
		$("highlight").style.position = "absolute";
		$("highlight").style.left = xPos + "px";
		$("highlight").style.top = yPos + "px";
		first = 0; //toggle 
		firstClickObject= this; //save the object, so the program knows what the user first clicked 
		firstClickR = this.id[1]; //first click's positions 
		firstClickC = this.id[3];
	}
	else if (first == 0) //second click 
	{
		first = 1; //toggle 
		
		var secondClickR = this.id[1]; //second  click's positions 
		var secondClickC = this.id[3];
		//alert(firstClickR + " " + firstClickC + " " + secondClickR + " " + secondClickC);
		$("highlight").style.top = "-100px"; //move it off the screen 
		//swap
		//var swap = 0;
		if ((firstClickR == secondClickR && firstClickC-1 == secondClickC)		//Make sure they are next to each other 
			|| (firstClickR == secondClickR && firstClickC == secondClickC-1)  
			|| (firstClickR-1 == secondClickR && firstClickC == secondClickC)  
			|| (firstClickR == secondClickR-1 && firstClickC == secondClickC)  )
		{
			//swapping 
			var temp = board[firstClickR][firstClickC];
			board[firstClickR][firstClickC] = board[secondClickR][secondClickC];
			board[secondClickR][secondClickC] = temp;
			
			if (testCheckBoard() == 0) // if nothing to be removed, swap back 
			{
				var temp = board[firstClickR][firstClickC];
				board[firstClickR][firstClickC] = board[secondClickR][secondClickC];
				board[secondClickR][secondClickC] = temp;
			}
			else //if the move is valid.
			{
				addScore = 0;
				secondClickObject = this;
				setTimeout(swap, 1); //swap them first
				
				/*setTimeout(checkBoardAnimation, 1000); //remove 
				setTimeout(printBoard, 1999); //reupdate the board 
				setTimeout(updateBoardAnimation, 2000); // shift the jewels 
				setTimeout(printBoard, 3498);
				setTimeout(fillInBlanksAnimation, 3499); //put more jewels
				*/
				//setTimeout(printBoard, 4500); //reupdate
				
				setTimeout(checkAgain, 500);
				
				
				/*
				setTimeout(printBoard, 999); //reupdate the board 
				
				setTimeout(checkBoardAnimation, 1000); //remove 
				setTimeout(printBoard, 1999); //reupdate the board 
				setTimeout(updateBoardAnimation, 2000); // shift the jewels 
				setTimeout(fillInBlanks, 3498); //put more jewels
				setTimeout(printBoard, 3499); //reupdate
				score += 100; //score 
				//Check four more times 
				//each time will result 100 more score points 
				
				setTimeout(checkAgain, 3500);
				setTimeout(checkAgain2, 7000);
				setTimeout(checkAgain3, 10500);
				setTimeout(checkAgain4, 14000); 
				*/
				 
				moves++; //move count
				
			}
		}
	}
	
	//setTimeout(checkWin, 3000); //check Win 
	
	
}

//check to see if the user wins 
function checkWin()
{
	$("bottom").innerHTML = "Score: " + score + "  Moves: " + moves; //update the score and moves first 
	if (score >= 2000) //if the player wins 
	{
		$("box").insert("<div id ='win'> You Won!!</div>"); //message 
		for (var r = 0; r < 8; r++)
			for (var c = 0; c < 8; c++)
				$("middle" + r + "" + c + "").select(":last-child")[0].onclick = null; //kill the handler 
	}
}

function fillInBlanksAnimation()
{
	
	//fill in blanks
	blanksCount = [0,0,0,0,0,0,0,0];
	var newJewels = [[],[],[],[],[],[],[],[]];
	for (var c = 0; c < 8; c++)
		for (var r = 7; r >= 0; r--)
		{
			if ( board[r][c] == "0") // if it's empty 
			{
				//fill in random jewels 
				var random = ["blue.png", "green.png", "orange.png", "purple.png", "red.png", "white.png", "yellow.png"];
				var randomJewel  = random[Math.floor(Math.random() * 7)]; // a random pic
				board[r][c] = randomJewel;
				newJewels[c][blanksCount[c]] = randomJewel;
				blanksCount[c]++;
			}
		}
	
	//alert(blanksCount);
	//for (var i = 0; i < 8; i++)
	//	alert(newJewels[i]);
	/*
	var middleTempID = 'middle-10';
	var tempID = "r-1c0";
	$("box").insert('<div  id = '+middleTempID+'><img id = '+tempID+' src ="resources/'+newJewels[0][0]+'"></img></div>');
	$(middleTempID).style.position = "absolute";
	$(middleTempID).style.left = 50 + "px";
	$(middleTempID).style.top = -25 + "px";
	$(middleTempID).style.height = "56.25px";
	$(middleTempID).style.zIndex = "-50";
	$(middleTempID).style.width = "50px";
	*/
	
	
	for (var c = 0; c < 8; c++)
	{ 
		for (var i = 0; i < blanksCount[c]; i++)
		{
			var middleTempID = 'middle'+(-i-1)+''+c+'';
			var tempID = "r"+(-i-1)+"c"+c+"";
			$("box").insert('<div  id = '+middleTempID+'><img id = '+tempID+' src ="resources/'+newJewels[c][i]+'"></img></div>');
			$(middleTempID).style.position = "absolute";
			$(middleTempID).style.left = 50*c + "px";
			$(middleTempID).style.top = -56.26*i + "px";
			$(middleTempID).style.height = "56.25px";
			$(middleTempID).style.zIndex = "1";
			$(middleTempID).style.width = "50px";
			new Effect.Move(tempID, { x: 0, y: 56.25*blanksCount[c], mode: 'absolute'}); //move it 
		}
	}
	/*
	for (var j = 0; j < 8; j++)
	{		
		var number = -1;
		for (var i = 0; i < blanksCount[j]; i++)
		{
		//	$("box").insert("<div id='middle"+number+""+j+"'><img src ='resources/"+newJewels[j][i]+"'></img></div>");
			
			var middleTempID = 'middle'+number+''+j+'';
			var tempID = "r"+number+"c"+j+"";
			$("box").insert('<div  id = '+middleTempID+'><img id = '+tempID+' src ="resources/'+newJewels[j][i]+'"></img></div>');
			$(middleTempID).style.position = "absolute";
			$(middleTempID).style.left = 50*j + "px";
			$(middleTempID).style.top = 56.25*(number+1) + "px";
			$(middleTempID).style.zIndex = "-50";
			$(middleTempID).style.height = "56.25px";
			$(middleTempID).style.width = "50px";
			new Effect.Move(tempID, { x: 0, y: -56.25*number, mode: 'absolute'}); //move it 
			number--;
			
		}
	}*/
 
	
}


//fill in empty spots 
function fillInBlanks()
{
	//fill in blanks
	blanksCount = [0,0,0,0,0,0,0,0];
	var newJewels = ["0","0","0","0","0","0","0","0"];
	for (var c = 0; c < 8; c++)
		for (var r = 0; r < 8; r++)
		{
			if ( board[r][c] == "0") // if it's empty 
			{
				//fill in random jewels 
				var random = ["blue.png", "green.png", "orange.png", "purple.png", "red.png", "white.png", "yellow.png"];
				var randomJewel  = random[Math.floor(Math.random() * 7)]; // a random pic
				board[r][c] = randomJewel;
				newJewels[blanksCount[c]] = randomJewel;
				blanksCount[c]++;
			}
		}
	 
}
//check if things can be removed 
function checkAgain()
{
	if (testCheckBoard() == 1)
	{
		for (var r = 0; r < 8; r++)
			for (var c = 0; c < 8; c++)
				$("middle" + r + "" + c + "").select(":last-child")[0].onclick = null; //kill the handler 
		addScore+=100;
		/*
		setTimeout(checkBoardAnimation, 1000); //remove 
		setTimeout(printBoard, 1999); //reupdate the board 
		setTimeout(updateBoardAnimation, 2000); // shift the jewels 
		setTimeout(printBoard, 3497); //reupdate the board 
		setTimeout(fillInBlanks, 3498); //put more jewels
		setTimeout(printBoard, 3499); //reupdate
		score+=addScore;
		setTimeout(checkAgain, 3500);
		*/
		
		setTimeout(checkBoardAnimation, 1000); //remove 
		setTimeout(printBoard, 1999); //reupdate the board 
		setTimeout(updateBoardAnimation, 2000); // shift the jewels 
		setTimeout(printBoard, 3498);
		setTimeout(fillInBlanksAnimation, 3499); //put more jewels
		
		score+=addScore;
		setTimeout(printBoard, 4999);
		setTimeout(checkAgain, 5000);
		
	}
	$("bottom").innerHTML = "Score: " + score + "  Moves: " + moves;
	checkWin();
}

//check if things can be removed 
function checkAgain2()
{
	if (testCheckBoard() == 1)
	{
		setTimeout(checkBoardAnimation, 1000); //remove 
		setTimeout(printBoard, 1999); //reupdate the board 
		setTimeout(updateBoardAnimation, 2000); // shift the jewels 
		setTimeout(fillInBlanks, 3498); //put more jewels
		setTimeout(printBoard, 3499); //reupdate
		score+=300;
	}
}

//check if things can be removed 
function checkAgain3()
{
	if (testCheckBoard() == 1)
	{
		setTimeout(checkBoardAnimation, 1000); //remove 
		setTimeout(printBoard, 1999); //reupdate the board 
		setTimeout(updateBoardAnimation, 2000); // shift the jewels 
		setTimeout(fillInBlanks, 3498); //put more jewels
		setTimeout(printBoard, 3499); //reupdate
		score+=400;
	}
}

//check if things can be removed 
function checkAgain4()
{
	if (testCheckBoard() == 1)
	{
		setTimeout(checkBoardAnimation, 1000); //remove 
		setTimeout(printBoard, 1999); //reupdate the board 
		setTimeout(updateBoardAnimation, 2000); // shift the jewels 
		setTimeout(fillInBlanks, 3498); //put more jewels
		setTimeout(printBoard, 3499); //reupdate
		score+=400;
	}
}

//The  following function implements swap animation 
function swap()
{
	//swap animation 
	var offsetX;
	var offsetY; 
	//Calculate the displacement it should take 
	offsetX = firstClickObject.offsetLeft - secondClickObject.offsetLeft ;
	offsetY = firstClickObject.offsetTop - secondClickObject.offsetTop ;
	new Effect.Move(secondClickObject, { x: offsetX, y: offsetY, mode: 'relative'}); //move it 
	new Effect.Move(firstClickObject, { x: -offsetX, y: -offsetY, mode: 'relative'}); //move it 
	//new Effect.Move(secondClickObject.id, { x: 0, y: 0, mode: 'fixed'});
	//new Effect.Move(firstClickObject.id, { x: 0, y: 0, mode: 'fixed'});
				
				
	//swap ID
	var temp = secondClickObject.id;
	secondClickObject.id = firstClickObject.id
	firstClickObject.id = temp;
}

//THe following function implements removal animation 
function checkBoardAnimation()
{
	//vertical 
	for (var c = 0; c < 8; c++)
		for (var r = 0; r < 6; r++)
		{
			if ( board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c]) //removing 
			{
				$("r" + r + "c" + c + "").fade({delay:0.5}); //disappear 
				$("r" + (r+1) + "c" + c + "").fade({delay:0.5}); //disappear 
				$("r" + (r+2) + "c" + c + "").fade({delay:0.5}); //disappear 
				board[r][c] = "0"; //update the board information 
				board[r+1][c] = "0"; //update the board information
				board[r+2][c] = "0"; //update the board information
			}
		}
	
	//horizontal 
	for ( var r = 0; r < 8; r++)
		for (var c = 0; c < 6; c++)
		{
			if ( board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2]) //removing 
			{
				$("r" + r + "c" + c + "").fade({delay:0.5}); //disappear 
				$("r" + r + "c" + (c+1) + "").fade({delay:0.5}); //disappear 
				$("r" + r + "c" + (c+2) + "").fade({delay:0.5}); //disappear 
				board[r][c] = "0"; //update the board information
				board[r][c+1] = "0"; //update the board information
				board[r][c+2] = "0"; //update the board information
			}
		}
}

//The function implements the animation of shifting 
function updateBoardAnimation()
{
	var blanksR = []; //save blank spots 
	var blanksC = [];
	var index = 0;
	for ( var c = 0; c < 8; c++)
	{
		for (var r = 0; r < 8; r++)
		{
			if (board[r][c] == "0")
			{
				var temp = 0;
				for (var i = r-1; i >= 0; i--)
				{
					if (board[i][c] != "0")
					{
						temp = 1;
					}
				}
				if (temp == 1)
				{
					blanksR[index] = r;
					blanksC[index] = c;
					index++;
				}
			}
		}
	}
	
	var r = 0;
	var c = 0;
	//var time = 0;
	
	var colMoveCounts = [0,0,0,0,0,0,0,0]; //This tells the animation function how many times it should move the jewels 
	
	var startingRow = [0,0,0,0,0,0,0,0]; //The very bottom (starting position) of the shifting series of jewels 
	
	while (blanksR.length != 0)
	{
		r = blanksR[0]; //first blank row
		c = blanksC[0]; //first blank col 
		
		for (var count = 0; count < 8; count++)
		{
			if (c == count) // if there's an empty spot on this column 
			{
				colMoveCounts[count]++; //keep track of how many times to move 
				if (startingRow[count] == 0) //if this is the first 
					for ( var k = r; k > 0; k--)
					{
						//time++;
						if (board[k][c] == "0" && board[k-1][c] !=  "0" )
						{
							startingRow[count] = k-1;
							break; //break the loop because this will be the starting position 
						} 
					}
			}
		}
		
		
		for ( var k = r; k > 0; k--)
		{
			//time++;
			
			board[k][c] = board[k-1][c];
			
				//new Effect.Move("r"+(k-1)+"c"+c+"", { x: 0, y: 56.25, mode: 'fixed', delay: 0 }); //-(k-(r+1))+time
			
			//$("r"+k+"c"+c).setAttribute("id","r"+(k-1)+"c"+c);
		}
		board[0][c] = "0";
		
		//Reupdate blanksR and blanksC
		blanksR = [];
		blanksC = [];
		index = 0;
		for ( var c = 0; c < 8; c++)
		{
			for (var r = 0; r < 8; r++)
			{
				if (board[r][c] == "0")
				{
					var temp = 0;
					for (var i = r-1; i >= 0; i--)
					{
						if (board[i][c] != "0")
						{
							temp = 1;
						}
					}
					if (temp == 1)
					{
						blanksR[index] = r;
						blanksC[index] = c;
						index++;
					}
				}
			}
		}
	}
	//alert(startingRow);
	//alert(colMoveCounts);
	
	for (var c = 0; c < startingRow.length; c++)
	{
		for ( var r = startingRow[c]; r >= 0; r--)
			new Effect.Move("r"+r+"c"+c+"", { x: 0, y: 56.25*colMoveCounts[c], mode: 'relative', delay: 0 }); //-(k-(r+1))+time
	}
	
	
}

//THe following function tests to see if removals are available
//If return 0, not available
//If return 1, available 
function testCheckBoard()
{
	var removed = 0;
	
	for (var c = 0; c < 8; c++)
		for (var r = 0; r < 6; r++)
			if ( board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c]) //CHecking 
				removed = 1;
	
	for ( var r = 0; r < 8; r++)
		for (var c = 0; c < 6; c++)
			if ( board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2])  //CHecking 
				removed = 1;
	
	return removed;
}

function checkBoard()
{
	var removed = 0;
	//vertical 
	for (var c = 0; c < 8; c++)
		for (var r = 0; r < 6; r++)
		{
			if ( board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c]) //removing 
			{
				$("r" + r + "c" + c + "").remove();
				$("r" + (r+1) + "c" + c + "").remove();
				$("r" + (r+2) + "c" + c + "").remove();
				board[r][c] = "0";
				board[r+1][c] = "0";
				board[r+2][c] = "0";
				removed = 1;
			}
		}
	
	for ( var r = 0; r < 8; r++)
		for (var c = 0; c < 6; c++)
		{
			if ( board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2]) //removing 
			{
				$("r" + r + "c" + c + "").remove();
				$("r" + r + "c" + (c+1) + "").remove();
				$("r" + r + "c" + (c+2) + "").remove();
				board[r][c] = "0";
				board[r][c+1] = "0";
				board[r][c+2] = "0";
				removed = 1;
			}
		}
	return removed;
}


