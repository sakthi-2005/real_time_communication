const express = require('express');
const app=express();
const passport = require('passport');
const githubstatergy = require('passport-github2').Strategy;
const session = require('express-session');
require('dotenv').config();

app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave : false,
    saveUninitialized : false,
    cookie:{
        maxAge : 7 * 24 * 60 * 60 * 1000,
        secure : false,
        httpOnly : true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((id,done)=>done(null,id));

passport.use(new githubstatergy({
    clientID : process.env.GITHUB_CLIENT_ID,
    clientSecret : process.env.GITHUB_CLIENT_SECRET,
    callbackURL : 'https://convo-space-f4ed.onrender.com/auth/github/callback'
},
(refreshtoken,acesstoken,profile,done)=>{
    return done(null,profile);
}));

let authenticated = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('/auth/github/callback');
    }
}
app.get('/',(req,res)=>{
    res.send(`
         <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>My HTML Response</title>
                    </head>
                    <body>
                        <h1>Welcome to My Website</h1>
                        <a href="/login">login</a>
                    </body>
                </html>`)
})

app.get('/login',authenticated,passport.authenticate('github',{ scope: ['user:email'], prompt: 'consent' }));

app.get('/auth/github/callback',passport.authenticate('github'),(req,res)=>{
        res.send(`
            <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>My HTML Response</title>
                    </head>
                    <body>
                        <h1>Welcome to My Website</h1>
                        <a href="/logout">logout</a>
                    </body>
                </html>`
                );
})

app.get('/logout',(req, res) => {
        req.logout((e)=>{
            if(e){
                console.log(e);
            }
            req.
            res.redirect('/');
        });
  });

app.listen(8000);
