$(document).ready(function () {


  function createBookCard(book) {
    const isReserved = book.reserved || false;

    return `
        <div class="col-md-4 mb-4">
          <div class="card" data-book-id="${book.id
      }" data-bs-toggle="modal" data-bs-target="#bookModal">
            <img src="${book.image}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text">Author: ${book.author}</p>
              <button class="btn btn-peach btn-block reserve-btn" type="button" ${isReserved ? "disabled" : ""
      }>
                ${isReserved ? "Reserved" : "Reserve"}
              </button>
            </div>
          </div>
        </div>
      `;
  }

  


  function initTooltips() {
    tippy(".card", {
      content: "Loading...",
      onShow(instance) {
        const bookId = $(instance.reference).data("book-id");
        const book = booksData.find((book) => book.id === bookId);

        if (book) {
          const title = $("<strong>").text(book.title);
          const author = $("<p>").text("Author: " + book.author);
          const genre = $("<p>").text("Genre: " + book.genre);
          const year = $("<p>").text("Year: " + book.year);
          const type = $("<p>").text("Type: " + book.type);

          const desc = $("<p>").text("Description: " + book.description);

          const content = $("<div>").append(title, author, genre, year, type, desc)[0];
          instance.setContent(content);

          $(instance.reference).on("click", () => {
            $("#modalBody").html(content);
          });
        } else {
          instance.setContent("Book information is not available...");
        }
      },
    });
  }

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


  function reservationChartData() {
    const genres = [...new Set(booksData.map((book) => book.genre))];

    const genreColors = {
      "Self-Improvement": "rgba(255, 99, 132, 0.8)",         // Red
      "Trivia": "rgba(54, 162, 235, 0.8)",                   // Blue
      "Biography": "rgba(255, 206, 86, 0.8)",                // Yellow
      "Classic": "rgba(255, 159, 64, 0.8)",                  // Orange
      "Thriller": "rgba(255, 192, 203, 0.8)",           // Pink
      "Fantasy": "rgba(75, 192, 192, 0.8)",                  // Teal
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
          backgroundColor: genres.map((genre) => genreColors[genre] || "rgba(0, 0, 0, 0.8)"),
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    return data;
  }

  function reservationChart() {
    const ctx = document.getElementById("reservationChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: reservationChartData(),
      options: {
        scales: {
          x: { title: { display: true, text: "Genre" } },
          y: { title: { display: true, text: "Number of Books" } },
        },
      },
    });
  }

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
        // Apply background color to odd rows after table is drawn
        $("#inventoryTable tbody tr:odd").css("background-color", "rgb(180, 0, 255)", "color", "white");
        // Add a class to the title row for custom styling
        $("#inventoryTable thead tr").addClass("table-violet");
      },
    });
  }
  // Function to fetch and format data from booksData.js
  function fetchAndFormatInventoryData() {
    // Assuming booksData.js is included before app.js
    if (typeof booksData !== "undefined" && Array.isArray(booksData)) {
      // Format the data to match the DataTable structure
      const inventoryData = booksData.map((book) => ({
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        type: book.type,
      }));

      // Call the function to initialize the DataTable with inventoryData
      inventoryTable(inventoryData);
    } else {
      console.error("booksData is not defined or not an array.");
    }
  }
  $(document).ready(function () {
    fetchAndFormatInventoryData();
  });
  $(document).ready(() => {
    const bookCardsContainer = $("#bookCardsContainer");
    const maxCards = 6;

    function renderFilteredBooks(filteredBooks) {
      // Render book cards
      filteredBooks.forEach((book) => {
        const bookCardHTML = createBookCard(book);
        bookCardsContainer.append(bookCardHTML);
      });

      // Hide or show load more button based on total books
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
  });


  new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,

  });



});