function submitQuery(){
    var name = $("#name").val();
    var phone = $("#phone").val();
    var email = $("#email").val();
    var subject = $("#subject").val();
    var message = $("#message").val();
    if(name == "" || phone == "" || email == "" || subject == ""|| message == ""){
        swal({
            icon : "warning",
            text : "Please fill all the blanks"
        });
    }else if(phone.length > 10 || phone.length < 10){
        swal({
            icon : "error",
            text : "Invalid mobile number"
        });
    }else{
        $.ajax({
            type: "POST",
            url: "/contact-us-form",
            data: {
                name : name,
                phone : phone,
                email : email,
                subject : subject,
                message : message
            },
            success: function (data) {
                if(data.r == "no"){
                    swal({
                        icon : "error",
                        text : "Invalid Email-ID"
                    });
                }else{
                    swal({
                        icon : "success",
                        text : "Your query have to submitted"
                    });
                    $("#name").val("");
                    $("#phone").val("");
                    $("#email").val("");
                    $("#subject").val("");
                    $("#message").val("");
                }
            }
        });
    }
}