export function displayYearInTitle() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentYear = urlParams.get("year");
  if (currentYear) {
    const titleSpan = document.querySelector(".brand-logo.center"); // Corrigido o seletor
    const currentTitle = titleSpan.textContent;
    titleSpan.textContent = currentTitle + " " + currentYear;
  }
}
