const mongoose =require('mongoose');
require('dotenv').config();

const connectionparams ={
    useNewUrlParser: true,
    useUnifiedTopology:true
}
const uri =`mongodb+srv://${process.env.MONGO_USER }:${process.env.MONGO_PASSWORD}@cluster0.yqhzb.mongodb.net/myBlog?retryWrites=true&w=majority`
const connection = mongoose.connect( uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));



module.exports = connection