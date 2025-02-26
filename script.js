document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/bookings")
        .then(response => response.json())
        .then(data => {
            let bookingList = document.getElementById("booking-list");
            bookingList.innerHTML = ""; // Clear old data
            data.forEach(booking => {
                let listItem = document.createElement("li");
                listItem.textContent = `Booking: ${booking.user_name} with ${booking.expert_name} on ${booking.booking_date} at ${booking.booking_time}`;
                bookingList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching bookings:", error));
});

// Function to book an expert
function bookExpert() {
    let userName = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let expertName = document.getElementById("expert").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    fetch("http://localhost:5000/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userName, email, expertName, date, time })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.reload(); // Refresh list
    })
    .catch(error => console.error("Error booking:", error));
}
