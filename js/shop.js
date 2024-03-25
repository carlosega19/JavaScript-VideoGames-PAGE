class Game{
     constructor(img , id , gender, name , size, price ,psn , xbox , pc , nin ,buyIn){  
          this.image = img;
          this.id = id;
          this.gender = gender;
          this.name = name;
          this.price = price;
          this.size = size;
          this.platforms={
               'PSN': psn,
               'XBOX':xbox,
               'STEAM':pc,
               'NINTENDO': nin,
          }; 
     this.buyIn=buyIn;
     }
}

// consts ------------------
const homeGames = document.querySelector(".homeGames"),
     homeUser = document.querySelector(".fa-user"),
     homeCart = document.querySelector(".header-nav .fa-cart-shopping"),
     gamesPanel = document.querySelector(".games-panel"),
     filterBtn = document.querySelector(".filterBtn"),
     gamesFilters = document.querySelector(".games-filters"),
     searchInput = document.querySelector(".searchbar-input"),
     inputsPrice = document.querySelectorAll(".input-price"),
     checkboxesGender = document.querySelectorAll(".games-filters-gender p input"),
     checkboxesConsole = document.querySelectorAll(".games-filters-consoles p input"),
     shopcartDOM = document.querySelector(".shopcart"),
     shopCartPanel = document.querySelector(".shopcart-games"),
     shopcartTotal = document.querySelector(".shopcart h2 span"),
     closeBtnShopcart = document.querySelector(".close-shopcart"),
     checkoutBtn = document.querySelector(".checkout"),
     formSearch = document.querySelector(".form-searchbar")
;

let games = [];
let page = 1;

//  --------------- Functions -------------
function totalToPay(arr){
     if  (arr.length === 0 ) { return 0;}
     return arr.reduce( (total , game)=>{
          return total + game.price;
     } , 0)
}
function addNewGames(elements) {
     elements.forEach(element => {
          let isDuplicate = false;
          for (let i = 0; i < games.length; i++) {
               if (games[i].slug === element.slug) {
                    isDuplicate = true;
                    break;
               }
          }
          if (!isDuplicate) {
               element.price = Math.floor(Math.random() * (60 - 10 + 1)) + 10;
               games.push(element);
          }
     });
}

async function searchGamesByName(txt){
     return fetch(`https://api.rawg.io/api/games?key=8e9c3b676c0648798bb5611ca2c609e8&search=${txt}&page=1&page_size=20`)
          .then(data => data.json())
          .then(resData=> {
               console.log(resData.results);
               return resData.results;
          });
}

function searchGamesByPrice(min , max){
     return games.filter(game => game.price >= min && game.price <= max);
}

function searchGamesByGender(gender){
     return games.filter(game => {
          return game.tags.some(tag => tag.name.toLowerCase().includes(gender.toLowerCase()));
     });
}
function searchGamesByPlatform(platform) {
     if (platform == undefined) {
          return games;
     }
     return games.filter(game => {
          return game.parent_platforms.some(platforms => platforms.platform.name == platform);
     });
}

//
function searchGamesById(id){
     return games.find(game =>  game["id"] == id);
}


async function showGames(arr){
     if (arr.length == 0){
          gamesPanel.innerHTML = `<h2>No results...</h2>`;
          return;
     }
     gamesPanel.innerHTML = "";
     let html = "";
     for (const game of arr) {
          let platformsList = "";
          const {id , name , background_image , platforms , price} = game
          const platformsArray = platforms == null ? [] : platforms;
          for (const plat of platformsArray) {
               platformsList += `<b class="available">${plat.platform.name}</b>`;
          }

          html =   `<div class="gamecard" id="${id}">
                         <div class="gamecard-img-container">
                              <img src="${background_image}" alt="game"/>
                         </div>
                         <h3>${name}</h3>
                         <hr>
                         <p class="gamecard-platforms">${platformsList}</p>
                         <p class="gamecard-price"><span>${price}$</span></p>
                    </div>`;
          gamesPanel.innerHTML += html;
     }
}

/* API RAWG */
async function getGames(page) {
     const response = await fetch(`https://api.rawg.io/api/games?key=8e9c3b676c0648798bb5611ca2c609e8&page=${page}&page_size=20`);
     const data = await response.json();
     return data.results;
}   

// Get all games from the API to an array
async function getAllGames(page) {
     let allGames = [];
     let games = await getGames(page);
     while (allGames.length < 20 && games.length > 0) {
          allGames = allGames.concat(games);
          games = await getGames(page);
     }
     return allGames; // only the first 20 games
}

getAllGames(page).then((gamesData) => {
     addNewGames(gamesData);
     showGames(games);
     if (user){
          applyEventsOnCards();
     }
});

function addPrices() {
     for (const game of games) {
          console.log(game.price);
          if(game["price"] === undefined){
               game["price"] = Math.floor(Math.random() * (60 - 10 + 1)) + 10;
          } 
     }
}

async function loadMoreResults() {
     // Verify if the user in on the bottom 
     if (gamesPanel.scrollTop + gamesPanel.clientHeight >= gamesPanel.scrollHeight) {    
          gamesPanel.innerHTML += '<lottie-player class="load" src="https://lottie.host/b5521566-3f59-4120-9229-34df0522ce3f/1dSgd8EuBl.json" background="##000" speed="2" style="width: 100px; height: 100px" loop autoplay></lottie-player>';
          page += 1;
          if (searchInput.value.length == 0){
               getAllGames(page).then((gamesData) => {
                    addNewGames(gamesData);
                    showGames(games);
                    if (user){
                         applyEventsOnCards();
                    }
               });
          }else{
               const response = await fetch(`https://api.rawg.io/api/games?key=8e9c3b676c0648798bb5611ca2c609e8&search=${searchInput.value}&page=${page}&page_size=20`);
               const data = await response.json();
               addNewGames(data.results);
               showGames(data.results);
          }
          
     }
}

/*---------------------------------------------------------------------------------------*/
function getSelectedGenders(){
     let genders = "";
     checkboxesGender.forEach(input => {
          if (input.checked) genders += input.value;
     });
     return genders;
}

// Activate only one platform at time
function getSelectedConsole(){
     let selected;
     let isSelected = false;
     checkboxesConsole.forEach(input =>{
          if (input.checked){
               selected = input.value;
               isSelected=true;
          }
     });
     if (!isSelected){
          return undefined;
     }
     return selected;
}

function combineFilters(arr1, arr2, arr3, arr4) {
     return games.filter(game =>
          arr1.some(item => item.id === game.id) && arr2.some(item => item.id === game.id) && arr3.some(item => item.id === game.id) && arr4.some(item => item.id === game.id)
     );
}


function applyFilters(){
     searchGamesByName(searchInput.value)
     .then((filteredNames)=> {
          addNewGames(filteredNames);
          const filteredGenders = searchGamesByGender(getSelectedGenders()),
               filteredPrices = searchGamesByPrice(inputsPrice[0].value , inputsPrice[1].value),
               filteredConsoles = searchGamesByPlatform(getSelectedConsole()),
               filteredGames = combineFilters(filteredNames, filteredGenders, filteredPrices , filteredConsoles);
          console.log(filteredConsoles);

          showGames(filteredGames);
          applyEventsOnCards();
     })
}

function applyEventsOnCards(){
     const gamesDOM = document.querySelectorAll(".gamecard");
     gamesDOM.forEach( el =>{
          el.addEventListener("click", ()=>{
               addGameToCart(el.id);
               Swal.fire({
                    title: `${el.children[1].innerText}`,
                    text: `Added to cart!`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'View',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Close',
               }).then((result) =>{
                    if (result.isConfirmed){
                         showCart();
                    }
               })
          });
     });
}

function addGameToCart(id){
     user.shopCart.push(searchGamesById(id));
     localStorage.setItem("userShopcart" , JSON.stringify(user.shopCart));
     updateShopCartView(user.shopCart);
}

function showCart(){
     shopcartDOM.classList.remove('hidden');

     if(shopcartDOM.classList.contains('desappear')){
          shopcartDOM.classList.replace('desappear' , 'appear');
     }else if (shopcartDOM.classList.contains('appear')){
          shopcartDOM.classList.replace('appear', 'desappear');
     }
}

// Update the view of the cart
function updateShopCartView(){
     
     if (user.shopCart.length == 0){
          shopCartPanel.innerHTML = `<h3>Your cart is empty...</h3>`;
          const totalPrice = totalToPay(user.shopCart);
          shopcartTotal.innerHTML = `${totalPrice}$`;
     }else{
          
          let html = "";
          shopCartPanel.innerHTML = html;
          for (const game of user.shopCart){
               let platformsList = "";
               const {id ,name , background_image , platforms , price} = game;
               for (const plat of platforms) {
                    platformsList += `<option>${plat.platform.name}</option>`;
               }
               html +=   `<div class="shopcart-gamecard" id="${id}">
                              <img src="${background_image}" alt="">
                              <div>
                                   <h3>${name}</h3>
                                   <select>
                                        ${platformsList}
                                   </select><br>
                                   <span>${price}$</span>
                              </div>
               
                              <button><i class="fa-solid fa-trash-can"></i></button>
                         </div>`
          }
          shopCartPanel.innerHTML += html;

          const totalPrice = totalToPay(user.shopCart);
          shopcartTotal.innerHTML = `${totalPrice}$`;

          const deleteGame = document.querySelectorAll(".shopcart-gamecard button");
          deleteGame.forEach((btn) =>{
               btn.addEventListener('click' ,()=>{
                    const gameSelected = btn.parentElement.getAttribute("id");
                    const pos = user.shopCart.findIndex(game => game.id == gameSelected);
                    user.shopCart.splice(pos,1);
                    localStorage.setItem("userShopcart" , JSON.stringify(user.shopCart));
                    updateShopCartView();
               });
          });
     
     }   
}

// Events <------------------------->
gamesPanel.addEventListener('scroll', loadMoreResults);

filterBtn.addEventListener('click' , ()=>{
     gamesFilters.classList.toggle("hidden");
});

formSearch.addEventListener('submit', (e)=>{
     e.preventDefault();
     applyFilters();
});
checkboxesGender.forEach((checkbox) => {
     checkbox.addEventListener('change', applyFilters);
});

inputsPrice.forEach((el)=>{
     el.addEventListener('input' , ()=>{
          if (el.value == ""){
               el.value = 1;
          }
          applyFilters();
     });
})

let last = null;
checkboxesConsole.forEach((checkbox)=>{
     checkbox.addEventListener("change" , ()=>{
          if (last != null && last != checkbox && last.checked == true){
               last.click();
          }
          last = checkbox;
          applyFilters();
     }); 
});

// Page behavior
const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
if (user){
     user.shopCart = JSON.parse(localStorage.getItem("userShopcart")) || [];
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
     });

     setTimeout(()=>{
          updateShopCartView();
     } , 0);
          
     homeCart.addEventListener('click' , ()=> showCart());
     closeBtnShopcart.addEventListener('click', () => showCart());
     checkoutBtn.addEventListener('click', () => {
          if (user.shopCart.length === 0){
               Swal.fire({
                    icon: 'error',
                    title: 'Your cart is empty!',
                    text: 'Please add some games before checking out.'
               })
          }else{
               Swal.fire({
                    title: "Buy now?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, buy it!",
               }).then((res) => {
                    if (res.isConfirmed){
                         user.shopCart = [];
                         localStorage.setItem('userShopcart' , JSON.stringify(user.shopCart));
                         updateShopCartView();
                         Swal.fire({
                              title: "Purchase completed!",
                              text: `In few minutes will send you the codes to\n${user.email}`,
                              icon: "success",
                         });
                    }
               });
          }
     });
}else{

     homeUser.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
     homeUser.addEventListener('click' , () =>{
          Swal.fire({
               icon: "error",
               title: "Oops...",
               text: "You don't have an account!",
               footer: '<a href="login.html">Register or Log-in</a>'
          });
     });
     homeCart.addEventListener('click' , ()=>{
          Swal.fire({
               icon: "error",
               title: "Oops...",
               text: "You don't have an account!",
               footer: '<a href="login.html">Register or Log-in</a>'
          });
     })
}