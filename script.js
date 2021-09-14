"use strict";

window.addEventListener("load", start);

// settings objects for global variables
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};

// set array for objects
let allStudents = [];

let familyBlood;
// objects template
const Student = {
  firstname: "",
  midlename: "",
  nickname: "",
  lastname: "",
  image: "",
  house: "",
  blood: "",
};

function start() {
  console.log("start");
  selectedButton();
  loadJson();
}

function selectedButton() {
  document.querySelectorAll(".filter select").forEach((select) => {
    select.addEventListener("change", selectFilter);
  });
  document.querySelectorAll(".sortBy select").forEach((select) => {
    select.addEventListener("change", selectSort);
  });
}

function loadJson() {
  // fetch blood info from students
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      familyBlood = data;
    });

  // fetch personal info from students
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
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
    student.blood = getBloodType(student.lastname);
    student.image = getImage(student.lastname, student.firstname);

    allStudents.push(student);
  });

  displayList(allStudents);
  console.table(allStudents);
}

function selectFilter(event) {
  const filterBy = event.target.value;
  console.log(`User selected ${filterBy}`);
  setFilter(filterBy);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;

  // houses filter
  if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  }

  // blood filter
  // if (filterBy === "pure") {
  //   filteredList = allStudents.filter(isPure);
  // } else if (filterBy === "half") {
  //   filteredList = allStudents.filter(isHalf);
  // } else if (filterBy === "plain") {
  //   filteredList = allStudents.filter(isPlain);
  // }

  return filteredList;
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function selectSort(event) {
  const sortBy = event.target.value;
  const sortDir = event.target.sortDirection; // not sure if it should be like this when using option

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = allStudents.sort(sortByFirstName);

  // closure function to make it work in every situation
  function sortByFirstName(studentA, studentB) {
    console.log(`sortby is ${settings.sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1;
    } else {
      return 1;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList();
  const sortedList = sortList(currentList);

  displayList(sortedList);
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
  if (nickname) {
    if (initial === '"') {
      length = nickname.length;
      const noQuotes = nickname.slice(1, length - 1);
      const cleanData = cleanResult(noQuotes);
      return cleanData;
    }
  }
}

function getLastName(fullname) {
  if (fullname) {
    if (fullname.includes(" ") === true) {
      const lastName = fullname.slice(fullname.lastIndexOf(" ") + 1);
      const cleanData = cleanResult(lastName);
      return cleanData;
    }
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

function getBloodType(student, lastname) {
  let blood;
  if (lastname) {
    if (familyBlood.half.includes(student.lastname)) {
      student.blood = "Halfblood";
    } else if (familyBlood.pure.includes(student.lastname)) {
      student.blood = "Pureblood";
    } else {
      student.blood = "Muggleblood";
    }
  }
  return blood;
}

function getHouse(house) {
  const cleanData = cleanResult(house);
  return cleanData;
}

function cleanResult(name) {
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
