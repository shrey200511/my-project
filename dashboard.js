const apiBase = "https://utozs506eb.execute-api.eu-north-1.amazonaws.com/prod";
const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "index.html";
}

async function calculate() {

    const duration = Number(document.getElementById("duration").value);
    const intensity = Number(document.getElementById("intensity").value);
    const sleep = Number(document.getElementById("sleep").value);
    const energy = Number(document.getElementById("energy").value);
    const soreness = Number(document.getElementById("soreness").value);

    if (!duration || !intensity || !sleep) {
        alert("Please fill required fields.");
        return;
    }

    const trainingLoad = duration * intensity;
    const recoveryScore = sleep + energy - soreness;

    const response = await fetch(`${apiBase}/calculate-kpis`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            training_load: trainingLoad,
            recovery_score: recoveryScore
        })
    });

    const data = await response.json();
    displayResult(data);
}

function displayResult(data) {

    document.getElementById("rTraining").innerText = data.training_load;
    document.getElementById("rRecovery").innerText = data.recovery_score;
    document.getElementById("rFatigue").innerText = data.fatigue_score;

    const riskElement = document.getElementById("riskLevel");
    riskElement.innerText = "Risk Level: " + data.final_risk;

    const resultBox = document.querySelector(".result-box");

    if (data.final_risk === "HIGH") {
        resultBox.style.background = "linear-gradient(135deg, #ff4d4d, #b30000)";
    } else if (data.final_risk === "MEDIUM") {
        resultBox.style.background = "linear-gradient(135deg, #ffcc00, #ff9900)";
    } else {
        resultBox.style.background = "linear-gradient(135deg, #4CAF50, #2e7d32)";
    }

    document.getElementById("resultSection").style.display = "block";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}