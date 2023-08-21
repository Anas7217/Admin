

require('dotenv').config();
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =require("passport-local-mongoose")
    

const { User, FixLaptop } = require("./model/User");
const port = process.env.PORT || 3000; 
var app = express();

// Update the Atlas URI and database name
const atlasUri =process.env.MONGO_URL;

mongoose.connect(atlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ... (remaining code remains the same)

// app.get("/", function (req, res) {
//     res.render("home");
// });
app.get("/", function (req, res) {
    res.render("login");
});

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Showing register form
// app.get("/register", function (req, res) {
//     res.render("register");
// });

// Handling user signup
// app.post("/register", async (req, res) => {
//     const user = await User.create({
//         username: req.body.username,
//         password: req.body.password
//     });
 
//     return res.status(200).json(user);
// });

//Showing login form
// app.get("/login", function (req, res) {
//     res.render("login");
// });

//Handling user login
app.post("/login", async function (req, res) {
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            //check if password matches
            const result = req.body.password === user.password;
            if (result) {
                res.render("secret");
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

//Handling user logout
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
const feedbackSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    phoneNo:{type:Number},
    subject:{type:String},
    message:{type:String},
    timestamp: { type: Date, default: Date.now }
}); 
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Define API endpoint to fetch data
app.get('/feedback', async (req, res) => {
  try {
    const feedbackData = await Feedback.find().sort({ timestamp: -1 });
    // console.log(feedbackData)
    res.render("feedback",{ feedbackData });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}



// FIX LAPTOP

//Adding Data

app.post("/add-product",  async (req, res) => {
    try {

      
        const laptop = await FixLaptop.create({
            username: req.body.username,
            productName: req.body.name,
            price: req.body.price,
            oldPrice:req.body.oldPrice,
            imageLink: req.body.image, 
            description: req.body.description,
            condition:req.body.condition,
            processor:req.body.processor,
            ram:req.body.ram,
            hardDisk:req.body.hardDisk,
            display:req.body.display,
            warranty:req.body.warranty,
            shipping:req.body.shipping,
        });
        await laptop.save();
        res.json({ success: true });
    } catch (error) {
        // res.send(error)
        // console.log(error);
        res.status(400).json({ error });
    }
});

//DELETE A PRODUCT


app.post('/delete-product', async (req, res) => {
    try {
        const { referenceNo } = req.body;
        // console.log(referenceNo);
        await FixLaptop.deleteOne({ _id: referenceNo }); // Assuming the 'refrenceNo' is the document _id
        //   alert("data deleted Successfully");
        res.json({ success: true });
        //   res.redirect('/login');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
});





app.listen(port, function () {
    console.log(`server has started at ${port}`);
});
