// alert("Welcome sir, you have to make bookshelf app, Do your best sir");
window.addEventListener("DOMContentLoaded", function(){
    // Variables
    const borrow = document.getElementById("borrow");
    const notFinish = document.getElementById("notFinish");
    const finish = document.getElementById("finish");
    const STORAGE_KEY = "BOOKS";

    
    // List Listener
    borrow.addEventListener("click", function(){
        window.location.href = "index.html";
    });
    
    notFinish.addEventListener("click", function(){
        window.location.href = "borrowPageNotFinish.html";
    });
    
    finish.addEventListener("click", function(){
        window.location.href = "borrowPageFinish.html";
    });

    // Submit book
    const books = [];
    const RENDER_EVENT = 'render-book';

    const submitBook = document.getElementById("form");
    submitBook.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    // Input Variables
    function addBook(){
        const bookTitle = document.querySelector("#book-title").value;
        const authorName = document.querySelector("#author-name").value;
        const yearReleased = document.querySelector("#year-released").value;

        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, bookTitle, authorName, yearReleased);
        books.push(bookObject);

        console.log(books);

        saveData(books);

        const booksContainer = document.getElementsByClassName("books-borrowed");
        
        for(const bookItem of books){
            const bookElement = makeBook(bookItem);
            booksContainer.append(bookElement);
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // Function for generate ID on book Object
    function generateId(){
        return +new Date();
    }

    // Function for make a book object
    function generateBookObject(id, title, author,isFinished){
        return{
            id, title, author, isFinished
        };
    }

    // Function for saving data to the localStorage
    function saveData(booksObject){
        if(typeof(Storage) !== 'undefined'){
            const parsedBook = JSON.stringify(booksObject);
            localStorage.setItem(STORAGE_KEY, parsedBook);
        }
    }

    function makeBook(bookObject){
        const bookTitle = document.createElement("h2");
        bookTitle.innerText = bookObject.task;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerText = bookObject.timestamp;

        const yearReleased = document.createElement("p");
        yearReleased.innerText = bookObject.year;

        const textContainer = document.createElement("div");
        textContainer.classList.add('borrowed-book-detail');
        textContainer.append(bookTitle, bookAuthor, yearReleased);

        const container = document.createElement("div");
        container.classList.add("book-borrowed");
        container.append(textContainer);
    }

    // Statement for declare the localstorage string
    if(typeof(Storage) !== "undefined"){
        if(localStorage.getItem(STORAGE_KEY) === null){
            localStorage.setItem(STORAGE_KEY, "");   
        }
    } else{
        alert("Your browser doesn't support local storage");
    }

    console.log(localStorage.getItem(STORAGE_KEY));
});


