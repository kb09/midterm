// Client facing scripts here
const producetsE1= document.querySelector("/../db/schema/03_items.sql")

//  add item to cart

let cartItem = {}

function addToCart(){
  let addItem = document.getElementById("add");
  let delItem = document.getElementById("delete");
  if(addItem.clicked == true){
    cartItem.push(items[item].id)
  }
}


// Adding items to cart

// if button is cliecked --> ( event listner)
// add item name,price, id to cart









// document.getElementById("add").onclick = function() {
//   addToCart(${items.id})
// }

// // cart array
// let cart = [];
// // function addToCart

// function addToCart(id){
//   // check if product already exist in cart
//   if(cart.some((product) => product.id === id)){
//     alert("product already in cart")
//   } else{
//     const product = items.find((item) => item.id === id)
//     cart.push({
//       ...product,
//       numberOfUnits : 1
//     })



//   }

// updateCart();

// }

// //update cart function
// function updateCart(){
//   renderCartItems();
//   // renderSubtotal();
// }

// // render cart items


// // when button is clicked add to cart



