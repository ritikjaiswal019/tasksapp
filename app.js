months =["January","February","March","April","May","June","July","August","September","October","November","December"];

// ****** select items **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
const addDescBtn =document.querySelector(".add-des-btn");
const descCont = document.querySelector(".description-container");
const descBox = document.querySelector(".description-box");
// const descPara = document.querySelector(".description-para");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const today = new Date();
  const id = today.getTime().toString();
  const date = today.getDate();
  const month = today.getMonth();
  // const descText = descPara.value;

  if (value !== "" && !editFlag) {
    const parentOfElement = document.createElement("div");
    const element2 = document.createElement("article");
    element2.classList.add("grocery-item");
    element2.classList.add("hide");
    element2.classList.add("description-para");
    const description = document.querySelector(".description-box").value;
    element2.innerHTML = `<p class="title">${description}</p>`;
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    let doc = document.createAttribute("data-doc");
    doc.value = date;
    let moc = document.createAttribute("data-moc");
    moc.value = month
    element.setAttributeNode(attr);
    element.setAttributeNode(doc);
    element.setAttributeNode(moc);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="toggle-des-btn tooltip">
                <i class="fas fa-chevron-down des-btn down"></i>
                <i class="fas fa-chevron-up up hide"></i>
                <span class="tooltiptext">Show Description</span>
              </button>
              <button type="button" class="edit-btn tooltip">
                <i class="fas fa-edit"></i>
                <span class="tooltiptext">Edit Task</span>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn tooltip">
                <i class="fas fa-check"></i>
                <span class="tooltiptext">Mark as done</span>
              </button>
            </div>
          `;
          // console.log(doc,moc);

          element.addEventListener("mouseover",function(){
            alert.textContent=`Created on : ${date} ${months[month]}`;
          })
          element.addEventListener("mouseout",function(){
            alert.textContent=""; 
          })
    const toggleDesc = element.querySelector(".toggle-des-btn");
    toggleDesc.addEventListener("click",toggleDes);      
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    parentOfElement.appendChild(element);
    parentOfElement.appendChild(element2);
    // append child
    // list.appendChild(element);
    list.appendChild(parentOfElement);
    // list.appendChild(element);
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage

    addToLocalStorage(id, value, date, month, description);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// toggle Description
function toggleDes(e){
  const element = e.currentTarget;
  element.parentElement.parentElement.nextElementSibling.classList.toggle("hide");
  const hidden = element.querySelector(".hide");
  if(hidden.classList.contains("up")){
    hidden.classList.remove("hide");
    element.querySelector(".down").classList.add("hide");
  }
  else{
    hidden.classList.remove("hide");
    element.querySelector(".up").classList.add("hide");
  }
}


// delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
}
// set backt to defaults
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
  toggleDescBox();
  console.log(descBox.value);
  descBox.value = "";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value, date, month, description) {
  const grocery = { id, value ,doc:date,moc:month , desc:description};
  let items = getLocalStorage();
  // console.log(grocery);
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value,item.doc,item.moc,item.desc);
    });
    container.classList.add("show-container");
  }
}

function toggleDescBox(){
  descCont.classList.toggle("hide");
  // console.log(addDescBtn.children);
  const geticon = addDescBtn.getElementsByTagName("i")[0];
  geticon.classList.toggle("fa-times-circle");
  const tooltip = addDescBtn.querySelector(".tooltiptext");
  if(tooltip.textContent==="Add Description"){
    tooltip.textContent = "Remove Description";
  }
  else{
    tooltip.textContent = "Add Description";
  }
  // if(s==="close"){
  //   tooltip.textContent = "Remove Description";
  // }
  // else{
  //   tooltip.textContent = "Add Description";
  // }
}

function createListItem(id, value, date,month, description) {
  const parentOfElement = document.createElement("div");
  const element2 = document.createElement("article");
  element2.classList.add("grocery-item");
  element2.classList.add("hide");
  element2.classList.add("description-para");
  element2.innerHTML = `<p class="title">${description}</p>`;
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="toggle-des-btn tooltip">
                <i class="fas fa-chevron-down des-btn down"></i>
                <i class="fas fa-chevron-up up hide"></i>
                <span class="tooltiptext">Show Description</span>
              </button>
              <button type="button" class="edit-btn tooltip">
                <i class="fas fa-edit"></i>
                <span class="tooltiptext">Edit Task</span>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn tooltip">
                <i class="fas fa-check"></i>
                <span class="tooltiptext">Mark as done</span>
              </button>
            </div>
            
          `;
  
  element.addEventListener("mouseover",function(){
    alert.textContent=`Created on : ${date} ${months[month]}`;
  })
  element.addEventListener("mouseout",function(){
    alert.textContent=""; 
  })
  // add event listeners to both buttons;
  // element.addEventListener("mouseover",function(e){
  //   alert.textContent=`Created on ${e.currentTarget.dataset.id}`
  // })
  // element.addEventListener("mouseout",function(){
  //   alert.textContent="";
  // })
  const toggleDesc = element.querySelector(".toggle-des-btn");
  toggleDesc.addEventListener("click",toggleDes);
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  parentOfElement.appendChild(element);
  parentOfElement.appendChild(element2);
  // append child
  // list.appendChild(element);
  list.appendChild(parentOfElement);
}



addDescBtn.addEventListener("click",function(){
  toggleDescBox();
})


