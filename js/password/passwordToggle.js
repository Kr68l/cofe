// Добавление функции просмотра пароля при его записи
const passwordToggleButtons = document.querySelectorAll(".password-toggle");

passwordToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetInputId = button.dataset.target;
    const passwordInput = document.getElementById(targetInputId);
    const icon = button.querySelector("i");

    if (!passwordInput || !icon) return;

    if (passwordInput.type === "password") {
      passwordInput.type = "text";

      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");

      button.setAttribute("aria-label", "Сховати пароль");
    } else {
      passwordInput.type = "password";

      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");

      button.setAttribute("aria-label", "Показати пароль");
    }
  });
});