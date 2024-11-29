const userController = require('./controllers/userController');

app.post('/register', userController.register);
app.post('/login', userController.login);