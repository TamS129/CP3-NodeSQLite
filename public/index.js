/*
  Name: Tamara Slone
  Date: November 12,2024
  This is the javascript that contains my page for games on the front end. It contains a filter to filter by company and a view details button.
*/
'use strict';

/* GAME PAGE JAVASCRIPT */

let storeProducts = [];


async function fetchGames() {
    fetch('/games', { method: 'POST' }) 
        .then(statusCheck)
        .then(res => res.json())
        .then(data => {

            console.log("Fetched data:", data); 

            if (data && data.games) {
                storeProducts = data.games; 
                displayProducts(storeProducts); 
            } 
            else {
                console.error('Games data is not in expected format or missing.');
            }
        })
        .catch(handleError); 
}



function displayProducts(products) {

    const productGrid = document.getElementById('productGrid');
    const prodTemplate = document.getElementById('productTemplate');

    productGrid.innerHTML = ""; 

    products.forEach(product => {

        console.log('Displaying product:', product); 

        
        const productItem = prodTemplate.cloneNode(true);
        productItem.style.display = 'block';
        productItem.querySelector('.product-image').src = product.ImageURL || '/images/games.jpeg';
        productItem.querySelector('.product-title').textContent = product.Title; 

       
        const viewDetailsButton = productItem.querySelector('.view-details-button');
        viewDetailsButton.onclick = () => viewProductDetails(product.ProductID); 

       
        productGrid.appendChild(productItem);
    });
}


async function viewProductDetails(productId) {

    try {

        const response = await fetch(`/api/product/${productId}`);
        const data = await response.json();
        
        const product = data.product;  
        const reviews = data.reviews; 

        
        document.querySelector('#productDetails .product-title').textContent = product.Title;
        document.querySelector('#productDetails .product-company').textContent = product.Company;

        const reviewsList = document.getElementById('productReviews');
        reviewsList.innerHTML = '';

        reviews.forEach(review => {
            const reviewElement = document.createElement('li');
            reviewElement.textContent = `${review.ReviewDescription} (Rating: ${review.Rating}/5)`;
            reviewsList.appendChild(reviewElement);
        });

        
        document.getElementById('productDetails').style.display = 'block';
    } 
    catch (error) {
        console.error('Error loading product details:', error);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname; 

    
    if (path.includes('storegames.html')) {
        fetchGames(); 
    } 
    else if (path.includes('storeconsoles.html')) {
        fetchConsoles();
    }

    
    document.querySelectorAll('#storeNav button').forEach(button => {

        button.addEventListener('click', (e) => {

            const companyName = e.target.alt ? e.target.alt.split(' ')[0] : e.target.innerText; 
            filterByCompany(companyName);

        });
    });
    const closeButton = document.querySelector('#productDetails .close-button');
    closeButton.addEventListener('click', function () {

        document.getElementById('productDetails').style.display = 'none';
    });
});


function filterByCompany(companyName) {

    const filteredProducts = storeProducts.filter(product => product.Company.toLowerCase() === companyName.toLowerCase());
    displayProducts(filteredProducts);

}


function handleError(error) {

    const errorMessage = document.createElement('p');
    errorMessage.textContent = `Oh no, there is a problem... Error: ${error.message}`;
    document.getElementById('errorContainer').appendChild(errorMessage);
}


function statusCheck(res) {
    if (!res.ok) {

        throw new Error(`Error: ${res.status}`);
    }
    
    return res;
}