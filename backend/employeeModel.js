const mongoose = require('mongoose');
const schema = mongoose.Schema(
    {
    name:'string',
    email:'string',
    password:'string',
    empcode:'string',
    phone:'string'
},
{
    timestamps:true
})

const employee =  mongoose.model('employee', schema);
module.exports = employee;