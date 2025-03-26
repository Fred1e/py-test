document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // Check if user is already signed in
        const user = localStorage.getItem("frezra_user");
        
        if (user) {
            window.location.href = "html/home.html"; // Redirect to home
        } else {
            window.location.href = "html/signup.html"; // Redirect to signup
        }
    }, 3000); // 3-second delay
});
