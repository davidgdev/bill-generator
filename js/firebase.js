  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBkAg0SPfFF-bcqYW8G6MmvOIleaEDXFKU",
    authDomain: "bills-generator.firebaseapp.com",
    projectId: "bills-generator",
    storageBucket: "bills-generator.appspot.com",
    messagingSenderId: "611722669999",
    appId: "1:611722669999:web:68e9e6fc40fa7601f8895a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

//   Firestore DB Connection
const db = firebase.firestore()

const billForm = document.querySelector("#bill-form")
const billsTable = document.querySelector(".section-table table tbody")
const billDetailsName = document.getElementById("bill-details--name")
const billDetailsEmail = document.getElementById("bill-details--email")
const billDetailsPhone = document.getElementById("bill-details--phone")
const billDetailsAddress = document.getElementById("bill-details--address")
const billDetailsTable = document.querySelector(".bill-details--table table tbody")
const billDetailsTotal = document.getElementById("bill-details--total")

let options = { style: 'currency', currency: 'USD' };

// URL Param
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const billId = urlParams.get('id')

// Get Data from Firebasde
const getBills = () => db.collection('bills').get()
const getProducts = () =>  db.collection('products').get()
const getBill = () => db.collection('bills').doc(billId).get()



console.log(billId)


const onGetProducts = (callback) => db.collection('products').onSnapshot(callback)

// Get Bills
window.addEventListener('DOMContentLoaded', async (e) => {
    const querySnapshot = await getBills()
    querySnapshot.forEach(doc => {
        // console.log(doc.data())

        const date = doc.data().date
        const formatted_date = date.toDate().toLocaleString("en-CA", { year: 'numeric', month: 'numeric', day: 'numeric' });
        const name = doc.data().name
        const total = doc.data().total
        const totalFormatted = new Intl.NumberFormat('en-US', options).format(total);
        const id = doc.id
        
        billsTable.innerHTML += `
         <tr>
            <td>${formatted_date}</td>
            <td>${name}</td>
            <td>${totalFormatted}</td>
            <td><a href="bill-details.html?id=${id}" onclick="getBill('${id}')">${id}</a></td>
         </tr>
        `
    })
})

// Get bill details
window.addEventListener('DOMContentLoaded', async (e) => {
    const snapshot = await getBill()
    const doc = snapshot.data()
    const name = doc.name
    const email = doc.email
    const phone = doc.phone
    const address = doc.address
    const product = doc.product1
    const price = doc.price1
    const quantity = doc.quantity1
    const subtotal = doc.subtotal1
    const total = doc.total

    const priceFormatted = new Intl.NumberFormat('en-US', options).format(price);
    const subtotalFormatted = new Intl.NumberFormat('en-US', options).format(subtotal);
    const totalFormatted = new Intl.NumberFormat('en-US', options).format(total);

    billDetailsName.innerHTML = name
    billDetailsEmail.innerHTML = email
    billDetailsPhone.innerHTML = phone
    billDetailsAddress.innerHTML = address
    billDetailsTable.innerHTML += `
     <tr>
        <td>${product}</td>
        <td>${priceFormatted}</td>
        <td>${quantity}</td>
        <td>${subtotalFormatted}</td>
     </tr>
    `
    billDetailsTotal.innerHTML = totalFormatted
    
})


// Get Products
window.addEventListener('DOMContentLoaded', async (e) => {
    
    onGetProducts((querySnapshot) => {
        querySnapshot.forEach(doc => {
    
            const product = doc.data().product
            const price = doc.data().price
            
            productOption.innerHTML += `
            <option value="${product}" data-price="${price}">${product}</option>
            `

        })
    })
})


// Save Bill
billForm.addEventListener("submit", async (event) =>  {
    event.preventDefault();

    let docData = {
        name: billForm['name'].value,
        email: billForm['email'].value,
        phone: billForm['phone'].value,
        address: billForm['address'].value,
        total: billForm['total'].value,
        date: firebase.firestore.FieldValue.serverTimestamp()
    }
     
    for (let i = 0; i < count; i++) {
        docData[`product${i+1}`] = billForm[`select-product-${i+1}`].value
        docData[`price${i+1}`] = billForm[`price-${i+1}`].value
        docData[`quantity${i+1}`] = billForm[`quantity-${i+1}`].value
        docData[`subtotal${i+1}`] = billForm[`subtotal-${i+1}`].value
        
    }

    console.log(docData)

    // debugger

    await db.collection("bills").doc().set(docData).then(() => {
        console.log("Document successfully written!");
    });

    alert('The Bill was generated!')
    location.reload()
})

