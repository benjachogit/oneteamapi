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

app.post('/rate/', cors(issue2options),db.rate);


// start face api //


'use strict';

const request = require('request');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = 'e8a03ab9d5ba41c4af0cb79dde5c4926';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://southeastasia.api.cognitive.microsoft.com/face/v1.0';

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';



// Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

request.post('/detect/',options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }
  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
  console.log('JSON Response\n');
  console.log(jsonResponse);
});

// end face api //










  
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })


