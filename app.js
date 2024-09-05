const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://srgibosque:NNQ3XHX3%40!8Nyrn@cluster0.oyxb5.mongodb.net/shop?w=majority&appName=Cluster0'

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// Sets ejs as the default template engine
app.set('view engine', 'ejs');
// tells express in which folder the templates are located
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//It parses the requests
app.use(bodyParser.urlencoded({ extended: false }));
//loads static files like css
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Middleware to pass a user to every incoming request
app.use((req, res, next) => {
  User.findById('66d6c23edbc05c117ae178d0')
    .then(user => {
      //We assing a new property to the req object
      req.user = user;
      // Goes to the next request
      next();
    })
    .catch(err => console.error(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Sergi',
            email: 'sbosque@test.com',
            cart: {
              items: []
            }
          });
          user.save();
        }
      });
    app.listen(3000);
  })
  .catch(err => console.error(err));
