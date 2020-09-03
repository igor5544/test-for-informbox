'use strict';

let colorsData;
let colorTableElement = document.querySelector('.colors-table');
let rowTemplateElement = document.querySelector('.colors-row');
let resetBtnElement = colorTableElement.querySelector('.colors-table__reset');

let isStorageSupport = true;
let storageOffId;
let storageOffName;
let storageOffYear;
let storageOffColor;
let storageOffPantone;

try {
  storageOffId = sessionStorage.getItem('id');
} catch (err) {
  isStorageSupport = false;
}

try {
  storageOffName = sessionStorage.getItem('name');
} catch (err) {
  isStorageSupport = false;
}

try {
  storageOffYear = sessionStorage.getItem('year');
} catch (err) {
  isStorageSupport = false;
}

try {
  storageOffColor = sessionStorage.getItem('color');
} catch (err) {
  isStorageSupport = false;
}

try {
  storageOffPantone = sessionStorage.getItem('pantone');
} catch (err) {
  isStorageSupport = false;
}

loadData();

function hiddenUnactiveColumns() {
  if (!isStorageSupport) return;

  if (storageOffId) colorTableElement.querySelector(`#${storageOffId}`).click();
  if (storageOffName) colorTableElement.querySelector(`#${storageOffName}`).click();
  if (storageOffYear) colorTableElement.querySelector(`#${storageOffYear}`).click();
  if (storageOffColor) colorTableElement.querySelector(`#${storageOffColor}`).click();
  if (storageOffPantone) colorTableElement.querySelector(`#${storageOffPantone}`).click();
}

function loadData() {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.open('GET', 'https://reqres.in/api/unknown?per_page=12');

  xhr.addEventListener('load', function () {
    if (xhr.status == 200) {
      fillTable(xhr.response.data);
      setTimeout(() => {
        hiddenUnactiveColumns();
      }, 0);
    } else {
      console.log('Произошла ошибка при загрузке: ', xhr.readyState);
    }
  });

  xhr.send();
}

function fillTable(data) {
  data.forEach(row => addRow(row));

  upFirstLetter();
  createFilterBtns();
}

function addRow(data) {
  let newRowElement = rowTemplateElement.content.cloneNode(true);
  let newRowCellsElements = Array.prototype.slice.call(newRowElement.querySelectorAll('td'));
  let i = 0;

  for (let cell in data) {
    newRowCellsElements[i].textContent = data[cell];
    i++;
  }

  addColorBox(newRowElement);

  colorTableElement.append(newRowElement);
}

function addColorBox(row) {
  let colorBoxCellElement = row.querySelector('.colors-table__cell--color');

  let colorBoxElement = document.createElement('div');
  colorBoxElement.classList.add('colors-table__color-box');
  colorBoxElement.style.backgroundColor = colorBoxCellElement.textContent;

  colorBoxCellElement.prepend(colorBoxElement);
}

function upFirstLetter() {
  let namesCellsElements = Array.prototype.slice.call(colorTableElement.querySelectorAll('.colors-table__cell--name'));

  namesCellsElements.forEach(nameCell => {
    nameCell.textContent = nameCell.textContent[0].toUpperCase() + nameCell.textContent.slice(1);
  });
}

function createFilterBtns() {
  let checkboxesElements = Array.prototype.slice.call(colorTableElement.querySelectorAll('.colors-table__check input'));

  checkboxesElements.forEach((btn, i) => {
    btn.onclick = function () {
      this.removeAttribute('cheked');

      removeColumn(i);

      if (isStorageSupport) {
        sessionStorage.setItem(this.id, this.id);
      }

      Array.prototype.slice.call(colorTableElement.querySelectorAll('.colors-table__check'))[i].remove();
      createFilterBtns();

      if (!resetBtnElement.classList.contains('colors-table__reset--active')) activeResetBtn();
    };
  });
}

function removeColumn(i) {
  let contentRowsElements = Array.prototype.slice.call(colorTableElement.querySelectorAll('.colors-table__row'));

  contentRowsElements.forEach(row => {
    Array.prototype.slice.call(row.querySelectorAll('td'))[i].remove();
  });
}

function activeResetBtn() {
  resetBtnElement.classList.add('colors-table__reset--active');

  resetBtnElement.addEventListener('click', removeSettings);
}

function removeSettings() {
  let checkboxesElements = Array.prototype.slice.call(colorTableElement.querySelectorAll('.colors-table__check input'));

  checkboxesElements.forEach(btn => {
    if (!btn.hasAttribute('checked')) btn.setAttribute('checked');
  });

  removeSessionSettings();

  location.reload();
}

function removeSessionSettings() {
  if (!isStorageSupport) return;

  if (sessionStorage.getItem('id')) sessionStorage.removeItem('id');
  if (sessionStorage.getItem('name')) sessionStorage.removeItem('name');
  if (sessionStorage.getItem('year')) sessionStorage.removeItem('year');
  if (sessionStorage.getItem('color')) sessionStorage.removeItem('color');
  if (sessionStorage.getItem('pantone')) sessionStorage.removeItem('pantone');
}
