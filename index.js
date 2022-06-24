// Book Class: Represents a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
console.log(Book);


//UI Class : Handle UI Class

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.map((book) => {
           UI.addBookTolist(book);
        });
    }

    static addBookTolist(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" >X</a></td>
        `
        list.appendChild(row);
    }
    static showAlert(errorMsg, className) {
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        const alertDIV = document.createElement('div');
        alertDIV.classList.add(className);
        const alert = document.createElement('h2');
        alert.textContent = errorMsg;
        alertDIV.appendChild(alert);
        container.insertBefore(alertDIV, form);

        //Vanish the error after 3s

        setTimeout(()=> {
            alertDIV.remove()
        }, 3000);
    }

    static clearFields() {
        const title = document.querySelector('#title');
        title.value = '';
        const author = document.querySelector('#author');
        author.value = '';
        const isbn = document.querySelector('#isbn');
        isbn.value = '';
    }

    static deleteBook(element) {
        if(element.classList.contains('delete')) {
             element.parentElement.parentElement.remove();
        }
    }
}
//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books; 
        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }
    static addBooks(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }
    static removeBooks(isbn) {
        let books = Store.getBooks();

        books.map((book, index)=> {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));

    }
}
//Event: Display Book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a Book
let form = document.querySelector('#book-form');
console.log(form);
form.addEventListener("submit", (event)=> {
    event.preventDefault();
    const title = document.querySelector('#title');
    const author = document.querySelector('#author');
    const isbn = document.querySelector('#isbn');


    //Validate Form Values

    if(title.value === '' || author.value === '' || isbn.value === '') {
            UI.showAlert('All fields Must be Filled', 'error');
    } else {
            // Instatiate a new book from the Book Class

            const book = new Book(title.value, author.value, isbn.value);

            //Add Book to list By caling the 'addBookToList()' UI method
            UI.addBookTolist(book);

            //Add Book To Store via LocalStorage
            Store.addBooks(book);

            // Success || Book Successfully Added
            UI.showAlert('Success! Book Added', 'success');
            //Clearing Fields
            UI.clearFields(book);
            }
})

//Event: Remove a Book

const bookList = document.querySelector('#book-list');
bookList.addEventListener('click', (e)=> {
    UI.deleteBook(e.target);
    UI.showAlert('Book Successfully Removed', 'remove');

    //Remove Book from UI Via LocalStorage
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
})
