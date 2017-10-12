const express = require('express')
, bodyParser = require('body-parser')
, cors = require('cors')
, massive = require('massive')
, session = require('express-session')
, passport = require('passport')
, Auth0Strategy = require('passport-auth0')
require('dotenv').config()


let app = express()
app.use(bodyParser.json());
app.use(cors());
massive(process.env.CONNECTION_STRING).then( db =>{
app.set('db', db)
console.log('connected')  
}  );


app.use(session({
secret: process.env.SECRET,
resave: false,
saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());//allowing the passport library to use our sessions

passport.use(new Auth0Strategy({
domain: process.env.AUTH_DOMAIN,
clientID: process.env.AUTH_CLIENTID,
clientSecret: process.env.AUTH_CLIENT_SECRET,
callbackURL: 'http://localhost:3013/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done){
// const db = app.get('db')

// db.find_user([ profile.identities[0].user_id ]).then( user => {
//     if(user[0]){
//         return done(null, user[0].id);
//     } else {
//         res.redirect(404, 'http://localhost:3000/' )
//     }
// })

done(null, profile);
}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
successRedirect: 'http://localhost:3000/',
failureRedirect: '/auth'
}))

app.get('auth/me', (req, res) => {
if(!req.user) {
return res.status(401).send('No user found')
}
return res.status(200).send(req.user)
})

passport.serializeUser( (user, done) => {
//user = profile from above
done(null, user);
})
passport.deserializeUser( (user, done) => {
done(null, user);
})




const PORT = 3013
app.listen(PORT, () => {
console.log(`listening on ${PORT}`)
})

