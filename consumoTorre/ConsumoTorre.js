var express = require('express');
var fs = require("fs");
//var SqlConfig = fs.readFileSync("../../SQL.json");
var router = express.Router();

const sql = require('mssql');
//var SqlConex = JSON.parse(SqlConfig);
var SqlConex = 
{
    "user": "sa",
    "password": "control1*",
    "server": "192.168.0.196",
    "database": "ION_DataConfig",
    "pool": {
        "max": 60,
        "min": 0,
        "idleTimeoutMillis": 30000
    }
};

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", 'GET, PUT, PATCH, POST, DELETE');
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });

router.get('/ConsumoTorre', async function(req, res){
	console.log(req.query.FI+" - "+req.query.FF+" - "+req.query.SIDInicio+" - "+req.query.SIDFinal);
    await sql.connect(SqlConex, err =>{
	   	new sql.Request()
		.input('FI', req.query.FI)
		.input('FF', req.query.FF)
		.input('SIDI', req.query.SIDInicio)
		.input('SIDF', req.query.SIDFinal)
		.execute('ConsumoTorre', async (err, result) => {
            console.log(result);
			let arr=  await result.recordsets[0];
			res.status(200).json(arr);
			sql.close();
		},
		(err)=>{
			console.log(err);
		})
	});
});

module.exports = router;