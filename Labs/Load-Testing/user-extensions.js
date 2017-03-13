Selenium.prototype.testdata = null;

Selenium.prototype.doLoadTestData = function(testName) {
     testdata = new xmlTestData();
	 testdata.load(testName); 
	 
	
};


function xmlTestData() {
    this.xmlDoc = null;
    this.testdata = null;
    this.testRepeatCount= 0;
    this.dataFilePath = "file:///Users/college/gitProjects/Software-Testing/Labs/Load-Testing/TestData.xml"; 
	this.testName=null;

}


xmlTestData.prototype.load = function(testName) {
    
          if(this.xmlDoc == null)
          this.xmlDoc=loadXMLDoc(this.dataFilePath);

		  this.testName=testName;
		  this.testRepeatCount= 0;
         
         
}


xmlTestData.prototype.EOF = function() {

	 testTag = this.xmlDoc.getElementsByTagName(this.testName);
	// alert(this.testName + " -- " +this.testRepeatCount);
	// alert(this.testName);
	// alert(testTag.length);

	 // test with no test 
	 if(testTag.length==0){
		 if(this.testRepeatCount == -1){
			return true; // exit after execting once
		 }else{
		    this.testRepeatCount=-1;
			return false; // atleast execute once
		 }
	 }
	 


          testDataTag = testTag[0].getElementsByTagName("TestData");
        //  alert(this.testRepeatCount + " --- " +testDataTag.length);
          if( this.testRepeatCount < testDataTag.length ){

			dataNodes = testDataTag[this.testRepeatCount].childNodes;
          
			 var i =0;
			 for(i=0;i<dataNodes.length;i++) {
				if(dataNodes[i].nodeName != "#text"){
					dataTag=testDataTag[this.testRepeatCount].getElementsByTagName(dataNodes[i].nodeName)
				//	alert(dataNodes[i].nodeName + " -- " +dataTag[0].childNodes[0].nodeValue);
  			 	    storedVars[dataNodes[i].nodeName]=dataTag[0].childNodes[0].nodeValue;
				}
			 }

				this.testRepeatCount=this.testRepeatCount+1;
				return false;
			 }else{
				return true;
			 }

}



function loadXMLDoc(dname) 
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",dname,false);
xhttp.send();
return xhttp.responseXML;
}

// A port of the FlowControl extension for use with Selenium IDE
// (Firefox Plugin). Open the Selenium IDE and select the Options 
// menu item. Select Options and add the full path and filename
// of this file in the Selenium Core Extensions (user-extensions.js)
// field.  Close and re-open the IDE to begin using it.  For more
// information see the following URL:
// http://51elliot.blogspot.com/2008/02/selenium-ide-goto.html

var gotoLabels= {};
var whileLabels = {}; 

// overload the oritinal Selenium reset function
Selenium.prototype.reset = function() {
   // reset the labels
   this.initialiseLabels();
   // proceed with original reset code
   this.defaultTimeout = Selenium.DEFAULT_TIMEOUT; 
   this.browserbot.selectWindow("null"); 
   this.browserbot.resetPopups();
}

Selenium.prototype.initialiseLabels = function()
{
    gotoLabels  = {};
    whileLabels = { ends: {}, whiles: {} };
    var command_rows = [];
    var numCommands = testCase.commands.length;
    for (var i = 0; i < numCommands; ++i) {
       var x = testCase.commands[i];
       command_rows.push(x);
    }    
    var cycles = [];
    for( var i = 0; i < command_rows.length; i++ ) {
        if (command_rows[i].type == 'command')
        switch( command_rows[i].command.toLowerCase() ) {
            case "label":
                gotoLabels[ command_rows[i].target ] = i;
                break;
            case "while":
            case "endwhile":
                cycles.push( [command_rows[i].command.toLowerCase(), i] )
                break;    
        }
    }
    var i = 0;    
    while( cycles.length ) {
        if( i >= cycles.length ) {
            throw new Error( "non-matching while/endWhile found" );
        }
        switch( cycles[i][0] ) {
            case "while":
                 if(    ( i+1 < cycles.length )  && ( "endwhile" == cycles[i+1][0] ) ) {
                     // pair found
                     whileLabels.ends[ cycles[i+1][1] ] = cycles[i][1];
                     whileLabels.whiles[ cycles[i][1] ] = cycles[i+1][1];
                     cycles.splice( i, 2 );
                     i = 0;
                 } else ++i;
                 break;
             case "endwhile":
                 ++i;
                 break;
        }
    } 
}    

Selenium.prototype.continueFromRow = function( row_num ) 
{
    if(row_num == undefined || row_num == null || row_num < 0) {
        throw new Error( "Invalid row_num specified." );
    }
    testCase.debugContext.debugIndex = row_num;
}

// do nothing. simple label
Selenium.prototype.doLabel      = function(){};

Selenium.prototype.doGotolabel  = function( label ) 
{
    if( undefined == gotoLabels[label] ) {
        throw new Error( "Specified label '" + label + "' is not found." );
    }
    this.continueFromRow( gotoLabels[ label ] );
};
    
Selenium.prototype.doGoto = Selenium.prototype.doGotolabel;

Selenium.prototype.doGotoIf = function( condition, label ) 
{
    if( eval(condition) ) this.doGotolabel( label );
}

Selenium.prototype.doWhile = function( condition ) 
{
    if( !eval(condition) ) {
        var last_row = testCase.debugContext.debugIndex;
        var end_while_row = whileLabels.whiles[ last_row ];
        if( undefined == end_while_row ) throw new Error( "Corresponding 'endWhile' is not found." );
        this.continueFromRow( end_while_row );
    }
}

Selenium.prototype.doEndWhile = function() 
{
    var last_row = testCase.debugContext.debugIndex;
    var while_row = whileLabels.ends[ last_row ] - 1;
    if( undefined == while_row ) throw new Error( "Corresponding 'While' is not found." );
    this.continueFromRow( while_row );
}



/*

Selenium.prototype.doGenerateRandomEmail = function(locator){

alert("Starting to generate a random email id");
//using selenium object
selenium.doType(locator,"naomihurley24@gmail.com");

}*/


Selenium.prototype.doPrintName = function()
	{
alert("Subject Name is Selenium");
	}

 
 Selenium.prototype.doGenerateRandomEmail = function(locator){
 
 //alert("Starting to generate a random email id");
 
 
 var allowedChars = "abcdefghijklmnopqrstuvwxyz";    
 var stringLength=8;	
 var randomstring='';	
 
 for(var i=0;i<stringLength;i++){	    
  var rnum=Math.floor(Math.random() * allowedChars.length);		
  randomstring+= allowedChars.substring(rnum,rnum+1);
 
                              }		
 //append a domain name
  randomstring+="@gmail.com"
 
 selenium.doType(locator,randomstring);
 }
 
Selenium.prototype.doCalculateSum = function()

{
//alert("infunc");

var text=storedVars['addition'];
//2+4=
var arr=text.split(" ");
//alert([0]);//2
//alert([1]);//+
//alert([2]);//4
//alert([3]);//=
var sum =new Number(arr[0])+ new Number(arr[2]);
//alert("The sum is"+sum);
selenium.doType("//*[@id='mathuserans2']",sum);
}

