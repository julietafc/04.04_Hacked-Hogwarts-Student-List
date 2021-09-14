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
  // selectedButton();
  loadJson();
}

// function selectedButton() {
//   document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", selectFilter));
// }

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

    student.firstname = getFirstName(object.fullname.trim());
    student.middlename = getMiddleName(object.fullname.trim());
    student.nickname = getNickName(object.fullname.trim());
    student.lastname = getLastName(object.fullname.trim());
    student.house = getHouse(object.house.trim());
    student.image = getImage(student.lastname, student.firstname);

    allStudents.push(student);
  });

  displayList(allStudents);
  console.table(allStudents);
}

// function selectFilter(event) {
//   const filter = event.target.value.filter;
//   console.log(`User selected ${filter}`);
//   filterList(filter);
// }

// function filterList(filterBy) {
//   let filteredList = allStudents;

//   if (filterBy === "Slytherin") {
//     filteredList = allStudents.filter(isSlytherin);
//   } else if (filterBy === "Hufflepuff") {
//     filteredList = allStudents.filter(isHufflepuff);
//   }

//   displayList(filteredList);
// }

// function isSlytherin(student) {
//   return student.house === "Slytherin";
// }

// function isHufflepuff(student) {
//   return student.house === "Hufflepuff";
// }

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
  if (student.middlename) {
    copy.querySelector(".student .middle").textContent = `${student.middlename}`;
  }
  if (student.nickname) {
    copy.querySelector(".student .nickname").textContent = `${student.nickname}`;
  }
  copy.querySelector(".student .lastname").textContent = `${student.lastname}`;
  copy.querySelector(".faces").src = `img/${student.image}.png`;
  copy.querySelector(".student").addEventListener("click", openModal);

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
}

function getImage(lastname, firstname) {
  if (lastname) {
    const lastnameLower = lastname.toLowerCase();
    const firstnameLower = firstname.toLowerCase();
    const initialFirstName = firstname.slice(0, 1).toLowerCase();
    if (lastname === "Patil") {
      const imgSrc = `${lastnameLower}_${firstnameLower}`;
      console.log(imgSrc);
      return imgSrc;
    } else if (lastname.includes("-") === true) {
      const afterHyphen = lastname.slice(lastname.indexOf("-") + 1);
      const imgSrc = `${afterHyphen}_${initialFirstName}`;
      console.log(imgSrc);
      return imgSrc;
    } else {
      const imgSrc = `${lastnameLower}_${initialFirstName}`;
      console.log(imgSrc);
      return imgSrc;
    }
  }
}

function getHouse(house) {
  const cleanData = cleanResult(house);
  return cleanData;
}

function cleanResult(name) {
  // const noSpaces = name.trim(name);
  const initial = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
  const cleanData = initial;
  return cleanData;
}

function openModal(e) {
  console.log("openModal");
  console.log(this);
  document.querySelector(".popUplWrapper").classList.remove("hidden");
  document.querySelector(".popUplWrapper").addEventListener("click", closeModal);
}

function closeModal() {
  document.querySelector(".popUplWrapper").classList.add("hidden");
}
