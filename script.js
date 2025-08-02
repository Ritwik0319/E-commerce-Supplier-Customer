let sellerbtn = document.getElementById("sellerbtn");
let buyerbtn = document.getElementById("buyerbtn");

sellerbtn.onclick = () => {
  location.href = "login.html";
  localStorage.setItem("userRole", "seller");
};
buyerbtn.onclick = () => {
  location.href = "login.html";
  localStorage.setItem("userRole", "buyer");
};
