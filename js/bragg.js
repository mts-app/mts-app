//used for update bragg and comments for an image and media
function update_bragg(media_id) {		
	var bragg_type = document.getElementById("bragg_value_"+media_id).value;
	
	jQuery.ajax({
		url: 'http://www.braggn.com/braggs.php',
		type: 'POST',
		data: {
		media_id: media_id,
		bragg_type : bragg_type
		},
		
		success:function (data) {			
			if (data == '1')
			{ 
				jQuery("#media_"+media_id)                   
				//.html("Unbragg")
				.addClass("timeago")
                .removeClass("description");
				jQuery("#bragg_value_"+media_id).attr("value","Unbragg");
				
			}
			else if(data == '2')
			{ 
				jQuery("#media_"+media_id)                   
				//.html("Bragg")
                .addClass("description")
				.removeClass("timeago");
				jQuery("#bragg_value_"+media_id).attr("value","bragg");					
			}
			update_total_brags(media_id);
		}
	});
 };

function update_total_brags(mediaid){
	
	jQuery.ajax({
	url: 'http://www.braggn.com/update_total_braggs.php',
	type: 'POST',			
	data: {
		media_id: mediaid			
	},

	success:function (data) {
			 if(data>0 && data != ''){
				jQuery("#total_braggs_"+mediaid).html(data + " bragg(s) / ")
			 }else{
				jQuery("#total_braggs_"+mediaid).html("No braggs / ")
			 }
	   }
	});
};

//show media comment box
function insert_media_comments(media_id){
	jQuery("#edit_comment_"+media_id).val("");	
	jQuery("#edit_comment_"+media_id).show();
	jQuery("#comment_"+media_id).attr("value","doComment");
	jQuery(document).mouseup(function (e)
			{
				var container = jQuery('#edit_comment_'+media_id);
				
				if (!container.is(e.target) // if the target of the click isn't the container...
					&& container.has(e.target).length === 0) // ... nor a descendant of the container
				{
					container.hide();
				}
			});	
}
//media comments
function insert_comments(mediaid,ctype){  
    
	   var media_comments = jQuery("#edit_comment_"+mediaid).val();	       
		
		jQuery.ajax({
		url: 'http://www.braggn.com/braggs.php',
		type: 'POST',
		data: {
		media_id: mediaid,
		is_comment : 'doComment',
		media_comments : media_comments
		},
				
		success:function (data) {		
		var ajax_data = jQuery.parseJSON(data);                 
			
		if(ajax_data.comment_id != null || ajax_data.length){
            
            var profile_image_path = "http://www.braggn.com/uploads_user/1000/"+ajax_data.user_id+"/"+ajax_data.user_photo;
          
		   jQuery("#comment_details").append('<div class="comment">  <a class="avatar"><img src="'+profile_image_path+'"></a><div class="content"> <a class="author">'+ajax_data.user_name+'</a> <div class="metadata"><span class="date">Few seconds ago</span></div><div class="text" contentEditable="false" id="comment_'+ajax_data.comment_id+'">'+ajax_data.user_comment+'</div><div class="actions" style="font-size:0.9em;margin:0 12.3em 0 0;"><a class="reply" id="comment_edit_'+ajax_data.comment_id+'" onclick="update_comments('+ajax_data.comment_id+');">Edit</a><a class="delete" id="comment_delete_'+ajax_data.comment_id+'" onclick="deleteComment('+ajax_data.comment_id+','+mediaid+');" style="color: rgba(0, 0, 0, 0.3);display:inline-block">Delete</a></div></div></div>')
           
            jQuery("#edit_comment_"+mediaid).val("");
			
		}
	   },
	   complete: function() {
           console.log('DONE');
       } 
	  });
}

function appendMediacomments(mediaCommentid,mediaid,ctype){
	jQuery.ajax({
		url: 'http://www.braggn.com/appendComment.php',
		type: 'POST',
		data: {
		mediaCommentid: mediaCommentid,
		mediaid: mediaid,
		ctype: ctype
		},
		success:function (data) {
			if(ctype==1) {				
				jQuery("#comment_list").show(); //for activity page
				jQuery("#comments_"+mediaid).append(data);
			}
			if(ctype==2) { // for showfile page
				jQuery("#comment_result_add").prepend(data);
			}			
		}
	});
}

//update media comments
function update_comments(commentid){
    
     var html = jQuery("#comment_edit_"+commentid).html();
     if(html == 'Edit'){
		 jQuery("#comment_"+commentid).attr("contentEditable","true");
		 jQuery("#comment_"+commentid).css({"border": "1px solid darkgray","width":"200px","overflow":"hidden",  "padding": "3px"});
		 jQuery("#comment_edit_"+commentid).html('Save');
		 jQuery("#comment_delete_"+commentid).html('Cancel');
	 }else if(html == 'Save'){    
    
        var edit_comments = jQuery("#comment_"+commentid).val();
		jQuery.ajax({
		url: 'http://www.braggn.com/braggs.php',
		type: 'POST',
		data: {
		commentId: commentid,
		edit_comment : 'editcomments',		
		edit_comments : edit_comments		
		},
				
		success:function (data) { 
		  jQuery("#comment_"+commentid).attr("contentEditable","false");
		  jQuery("#comment_"+commentid).removeAttr("style");
		  jQuery("#comment_edit_"+commentid).html('Edit');
          jQuery("#comment_delete_"+commentid).html('Delete');    
		  var ajax_data = jQuery.parseJSON(data);
			if(ajax_data.media_comments != null || ajax_data.length){
				jQuery("#comment_"+commentid)                   
					.html(ajax_data.media_comments)
			}
	   }		
	  });	 
	
     }     
}
	
//delete media
function deleteMedia(mediaId,back_url){
    var delete_confirm = confirm("Are you sure you want to delete this media?"); 
    if( delete_confirm == true ) {
        jQuery.ajax({
            type: "POST",
            url: "http://www.braggn.com/deletemedia.php",
            data: {
              mediaid: mediaId	  
            },
            success: function(data) {				
                if (data == '1'){
                    window.location=back_url;
                }			  
            }
         });
     }else {
       return false;
    }
}	

//delete Comment
function deleteComment(commentId,mediaId){
    var html = jQuery("#comment_delete_"+commentId).html();
    if(html == 'Cancel'){
		jQuery("#comment_delete_"+commentId).html('Delete');
		jQuery("#comment_edit_"+commentId).html('Edit');
        jQuery("#comment_"+commentId).attr("contentEditable","false");
		jQuery("#comment_"+commentId).removeAttr("style");
		return false;
	}else if(html == 'Delete'){	
        var delete_confirm = confirm("Are you sure you want to delete this comment?"); 
        if( delete_confirm == true ) {
            jQuery.ajax({
                type: "POST",
                url: "http://www.braggn.com/deletemedia.php",
                data: {
                  comment_Id: commentId,
                  comment_media_id: mediaId			  
                },
                success: function(data) {                    
                    if (data == '1'){
                        window.location.reload();
                    }			 
                }
             });
         }else {
           return false;
        }
    }
}

// show menu for comment to delete or edit 
function showmenu(comment_id) {		
		
		jQuery('#show_menu_'+comment_id).show();
      
		jQuery(document).mouseup(function (e)
		{
			var container = jQuery('#show_menu_'+comment_id);
			
			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				container.hide();
			}
		});
	}
	
function openMediacomments(mediaId,totalcomments,ptype){
	
	//for profile.tpl
	jQuery("#more_view").hide();
	jQuery("#comment_result_show_"+mediaId).html("<span class='viewComments'><img  src='./images/ajax-loader3.gif' /> loading... </span>");
	
	//for showfile.tpl
	jQuery("#show_more_result").hide();
	jQuery("#comment_result_showfile").html("<span class='viewComments'><img  src='../images/ajax-loader3.gif' /> loading... </span>");

	jQuery.ajax({
		url: 'http://www.braggn.com/meadicomments.php',
		type: 'POST',
		data: {
		mediaId: mediaId,
		totalcomments: totalcomments,
		ptype: ptype
		},
		success:function (data) {
			if(ptype==1) {
				jQuery("#comment_result_show_"+mediaId).hide();
				jQuery("#comments_"+mediaId).prepend(data);
			} else {
				jQuery("#comment_result_showfile").hide(); // for showfile page
				jQuery("#comment_result_show").hide(); // for profile page
				jQuery("#comment_result_add").append(data);
			}
		}
	});
}



jQuery(document).ready(function(){

	jQuery("#editmedia").click(function(){
        jQuery("#editing_media").show();       
   });
   
   jQuery("#edit_cancel").click(function(){
        jQuery("#editing_media").hide();       
   });
   
   // to show users list while click on bragged people link
   jQuery(".braggs_comments").click(function(){
	  
	   var bragg_id = jQuery(this).attr('id');	 
	   var array = bragg_id.split('_');
	   var mediaid = array[2];

		jQuery(document).mouseup(function (e)
		{
			var container = jQuery('#user_list_totalbraggs_'+mediaid);
			
			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				container.hide();
			}
		});
	   
	   jQuery.ajax({
			url: 'braggs.php',
			dataType: 'json',
			type: 'POST',			
			data: {
				total_braggs_user : 'http://www.braggn.com/total_braggs_user',
				total_braggs_mediaid: mediaid			
			},			
			success: function(data) {				
				jQuery('#user_list_totalbraggs_'+mediaid).html("");
				jQuery.each(data, function(i, v) {					
					jQuery('#user_list_totalbraggs_'+mediaid).show();					
					jQuery('#user_list_totalbraggs_'+mediaid)
					.append("<a href=user_profile/"+v+">"+v+"</a><br>"); 
				});
			}			
			
		});
      
    });
	
		//for follow me button
		jQuery(".btn_follower").click(function()
		{		
			var user_id = jQuery(this).attr('id');		
			var array = user_id.split('_');
			var userid = array[2];
			var flag_follow = jQuery("#followed_user").val();			
			
			 jQuery.ajax({
			   type: "POST",
			   url: "http://www.braggn.com/follow_user.php",
			   data: {				
				 following_user_id: userid,
				 flag: flag_follow
				},
			   success: function(result) {
				
				if(result == 1){
					jQuery("#followed_user").attr('value','followed');
					jQuery('#follow_user_'+userid)
					.html("Following");
				}else{
					jQuery("#followed_user").attr('value','follow');
					jQuery('#follow_user_'+userid)
					.html("Follow Me");
				}
				
			}	
				
		  });
		});
		
		
		
		//Update media views		
		jQuery(".update_views").click(function()
		{		
			var media_id = jQuery(this).attr('id');			
			var media_array = media_id.split('_');
			var mediaid = media_array[2];						
			
			 jQuery.ajax({
			   type: "POST",
			   url: "http://www.braggn.com/update_views.php",
			   data: {				
				 mediaId: mediaid				 
				},
			   success: function(result) {				
					if(result == 1){
						return true;
					}				
				}	
				
			});
		});
		
		// for competitions entered on profile page
		jQuery("#view_more_comp").click(function()
		{		
			jQuery("#list_comp_entered").hide();
			jQuery("#more_item_comp_entered").show();
			
		});
		
		// for competitions joined section
		jQuery("#view_more_comp_joined").click(function()
		{		
			jQuery("#list_comp_joined").hide();
			jQuery("#more_item_comp_joined").show();
			
		});
		
		// for star on profile page
		jQuery('#star').hover(function(){
			jQuery("#star_braggs").toggle();
		});
		
		// Braggn Locker on profile page
		jQuery("#lockers").click(function(){		
			jQuery("#lockers").hide();
			jQuery("#openedLocker").show();
			jQuery("#show_star").show();			
		});
		jQuery("#openedLocker,#show_star").click(function(){		
			jQuery("#openedLocker").hide();
			jQuery("#show_star").hide();
			jQuery("#lockers").show();
						
		});
		
		//Join competition 
		jQuery("#compid").change(function (){ //change event for select
			
			 jQuery.ajax({  //ajax call
				type: "POST",      
				url: "http://www.braggn.com/users_entered_competition.php", 
			    data:{
						select_compid:  jQuery("#compid option:selected").val() //data to be send
					},  
				success: function(data) { 
					if(data>=1){
						jQuery("#join_comp").hide();
						jQuery("#error_msg").show();
						jQuery("#error_msg").html("<img src='./images/error.gif' border='0' class='icon'> You have already been joined this competion." ); //this line will put the response to item with id `#txtHint`.
					}else{
						jQuery("#error_msg").hide();
						jQuery("#error_msg").html("");
					}
				}
			});
		});

 });



		
