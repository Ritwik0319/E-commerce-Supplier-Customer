// SignUp pade validataion

let userName = document.getElementById("userName");
let useremail = document.getElementById("userEmail");
let userPassword = document.getElementById("userPassword");
let confirmPassword = document.getElementById("confirmPassword");
let signUpbtn = document.getElementById("signupbtn");

signUpbtn.onclick = (e) => {
  e.preventDefault();

  let name = userName.value.trim();
  let email = useremail.value.trim();
  let password = userPassword.value.trim();
  let confirmPass = confirmPassword.value.trim();

  if (!name || !email || !password || !confirmPass) {
    return alert("All fields are mandatory!");
  }

  if (password.length < 6) {
    return alert("Password must be at least 6 characters long.");
  }

  if (password !== confirmPass) {
    return alert("Passwords do not match!");
  }

  fetch("http://localhost:3000/registeredUsers")
    .then((res) => res.json())
    .then((data) => {
      const existingUser = data.find((user) => user.email === email);
      if (existingUser) {
        return alert("User already exists with this email!");
      }

      let userId = data.length + 1;

      let newUser = {
        id: userId,
        name: name,
        email: email,
        password: password,
      };

      fetch("http://localhost:3000/registeredUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.json())
        .then(() => {
          // Redirect to login page
          window.location.href = "login.html";
          alert("User successfully signed up!");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to sign up.");
        });
    })
    .catch((err) => {
      console.error(err);
    });
};
