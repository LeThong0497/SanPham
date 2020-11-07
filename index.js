var express=require('express');
var app=express();
app.listen(4000, function(){
  console.log("Listening on port 4000");
});

app.set("view engine","ejs");
app.set("views","./views");

var AWS=require('aws-sdk');
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// var awsConfig={
//     "region": "us-west-2",
//     "access"keyId":"",
//     "secret"AccessKey":""
// };
AWS.config.update(awsConfig);

var docClient=new AWS.DynamoDB.DocumentClient();
//get all
app.get('/',function(req,res){
  let params={
    TableName : "SanPham"
  };
   
    docClient.scan(params,(err,data)=>{
        if(err){
            res.end(JSON.stringify({err : "Lỗi không truy xuất được dữ liệu!"}));
        }else{
         res.render('trangchu',{data:data});
        }
    });
});

//xóa
app.get('/delete/:MaSanPham',function(req,res){

  let params={
    TableName :"SanPham",
   Key:{
     "MaSanPham": req.params.MaSanPham
   }
  };

  docClient.delete(params,function(err,data){
    if(err)
    {
      res.render({
        Message : "failed to delete item"
      });
    }
    else
    {
      res.redirect('/');
    }
  });
});

//get page add
app.get('/sanpham/add',function(req,res){
  res.render('add');
});

//thêm
app.post('/addsanpham',function(req,res){
  const { masanpham, tensanpham, soluong} =req.body;

  let params={
    TableName :"SanPham",
    Item:
     {
      MaSanPham:masanpham,
      TenSanPham:tensanpham,
      SoLuong:soluong
      
    }
  };

  docClient.put(params,function(err,data){
    if(err)
    {
      res.render({
        Message : "failed to add item"

      });
    }
    else
    {
     const  {Items}=data;
      res.redirect('/');
    }
  });
});

// get page update 
app.get('/update/:MaSanPham',function(req, res){
  let params = {
      TableName: "SanPham",
      Key: {
        MaSanPham: req.params.MaSanPham
        }
  };
  docClient.get(params, function (err, data) {
      if (err) {
        res.send( JSON.stringify(err, null, 2));
      } else {
         
          res.render('update', { data: data});
      }
    });

});
//cap nhat
app.post('/update', function (req, res) {
  const { masanpham, tensanpham, soluong} =req.body; 
   const params = {
      TableName: 'SanPham',
      Key: {
        MaSanPham:masanpham
      },
      UpdateExpression: "set  TenSanPham = :tensanpham, SoLuong = :soluong",
      ExpressionAttributeValues: {
          
          ":tensanpham": tensanpham,
          ":soluong": soluong

      },
      ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, (err, data) => {
      if (err) {
          res.send(" " + JSON.stringify(err, null, 2));
      } else {
          res.redirect('/');
      }
  });
});

 

