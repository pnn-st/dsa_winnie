
/** โหนดหนังสือ 1 เล่ม (ใช้กับ LinkedList) */
class BookNode {
    constructor(
        id,
        title,
        author,
        category,
        status = "Available",
        borrower = null,
        borrowDate = null
    ) {
        this.id = id;                 // รหัสหนังสือ เช่น 1001, 1002
        this.title = title;           // ชื่อเรื่อง
        this.author = author;         // ผู้แต่ง
        this.category = category;     // หมวดหมู่เป็นรหัส "1".."16"
        this.status = status;         // "Available" (ว่าง) หรือ "Borrowed" (ถูกยืม)
        this.borrower = borrower;     // ชื่อคนยืม (ถ้ามี)
        this.borrowDate = borrowDate; // วันที่ยืม (ถ้ามี)
        this.next = null;             // โหนดถัดไป (โครงสร้าง Linked List)
    }
}

/** รายการหนังสือแบบ Linked List (เพิ่ม/ลบ/ค้นหาได้) */
class BookLinkedList {
    constructor() {
        this.head = null;
    }
    add(book) {
        // สร้างโหนดจากข้อมูล book ที่รับมา
        const newNode = new BookNode(
            book.id,
            book.title,
            book.author,
            book.category,
            book.status || "Available",
            book.borrower ?? null,
            book.borrowDate ?? null
        );

        // ถ้ายังไม่มีเล่มแรก ให้ newNode เป็นหัวรายการ
        if (!this.head) {
            this.head = newNode;
        } else {
            // เดินไปท้ายรายการแล้วต่อหาง
            let cur = this.head;
            while (cur.next) cur = cur.next;
            cur.next = newNode;
        }
    }
    toArray() {
        // แปลง LinkedList -> Array เพื่อใช้เรนเดอร์/จัดเรียงง่าย ๆ
        const out = [];
        let cur = this.head;
        while (cur) {
            out.push({
                id: cur.id,
                title: cur.title,
                author: cur.author,
                category: cur.category,
                status: cur.status,
                borrower: cur.borrower,
                borrowDate: cur.borrowDate,
            });
            cur = cur.next;
        }
        return out;
    }
    find(id) {
        const target = String(id);
        let cur = this.head;
        while (cur) {
            if (String(cur.id) === target) return cur; // เทียบแบบสตริง
            cur = cur.next;
        }
        return null;
    }

    remove(id) {
        const target = String(id);
        if (!this.head) return false;

        if (String(this.head.id) === target) { // เทียบแบบสตริง
            this.head = this.head.next;
            return true;
        }
        let cur = this.head;
        while (cur.next && String(cur.next.id) !== target) cur = cur.next;
        if (cur.next) {
            cur.next = cur.next.next;
            return true;
        }
        return false;
    }
    getSize() {
        // นับจำนวนจากการเดินลิสต์ (ค่านี้ตรงกับข้อมูลจริงเสมอ)
        let count = 0;
        let cur = this.head;
        while (cur) {
            count++;
            cur = cur.next;
        }
        return count;
    }
}

/** กองหนังสือที่ "เพิ่มล่าสุด" (Stack = เข้าทีหลังออกก่อน LIFO) */
class BookStack {
    constructor() {
        this.items = [];
    }
    push(b) {
        this.items.push(b); // วางไว้บนสุด
    }
    pop() {
        return this.items.pop(); // หยิบเล่มบนสุดออก
    }
    peek() {
        return this.items[this.items.length - 1]; // ดูเล่มบนสุด (ไม่เอาออก)
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
}

/** คิวคำขอยืม (Queue = เข้า-ออกตามลำดับก่อนหลัง FIFO) */
class BorrowQueue {
    constructor() {
        this.items = [];
    }
    enqueue(borrowRequest) {
        // เก็บเฉพาะฟิลด์ที่ต้องใช้ในหน้าคืนหนังสือ
        this.items.push({
            bookId: borrowRequest.bookId,
            title: borrowRequest.title,
            author: borrowRequest.author,
            category: borrowRequest.category,
            borrower: borrowRequest.borrower,
            borrowDate: borrowRequest.borrowDate,
        });
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    toArray() {
        return [...this.items];
    }
    removeByBookId(bookId) {
        const target = String(bookId);
        this.items = this.items.filter(r => String(r.bookId) !== target);
    }
}

/* 
    Sorting
    - ใช้ quickSort ตามคีย์ที่กำหนด เช่น id / title / author
 */

function quickSort(arr, key, ascending = true) {
    if (!Array.isArray(arr) || arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [],
        right = [],
        equal = [];

    for (const el of arr) {
        const a = el[key],
            b = pivot[key];
        // ascending: ใช้ a เทียบ b, descending: สลับ
        const cmp = ascending ? compareValues(a, b) : compareValues(b, a);
        if (cmp < 0) left.push(el);
        else if (cmp > 0) right.push(el);
        else equal.push(el);
    }
    return [...quickSort(left, key, ascending), ...equal, ...quickSort(right, key, ascending)];
}

/** ฟังก์ชันช่วยเปรียบเทียบค่าที่เป็น string/number/undefined */
function compareValues(a, b) {
    if (typeof a === "string" && typeof b === "string")
        return a.toLowerCase().localeCompare(b.toLowerCase());
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return 1; // ไม่มีค่าให้ถือว่าอยู่ท้าย
    if (b === undefined) return -1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}


const booksList = new BookLinkedList(); // รายการหนังสือทั้งหมด
const recentlyAdded = new BookStack();  // เก็บว่าเพิ่งเพิ่มเล่มไหนบ้าง
const borrowQueue = new BorrowQueue();  // คิวคำขอยืม (สำหรับหน้า Return)

/**
 * สร้าง ID หนังสือรูปแบบ <category><running 3 หลัก>
 * ตัวอย่าง: category = "1" -> 1001, 1002, ...
 */
function generateBookId(category) {
    // บังคับให้หมวดเป็น 2 หลักเสมอ เช่น "1" -> "01"
    const cat2 = String(category).padStart(2, "0");

    // นับจำนวนเล่มในหมวดเดียวกันจาก "รหัสที่ขึ้นต้นด้วย cat2"
    let categoryCount = 0;
    booksList.toArray().forEach((book) => {
        const idStr = String(book.id);
        if (idStr.startsWith(cat2)) categoryCount++;
    });

    // running 3 หลัก เช่น 1 -> "001"
    const run3 = String(categoryCount + 1).padStart(3, "0");

    // คืนค่าเป็น "สตริง" เพื่อเก็บ 0 นำหน้าได้จริง
    return `${cat2}${run3}`;  // ตัวอย่าง: "01001"
}

/** แปลงรหัสหมวดหมู่เป็นชื่อ (ให้ตรงกับตัวเลือกใน add) */
function getCategoryName(category) {   //กำหนดค่าว่าแต่ละ category แทนด้วยเลขอะไร ในตอนที่เอาไปแทนใน ID
    const map = {
        "01": "Fiction",
        "02": "Romance",
        "03": "Mystery",
        "04": "Fantasy",
        "05": "Thriller",
        "06": "Poetry",
        "07": "Arts",
        "08": "Non-Fiction",
        "09": "Biography",
        "10": "History",
        "11": "Science",
        "12": "Technology",
        "13": "Self-Help",
        "14": "Travel",
        "15": "Cooking",
        "16": "Children",
    };
    const code = String(category).padStart(2, "0"); // รองรับทั้ง "1" และ "01"
    return map[code] || "Unknown";
}

function showNotification(message, type = "success") {
    const el = document.createElement("div");
    el.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 12px 14px; border-radius: 8px;
    color: #fff; font-weight: 600; z-index: 1000; max-width: 320px;
    ${type === "success" ? "background:#10b981;" : "background:#ef4444;"}`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 2500);
}


const LS_KEYS = {
    books: "lib_books",
    queue: "lib_borrow_queue",
};

/** บันทึกสถานะปัจจุบันลง localStorage */
function saveState() {
    try {
        localStorage.setItem(LS_KEYS.books, JSON.stringify(booksList.toArray()));
        localStorage.setItem(LS_KEYS.queue, JSON.stringify(borrowQueue.toArray()));
    } catch (e) {
        console.warn("Failed to save state:", e);
    }
}

/** โหลดข้อมูลจาก localStorage กลับเข้าโครงสร้างในหน่วยความจำ */
function loadState() {
    // เคลียร์ข้อมูลเก่าออกก่อน
    booksList.head = null;
    borrowQueue.items = [];

    try {
        const booksJSON = localStorage.getItem(LS_KEYS.books);
        if (booksJSON) {
            const booksArr = JSON.parse(booksJSON);
            booksArr.forEach((b) => booksList.add(b));
        }
    } catch (e) {
        console.warn("Failed to parse books from storage", e);
    }

    try {
        const queueJSON = localStorage.getItem(LS_KEYS.queue);
        if (queueJSON) {
            const items = JSON.parse(queueJSON);
            items.forEach((r) => borrowQueue.enqueue(r));
        }
    } catch (e) {
        console.warn("Failed to parse queue from storage", e);
    }
}

/* 
   Main Actions
   - เพิ่ม/ลบ/ยืม/คืน
 */

/** เพิ่มหนังสือใหม่จากฟอร์ม (หน้า add) */
function addBook(event) {
    if (event) event.preventDefault();

    const titleElement = document.getElementById("book-title") || document.getElementById("title");
    const authorElement = document.getElementById("book-author") || document.getElementById("author");
    const categoryElement = document.getElementById("book-category");

    const title = (titleElement?.value || "").trim();
    const author = (authorElement?.value || "").trim();
    const category = categoryElement?.value;

    if (!title || !author || !category) {
        showNotification("Please fill all fields!", "error");
        return;
    }

    const id = generateBookId(category);
    const newBook = { id, title, author, category, status: "Available" };

    booksList.add(newBook);
    recentlyAdded.push(newBook);

    // เคลียร์ฟอร์มหลังเพิ่ม
    if (titleElement) titleElement.value = "";
    if (authorElement) authorElement.value = "";
    if (categoryElement) categoryElement.value = "";

    saveState(); // บันทึกลง localStorage

    showNotification(`Book "${title}" added successfully!`, "success");

    // รีเฟรชมุมมองของหน้าปัจจุบัน
    const page = getCurrentPage();
    if (page === "index") displayBooks();
    if (page === "borrow") displayAvailableBooks();
}

/** ลบหนังสือตาม id (และลบออกจากคิว ถ้ามี) */
function deleteBook(bookId) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    if (booksList.remove(bookId)) {
        // ถ้ามีค้างอยู่ในคิวให้เอาออกด้วย
        borrowQueue.removeByBookId(bookId);
        saveState();
        showNotification("Book deleted successfully!", "success");

        const page = getCurrentPage();
        if (page === "index") displayBooks();
        if (page === "borrow") displayAvailableBooks();
        if (page === "return") displayBorrowedBooks();
    } else {
        showNotification("Failed to delete book!", "error");
    }
}

/** ยืมหนังสือตาม id (กรอกชื่อผู้ยืมแบบ prompt ง่าย ๆ) */
function borrowBook(bookId) {
    const borrower = prompt("Enter borrower name:");
    if (!borrower || borrower.trim() === "") {
        showNotification("Borrower name is required!", "error");
        return;
    }

    const book = booksList.find(bookId);
    if (book && book.status === "Available") {
        book.status = "Borrowed";
        book.borrower = borrower.trim();
        book.borrowDate = new Date().toLocaleDateString();

        borrowQueue.enqueue({
            bookId: String(book.id), // สำคัญ: สตริง
            title: book.title,
            author: book.author,
            category: book.category,
            borrower: book.borrower,
            borrowDate: book.borrowDate,
        });

        saveState();

        showNotification(`Book "${book.title}" borrowed successfully!`, "success");
        displayAvailableBooks();
    } else {
        showNotification("Book is not available for borrowing!", "error");
    }
}

/** คืนหนังสือตาม id (เปลี่ยนสถานะ + เอาออกจากคิว) */
function returnBook(bookId) {
    const book = booksList.find(bookId);
    if (book && book.status === "Borrowed") {
        book.status = "Available";
        book.borrower = null;
        book.borrowDate = null;
        borrowQueue.removeByBookId(bookId);

        saveState();

        showNotification(`Book "${book.title}" returned successfully!`, "success");
        displayBorrowedBooks();
    } else {
        showNotification("Failed to return book!", "error");
    }
}

/* 
   Displays เรนเดอร์ตารางบนหน้าเว็บ
 */

/** แสดงหนังสือทั้งหมด (หน้า index) */
function displayBooks() {
    const books = booksList.toArray();
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-2 px-4 border border-gray-300 text-center text-gray-500">No books in library yet</td></tr>`;
        return;
    }

    books.forEach((book) => {
        const row = tbody.insertRow();
        row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300 text-center font-semibold">${book.id}</td>
      <td class="py-2 px-4 border border-gray-300">${book.title}</td>
      <td class="py-2 px-4 border border-gray-300">${book.author}</td>
      <td class="py-2 px-4 border border-gray-300">${getCategoryName(book.category)}</td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <span style="padding:2px 8px;border-radius:12px;font-size:.75rem;font-weight:500;${book.status === "Available"
                ? "color:#059669;background:#d1fae5;"
                : "color:#dc2626;background:#fee2e2;"
            }">
          ${book.status === "Available" ? "✅ Available" : "📚 Borrowed"}
        </span>
      </td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <button onclick="deleteBook('${book.id}')" class="px-3 py-1 rounded text-sm" style="border:1px solid #ef4444">🗑️ Delete</button>
      </td>`;
    });
}

/** แสดงเฉพาะหนังสือที่ยืมได้ (หน้า borrow) */
function displayAvailableBooks() {
    const books = booksList.toArray().filter((b) => b.status === "Available");
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-2 px-4 border border-gray-300 text-center text-gray-500">No books available for borrowing</td></tr>`;
        return;
    }

    books.forEach((book) => {
        const row = tbody.insertRow();
        row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300 text-center font-semibold">${book.id}</td>
      <td class="py-2 px-4 border border-gray-300">${book.title}</td>
      <td class="py-2 px-4 border border-gray-300">${book.author}</td>
      <td class="py-2 px-4 border border-gray-300">${getCategoryName(book.category)}</td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <button onclick="borrowBook('${book.id}')" class="px-3 py-1 rounded text-sm" style="border:1px solid #111827">📚 Borrow</button>
      </td>
`;
    });
}

/** แสดงเฉพาะรายการที่ถูกยืมอยู่ (หน้า return) */
function displayBorrowedBooks() {
    const borrowed = borrowQueue.toArray();
    const tbody = document.getElementById("return-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (borrowed.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-2 px-4 border border-gray-300 text-center text-gray-500">No books currently borrowed</td></tr>`;
        return;
    }

    borrowed.forEach((r) => {
        const row = tbody.insertRow();
        row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300 text-center font-semibold">${r.bookId}</td>
      <td class="py-2 px-4 border border-gray-300">${r.title}</td>
      <td class="py-2 px-4 border border-gray-300">${r.author}</td>
      <td class="py-2 px-4 border border-gray-300">${getCategoryName(r.category)}</td>
      <td class="py-2 px-4 border border-gray-300">${r.borrower}</td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <button onclick="returnBook('${r.bookId}')" class="px-3 py-1 rounded text-sm" style="border:1px solid #111827">🔄 Return</button>
      </td>
`;
    });
}

/** เรนเดอร์ผลลัพธ์หลังการค้นหา/กรอง (หน้า index) */
function displayFilteredBooks(books) {
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-2 px-4 border border-gray-300 text-center text-gray-500">No books match your search criteria</td></tr>`;
        return;
    }

    books.forEach((book) => {
        const row = tbody.insertRow();
        row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300 text-center font-semibold">${book.id}</td>
      <td class="py-2 px-4 border border-gray-300">${book.title}</td>
      <td class="py-2 px-4 border border-gray-300">${book.author}</td>
      <td class="py-2 px-4 border border-gray-300">${getCategoryName(book.category)}</td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <span style="padding:2px 8px;border-radius:12px;font-size:.75rem;font-weight:500;${book.status === "Available"
                ? "color:#059669;background:#d1fae5;"
                : "color:#dc2626;background:#fee2e2;"
            }">
          ${book.status === "Available" ? "✅ Available" : "📚 Borrowed"}
        </span>
      </td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <button onclick="deleteBook('${book.id}')" class="px-3 py-1 rounded text-sm" style="border:1px solid #ef4444">🗑️ Delete</button>
      </td>`;
    });
}

/** เรนเดอร์ผลลัพธ์หลังการค้นหา/กรอง (หน้า borrow) */
function displayFilteredBooksForBorrow(books) {
    const tbody = document.getElementById("list-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-2 px-4 border border-gray-300 text-center text-gray-500">No available books match your search</td></tr>`;
        return;
    }

    books.forEach((book) => {
        const row = tbody.insertRow();
        row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300 text-center font-semibold">${book.id}</td>
      <td class="py-2 px-4 border border-gray-300">${book.title}</td>
      <td class="py-2 px-4 border border-gray-300">${book.author}</td>
      <td class="py-2 px-4 border border-gray-300">${getCategoryName(book.category)}</td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <button onclick="borrowBook('${book.id}')" class="px-3 py-1 rounded text-sm" style="border:1px solid #111827">📚 Borrow</button>
      </td>
`;
    });
}

/** เรนเดอร์ผลลัพธ์หลังการค้นหา/กรอง (หน้า return) */
function displayFilteredBooksForReturn(items) {
    const tbody = document.getElementById("return-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-2 px-4 border border-gray-300 text-center text-gray-500">No borrowed books match your search</td></tr>`;
        return;
    }

    items.forEach((r) => {
        const row = tbody.insertRow();
        row.innerHTML = `
      <td class="py-2 px-4 border border-gray-300 text-center font-semibold">${r.bookId}</td>
      <td class="py-2 px-4 border border-gray-300">${r.title}</td>
      <td class="py-2 px-4 border border-gray-300">${r.author}</td>
      <td class="py-2 px-4 border border-gray-300">${getCategoryName(r.category)}</td>
      <td class="py-2 px-4 border border-gray-300">${r.borrower}</td>
      <td class="py-2 px-4 border border-gray-300 text-center">
        <button onclick="returnBook('${r.bookId}')" class="px-3 py-1 rounded text-sm" style="border:1px solid #111827">🔄 Return</button>
      </td>
`;
    });
}

/*Search & Sort  */

/** ค้นหาแบบพิมพ์สด ๆ (ใช้ id="search-list") */
function searchBooks() {
    const searchInput = document.getElementById("search-list");
    if (!searchInput) return;

    const term = searchInput.value.toLowerCase().trim();
    const page = getCurrentPage();

    // เตรียมชุดข้อมูลตามแต่ละหน้า
    let data;
    if (page === "borrow") {
        data = booksList.toArray().filter((b) => b.status === "Available");
    } else if (page === "return") {
        data = borrowQueue.toArray();
    } else {
        data = booksList.toArray();
    }

    // กรองด้วยคำค้น (เช็คได้หลายคอลัมน์)
    if (term) {
        data = data.filter((item) => {
            const idText = (item.id ?? item.bookId ?? "").toString().toLowerCase();
            const titleText = (item.title ?? "").toLowerCase();
            const authorText = (item.author ?? "").toLowerCase();
            const catText = getCategoryName(item.category).toLowerCase();
            const borrowerText = (item.borrower ?? "").toLowerCase();
            return [idText, titleText, authorText, catText, borrowerText].some((f) =>
                f.includes(term)
            );
        });
    }

    // เรนเดอร์ตามประเภทหน้า
    if (page === "borrow") displayFilteredBooksForBorrow(data);
    else if (page === "return") displayFilteredBooksForReturn(data);
    else displayFilteredBooks(data);
}

/** จัดเรียงข้อมูลตามตัวเลือก (ใช้ id="sort-list") */
function sortBooks() {
    const sortSelect = document.getElementById("sort-list");
    if (!sortSelect) return;

    const page = getCurrentPage();
    const by = sortSelect.value;

    // เลือก "none" = แสดงตามค่าปัจจุบัน (ไม่จัดเรียง)
    if (by === "none") {
        if (page === "borrow") displayAvailableBooks();
        else if (page === "return") displayBorrowedBooks();
        else displayBooks();
        return;
    }

    // เตรียมข้อมูลตามหน้า
    let data;
    if (page === "borrow") data = booksList.toArray().filter((b) => b.status === "Available");
    else if (page === "return") data = borrowQueue.toArray();
    else data = booksList.toArray();

    // ในหน้า return ถ้าเลือก id ให้ใช้คีย์ 'bookId' แทน
    const key = page === "return" && by === "id" ? "bookId" : by;

    const sorted = quickSort(data, key, true); // เรียงน้อย -> มาก
    if (page === "borrow") displayFilteredBooksForBorrow(sorted);
    else if (page === "return") displayFilteredBooksForReturn(sorted);
    else displayFilteredBooks(sorted);
}


/** ตรวจว่าหน้านี้คือหน้าไหน เพื่อแสดงผลให้ถูก */
function getCurrentPage() {
    const path = (typeof window !== "undefined" ? window.location.pathname : "") || "";
    if (path.includes("borrow.html")) return "borrow";
    if (path.includes("return.html")) return "return";
    if (path.includes("add.html")) return "add";
    return "index";
}

/** โหลดข้อมูลจาก localStorage ก่อน

 */
function initializeData() {
    // โหลดจาก localStorage
    loadState();

}

/** เมื่อโหลดหน้าเสร็จ: เตรียมข้อมูล + แสดงผลตามหน้า */
window.addEventListener("load", () => {
    initializeData();
    const page = getCurrentPage();
    if (page === "index") displayBooks();
    else if (page === "borrow") displayAvailableBooks();
    else if (page === "return") displayBorrowedBooks();
});

/** ผูกอีเวนต์ให้ฟอร์ม/ช่องค้นหา/การเรียง */
document.addEventListener("DOMContentLoaded", () => {
    // ฟอร์มเพิ่มหนังสือ (หน้า add ควรมี id="add-book-form")
    const form = document.getElementById("add-book-form");
    if (form) form.addEventListener("submit", addBook);

    // ช่องค้นหา (id="search-list")
    const searchInput = document.getElementById("search-list");
    if (searchInput) searchInput.addEventListener("input", searchBooks);

    // เลือกการเรียง (id="sort-list")
    const sortSelect = document.getElementById("sort-list");
    if (sortSelect) sortSelect.addEventListener("change", sortBooks);
});
