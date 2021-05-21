$(document).ready(function () {
    getProductDetailsForOrderm();
});

function getProductDetailsForOrderm(){
    $.ajax({
        type: "POST",
        url: "/getProductDetailsForOrder",
        data: {},
        success: function (response) {
            
        }
    });
}

function placeOrder(firstname,lastname,email,amount,purpose){
    $.ajax({
        type: "POST",
        url: "/pay",
        data: {
            firstname : firstname,
            lastname : lastname,
            email : email,
            amount : amount,
            purpose : purpose
        },
        success: function (data) {
            if(data.r == "no"){
                swal({
                    icon : "error",
                    text : "An error occored while order"
                });
            }else{
                getProductDetailsForOrderm();
                swal({
                    icon : "success",
                    text : "Check your email for make payment"
                });
                getProductsForMiniCart();
            }
        }
    });
}