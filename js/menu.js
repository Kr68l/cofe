const topCategoryButtons = document.querySelectorAll(".top-category");
const subcategoryGroups = document.querySelectorAll(".subcategories");
const subcategoryButtons = document.querySelectorAll(".subcategory");
const allProductInfo = document.querySelectorAll(".product-info");

function scrollToTarget(targetId) {
  const targetElement = document.getElementById(targetId);

  if (!targetElement) return;

  targetElement.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

topCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    const targetId = button.dataset.target;

    topCategoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    subcategoryGroups.forEach((group) => {
      group.classList.remove("active");
      if (group.dataset.submenu === category) {
        group.classList.add("active");
      }
    });

    scrollToTarget(targetId);
  });
});

subcategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parentGroup = button.closest(".subcategories");
    const targetId = button.dataset.target;

    if (parentGroup) {
      parentGroup.querySelectorAll(".subcategory").forEach((btn) => {
        btn.classList.remove("active");
      });
    }

    button.classList.add("active");
    scrollToTarget(targetId);
  });
});



allProductInfo.forEach((details) => {
  details.addEventListener("toggle", () => {
    if (details.open) {
      allProductInfo.forEach((otherDetails) => {
        if (otherDetails !== details) {
          otherDetails.open = false;
        }
      });
    }
  });
});

