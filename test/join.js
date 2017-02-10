db.getCollection('answer').aggregate([{
  $match : {
    id_question: ObjectId("589a193a60190632047fe979")
}
}, {
  $lookup : {
        from: "question",
        localField:"_id",
        foreignField:"id_question",
        as:"ans_question"
 }
}]);


