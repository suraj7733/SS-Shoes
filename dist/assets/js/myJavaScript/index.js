$(document).ready(function () {
    getProductsForMiniCart();    
});

function quickView(product_id, title, description, price, offer, image1, image2, image3, image4){
    $("#quickViewTitleName").empty();
    $("#quickViewTitleName").append(title);
    $("#quickViewDescription").empty();
    $("#quickViewDescription").append(description);
    $("#quickViewOldPrice").hide();
    $("#quickViewNewPrice").empty();
    $("#quickViewHiddenInputSetProductId").val("");
    $("#quickViewInputQuantity").val(1);
    $("#quickViewHiddenInputSetProductId").val(product_id);
    var avar = price*(offer/100); 
    var adiscount = price - avar;
    if(offer != 0){
        $("#quickViewOldPrice").empty();
        $("#quickViewOldPrice").append("&#8377;"+price);
        $("#quickViewOldPrice").show();
    }
    $("#quickViewNewPrice").append("&#8377;"+adiscount);
    
    $("#quickViewSmallImage1").attr("src", "assets/img/product/MyProductImages/"+image1+".png");
    $("#quickViewSmallImage2").attr("src", "assets/img/product/MyProductImages/"+image2+".png");
    $("#quickViewSmallImage3").attr("src", "assets/img/product/MyProductImages/"+image3+".png");
    $("#quickViewSmallImage4").attr("src", "assets/img/product/MyProductImages/"+image4+".png");

    $("#quickViewLargeImage1").attr("src", "assets/img/product/MyProductImages/"+image1+".png");
    $("#quickViewLargeImage2").attr("src", "assets/img/product/MyProductImages/"+image2+".png");
    $("#quickViewLargeImage3").attr("src", "assets/img/product/MyProductImages/"+image3+".png");
    $("#quickViewLargeImage4").attr("src", "assets/img/product/MyProductImages/"+image4+".png");
}

function addProductIntoWishlistFromQuickView(){
    var product_id = $("#quickViewHiddenInputSetProductId").val();
    $.ajax({
        type: "POST",
        url: "/wishlist",
        data: {
            product_id : product_id
        },
        success: function (data) {
            if(data.werr == "Item Found"){
                swal({
                    icon : "error",
                    text : "Product already added in your wishlist."
                });
            }else if(data.r == "Please login first"){
                swal({
                    icon : "warning",
                    text : "Please login first"
                });
            }else{
                swal({
                    icon : "success",
                    text : "Product added in your wishlist."
                });
            }
        }
    });
}

function addWishList(product_id){
    $.ajax({
        type: "POST",
        url: "/wishlist",
        data: {
            product_id : product_id
        },
        success: function (data) {
            if(data.werr == "Item Found"){
                swal({
                    icon : "error",
                    text : "Product already added in your wishlist."
                });
            }else if(data.r == "Please login first"){
                swal({
                    icon : "warning",
                    text : "Please login first"
                });
            }else{
                swal({
                    icon : "success",
                    text : "Product added in your wishlist."
                });
            }
        }
    });
}

function addProductIntoCartFromQuickView(){
    var quantity = $("#quickViewInputQuantity").val();
    var product_id = $("#quickViewHiddenInputSetProductId").val();
    if(quantity == 0){
        alert("Quantity should be greater then 0");
    }else{
        $.ajax({
            type: "POST",
            url: "/addToCart",
            data: {
                quantity : quantity,
                product_id : product_id
            },
            success: function (data) {
                if(data.r == "not"){
                    swal({
                        icon : "error",
                        text : "Sorry, Product is out of stock."
                    });
                    //alert("Sorry, Product is out of stock.");
                }else if(data.r == "Please login first"){
                    swal({
                        icon : "warning",
                        text : "Please login first!"
                    });
                }else{
                    getProductsForMiniCart();
                    $("#productstockForProductDetails").empty();
                    $("#productstockForProductDetails").append(data.stock + " IN STOCK");
                    swal({
                        icon : "success",
                        text : "Product added in your cart."
                    });
                }
            }
        });
    }
}

function addProductIntoCart(product_id){
    $.ajax({
        type: "POST",
        url: "/addToCart",
        data: {
            quantity : 1,
            product_id : product_id
        },
        success: function (data) {
            if(data.r == "not"){
                swal({
                    icon : "error",
                    text : "Sorry, Product is out of stock."
                });
            }else if(data.r == "Please login first"){
                swal({
                    icon : "warning",
                    text : "Please login first!"
                });
            }else{
                getProductsForMiniCart();
                swal({
                    icon : "success",
                    text : "Product added in your cart."
                });
            }
        }
    });
}
function getProductsForMiniCart(){
    $.ajax({
        type: "POST",
        url: "/getProductsForCart",
        data: {},
        success: function (data) {
            if(data.r == "not"){
                $("#cartList").empty();
                $("#cartNotifications").empty();
                $("#cartNotifications").hide();
                $("#mCartNotifications").empty();
                $("#mCartNotifications").hide();
                $("#miniCartPricingBox").empty();
            }else{
                $("#cartList").empty();
                $("#cartNotifications").empty();
                $("#mCartNotifications").empty();
                $("#miniCartPricingBox").empty();
                var count = 0;
                var subTotal = 0;
                data.cResult.forEach(c => {
                    data.pResult.forEach(p => {
                        if(c.product_id == p.product_id){
                            count++;
                            var l = p.product_images_list;
                            var sl = l.substring(1,l.length-1);
                            var fr = sl.split(", ");
                            $("#cartList").append(`
                                <li>
                                    <div class="cart-img">
                                        <a href="product-details.html"><img src="assets/img/product/MyProductImages/${fr[2]}.png" alt=""></a>
                                    </div>
                                    <div class="cart-info">
                                        <h6 class="product-name"><a href="product-details.html">${p.product_title}</a></h6>
                                        <span class="cart-qty">Qty: ${c.product_quantity}</span>
                                        <span class="item-price">&#8377;${p.product_price}</span>
                                    </div>
                                    <div class="del-icon">
                                        <i class="fa fa-times" onclick="deleteProductMiniCart(${p.product_id},${c.product_quantity})"></i>
                                    </div>
                                </li>`);
                                subTotal = subTotal + (p.product_price*c.product_quantity);
                        }
                    });
                });
                $("#miniCartPricingBox").append(`
            <li class="total">
                <span>Total</span>
                <span><strong>&#8377;${subTotal}</strong></span>
            </li>`);
                if(count != 0){
                    $("#cartNotifications").append(`${count}`);
                    $("#cartNotifications").show();
                    $("#mCartNotifications").append(count);
                    $("#mCartNotifications").show();
                }else{
                    $("#cartNotifications").hide();
                    $("#mCartNotifications").hide();
                }
                
            }
        }
    });
}

function deleteProductMiniCart(product_id,quantity){
    $.ajax({
        type: "POST",
        url: "/deleteProductCart",
        data: {
            product_id : product_id,
            quantity : quantity
        },
        success: function (data) {
            if(data.r == "ok"){
                getProductsForMiniCart();
                setProductsIntoCart();
            }
        }
    });
}

function sendOnProductDetails(product_id){
    $.ajax({
        type: "POST",
        url: "/product-details",
        data: {
            product_id
        },
        success: function (response) {
            
        }
    });
}

function searchProduct(){
    if($("#msearchProduct").val() == ""){
        var search = $("#searchProduct").val();
        window.location.href = "/shop?search="+search;

    }else{
        var search = $("#msearchProduct").val();
        window.location.href = "/shop?search="+search;
    }

}

function logOut(){
    $.ajax({
        type: "Post",
        url: "/logOut",
        data: {},
        success: function (response) {
            window.location.href = "/";
        }
    });
}