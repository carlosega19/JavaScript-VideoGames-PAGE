class User{
     constructor(name , email, password ,  shopCart){
         this.name = name;
         this.email = email;
         this.password = password;
         this.shopCart=[];
     }
 
}

// Cambiar el formulario a registro o a inicio de sesion
function changeForm(){
     registerForm.classList.toggle("notvisible");
     loginForm.classList.toggle("notvisible");
}

// Funcion de registro de usuarios 
function register(email , username , password){
     const user = new User(username , email , password);
     localStorage.setItem('users' , JSON.stringify(user));
     localStorage.setItem("userShopcart" , JSON.stringify([]));
     changeForm();
     
     Toastify({
          text: `User ${username} registered successfully`,
          className: "info",
          style: {
            background: "linear-gradient(to right, #270156 ,#680034)",
          }
     }).showToast();
}

// Funcion de inicio de sesion
function login(username , password){
     const userLS = JSON.parse(localStorage.getItem("users")) || null;
     if (userLS != null){
          if (userLS.name == username && userLS.password == password){
               return true;
          }
     }
     return false;
}

// Variables
const loginForm = document.querySelector(".form-container"),
     loginUsername = document.querySelector("#username"),
     loginPassword = document.querySelector("#pass"),
     registerForm = document.querySelector(".register"),
     registerEmail = document.querySelector("#register-email"),
     registerUsername = document.querySelector("#register-username"),
     registerPassword = document.querySelector("#register-pass");


const loginChange = document.querySelector(".login-change");
loginChange.addEventListener('click' , ()=>changeForm());
const registerChange = document.querySelector(".register-change");
registerChange.addEventListener("click" , changeForm);



registerForm.addEventListener('submit' , (e)=>{
     e.preventDefault();
     let regEmail = registerEmail.value;
     let regName = registerUsername.value;
     let regPass = registerPassword.value;
     register(regEmail , regName , regPass);
});

loginForm.addEventListener('submit', (e) =>{
     e.preventDefault();
     let rememberUser = document.querySelector(".remember input");
     let user = JSON.parse(localStorage.getItem("users"));
     if (rememberUser.checked){
          localStorage.setItem('user' , JSON.stringify(user));
     }else{
          sessionStorage.setItem('user' , JSON.stringify(user));
     }
     const userFinded = login(loginUsername.value , loginPassword.value);
     
     if (userFinded){
          location.replace("index.html");
     }
     
     
     if (!userFinded){
          Toastify({
               text: "This account doesnt exist\nTry again",
               className: "info",
               style: {
                 background: "linear-gradient(to right, #270156 ,#680034)",
               }
             }).showToast();
     }

});