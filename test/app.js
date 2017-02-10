var login = require("facebook-chat-api");
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/facebotdb';

// Create simple echo bot
login({ email: "chatbotran1934@hotmail.com", password: "chatbot1934" }, function callback(err, api) {
    if (err) return console.error(err);

 	var rs="test";


function insert(user,word){
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  
  db.collection('answer').insert({
  	id_question:user,
  	answer:word
  });
  console.log("insert successfully ");
  db.close();
});
}

function insertq(user,word){
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  
  db.collection('question').insert({
  	id_user:user,
  	question:word
  });
  console.log("insert successfully ");
  db.close();
});
}

function findid(id){
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  
			 var result = db.collection('question');
				result.find().toArray(function (err, docs) {
				    if(docs[0]._id == id){
				    console.log(docs)
				    api.sendMessage("" + docs[0].question, event.threadID);
					}else{
						api.sendMessage("มันคือะไรวะ สอนกูดิ้" , event.threadID);
						insertq(docs[0].event.senderID,event.body);
						findid()
						insert(docs[0]._id,event.body);

					}
				});
  db.close();
});
}


            function find(user,word){
			  MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			 // console.log("Connected db successfully ");

			 var result = db.collection('question');
				result.find().toArray(function (err, docs) {
				    if(docs[0].question == word){
				    	console.log(docs[0].question)
				    	 
				    	return rs="a";
					}else{
						rs="b";
						return rs;
						//find(id);
						

					}
				});
			  // db.close();
			});
			}

 api.setOptions({listenEvents: true});

    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
        
        switch(event.type) {
          case "message":
        	 // api.sendMessage("สวัสดีเราชื่อ TEST BOT " , event.threadID);
            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            //step 1

            var s = find(event.senderID,event.body)
            if(s=="a"){
            	console.log("เ***************เจอ"+s);
            }else{
            	console.log("เ***************เไม่จอ"+s);
            }
            break;
            
            
          case "event":
            console.log(event);
            break;
        }
    });



// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});*/


});