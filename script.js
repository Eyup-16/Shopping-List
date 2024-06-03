const itemform = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemlist = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = document.querySelector('button');
let isEditMode = false;
// // // My work // // //

// // Add item function

// function addItem(e) {
//   e.preventDefault();
//   const newItem = itemInput.value;

//   if (newItem === '') {
//     alert('Please fill in at least one field');
//     return;
//   }

//   // create list item
//   const li = document.createElement('li');
//   li.appendChild(document.createTextNode(newItem));

//   // create button
//   const button = document.createElement('button');
//   button.className = 'remove-item btn-link text-red';
//   li.appendChild(button);

//   //create icon
//   const icon = document.createElement('i');
//   icon.className = 'fa-solid fa-xmark';
//   button.appendChild(icon);

//   itemlist.appendChild(li);

//   console.log(li);
// }

// // // Brad work // // // :

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value.toLowerCase();

  if (newItem === '') {
    alert('Please fill in at least one field');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemlist.querySelector('.edit-mode');
    deleteFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (CheckIfItemExists(newItem)) {
      alert('This item already exist!');
      return;
    }
  }
  // create item DOM element
  localStorageAdd(newItem);

  // Add item to local storage
  AddtoLocalStorage(newItem);
}

// Local Storage

function localStorageAdd(item) {
  // create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemlist.appendChild(li);
  checkUI();
}

function AddtoLocalStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  // add item into an array
  itemsFromStorage.push(item);
  // convert to JSON String & set to localstrage

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => localStorageAdd(item));
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function OnclickRemove(event) {
  if (event.target.parentElement.classList.contains('remove-item')) {
    removeButton(event.target.parentElement.parentElement);
  } else {
    setItemtoEdit(event.target);
  }
}

function CheckIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemtoEdit(item) {
  isEditMode = true;
  itemlist.querySelectorAll('li').forEach((i) => {
    i.classList.remove('edit-mode');
  });
  item.classList.add('edit-mode');
  formBtn.innerHTML = `<i class = 'fa-solid fa-pen'></i> Update Item`;
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

// Remove and Clear items

function removeButton(item) {
  if (confirm('Are You Sure?')) {
    // Remove from the DOM
    item.remove();

    // Remove from the Local Storage
    deleteFromLocalStorage(item.innerText);
    checkUI();
  }
}

function deleteFromLocalStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out the item to be deleted
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Update local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemlist.firstChild) {
    itemlist.removeChild(itemlist.firstChild);
  }
  // clear from local storage

  localStorage.removeItem('items');

  checkUI();
}

function checkUI() {
  itemform.value = '';
  const items = itemlist.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = `<i class='fa-solid fa-plus'></i>  Add Item`;
  formBtn.style.backgroundColor = '#333';
}

// Filter Items

function filterUI(event) {
  const text = event.target.value.toLowerCase(); // my input inside the filter.
  const items = itemlist.querySelectorAll('li');
  items.forEach((item) => {
    // Method 1 (brad) //
    // const itemName = item.firstChild.textContent.toLowerCase();
    // // firstchild is the name of the item (li) cuz under the name is 'button' and 'i' and all those are children.
    // if (itemName.indexOf(text) != -1) {
    //   item.style.display = 'flex';
    // } else {
    //   item.style.display = 'none';
    // }

    // method 2 (StackOverflow) [with some modification]
    item.style.display = 'flex';

    if (!item.innerText.toLowerCase().includes(text)) {
      item.style.display = 'none';
    }
  });
  // console.log(text);
}

// // local
// localStorage.setItem('name', 'Luke');
// console.log(localStorage.getItem('name'));
// // localStorage.removeItem('name');
// localStorage.clear();

// initialize app
function initEvents() {
  // Event Listener
  itemform.addEventListener('submit', addItem);
  itemlist.addEventListener('click', OnclickRemove);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterUI);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}
initEvents();
