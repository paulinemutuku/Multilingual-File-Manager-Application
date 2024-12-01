const request = require('supertest');
const app = require('../app'); // assuming your Express app is in app.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

jest.mock('../config/db'); // Mock the DB module
jest.mock('../config/queue'); // Mock the file processing queue module

describe('File Controller Tests', () => {

  // Test for creating a file
  describe('POST /create', () => {
    it('should create a new file and save it in the database', async () => {
      const fileData = { filename: 'test.txt', content: 'Hello, world!' };

      db.query.mockResolvedValueOnce({ insertId: 1 });

      const response = await request(app)
        .post('/create')
        .send(fileData);

      expect(response.status).toBe(200);
      expect(response.text).toBe('File created successfully');
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO files (filename, path) VALUES (?, ?)', 
        [fileData.filename, expect.any(String)]
      );
    });

    it('should return an error if there is an issue creating the file', async () => {
      const fileData = { filename: 'test.txt', content: 'Hello, world!' };

      fs.writeFile = jest.fn().mockImplementationOnce((file, content, cb) => cb(new Error('Error')));

      const response = await request(app)
        .post('/create')
        .send(fileData);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error while creating file');
    });
  });

  // Test for reading a file
  describe('GET /:filename', () => {
    it('should return the content of the file', async () => {
      const filename = 'test.txt';
      const filePath = path.join(__dirname, '../uploads', filename);
      const fileContent = 'Hello, world!';
      
      fs.readFile = jest.fn().mockImplementationOnce((file, encoding, cb) => cb(null, fileContent));

      const response = await request(app)
        .get(`/${filename}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe(fileContent);
    });

    it('should return an error if the file is not found', async () => {
      const filename = 'test.txt';
      const filePath = path.join(__dirname, '../uploads', filename);

      fs.readFile = jest.fn().mockImplementationOnce((file, encoding, cb) => cb({ code: 'ENOENT' }));

      const response = await request(app)
        .get(`/${filename}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe('File not found');
    });
  });

  // Test for updating a file
  describe('PUT /update', () => {
    it('should update the file and database record', async () => {
      const oldFile = 'test.txt';
      const newFile = 'test-updated.txt';

      fs.rename = jest.fn().mockImplementationOnce((oldPath, newPath, cb) => cb(null));

      db.query.mockResolvedValueOnce({ affectedRows: 1 });

      const response = await request(app)
        .put(`/update`)
        .send({ filename: oldFile, newFilename: newFile });

      expect(response.status).toBe(200);
      expect(response.text).toBe('File renamed successfully');
    });

    it('should return an error if there is an issue renaming the file', async () => {
      const oldFile = 'test.txt';
      const newFile = 'test-updated.txt';

      fs.rename = jest.fn().mockImplementationOnce((oldPath, newPath, cb) => cb(new Error('Error')));

      const response = await request(app)
        .put(`/update`)
        .send({ filename: oldFile, newFilename: newFile });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error while renaming file');
    });
  });

  // Test for deleting a file
  describe('DELETE /:filename', () => {
    it('should delete a file and remove its record from the database', async () => {
      const filename = 'test.txt';
      const filePath = path.join(__dirname, '../uploads', filename);

      fs.unlink = jest.fn().mockImplementationOnce((file, cb) => cb(null));

      db.query.mockResolvedValueOnce({ affectedRows: 1 });

      const response = await request(app)
        .delete(`/${filename}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe('File deleted successfully');
    });

    it('should return an error if there is an issue deleting the file', async () => {
      const filename = 'test.txt';

      fs.unlink = jest.fn().mockImplementationOnce((file, cb) => cb(new Error('Error')));

      const response = await request(app)
        .delete(`/${filename}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error while deleting file from file system');
    });
  });

  // Test for file upload
  describe('POST /upload', () => {
    it('should upload a file and add it to the processing queue', async () => {
      const file = {
        originalname: 'test.txt',
        filename: 'test-uploaded.txt',
        size: 1024,
        mimetype: 'text/plain'
      };

      const req = {
        file,
        user: { id: 1 }
      };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await require('../controllers/fileController').uploadFile(req, res);

      expect(res.send).toHaveBeenCalledWith('File uploaded and queued for processing');
    });

    it('should return an error if no file is uploaded', async () => {
      const req = { file: null };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await require('../controllers/fileController').uploadFile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('No file uploaded');
    });
  });

  // Test for fetching file list
  describe('GET /list', () => {
    it('should return a list of files in the directory', async () => {
      fs.readdir = jest.fn().mockImplementationOnce((dir, cb) => cb(null, ['test.txt']));

      const response = await request(app)
        .get('/list');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ filename: 'test.txt', path: expect.any(String) }]);
    });

    it('should return an error if reading the directory fails', async () => {
      fs.readdir = jest.fn().mockImplementationOnce((dir, cb) => cb(new Error('Error')));

      const response = await request(app)
        .get('/list');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error while fetching file list');
    });
  });

});

