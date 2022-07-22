const books = [];
const RENDER_EVENT = "render-todo";

const submitBook = document.getElementById("form");
submitBook.addEventListener("submit", function(event){
    // Prevent the refresh
    event.preventDefault();
    addBook();
});

function addBook(){
    // Get book values
    const bookTitle = document.querySelector("#book-title").value;
    const bookAuthor = document.querySelector("#author-name").value;
    const yearReleased = document.querySelector("#year-released").value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, yearReleased, false);
    books.push(bookObject);

    // console.log(bookTitle, bookAuthor, yearReleased);
    console.log(books);
    // Make book on HTML element
    makeBook(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Generating the custom ID for each book
function generateId(){
    return +new Date();
}

// Generating book object
function generateBookObject(id, title, author, year, isFinished){
    return {id, title, author, year, isFinished};
}

// Make book on HTML Element
function makeBook(bookObject){
    // Create and input text value
    const title = document.createElement("h2");
    title.innerText = bookObject.title;
    const author = document.createElement("h3");
    author.innerText = bookObject.author;
    const year = document.createElement("p");
    year.innerText = bookObject.year;

    // Create edit and delete
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerText = "EDIT";
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerText = "DELETE";

    // Input all elements above to textContainer
    const textContainer = document.createElement("div");
    textContainer.classList.add("borrowed-book-detail");
    textContainer.append(title, author, year, buttons);
    buttons.append(editButton, deleteButton);

    // Input textContainer to bookContainer
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("book-borrowed");
    bookContainer.append(textContainer);

    // Input bookContainer into books-borrowed class and display it to HTML
    const notFinishContainer = document.querySelector(".books-borrowed");
    notFinishContainer.append(bookContainer);

    return notFinishContainer;
}

const STORAGE_KEY = "books";
let temporaryData = [];
function saveData(){
    if(typeof(Storage) !== "undefined"){
        if(localStorage.getItem(STORAGE_KEY) !== null){
            temporaryData = localStorage.getItem(STORAGE_KEY);
            console.log(temporaryData);
            // alert("Data sudah ada");
        } else{
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
        }

    }
}

// function loadDataFromStorage(){
//     const serializedData = localStorage.getItem(STORAGE_KEY);
//     let data = JSON.parse(serializedData);

//     if(data !== null){
//         for(const book of books){
//             books.push(book);
//         }
//     }
// }

// if(typeof(Storage) !== "undefined"){
//     loadDataFromStorage();
// }
