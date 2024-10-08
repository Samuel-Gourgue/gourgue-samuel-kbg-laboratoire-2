const API_URL = "https://carnation-truthful-pangolin.glitch.me/api/maths"; // Changer l'URL pour les mathématiques
let currentHttpError = "";

function API_getcurrentHttpError() {
    return currentHttpError; 
}

function API_Get(op, params) {
    let urlParams = new URLSearchParams({ op, ...params }).toString();
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + "?" + urlParams,
            method: 'GET',
            success: result => {
                currentHttpError = ""; 
                resolve(result);
            },
            error: (xhr) => {
                console.error(xhr);
                currentHttpError = xhr.responseText;
                resolve(null);
            }
        });
    });
}


