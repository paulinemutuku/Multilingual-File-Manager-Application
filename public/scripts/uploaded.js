document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list');

    // Function to load the list of uploaded files from both /api/list and /api/uploaded
    async function loadFiles() {
        try {
            const [listResponse, uploadedResponse] = await Promise.all([
                fetch('/api/list'),
                fetch('/api/uploaded')
            ]);

            if (!listResponse.ok) {
                const errorText = await listResponse.text();
                throw new Error(`HTTP error! status: ${listResponse.status}, ${errorText}`);
            }

            if (!uploadedResponse.ok) {
                const errorText = await uploadedResponse.text();
                throw new Error(`HTTP error! status: ${uploadedResponse.status}, ${errorText}`);
            }

            const listFiles = await listResponse.json();
            const uploadedFiles = await uploadedResponse.json();
            const files = [...listFiles, ...uploadedFiles];

            const fileList = document.getElementById('file-list');
            fileList.innerHTML = '';


            files.forEach(file => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
            <div class="flex justify-between w-3/5 border rounded-sm px-8 py-2 my-2 hover:bg-gray-200">
                <span class="file-name">${file.filename}</span>
                <div>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
                <div>
            </div>
                
            `;

                const editBtn = listItem.querySelector('.edit-btn');
                const deleteBtn = listItem.querySelector('.delete-btn');
                const fileNameSpan = listItem.querySelector('.file-name');

                editBtn.addEventListener('click', () => editFile(file.filename, fileNameSpan));
                deleteBtn.addEventListener('click', () => deleteFile(file.filename));

                fileNameSpan.addEventListener('click', (e) => {
                    e.preventDefault();
                    const downloadLink = document.createElement('a');
                    downloadLink.href = `/files/${file.filename}`;
                    downloadLink.download = file.filename;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                });

                fileList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading files. Please try again.');
        }
    }

    async function editFile(filename, fileNameSpan) {
        const newFilename = prompt('Enter new file name:', filename);
        if (newFilename && newFilename !== filename) {
            try {
                const response = await fetch(`/files/${filename}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newFilename })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
                }

                fileNameSpan.textContent = newFilename;
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while editing the file name. Please try again.');
            }
        }
    }

    async function deleteFile(filename) {
        if (confirm('Are you sure you want to delete this file?')) {
            try {
                const response = await fetch(`/files/${filename}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
                }

                loadFiles();
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the file. Please try again.');
            }
        }
    }

    // Initial load of files
    loadFiles();

    // Add event listener 
    const fileElements = document.getElementsByClassName('file');
    for (let i = 0; i < fileElements.length; i++) {
        fileElements[i].addEventListener('click', () => {
            window.location.href = '/files';
        });
    }
});
