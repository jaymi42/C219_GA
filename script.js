


// Jaymi Tan 22036150
//  Note: I initially wanted to make this website with Fullpage.js, but after multiple
// errors and issues, I decided to use the traditional way of making a website. As much as I wanted to
// use Fullpage.js, the amount of errors and bugs I encountered was too frustrating and time-consuming.
//I have added additional notes here to explain the code and the functions used in the script.js file.

// Function to create a book card, first setting its status to reserved or not reserved, then returning the HTML code for the card.
  function createBookCard(book) {
    const isReserved = book.reserved || false;
  
    return `
      <div class="col-md-3 mb-4">
        <div class="card book-card" data-book-id="${book.id}" data-bs-toggle="modal" data-bs-target="#bookModal">
          <img src="${book.image}" class="card-img-top" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title book-title">${book.title}</h5>
            <p class="card-text book-author">Author: ${book.author}</p>
            <button class="btn btn-blue btn-block reserve-btn" type="button" ${isReserved ? "disabled" : ""}>
              ${isReserved ? "Reserved" : "Reserve"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

// Function to initialize tooltips for book cards, showing the book's information when hovered over. It also adds the modal's content to the modal when clicked.
// So that when the modal opens, it will show the book information.
function initTooltips() {
  tippy(".card", {
    content: "",
    onShow(instance) {
      const bookId = $(instance.reference).data("book-id");
      const book = booksData.find((book) => book.id === bookId);

      if (book) {
        const title = $("<strong>").text(book.title);
        const author = $("<p>").text("Author: " + book.author);
        const genre = $("<p>").text("Genre: " + book.genre);
        const year = $("<p>").text("Year: " + book.year);
        const type = $("<p>").text("Type: " + book.type);

        const content = $("<div>").append(title, author, genre, year, type)[0];
        instance.setContent(content);

        instance.bookInfo = book;
      } else {
        instance.setContent("Book information is not available...");
      }
    }
  });

  $(document).on("click", ".card", function () {
    const bookId = $(this).data("book-id");
    const book = booksData.find((book) => book.id === bookId);
    
    if (book) {
      const title = $("<h5>").text(book.title);
      const author = $("<p>").text("Author: " + book.author);
      const img = $("<img>").attr("src", book.image).attr("alt", book.title).addClass("img-fluid");
      const genre = $("<p>").text("Genre: " + book.genre);
      const year = $("<p>").text("Year: " + book.year);
      const type = $("<p>").text("Type: " + book.type);
      const desc = $("<p>").text("Description: " + book.description);

      const contentModal = $("<div>").append(title, img, author, genre, year, type, desc)[0];
      $("#modalBody").html(contentModal);
    } else {
      $("#modalBody").html("Book information is unavailable.");
    }
  });
}

// This is a function to render the book cards, which will be called when the page loads.
// It will loop through the booksData array and create a book card for each book, then append it to the bookCardsContainer.
// It also initializes the tooltips and adds a click event to the reserve button to reserve the book.
function renderBookCards() {
    const bookCardsContainer = $("#bookCardsContainer");

    booksData.forEach((book) => {
      const bookCardHTML = createBookCard(book);
      bookCardsContainer.append(bookCardHTML);
    });

    initTooltips();

    $(".reserve-btn").on("click", function () {
      const card = $(this).closest(".card");
      const bookId = card.data("book-id");
      const book = booksData.find((book) => book.id === bookId);

      if (book && !book.reserved) {
        $(this).text("Reserved").prop("disabled", true);
        book.reserved = true;
        console.log(`Book ${book.title} reserved.`);
      }
    });
  }


// This is a function to filter the book cards based on the search input from the search bar in the Book List section.
// It will filter the booksData array based on the search input, then return the filtered books.
function filterBookCards(searchInput) {
    const filteredBooks = booksData.filter((book) => {
      const searchValue = searchInput.toLowerCase();
      return (
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue) ||
        book.genre.toLowerCase().includes(searchValue) ||
        book.year.toLowerCase().includes(searchValue) ||
        book.type.toLowerCase().includes(searchValue)
      );

    });

    return filteredBooks;
  }



// Function to create the data for the reservation chart, which will be called when the page loads.
// It will get the unique genres from the booksData array, then create the data for the chart based on the number of books in each genre that are not reserved.
// I also added two color objects for the chart, one for the background color and one for the border color, to make the chart more colorful and visually appealing.
// A possible improvement I could make is to maybe use a script to randomize colours for each genre, so that it minimizes hardcoding.
function reservationChartData() {
    const genres = [...new Set(booksData.map((book) => book.genre))];

    const genreColors = {
      "Self-Improvement": "rgba(255, 99, 132)",         // Red
      "Trivia": "rgba(54, 162, 235)",                   // Blue
      "Biography": "rgba(255, 206, 86)",                // Yellow
      "Self-Help": "rgba(255, 159, 64)",                  // Orange
      "Thriller": "rgba(255, 192, 203)",           // Pink
      "Manga": "rgba(75, 192, 192)",                  // Teal
      "Dystopian": "rgba(128, 0, 128)",                 // Purple
      "Philosophical": "rgba(0, 128, 0)",               // Green
      "Science Fiction": "rgba(255, 69, 0)",                   // Red-Orange
      "Fiction": "rgba(255, 0, 255)",           // Magenta
      "Adventure": "rgba(0, 128, 128)",               // Teal-Green
      "Horror": "rgba(128, 0, 0)",                      // Dark Red
    };

    const genreBorderColors = {
      "Self-Improvement": "rgba(255, 99, 132, 0.8)",         // Red
      "Trivia": "rgba(54, 162, 235, 0.8)",                   // Blue
      "Biography": "rgba(255, 206, 86, 0.8)",                // Yellow
      "Self-Help": "rgba(255, 159, 64, 0.8)",                  // Orange
      "Thriller": "rgba(255, 192, 203, 0.8)",           // Pink
      "Manga": "rgba(75, 192, 192, 0.8)",                  // Teal
      "Dystopian": "rgba(128, 0, 128, 0.8)",                 // Purple
      "Philosophical": "rgba(0, 128, 0, 0.8)",               // Green
      "Science Fiction": "rgba(255, 69, 0, 0.8)",                   // Red-Orange
      "Fiction": "rgba(255, 0, 255, 0.8)",           // Magenta
      "Adventure": "rgba(0, 128, 128, 0.8)",               // Teal-Green
      "Horror": "rgba(128, 0, 0, 0.8)",                      // Dark Red
    };

    const data = {
      labels: genres,
      datasets: [
        {
          label: "Books Yet to Be Reserved",
          data: genres.map((genre) => {
            const booksInGenre = booksData.filter(
              (book) => book.genre === genre && !book.reserved
            );
            return booksInGenre.length;
          }),
          backgroundColor: genres.map((genre) => genreColors[genre] || "rgba(0, 0, 0)"),
          borderColor: genres.map((genre) => genreBorderColors[genre] || "rgba(0, 0, 0, 0.8)"),
          borderWidth: 1,
        },
      ],
    };

    return data;
  }


  // This is a function to create the reservation chart, which will be called when the page loads.
  // It will create a new chart using data from reservationChartData, then set the options for the chart, such as the scales, legend, and title.
  function reservationChart() {
    const ctx = document.getElementById("reservationChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: reservationChartData(),
        options: {
            scales: {
                x: { title: { display: true, text: "Genre" } },
                y: {
                    title: { display: true, text: "Number of Books" },
                    ticks: {
                        stepSize: 1, 
                        beginAtZero: true,
                        max: 10,
                    }
                },
            },
            plugins: {
                legend: {
                    display: true,
                },
            },
        },
    });
}


// This is a function to create the pie chart for the reservation chart, which will be called when the page loads.
// It also uses the data from reservationChartData, but sets the chart type to "pie" and changes the options to display the percentage and title.
function reservationPieChart() {
    const ctx = document.getElementById("reservationPieChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: reservationChartData(),
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        color: 'white',
                        render: 'percentage', 
                        fontColor: 'white',
                        fontSize: 14,
                        fontStyle: 'bold',
                    }
                },
                title: {
                    display: true,
                    text: 'Books Yet to Be Reserved', 
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: 'white'
                },
            },
        },
    });
}

// Function to create the inventory table, which will be called when the page loads.
// It will create a new table with DataTable using data from booksData, then set the columns for the table and the options for the table, such as the page length.
function inventoryTable(data) {
  $("#inventoryTable").DataTable({
      data: data,
      columns: [
          { data: "title" },
          { data: "author" },
          { data: "genre" },
          { data: "year" },
          { data: "type" },
      ],
      pageLength: 10,
      lengthMenu: [10, 20, 50],
      dom: '<"top"lf>rt<"bottom"ip>',
      lengthChange: false,
      language: {
          emptyTable: "No data available in table",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          infoEmpty: "Showing 0 to 0 of 0 entries",
          infoFiltered: "(filtered from _MAX_ total entries)",
          zeroRecords: "No matching records found",
          search: "Search:",
          paginate: {
              previous: "Previous",
              next: "Next",
          },
      },
      drawCallback: function () {
          $("#inventoryTable tbody tr:odd").css({
              "background-color": "rgb(77, 134, 240)"
          });
          $("#inventoryTable thead tr").addClass("table-blue");
          // Change the color of info message
          $(".dataTables_info").css("color", "white");
      },
  });
}

// This is a function to create the table data for the inventory table, which will be called when the page loads.
// If booksData is undefined or not an array, it will log an error to the console.
function TableData() {
    if (typeof booksData !== "undefined" && Array.isArray(booksData)) {
      const inventoryData = booksData.map((book) => ({
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        type: book.type,
      }));

      inventoryTable(inventoryData);
    } else {
      console.error("booksData is not defined or not an array.");
    }
}
  

// This is the code for when the page loads, where it calls all the functions previously stated.
$(document).ready(function () {
    TableData();
  });
  $(document).ready(() => {
    const bookCardsContainer = $("#bookCardsContainer");
    const maxCards = 6;

    function renderFilteredBooks(filteredBooks) {
      filteredBooks.forEach((book) => {
        const bookCardHTML = createBookCard(book);
        bookCardsContainer.append(bookCardHTML);
      });

      if (filteredBooks.length > maxCards) {
        $("#loadMoreBtn").show();
      } else {
        $("#loadMoreBtn").hide();
      }

      initTooltips();

      $(".reserve-btn").on("click", function () {
        const card = $(this).closest(".card");
        const bookId = card.data("book-id");
        const book = filteredBooks.find((book) => book.id === bookId);

        if (book && !book.reserved) {
          $(this).text("Reserved").prop("disabled", true);
          book.reserved = true;
          console.log(`Book ${book.title} reserved.`);
        }
      });
    }

    renderFilteredBooks(booksData);

    $("#searchInput").on("input", function () {
      const searchInput = $(this).val();
      const filteredBooks = filterBookCards(searchInput);

      bookCardsContainer.empty();

      renderFilteredBooks(filteredBooks);
    });

    $("#loadMoreBtn").on("click", function () {
      const searchInput = $("#searchInput").val();
      const filteredBooks = filterBookCards(searchInput);

      const currentCount = bookCardsContainer.children().length;
      const nextBooks = filteredBooks.slice(
        currentCount,
        currentCount + maxCards
      );

      nextBooks.forEach((book) => {
        const bookCardHTML = createBookCard(book);
        bookCardsContainer.append(bookCardHTML);
      });

      if (filteredBooks.length > currentCount + maxCards) {
        $("#loadMoreBtn").show();
      } else {
        $("#loadMoreBtn").hide();
      }
    });
    reservationChart();
    reservationPieChart();
  });


// ANIMATIONS //

anime({
  targets: '.navbar',
  translateY: ['-100%', 0],
  easing: 'easeInOutSine',
  duration: 1000,
  delay: 500 
});

anime({
  targets: '.front-bg',
  opacity: [0, 1],
  easing: 'easeInOutSine',
  duration: 1000,
  delay: 1000 
});

anime({
  targets: '.book-card',
  translateY: ['100%', 0], 
  opacity: [0, 1], 
  easing: 'easeInOutSine',
  duration: 1000,
  delay: anime.stagger(100, { start: 500 }), 
});
