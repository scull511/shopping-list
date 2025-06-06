const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function addItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  // validate input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    // not actually editing, instead removing old, them adding new
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkForDuplicates(newItem)) {
      alert('That item is already on the list');
      return;
    }
  }

  // create item DOM element
  addItemToDOM(newItem);

  // add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  const text = document.createTextNode(item);
  li.appendChild(text);

  const button = createButton('remove-item btn-link text-red');

  li.appendChild(button);

  itemList.appendChild(li);
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

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // pushing the new item into the array...
  itemsFromStorage.push(item);

  // converting array to string and setting to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    // parsing the string back into an array...
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkForDuplicates(item) {
  const itemsFromStorage = getItemsFromStorage();

  // if (itemsFromStorage.includes(item)) {
  //   return true;
  // } else {
  //   return false;
  // }

  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

// When clicking on the x icon ...
function removeItem(item) {
  if (confirm('Are you sure?')) {
    // remove item from DOM
    item.remove();

    // remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // filter returns a new array without the removed item
  itemsFromStorage = itemsFromStorage.filter((i) => i != item);

  // re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // clear from localStorage
  // clear() would remove ALL localStorage
  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    // the indexOf() method returns the position of the first occurrence of a value in a string, if there is no match then -1 is returned
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// initialize app
function init() {
  // event listeners
  itemForm.addEventListener('submit', addItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
