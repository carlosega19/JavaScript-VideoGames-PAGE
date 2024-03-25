const homeGames = document.querySelector(".homeGames"),
     homeUser = document.querySelector(".fa-user"),
     homeCart = document.querySelector(".fa-cart-shopping"),
     startNowBtn = document.querySelector(".main-content button")
;

const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

if (user) {
     homeUser.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

     homeUser.addEventListener('click' , ()=>{
          Swal.fire({
               title: `Hi ${user.name}`,
               text: "Do you want to log out?",
               icon: "question",
               showCloseButton: true,
               showCancelButton: true,
               confirmButtonText: "Log Out",
          }).then((res)=>{
               if  (res.isConfirmed){
                    localStorage.removeItem("user");
                    sessionStorage.clear();
                    location.reload()
               }
          });
     })
     
     homeCart.addEventListener('click', ()=> window.location.replace("shop.html"));
}
else
{
     homeUser.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
     homeUser.addEventListener('click' , () =>{
          Swal.fire({
               icon: "error",
               title: "Oops...",
               text: "You don't have an account!",
               footer: '<a href="login.html">Register or Log-in</a>'
             });
     })
     homeCart.addEventListener('click' , () =>{
          Swal.fire({
               icon: "error",
               title: "Oops...",
               text: "You're not logged in!",
               footer: '<a href="login.html">Register or Log-in</a>'
             });
     });
}

startNowBtn.addEventListener('click' , ()=> window.location.replace("shop.html"));