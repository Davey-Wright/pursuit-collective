class Cart {
  constructor(cart) {
    this.DOM = {
      cart: cart,
      openCart: CobblesKitchen.header.primaryNav.querySelector('[data-cart-open]'),
      closeCart: cart.querySelector('[data-cart-close]'),
      documentOverlay: document.querySelector('.document-overlay')
    }

    this.initEventListeners() 
  }

  init(json) {
    CartJS.init(json);
  }

  initEventListeners() {
    this.DOM.openCart.addEventListener('click', this.openCart.bind(this))
    this.DOM.closeCart.addEventListener('click', this.closeCart.bind(this))
    this.DOM.documentOverlay.addEventListener('click', this.closeCart.bind(this))
  }

  openCart() {
    this.DOM.cart.classList.add('sidebar-cart--show');
    this.DOM.documentOverlay.classList.add('document-overlay--show');
  }

  closeCart() {
    this.DOM.cart.classList.remove('sidebar-cart--show')
    this.DOM.documentOverlay.classList.remove('document-overlay--show')
  }

  addToCart(product) {    
    CartJS.addItem(
      product.currentVariant.id,
      product.quantity,
      null, { 
        "success": (data) => {
          this.openCart()
        },
        "error": () => {
          console.log('oh dear');
        }
    });
    this.resetProductDOM()
  } 

  resetProductDOM() {
    const product = CobblesKitchen.product
    product.updatePrice(product.currentVariant.price)
    product.quantity = 1
    product.DOM.quantity.value = 1
  }
}