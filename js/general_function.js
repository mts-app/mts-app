//Get Query String parameter
function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

//redirect to other user's profile
function other_user_profile(userid){           				
    window.location='profile.html?user_id='+userid;             
}

//Confirm Friend Request
function confirm_request(user_name){			
    
    var confirm_request = confirm("You are about to add "+ user_name +" to your friends. If you add this person to your friends, they will be able to see your profile (even if it's viewable by friends only). Are you sure you want to add test user to your friends?"); 
    
    if( confirm_request == true ) {
        $.ajax({
            type: "POST",
            url: "http://www.braggn.com/mobile/mobile_user_friends_manage.php",
            data: {
              task: 'add_do',
              friend_type: 'friend',
              user: user_name	  
            },
            success: function(result) {					
                if (result == '1'){
                    alert("Your request for friendship with "+user_name+" has been sent successfully.");
                    location.reload();
                }				  
            }
         });
     }else {
       return false;
    }
}

//Reject Incoming Friend Request
	   function cancel_request(username){			
			
			var confirm_request = confirm(" Are you sure you want to reject " +username+"'s friendship request?"); 
			
			if( confirm_request == true ) {
				$.ajax({
					type: "POST",
					url: "http://www.braggn.com/mobile/mobile_user_friends_manage.php",
					data: {
					  task: 'reject_do',					 
					  user: username	  
					},
					success: function(result) {	
						if (result == '1'){
							alert(username+"'s request has been rejected successfully.");
							location.reload();
						}				  
					}
				 });
			 }else {
			   return false;
			}
	   }

//Cancel Outgoing Friend Request
	   function cancel_outgoing_request(username){			
			
			var confirm_request = confirm("You are waiting for a friendship confirmation from "+username+". Are you sure you want to cancel your request for friendship with "+username+"?"); 
			
			if( confirm_request == true ) {
				$.ajax({
					type: "POST",
					url: "http://www.braggn.com/mobile/mobile_user_friends_manage.php",
					data: {
					  task: 'cancel_do',					 
					  user: username	  
					},
					success: function(result) {	
						if (result == '1'){
							alert("Your request for friendship with "+username+" has been canceled successfully.");
							location.reload();
						}				  
					}
				 });
			 }else {
			   return false;
			}
	   }

//logout user       
function logout(){ 
  // var user_id =  $('#userid').val();
      
   $.ajax({ 
        type: 'POST',
        url: 'http://www.braggn.com/mobile/mobile_logout.php',
     //  data: {
             //     userid: user_id
                  
            // },
       success:function (data) {
          
           if(data == 1){
               window.localStorage.removeItem("session_userid");
               window.localStorage.removeItem("session_username");
               alert('You have been logged out successfully.');
                window.location= "index.html";                       
           }
        
        },
       error:function(){                   
           window.location= "login.html";
           return false;
       },
    });                  
  }
//Time ago function
function _format_date(timestamp) {
  var difference_in_seconds = (Math.round((new Date()).getTime() / 1000)) - timestamp,
      current_date = new Date(timestamp * 1000), minutes, hours,
      months = new Array(
        'January','February','March','April','May',
        'June','July','August','September','October',
        'November','December');
  
  if(difference_in_seconds < 60) {                                  
    return difference_in_seconds + " second" + _plural(difference_in_seconds) + " ago";
  } else if (difference_in_seconds < 60*60) {
    minutes = Math.floor(difference_in_seconds/60);
    return minutes + " minute" + _plural(minutes) + " ago";
  } else if (difference_in_seconds < 60*60*24) {
    hours = Math.floor(difference_in_seconds/60/60);
    return hours + " hour" + _plural(hours) + " ago";
  } else if (difference_in_seconds > 60*60*24){
    if(current_date.getYear() !== new Date().getYear()) 
      return current_date.getDay() + " " + months[current_date.getMonth()].substr(0,3) + " " + _fourdigits(current_date.getYear());
    
    return current_date.getDay() + " " + months[current_date.getMonth()].substr(0,3);
  }
  
  return difference_in_seconds;
  
  function _fourdigits(number)	{
        return (number < 1000) ? number + 1900 : number;}

  function _plural(number) {
    if(parseInt(number) === 1) {
      return "";
    }
    return "s";
  }
}

//POP WINDOW FOR EDITING MEDIA
function popup(url) 
        {
         var width  = 100;
         var height = 100;
         var left   = (screen.width  - width)/2;
         var top    = (screen.height - height)/2;
         var params = 'width='+width+', height='+height;
          params += ', top='+top+', left='+left;
         params += ', directories=no';
         params += ', location=no';
         params += ', menubar=no';
         params += ', resizable=no';
         params += ', scrollbars=no';
         params += ', status=no';
         params += ', toolbar=no';
         newwin=window.open(url,'Edit Media', params);
         if (window.focus) {newwin.focus()}
         return false;
        }


 