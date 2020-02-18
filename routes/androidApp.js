const express = require('express');
const router = express.Router();
const rd_sign = require('../models/road_sign')
const multer = require('multer');
const mongoose = require('mongoose');
const config = require('../config/database')
const categorization = require('../config/categorization')
const locatingFunctions = require('../config/reverseGeoCoding')

router.get('/locations/:code', function(req,res){
    var query = {areaCode : req.params.code}
    rd_sign.find({}, function(err, locations){
        if(err){
            res.json({locations : 'not available'})
        }else{
            let locationList = [];
            locations.forEach(function(location, index){
                if(location.areaCode == query.areaCode){
                    var data = {
                        id : location._id,
                        longitude : location.long,
                        lattitude : location.lat,
                        heading : location.head,
                        image_code : location.code
                    }
                    locationList.push(data);
                }
                
            })            
            res.json(locationList)
        }
    })
})

router.post('/upload/locations', function(req,res){

    let promises = [locatingFunctions.reverseGeoCoding(req.body.latitude,req.body.longitude),locatingFunctions.getRoad(req.body.latitude,req.body.longitude)];
    Promise.all(promises)
        .then(results => {
            let signs = new rd_sign();
            signs.sign_name = req.body.sign_name;
            signs.long = req.body.longitude;
            signs.lat = req.body.latitude;
            signs.head = req.body.heading;
            signs.road = results[1];
            signs.areaCode = results[0];
            signs.code = req.body.image_code;
            return signs
        }).then(signs => {
            signs.save(function(err){
                if(err){
                    console.log('submit error: ',err)
                    return;
                }else{
                    req.flash('success','Road Sign Added');
                    res.redirect('/');
                }
            });

        })
    
    
    // locatingFunctions.reverseGeoCoding(req.body.latitude,req.body.longitude)
    // .then(areaCode => {
    //     let signs = new rd_sign();
    //     signs.sign_name = req.body.sign_name;
    //     signs.long = req.body.longitude;
    //     signs.lat = req.body.latitude;
    //     signs.head = req.body.heading;
    //     signs.areaCode = areaCode;
    //     signs.code = req.body.image_code;
    //     return signs
    // }).then(signs => {
    //     return locatingFunctions.getRoad(req.body.latitude,req.body.longitude,signs)
    // }).then(signs => {
    //     signs.save(function(err){
    //         if(err){
    //             console.log('submit error: ',err)
    //             return;
    //         }else{
    //             req.flash('success','Road Sign Added');
    //             res.redirect('/');
    //         }
    //     });  
    // })   
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/active_rs";

router.get('/versionNumber', (req,res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("road_signs").count({areaCode : "21"}, function(err, result) {
          if (err) throw err;
          res.json({count : result});
          db.close();
        });
      });
})

module.exports = router;