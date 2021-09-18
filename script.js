"use strict";

window.addEventListener("load", start);

let familyBlood;
let popUp = document.querySelector(".popUpWrapper");

// settings objects for global variables
const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

// set array for objects
let allStudents = [];

let filteredList = [];

let expelledList = [];

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
}

function selectedButton() {
  document.querySelectorAll("#filters select").forEach((option) => option.addEventListener("change", selectFilter));

  document.querySelectorAll("#sorting select").forEach((option) => option.addEventListener("change", selectSort));

  document.querySelector("#searchBar").addEventListener("input", searchBar);
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
  // buildList();
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

  if (lastname) {
    blood = "Muggleblood";

    if (familyBlood.pure.includes(lastname)) {
      blood = "Pureblood";
    }

    if (familyBlood.half.includes(lastname)) {
      blood = "Halfblood";
    }
  } else {
    blood = undefined;
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

/* ---------- SEARCH BAR ---------- */

function searchBar(e) {
  const searchString = e.target.value.toLowerCase();
  const searchedStudents = allStudents.filter((student) => {
    return student.firstname.toLowerCase().includes(searchString) || student.lastname.toLowerCase().includes(searchString) || student.house.toLowerCase().includes(searchString);
  });
  displayList(searchedStudents);
}

/* ---------- FILTERING & SORTING ---------- */

function selectFilter(event) {
  const filter = event.target.value;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filter = filter;
  buildList();
}

function filterList(filteredList) {
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

  // blood filter
  if (settings.filter === "Pureblood") {
    filteredList = allStudents.filter(isPure);
  } else if (settings.filter === "Halfblood") {
    filteredList = allStudents.filter(isHalf);
  } else if (settings.filter === "Muggleblood") {
    filteredList = allStudents.filter(isPlain);
  }

  // // responsabilities filter
  if (settings.filter === "inquisitor") {
    filteredList = allStudents.filter(isInquisitor);
  } else if (settings.filter === "prefect") {
    filteredList = allStudents.filter(isPrefect);
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

function isPure(student) {
  return student.blood === "Pureblood";
}

function isHalf(student) {
  return student.blood === "Halfblood";
}

function isPlain(student) {
  return student.blood === "Muggleblood";
}

function isInquisitor(student) {
  return student.inquisitor === true;
}

function isPrefect(student) {
  return student.prefect === true;
}

function selectSort(event) {
  const sortBy = event.target.value;
  const sortDir = event.target.dataset.sortDirection;

  // // find "old" sortby element, and remove .sortBy
  // const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  // oldElement.classList.remove("sortby");

  // // indicate active sort
  // event.target.classList.add("sortby");

  // toggle the direction!
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
  // let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

/* ---------- DISPLAY LIST & NUMBERS DISPLAY---------- */

function numGryffindors(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}
function numHufflepuffs(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}
function numRavenclaws(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function numSlytherins(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function setInfoLine() {
  const totalStudents = allStudents.length;
  //edit when I start expelling students so it updates
  const expelledStudents = 0;
  const enrolledStudents = totalStudents - expelledStudents;

  document.querySelector(".enrolledNum").textContent = enrolledStudents;
  document.querySelector(".expelledNum").textContent = expelledStudents;
  document.querySelector(".gryfNum").textContent = allStudents.filter(numGryffindors).length;
  document.querySelector(".huffNum").textContent = allStudents.filter(numHufflepuffs).length;
  document.querySelector(".raveNum").textContent = allStudents.filter(numRavenclaws).length;
  document.querySelector(".slytNum").textContent = allStudents.filter(numSlytherins).length;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(students) {
  document.querySelector("#studentList").innerHTML = "";
  students.forEach(displayStudent);
  //displaying the current student nums
  setInfoLine();
  //displaying the list length
  document.querySelector(".displayNumbers span").textContent = students.length;
}

function displayStudent(student) {
  // console.log(student);

  // grab template
  const template = document.querySelector("template#studentCard").content;

  // clone it
  const copy = template.cloneNode(true);

  // change content

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
  if (student.image === undefined) {
    copy.querySelector(".faces").classList.add("nofaces");
  } else {
    copy.querySelector(".faces").src = `img/${student.image}.png`;
  }

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

/* ---------- POP UP & INNER FUNCTIONS ---------- */

function openModal(student) {
  console.log(student);
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

  /* ---------- INQUISITORIAL SQUAD FUNCTION ---------- */
  console.log("Student inquisitor", student.inquisitor);
  if (student.inquisitor === true) {
    popUp.querySelector(".infoPopUp .inquisitor").textContent = "🌟";
  } else {
    popUp.querySelector(".infoPopUp .inquisitor").textContent = "☆";
  }

  popUp.querySelector(".infoPopUp .inquisitor").addEventListener("click", clickInquisitor);

  function clickInquisitor() {
    if (student.house === "Slytherin" || student.blood === "Pureblood") {
      console.log("clickInquisitor");
      if (student.inquisitor === true) {
        popUp.querySelector(".infoPopUp .inquisitor").textContent = "☆";
        student.inquisitor = false;
      } else {
        console.log("its false");
        popUp.querySelector(".infoPopUp .inquisitor").textContent = "🌟";
        student.inquisitor = true;
      }

      buildList();
    } else {
      console.log("not allowed");
      document.querySelector("#notallowed").classList.remove("hidden");
      document.querySelector("#notallowed .closebutton").addEventListener("click", closeDialog);
    }

    function closeDialog() {
      console.log("closeDialog");
      document.querySelector("#notallowed").classList.add("hidden");
      document.querySelector("#notallowed .closebutton").removeEventListener("click", closeDialog);
    }
  }

  /* ---------- PREFECT FUNCTION ---------- */

  popUp.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  popUp.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }

    buildList();
  }

  function tryToMakeAPrefect(selectedStudent) {
    //issues that I might have:
    // everytime I close the new array is empty
    const prefects = allStudents.filter((student) => student.prefect);
    const numberOfPrefects = prefects.length;

    // issues > .firstname is correct?
    const other = prefects.filter((student) => student.house === selectedStudent.house).shift();

    // if there is another of the same type
    if (other !== undefined) {
      console.log("there can be only one winner of each type!");
      removeOther(other);
    } else if (numberOfPrefects >= 2) {
      console.log("there can only be two winners");
      removeAorB(prefects[0], prefects[1]);
    } else {
      makePrefect(selectedStudent);
    }

    // console.log(`there are ${numberOfPrefects}`);

    function removeOther(other) {
      //ask user to ignore or remove "other"
      document.querySelector("#remove_other").classList.remove("hidden");
      document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
      document.querySelector("#remove_other  #removeother").addEventListener("click", clickRemoveOther);

      document.querySelector("#remove_other [data-field=otherPrefect]").textContent = `${other.firstname} ${other.lastname}`;

      // if ignore - do nothing
      function closeDialog() {
        console.log("closeDialog");
        document.querySelector("#remove_other").classList.add("hidden");
        document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_other  #removeother").removeEventListener("click", clickRemoveOther);
      }

      // if remove other:
      function clickRemoveOther() {
        removePrefect(other);
        makePrefect(selectedStudent);
        buildList();
        closeDialog();
      }
    }

    function removeAorB(prefectA, prefectB) {
      // ask the user to ignore or remove A or B
      document.querySelector("#remove_aorb").classList.remove("hidden");
      document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
      document.querySelector("#remove_aorb  #removea").addEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb  #removeb").addEventListener("click", clickRemoveB);

      // show names on buttons
      document.querySelector("#remove_aorb [data-field=prefectA]").textContent = `${prefectA.firstname} ${prefectA.lastname}`;
      document.querySelector("#remove_aorb [data-field=prefectB]").textContent = `${prefectB.firstname} ${prefectB.lastname}`;

      // popUp.querySelector("h2").textContent = `${student.firstname} ${student.lastname}`;

      // if ignore - do nothing
      function closeDialog() {
        document.querySelector("#remove_aorb").classList.add("hidden");
        document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_aorb  #removea").removeEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb  #removeb").removeEventListener("click", clickRemoveB);
      }

      function clickRemoveA() {
        // if remove A:
        removePrefect(prefectA);
        makePrefect(selectedStudent);
        buildList();
        closeDialog();
      }

      //else - if removeB

      function clickRemoveB() {
        removePrefect(prefectB);
        makePrefect(selectedStudent);
        buildList();
        closeDialog();
      }
    }

    function removePrefect(prefectStudent) {
      prefectStudent.winner = false;
    }

    function makePrefect(student) {
      student.prefect = true;
    }
  }

  popUp.querySelector("#close").addEventListener("click", function () {
    popUp.classList.add("hidden");

    popUp.querySelector(".infoPopUp .inquisitor").removeEventListener("click", clickInquisitor);
    popUp.querySelector("[data-field=prefect]").removeEventListener("click", clickPrefect);
  });
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

/* ---------- SEARCH BAR ---------- */
