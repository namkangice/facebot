var login = require("facebook-chat-api");
var MongoClient = require('mongodb').MongoClient;

login({email: "tanakitice@windowslive.com", password: "ICE235689ac"}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({listenEvents: true});

    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);

        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });

                MongoClient.connect("mongodb://localhost:27017/facebotdb",function(err,db){
				if(err) return console.error(err);
				
				var collection = db.collection('question');
				var collection2 = db.collection('answer');
				collection.find({question:event.body}).toArray(function(err,result){
					if(err){
						console.log(err);
					} else if (result.length){
						console.log("Found: ", result);
						collection2.aggregate([{
											$match : {
											    id_question: result[0]._id
													 }
											}, {
											$lookup : {
											        from: "question",
											        localField:"_id",
											        foreignField:"id_question",
											        as:"ans_question"
													}
											}]).toArray(function(err,rs){
							console.log("Found: ", rs[0].answer);
							api.sendMessage(""+rs[0].answer, event.threadID);
						});
						 
					} else {
						console.log("No document(s) found");
						api.sendMessage("No document(s) found", event.threadID);
					}
					db.close();
				});

			});
            break;
          case "event":
            console.log(event);
            break;
        }
    });
});