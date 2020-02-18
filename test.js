// const promiseList = [];
// for (let i = 0; i < data.length; i++) {
//     var query = { '_id': mongoose.Types.ObjectId(data[i].coin_id) };

//     promiseList.push(new Promise(function(resolve, reject) {
//         coin_model.find(query, function (err, info) {
//             if (err) reject(err);

//             var obj = {
//                 coin_name: info[0].coin_code,
//                 data_info: data[i]
//             };

//             resolve(obj);
//         });
//     }));
// }

// // wait till all coin requests will be finished
// Promise.all(promiseList).then(function(results) {
//     console.log(results);
// });



