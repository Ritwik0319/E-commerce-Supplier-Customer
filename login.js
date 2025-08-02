let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = (e) => {
  e.preventDefault();

  let email = loginEmail.value.trim();
  let password = loginPassword.value.trim();

  if (!email || !password) {
    return alert("Both fields are required!");
  }

  fetch("http://localhost:3000/registeredUsers")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      const user = data.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("userId", user.id);
        let userrole=localStorage.getItem("userRole")
        if(userrole=="seller"){
          location.href="seller.html"
        }else{
          location.href="products.html"
        }
        alert("Login successful!");
      } else {
        alert("Invalid email or password!");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Login error!");
    });
};
