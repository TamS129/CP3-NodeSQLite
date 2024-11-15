/*
  Name: Tamara Slone
  Date: November 09,2024
  This is the javascript frontend functionality that pulls the list from my api to the store page. 
*/


async function fetchStores(){
    fetch('/stores', { method: 'POST' })
        .then(statusCheck)
        .then(res => res.json())
        .then(data => {
            console.log(data); 
            storeProducts = data.stores;
            displayStores(storeProducts)
        })
        .catch(handleError);
}


function formatPhoneNumber(phoneNumber) {
    
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber; 
}

function displayStores(stores) {
    const storeListDiv = document.getElementById('store-list');
    const storeTemplate = document.getElementById('store-template'); 

    storeListDiv.innerHTML = ''; 

    if (stores.length === 0) {
        storeListDiv.innerHTML = '<p>No stores available.</p>';
        return;
    }

    stores.forEach((store, index) => {
        const storeElement = storeTemplate.content.cloneNode(true); 

        storeElement.querySelector('.store-location').textContent = `Store Location ${index + 1}`;
        storeElement.querySelector('.store-address').textContent = `Address: ${store.Address}`;
        storeElement.querySelector('.store-phone').textContent = `Phone: ${formatPhoneNumber(store.PhoneNumber)}`;

        storeListDiv.appendChild(storeElement); 
    });
}


function statusCheck(res){
    if(!res.ok){
        throw new Error(`Error: ${res.status}`);
    }
    return res;
}

function handleError(error){
    const errorMessage = document.createElement('p');
    errorMessage.textContent = `Oh no there is a problem... Error: ${error.message}`;
    document.getElementById('errorContainer').appendChild(errorMessage);
}


document.addEventListener('DOMContentLoaded', fetchStores);