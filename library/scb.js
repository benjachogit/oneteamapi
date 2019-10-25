var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbconfig = require('./db');

const signup = (request, response) => {
    console.log(request.body)

    var empid = request.body.empid
    var fname = request.body.fname
    var lname = request.body.lname
    var fid = request.body.fid

    var connection = new Connection(dbconfig.config);
    var rowss = []

    // Attempt to connect and execute queries if connection goes through
    
    connection.on('connect', async function(err)
        {
            
            if (err)
            {
                console.log("AAAAAA")
            }
            else
            {
                  // Read all rows from table
                let request = new Request(
                    "INSERT INTO signup VALUES(@empid,@fname,@lname,@fid)",
                    function(err, rowCount, rows)
                    {
                        if(err){
                            console.log("AA")
                        }else{
                            connection.close()
                        }
                    }
                )
                
                
                
                request.addParameter('empid',TYPES.VarChar ,empid);  
                
                request.addParameter('fname',TYPES.VarChar ,fname);  
                
                request.addParameter('lname',TYPES.VarChar ,lname);  
                
                request.addParameter('fid',TYPES.VarChar ,fid);  


                    



                request.on('row', function (columns) {
                    var row = {};
                    columns.forEach(function (column) {
                        row[column.metadata.colName] = column.value;
                    });
                    rowss.push(row);
                });
                request.on('doneInProc', function () {
                    response.json(rowss);
                });

                connection.execSql(request);  
                
             
                
               
               
                    
            }
            
        }
    );
    
   
  }


module.exports = {signup}
                 
 