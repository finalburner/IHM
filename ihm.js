"use strict";
var compression = require('compression')
const Version = '1.3.11'
console.log("IHM version : " + Version )
const sql = require('mssql');
const P = require(process.cwd() + '/config.ini')
var express = require('express');
var cors = require('cors');
var app = express();
var opn = require('opn');
var bodyParser = require("body-parser");
var morgan = require('morgan');
var http = require("http");
const AD = require('ad');
const fs = require('fs')

// Your AD account should be a member
// of the Administrators group.
const ad = new AD(P.LDAP);

app.use(compression())
// Binding express app to port 4000
app.listen(P.HTTP.PORT,function(){
    console.log('Node server running @ http://localhost:' + P.HTTP.PORT)
});

function closing_handler(signal)
{
  console.log("Closing SQL Connection")
  if(sql) sql.close()
  console.log("Closing Node Process")
  process.exit();
};

process.on('SIGINT', closing_handler);
process.on('SIGTERM', closing_handler);
process.on('uncaughtException', function(err) { //Deal with used port 3000 : switch to 3001
        if(err.errno === 'EADDRINUSE' && err.port === P.HTTP.PORT)
            { console.log('Port '+ P.HTTP.PORT+ ' already in use.');
             app.close();
             app.listen(P.HTTP.PORT, function(){
               console.log('listening on *: ' +  P.HTTP.PORT);
             });
           }
         });

// Utlisation de Cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

//app.use(parser.urlencoded({extended : true}));
app.use(morgan('dev')); //Log server
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//opn('http://localhost:4000', {app: 'chrome'});
sql.connect(P.SQL).then(function() {
  // Query
console.log('MS SQL connected success');
}).catch(function(err) {
        console.log(err.name + ' --> ' + err.code + ' : ' + err.message);
});

sql.on('error', err => {
   console.log("SQL_ERROR:" + err)
})

function query(query, req, res, read) { //read = true only for SELECT query
  var request =  new sql.Request()
  .query(query).then(function(rec) {
  if(read) { var ids = JSON.parse(JSON.stringify(rec.recordset).replace(/"\s+|\s+"/g,'"'))
  res.json(ids)
// console.log(ids)

}
  else res.send()
  }).catch(function(err) {
  console.log(err.name + ' --> ' + err.code + ' : ' + err.message);
  res.status(400).send(err)
  });
}


// Liste Contrat
app.get('/api/Contrat_List', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_CONTRAT', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

//List GRP EXPL COD
app.get('/api/Grp_Exp_List', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.execute('IHM_ID_GET_GRP_EXP_LIST', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});

// Liste CT SIGNALE
app.get('/api/CTH_SIGNALE_List', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_CT_SIGNALE', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

// Liste Type CT
app.get('/api/Type_CT_List', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_TYPE_CT', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});


// Liste Energies
app.get('/api/Energies_List', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_ENERGIE', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

// Liste Status
app.get('/api/Status_List', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_ETAT_CT', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});



// Appliquer un groupe à un utilisateur
app.post('/api/User_GroupeExp_Apply', function(req, res) {
  var b = req.body;
  console.log(b)
  var request = new sql.Request()
  request.input('LOGIN', sql.NVarChar, b.UGE_UTI_LOGIN)
  request.input('GROUPE', sql.NVarChar, b.UGE_GRE_NOM)
  request.input('AUTORIZED', sql.Bit, b.UGE_AUTORIZED)
  request.execute('IHM_UPDATE_USER_GRP_EXPLOITATION', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send("DONE")
  });
});


// Liste Groupe par utilisateur ( avec authorisation correspondante)
app.post('/api/User_GroupeExp', function(req, res) {
    var b = req.body;
    console.log(b)
    var request = new sql.Request()
    request.input('LOGIN', sql.NVarChar, b.user)
    request.execute('IHM_GET_USER_GRP_EXPLOITATION', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});


// Contenu Liste Equipement complete
app.get('/api/Liste_Equipement_ALL', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_LIST_EQUIPMENT_ALL', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});


// Procédure stockée Centre Thermique
app.post('/api/CT', function(req, res) {
var b = req.body;
// console.log(b)
var request = new sql.Request()
request.input('NUM_CT', sql.NVarChar, b.CT)
request.execute('IHM_GET_CENTRE_THERMIQUE', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset[0])
});
});

// Procédure stockée Groupe Exploitation
app.post('/api/Exp', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.input('NUM_CT', sql.NVarChar, b.CT)
request.execute('IHM_GET_CENTRE_THERMIQUE_EXPLOITANT', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});

// // Procédure stockée Liste Equipement totale ( modale d'ajout d'équipement)
// app.post('/api/Eqpt', function(req, res) {
// var b = req.body;
// console.log(b)
// var request = new sql.Request()
// request.execute('IHM_GET_CENTRE_THERMIQUE_GROUPE_EXPLOITATION', (err, result) => {
//   if (err) { console.log (err) ; res.status(400).send(err) }
//   else res.send(result.recordset)
// });
// });

// Procédure stockée Liste Equipement d'un centre thermique
app.post('/api/Eqpt', function(req, res) {
var b = req.body;
// console.log(b)
var request = new sql.Request()
request.input('NUM_CT', sql.NVarChar, b.CT)
request.execute('IHM_GET_CENTRE_THERMIQUE_EQUIPEMENT', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});

// Procédure stockée Recupere les infos resposable exploitant
app.post('/api/Resp_data', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.input('GRE_EXP_COD', sql.NVarChar, b.GRE_EXP_COD)
request.execute('IHM_GET_RESP_INFO', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset[0])
});
});

// Mise a jour des equipements
app.post('/api/Eqpt_Update', function(req, res) {
var b = req.body;
console.log(b)
const tvp = new sql.Table()
// Columns must correspond with type we have created in database.
tvp.columns.add('CTH_NUM_CT', sql.NVarChar)
tvp.columns.add('EQP_NUM', sql.NVarChar)
tvp.columns.add('EQP_CONTACT', sql.NVarChar)
tvp.columns.add('EQP_CONTACT_TEL', sql.NVarChar)
tvp.columns.add('EQP_CONTACT_MAIL', sql.NVarChar)
tvp.columns.add('OPERATION', sql.NVarChar)

for(var i=0;i<b.length;i++)
tvp.rows.add(
	  b[i].CTH_NUM_CT,
		b[i].EQP_NUM,
		b[i].EQP_CONTACT,
    b[i].EQP_CONTACT_TEL,
    b[i].EQP_CONTACT_MAIL,
		b[i].OPERATION,
	)

		console.log(tvp)

var request = new sql.Request()
request.input('CT_EQUIPEMENT', tvp)
request.execute('IHM_UPDATE_CENTRE_THERMIQUE_EQUIPEMENT', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send()
});
});


// Mise a jour des Exploitants
app.post('/api/Exp_Update', function(req, res) {
var b = req.body;
console.log(b)
const tvp = new sql.Table()
// Columns must correspond with type we have created in database.
tvp.columns.add('CTH_NUM_CT', sql.NVarChar)
tvp.columns.add('GRE_EXP_COD', sql.NVarChar)
tvp.columns.add('GRE_RESP_ADM', sql.NVarChar)
tvp.columns.add('GRE_RESP_TECHNIQUE', sql.NVarChar)
tvp.columns.add('GRE_CONTACT_HO', sql.NVarChar)
tvp.columns.add('GRE_CONTACT_HNO', sql.NVarChar)
tvp.columns.add('GRE_REF_INTERNE', sql.NVarChar)
tvp.columns.add('RXP_COD', sql.NVarChar)

for(var i=0;i<b.length;i++)
tvp.rows.add(
	  b[i].CTH_NUM_CT,
		b[i].GRE_EXP_COD,
		b[i].GRE_RESP_ADM,
    b[i].GRE_RESP_TECHNIQUE,
		b[i].GRE_CONTACT_HO,
		b[i].GRE_CONTACT_HNO,
		b[i].GRE_REF_INTERNE,
		b[i].RXP_COD
	)

		console.log(tvp)
var request = new sql.Request()
request.input('CT_EXPLOITATION', tvp)
request.execute('IHM_UPDATE_CENTRE_THERMIQUE_GROUPE_EXPLOITATION', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send()
});
});



// Procédure stockée Objet Fonctionnel
app.post('/api/GpeFonc', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.input('NUM_CT', sql.NVarChar, b.CT)
// request.output('output_parameter', sql.NVarChar)
request.execute('IHM_GET_CENTRE_THERMIQUE_GROUPE_FONCTIONNEL', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});

// Procédure stockée Objet Fonctionnel
app.post('/api/NbeGroup', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.input('NUM_CT', sql.NVarChar, b.CT)
request.execute('IHM_GET_NB_GROUPE_FONCTIONNEL', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});

// Procédure stockée Update
app.post('/api/CT_Update', function(req, res) {
var b = req.body;

if (b.CTH_SUPERVISE == "true") b.CTH_SUPERVISE = 1
if (b.CTH_SUPERVISE == "false") b.CTH_SUPERVISE = 0
console.log(b)
var request = new sql.Request()
// request.input('commentaire', sql.NVarChar, b.commentaire)
request.input('NUM_CT', sql.NVarChar, b.CTH_NUM_CT)
request.input('LOGIN', sql.NVarChar, b.LOGIN)
request.input('PUISSANCE_CT', sql.NVarChar, b.CTH_PUISSANCE_CT)
request.input('CONTRAT', sql.NVarChar, b.CTR_COD)
request.input('ENERGIE', sql.NVarChar, b.NRG_COD)
request.input('STATUT' , sql.NVarChar, b.STA_COD)
request.input('COMMENTAIRE' , sql.NVarChar, b.CTH_COM_ETAT_CT)
request.input('TYPE_CT' , sql.NVarChar, b.CTT_COD)
request.input('SUPERVISE' , sql.Bit, b.CTH_SUPERVISE)
request.input('DAT_PREV_RENOV' , sql.NVarChar, b.CTH_DAT_PREV_RENOV)
request.input('RMQ_PREV_RENOV' , sql.NVarChar, b.CTH_RMQ_PREV_RENOV)
request.input('DAT_DER_RENOV' , sql.NVarChar, b.CTH_DAT_DER_RENOV)
request.input('RMQ_DER_RENOV' , sql.NVarChar, b.CTH_RMQ_DER_RENOV)
request.input('P1' , sql.NVarChar, b.CTH_P1)
request.input('P2' , sql.NVarChar, b.CTH_P2)
request.input('P3' , sql.NVarChar, b.CTH_P3)
request.input('P4' , sql.NVarChar, b.CTH_P4)
request.input('CTH_SIGNALE' , sql.NVarChar, b.CTH_SIGNALE)
request.execute('IHM_UPDATE_CENTRE_THERMIQUE', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result)
});
});
//------------------------------------------------------------------------------
//Appel procédure stockée Recherche Simple CT
app.post('/api/RechSimpleCT', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.input('search', sql.NVarChar, b.search)
request.execute('IHM_SEARCH_SIMPLE_CT', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});
//------------------------------------------------------------------------------
//Appel procédure stockée Recherche Simple CT_EQP
app.post('/api/RechSimpleCTEQP', function(req, res) {
var b = req.body;
console.log(b)
var request = new sql.Request()
request.input('search', sql.NVarChar, b.search)
request.execute('IHM_SEARCH_SIMPLE_CT_EQP', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});


//------------------------------------------------------------------------------
// //Appel procédure stockée Profil Utilisateurs ---------
// app.post('/api/DroitsProfil', function(req, res) {
// var b = req.body;
// console.log(b)
// console.log('Test Droits Profil')
// var request = new sql.Request()
// request.input('LOGIN', sql.NVarChar, b.LOGIN)
// request.execute('IHM_ADM_GET_PROFIL_UTILISATEUR', (err, result) => {
//   if (err) { console.log (err) ; res.status(400).send(err) }
//   else res.send(result.recordset)
// });
// });
// //------------------------------------------------------------------------------
//Appel procédure stockée Groupe Fonctionnel Utilisateurs ---------
app.post('/api/DroitsGREP', function(req, res) {
var b = req.body;
console.log(b)
console.log('Test Fonction')
var request = new sql.Request()
request.input('LOGIN', sql.NVarChar, b.LOGIN)
request.execute('IHM_GET_USER_GRP_EXPLOITATION', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});
//------------------------------------------------------------------------------
//Appel procédure stockée liste profil utilisateurs ---------
app.post('/api/ProfilListe', function(req, res) {
var b = req.body;
console.log(b)
console.log('Test Profil')
var request = new sql.Request()
request.execute('IHM_GET_LIST_PROFIL', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});
//------------------------------------------------------------------------------
// Appel procédure stockée fonctions
app.post('/api/Fonctions', function(req, res) {
var b = req.body;
console.log(b)
console.log('Test Fonction')
// console.log(req);
var request = new sql.Request()
request.input('codeProfil', sql.NVarChar, b.UPR_COD)
request.execute('IHM_GET_PROFIL_FONCTION', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else res.send(result.recordset)
});
});


/////////////////////////////////// Recherche Simple  ///////////////////////////////////////////

app.get('/api/RechercheSimple', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_CONTENT_RECHERCHE_SIMPLE', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

/////////////////////////////////// Recherche Avancée  ///////////////////////////////////////////

// Contenu Recherche Avancee
app.get('/api/RechercheAvancee', function(req, res) {
  console.log("advsearch")
  var request = new sql.Request()
  request.execute('IHM_GET_CONTENT_RECHERCHE_AVANCEE', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

// Liste des collectivités
app.get('/api/Collectivite', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_COLLECTIVITE', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

// Liste des Status CT
app.get('/api/Status_CT', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_STATUS_CT', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

// Liste des status équipement
app.get('/api/Status_Equipement', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_STATUS_EQUIPEMENT', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});


// Liste des services gestionnnaires
app.get('/api/Service_Gestionnaire', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_SERVICE_GESTIONNAIRE', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});


// Liste des services fonctionnels
app.get('/api/Service_Fonctionnel', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_GET_SERVICE_FONCTIONNEL', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

/////////////////////////////////// API ADMIN PROFIL ///////////////////////////////////////////

//Appel procédure stockée Droits Utilisateurs
app.post('/api/Droits', function(req, res) {
var b = req.body;
// console.log(b)
var request = new sql.Request()
request.input('LOGIN', sql.NVarChar, b.LOGIN)
request.execute('IHM_GET_DROITS_UTILISATEUR', (err, result) => {
  if (err) { console.log (err) ; res.status(400).send(err) }
  else {
    var tab = result.recordset;
    console.log(tab)
    var OUTPUT = {}, i=0 ;
    for (i=0;i<tab.length;i++)
    {
      OUTPUT[tab[i].FON_COD] = tab[i].VAL;
    }
    res.send(OUTPUT)
  }
});
});
//
app.post('/api/UPDATE_PROFIL_FONCTION', function(req, res) {
var b = req.body;
	// var profil = new Object();

	var request = new sql.Request()
	request.input('LOGIN', sql.NVarChar, b.login)
	request.input('PROFIL', sql.NVarChar, b.PROFIL)
	request.input('FONCTION', sql.NVarChar, b.FONCTION)
	request.input('AUTORIZED', sql.Bit, b.AUTORIZED)
	request.execute('IHM_ADM_UPDATE_PROFIL_FONCTION', (err, rec) => {
	if (err) { console.log (err) ; res.status(400).send(err);}
	 else {
		  rec = rec.recordset;
			// console.log(rec)
			// for(var h=0; h<rec.length ; h++)
			// 	{
			// 		profil[rec[h].UPR_COD] = rec[h].UPR_LBL ;
			// 	}
			res.send(rec)
	 }
 })
})

app.post('/api/UPDATE_PROFIL_FONCTION_PARENT', function(req, res) {
var b = req.body;
	// var profil = new Object();

	var request = new sql.Request()
	request.input('LOGIN', sql.NVarChar, b.login)
	request.input('PROFIL', sql.NVarChar, b.PROFIL)
	request.input('FONCTION', sql.NVarChar, b.FONCTION)
	request.input('AUTORIZED', sql.Bit, b.AUTORIZED)
	request.execute('IHM_ADM_UPDATE_PROFIL_FONCTION_PARENT', (err, rec) => {
	if (err) { console.log (err) ; res.status(400).send(err);}
	 else {
		  rec = rec.recordset;
			// console.log(rec)
			// for(var h=0; h<rec.length ; h++)
			// 	{
			// 		profil[rec[h].UPR_COD] = rec[h].UPR_LBL ;
			// 	}
			res.send(rec)
	 }
 })
})

app.get('/api/LIST_PROFILS', function(req, res) {
	var profil = new Object();
	var request = new sql.Request()
	request.execute('IHM_ADM_GET_LIST_PROFIL', (err, rec) => {
	if (err) { console.log (err) ; res.status(400).send(err);}
	 else {
		  rec = rec.recordset;
			console.log(rec)
			for(var h=0; h<rec.length ; h++)
				{
					profil[rec[h].UPR_COD] = rec[h].UPR_LBL ;
				}
			res.send({ TAB : rec, OBJECT : profil })
	 }
 })
})


app.get('/api/LIST_FONCTIONS_CAT', function(req, res) {
	var fonction_cat = new Object();
	var request = new sql.Request();
	request.execute('IHM_ADM_GET_LIST_CAT', (err, rec) => {
	if (err) { console.log (err) ; res.status(400).send(err);}
	 else {
		rec = rec.recordset;
		for(var h=0; h<rec.length ; h++)
			{
				fonction_cat[rec[h].CAT_COD] = rec[h].CAT_LBL ;
			}
			res.send(fonction_cat)
	 }
 })
})

app.get('/api/LIST_FONCTIONS', function(req, res) {
	var fonction = new Object();
	var request = new sql.Request()
	request.execute('IHM_ADM_GET_FONCTIONS', (err, rec) => {
	if (err) { console.log (err) ; res.status(400).send(err);}
	 else {
		rec = rec.recordset;
		for(var h=0; h<rec.length ; h++)
			{
				fonction[rec[h].FON_COD] = rec[h].FON_LBL ;
			}
			res.send(fonction)
	 }
 })
})


app.get('/api/LIST_PROFIL_FONCTION', function(req, res) {
//OBJECT OUTPUT STRUCTURE
// { CATx :{ FONCTIONx : { PROFILx : VAL } } }
var OUTPUT = {}
var prop1, prop2,prop3,h;
	var request = new sql.Request()
		 request.execute('IHM_ADM_GET_PROFIL_FONCTION', (err, rec) => {
		 if (err) { res.status(400).send(err); console.log(err) }
		  else {
				  rec = rec.recordset
          // console.log(rec)
				  for(h=0; h<rec.length ; h++)
					  {
						prop2 = rec[h].FON_COD; //fonction
						prop3 = rec[h].FON_CAT_COD; //categorie

						if (OUTPUT[prop3])
						   {	if (OUTPUT[prop3][prop2])
							 				{
                        OUTPUT[prop3][prop2].push({ V : rec[h].VAL , PR_ID : rec[h].UPR_ID , PR_COD : rec[h].UPR_COD , P : rec[h].FON_ISPARENT })
											}
						     	else {
                      OUTPUT[prop3][prop2] = new Array();
      								OUTPUT[prop3][prop2].push({ V : rec[h].VAL , PR_ID : rec[h].UPR_ID , PR_COD : rec[h].UPR_COD  , P : rec[h].FON_ISPARENT})
											 }
								}
						else {
						   	OUTPUT[prop3] = new Object();
                OUTPUT[prop3][prop2] = new Array();
								OUTPUT[prop3][prop2].push({ V : rec[h].VAL , PR_ID : rec[h].UPR_ID , PR_COD : rec[h].UPR_COD , P : rec[h].FON_ISPARENT})
						}

				  	}
            // console.log(OUTPUT)
					res.send(OUTPUT)

			}
})
})

/////////////////////////////////// API ADMIN USER ///////////////////////////////////////////

function GET_AD_USER() {
  return new Promise(function (resolve, reject) {
				ad.user().get()

				  .then(users => {
					// console.log('Your users:', users);
					var i;
					var User_List = []
					for (i=0 ; i < users.length ; i++ )
					if (users[i].sn && users[i].givenName && users[i].sAMAccountName )
					User_List.push({ NOM : users[i].sn, PRENOM : users[i].givenName , USERNAME : users[i].sAMAccountName})
					resolve(User_List)
				  })
				  .catch(err => {
					reject(err)
				  });
})
}

// app.get('/api/AD_USER', function(req, res) {
//
// GET_AD_USER()
// 	.then(data => res.send(data))
// 	.catch(err => res.status(400).send(err))
//
// });

app.get('/api/NEW_USER', function(req, res) {

var SQL_LIST = [], AD_LIST = [], OUTPUT_LIST = [];
var j,i;
var request = new sql.Request()
	 request.input('VDP', sql.NVarChar, P.CONFIG.PROD)
	 request.execute('IHM_ADM_GET_USERS', (err, result) => {
	 if (err) { res.status(400).send(err); console.log(err) }
	  else {
		    	SQL_LIST = result.recordset;
			    GET_AD_USER()
				  .then(data => {
            // console.log(data)
					AD_LIST = data;
					for (i=0 ; i < AD_LIST.length ; i++ )
					{
          j= SQL_LIST.findIndex((obj) => { return obj.UTI_LOGIN == AD_LIST[i].USERNAME })
					// console.log(j)
				  if (j == -1) // utilisateur AD non présent dans SQL_LIST
					OUTPUT_LIST.push({ UTI_LOGIN : AD_LIST[i].USERNAME , UTI_NOM : AD_LIST[i].NOM , UTI_PRENOM : AD_LIST[i].PRENOM })
					}
					res.send(OUTPUT_LIST)
          // console.log(OUTPUT_LIST)
          // res.send({ SQL_LIST , AD_LIST })
				  })
				  .catch(err => console.log(err))
		      }
	  });
});

// Liste Users avec leurs profils correspondants et appartenance VDP // USED
app.get('/api/Users_Profil', function(req, res) {
  var request = new sql.Request()
  request.input('VDP', sql.NVarChar, P.CONFIG.PROD)
  request.execute('IHM_ADM_GET_USERS', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send(result.recordset)
  });
});

// Liste profils
app.get('/api/Profil', function(req, res) {
  var request = new sql.Request()
  request.execute('IHM_ADM_GET_LIST_PROFIL', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else  res.send(result.recordset)
  });
});



// OBTIENT LES INFORMATIONS UTILISTEUR
app.post('/api/USER_INFO', function(req, res) {
	var b = req.body;
  var request = new sql.Request()
	request.input('LOGIN', sql.NVarChar, b.username)
  request.execute('IHM_ADM_GET_USER_INFO', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else  res.send(result.recordset[0])
  });
});

// AJOUTE UN UTILISATEUR
app.post('/api/USER_ADD', function(req, res) {
	var b = req.body;
	var request = new sql.Request()
	request.input('UTI_LOGIN', sql.NVarChar, b.UTI_LOGIN)
	request.input('UTI_NOM', sql.NVarChar, b.UTI_NOM)
	request.input('UTI_PRENOM', sql.NVarChar, b.UTI_PRENOM)
	request.input('UTI_UPR_ID', sql.NVarChar, b.UTI_UPR_ID)
	request.input('UTI_HAB_ASTREINTE', sql.NVarChar, b.UTI_HAB_ASTREINTE)
	request.input('UTI_MAIL', sql.NVarChar, b.UTI_MAIL)
	request.input('UTI_ACTIF', sql.NVarChar, b.UTI_ACTIF)
	request.input('UTI_VDP', sql.NVarChar, P.CONFIG.PROD)
  request.execute('IHM_ADM_ADD_USER', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else  res.send(result.recordset)
  });
});

// MODIFIE UN UTILISATEUR
app.post('/api/USER_UPDATE', function(req, res) {
	var b = req.body;
	console.log(b)
	var request = new sql.Request()
	request.input('login', sql.NVarChar, b.login)
	request.input('UTI_ID', sql.Int, b.UTI_ID)
	request.input('UTI_LOGIN', sql.NVarChar, b.UTI_LOGIN)
	request.input('UTI_NOM', sql.NVarChar, b.UTI_NOM)
	request.input('UTI_PRENOM', sql.NVarChar, b.UTI_PRENOM)
	request.input('UTI_UPR_ID', sql.NVarChar, b.UTI_UPR_ID)
	request.input('UTI_HAB_ASTREINTE', sql.Bit, b.UTI_HAB_ASTREINTE)
	request.input('UTI_MAIL', sql.NVarChar, b.UTI_MAIL)
	request.input('UTI_ACTIF', sql.Bit, b.UTI_ACTIF)
	request.input('UTI_VDP', sql.Bit, b.UTI_VDP)

  request.execute('IHM_ADM_UPDATE_USER', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else  res.send("DONE")
  });
});

// SUPPRIME UN UTILISATEUR
app.post('/api/USER_DEL', function(req, res) {
	var b = req.body;
	console.log(b)
  var request = new sql.Request()
  request.input('UTI_LOGIN', sql.NVarChar, b.username)
  request.execute('IHM_ADM_DEL_USER', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else  res.send(result.recordset)
  });
});

// Update user profil
app.post('/api/UPDATE_UTI_PROFIL', function(req, res) {
  var b = req.body;
  console.log(b)
  var request = new sql.Request()
  request.input('login', sql.NVarChar, b.UTI_LOGIN)
  request.input('codeProfil', sql.NVarChar, b.UPR_COD)
  request.execute('IHM_ADM_UPDATE_PROFIL_UTILISATEUR', (err, result) => {
    if (err) { console.log (err) ; res.status(400).send(err) }
    else res.send('DONE')
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////------------------------------------------------------------------------------

app.use('/',  express.static(__dirname + '/www/')); //Fichier a servir
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next){
  res.status(404);
  // default to plain-text. send()
   res.type('txt').send('Not found');
});



let detail= 'VS_VERSION_INFO VERSIONINFO\n\r' +
'FILEVERSION ' + Version.replace(/\./g,',') + ',0\n\r' +
'PRODUCTVERSION '+ Version.replace(/\./g,',') +',0\n\r' +
'FILEOS 0x40004\n\r' +
'FILETYPE 0x1\n\r' +
'{ \n\r' +
' BLOCK "StringFileInfo"\n\r' +
'{ \n\r' +
'  BLOCK "040904b0"\n\r' +
'    {   VALUE "FileDescription", "IHM Identite - Administration"\n\r' +
'        VALUE "FileVersion", "' + Version + '"\n\r' +
'        VALUE "InternalName", "ihm.exe"\n\r' +
'        VALUE "LegalCopyright", ""\n\r' +
'        VALUE "OriginalFilename", "ihm.exe"\n\r' +
'        VALUE "ProductName", "IHM Identite - Administration"\n\r' +
'        VALUE "ProductVersion", "' + Version + '"\n\r' +
'        VALUE "SquirrelAwareVersion", "1"\n\r' +
'    }\n\r' +
'}\n\r' +
'BLOCK "VarFileInfo"\n\r' +
'{\n\r' +
' VALUE "Translation", 0x0409,1200\n\r' +
'}\n\r' +
'}';

fs.writeFile('version-info.rc', detail, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    console.log("Fichier de version généré")
});
