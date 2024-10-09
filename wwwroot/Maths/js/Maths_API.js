const API_URL = "https://carnation-truthful-pangolin.glitch.me/api/maths"; 
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

function showHelpDocumentation() {
    const helpContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Maths API Documentation</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container mt-5">
                <h2>GET : Maths endpoint</h2>
                <p>List of possible query strings:</p>
                <pre>
? op = + & x = number & y = number
return {"op":"+","x":number,"y":number,"value": x + y}

? op = - & x = number & y = number
return {"op":"-","x":number,"y":number,"value": x - y}

? op = * & x = number & y = number
return {"op":"*","x":number,"y":number,"value": x * y}

? op = / & x = number & y = number
return {"op":"/","x":number,"y":number,"value": x / y}

? op = % & x = number & y = number
return {"op":"%","x":number,"y":number,"value": x % y}

? op = ! & n = integer
return {"op":"!","n":integer,"value": n!}

? op = p & n = integer
return {"op":"p","n":integer,"value": true if n is a prime number}

? op = np & n = integer
return {"op":"np","n":integer,"value": nth prime number}
                </pre>
            </div>
        </body>
        </html>
    `;
    
    const helpWindow = window.open("", "_blank");
    helpWindow.document.write(helpContent);
    helpWindow.document.close();
    
    const helpURL = `${API_URL}?`;
    window.location.href = helpURL;
}

document.getElementById('help-btn').addEventListener('click', showHelpDocumentation);
