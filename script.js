"use strict";

window.addEventListener("load", start);

// set array for objects
let allStudents = [];

// objects template
const Student = {
  firstname: "",
  midlename: "",
  nickname: "",
  lastname: "",
  image: "",
  house: "",
};

function start() {
  console.log("start");
  selectedButton();
  loadJson();
}
