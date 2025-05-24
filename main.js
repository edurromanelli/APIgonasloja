 // Product Class
        class Product {
            constructor(id, title, price, description, image, rating = { rate: 0, count: 0 }) {
                this.id = id;
                this.title = title;
                this.price = price;
                this.description = description;
                this.image = image;
                this.rating = rating;
            }

            formatPrice() {
                return `R$ ${this.price.toFixed(2).replace('.', ',')}`;
            }

            renderProductCard() {
                return `
                    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden fade-in">
                        <div class="relative pb-[75%] overflow-hidden">
                            <img src="${this.image}" alt="${this.title}" class="absolute h-full w-full object-cover hover:scale-105 transition duration-300">
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-lg text-gray-800 mb-1 truncate">${this.title}</h3>
                            <div class="flex items-center mb-2">
                                <div class="flex text-yellow-400 text-sm mr-1">
                                    ${this.renderStars()}
                                </div>
                                <span class="text-gray-500 text-sm">${this.rating.rate}</span>
                            </div>
                            <p class="text-indigo-600 font-bold text-xl mb-3">${this.formatPrice()}</p>
                            <div class="flex space-x-2">
                                <button data-id="${this.id}" class="view-details bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition flex-1">
                                    Detalhes
                                </button>
                                <button data-id="${this.id}" class="add-to-cart bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition">
                                    <i class="fas fa-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            renderStars() {
                const fullStars = Math.floor(this.rating.rate);
                const hasHalfStar = this.rating.rate % 1 >= 0.5;
                let stars = '';
                
                for (let i = 0; i < fullStars; i++) {
                    stars += '<i class="fas fa-star"></i>';
                }
                
                if (hasHalfStar) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                }
                
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                for (let i = 0; i < emptyStars; i++) {
                    stars += '<i class="far fa-star"></i>';
                }
                
                return stars;
            }

            renderModalDetails() {
                document.getElementById('modal-title').textContent = this.title;
                document.getElementById('modal-image').src = this.image;
                document.getElementById('modal-image').alt = this.title;
                document.getElementById('modal-description').textContent = this.description;
                document.getElementById('modal-price').textContent = this.formatPrice();
                document.getElementById('modal-rating').textContent = `${this.rating.rate} (${this.rating.count} avaliações)`;
                document.getElementById('quantity').textContent = '1';
            }
        }

        // Cart Class
        class Cart {
            constructor() {
                this.items = [];
                this.loadFromLocalStorage();
                this.updateCartCount();
            }

            addItem(product, quantity = 1) {
                const existingItem = this.items.find(item => item.product.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.items.push({ product, quantity });
                }
                
                this.saveToLocalStorage();
                this.updateCartCount();
                this.showNotification('Produto adicionado ao carrinho!');
            }

            removeItem(productId) {
                this.items = this.items.filter(item => item.product.id !== productId);
                this.saveToLocalStorage();
                this.updateCartCount();
                this.renderCartItems();
            }

            updateQuantity(productId, newQuantity) {
                const item = this.items.find(item => item.product.id === productId);
                
                if (item) {
                    if (newQuantity > 0) {
                        item.quantity = newQuantity;
                    } else {
                        this.removeItem(productId);
                    }
                }
                
                this.saveToLocalStorage();
                this.updateCartCount();
                this.renderCartItems();
            }

            clearCart() {
                this.items = [];
                this.saveToLocalStorage();
                this.updateCartCount();
                this.renderCartItems();
            }

            getTotalItems() {
                return this.items.reduce((total, item) => total + item.quantity, 0);
            }

            getTotalPrice() {
                return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            }

            saveToLocalStorage() {
                localStorage.setItem('cart', JSON.stringify(this.items));
            }

            loadFromLocalStorage() {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    // We need to reconstruct the Product objects from the saved data
                    this.items = JSON.parse(savedCart).map(item => ({
                        product: new Product(
                            item.product.id,
                            item.product.title,
                            item.product.price,
                            item.product.description,
                            item.product.image,
                            item.product.rating
                        ),
                        quantity: item.quantity
                    }));
                }
            }

            updateCartCount() {
                const countElement = document.getElementById('cart-count');
                const totalItems = this.getTotalItems();
                countElement.textContent = totalItems;
                
                if (totalItems > 0) {
                    countElement.classList.remove('hidden');
                } else {
                    countElement.classList.add('hidden');
                }
            }

            renderCartItems() {
                const cartItemsElement = document.getElementById('cart-items');
                
                if (this.items.length === 0) {
                    cartItemsElement.innerHTML = '<p class="text-gray-500 text-sm px-4 py-2">Seu carrinho está vazio</p>';
                    return;
                }
                
                let html = '';
                
                this.items.forEach(item => {
                    const product = item.product;
                    const totalPrice = product.price * item.quantity;
                    
                    html += `
                        <div class="flex items-center px-4 py-2 hover:bg-gray-50">
                            <img src="${product.image}" alt="${product.title}" class="w-12 h-12 object-cover rounded">
                            <div class="ml-3 flex-1">
                                <h4 class="text-sm font-medium text-gray-800 truncate">${product.title}</h4>
                                <p class="text-xs text-gray-500">${product.formatPrice()} x ${item.quantity}</p>
                                <p class="text-sm font-medium text-indigo-600">R$ ${totalPrice.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div class="flex items-center">
                                <button data-id="${product.id}" class="decrease-quantity text-gray-500 hover:text-indigo-600 p-1">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="mx-1 text-sm w-6 text-center">${item.quantity}</span>
                                <button data-id="${product.id}" class="increase-quantity text-gray-500 hover:text-indigo-600 p-1">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                                <button data-id="${product.id}" class="remove-item text-gray-500 hover:text-red-500 p-1 ml-2">
                                    <i class="fas fa-trash text-xs"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                // Add total and checkout button
                html += `
                    <div class="px-4 py-2 border-t">
                        <div class="flex justify-between items-center">
                            <span class="font-medium">Total:</span>
                            <span class="font-bold text-indigo-600">R$ ${this.getTotalPrice().toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                `;
                
                cartItemsElement.innerHTML = html;
                
                // Add event listeners to the new buttons
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                        const item = this.items.find(item => item.product.id === productId);
                        if (item) {
                            this.updateQuantity(productId, item.quantity - 1);
                        }
                    });
                });
                
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                        const item = this.items.find(item => item.product.id === productId);
                        if (item) {
                            this.updateQuantity(productId, item.quantity + 1);
                        }
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                        this.removeItem(productId);
                    });
                });
            }

            showNotification(message) {
                const notification = document.createElement('div');
                notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center';
                notification.innerHTML = `
                    <i class="fas fa-check-circle mr-2"></i>
                    <span>${message}</span>
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }
        }
 document.addEventListener('DOMContentLoaded', () => {
            const productsGrid = document.getElementById('products-grid');
            const loadingElement = document.getElementById('loading');
            const cart = new Cart();
            
            // Cart toggle
            const cartBtn = document.getElementById('cart-btn');
            const cartDropdown = document.getElementById('cart-dropdown');
            
            cartBtn.addEventListener('click', () => {
                cartDropdown.classList.toggle('hidden');
                cart.renderCartItems();
            });
            
            // Close cart when clicking outside
            document.addEventListener('click', (e) => {
                if (!cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                    cartDropdown.classList.add('hidden');
                }
            });
            
            // Checkout button
            document.getElementById('checkout-btn').addEventListener('click', () => {
                alert(`Compra finalizada! Total: R$ ${cart.getTotalPrice().toFixed(2).replace('.', ',')}`);
                cart.clearCart();
                cartDropdown.classList.add('hidden');
            });
            
            // Product modal
            const productModal = document.getElementById('product-modal');
            const closeModal = document.getElementById('close-modal');
            
            closeModal.addEventListener('click', () => {
                productModal.classList.add('hidden');
            });
            
            // Close modal when clicking outside
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    productModal.classList.add('hidden');
                }
            });
            
            // Quantity controls in modal
            document.getElementById('increase-qty').addEventListener('click', () => {
                const quantityElement = document.getElementById('quantity');
                const currentQty = parseInt(quantityElement.textContent);
                quantityElement.textContent = currentQty + 1;
            });
            
            document.getElementById('decrease-qty').addEventListener('click', () => {
                const quantityElement = document.getElementById('quantity');
                const currentQty = parseInt(quantityElement.textContent);
                if (currentQty > 1) {
                    quantityElement.textContent = currentQty - 1;
                }
            });
            
            // Add to cart from modal
            document.getElementById('add-to-cart-modal').addEventListener('click', () => {
                const productId = parseInt(document.getElementById('modal-title').getAttribute('data-id'));
                const quantity = parseInt(document.getElementById('quantity').textContent);
                
                const product = currentProducts.find(p => p.id === productId);
                if (product) {
                    cart.addItem(product, quantity);
                    productModal.classList.add('hidden');
                }
            });
            
            // Rating slider
            const ratingSlider = document.getElementById('rating');
            const ratingValue = document.getElementById('rating-value');
            
            ratingSlider.addEventListener('input', () => {
                ratingValue.textContent = ratingSlider.value;
            });
            
            // Form validation
            const contactForm = document.getElementById('contact-form');
            const formSuccess = document.getElementById('form-success');
            
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Reset errors
                document.querySelectorAll('.error-message').forEach(el => {
                    el.classList.add('hidden');
                    el.textContent = '';
                });
                
                let isValid = true;
                
                // Validate name
                const name = document.getElementById('name').value.trim();
                if (name.length < 3) {
                    document.getElementById('name-error').textContent = 'Nome deve ter pelo menos 3 caracteres';
                    document.getElementById('name-error').classList.remove('hidden');
                    isValid = false;
                }
                
                // Validate email
                const email = document.getElementById('email').value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    document.getElementById('email-error').textContent = 'Por favor, insira um e-mail válido';
                    document.getElementById('email-error').classList.remove('hidden');
                    isValid = false;
                }
                
                // Validate message
                const message = document.getElementById('message').value.trim();
                if (message.length < 10) {
                    document.getElementById('message-error').textContent = 'A mensagem deve ter pelo menos 10 caracteres';
                    document.getElementById('message-error').classList.remove('hidden');
                    isValid = false;
                }
                
                if (isValid) {
                    // Simulate form submission
                    setTimeout(() => {
                        contactForm.reset();
                        formSuccess.classList.remove('hidden');
                        
                        setTimeout(() => {
                            formSuccess.classList.add('hidden');
                        }, 3000);
                    }, 1000);
                }
            });
            
            // Fetch products from FakeStore API
            let currentProducts = [];
            
            document.getElementById('fetch-fake').addEventListener('click', () => {
                fetchProducts('https://fakestoreapi.com/products');
            });
            
            // Fetch products from local PHP API
            document.getElementById('fetch-local').addEventListener('click', () => {
                fetchProducts('http://localhost/backend/api.php/api/produtos');
            });
            
            // Initial load - fetch from FakeStore
            fetchProducts('https://fakestoreapi.com/products');
            
            function fetchProducts(url) {
                loadingElement.classList.remove('hidden');
                productsGrid.innerHTML = '';
                
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        loadingElement.classList.add('hidden');
                        
                        if (data && Array.isArray(data)) {
                            currentProducts = data.map(item => {
                                // Handle both API formats
                                const productData = {
                                    id: item.id || 0,
                                    title: item.title || item.nome || 'Produto sem nome',
                                    price: item.price || item.preco || 0,
                                    description: item.description || item.descricao || 'Sem descrição',
                                    image: item.image || item.imagem || 'https://via.placeholder.com/300',
                                    rating: {
                                        rate: item.rating?.rate || 0,
                                        count: item.rating?.count || 0
                                    }
                                };
                                
                                return new Product(
                                    productData.id,
                                    productData.title,
                                    productData.price,
                                    productData.description,
                                    productData.image,
                                    productData.rating
                                );
                            });
                            
                            renderProducts(currentProducts);
                        } else {
                            showError('Os dados recebidos não estão no formato esperado.');
                        }
                    })
                    .catch(error => {
                        loadingElement.classList.add('hidden');
                        showError(`Erro ao carregar produtos: ${error.message}`);
                        console.error('Error fetching products:', error);
                    });
            }
            
            function renderProducts(products) {
                productsGrid.innerHTML = '';
                
                if (products.length === 0) {
                    productsGrid.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Nenhum produto encontrado</p>
                        </div>
                    `;
                    return;
                }
                
                products.forEach(product => {
                    productsGrid.insertAdjacentHTML('beforeend', product.renderProductCard());
                });
                
                // Add event listeners to the new buttons
                document.querySelectorAll('.view-details').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                        const product = currentProducts.find(p => p.id === productId);
                        
                        if (product) {
                            product.renderModalDetails();
                            document.getElementById('modal-title').setAttribute('data-id', product.id);
                            productModal.classList.remove('hidden');
                        }
                    });
                });
                
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                        const product = currentProducts.find(p => p.id === productId);
                        
                        if (product) {
                            cart.addItem(product);
                        }
                    });
                });
            }
            
            function showError(message) {
                productsGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-gray-600">${message}</p>
                        <button class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                            Tentar novamente
                        </button>
                    </div>
                `;
                
                // Add event listener to the retry button
                document.querySelector('#products-grid button').addEventListener('click', () => {
                    fetchProducts('https://fakestoreapi.com/products');
                });
            }
        });
