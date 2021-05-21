var express = require("express");
var app = express();
//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit : '10mb',extended : true}));
app.use(bodyParser.urlencoded({limit : '10mb' , extended : true}));
//email-validator
const emailvalidator = require("email-validator");
//nodemailer
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'k16776@cpur.edu.in',
        pass: 'sharma@12345'
    }
});

//Fuse JS
const fuse = require("fuse.js");

//Express session
const session = require("express-session");
app.use(session({
    secret : "XpAtwRvKf9qkpG0uWPkZ",
    resave : false,
    saveUninitialized : true
}));

//dbServer
var conn = require("./dbServer.js");
//Instamojo
var Insta = require("instamojo-nodejs");
const API_KEY = "test_a46907b0ba3d4d48e6d07a2002e";
const AUTH_KEY = "test_46ea34e995e515ef77107314471";
Insta.setKeys(API_KEY,AUTH_KEY);
Insta.isSandboxMode(true);
//Insta.getAllPaymentRequests(function(e,d){
  //  console.log(d.payment_requests[0]);
//});

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("dist"));

//Forgote Password
app.post("/forgotPassword",(req,res)=>{
    var email = req.body.email;
    if(emailvalidator.validate(email) == false){
        res.json({ r : "not" });
    }else{
        conn.query("select * from Users where user_email = '"+email+"'",(err,result,field)=>{
            if(result == ""){
                res.json({ r : "not Exists" });
            }else{
                const mailOptions = {
                    from: 'k16776@cpur.edu.in',
                    to: email,
                    subject: 'Your SS Shoes Password',
                    text: result[0].user_password
                };
                transporter.sendMail(mailOptions, function(error,info){
                    if(error){
                        res.json({ r : "not send" });
                    }else{
                        res.json({ r : "send" });
                    }
                });
            }
        });
    }
});

//Instamojo codding
app.post("/pay",(req,res)=>{
    var purpose = req.body.purpose;
    var amount = req.body.amount;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var data = new Insta.PaymentData();
    data.purpose = purpose;
    data.send_email = "True"
    data.amount = amount;
    data.name = firstname + " " + lastname;
    data.email = email;

    Insta.createPayment(data, function(err, response){
        if(err){
            console.log(err);
            res.json({ r : "no" });
        }else{
            conn.query("delete from Carts where user_email = '"+req.session.email+"'",(derr,dresult,dfield)=>{
                res.json({ r : "ok" });
            });
        }
    });

});

app.get("/", (req,res)=>{
    conn.query("select * from Products LIMIT 5",(err,result,field)=>{
        var imageList = [];
        var i = 0;
        result.forEach(c => {
            var l = result[i].product_images_list;
            var subs = l.substring(1,l.length-1);
            var fr = subs.split(", ");
            imageList.push(fr.sort());
            i++;
        });
        conn.query("select * from Products LIMIT 12",(serr,sresult,sfield)=>{
            var simageList = [];
            var si = 0;
            sresult.forEach(sc => {
                var sl = sresult[si].product_images_list;
                var ssubs = sl.substring(1,sl.length-1);
                var sfr = ssubs.split(", ");
                simageList.push(sfr.sort());
                si++;
            });
            conn.query("select * from Products where product_type = 'men'",(merr,mresult,mfields)=>{
                var mimageList = [];
                var mi = 0;
                mresult.forEach(mc => {
                    var ml = mresult[mi].product_images_list;
                    var msubs = ml.substring(1,ml.length-1);
                    var mfr = msubs.split(", ");
                    mimageList.push(mfr.sort());
                    mi++;
                });
                conn.query("select * from Products where product_type = 'women'",(werr,wresult,wfields)=>{
                    var wimageList = [];
                    var wi = 0;
                    wresult.forEach(wc => {
                        var wl = wresult[wi].product_images_list;
                        var wsubs = wl.substring(1,wl.length-1);
                        var wfr = wsubs.split(", ");
                        wimageList.push(wfr.sort());
                        wi++;
                    });
                    res.render("index-3.ejs", {email : req.session.email, result : result, imageList : imageList, shopResult : sresult, shopImages : simageList, menResult : mresult, menImages : mimageList, womenResult : wresult, womenImages : wimageList});
        
                });
                
            });
        });
    });
});

app.get("/product-details", (req,res)=>{
    var product_id = req.query.id;
    if(product_id == undefined){
        console.log("hii");
    }else{
        conn.query("select * from Products where product_id = '"+product_id+"'",(perr,presult,pfield)=>{
            //For Images
            var il = presult[0].product_images_list;
            var isl = il.substring(1,il.length-1);
            var ifr = isl.split(", ");
            //For Color
            var cl = presult[0].product_colors_list;
            var csl = cl.substring(1,cl.length-1);
            var cfr = csl.split(", ");
            conn.query("select * from Products where product_company = '"+presult[0].product_company+"' and product_id != '"+product_id+"'",(rperr,rpresult,rpfield)=>{
                var mimageList = [];
                var mi = 0;
                rpresult.forEach(element => {
                    var ml = rpresult[mi].product_images_list;
                    var msubs = ml.substring(1,ml.length-1);
                    var mfr = msubs.split(", ");
                    mimageList.push(mfr.sort());
                    mi++;
                });
                res.render("product-details-variable.ejs",{ email : req.session.email, images : ifr, result : presult, colors : cfr, rresult : rpresult, rimages : mimageList});
            });
        });
    }
    
});

app.get("/cart", (req,res)=>{
    /*conn.query("select * from Products where product_id = '"+17+"'",(err,result,field)=>{
        var l = result[0].product_images_list;
        var sl = l.substring(1,l.length-1);
        var fr = sl.split(", ");
        
        fr.sort().forEach(c => {
            console.log(c);
        });
        
    });*/
    res.render("cart.ejs", {email : req.session.email});
});

function setCategorisedandNullWise(query,res,id, no, u){
    var last = no*id;
    var first = no*(id-1);
    var f = first;
    var l = last;
    conn.query(query,(err,result,field)=>{
        var simageList = [];
        var resultList = [];
        var si = 0,sp = 0;
        result.forEach(element => {
            if(sp == first && sp < last){
                resultList.push(result[sp]);
                first++;
            }
            sp++;
        })
        resultList.forEach(r => {
            var sl = resultList[si].product_images_list;
                var ssubs = sl.substring(1,sl.length-1);
                var sfr = ssubs.split(", ");
                simageList.push(sfr.sort());
                si++;
        })
        conn.query(query,(lerr,lresult,lfield)=>{
            res.render("shop-list-full-width.ejs", {u : u, result : resultList, oresult : lresult, images : simageList, len : lresult.length, first : f, last : l});
        });
    });
}

function searchMethod(resu,res,id, no, u){
    var f = no*(id-1);
    var l = no*id;
    var imageList = [];
    var si = 0;
    var results = [];
    resu.forEach(r => {
        results.push(r.item)
    });
    resu.forEach(i =>{
                var sl = resu[si].item.product_images_list;
                var ssubs = sl.substring(1,sl.length-1);
                var sfr = ssubs.split(", ");
                imageList.push(sfr.sort());
                si++;
    });
    res.render("shop-list-full-width.ejs", {u : u, result : results, images : imageList, len : resu.length, first : f, last : l});
}

app.get("/shop", (req,res)=>{
    var id = req.query.id;
    var cat  = req.query.cat;
    var brand = req.query.brand;
    var search = req.query.search;
    if(search == undefined){
        if(cat == undefined){
            if(brand == undefined){
                setCategorisedandNullWise("select * from Products", res, id, 3, 0);
            }else{
                setCategorisedandNullWise("select * from Products where product_company = '"+brand+"'",res, 1, 10, 1);
            }
        }else{
            if(cat == undefined){
                setCategorisedandNullWise("select * from Products", res, id, 3, 0);
            }else{
                setCategorisedandNullWise("select * from Products where product_category = '"+cat+"'",res, 1, 10, 1);
            }
        }
    }else if(search != undefined){
        conn.query("select * from Products",(err,result,field)=>{
            var r = [];
            result.forEach(e=>{
                r.push(e);
            });
            const options = {
                includeScore : true,
                keys: ['product_title','product_price','product_company','product_color'],
                caseSensitive: true
            };
            const fse = new fuse(r,options);
            const resu = fse.search(search);
            searchMethod(resu,res,1,10,1);
        });
    }
});

app.get("/checkout", (req,res)=>{
    conn.query("select * from Users where user_email = '"+req.session.email+"'",(err,result,fields)=>{
        conn.query("select * from Carts where user_email = '"+req.session.email+"'",(perr,presult,pfield)=>{
            
            conn.query("select * from Products",(aperr,apresult,apfield)=>{
                res.render("checkout.ejs", {email : req.session.email, userDetails : result, productDetails : presult, allProducts : apresult});
            });
        });
    });
});

app.post("/updateDetails",(req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var newPassword = req.body.newPwd;
    conn.query("insert into Users(user_firstname,user_lastname,user_password) values('"+firstname+"','"+lastname+"','"+newPassword+"') where user_email = '"+req.session.email+"'",(err,result,field)=>{
        res.json({ r : "ok" });
    });
});

app.post("/checkUpdateDetails",(req,res)=>{
    var curp = req.body.currentPwd;
    conn.query("select * from Users where user_email = '"+req.session.email+"'",(err,result,field)=>{
        if(result[0].user_password == curp){
            res.json({ r : "ok" });
        }else{
            res.json({ r : "not" });
        }
    });
});

app.get("/my-account",(req,res)=>{
    
    conn.query("select * from Users where user_email = '"+req.session.email+"'",(err,result,field)=>{
        res.render("my-account.ejs", {email : req.session.email, user : result});
    });
});

app.get("/compare", (req,res)=>{ //no
    res.render("compare.ejs")
});

app.get("/about-us", (req,res)=>{ //no
    res.render("about-us.ejs", {email : req.session.email})
});

//Contact us form
app.post("/contact-us-form",(req,res)=>{
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;
    if(emailvalidator.validate(email) == false){
        res.json({ r : "no" });
    }else{
        conn.query("insert into Contactus(name,phone,email,subject,message) values('"+name+"','"+phone+"','"+email+"','"+subject+"','"+message+"')",(err,result,field)=>{
            if(err) throw err;
            res.json({ r : "yes" });
        });
    }

});

app.get("/contact-us", (req,res)=>{ //no
    res.render("contact-us.ejs", {email : req.session.email})
});

app.get("/login-register", (req,res)=>{ //no
    res.render("login-register.ejs")
});

app.get("/Wishlist",(req,res)=>{
    res.render("wishlist.ejs");
});

//Delete Product from cart
app.post("/deleteProductCart",(req,res)=>{
    var product_id = req.body.product_id;
    var quantity = req.body.quantity;
    conn.query("select * from Products where product_id = '"+product_id+"'",(serr,sresult,sfields)=>{
        var stock = parseInt(sresult[0].product_stock) + parseInt(quantity);
        conn.query("update Products set product_stock = '"+stock+"' where product_id = '"+product_id+"'",(uerr,uresult,ufields)=>{
            conn.query("delete from Carts where product_id = '"+product_id+"' and user_email = '"+req.session.email+"'",(err,result,field)=>{
                res.json({ r : "ok"});
            });
        });
    });
    
});

//Get Product for Cart
app.post("/getProductsForCart",(req,res)=>{
    conn.query("select * from Carts where user_email = '"+req.session.email+"'",(err,result,fields)=>{
        if(result == ""){
            res.json({ r : "not" });
        }else{
            conn.query("select * from Products",(perr,presult,pfields)=>{
                res.json({ cResult : result, pResult : presult });
            });
        }
    });
});

//Add to product into Cart
app.post("/addToCart", (req,res)=>{
    if(req.session.email != null){
        var product_id = req.body.product_id;
    var quantity = req.body.quantity;
    conn.query("select * from Products where product_id = '"+product_id+"'",(err,result,field)=>{
        if(result[0].product_stock == 0){
            res.json({ r : "not" });
        }else{
            conn.query("select * from Carts where product_id = '"+product_id+"'",(cerr,cresult,cfields)=>{
                if(cresult == ""){
                    conn.query("insert into Carts(product_quantity,product_id,user_email) values('"+quantity+"','"+product_id+"','"+req.session.email+"')",(ierr,iresult,ifields)=>{
                        conn.query("update Products set product_stock = '"+(result[0].product_stock-quantity)+"' where product_id = '"+product_id+"'",(uerr,uresult,ufields)=>{
                            res.json({r : "ok", stock : (result[0].product_stock-quantity)});
                        });
                    });
                }else{
                    var gquantity = parseInt(cresult[0].product_quantity) + parseInt(quantity);
                    conn.query("update Carts set product_quantity = '"+gquantity+"' where product_id = '"+product_id+"'",(uperr,upresult,upfields)=>{
                        conn.query("update Products set product_stock = '"+(result[0].product_stock-quantity)+"' where product_id = '"+product_id+"'",(uerr,uresult,ufields)=>{
                            res.json({r : "ok", stock : (result[0].product_stock-quantity)});
                        });
                    });
                }
            });
        }
    });
    }else{
        res.json({ r : "Please login first" });
    }
});

//Delete Wishlist Products
app.post("/deleteWishListItems",(req,res)=>{
    var product_id = req.body.product_id;
    conn.query("delete from Wishlists where product_id = '"+product_id+"' and user_email = '"+req.session.email+"'",(err,result,field)=>{
        res.json({ r : "ok" });
    });
});

//WishList Post
app.post("/wishlist", (req,res)=>{
    if(req.session.email != null){
        var product_id = req.body.product_id;
    conn.query("select * from Wishlists where product_id = '"+product_id+"' and user_email = '"+req.session.email+"'",(wserr,wsresult,wsfields)=>{
        if(wsresult != ""){
            res.json({werr : "Item Found"});
        }else{
            conn.query("select * from Products where product_id = '"+product_id+"'",(perr,presult,pfield)=>{
                conn.query("insert into Wishlists(product_id, user_email) values('"+product_id+"','"+req.session.email+"')",(wierr,wiresult,wifield)=>{
                    var l = presult[0].product_images_list;
                    var sl = l.substring(1,l.length-1);
                    var fr = sl.split(", ");
                    res.json({result : presult, image : fr[1]});
                });
            });
        }
    });
    }else{
        res.json({ r : "Please login first" })
    }
});

//Search WishList Items
app.post("/searchWishListItems",(req,res)=>{
    conn.query("select * from Wishlists where user_email = '"+req.session.email+"'",(wserr,wsresult,wsfields)=>{
        if(wsresult == ""){
            res.json({e : "not found"});
        }else{
            conn.query("select * from Products",(sperr,spresult,spfields)=>{
                res.json({wsresult : wsresult, psresult : spresult});
            });
        }
    });
});





//Here work start related to Client java script
//Account Create codding
app.post("/registerUser", (req,res)=>{
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var email = req.body.email;
    var password = req.body.password;
    if(emailvalidator.validate(email) == false){
        res.json({err : "false"})
    }else{
        conn.query("select * from Users where user_email = '"+email+"' or user_phone = '"+phone+"'",(err,result,field)=>{
            if(err) throw err;
            if(result == ""){
                conn.query("insert into Users(user_firstname,user_lastname,user_phone,user_email,user_password) values('"+fname+"','"+lname+"','"+phone+"','"+email+"','"+password+"')", (ierr,iresult,ifield)=>{
                    if(ierr) throw ierr;
                    res.json({result : "Account Created!"});
                });
            }else if(result[0].user_phone == phone){
                res.json({result : "Mobile number already exists"});
            }else if(result[0].user_email == email){
                res.json({result : "Email already exists"});
            }
        });
    }
});

//Account check codding
app.post("/checkAccount", (req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    conn.query("select * from Users where user_email = '"+email+"' and user_password = '"+password+"'",(err,result,field)=>{
        if(err) throw err;
        else if(result == ""){
            res.json({result : "Invalid email or password"})
        }else{
            req.session.email = email;
            res.json({result : "ok"});
        }
    });
});

app.post("/logOut",(req,res)=>{
    req.session.destroy();
    res.json({ r : "ok" })
});

//Get products for shop tab1
app.post("/getProductsForShopTab1", (req,res)=>{
    
});

app.listen(port, ()=> console.log("Server running on port no. 3000"));