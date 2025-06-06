const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  // getting an array of items stored in localStorage...
  const itemsFromStorage = getItemsFromStorage();
  // adding each item in the array to the DOM
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI(); // checks and resets
}

function addItemSubmit(e) {
  e.preventDefault(); // prevents the form being submitted

  const newItem = itemInput.value;
  // validate input, checking there is a value
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // check if edit mode is set to true
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    // not actually editing, instead removing old item and adding new
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

  checkUI(); // checks and resets

  itemInput.value = '';
}

function addItemToDOM(item) {
  // for each item in the array in localStorage...
  // a list item is created and added to the DOM
  const li = document.createElement('li');
  const text = document.createTextNode(item);
  li.appendChild(text);

  const button = createButton('remove-item btn-link text-red');

  li.appendChild(button);

  itemList.appendChild(li);
}

// functions to create buttons...
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}
// ...and the icons within the buttons
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

// this function is called when the item list is clicked - using event delegation, the function either calls another function to remove an item, or to edit an item
function onClickItem(e) {
  // if the delete icon (an i element) is clicked...
  // the parent of the i element is the button element, the button has the class of 'remove-item'
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    // clicking anything in the list item that is not the i element, calls the function to edit an item
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

// edit function - sets edit mode to true, changes some button styling and text, then edits the text of the item
function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    // remove edit-mode class for all other items
    .forEach((i) => i.classList.remove('edit-mode'));
  // but add edit-mode class to selected item
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228B22';
  // update the text
  itemInput.value = item.textContent;
}

// when clicking on the x icon ...
function removeItem(item) {
  if (confirm('Are you sure?')) {
    // remove item from DOM
    item.remove();

    // remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI(); // checks and resets
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

  checkUI(); // checks and resets
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

// a series of checks and resets to perform after certain events
function checkUI() {
  // clear the input box of the previous input
  itemInput.value = '';
  // check how many items there are and edit the UI based on that
  const items = itemList.querySelectorAll('li');
  // if there are no items, you don't need the clear button or filter
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
