// cart feature

if(document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', start)
} else { start() }

function start() {

  const addButton = document.getElementsByClassName('.cart-buttons .add')
  for (let i = 0; i < addButton.length; i++) {
      let button = addButton[i]
      button.addEventListener('click', addBtnClicked) //--> review addBtnClicked function
  }

  const deleteButton = document.getElementsByClassName('.cart-buttons .delete')
  for (let i = 0; i < deleteButton.length; i++) {
      let button = deleteButton[i]
      button.addEventListener('click', delCartItems) //----> review delCartItems function
  }

  const cartQuantity = document.getElementsByClassName('qnty')
  for (let i = 0; i < cartQuantity.length; i++) {
      let input = cartQuantity[i]
      input.addEventListener('change', cartQnty)
  }
  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', placeOrder)
}

//add to cart
function addBtnClicked(event) {
  let button = event.target
  let itemInCart = button.parentElement.parentElement
  let name = itemInCart.getElementsByClassName('.desc .name').innerText
  let price = itemInCart.getElementsByClassName('. desc .price').innerText
  let pic = itemInCart.getElementsByClassName('.all-imgs-container img').src
  addItemToCart(name, price, pic)
  updateCartTotal()
}

//del from cart
function delCartItems(event) {
  let buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  updateCartTotal()
}

// cart quantity
function cartQnty(event) {
  let input = event.target
  if (input.value <= 0) {
      input.value = 1
  }
  updateCartTotal()
}

//place order

function placeOrder() {
  alert('Your Order Has Been Placed')
  let cartItems = document.getElementsByClassName('cart-items')[0]
  while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild)
  }
  updateCartTotal();
}

function updateCartTotal() {
  let cartItems = document.getElementsByClassName('cart-items')[0]
  let productInfo = cartItems.getElementsByClassName('product-info')
  let total = 0
  for (let i = 0; i < productInfo.length; i++) {
      let cartRow = productInfo[i]
      let itemPrice = cartRow.getElementsByClassName('cart-price')[0]
      let qntyInCart = document.getElementsByClassName('qnty')[0]
      let price = parseFloat(itemPrice.innerText.replace('$', ''))
      let quantity = qntyInCart.value
      total = total + (quantity * price)  // total was 0 so adding it does nothing
  }
  total = Math.round(total * 100) / 100
  document.getElementsByClassName('cart-items-price')[0].innerText = '$' + total
}

function addItemToCart(name, price, pic) {
  let cartRow = document.createElement('div')
  cartRow.classList.add('product-info')
  let cartItems = document.getElementsByClassName('cart-items')[0]
  let itemNames = cartItems.getElementsByClassName('item-title')
  for (let i = 0; i < itemNames.length; i++) {
      if (itemNames[i].innerText === name) {
          alert('Item already in cart');
          return
      }
  }

  //display the items

  let cartRowInfo = `

      <div class="cart-item">
          <img class="item-pic" src="${pic}" width="110" height="110">
          <span class="item-name">${name}</span>
      </div>

      <span class="cart-price">${price}</span>

      <div class="cart-quantity">
          <input class="qnty" type="number" value="1">
          <button class="btn btn-danger" type="button">REMOVE</button>
      </div>`

  cartRow.innerHTML = cartRowInfo
  cartItems.append(cartRow)
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', delCartItems)
  cartRow.getElementsByClassName('qnty')[0].addEventListener('change', cartQnty)
}

