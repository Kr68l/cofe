import { supabase } from "./supabaseClient.js";

console.log("forgotPassword.js подключился");

const forgotPasswordForm = document.getElementById("forgot-form");
const forgotEmailInput = document.getElementById("forgot-email");
const forgotMessage = document.getElementById("forgot-message");

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = forgotEmailInput.value.trim();

    if (!email) {
      forgotMessage.textContent = "Введіть email.";
      return;
    }

    forgotMessage.textContent = "Надсилаємо лист...";

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/update-password.html`,
    });

    if (error) {
      console.log("RESET PASSWORD ERROR:", error);
      forgotMessage.textContent = "Помилка: " + error.message;
      return;
    }

    console.log("RESET PASSWORD DATA:", data);
    forgotMessage.textContent = "Лист для відновлення пароля надіслано. Перевірте пошту.";
  });
}