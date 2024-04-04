document.addEventListener("DOMContentLoaded", () => {
  const changePasswordForm = document.getElementById("changePasswordForm");

  changePasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(changePasswordForm);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const token = window.location.search.split("=")[1];

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please make sure your passwords match.");
      return;
    }

    try {
      const response = await fetch("/api/users/updatepassword/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      alert("Password updated successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error updating password:", error.message);
      alert(
        "An error occurred while updating password. Remember that you can't use the same password you used to have. Please try again later"
      );
    }
  });
});
