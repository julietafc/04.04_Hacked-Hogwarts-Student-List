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
  loadJson();
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
    student.firstname = getFirstName(object.fullname);
    student.middlename = getMiddleName(object.fullname);
    student.nickname = getNickName(object.fullname);
    student.lastname = getLastName(object.fullname);
    student.image = getImage(student.lastName, student.firstName);
    // student.house = getHouse(object.house);

    allStudents.push(student);
  });

  displayList(allStudents);
}

function displayList(students) {
  document.querySelector("#studentList").innerHTML = "";
  students.forEach(displayStudent);
}

function displayStudent(student) {
  console.log(student);
  //grab template
  const template = document.querySelector("template#studentCard").content;
  //clone it
  const copy = template.cloneNode(true);
  //change content
  copy.querySelector(".student .fullname").textContent = `${student.firstname}`;
  copy.querySelector(".student .middle").textContent = `${student.middlename}`;
  copy.querySelector(".student .nickname").textContent = `${student.nickname}`;
  copy.querySelector(".student .lastname").textContent = `${student.lastname}`;
  copy.querySelector(".faces img").src = `img/${student.image}.png`;

  //grab parent
  const parent = document.querySelector("#studentList");
  //append
  parent.appendChild(copy);
}

function getFirstName(fullname) {
  if (fullname.includes(" ") === true) {
    const firstName = fullname.slice(0, fullname.indexOf(" "));
    const cleanData = cleanResult(firstName);
    return cleanData;
  } else {
    const cleanData = cleanResult(fullname);
    return cleanData;
  }
}

function getMiddleName(fullname) {
  if (fullname.includes(" ") === true) {
    const middleName = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
    const firstCharacter = middleName.slice(0, 1);

    if (firstCharacter !== '"') {
      const cleanData = cleanResult(middleName);
      return cleanData;
    }
  }

  // need to clean "" in middle name
}

function getNickName(fullname) {
  const nickname = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
  const initial = nickname.slice(0, 1);
  if (initial === '"') {
    length = nickname.length;
    const noQuotes = nickname.slice(1, length - 1);
    const cleanData = cleanResult(noQuotes);
    return cleanData;
  }
}

function getLastName(fullname) {
  if (fullname.includes(" ") === true) {
    const lastName = fullname.slice(fullname.lastIndexOf(" ") + 1);
    const cleanData = cleanResult(lastName);
    return cleanData;
  }
  return undefined;
}

function getImage(lastname, firstname) {
  if (lastname !== undefined) {
    const lastnameLower = lastname.toLowerCase();
    const firstnameLower = firstname.toLowerCase();
    const initialFirstName = firstname.slice(0, 1).toLowerCase();
    if (lastname === "Patil") {
      const imgSrc = `${lastnameLower}_${firstnameLower}.png`;
      return imgSrc;
    } else if (lastname.includes("-") === true) {
      const afterHyphen = lastname.slice(lastname.indexOf("-") + 1);
      const imgSrc = `${afterHyphen}_${initialFirstName}.png`;
      return imgSrc;
    } else {
      const imgSrc = `${lastnameLower}_${initialFirstName}.png`;
      return imgSrc;
    }
  }
}

function cleanResult(name) {
  const noSpaces = name.trim(name);
  const initial = noSpaces.substring(0, 1).toUpperCase() + noSpaces.substring(1).toLowerCase();
  const cleanData = initial;
  return cleanData;
}
