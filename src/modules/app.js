// import { json } from "body-parser";
import { products } from "./products";

const ordersBtn = document.getElementById('orders-btn');

const leftSidebar = document.getElementById('left-sidebar');
const categoriesList = document.getElementById('categories-list');
const productList = document.getElementById('product-list');
const productDetails = document.getElementById('product-details');
const shoppingCartBlock = document.getElementById('shopping-cart-block');

let selectedProduct = ``;

// Откат страницы до ее дефолтного состояния
function resetToCategories() {
    productList.classList.add('hidden');
    productDetails.classList.add('hidden');
    shoppingCartBlock.classList.add('hidden');
    leftSidebar.classList.remove('hidden');

    // Проверка на пустой [] в localStorage
    if (getOrders().length === 0) {
        shoppingCartBlock.style.display = "none";
    }
}

// Вывод продуктов соответствующей категории по клику на нее посредством фильтрации
function showProducts(category) {
    const categoryProducts = products.filter(product => product.category === category);

    productList.innerHTML = ``;
    categoryProducts.forEach(product => {
        const productCard = document.createElement('div');
        const img = new Image();
        // copyplugin
        // imageminimizer
        img.src = product.img;
        img.alt = product.name;
        productCard.classList.add('product-card');
        // <img src="images/${product.img}.png" alt="${product.name}">
        productCard.innerHTML = `
        <p><span>Имя:</span> ${product.name}</p>
        <p><span>Цена:</span> ${product.price} UAH</p>
        `;
        productCard.addEventListener('click', () => {
            showProductDetails(product);
        });
        productList.appendChild(productCard);
        productCard.appendChild(img);
    });

    productList.classList.remove('hidden');
}

categoriesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('category')) {
        const category = e.target.innerText.toLowerCase();
        showProducts(category);
    }
});

// Блок инфы о выбранном товаре
function showProductDetails(product) {
    selectedProduct = product;

    const img = new Image();
    img.src = product.img;
    img.alt = product.name;
    
    // <img src="./images/${product.img}.png" alt="${product.name}">
    productDetails.innerHTML = `
        <h3>Информация о товаре:</h3>
        <p><span>Имя:</span> ${product.name}</p>
        <p><span>Цена:</span> ${product.price} UAH</p>
        <button id="buy-button">Купить</button>
    `;
    productDetails.appendChild(img);
    
    document.getElementById('buy-button').addEventListener('click', buyProduct);

    productDetails.style.display = "flex";
}

// Ф-ция на кнопку "Купить"
function buyProduct() {
    const order = {
        product: selectedProduct.name,
        price: selectedProduct.price,
        orderTime: new Date().toLocaleString(),
    };

    saveOrder(order);
    alert(`
        Благодарим вас за покупку на нашем сайте!
        Вы приобрели ${selectedProduct.name} за ${selectedProduct.price} UAH.
        Желаем вам хорошего дня!
    `);

    resetToCategories();
}

// Сохранение покупки локально
function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Геттер для покупки
function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Вывод покупок в ХТМЛ
function showOrders() {
    shoppingCartBlock.innerHTML = ``;
    const orders = getOrders();
    if (orders.length > 0) {
        shoppingCartBlock.style.display = "block";
        const orderList = document.createElement('ul');
        orders.forEach((order, index) => {
            const orderRow = document.createElement('li');
            orderRow.innerHTML = `
                <p class="order-info">Товар: ${order.product}, Сумма покупки: ${order.price} UAH, Дата и время покупки: ${order.orderTime}</p>
                <div class="order-btns">
                    <button class="order-show-btn" data-index="${index}">Показать</button>
                    <button class="order-delete-btn" data-index="${index}">Удалить</button>
                </div>
            `;
            orderList.appendChild(orderRow);
        });
        shoppingCartBlock.appendChild(orderList);
    } else {
        shoppingCartBlock.style.display = "none";
        alert(`Вы еще не совершили покупку.`);
    }

    document.querySelectorAll('.order-show-btn').forEach(btn => {
        btn.addEventListener('click', showOrderInfo);
    });

    document.querySelectorAll('.order-delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteOrder);
    });
}

// Ф-ции для кнопашков покупок
function showOrderInfo(e) {
    const orders = getOrders();
    const index = e.target.getAttribute('data-index');
    const order = orders[index];
    productDetails.innerHTML = `
        <h2>Информация о вашей покупке:</h2>
        <p><span>Товар: </span>${order.product}</p>
        <p><span>Сумма: </span>${order.price} UAH</p>
        <p><span>Дата и время: </span>${order.orderTime}</p>
    `;
    productDetails.classList.remove('hidden');
}

function deleteOrder(e) {
    const orders = getOrders();
    const index = e.target.getAttribute('data-index');
    orders.splice(index, 1);
    
    localStorage.setItem('orders', JSON.stringify(orders));
    showOrders();
}

// Обработчик на кнопку "Мои покупки"
ordersBtn.addEventListener('click', () => {
    leftSidebar.classList.add('hidden');
    productList.classList.add('hidden');
    productDetails.classList.add('hidden');
    shoppingCartBlock.classList.remove('hidden');
    showOrders();
});

// Проверка при инициализации страницы
if (getOrders().length === 0) {
    shoppingCartBlock.style.display = "none";
}

resetToCategories();