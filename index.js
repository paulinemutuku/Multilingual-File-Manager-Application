const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const i18next = require('./config/i18n');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');
const uploadRoutes = require('./Routes/uploadRoutes');
const session = require('express-session');
const passport = require('./config/passport');
const isAuthenticated = require('./middleware/authMiddleware')
const fileRoutes = require('./Routes/fileRoutes'); 
require('dotenv').config();

const app = express();
app.use(i18nextMiddleware.handle(i18next));
app.use('/locales', express.static(path.join(__dirname, 'locales')));

app.use(session({
  secret: '966290a9bfec4678973d9d147d064ae2948f18327e56289a602acc2f2f1adf3dc0f8db8697ef51e74707bb65fa93584f46cbef7bbe1720dc860e5eda51f7a4d', 
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/files', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'files.html'));
});

app.get('/files/uploaded', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'uploaded.html'))
})

// route to get the list of files
app.get('/api/list', fileController.getFileList);
app.get('/api/uploaded', fileController.getUploadedFiles);

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/files', uploadRoutes);
app.use('/api', fileRoutes);


app.post('/register', userController.register);
app.post('/login', userController.login);

app.post('/file', fileController.uploadFile);
app.get('/files/:filename', fileController.readFile);
app.post('/files/create', fileController.createFile)
app.put('/files/:filename', fileController.updateFile);
app.delete('/files/:filename', fileController.deleteFile);

// // Endpoint to create a new file
// app.post('/files/create', (req, res) => {
//   const { filename, content } = req.body;
//   const filePath = path.join(FILES_DIR, filename);

//   fs.writeFile(filePath, content, (err) => {
//       if (err) {
//           return res.status(500).send({ success: false, message: 'Failed to create file' });
//       }
//       res.status(200).send({ success: true, message: 'File created successfully' });
//   });
// });

app.put('/files/:filename', async (req, res) => {
  const { filename } = req.params;
  const { newFilename } = req.body;

  // try {
  //     res.json({ success: true });
  // } catch (error) {
  //     res.status(500).json({ success: false, message: 'Failed to rename file.' });
  // }
});

// Delete a file
app.delete('/files/:filename', async (req, res) => {
  const { filename } = req.params;

  // try {
  //     // Perform the file deletion operation here
  //     // Ensure you handle file deletion logic
  //     res.json({ success: true });
  // } catch (error) {
  //     res.status(500).json({ success: false, message: 'Failed to delete file.' });
  // }
});


app.get('/translate', (req, res) => {
  res.send(req.t('welcome_message'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
