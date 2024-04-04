document.addEventListener("DOMContentLoaded", () => {
  const changePasswordEmailForm = document.getElementById(
    "changePasswordEmailForm"
  );

  changePasswordEmailForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(changePasswordEmailForm);
    const email = formData.get("email");

    try {
      const response = await fetch("/api/users/recoverPassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      alert("Reset password email sent successfully!");
    } catch (error) {
      console.error("Error sending reset password email:", error.message);
      alert(
        "An error occurred while sending reset password email. Please try again later."
      );
    }
  });
});
