const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken")
app.use(express.json());


mongoose.connect('mongodb+srv://akshatasarwade15:aks%40123@cluster1.rpqwa.mongodb.net/users_details')
const User = mongoose.model('users',{username : String, email : String , password : String});

// signup 
app.post("/signup", async function(req , res){
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;

    const existingUser = await User.findone({email : username});

    if (existingUser){
        return res.status(400).send("username already exists");
    }
    const user = new User({
        name : name,
        email : username,
        password : password
    });
    user.save();
    res.json({
        "msg" : "User Created Successfully"
    })
});
app.listen(3000);

//login
app.get("/api/login", async function(req ,res){
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await User.findone({email : username});

    if (!existingUser(username , password)){
        return res.status(401).send("Invalid Credentials");
    }
    var verifyToken = jwt.login({username : username},{password :password});    
    return res.json({verifyToken});
});

app.get("/api/list", verifyToken , function(req ,res){
    const token = req.headers.authorization;
    const decoded = jwt.verify(token , password);
    const username = decoded.username;
    res.json({message: `Authorized: List of ${username} fetched successfully`});
});

app.post('/api/post', verifyToken , function(req, res){
    res.json({message: 'Authorized: Data posted successfully'});
});

app.delete('/api/delete/:id', verifyToken, function (req, res){
    const dataId = req.params.id;
    res.json({message: `Authorized: Data with ID ${dataId} deleted successfully` });
});

app.put('/api/update/:id', verifyToken, function (req, res){
    const dataId = req.params.id;
    res.json({message: `Authorized: Data with ID ${dataId} updated successfully` });
});




