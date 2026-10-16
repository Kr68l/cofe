import { supabase } from "./supabaseClient.js";

const authMessage = document.getElementById("auth-message");

function showAuthMessage(text, type = "info") {
  if (!authMessage) return;
  authMessage.textContent = text;
  authMessage.className = `auth-message ${type}`;
}

// --------------------------------------------------
// Куда вернуть пользователя после авторизации
// --------------------------------------------------

function getRedirectUrl() {
  const savedPage = sessionStorage.getItem("redirectAfterLogin");

  if (savedPage && !savedPage.includes("/login/")) {
    return savedPage;
  }

  return `${window.location.origin}/index.html`;
}

function redirectAfterAuth() {
  const redirectUrl = getRedirectUrl();

  sessionStorage.removeItem("redirectAfterLogin");

  window.location.href = redirectUrl;
}

// --------------------------------------------------
// Проверяем OAuth после возврата от Google
// --------------------------------------------------

(async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    return;
  }

  if (data.session) {
    localStorage.setItem(
      "user_id",
      data.session.user.id
    );

    if (window.location.pathname.includes("/login/")) {
      redirectAfterAuth();
    }
  }
})();

// --------------------------------------------------
// Переключение вкладок
// --------------------------------------------------

const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const formId = tab.dataset.form;

    authTabs.forEach((btn) => btn.classList.remove("active"));
    authForms.forEach((form) => form.classList.remove("active"));

    tab.classList.add("active");

    document.getElementById(formId)?.classList.add("active");

    showAuthMessage("");
  });
});

// --------------------------------------------------
// Вход Email/Password
// --------------------------------------------------

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    showAuthMessage("Входимо...", "info");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showAuthMessage("Невірний email або пароль.", "error");
      return;
    }

    localStorage.setItem(
      "user_id",
      data.session.user.id
    );

    showAuthMessage("Успішний вхід!", "success");

    setTimeout(() => {
      redirectAfterAuth();
    }, 700);
  });
}

// --------------------------------------------------
// Регистрация
// --------------------------------------------------

const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    if (password.length < 6) {
      showAuthMessage("Пароль мінімум 6 символів.", "error");
      return;
    }

    showAuthMessage("Створюємо акаунт...", "info");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
        data: {
          name,
        },
      },
    });

    if (error) {
      showAuthMessage(error.message, "error");
      return;
    }

    if (data.session) {
      localStorage.setItem(
        "user_id",
        data.session.user.id
      );

      redirectAfterAuth();

      return;
    }

    showAuthMessage(
      "Перевірте пошту для підтвердження акаунта.",
      "success"
    );
  });
}

// --------------------------------------------------
// Google / Apple
// --------------------------------------------------

const googleBtn = document.getElementById("google-login");
const appleBtn = document.getElementById("apple-login");

async function loginWithProvider(provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/login/login.html`,
    },
  });

  if (error) {
    console.error(error);
    showAuthMessage(
      `Помилка входу через ${provider}`,
      "error"
    );
  }
}

googleBtn?.addEventListener("click", () => loginWithProvider("google"));

appleBtn?.addEventListener("click", () => loginWithProvider("apple"));