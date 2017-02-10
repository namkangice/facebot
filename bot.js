var login = require('facebook-chat-api');
var MongoClient = require('mongodb').MongoClient;


/*MongoClient.connect("mongodb://localhost:27017/facebotdb",function(err,db){
	if(err) return console.error(err);
	
	var collection = db.collection('question');
	collection.find().toArray(function(err,result){
		if(err){
			console.log(err);
		} else if (result.length){
			console.log("Found: ", result);
		} else {
			console.log("No document(s) found");
		}
	});

});*/

// Create bot
login({email: "tanakitice@windowslive.com", password: "ICE235689ac"}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({
      //selfListen: true,
      logLevel: "warn"
    });

    api.listen(function callback(err, message) {
    	

    MongoClient.connect("mongodb://localhost:27017/facebotdb",function(err,db){
	if(err) return console.error(err);
	
	var collection = db.collection('question');
	var collection2 = db.collection('answer');
	collection.find({question:message.body,type:"Q"}).toArray(function(err,result){
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
				api.sendMessage(""+rs[0].answer, message.threadID);
			});
			 
		}else if(message.body === undefined){
    	 var msg = {
  		 	body: "Your sticker",
  		 	sticker: message.attachments[0].stickerID,
  		 	}
  		api.sendMessage(msg, message.threadID);
  			console.log(message);
			console.log("\n*************************\n");
			console.log(msg);
    	} else  {
    		var id_sender = message.senderID;
			console.log("No document(s) found");
			/**************************/
			collection.insert({
				id_user:message.senderID,
				question:message.body,
				type:"Q"
				});
			console.log("insert question successfully ");
  			//db.close();
  			/**************************/
			collection.find({question:message.body}).toArray(function(err,result){
				if(err){
						console.log(err);
					}
				console.log("--------------"+result[0].type);
				if(result[0].type === "Q"){
					api.sendMessage("ฉันไม่รู้จัก ควรตอบว่ายังไงดี?", message.threadID);
					collection2.insert({
						id_question:result[0]._id,
						id_user:message.senderID,
						answer:message.body
					});
				}else{

				}
			});
			
			
			
		}
		//db.close();
	});

});

		
       
    });
});