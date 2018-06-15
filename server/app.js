const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // used for session cookie
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const axios = require('axios');

const redisConfig = require('./redisConfig');
const credentials = require('./credentials.js');
const schedule = require('./schedule');
const users = require('./users');
const table = require('./table');
var invitedUsers = require('./invitedUsers');

// Add oauth2 passport strategies here
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const node_env = process.env.node_env || 'development';
if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
}

const app = express();
const httpServer = http.createServer(app);
app.set('trust proxy', 1);
app.enable("trust proxy");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const sessionOptions = {
  secret: credentials.session.secret,
	name: credentials.session.name,
  maxAge: 60 * 60 * 1000, // Token expiration time
  proxy: true,
  resave: true,
  saveUninitialized: true
};

/*
 * You need redis to store user session in prod.
 * You can comment this block in development.
*/
var redisCreds = redisConfig.getRedisCredentials();
if (redisCreds) {
  console.log('Using Redis for session store.');
  const RedisStore = require('connect-redis')(session);
  sessionOptions.store = new RedisStore({
    host: redisCreds.host,
    port: redisCreds.port,
    pass: redisCreds.password,
    ttl: 1800 // seconds = 30 min
  });
}

app.use(cookieParser(credentials.session.secret));
app.use(session(sessionOptions));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: credentials.google.clientId,
	clientSecret: credentials.google.secret,
	callbackURL: 	devConfig ? devConfig.callback : 'https://wc-fantasy.run.aws-usw02-pr.ice.predix.io/auth/google/callback',
	passReqToCallback: true,
	proxy: true
},
function(request, accessToken, refreshToken, profile, done) {
	// console.log('user id', JSON.stringify(profile, null, 2));
	const user = {
		id: profile.id,
		email: profile.email,
		name: profile.displayName,
		bets: {}
	}

	// TODO: Invoke he findOrCreate function here
	if(invitedUsers.indexOf(profile.email) !== -1) {
		users.findOrCreate(user);
		pointstable = [];
		table.getTable(users.users, pointstable);
	}
	return done(null, user);
}
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/home',
		failureRedirect: '/auth/google',
}));


const isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
		if(invitedUsers.indexOf(req.user.email) !== -1)
			next();
	}
  else
    res.redirect('/auth/google');
}

//Use this route to make the entire app secure.  This forces login for any path in the entire app.
app.use('/',
	express.static(path.join(__dirname, '../'))
);

app.use('/rules',
	express.static(path.join(__dirname, '../rules.html'))
);

app.use('/home',
	isAuthenticated,
	express.static(path.join(__dirname, '../home.html'))
);

var matches = [];
var finishedMatches = [];
var pointstable = [];

/************************** Set up ends here. Add your endpoints below *********************************/

const start = () => {
	console.log('Updating the Points Table...');
	var temp = [];
	if(users.shouldGetNewUsers()) {
		console.log('Getting new Users');
		users.getUsers()
		.then(() => {
			schedule.getMatches(temp).then(() => {
				if(JSON.stringify(matches) !== JSON.stringify(temp)) {
					matches = temp;
					pointstable = [];
					table.calculatePoints(users.users, matches);
					table.getTable(users.users, pointstable);
				}
			})
			.catch(err => {
				console.log('err ', err);
			});
		})
	} else {
		schedule.getMatches(temp).then(() => {
			if(JSON.stringify(matches) !== JSON.stringify(temp)) {
				matches = temp;
				pointstable = [];
				table.calculatePoints(users.users, matches);
				table.getTable(users.users, pointstable);
			}
		})
		.catch(err => {
			console.log('err ', err);
		});
	}
}

setInterval(() => {
	start();
}, 10*60*1000); //Update the points table every 10 mins

start();

app.get('/matches', (req, res) => {
	res.send(matches);
});

app.post('/bet', (req, res) => {
	users.addBet(req.user.id, req.body.matchId, req.body.team, req.body.teamName);
	res.status(200).send();
});

app.get('/me', (req, res) => {
	res.send(users.users[req.user.id]);
});

app.get('/profile', (req, res) => {
	res.send(users.users[req.query.id]);
})

app.get('/table', (req, res) => {
	res.send(pointstable);
});

app.get('/admin/update-users', (req, res) => {
	users.getUsers();
	res.send('Users Updated....')
});

app.get('/admin/invited-users', (req, res) => {
	invitedUsers = require('./invitedUsers');
	res.send('Users Updated....')
});

////// error handlers //////
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
	app.use(function(err, req, res, next) {
		if (!res.headersSent) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

httpServer.listen(process.env.VCAP_APP_PORT || 5000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;