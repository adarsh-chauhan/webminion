var code = null;
var token = null;
var roomname = [];
var roomid = [];
var target = null;
var message = null;


/* START parses the browser URL which has the authcode*/
function getcode(key)
{
    var tmp = location.search;
    var reg = RegExp(key + "=([^&#]*)");
    var result = reg.exec(tmp);
    code=result[1];
    return code;
}
/* END */


/* START Gets the token in exchange of auth code */
function gettoken()
{
    var cid="C9b276180acf7de3338a9b7c0027b7c2be33d0f0ea174cda97c29282841d593b3";
    var cret="a9fac1f40059023d4a8116bb67f42d15aaaae1b5a361273a7ee299754f7f1a00";
 $.ajax({
        type:"POST",
        datatype:"json",
        url:"https://api.ciscospark.com/v1/access_token",
  		'Content-Type':"application/x-www-form-urlencoded:charset=UTF-8",
        data:{
          grant_type:"authorization_code",
          client_id:cid,
          client_secret:cret,
          code:code,
          redirect_uri:"http://webminion.ultimatefreehost.in/webminion.html"
        },
        success: function(response){
        token = response.access_token;
        /*alert(token);*/ /*For troublshooting*/
        getrooms();
 }
 });
    
}
/* END */


/* START fetches the room of the user */
function getrooms()
{
    roomname = [];
    roomid = [];
    var az = "Bearer " + token;
 $.ajax({
        method:"GET",
        url:"https://api.ciscospark.com/hydra/api/v1/rooms",
        headers:
        {
                Authorization: az,
        },
        success:function(response){
            for(var i=0;i<=response.items.length;i++)
            {
                roomname[i]=response.items[i].title;
                roomid[i]=response.items[i].id;
            }
        }
 
 });
  
}
/* END */



/* START sends message to the target room*/
function sendtext()
{
    var az = "Bearer " + token;
$.ajax({
    type:"POST",
    url:"https://api.ciscospark.com/v1/messages",
    headers:{
        authorization: az,
    },
    datatype:"json",
    data:
    {
        
          "roomId":roomid[target],
          "text":message,
    
    },
    success:function()
    {
    $("#console").append("You: " + message + "</br></br>");    
    }
    
});
  }

/* END */





function getmessages(target)
{
    var sender= [];
    var tmpmessage = [];
    var date = [];
    var az = "Bearer " + token;
$.ajax({
    type:"get",
    url:"https://api.ciscospark.com/v1/messages",
    headers:{
        authorization: az,
    },
    datatype:"json",
    data:
    {
        
          "roomId":roomid[target],
    },
    success:function(response)
    {
    $("#console").append("HISTORY: </br><hr></br>");  
    for (i=response.items.length-1;i>=0;i--)
    {
    sender[i] = response.items[i].personEmail;
    tmpmessage[i] = response.items[i].text;
    date[i] = response.items[i].created;
    $("#console").append(sender[i] + " : " + tmpmessage[i] + "   <em>Date/Time</em>: " + date[i] + "</br>"); 
    }

    }
    
});
  }

/* END */