// var express = require('express');
// var app = express();

// // set the port of our application
// // process.env.PORT lets the port be set by Heroku
// var port = process.env.PORT || 8080;

// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// // set the home page route
// app.get('/', function(req, res) {

// 	// ejs render automatically looks in the views folder
// 	res.render('index');
// });

// app.listen(port, function() {
// 	console.log('Our app is running on http://localhost:' + port);
// });

// const product = require('./db')

// app.get('/Product', (req, res) => {
//   res.json(product)
// })


// app.get('/Product/:id', (req, res) => {
//     res.json(product.find(product => product.item_code === req.params.id))
//   })

const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./queries')
var app = express()
var port = process.env.PORT || 3000
const request = require('request');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600
};



app.get('/', cors(issue2options), db.getProd);
app.get('/product3/:id', cors(issue2options), db.getProdById3);
app.get('/product2/:id', cors(issue2options), db.getProdById2);
app.get('/product4/', cors(issue2options),db.getProdById4);
app.get('/product/:id', cors(issue2options), db.getProdById3);
app.get('/getoffer/:id', cors(issue2options), db.getOfferbyId);
app.get('/getbasket/:id', cors(issue2options), db.getBuskets);
app.post('/insertbasket/', cors(issue2options), db.insertBusket);
app.get('/getpicture/', cors(issue2options), db.getPic);
app.post('/register/', cors(issue2options),db.register);
app.post('/insertbasketoffer/', cors(issue2options), db.insertBusketOffer);
app.get('/productoffer/:id', cors(issue2options), db.getProdById3offer);
app.get('/getgraph/:id', cors(issue2options), db.getGraph);
app.get('/alluser', cors(issue2options), db.getUser);





// face start //

//initial//
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = '8b1838e13407455daf92a98bd51016ba';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriDetect = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect/';

const imageUrl =
    'https://noblesamplebot9711.blob.core.windows.net/oneteam/arun_1.PNG';

    // Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
    uri: uriDetect,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};
// initial end//
app.get('/monthly/',cors(issue2options),function(req,res){
  request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      return;
    }
    let jsonResponse = JSON.parse(body);
    //let res = JSON.stringify(jsonResponse, null, '  ');
    var date = new Date();
    var month = date.getMonth()+1;
    var day = date.getDate();
  
    let gender = jsonResponse[0].faceAttributes.gender;
    let age = jsonResponse[0].faceAttributes.age;
    console.log('JSON Response\n');
    console.log("age: " ,age + " , gender: " + gender);
  
    var cluster = "";
    if(gender="female"){
      if(age>=54 && age <= 80){
        cluster="Cluster_1";
      }else if(age>=41 && age <= 53 ){
        cluster="Cluster_2"
      }else if(age>=15 && age <= 40 ){
        cluster="Cluster_3"
      }
      else{
        cluster="Cluster_3"
      }
    }if(gender="male"){
      if(age>=56 && age <= 80){
        cluster="Cluster_6";
      }else if(age>=42 && age <= 55 ){
        cluster="Cluster_5"
      }else if(age>=15 && age <= 41 ){
        cluster="Cluster_4"
      }else{
        cluster="Cluster_4"
      }
    }
      pool.query('SELECT round_500 FROM  public_b1.cluster_monthly_spent where cluster_group = $1 and Day = $2 and Month = $3;',[cluster,day,month], (error, results) => {
        if (error) {
          throw error
        }
       // response.status(200).json(results.rows);
       console.log(day+" "+month+" "+cluster);
        res.send(results.rows);
      })
  });

});


// face end //


  
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })


