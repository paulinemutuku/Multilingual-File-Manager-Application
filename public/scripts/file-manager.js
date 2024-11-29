document.addEventListener('DOMContentLoaded', () => {
    // Function to handle file upload
    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/files', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
            }

            const result = await response.json();
            if (result.success) {
                alert('File uploaded successfully!');
                loadFiles();
            } else {
                alert('Failed to upload file: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('An error occurred during file upload. Please try again.');
        }
    });
    
    // Function to handle file creation
    document.getElementById('createForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const filename = document.getElementById('filename').value;
        const filecontent = document.getElementById('filecontent').value;

        try {
            const response = await fetch('/files/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename, content: filecontent }),
            });

            const result = await response.json();
            if (result.success) {
                alert('File created successfully!');
                loadFiles();
                document.getElementById('createForm').reset();
            } else {
                alert('Failed to create file: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during file creation. Please try again.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to handle file upload
    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/files', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
               
                loadFiles();
            } else {
                alert('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
