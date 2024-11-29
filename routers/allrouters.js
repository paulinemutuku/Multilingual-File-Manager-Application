const express = require('express');
const router = express.Router();

const filesController = require('../controllers/filescontroller');
const usersController = require('../controllers/userscontroller');
const sessionController = require('../controllers/sessionController');

router.get('/getsession', usersController.getSession);
router.post('/register', usersController.createUser);
router.post('/user/login', usersController.loginUser);
router.get('/users/:id', usersController.getUser);
router.put('/users/:id', usersController.updateUser);
router.delete('/deleteUser', usersController.deleteUser);
router.get('/allusers', usersController.getAllUsers);
router.delete('/deleteAllUsers', usersController.deleteAllUsers);
router.get('/logout', usersController.logoutUser);

router.post('/upload', filesController.uploadFile);
router.get('/allFiles', filesController.allFiles);
router.get('/userFiles', filesController.userFiles);
router.delete('/deleteFile/:id', filesController.deleteFile);
router.delete('/deleteAllFiles', filesController.deleteAllFiles);

router.get('/getAllSessions', sessionController.getAllSessions);
router.get('/getSessionByUserId/:id', sessionController.getSessionByUserId);

module.exports = router;
