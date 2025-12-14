
const quotesArray = JSON.parse(localStorage.getItem('quotes')) || [];
fetchQuotesFromServer();
syncQuotes();


let selectedCategory = JSON.parse(localStorage.getItem('selectedCategory'));
console.log(selectedCategory)

const showQuoteButton = document.getElementById('newQuote');
const displayQuote = document.getElementById('quoteDisplay');

const categoryDropDown = document.getElementById('categoryFilter');

//filterQuotes();
// Function to show random quote
function showRandomQuote() {
  const randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];

  displayQuote.innerHTML = randomQuote.text;
}

// Save quote to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotesArray))
}

//Add new quote to the quoteArray and display it 
function addQuote(text, category) {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  const quoteTextElement = document.createElement('p');
  quoteTextElement.textContent = text;

  displayQuote.appendChild(quoteTextElement)

  quotesArray.push(
    {
      text,
      category
    }
  );

  localStorage.setItem('quotes', JSON.stringify(quotesArray))

  // update categories dropdown
  populateCategories();

  //clean input field after add button is clicked
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function createAddQuoteForm() {
  const form = document.createElement('form')

  // Create input for quote text
  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'ENtera new quote';

  // Create input for category
  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  // Create button to add quote
  const addButton = document.createElement('button');
  addButton.textContent = 'add Quote';

  addButton.addEventListener("click", addQuote);

  // Add input and button to the form tag
  form.appendChild(textInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  // Add form to the body
  document.body.appendChild(form);

}
// Add click event to the show new quote button
showQuoteButton.addEventListener('click', showRandomQuote);

// Export quote

function exportQuotes() {
  const jsonData = JSON.stringify(quotesArray, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url)
}

// Add event listner to the export button

const exportButton = document.getElementById('export-btn');
exportButton.addEventListener('click', exportQuotes)

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  console.log(fileReader)
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotesArray.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate category
function populateCategories() {
  const quoteCategories = [...new Set(quotesArray.map(quote => quote.category))];
  console.log(quoteCategories);

  console.log(quoteCategories)
  // populate category
  quoteCategories.forEach((category) => {
    const option = document.createElement('option');
    option.textContent = category;
    option.value = category;

    categoryDropDown.appendChild(option)
  })
}

function filterQuotes() {
  const selectedCategory = categoryDropDown.value || JSON.parse(localStorage.getItem('selectedCategory'));

  // save selected category to local storage
  localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory))

  displayQuote.innerHTML = '';
  //console.log(category)

  const filteredQuote = quotesArray.filter(quote => quote.category === selectedCategory)

  console.log(filteredQuote)
  filteredQuote.forEach((quote) => {
    const p = document.createElement('p');
    p.textContent = quote.text;

    displayQuote.appendChild(p);
  })
}

//function to eftxh quote from a mock api
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json()

    return data
  } catch (err) {
    console.log(err)
  }
}

// post quote to server
async function postQuoteToServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        category
      })
    })

    console.log('Server repsonse', response.json());
  } catch (err) {
    console.log(err.message)
  }

}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchServerQuotes();
    const localQuotes = loadLocalQuotes();

    // Conflict resolution strategy:
    // Server data ALWAYS replaces local data
    if (JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
      saveLocalQuotes(serverQuotes);
      renderQuotes(serverQuotes); // update UI
      console.log("Quotes synced with server!");
    } else {
      console.log("No changes detected");
    }
  } catch (error) {
    console.error("Sync failed:", error.message);
  }
}

function renderQuotes(quotes) {
  const container = document.getElementById("quotesContainer");
  container.innerHTML = "";

  quotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}" — ${quote.category}`;
    container.appendChild(p);
  });
}

setInterval(syncQuotes, SYNC_INTERVAL);
populateCategories()

