
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
  pool.query('SELECT item_code , new_name , item_pic , qr_pic FROM public_b1.item_offer WHERE item_code IN (SELECT pred_item1 FROM public_b1.item_offer WHERE item_code = $1) OR item_code IN (SELECT pred_item2 FROM public_b1.item_offer WHERE item_code = $1) ;', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


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


const getProdById4 = (request, response) => {
  //const id = request.params.id
  pool.query('SELECT * FROM public_b1.retail_comp WHERE timestamp IN (SELECT max(timestamp) FROM public_b1.retail_comp);',(error, results) => {
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
const insertBusket = (request, response) => {
  const item_code = request.body.item_code
  const userid = request.body.userid
  const price = request.body.price
  const productname = request.body.productname
  var today = new Date();
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
    pool.query('INSERT INTO public_b1.buskets (item_code,user_id,price,item_name,number,update_time) VALUES ($1, $2, $3, $4, 1, $5)', [item_code, userid,price,productname,dateTime], (error, results3) => {
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
    register
  }
