"use strict";

window.addEventListener("load", start);

let familyBlood;
let popUp = document.querySelector(".popUpWrapper");
const dropdown = document.querySelector("select");
const characterList = document.getElementById("studentList");

// settings objects for global variables
const settings = {
  filter: "all",
  filterCat: "",
  sortBy: "name",
  sortDir: "asc",
  category: "",
  expelledList: false,
};

// set array for objects
let allStudents = [];

let filteredList = [];

let expelledStudents = [];

// objects template
const Student = {
  firstname: "",
  midlename: "",
  nickname: "",
  lastname: "",
  image: "",
  house: "",
  blood: "",
  inquisitor: false,
  expelled: false,
  prefect: false,
};

function start() {
  // console.log("start");

  selectedButton();
  loadJson();
  searchBar();
}

function selectedButton() {
  document.querySelectorAll(".filter select").forEach((select) => {
    select.addEventListener("change", selectFilter);
  });
  document.querySelectorAll(".sortBy select").forEach((select) => {
    select.addEventListener("change", selectSort);
  });

  /* ---------- CLOSURE FUNCTION FOR SEARCH BAR ---------- */
  document.getElementById("searchBar").addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    const searchedStudents = allStudents.filter((student) => {
      return student.firstname.toLowerCase().includes(searchString) || student.lastname.toLowerCase().includes(searchString) || student.house.toLowerCase().includes(searchString);
    });
    displayList(searchedStudents);
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
      fetchStudents();
    });

  // fetching students info
  function fetchStudents() {
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        prepareObjects(data);
      });
  }
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

/* ---------- PREPARING & CLEANING DATA ---------- */

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
  let blood;
  if (familyBlood.half.includes(lastname)) {
    blood = "Halfblood";
  }
  if (familyBlood.pure.includes(lastname)) {
    blood = "Pureblood";
  }
  if (lastname) {
    blood = "Muggleblood";
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

/* ---------- FILTERING & SORTING ---------- */

function selectFilter(event) {
  // const filter = document.querySelector(`#${event.target.id}`).value
  //   setFilter(filter);

  // if (event.target.value == "All") {
  //   setFilter(filter);
  //   //     displayList(filteredList);
  //   //   }
  // } else {
  //   filteredList = allStudents.filter((student) => student.house === dropdown.value);
  //   displayList(filteredList);
  // }
  const filter = document.querySelector(`#${event.target.id}`).value;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filter = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;

  // houses filter
  if (settings.filter === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filter === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filter === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filter === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  }

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
  console.log(`User selected ${sortBy}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allStudents;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = allStudents.sort(sortByProperty);

  // closure function to make it work in every situation
  function sortByProperty(studentA, studentB) {
    console.log(`sortby is ${settings.sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1;
    } else {
      return 1;
    }
  }
  return sortedList;
}

/* ---------- DISPLAY LIST ---------- */

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
  let condition;
  // console.log(student);

  // grab template
  const template = document.querySelector("template#studentCard").content;

  // clone it
  const copy = template.cloneNode(true);

  // change content

  if (settings.expelledList) {
    condition = student.expelled;
  } else {
    condition = !student.expelled;
  }

  //style
  copy.querySelector(".student").style.backgroundColor = `var(--${student.house}-main-color)`;

  // first name
  copy.querySelector(".student .fullname").textContent = `${student.firstname}`;

  // middlename
  if (student.middlename) {
    copy.querySelector(".student .middle").textContent = `${student.middlename}`;
  }

  // nickname
  if (student.nickname) {
    copy.querySelector(".student .nickname").textContent = `${student.nickname}`;
  }

  // lastname
  copy.querySelector(".student .lastname").textContent = `${student.lastname}`;

  // image
  copy.querySelector(".faces").src = `img/${student.image}.png`;

  // house
  copy.querySelector(".house-crest > img").src = `img/${student.house}.png`;

  // add eventlisteners
  copy.querySelector(".student").addEventListener("click", settingModal);

  function settingModal(event) {
    openModal(student);
  }

  //grab parent
  const parent = document.querySelector("#studentList");

  //append
  parent.appendChild(copy);

  /* ------------- FUNCTION CLOSURE FOR POP UP ------------- */
}

/* ---------- POP UP  ---------- */

function openModal(student) {
  // display pop up
  popUp.classList.remove("hidden");

  // change content

  //style
  popUp.querySelector(".infoPopUp").style.backgroundColor = `var(--${student.house}-main-color)`;
  popUp.querySelector(".infoPopUp").style.border = `13px solid var(--${student.house}-border-color)`;
  // image
  popUp.querySelector(".facesPopUp").src = `img/${student.image}.png`;

  // full name
  popUp.querySelector("h2").textContent = `${student.firstname} ${student.lastname}`;

  // blood status
  popUp.querySelector(".blood-status").textContent = `${student.blood}`;

  // house crest
  if (student.house === "Gryffindor") {
    popUp.querySelector(".crestPopUp > img").src = `img/${student.house}.png`;
    popUp.querySelector(".infoPopUp").classList.add("Gryffindor");
  }
  if (student.house === "Slytherin") {
    popUp.querySelector(".crestPopUp > img").src = "img/Slytherin.png";
    popUp.querySelector(".infoPopUp").classList.add("Slytherin");
  }
  if (student.house === "Ravenclaw") {
    popUp.querySelector(".crestPopUp > img").src = "img/Ravenclaw.png";
    popUp.querySelector(".infoPopUp").classList.add("Ravenclaw");
  }
  if (student.house === "Hufflepuff") {
    popUp.querySelector(".crestPopUp > img").src = "img/Hufflepuff.png";
    popUp.querySelector(".infoPopUp").classList.add("Hufflepuff");
  }

  // inquisitorial squad
  // if (student.inquisitorial === true) {
  //   popUp.querySelector(".inquisitor").textContent = "🌟";
  // } else {
  //   popUp.querySelector(".inquisitor").textContent = "☆";
  // }

  popUp.querySelector("#inquisitor").addEventListener("click", clickInquisitor);
  popUp.querySelector("#expelledBtn").addEventListener("click", clickExpelled);
  popUp.querySelector("#prefectBtn").addEventListener("click", clickPrefect);

  function clickInquisitor() {
    console.log("clickInquisitor");
    if (student.inquisitor === true) {
      student.inquisitor = false;
    } else {
      student.inquisitor = false;
    }
  }

  function clickPrefect() {
    console.log("clickPrefect");
    let btn = document.getElementById("prefectBtn");

    if (btn.innerText === "Make Prefect") {
      btn.innerText = "Revoke Prefect";
    } else {
      btn.innerText = "Revoke Prefect";
    }
  }

  function clickExpelled() {
    console.log("clickExpelled");
  }

  popUp.querySelector("#close").addEventListener("click", function () {
    popUp.classList.add("hidden");
  });
  buildList();
}

/* ---------- HACKING FUNCTION ---------- */

// function hackTheSystem() {
//   function createMe() {
//     return {
//       firstname: "Julieta",
//       lastname: "Fernandez",
//       middlename: "Laura",
//       nickName: "Juli",
//       house: "Hufflepuff",
//       prefect: false,
//       inquisitor: false,
//       expelled: false,
//       blood: "Halfblood",
//     };
//   }

//   function addMeToList() {
//     let meAsStudent = createMe();
//     filteredList.push(meAsStudent);
//   }

//   function randomizeBloodStatus(meAsStudent) {
//     if (meAsStudent.bloodStatus === "Halfblood" || meAsStudent.bloodStatus === "Muggleblood") {
//       meAsStudent.bloodStatus = "Pureblood";
//     } else {
//       let bloodArray = ["Pureblood", "Halfblood", "Muggleblood"];
//       let randomBlood = Math.floor(Math.random() * Math.floor(3));

//       meAsStudent.bloodStatus = bloodArray[randomBlood];
//     }

//     return meAsStudent;
//   }
// }
