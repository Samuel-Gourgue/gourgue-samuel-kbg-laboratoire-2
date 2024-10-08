const API_URL = "https://carnation-truthful-pangolin.glitch.me/api/contacts";
let currentHttpError = "";

function API_getcurrentHttpError () {
    return currentHttpError; 
}

function API_Get(op, params) {
    let urlParams = new URLSearchParams({ op, ...params }).toString();
    return new Promise(resolve => {
        $.ajax({
            url: API_URL + "?" + urlParams,
            success: result => { currentHttpError = ""; resolve(result); },
            error: (xhr) => { console.log(xhr); resolve(null); }
        });
    });
}

