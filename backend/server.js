const { count } = require('console');
const express = require('express');
var jwt = require('jsonwebtoken');
const app = express();
const db = require('./connection');
const bcrypt = require('bcrypt');
const employeeModel = require('./employeeModel');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
let cors = require("cors");
app.use(cors());

// logIN
app.post('/login',async(req, res)=>{
    console.log("login test");
    var {email,password} = req.body;
    try{
       let employee = await employeeModel.findOne({email:email})
        if(employee) {
            let employeeCheck = await employeeModel.findOne({email:email});
            let checkPassword = await bcrypt.compare(password,employeeCheck.password);
            if(employeeCheck && checkPassword == true) 
            {
                let token = jwt.sign(
                    {
                      employee_id :employee._id
                    },
                      process.env.JWT_SECRET_KEY,
                    { 
                        expiresIn: '1h' 
                    });
                return res.json(token);
            }
            else {
                return res.status(500).send("Unauthorized User");
            }
        }
        else {
        password = await bcrypt.hash(password,5);
        const newEmployee = await employeeModel.create({email,password});
        let token = jwt.sign(
            {
            employee_id :newEmployee._id
            },
            process.env.JWT_SECRET_KEY,
            { 
                expiresIn: '1h' 
            });
        return res.json(token);
        }
       }
    catch(error){
        console.log(error);
        res.status(500).send(error)
    }
});

// crud applications
app.post('/',async(req, res)=>{
    console.log("TEST LIST");
    var {name,email,password,empcode,phone} = req.body;
    console.log(name,email,password,phone);
    try{
        password = await bcrypt.hash(password,5);
        const newEmployee = await employeeModel.create({name,email,password,empcode,phone});
        console.log(newEmployee,"vgjhgvjhgmj");
        res.json(newEmployee)
       }
    catch(error){
        res.status(500).send(error)
        }
})
app.get('/', async(req, res)=>{
    try{
        const employeeList = await employeeModel.find();
        res.json(employeeList)
    }
    catch(error){
        res.status(500).send(error)
    }
})
app.get('/:id', async(req, res)=>{
    const id = req.params.id;
    console.log("NKJnkjnn",id);
    try{
        const newEmployee = await employeeModel.findById(id);
    
        res.json(newEmployee);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error)
    }
}) 
app.put('/:id', async(req, res)=> {
    const id = req.params.id;
    var {name,email,password,empcode,phone} = req.body;
    try {
        password = await bcrypt.hash(password,5);
        const newEmployee = await employeeModel.findByIdAndUpdate(id, {name,email,password,empcode,phone});
        res.json(newEmployee);
        
    } 
    catch (error) {
        res.status(500).send(error)
        
    }
})
app.delete('/:id', async(req, res)=>{
    const id= req.params.id;
    try {
        const newEmployee = await employeeModel.findById(id)
        await newEmployee.remove();
        res.json('Deleted Successfully')
        
    } catch (error) {
    
            res.status(500).send(error)
            
        
    }
})

app.post('/verify-token', async(req,res)=> {
    try {
       console.log("TRIGGER",req.body.token);
       var { token } = req.body;
       var isAccess = jwt.verify(token,process.env.JWT_SECRET_KEY)
       console.log("isAccess",isAccess);
       if(isAccess) {
           res.json({ access: true})
       }
       else {
           res.json({ access:false });
       }
    }
    catch(error) {
        res.status(500).send(error);
    }
})

 app.listen(3005, ()=>{
    console.log('listeing to the 3005')
});
