const books = [];
const STORAGE_KEY = 'BOOK_APPS';
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";

function generateId() {
    return +new Date();
}

function generateBookObject(id, textTitle, author, year, isCompleted) {
    return {
    id,
    textTitle,
    author,
    year,
    isCompleted
    }
}

document.addEventListener(SAVED_EVENT, function() {
    alert('Buku berhasil disimpan!');
    const alertCustom = document.createElement("div");
    alertCustom.classList.add('popUp');
    alertCustom.innerText = 'Buku berhasil disimpan!';
    document.body.insertBefore(alertCustom, document.body.children[0]);
    setInterval(() => {
        alertCustom.remove();
    }, 1000);
});

document.addEventListener(MOVED_EVENT, function() {
    alert('Buku berhasil dipindahkan');
    const alertCustom = document.createElement("div");
    alertCustom.classList.add('popUp');
    alertCustom.innerText = 'Buku berhasil dipindahkan!';
    document.body.insertBefore(alertCustom, document.body.children[0]);
    setInterval(() => {
        alertCustom.remove();
    }, 1000);
});

document.addEventListener(DELETED_EVENT, function() {
    alert('Buku berhasil dihapus!');
    const alertCustom = document.createElement("div");
    alertCustom.classList.add('popUpDelete');
    alertCustom.innerText = 'Buku berhasil dihapus!';
    document.body.insertBefore(alertCustom, document.body.children[0]);
    setInterval(() => {
        alertCustom.remove();
    }, 1000);
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
            if (!bookItem.isCompleted) {
        incompleteBookshelfList.append(bookElement);
    }else {
        completeBookshelfList.append(bookElement);
    }
    }
});

/* Local Storage */
function isStorageExist() {
    if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
    for (const book of data) {
        books.push(book);
    }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function moveData() {
    if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
    }
}

function deleteData() {
    if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
    }
}

function updateDataToStorage() {
    if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
        //saveData();
    }
}
/* Local Storage Break */

function makeBook(bookObject) {

    const {id, textTitle, author, year, isCompleted} = bookObject;

    const title = document.createElement('h3');
    title.innerText = `Judul Buku: ${textTitle}`;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item', 'card');
    textContainer.append(title, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('action');
    
    textContainer.append(container);
    textContainer.setAttribute('id', `todo-${id}`);

        if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.innerText= 'Belum selesai di Baca';
        undoButton.addEventListener('click', function() {
            undoBookFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(id);
        });

        container.append(undoButton, trashButton);
        } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.innerText= 'Selesai Dibaca';
        checkButton.addEventListener('click', function() {
            addBookToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerText= 'Hapus Buku';
        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(id);
        });

        container.append(checkButton, trashButton);
        }

    return textContainer;
}

function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const already = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, author, year, already, false);
    books.push(bookObject);

    if (already) {
        completeBookshelfList.append(bookObject);
    } else {
        incompleteBookshelfList.append(bookObject);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
}


function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
    if (books[index].id === bookId) {
        return index;
    }
    }
    return -1;
}

function lookBook() {
    const searchBook = document.getElementById('searchBookTitle');
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll('section.book_shelf > .book_list > .book_item');
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = '';
        } else {
            bookItem[i].style.display = 'none';
        }
    }
}

function checkBox() {
    const span = document.querySelector('span');
    if (inputBookIsComplete.checked) {
        span.innerText = 'Selesai dibaca';
    } else {
        span.innerText = 'Belum selesai dibaca';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchBook = document.getElementById('searchBook');
    const already = document.getElementById('inputBookIsComplete');

    submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    })

    searchBook.addEventListener("keyup", function (event) {
    event.preventDefault();
    lookBook();
    });

    searchBook.addEventListener('submit', function (event) {
    event.preventDefault();
    lookBook();
    })

    already.addEventListener('input', function (event) {
    event.preventDefault();
    checkBox();
    })

    if (isStorageExist()) {
    loadDataFromStorage();
    }
});
