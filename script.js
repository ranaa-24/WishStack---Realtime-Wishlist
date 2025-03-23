//search: Add Firebase to your JavaScript project 
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js"

//got from firebase console > realtime database
const appSettings = {
    databaseURL: "https://playground-399af-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

//connection to db
const app = initializeApp(appSettings);
const database = getDatabase(app);

// creating a reference to tha database
const itemsInDB = ref(database, "Items");

// also change the "Rule" to {read : true, write : true.} so that anyone can read and edit the database for any number of days [if sharin in public then change write : false]

// ---- App ----
const inputField = document.getElementById("input-field");
const addBtn = document.getElementById("add-btn");
const shopingList = document.getElementById("list");
const emptyMsg = document.getElementById("empty-msg");




// ADD ITEMS
addBtn.addEventListener("click", function () {
    let inputVal = inputField.value;
    if (inputVal) {
        push(itemsInDB, inputVal);      //push to DB
        clearInputFieled();
    }
});

// Fetching data from DB
//runns every time BD updated, with the old values
onValue(itemsInDB, function (snapshot) {
    // clear the list before updated the list again
    shopingList.innerHTML = "";

    let snapVal = snapshot.val();
    //before parsing to values must check if snapshot.val() is not null, ow object,value() return execption 
    if (snapVal) {
        emptyMsg.style.display = 'none';
        const itemsInDB = Object.entries(snapVal);
        for (let item of itemsInDB) {
            appendList(item);
        }
    }
    else {
        emptyMsg.style.display = 'block';
    }
});


//on enter sublit
inputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addBtn.click();
    }
});



function clearInputFieled() {
    inputField.value = "";
}


function appendList(entry) {

    let eleVal = entry[1];
    let eleID = entry[0];

    let li = document.createElement('li');
    li.innerText = eleVal;

    li.setAttribute("title", "Double click to remove");

    //Adding a Event Listner to Remove items
    li.addEventListener("dblclick", (even) => {
        let exactLocationOfEleInDB = ref(database, `Items/${eleID}`); 
        remove(exactLocationOfEleInDB);
    });

    li.onmousedown = (event) => { return false; } // to prevent the text selection

    shopingList.append(li);
}

