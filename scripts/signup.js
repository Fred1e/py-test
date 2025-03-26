document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/country.json")
        .then(response => response.json())
        .then(data => {
            let countrySelect = document.getElementById("country");
            data.forEach(country => {
                let option = document.createElement("option");
                option.value = country.code;
                option.textContent = `${country.name} (+${country.dial_code})`;
                countrySelect.appendChild(option);
            });
            updateCountryCode();
        });
});

function updateCountryCode() {
    let selected = document.getElementById("country");
    let code = selected.options[selected.selectedIndex].text.match(/\+\d+/)[0];
    document.getElementById("country-code").textContent = code;
}

function sendOTP() {
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    if (!phone) {
        alert("Enter a phone number!");
        return;
    }
    localStorage.setItem("user_phone", phone);
    localStorage.setItem("user_email", email);
    window.location.href = "verify.html";
}
