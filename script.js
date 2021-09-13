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

function selectedButton() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
}

function loadJson() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((res) => res.json())
    .then((data) => {
      prepareObjects(data);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((object) => {
    // console.log("student", object);
    const student = Object.create(Student);
    student.house = getHouse(object.house);
    student.firstname = getFirstName(object.fullname);
    student.middlename = getMiddleName(object.fullname);
    student.nickname = getNickName(object.fullname);
    student.lastname = getLastName(object.fullname);
    student.image = getImage(object.lastname, object.firstname);

    allStudents.push(student);
  });

  displayList(allStudents);
}
