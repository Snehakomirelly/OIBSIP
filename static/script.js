// Calculate BMI
async function calculateBMI() {

    // Inputs
    let name = document.getElementById("name").value;

    let age = document.getElementById("age").value;

    let gender = document.getElementById("gender").value;

    let weight = document.getElementById("weight").value;

    let height = document.getElementById("height").value;

    let error = document.getElementById("error");

    // Selected Language
    let lang =
        document.getElementById("languageSelect").value;

    // Validation
    if (
        name === "" ||
        age === "" ||
        gender === "" ||
        weight === "" ||
        height === ""
    ) {

        error.innerText =
            translations[lang].fill;

        return;
    }

    // Clear Error
    error.innerText = "";

    // Show Loader
    document.getElementById("loader")
        .classList.remove("hidden");

    try {

        // Send Data
        const response = await fetch("/calculate_bmi", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,
                age: age,
                gender: gender,
                weight: weight,
                height: height
            })
        });

        // Convert JSON
        const data = await response.json();

        // Hide Loader
        document.getElementById("loader")
            .classList.add("hidden");

        // Backend Error
        if (data.error) {

            error.innerText = data.error;

            return;
        }

        // Show Result Box
        let resultBox =
            document.getElementById("resultBox");

        resultBox.classList.remove("hidden");

        // Display Results
        document.getElementById("bmiResult")
            .innerText = data.bmi;

        document.getElementById("bmiCategory")
            .innerText = data.category;

        document.getElementById("message")
            .innerText = `${name}, ${data.message}`;

        document.getElementById("tip")
            .innerText = data.tip;

        document.getElementById("suggestion")
            .innerText = data.suggestion;

        document.getElementById("idealWeight")
            .innerText =
            `${translations[lang].ideal}:
            ${data.min_weight} kg - ${data.max_weight} kg`;

        document.getElementById("ageSuggestion")
            .innerText = data.age_suggestion;

        document.getElementById("healthSuggestion")
            .innerText = data.health_suggestion;

        // Result Color
        resultBox.style.background = data.color;

        // Progress Bar
        let progress =
            document.getElementById("progress-bar");

        progress.style.width =
            `${Math.min(data.bmi * 2, 100)}%`;

        progress.style.background =
            data.color;

        // Add History Row
        let row = `
            <tr>
                <td>${data.bmi}</td>
                <td>${data.category}</td>
            </tr>
        `;

        document.getElementById("historyBody")
            .innerHTML += row;

    } catch (err) {

        error.innerText =
            "Something went wrong!";
    }
}

// Reset Fields
function resetFields() {

    document.getElementById("name").value = "";

    document.getElementById("age").value = "";

    document.getElementById("gender").value = "";

    document.getElementById("weight").value = "";

    document.getElementById("height").value = "";

    document.getElementById("error").innerText = "";

    document.getElementById("resultBox")
        .classList.add("hidden");
}

// Enter Key Support
document.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            calculateBMI();
        }
    }
);

// Date & Time
function updateTime() {

    let now = new Date();

    document.getElementById("dateTime")
        .innerText = now.toLocaleString();
}

setInterval(updateTime, 1000);

// Dark Mode
const toggleBtn =
    document.getElementById("themeToggle");

// Load Theme
if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");
}

// Toggle Theme
toggleBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");
    }
});


// 🌍 Multi-language Support

const translations = {

    en: {

        title: "BMI Calculator",

        name: "Name",

        age: "Age",

        gender: "Gender",

        weight: "Weight (kg)",

        height: "Height (cm)",

        calculate: "Calculate",

        reset: "Reset",

        history: "View BMI History",

        dashboard: "View Dashboard",

        fill: "Please fill all fields",

        ideal: "Ideal Weight Range"
    },

    hi: {

        title: "बीएमआई कैलकुलेटर",

        name: "नाम",

        age: "आयु",

        gender: "लिंग",

        weight: "वजन (किलो)",

        height: "ऊंचाई (सेमी)",

        calculate: "गणना करें",

        reset: "रीसेट",

        history: "बीएमआई इतिहास देखें",

        dashboard: "डैशबोर्ड देखें",

        fill: "कृपया सभी फ़ील्ड भरें",

        ideal: "आदर्श वजन सीमा"
    },

    te: {

        title: "బీఎంఐ కాలిక్యులేటర్",

        name: "పేరు",

        age: "వయస్సు",

        gender: "లింగం",

        weight: "బరువు (కిలో)",

        height: "ఎత్తు (సెం.మీ)",

        calculate: "లెక్కించు",

        reset: "రీసెట్",

        history: "BMI చరిత్ర చూడండి",

        dashboard: "డాష్‌బోర్డ్ చూడండి",

        fill: "దయచేసి అన్ని వివరాలు నమోదు చేయండి",

        ideal: "ఆదర్శ బరువు పరిధి"
    }
};

// Change Language
function changeLanguage() {

    const lang =
        document.getElementById("languageSelect").value;

    // Labels
    document.getElementById("title").innerText =
        translations[lang].title;

    document.getElementById("nameLabel").innerText =
        translations[lang].name;

    document.getElementById("ageLabel").innerText =
        translations[lang].age;

    document.getElementById("genderLabel").innerText =
        translations[lang].gender;

    document.getElementById("weightLabel").innerText =
        translations[lang].weight;

    document.getElementById("heightLabel").innerText =
        translations[lang].height;

    // Buttons
    document.querySelectorAll(".buttons button")[0]
        .innerText = translations[lang].calculate;

    document.querySelectorAll(".buttons button")[1]
        .innerText = translations[lang].reset;

    // Links
    document.querySelectorAll("a")[0]
        .innerText = translations[lang].history;

    document.querySelectorAll("a")[1]
        .innerText = translations[lang].dashboard;

    // Save Language
    localStorage.setItem("language", lang);
}

// Load Saved Language
window.onload = function () {

    let savedLang =
        localStorage.getItem("language") || "en";

    document.getElementById("languageSelect").value =
        savedLang;

    changeLanguage();
};   