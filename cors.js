function allowAllAnonymousAccess(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Expose-Headers', '*');
}

function accessControlConfig(httpContext) {
    console.log('CORS request from origin:', httpContext.req.headers['origin']);
    if (httpContext.req.headers['sec-fetch-mode'] === 'cors') {
        allowAllAnonymousAccess(httpContext.res);
    }
}

export function handleCORSPreflight(httpContext) {
    accessControlConfig(httpContext);
    if (httpContext.req.method === 'OPTIONS') {
        console.log('CORS preflight verification for method:', httpContext.req.method);
        httpContext.res.writeHead(204);
        httpContext.res.end();
        return true;
    }
    return false;
}
