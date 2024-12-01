# Multilingual File Manager Application

This is a File Manager App, designed to help you manage your files in multiple languages. Whether you need to upload, download, or organize files, this app makes working with multilingual content simple and efficient.

## Features
- User registration and login
- File management: create, read, update, delete files
- Multilingual support using i18next
- Input data extraction from request body, query parameters, and headers

## Project Structure

```
project-root/
├── Routes/
│   ├── fileRoutes.js
│   ├── translate.js
│   ├── translate2.js
│   ├── uploadRoutes.js
│   └── userRoutes.js
├── config/
│   ├── db.js
│   ├── i18n.js
│   ├── multer.js
│   ├── passport.js
│   └── queue.js
├── controllers/
│   ├── fileController.js
│   └── userController.js
├── locales/
│   ├── english-translations.js
│   ├── french-translations.js
│   ├── kinyarwanda-translations.js
│   └── swahili-translations.js
├── middleware/
│   └── authMiddleware.js
├── public/
│   ├── assets/
│   ├── scripts/
│   │   ├── file-manager.js
│   │   ├── scripts.js
│   │   ├── translate.js
│   │   ├── upload.js
│   │   └── uploaded.js
│   ├── styles/
│   │   ├── files.css
│   │   ├── home.css
│   │   ├── index.css
│   │   └── uploaded.css
├── tests/
│   ├── userController.test.js
│   └── fileController.test.js
├── .gitignore
├── README.md
├── index.js
├── jest.config.js
├── okay.js
├── package-lock.json
└── package.json
```

## Setup

To get started with the app, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/paulinemutuku/Multilingual-File-Manager-Application.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a new database:
   ```
   createdb multilingual_file_manager
   ```

4. Configure environment variables:
   ```
   cp .env.example .env
   ```

5. Start the app:
   ```
   node index.js
   ```

## Routes

### User Routes
These routes handle user-related operations.

- **Register a new user**
  - `POST /register`
  - Handler: `userController.register`

- **Login a user**
  - `POST /login`
  - Handler: `userController.login`

### File Routes
These routes handle file-related operations.

- **Create a new file**
  - `POST /create`
  - Handler: `fileController.createFile`

- **Read a file**
  - `GET /:filename`
  - Handler: `fileController.readFile`

- **Update a file**
  - `PUT /update`
  - Handler: `fileController.updateFile`

- **Delete a file**
  - `DELETE /:filename`
  - Handler: `fileController.deleteFile`

- **Get all files (requires authentication)**
  - `GET /list`
  - Handler: `fileController.getFileList`
  - Middleware: `isAuthenticated`

- **Get uploaded files**
  - `GET /uploaded`
  - Handler: `fileController.getUploadedFiles`

### Language Routes
These routes handle language-related operations.

- **Change the language**
  - `GET /translate`
  - Handler: `i18nController.translate`
  - Query Parameter: `lang` (supports en, fr, kin, sw, etc.)
  - Response: Returns the translated message for the specified key (`messageKey`)

- **Translate a file**
  - `POST /translate-file`
  - Handler: `fileController.translateFile`
  - Body:
    - `inputFilePath`: Path to the file to translate
    - `outputFilePath`: Path where the translated file will be saved
    - `targetLanguage`: Language to translate the content into (e.g., fr, sw, etc.)

### Session Routes
These routes handle session-related operations.

- **Get all sessions**
  - `GET /getAllSessions`
  - Handler: `sessionController.getAllSessions`

- **Get sessions by user ID**
  - `GET /getSessionByUserId/:id`
  - Handler: `sessionController.getSessionByUserId`

- **Delete all sessions for a particular user**
  - `DELETE /deleteAllSessionsForAnyUser/:id`
  - Handler: `sessionController.deleteAllSessionsForAnyUser`

- **Delete all sessions**
  - `DELETE /deleteAllSessions`
  - Handler: `sessionController.deleteAllSessions`

## Contributors
- [Pauline Mutuku](https://github.com/paulinemutuku)
- [Mathieu Munyakazi](https://github.com/mathieumunyakazimoise)

