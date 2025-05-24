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
