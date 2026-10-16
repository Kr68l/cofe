import { supabase } from "./supabaseClient.js";

const accountName = document.getElementById("account-name");
const accountEmail = document.getElementById("account-email");
const accountAvatar = document.getElementById("account-avatar");

const accountOpenBtn = document.querySelector("[data-account-open]");
const headerAccountAvatar = document.querySelector("[data-account-avatar-small]");

const accountDrawer = document.getElementById("account-drawer");
const accountOverlay = document.getElementById("account-overlay");
const closeDrawerBtn = document.getElementById("account-drawer-close");
const logoutBtn = document.getElementById("account-logout-btn");
const loginLink = document.querySelector("[data-auth-link]");

const { data, error } = await supabase.auth.getUser();

const rateMenuBtn = document.getElementById("rate-menu-btn");

if (error || !data.user) {
  if (loginLink) loginLink.hidden = false;
  if (accountOpenBtn) accountOpenBtn.hidden = true;
} else {
  const user = data.user;

  const email = user.email;

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    email?.split("@")[0] ||
    "Користувач";

  if (accountName) accountName.textContent = name;
  if (accountEmail) accountEmail.textContent = email;

  const firstLetter = name.charAt(0).toUpperCase();

  if (accountAvatar) accountAvatar.textContent = firstLetter;
  if (headerAccountAvatar) headerAccountAvatar.textContent = firstLetter;

  if (loginLink) loginLink.hidden = true;
  if (accountOpenBtn) accountOpenBtn.hidden = false;
}

if (accountOpenBtn && accountDrawer && accountOverlay) {
  accountOpenBtn.addEventListener("click", () => {
    accountDrawer.classList.add("open");
    accountDrawer.setAttribute("aria-hidden", "false");
    accountOverlay.hidden = false;
  });
}

function closeDrawer() {
  if (!accountDrawer || !accountOverlay) return;

  accountDrawer.classList.remove("open");
  accountDrawer.setAttribute("aria-hidden", "true");
  accountOverlay.hidden = true;
}


if (closeDrawerBtn) {
  closeDrawerBtn.addEventListener("click", closeDrawer);
}

if (accountOverlay) {
  accountOverlay.addEventListener("click", closeDrawer);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Не вдалося вийти з акаунта. Спробуйте ще раз.");
      return;
    }

    window.location.href = "login/login.html";
  });
}

if (loginLink) {
  loginLink.addEventListener("click", () => {
    sessionStorage.setItem("redirectAfterLogin", window.location.href);
  });

}

// Кнопка оценить меню в боковом профиле
if (rateMenuBtn) {
  rateMenuBtn.addEventListener("click", () => {
    const isMenuPage = window.location.pathname.includes("menu.html");

    if (isMenuPage) {
      closeDrawer();

      const menuSection = document.getElementById("menu-navigation_id");

      if (menuSection) {
        menuSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    window.location.href = "menu.html?rate=true";
  });
}

// --- Логика истории бронирований ---
const historyBtn = document.getElementById("booking-history-btn");
const bookingsContainer = document.getElementById("account-bookings");

if (historyBtn && bookingsContainer) {
  historyBtn.addEventListener("click", async () => {
    // Переключаем видимость блока
    bookingsContainer.hidden = !bookingsContainer.hidden;
    
    // Если открыли и внутри еще нет списка (только начальная надпись)
    if (!bookingsContainer.hidden && bookingsContainer.querySelector('.empty-message')) {
      const bookingsList = document.createElement('div');
      bookingsList.id = 'bookings-list';
      bookingsContainer.appendChild(bookingsList);
      
      bookingsList.innerHTML = "<p style='font-size: 14px;'>Завантаження...</p>";
      
      // Получаем ID текущего пользователя
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        const { data, error } = await supabase
          .from('Reservation') // Убедись, что твоя таблица в Supabase так и называется
          .select('*')
          .eq('UID', userData.user.id)
          .order('id', { ascending: false })
          .limit(5); // Берем последние 5
          
        if (error) {
          bookingsList.innerHTML = "<p>Помилка завантаження даних.</p>";
        } else if (!data || data.length === 0) {
          bookingsList.innerHTML = "<p>У вас ще немає бронювань.</p>";
        } else {
          // Отрисовываем список
          bookingsList.innerHTML = data.map(b => `
            <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
              <strong style="display:block; font-size: 14px;">Бронювання #${b.id}</strong>
              <small style="color: #aaa;">${b.booking_details || 'Без діталей'}</small>
            </div>
          `).join('');
        }
      }
    }
  });
}