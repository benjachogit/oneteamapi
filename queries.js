
const Pool = require('pg').Pool

const pool = new Pool({
  host : 'onedemo.metrosystems.co.th',
  user: 'postgres', 
  database: 'postgres',
  password: 'password',
  port: 80,
  ssl:false
  
})



const getProd = (request, response) => {
  pool.query('SELECT * FROM  public_b1.retail_comp;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//get picture
const getPic = (request, response) => {
  pool.query('SELECT item_code , new_name , item_pic FROM public_b1.item_offer;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



//get offer
const getOfferbyId = (request, response) => {
  const id = request.params.id
  pool.query('SELECT item_code , new_name , item_pic , qr_pic , qr_promo FROM public_b1.item_offer WHERE item_code IN (SELECT pred_item1 FROM public_b1.item_offer WHERE item_code = $1) OR item_code IN (SELECT pred_item2 FROM public_b1.item_offer WHERE item_code = $1) ;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//QRCODE OFFER
const getProdById3offer = (request, response) => {
  const id = request.params.id
  pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1 and timestamp IN (SELECT max(timestamp) FROM public_b1.retail_comp) ORDER BY price ASC limit 1;', [id], (error, results) => {
  //pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1;', [id], (error, results) => {
    if (error) {
      throw error
    }
    results.rows[0].promo = 'y';
    response.status(200).json(results.rows)
  })
}


//QRCODE
const getProdById3 = (request, response) => {
  const id = request.params.id
  pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1 and timestamp IN (SELECT max(timestamp) FROM public_b1.retail_comp) ORDER BY price ASC limit 1;', [id], (error, results) => {
  //pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


//get all price week
const getPriceGraph = (request, response) => {
  const id = request.params.id
  pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1 and ( SELECT max(timestamp) FROM public_b1.retail_comp )- date(timestamp) < 7 ;', [id], (error, results) => {
  //pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



const getProdById4 = (request, response) => {
  //const id = request.params.id
  pool.query('SELECT * FROM public_b1.retail_comp WHERE timestamp IN (SELECT max(timestamp) FROM public_b1.retail_comp )ORDER BY retail_name ASC;',(error, results) => {
  //pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1;', [id], (error, results) => {
    if (error) {
     throw error
    }
    response.status(200).json(results.rows)
  })
}


const getProdById2 = (request, response) => {
  const id = request.params.id
  pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1  and timestamp IN (SELECT max(timestamp) FROM public_b1.retail_comp);', [id], (error, results) => {
  //pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



 const getBuskets = (request, response) => {
  const id = request.params.id
  pool.query('SELECT * FROM public_b1.buskets WHERE user_id = $1;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
 
 //getGraph
 const getGraph = (req, res) => {
  const id = req.params.id
  var bigc = [];
  var lotus = [];
  var makro = [];
  var s1 = [];
  var date = [];
  var datea;
  var lowestprice = 100000;
  var flag = 1;
  //var dateb  = new Date('1999-01-01');
 
  pool.query('SELECT * FROM public_b1.retail_comp WHERE item_id = $1 and ( SELECT max(timestamp) FROM public_b1.retail_comp )- date(timestamp) < 7 ;', [id], (error, results) => {
    if (error) {
      throw error
    }
    else{
      var dateb  = new Date('1999-01-01');
    
        var j = 0;
        var num = results.rows.length;
        var i = num/7;
        console.log(i)
       results.rows.forEach(element => {
           j++;
            datea  = new Date(element.timestamp);
             
            if(datea > dateb){
              dateb = datea;
              date.push(dateb);
              lowestprice = 1000000;
              
            }
            
            if((lowestprice >= element.price) && (element.price > 0)){
              lowestprice = element.price;
            }  

            if(j == i){
              s1.push(lowestprice)
              j = 0;
            }
            
            if(element.retail_name == "bigc"){
                  bigc.push(element.price)
            }else if(element.retail_name == "lotus"){
                  lotus.push(element.price)
            }else if(element.retail_name == "makro"){
                   makro.push(element.price)
            }

      });

    // res.json()
    var a = [];
    a.push({"date":date,"bigc":bigc,"lotus":lotus,"makro":makro,"s1":s1})
    // res.status(200).json(a[0].date)
    res.status(200).json(a)
      
  }
});
}
 
 //getUser
 const getUser = (req, res) => {
       const query = 'SELECT * FROM userlogin ORDER BY id DESC LIMIT 1;';
            //const query = 'SELECT * FROM public_b1.retail_comp;';
        
            pool.query(query,(err,result)=>{
                if(err){
                     console.log(err);
                }else{
                    res.status(200).json(result.rows)
                 }
            })
 }
 

//register
  const register = (req, res, next) => {
    const query = `INSERT INTO userlogin (firstname , lastname , image ,churn) VALUES ($1,$2,$3,$4)`;
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var image = req.body.bloblink;
    var churn = req.body.churn;
    var userid = "user1";

    
            pool.query(query,[firstname,lastname,image,churn],(err,result) => {
                if(err){
                    console.log(err);
                }else{

                     pool.query('SELECT COUNT(*) as userid FROM userlogin',(err,result) => {
                      if(err){
                        console.log(err);
                      }else{
                         res.status(200).send(result.rows[0]);
                         }
                     })
                   
                }
            })
         
       
    }



// insert buskets
const insertBusket = async (request, response) => {
  const item_code = request.body.item_code
  const userid = request.body.userid
  const price = request.body.price
  const productname = request.body.productname
  
  var today = new Date()
  await today.setHours(today.getHours() + 7);
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  
  pool.query('SELECT * FROM public_b1.buskets WHERE item_code = $1 and user_id = $2;', [item_code,userid], (error, results1) => {
    if (error) {
      throw error
    }
    //response.send(results1.rows[0])
    if(results1.rows.length > 0){
      var number = results1.rows[0].number
      number =  parseInt(number) + 1
      console.log(dateTime);
      pool.query('UPDATE public_b1.buskets SET number = $1 , update_time = $4 WHERE item_code = $2 and user_id = $3;', [number,item_code,userid,dateTime], (error, results2) => {})
      response.status(200).send('update')
    }
  else{
    console.log(dateTime);
    pool.query('INSERT INTO public_b1.buskets (item_code,user_id,price,item_name,number,update_time,promo) VALUES ($1, $2, $3, $4, 1, $5,0)', [item_code, userid,price,productname,dateTime], (error, results3) => {
  if (error) {
    throw error
  }else{
    response.status(200).send('Added')
  }
  })
 }
 })
}




// insert buskets offer
const insertBusketOffer = async (request, response) => {
  const item_code = request.body.item_code
  const userid = request.body.userid
  const price = request.body.price
  const productname = request.body.productname
  
  var today = new Date()
  await today.setHours(today.getHours() + 7);
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  
  pool.query('SELECT * FROM public_b1.buskets WHERE item_code = $1 and user_id = $2;', [item_code,userid], (error, results1) => {
    if (error) {
      throw error
    }
    //response.send(results1.rows[0])
    if(results1.rows.length > 0){
      var promo = results1.rows[0].promo
      var number = results1.rows[0].number
      number =  parseInt(number) + 2
      promo = parseInt(promo) + 1
      console.log(dateTime);
      pool.query('UPDATE public_b1.buskets SET number = $1 , update_time = $4 , promo = $5 WHERE item_code = $2 and user_id = $3;', [number,item_code,userid,dateTime,promo], (error, results2) => {})
      response.status(200).send('update')
    }
  else{
    console.log(dateTime);
    pool.query('INSERT INTO public_b1.buskets (item_code,user_id,price,item_name,number,update_time,promo) VALUES ($1, $2, $3, $4, 2, $5, 1)', [item_code, userid,price,productname,dateTime], (error, results3) => {
  if (error) {
    throw error
  }else{
    response.status(200).send('Added')
  }
  })
 }
 })
}






  module.exports = {
    getProd,
    getProdById3,
    getProdById4,
    getProdById2,
    insertBusket,
    getOfferbyId,
    getBuskets,
    getPic,
    register,
    getPriceGraph,
    insertBusketOffer,
    getProdById3offer,
    getGraph,
    getUser);
  }
