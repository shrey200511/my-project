const cognitoDomain = "https://eu-north-1araft1c6d.auth.eu-north-1.amazoncognito.com";
const clientId = "1g1g1e8mu28rmp7j4vb9jpiasp";
const redirectUri = "http://localhost:5500/index1.html";

document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {

            const loginUrl =
                `${cognitoDomain}/login` +
                `?client_id=${clientId}` +
                `&response_type=code` +
                `&scope=openid+email` +
                `&redirect_uri=${redirectUri}`;

            window.location.href = loginUrl;
        });
    }

});

/* Handle ?code= after login */
async function exchangeCodeForToken(code) {

    try {

        const response = await fetch(
            `${cognitoDomain}/oauth2/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: clientId,
                    code: code,
                    redirect_uri: redirectUri
                })
            }
        );

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("id_token", data.id_token);

            window.history.replaceState({}, document.title, redirectUri);
            window.location.href = "dashboard.html";
        } else {
            console.error(data);
            alert("Token exchange failed.");
        }

    } catch (err) {
        console.error(err);
        alert("Error during token exchange.");
    }
}

/* Check if we came back with ?code= */
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
    exchangeCodeForToken(code);
}