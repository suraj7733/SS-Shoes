$(document).ready(function () {
    setProductsIntoCart();
});

function deleteProductCart(product_id,quantity){
    $.ajax({
        type: "POST",
        url: "/deleteProductCart",
        data: {
            product_id : product_id,
            quantity : quantity
        },
        success: function (data) {
            if(data.r == "ok"){
                setProductsIntoCart();
                getProductsForMiniCart();
            }
        }
    });
}

function setProductsIntoCart(){
    $.ajax({
        type: "POST",
        url: "/getProductsForCart",
        data: {},
        success: function (data) {
            if(data.r == "not"){
                $("#cartProductsBody").empty();
            }else{
                $("#cartProductsBody").empty();
                var subTotal = 0;
                data.cResult.forEach(c => {
                    data.pResult.forEach(p => {
                        if(c.product_id == p.product_id){
                            var l = p.product_images_list;
                            var sl = l.substring(1,l.length-1);
                            var fr = sl.split(", ");
                            $("#cartProductsBody").append(`<tr>
                            <td class="pro-thumbnail"><a href="#"><img class="img-fluid" src="assets/img/product/MyProductImages/${fr[2]}.png" alt="Product" /></a></td>
                            <td class="pro-title"><a href="#">${p.product_title}</a></td>
                            <td class="pro-price"><span>&#8377;${p.product_price}</span></td>
                            <td class="pro-quantity">
                                <div class="pro-qty"><input type="text" value="${c.product_quantity}"></div>
                            </td>
                            <td class="pro-subtotal"><span>&#8377;${p.product_price*c.product_quantity}</span></td>
                            <td class="pro-remove"><a style="cursor : pointer;" onclick="deleteProductCart(${p.product_id},${c.product_quantity})"><i class="fa fa-trash-o"></i></a></td>
                        </tr>`);
                        subTotal = subTotal + (p.product_price*c.product_quantity);
                        }
                    });
                });

                $("#cartTotal").empty();
                $("#cartTotal").append(`
                    <tr class="total">
                        <td>Total</td>
                        <td class="total-amount">&#8377;${subTotal}</td>
                    </tr>`);
                
            }
        }
    });
}
