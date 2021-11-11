var express = require('express');
var fs = require("fs");
var SqlConfig = fs.readFileSync("./consumoTorre/SQL.json");
var router = express.Router();

const sql = require('mssql');
var SqlConex = JSON.parse(SqlConfig);

router.get('/TorreMAX', async function(req, res){
	sql.close();
    await sql.connect(SqlConex);
    const request = new sql.Request();
		request.query(`Select * From DataLog2 dl
		Where ID = (Select top 1 ID From DataLog2 dl2 Where dl.SourceID = dl2.SourceID And dl2.QuantityID = 129 And
		TimestampUTC between '`+req.query.FI+` 06:00:00.0000000' And '`+req.query.FF+` 06:00:00.0000000'
		And dl2.SourceID between `+req.query.SIDInicio+` And `+req.query.SIDFinal+` AND Value is not null Order by Value DESC)`, (error, maximo) =>{
			if (error) console.log(error);
			console.log('Consumo maximo');
			res.status(200).json(maximo.recordsets[0]);
			sql.close();
		});	
});

module.exports = router;