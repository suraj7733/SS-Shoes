$("#rUserButton").click(function (e) { 
    e.preventDefault();
    if($("#rUserFirstName").val() == "" || $("#rUserLastName").val() == "" || $("#rUserEmail").val() == "" ||
    $("#rUserPwd").val() == "" || $("#rUserPhone").val() == "" || $("#rUserConPwd").val() == ""){
        swal({
            icon : "warning",
            text : "Please fill all the blanks"
        });
    }else if($("#rUserPhone").val().length > 10 || $("#rUserPhone").val().length < 10){
        swal({
            icon : "error",
            text : "Please insert a valid mobile number"
        });
    }else{
        if($("#rUserPwd").val() != $("#rUserConPwd").val()){
            swal({
                icon : "error",
                text : "Please check your password"
            });
        }else{
            $.ajax({
                url: "/registerUser",
                data: {
                    fname : $("#rUserFirstName").val(),
                    lname : $("#rUserLastName").val(),
                    phone : $("#rUserPhone").val(),
                    email : $("#rUserEmail").val(),
                    password : $("#rUserConPwd").val()
                },
                type: "POST",
                success: function (data) {
                    if(data.err == "false"){
                        swal({
                            icon : "error",
                            text : "Please check your Email"
                        });
                    }else if(data.result == "Email already exists"){
                        swal({
                            icon : "error",
                            text : data.result
                        });
                    }else if(data.result == "Mobile number already exists"){
                        swal({
                            icon : "error",
                            text : data.result
                        });
                    }else{
                        swal({
                            icon : "success",
                            text : "Your account has created"
                        });
                        $("#rUserFirstName").val("");
                        $("#rUserLastName").val("");
                        $("#rUserPhone").val("");
                        $("#rUserEmail").val("");
                        $("#rUserConPwd").val("");
                        $("#rUserPwd").val("");
                    }
                }
            });
        }
    }
});

$("#lUserButton").click(function (e) { 
    e.preventDefault();
    if($("#lUserEmail").val() == "" || $("#lUserPassword").val() == ""){
        alert("Please fill all the blanks");
    }else{
        $.ajax({
            type: "POST",
            url: "/checkAccount",
            data: {
                email : $("#lUserEmail").val(),
                password : $("#lUserPassword").val()
            },
            success: function (data) {
                if(data.result == "Invalid email or password"){
                    swal({
                        icon : "warning",
                        text : "Invalid email or password"
                    });
                }else{
                    window.location.href="/";
                }
            }
        });
    }
});

function forgetPassword(){
    swal({
        content: {
          element: "input",
          attributes: {
            placeholder: "Type your Email-ID",
            type: "email",
          },
        },
        buttons: {
            cancel: true,
            confirm: true,
        }
    })
    .then((value)=>{
        if(value){
            //send this to the server
            $.ajax({
                type: "POST",
                url: "/forgotPassword",
                data: {
                    email : value
                },
                success: function (data) {
                    if(data.r == "not"){
                        emptyEmailFun("error","Invalid email");
                    }else if(data.r == "not Exists"){
                        emptyEmailFun("error","Email does not exists");
                    }else if(data.r == "send"){
                        swal({
                            icon : "success",
                            text : "Password has sent to your email"
                        });
                    }
                }
            });
        }else if(value == ""){
            emptyEmailFun("warning","Please insert your email");
        }else{
            swal.close();
        }
    });
}

function emptyEmailFun(icon,text){
    swal({
        text : text,
        icon : icon
    })
    .then(()=>{
        forgetPassword();
    });
}