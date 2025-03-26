document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/country.json")
        .then(response => response.json())
        .then(data => {
            const countrySelect = document.getElementById("country");
            data.forEach(country => {
                const option = document.createElement("option");
                option.value = country.code;
                option.textContent = `${country.flag} ${country.name}`;
                countrySelect.appendChild(option);
            });

            // Set default country
            countrySelect.value = "+255";
            updateCountryCode();
        })
        .catch(error => console.error("Error loading country data:", error));
});

function updateCountryCode() {
    const countrySelect = document.getElementById("country");
    const countryCodeSpan = document.getElementById("country-code");
    countryCodeSpan.textContent = countrySelect.value;
}
