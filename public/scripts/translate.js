document.addEventListener("DOMContentLoaded", function () {
    const languageMap = {
        "en": "English",
        "fr": "French",
        "sw": "Swahili",
        "kin": "Kinyarwanda"
    };

    const defaultLanguage = "english";

    async function loadTranslations(language) {
        const mappedLanguage = languageMap[language] || defaultLanguage;
        console.log(`Loading translations for language: ${mappedLanguage}`);
        const response = await fetch(`/locales/${mappedLanguage}/translation.json`);
        if (response.ok) {
            return response.json();
        } else {
            console.error(`Failed to load translations for language: ${mappedLanguage}`);
            return {};
        }
    }

    function updateTranslations(translations) {
        console.log('Updating translations:', translations);

        const welcomeElement = document.getElementById('welcome');
        if (welcomeElement) {
            welcomeElement.textContent = translations.home_page?.welcome || 'Welcome to the File Manager';
        }

        const navHomeElement = document.getElementById('nav-home');
        if (navHomeElement) {
            navHomeElement.textContent = translations.navbar?.home || 'Home';
        }

        const navFileListElement = document.getElementById('nav-file-list');
        if (navFileListElement) {
            navFileListElement.textContent = translations.navbar?.file_list || 'File List';
        }

        const navActionsElement = document.getElementById('nav-actions');
        if (navActionsElement) {
            navActionsElement.textContent = translations.navbar?.actions || 'Actions';
        }

        const navLogoutElement = document.getElementById('nav-logout');
        if (navLogoutElement) {
            navLogoutElement.textContent = translations.navbar?.logout || 'Logout';
        }

        const pageTitleElement = document.getElementById('page-title');
        if (pageTitleElement) {
            pageTitleElement.textContent = translations.file_manager?.title || 'File Manager';
        }

        const uploadTextElement = document.getElementById('upload_text');
        if (uploadTextElement) {
            uploadTextElement.textContent = translations.file_manager?.upload_text || 'Upload a file';
        }

        const createTextElement = document.getElementById('create_text');
        if (createTextElement) {
            createTextElement.textContent = translations.file_manager?.create_text || 'Create a File';
        }

        const filesElement = document.getElementById('files');
        if (filesElement) {
            filesElement.textContent = translations.file_manager?.files || 'Files';
        }

        const fileNameElement = document.getElementById('file_name');
        if (fileNameElement) {
            fileNameElement.textContent = translations.file_manager?.file_name || 'File Name';
        }
        
        const fileContentElement = document.getElementById('file_content');
        if (fileContentElement) {
            fileContentElement.textContent = translations.file_manager?.file_content || 'File Content';
        }
    }

    function changeLanguage(language) {
        loadTranslations(language).then(updateTranslations).catch(error => {
            console.error('Error updating translations:', error);
            changeLanguage(defaultLanguage); 
        });
    }

    const savedLanguage = localStorage.getItem('selectedLanguage') || (navigator.language || 'en').split('-')[0];
    changeLanguage(savedLanguage);

    const selectedLanguageFullName = languageMap[savedLanguage] || languageMap[defaultLanguage];
    selectedLanguageFullName.toUpperCase();
    document.getElementById('selected-language').textContent = selectedLanguageFullName;
    

    document.getElementById('language-dropdown').addEventListener('change', function (event) {
        const selectedLanguage = event.target.value;
        console.log(`Selected language: ${selectedLanguage}`);
        localStorage.setItem('selectedLanguage', selectedLanguage);
        changeLanguage(selectedLanguage);
    });
});
