"use strict";

window.addEventListener("load", start);

let familyBlood;
let popUp = document.querySelector(".popUpWrapper");

// settings objects for global variables
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};

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
  blood: "",
};

function start() {
  // console.log("start");

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
  // fetching families info
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      familyBlood = data;
    });

  // fetching students info
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      prepareObjects(data);
    });
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);

  buildList();
}

function prepareObjects(jsonObject) {
  jsonObject.forEach((object) => {
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
  console.log(event.target);
  const filter = event.target.value;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;

  // houses filter
  if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Gryffindor") {
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

  // // find "old" sortby element and remove sortby
  // const oldElement = document.querySelector(`[data-sort = '${settings.sortBy}']`);
  // oldElement.classList.remove("sortby");

  // //indicate active sort
  // event.target.classList.add("sortby");

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
  const currentList = filterList(allStudents);
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
  let lastName;
  if (fullname) {
    if (fullname.includes(" ")) {
      lastName = fullname.slice(fullname.lastIndexOf(" ") + 1);
      const cleanData = cleanResult(lastName);
      return cleanData;
    } else {
      lastName = "";
      return lastName;
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

function getBloodType(lastname) {
  // let blood;
  // if (familyBlood.half.includes(lastname)) {
  //   blood = "Halfblood";
  // }
  // if (familyBlood.pure.includes(lastname)) {
  //   blood = "Pureblood";
  // }
  // if (lastname) {
  //   blood = "Muggleblood";
  // }
  // return blood;
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

function openModal(student) {
  popUp.classList.remove("hidden");

  popUp.querySelector(".facesPopUp").src = `img/${student.image}.png`;
  popUp.querySelector("h2").textContent = `${student.firstname} ${student.lastname}`;

  if (student.house === "Gryffindor") {
    popUp.querySelector(".crestPopUp > img").src = "img/Gryffindor.png";
    popUp.querySelector(".infoPopUp").classList.add("Gryffindor");
  } else if (student.house === "Slytherin") {
    popUp.querySelector(".crestPopUp > img").src = "img/Slytherin.png";
    popUp.querySelector(".infoPopUp").classList.add("Slytherin");
  } else if (student.house === "Ravenclaw") {
    popUp.querySelector(".crestPopUp > img").src = "img/Ravenclaw.png";
    popUp.querySelector(".infoPopUp").classList.add("Ravenclaw");
  } else if (student.house === "Hufflepuff") {
    popUp.querySelector(".crestPopUp > img").src = "img/Hufflepuff.png";
    popUp.querySelector(".infoPopUp").classList.add("Hufflepuff");
  }
  popUp.querySelector("#close").addEventListener("click", function () {
    popUp.classList.add("hidden");
  });
}

// function closeModal() {
//   document.querySelector(".popUpWrapper").classList.add("hidden");
// }
