import { supabase } from "./supabaseClient.js";

console.log("updatePassword.js loaded");

const updatePasswordForm = document.getElementById("update-password-form");
const newPasswordInput = document.getElementById("new-password");
const confirmNewPasswordInput = document.getElementById("confirm-new-password");
const updatePasswordMessage = document.getElementById("update-password-message");

const { data: sessionData } = await supabase.auth.getSession();

console.log("CURRENT SESSION:", sessionData);

if (!sessionData.session) {
  console.log("Recovery session пока не найдена. Если ты открыла страницу вручную — пароль не обновится.");
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;

    if (newPassword.length < 6) {
      updatePasswordMessage.textContent = "Пароль має містити мінімум 6 символів.";
      return;
    }

    if (newPassword !== confirmNewPassword) {
      updatePasswordMessage.textContent = "Паролі не збігаються.";
      return;
    }

    updatePasswordMessage.textContent = "Оновлюємо пароль...";

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log("UPDATE PASSWORD ERROR:", error);
      updatePasswordMessage.textContent = "Помилка: " + error.message;
      return;
    }

    console.log("UPDATE PASSWORD DATA:", data);
    updatePasswordMessage.textContent = "Пароль успішно оновлено.";

    await supabase.auth.signOut();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
}