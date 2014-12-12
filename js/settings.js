$( document ).ready(function() {   
        $.ajax({ 
            type: 'POST',
            url: 'http://www.braggn.com/mobile/mobile_settings.php',              
            dataType:'json',
            data: {
                //other_user_id : other_userid
            },
              
            success:function (response) {
               
                // show owner details    
                $('.edit_username').html(response.user_info.user_username);
                $('.edit_firstname').html(response.user_info.user_fname);
                $('.edit_lastname').html(response.user_info.user_lname);
                $('.edit_email').html(response.user_info.user_email);
                $('.update_password').html(response.user_info.password_update_time);
                $('.delete_account').attr('id',response.user_info.user_id);
                if(response.user_info.user_theme_id == 1){
                    $("input[name='edit_profile'][value='1']").attr("checked", "checked");
                }else{
                    $("input[name='edit_profile'][value='0']").attr("checked", "checked");
                }
                $('input[name=edit_profile]').attr("disabled",true);
                $('#profile_avatar').attr('src',response.user_info.user_photo);
                  
            },
             error: function (){
                window.location= "index.html";
                return false;
             }
        });

    // Show editable div for settings page
$(".settingsEdit").click(function(){
    
    var edit_id = $(this).attr('id');		
    var new_val = edit_id.split('_');
    
    //Limit the entered text by 30 characters except email			
        max = 30;
                    
        $('.'+edit_id).keyup(function(e){ check_charcount(edit_id, max, e); });
        $('.'+edit_id).keydown(function(e){ check_charcount(edit_id, max, e); });

        function check_charcount(edit_id, max, e)
        {   
            if((e.which != 8 && e.which != 27 && e.which != 13)&& edit_id != 'edit_email' && $('.'+edit_id).text().length > max)
            {				   
                alert('You reached the maximum limit of characters!');
                e.preventDefault();
                return false;
            }
        }//End Limit the text by 30 characters
    
    //store value in case of escape	or failure
    var original_value = $('.'+edit_id).html();
        
    // Check if it is click for edit first else for update field
    if(new_val[0] == 'edit'){
                    
        $('#'+edit_id).html("Update");
        $(this).attr('id','update_'+new_val[1]);
        $('.'+edit_id).css("border","solid");
        $('.'+edit_id).attr("contentEditable","true");
        $('.'+edit_id).after( "<a class='timeago' onclick='cancel_editing(\""+edit_id+"\",\""+new_val[1]+"\",\""+original_value+"\")'>Cancel</a>");
        //For profile privacy option
        if(edit_id == 'edit_profile'){
            $('input[name=edit_profile]').attr("disabled",false);
            $('#profile_edit').after("<a class='timeago' onclick='cancel_editing(\""+edit_id+"\",\""+new_val[1]+"\",\""+original_value+"\")'>Cancel</a>");
        }
        if(edit_id == 'edit_password'){
            $('.update_password').hide();
            $('#updated_password').show();
            $('#updated_password').after( "<br><a class='timeago' onclick='cancel_editing(\""+edit_id+"\",\""+new_val[1]+"\",\""+original_value+"\")'>Cancel</a>" );
        }
        
        
    }else if(new_val[0] == 'update'){			
        var update_id = $(this).attr('id');
        var value_toupdate;
        
        if (edit_id == 'update_username' && $('.edit_username').html().length==0 ) {
           alert("Username can't be empty.");
           return false;
        }
        if (edit_id == 'update_password' && $('#updated_password').val()== '') {
           alert("Password can't be empty.");
           return false;
        } 
        
        if(edit_id == 'update_password'){ //Get the value for password
            value_toupdate = $('#updated_password').val();						
        }else if(edit_id == 'update_profile'){ //Get the value of profile privacy radio button
            value_toupdate =$("input:radio[name=edit_profile]:checked").val();				
        }
        else{ //Get the value for other fields i.e. name, email etc.
            value_toupdate = $('.edit_'+new_val[1]).html();			
        }			
        
        $(".timeago").after("<img  class='ajax_img' src='img/ajax-loader3.gif' />");
        $.ajax({
            url: 'http://www.braggn.com/mobile/mobile_settings.php',
            type: 'POST',
            data: {
            field_value: value_toupdate,
            update_flag: new_val[0],
            field: 		 new_val[1]
            
            },
            success:function (result) {
            
                if (result == 1)
                { 			
                    $( ".ajax_img" ).remove();
                    show_settings(new_val[1]);
                    if(new_val[1] == 'password' || new_val[1] == 'username'){
                        window.location= "login.html";												
                    }
                    if(new_val[1] == 'profile'){
                        $('input[name=edit_profile]').attr("disabled",true);
                    }
                    
                    $('.edit_'+new_val[1]).html(value_toupdate);						
                }
                else if(result.length>100)
                {												
                    location.reload();												
                }
                else
                {							
                    $( ".ajax_img" ).remove();
                    alert(result);						
                    location.reload();							
                }
                
             }
       });
    }		
});

    //Delete account for settings page
    $(".delete_account").click(function(){
        var delete_account = confirm("Are you sure you want to delete your account? This wouldn\'t be recoverable."); 
        var userid = $(this).attr('id');
        if( delete_account == true ) {
            $.ajax({
                type: "POST",
                url: "http://www.braggn.com/deleteaccount.php",
                data: {
                  userid: userid	  
                },
                success: function(result) {					
                    if (result == '1'){
                        location.reload();
                    }				  
                }
             });
         }else {
           return false;
        }
    });		
                
});
function cancel_editing(editid,new_val,original_value){
    $('#update_'+new_val).html("Edit");
    $('#update_'+new_val).attr("id",'edit_'+new_val);					
    $('.'+editid).html(original_value);
    $('.'+editid).css("border","");
    $('.'+editid).attr("contentEditable","false");
    if(editid == 'edit_password'){
        $('.update_password').show();
        $('#updated_password').hide();						
    }
    $( ".timeago" ).remove();
    if(editid == 'edit_profile'){
        $('input[name=edit_profile]').attr("disabled",true);
    }
    return false;
} 
function show_settings(new_id){
	$('#update_'+new_id).html("Edit");
	$('#update_'+new_id).attr("id",'edit_'+new_id);
	$('.edit_'+new_id).attr("contentEditable","false");
	$('.edit_'+new_id).css("border","");
	$( ".timeago" ).remove();
}