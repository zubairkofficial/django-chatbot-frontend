export async function* backendStreamingRequest(method, url, body) {
    let headers = {};

    headers = {
        "Content-Type": "application/json"
    };

    if (body instanceof FormData) {
        body = JSON.stringify(
            Object.fromEntries(body)
        );
    } else if (typeof body === "object") {
        body = JSON.stringify(body);
    }
    
    let token;
    if ( token = localStorage.getItem("token") ) {
        headers["Token"] = token;
    }

    const response = await fetch(url, { method, body, headers });
    const reader = response.body.getReader();

    const decoder = new TextDecoder();
    let chunk;
    
    do {
        chunk = await reader.read();
        if (chunk.value) yield decoder.decode(chunk.value);
    } while (!chunk.done);
}