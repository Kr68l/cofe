import { supabase } from "./password/supabaseClient.js";

const cards = document.querySelectorAll("[data-dish-id]");

const {
  data: { user },
} = await supabase.auth.getUser();

let userRatings = new Map();

if (user) {
  const { data, error } = await supabase
    .from("dish_ratings")
    .select("dish_id, rating")
    .eq("user_id", user.id);

  if (!error && data) {
    userRatings = new Map(
      data.map((item) => [item.dish_id, item.rating])
    );
  }
}

/* ДОБАВЛЕНО: загружаем общую статистику всех блюд */
let ratingStats = new Map();

const { data: statsData, error: statsError } = await supabase
  .from("dish_rating_stats")
  .select("dish_id, average_rating, ratings_count");

if (!statsError && statsData) {
  ratingStats = new Map(
    statsData.map((item) => [item.dish_id, item])
  );
}

cards.forEach((card) => {
  const dishId = card.dataset.dishId;
  const currentRating = userRatings.get(dishId) || 0;

  /* ДОБАВЛЕНО: создаём блок средней оценки */
  const currentStats = ratingStats.get(dishId);
  const statsBlock = createStatsBlock(currentStats);

  card.appendChild(statsBlock);

  const ratingBlock = createRatingBlock(currentRating);

  card.appendChild(ratingBlock);

  const stars = ratingBlock.querySelectorAll(".dish-star");
  const message = ratingBlock.querySelector(".dish-rating-message");

  stars.forEach((star) => {
    star.addEventListener("click", async () => {
      if (!user) {
        sessionStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "login/login.html";
        return;
      }

      const rating = Number(star.dataset.rating);

      updateStars(stars, rating);

      message.textContent = "Зберігаємо оцінку...";

      const { error } = await supabase
        .from("dish_ratings")
        .upsert(
          {
            user_id: user.id,
            dish_id: card.dataset.dishId,
            dish_name: card.dataset.dishName,
            rating: rating,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,dish_id",
          }
        );

      if (error) {
        message.textContent = "Не вдалося зберегти оцінку";
        return;
      }

      message.textContent = `Ваша оцінка: ${rating}/5`;

      /* ДОБАВЛЕНО: после оценки обновляем среднюю оценку */
      await refreshSingleDishStats(card.dataset.dishId, statsBlock);
    });
  });
});

function createRatingBlock(currentRating) {
  const ratingBlock = document.createElement("div");
  ratingBlock.className = "dish-rating";

  const title = document.createElement("p");
  title.className = "dish-rating-title";
  title.textContent = "Оцініть страву";

  const starsWrapper = document.createElement("div");
  starsWrapper.className = "dish-rating-stars";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("button");

    star.type = "button";
    star.className = "dish-star";
    star.textContent = "★";
    star.dataset.rating = i;
    star.setAttribute("aria-label", `${i} з 5`);

    if (i <= currentRating) {
      star.classList.add("active");
    }

    starsWrapper.appendChild(star);
  }

  const message = document.createElement("p");
  message.className = "dish-rating-message";

  if (currentRating > 0) {
    message.textContent = `Ваша оцінка: ${currentRating}/5`;
  } else if (!user) {
    message.textContent = "Увійдіть, щоб оцінити";
  } else {
    message.textContent = "";
  }

  ratingBlock.appendChild(title);
  ratingBlock.appendChild(starsWrapper);
  ratingBlock.appendChild(message);

  return ratingBlock;
}

function updateStars(stars, rating) {
  stars.forEach((star) => {
    const starRating = Number(star.dataset.rating);

    if (starRating <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

/* ДОБАВЛЕНО: блок статистики */
function createStatsBlock(stats) {
  const statsBlock = document.createElement("p");
  statsBlock.className = "dish-rating-stats";
  statsBlock.textContent = getStatsText(stats);

  return statsBlock;
}

function getStatsText(stats) {
  if (!stats || Number(stats.ratings_count) === 0) {
    return "★ Ще немає оцінок";
  }

  const averageRating = Number(stats.average_rating).toFixed(1);
  const ratingsCount = Number(stats.ratings_count);

  return `★ ${averageRating} / 5 · ${ratingsCount} ${getRatingsWord(ratingsCount)}`;
}

function getRatingsWord(count) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "оцінок";
  }

  if (last === 1) {
    return "оцінка";
  }

  if (last >= 2 && last <= 4) {
    return "оцінки";
  }

  return "оцінок";
}

async function refreshSingleDishStats(dishId, statsBlock) {
  const { data, error } = await supabase
    .from("dish_rating_stats")
    .select("dish_id, average_rating, ratings_count")
    .eq("dish_id", dishId)
    .single();

  if (error || !data) {
    statsBlock.textContent = "★ Ще немає оцінок";
    return;
  }

  statsBlock.textContent = getStatsText(data);
}