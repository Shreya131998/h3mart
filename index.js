var mongoose = require('mongoose');
var express = require('express');
var path   = require('path');
var axios=require("axios")
var dataModel = require('./model.js');
var XLSX = require('xlsx');

//connect to db
mongoose.connect('mongodb+srv://Shreya1998:1234.qwer@cluster0.gzlyp.mongodb.net/h3mart?retryWrites=true&w=majority',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('error in connection',err));

//init app
var app = express();

app.get("/products/:productname",async(req,res)=>{
    try{
    let productname=req.params.productname
    console.log(productname)
   let p=await axios.get(`https://api.storerestapi.com/products/${productname}`)
   let t=p.data.data.price

   let reqdata=await dataModel.find({productname:productname})
   if(reqdata){
    var wb = XLSX.utils.book_new(); //new workbook
    dataModel.find((err,data)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/public/exportdata.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });
     
   }
   else{
    msg={productname:productname,price:t}
    await dataModel.create(msg)
    var wb = XLSX.utils.book_new(); //new workbook
    dataModel.find((err,data)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(data);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/public/exportdata.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });

   }
}catch(err){
    return res.send({msg:err})
}

})


var port = process.env.PORT || 9000;
app.listen(port,()=>console.log('server run at '+port));