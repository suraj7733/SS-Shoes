$(document).ready(function () {
    setProductsIntoWishlist();
});

function deleteProductWishList(product_id){
    $.ajax({
        type: "POST",
        url: "/deleteWishListItems",
        data: {
            product_id : product_id
        },
        success: function (data) {
            if(data.r == "ok"){
                setProductsIntoWishlist();
            }
        }
    });
}

function setProductsIntoWishlist(){
    $.ajax({
        type: "POST",
        url: "/searchWishListItems",
        data: {},
        success: function (data) {
            if(data.e == "not found"){
                $("#wishListBody").empty();
                $("#wishListBody").append(`<tr><td colspan = "2"><h4>Product is not found in your Wishlist.</h4></td>
                <td colspan = "4">Wants to add <a href="/"><b>Click here</b></a></td></tr>`);
            }else{
                $("#wishListBody").empty();
                data.wsresult.forEach(m => {
                    data.psresult.forEach(c => {
                        if(m.product_id == c.product_id){
                            var l = c.product_images_list;
                            var sl = l.substring(1,l.length-1);
                            var fr = sl.split(", ");
                            if(c.product_stock == 0){
                                $("#wishListBody").append(`<tr>
                                <td class="pro-thumbnail"><a href="#"><img class="img-fluid" src="assets/img/product/MyProductImages/${fr[1]}.png" alt="Product" /></a></td>
                                <td class="pro-title"><a href="#">${c.product_title}</a></td>
                                <td class="pro-price"><span>&#8377;${c.product_price}</span></td>
                                <td class="pro-quantity"><span class="text-danger">Stock Out</span></td>
                                <td class="pro-subtotal"><a href="cart.html" class="btn btn-sqr disabled">Add to Cart</a></td>
                                <td class="pro-remove"><a style="cursor : pointer;" onclick="deleteProductWishList(${c.product_id})"><i class="fa fa-trash-o"></i></a></td>
                            </tr>`);
                            }else{
                                $("#wishListBody").append(`<tr>
                                <td class="pro-thumbnail"><a href="#"><img class="img-fluid" src="assets/img/product/MyProductImages/${fr[1]}.png" alt="Product" /></a></td>
                                <td class="pro-title"><a href="#">${c.product_title}</a></td>
                                <td class="pro-price"><span>&#8377;${c.product_price}</span></td>
                                <td class="pro-quantity"><span class="text-success">In Stock</span></td>
                                <td class="pro-subtotal"><a href="cart.html" class="btn btn-sqr">Add to Cart</a></td>
                                <td class="pro-remove"><a style="cursor : pointer;" onclick="deleteProductWishList(${c.product_id})"><i class="fa fa-trash-o"></i></a></td>
                                </tr>`);
                            }
                            
                        }
                    });
                });
            }
        }
    });
}