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


  
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })


