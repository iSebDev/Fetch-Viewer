const settings = {
    theme: localStorage.getItem('theme')
}

/*
:root { 
    --body-bg-dark: black;
    --body-bg-light: white;
    --border-dark: white;
    --border-light: black;
    --color-dark: white;
    --color-light: black;
    --bar-dark: #212121;
    --bar-light: white;
    --bar-btn-hover: rgb(84, 90, 107);
}
*/

const themeText = document.getElementById("theme");
const contentDiv = document.getElementById("content");
const switchButton = document.getElementById("switcher");
const pasteButton = document.getElementById("paste-btn");
const clearButton = document.getElementById("clear-btn");
const urlInput = document.getElementById("fetch-url");
const fetchButton = document.getElementById("fetch-btn");

function changeTheme() {
    switchButton.classList.remove('light');
    if(settings.theme === 'light') {
        document.body.classList.remove('dark');
        switchButton.classList.add('light');
        switchButton.classList.remove('dark');
    }else {
        document.body.classList.add('dark');
        switchButton.classList.add('dark');
        switchButton.classList.remove('light');
    }
}

function switchTheme() {
    if(settings.theme === 'dark') {
        localStorage.setItem('theme', 'light');
        switchButton.classList.add('light');
        switchButton.classList.remove('dark');
        themeText.innerHTML = "Light";
    }else if(settings.theme === 'light'){
        localStorage.setItem('theme', 'dark');
        switchButton.classList.add('dark');
        switchButton.classList.remove('light');
        themeText.innerHTML = "Dark";
    }else {
        return;
    }
    settings.theme = localStorage.getItem('theme');
}

switchButton.addEventListener('click', () => {
    switchTheme();
    changeTheme();
});

document.addEventListener("DOMContentLoaded", () => {
    changeTheme();
});

pasteButton.addEventListener('click', () => {
    navigator.clipboard.readText()
        .then(text => {
            urlInput.classList.add('pressed');
            urlInput.value = text;
            setTimeout(() => urlInput.classList.remove('pressed'), 250);
        })
        .catch(err => {
            urlInput("Error when trying to load. See console for more details!")
            console.error(err);
        });
});

clearButton.addEventListener('click', () => {
    const responseDiv = document.getElementById("response");
    
    while (responseDiv.firstChild) {
        responseDiv.removeChild(responseDiv.firstChild);
    }
});

fetchButton.addEventListener('click', () => {
    const url = urlInput.value;

    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (regex.test(url)) {
        fetch(url)
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (contentType && (contentType.includes("image") || contentType.includes("data:image"))) {
                    const img = document.createElement("img");
                    img.src = url;
                    document.getElementById("response").appendChild(img);
                } else {
                    return response.text();
                }
            })
            .then(data => {
                if (data) {
                    console.log('Received:', data);
                    try {
                        const jsonData = JSON.parse(data);
                        console.log('Parsed JSON:', jsonData);
                    }catch(e) {
                        console.error(e);
                    }
                    urlInput.value = "Data received. See console for more!";
                } else {
                    urlInput.value = "Image received!";
                }
            })
            .catch(error => {
                urlInput.value = "Error when trying to load. See console for more details!";
                console.error(error);
            });
    }else {
        urlInput.value = "The url is not valid!";
    }
});