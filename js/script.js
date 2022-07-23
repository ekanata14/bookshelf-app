document.addEventListener("DOMContentLoaded", function(){
    const books = [];
    const RENDER_EVENT = 'render-book';

    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function(event){
        event.preventDefault()
        addBook();  
    });

    // Fungsi untuk menambahkan buku
    function addBook(){
        const bookTitle = document.getElementById("book-title").value;
        const bookAuthor = document.getElementById("book-author").value;
        const yearReleased = document.getElementById("year-released").value;


        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, yearReleased, false);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    // Fungsi untuk membuat ID unik
    function generateId(){
        return +new Date();
    }
    
    // Fungsi untuk membuat objek buku
    function generateBookObject(id, title, author, year, isCompleted){
        return {id, title, author, year, isCompleted};
    }

    // Fungsi untuk mencari buku
    function findBook(bookId){
        for(const bookItem of books){
            if(bookItem.id === bookId){
                return bookItem;
            }
        }
        return null;
    }

    // Fungsi untuk mencari angka index buku
    function findBookIndex(bookId){
        for(const index in books){
            if(books[index].id === bookId){
                return index;
            }  
        }

        return -1;
    }
    // Fungsi untuk membuat buku agar bisa tampil di HTML
    function makeBook(bookObject){
        const bookTitle = document.createElement("a");
        bookTitle.setAttribute("id", "book-title");
        bookTitle.innerText = bookObject.title;

        const bookAuthor = document.createElement("h3");
        bookAuthor.innerText = bookObject.author;

        const bookYear = document.createElement("p");
        bookYear.innerText = bookObject.year;

        const bookContainer = document.createElement("section");
        bookContainer.classList.add('inner');
        bookContainer.append(bookTitle, bookAuthor, bookYear);

        const container = document.createElement("div");
        container.classList.add("item", "shadow");
        container.append(bookContainer);
        container.setAttribute("id", "book-${bookObject.id}");

        if(bookObject.isCompleted){
            const undoButton = document.createElement("i");
            undoButton.classList.add("fa", "fa-solid", "fa-rotate-left");

            undoButton.addEventListener("click", function(){
                undoTaskFromCompleted(bookObject.id);
            });
            

            const trashButton = document.createElement("i");
            trashButton.classList.add("fa" , "fa-solid", "fa-trash");

            trashButton.addEventListener("click", function(){
                removeBookFromCompleted(bookObject.id);                
            });

            const buttons = document.createElement("div");
            buttons.classList.add("buttons-container");
            buttons.append(undoButton, trashButton);

            container.append(buttons);
        } else {
            const checkButton = document.createElement("button");
            checkButton.classList.add("fa", "fa-solid", "fa-check");

            checkButton.addEventListener("click", function(){
                addBookToCompleted(bookObject.id);
            });

            container.append(checkButton);
        }
        return container;
    }
    
    // Fungsi untuk menambahkan buku ke tempat yang sudah selesai
    function addBookToCompleted(bookId){
        const bookTarget= findBook(bookId);

        if(bookTarget == null) return;

        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }

    // Fungsi untuk menghapus buku
    function removeBookFromCompleted(bookId){
        const bookTarget = findBookIndex(bookId);

        if(bookTarget == -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    // Fungsi untuk mengembalikan buku ke tempat yang harus dilakukan
    function undoTaskFromCompleted(bookId){
        const bookTarget = findBook(bookId);

        if(bookTarget == null) return;
        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));;
        saveData();
    }

    // Fungsi untuk menghapus buku
    const removeBooks = document.querySelector("#clear-books");
    removeBooks.addEventListener("click", function(){
        const removeAllNotif = confirm("Apakah Anda yakin ingin menghapus semua buku?");
        if(removeAllNotif == true){
            localStorage.clear(STORAGE_KEY);
            document.dispatchEvent(new Event(RENDER_EVENT));    
            window.location.reload();
        }
    });

    // Listener untuk merender buku
    document.addEventListener(RENDER_EVENT, function(){
        const uncompletedBook = document.getElementById("books");
        uncompletedBook.innerHTML = "";

        const completedBook = document.getElementById("completed-books");
        completedBook.innerHTML = "";

        for(const bookItem of books){
            const bookElement = makeBook(bookItem);
            if(!bookItem.isCompleted){
                uncompletedBook.append(bookElement);
            } else{
                completedBook.append(bookElement);
            }
        }
    });

    // Fungsi untuk save data
    function saveData(){
        if(isStorageExist()){
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    const SAVED_EVENT = 'saved-book';
    const STORAGE_KEY = 'BOOK_APPS';

    // Fungsi untuk mengecek apakah browser mendukung web storage
    function isStorageExist(){
        if(typeof(Storage) === "undefined"){
            alert("Browser tidak mendukung web storage");
            return false;
        } else{
            return true;
        }
    }
    
    // Custom Event untuk mengetahui perubahan data
    document.addEventListener(SAVED_EVENT, function(){
        let bookItem = JSON.parse((localStorage.getItem(STORAGE_KEY)));
        console.log(bookItem[item].isCompleted);
    });

    // Fungsi untuk mengambil data dari local storage untuk ditampilkan pada tampilan
    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if(data !== null){
            for(const book of data){
                books.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if(isStorageExist()){
        loadDataFromStorage();
    }
});