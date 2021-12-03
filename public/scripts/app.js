// Client facing scripts here
const addQuantityToCart = function(id) {
// const previousInputValue = $(".item-quantity-" + id).defaultValue()
const previousInputValue = document.getElementsByClassName(".item-quantity-" + id).value;


console.log("Previous Value", document.getElementsByClassName(".item-quantity-" + id))


// console.log("Previous value", previousInputValue)
const Id = Number(id)
console.log("id", Id)
const cartValue = $(".cart-number").text()
console.log("cart value", cartValue)
const quantityInput = $(".item-quantity-" + Id).val()
console.log("quantity Input", quantityInput)
// const quantityInputValue = $(".item-quantity-" + Id).val()
const currentCartValue = Number(cartValue) + Number(quantityInput) - Number(previousInputValue)
console.log("Input Value", currentCartValue)
$(".cart-number").text(currentCartValue)


}
