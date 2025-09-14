//* remove active class funtion 
const removeActive = () => {
  const catagoriButton = document.querySelectorAll(".category_btn");
  catagoriButton.forEach(btn => {
    btn.classList.remove("active");
  });
};
//*manage spinner
const manageSpinner = (status, delay = 0) => {
  const spinner = document.getElementById("spinner");
  const content = document.getElementById("choose_tree");

  if (status) {
    spinner.classList.remove("hidden");
    content.classList.add("hidden");
  } else {
    setTimeout(() => {
      spinner.classList.add("hidden");
      content.classList.remove("hidden");
    }, delay);
  }
};

//* load catagori funtion
const loadCatagory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => displayCatagories(data.categories));
};

//*displayCatagori
const displayCatagories = (catagories) => {
  const categoryContainer = document.getElementById("Catagories_Container");

  catagories.forEach(catagory => {
    const CatagoriList = document.createElement("li");
    CatagoriList.className = "category_btn hover:bg-green-500 px-3 py-2 mb-4 rounded cursor-pointer list-none ";
    CatagoriList.innerText = catagory.category_name;

    
    CatagoriList.addEventListener("click", (e) => {
      e.preventDefault();
      removeActive();
      CatagoriList.classList.add("active");
      loadPlantsByCategory(catagory.id);
    });
    categoryContainer.append(CatagoriList);
  });
};
loadCatagory();


//* load all tree funtion 
const loadAllTrees = () => {
  manageSpinner(true); 
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => displayAllTrees(data.plants));
};

const loadPlantsByCategory = (id) => {
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then(res => res.json())
    .then(data => displayAllTrees(data.plants)); 
};
//*display all trees
const displayAllTrees = (plants ) => {
  manageSpinner(true); 
  const cardContainer = document.getElementById("card_container");
  cardContainer.innerHTML = ""; 
  plants.forEach(plant => {
    const plantDiv = document.createElement("div");
    plantDiv.innerHTML = ` 
      <div class="bg-white shadow-md rounded-lg overflow-hidden p-4">
 <img class="bg-gray-200 h-36 w-full mb-3 rounded" src="${plant.image}" alt="${plant.image}">
        <h3 class="font-semibold text-[#1F2937]">${plant.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${plant.description}</p>
        <span class="inline-block bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">${plant.category}</span>
        <div class="flex items-center justify-between mt-3">

          <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2  md:text-[16px] rounded-lg add_to_cart">Add to Cart</button>
          <span class="font-semibold text-[#1F2937] Money ">৳${plant.price}</span>
        </div>
      </div>
    `

  cardContainer.append(plantDiv);

    // *add to cart button 
    const addBtn = plantDiv.querySelector(".add_to_cart");
    addBtn.addEventListener("click", () => {
      addToCart(plant);
    });
  });
  manageSpinner(false, 1500);
};


let cart = [];
//* add to cart funtion 
const addToCart = (plant) => {
   let found = cart.find(pices => pices.id === plant.id);

  if (found) {
    found.quantity++; 
  } else {
    plant.quantity = 1; 
    cart.push(plant);
  }

  YourCart();
};

const YourCart = () => {
  const YourCartContainer = document.getElementById("Your_Cart_Container");
  YourCartContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price  * item.quantity;

    const div = document.createElement("div");
    div.className = " items-center justify-between bg-green-50 p-2 rounded mb-2";
    div.innerHTML = `
      <span>${item.name}</span>
     <div class="flex justify-between ">
      <span >৳${item.price}× ${item.quantity}</span>
      <button class="text-red-500 remove-btn">✕</button>
      </div>
    `;

  // * remove button 
    div.querySelector(".remove-btn").addEventListener("click", () => {
      cart = cart.filter(pices => pices !== item);
      YourCart();
    });

    YourCartContainer.append(div);
  });

  // *total taka 
  const totalDiv = document.createElement("div");
  totalDiv.className = "border-t mt-4 pt-3 flex justify-between font-semibold";
  totalDiv.innerHTML = `
    <span>Total:</span>
    <span>৳${total}</span>
  `;
  YourCartContainer.append(totalDiv);
};

loadAllTrees();

