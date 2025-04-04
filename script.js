let abortController = new AbortController();
let requestInFlight = false;

function main() {
    const input = document.querySelector("input");
    const output = document.querySelector("#output");

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendRequest(input.value);
        }
    });
}

function sendRequest(text) {
    const output = document.querySelector("#output");

    if (requestInFlight) {
        console.log("Aborting...");
        output.textContent = "Aborting previous request...";
        abortController.abort("new request");
        requestInFlight = false;
    }

    output.textContent = "Sending request...";

    requestInFlight = true;

    const newAbortController = new AbortController();

    fetch("https://echo-bot-shy-sea-4425.fly.dev/echo", {
        method: "POST",
        body: JSON.stringify({ text: text }),
        headers: { "Content-Type": "application/json" },
        signal: newAbortController.signal
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                output.textContent = "Error: Request failed.";
                throw new Error("Request failed");
            }
        })
        .then((json) => {
            output.textContent = `Response: ${json.text}`;
        })
        .catch((error) => {
            if (error.name === "AbortError") {
                output.textContent = "Request was aborted.";
            } else {
                console.error("Fetch Error:", error);
                output.textContent = "Error sending request.";
            }
        })
        .finally(() => {
            requestInFlight = false;
        });

    abortController = newAbortController;
}

document.addEventListener("DOMContentLoaded", main);
