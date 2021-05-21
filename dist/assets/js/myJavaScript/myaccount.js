
function savaChanges(){
    var firstname = $("#first-name").val();
    var lastname = $("#last-name").val();
    var currentPwd = $("#current-pwd").val();
    var newPwd = $("#new-pwd").val();
    var confirmPwd = $("#confirm-pwd").val();
    if(firstname == "" || lastname == "" || currentPwd == "" || newPwd == "" || confirmPwd == ""){
        swal({
            text : "Please fill all the blanks",
            icon : "warning"
        });
    }else if(newPwd != confirmPwd){
        swal({
            text : "Password does not match",
            icon : "error"
        });
    }else{
        $.ajax({
            type: "POST",
            url: "/checkUpdateDetails",
            data: {
                currentPwd : currentPwd
            },
            success: function (data) {
                if(data.r == "not"){
                    swal({
                        text : "Invalid current password",
                        icon : "error"
                    });
                }else{
                    $.ajax({
                        type: "POST",
                        url: "/updateDetails",
                        data: {
                            firstname : firstname,
                            lastname : lastname,
                            newPwd : newPwd
                        },
                        success: function (response) {
                            if(response.r == "ok"){
                                swal({
                                    text : "Your details have changed..",
                                    icon : "success"
                                }); 
                            }
                        }
                    });
                }
            }
        });
    }
}