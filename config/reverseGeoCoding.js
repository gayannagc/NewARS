const fetch = require("node-fetch");
const nearestRoads = require("nearest-roads");

// var LAT = 6.797714;
// var LNG = 79.890323;

areaCodes = {
    western : "21"
};
//console.log(areaCodes['western'])

function reverseGeoCoding(LAT,LNG,){
    return new Promise((resolve,reject) => {
        
        const KEY = "AIzaSyAtpbrLcoI0i0-yuXVImpDqDoRd32-NTfo";
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}&key=${KEY}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            var locationDetails = new Object();
            let parts = data.results[0].address_components;
            parts.forEach(part => {
                if (part.types.includes("country")) {
                    locationDetails.country = part.long_name
                }
                if (part.types.includes("administrative_area_level_1")) {
                    locationDetails.administrative_area_level_1 = part.long_name
                }
                if (part.types.includes("administrative_area_level_3")) {
                    locationDetails.administrative_area_level_3 = part.long_name
                }
                if (part.types.includes("route")) {
                    locationDetails.route = part.long_name
                    }
                });
            return locationDetails;
        })
        .then(locationDetails => {
            if(locationDetails.administrative_area_level_1 = 'Western Province'){
                resolve('21')
            }
        })
        .catch(err => reject("error"));     
    })
}

function getRoad(LAT,LNG){
    // console.log(LAT);
    // console.log(LNG);
    return new Promise((resolve,reject) => {
        nearestRoads.fromLocation(parseFloat(LAT),parseFloat(LNG), 100, (err, data) => {
            if (err || typeof data[0] === "undefined") reject("error");
            else 
            {
                resolve(data[0].name)
            };
    });
  })
}
// var LAT = 6.797714;
// var LNG = 79.890323;
// // var signs = new Object();
// let promises = [reverseGeoCoding(LAT,LNG),getRoad(LAT,LNG)]
// Promise.all(promises).then(results => {
//     console.log(results[0]);
//     console.log(results[1])
// })



module.exports = {
    reverseGeoCoding : reverseGeoCoding,
    getRoad : getRoad
};
