document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    const description = document.getElementById('description').value;

    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
        formData.append('description', description);

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('responseMessage').textContent = data;
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            document.getElementById('responseMessage').textContent = 'Error uploading file';
        });
    } else {
        document.getElementById('responseMessage').textContent = 'No file selected';
    }
});
