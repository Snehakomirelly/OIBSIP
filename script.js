// Calculate BMI Function
async function calculateBMI() {

    // Get input values
    let weight = document.getElementById("weight").value;
    let height = document.getElementById("height").value;

    // Error element
    let error = document.getElementById("error");

    // Validation
    if (weight === "" || height === "") {
        error.innerText = "Please fill all fields";
        return;
    }

    // Clear error
    error.innerText = "";

    // Send data to Flask backend
    const response = await fetch("/calculate_bmi", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            weight: weight,
            height: height
        })
    });

    // Convert response to JSON
    const data = await response.json();

    // Handle errors
    if (data.error) {
        error.innerText = data.error;
        return;
    }

    // Show Result Box
    const resultBox = document.getElementById("resultBox");

    resultBox.classList.remove("hidden");

    // Display Results
    document.getElementById("bmiResult").innerText = data.bmi;

    document.getElementById("bmiCategory").innerText = data.category;

    document.getElementById("message").innerText = data.message;

    // BMI Color Indicators
    resultBox.style.background = data.color;
    resultBox.style.color = "white";
}

// Reset Function
function resetFields() {

    document.getElementById("weight").value = "";
    document.getElementById("height").value = "";

    document.getElementById("resultBox").classList.add("hidden");

    document.getElementById("error").innerText = "";
}

// Dark Mode Toggle
document.getElementById("themeToggle").addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");
});