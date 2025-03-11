
import {jsPDF} from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

let myDoc = new jsPDF();

const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();


const order = [];
const taxRate = 0.07;

function addItem(event) {
    const button = event.target;
    const itemName = button.getAttribute('itemName');   
    const itemPrice = parseFloat(button.getAttribute('itemPrice'));
    const itemInOrder = order.find(item => item.name === itemName);

    if (itemInOrder) {
        itemInOrder.quantity += 1;
        itemInOrder.totalPrice += itemPrice;
    } else {
        order.push ({ name: itemName, price: itemPrice, quantity: 1, totalPrice: itemPrice});
    }
}

function downloadPdf() {
    myDoc.save("myDoc.pdf");
}

function viewPdf() {
    let userName = document.getElementById("name").value.trim();
    let userEmail = document.getElementById("email").value.trim();
  
    if (userName === "") {
      alert("Please enter your name");
      return;
    }
    if (userEmail === "") {
        alert("Please enter your email");
        return;
      }
      if (order.length === 0) {
        alert("Please add items to your order");
        return;
    }
    let invoiceNum = '';
    for (let i = 0; i < 8; i++) {
        invoiceNum += Math.floor(Math.random() * 10);
    }

    myDoc = new jsPDF();
    myDoc.text("Generic Company Name", 20, 20);
    myDoc.text("Contact us at: genericemail@email.com", 20, 30);
    myDoc.text(`Date and Time of Purchase: ${formattedDate}, ${formattedTime}`, 20, 40);
    myDoc.text(`Invoice number: ${invoiceNum}`, 20, 50);
    myDoc.text("--------------------------------------------------------", 20, 55);

    let y = 65;
    let total = 0;
    let beforeTax = 0;

    order.forEach(item => {
        myDoc.text(`${item.name} - ${item.price} x ${item.quantity} = ${item.totalPrice}`, 20, y);
        y += 10;
        beforeTax += item.totalPrice;
    });

    const tax = beforeTax * taxRate;
    const afterTax = beforeTax + tax;

    myDoc.text(`Before Taxes: $${beforeTax}`, 20, y +5);
    y += 10;
    myDoc.text(`After Taxes: $${afterTax}`, 20, y + 5);

    const dataUrl = myDoc.output
    ("bloburl");

    console.log(dataUrl);

    document.querySelector("#pdf-preview").src = dataUrl + "#toolbar=0";
}
document.querySelectorAll(".buy").forEach(button => {
    button.addEventListener("click", addItem);
});

document.querySelector("#download-pdf").onclick = downloadPdf;

document.querySelector("#view-pdf").onclick = viewPdf;

document.querySelector(".buy").onclick = addItem;