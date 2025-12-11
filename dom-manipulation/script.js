const quotesArray = [
  {
    text: "Success is the sum of small efforts repeated day in and day out",
    category: "Motivation"
  },
  {
    text: "Your mind is your greatest power—train it well.",
    category: "Mindset"
  }, 
  {
    text: "Become 1% better every single day.",
    category: "Self-improvement"
  }
]

const showQuoteButton = document.getElementById('newQuote');
const displayQuote = document.getElementById('quoteDisplay');

// Function to show random quote
function showRandomQuote() {
 const randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];

  displayQuote.innerHTML = randomQuote.text;
}

//Add new quote to the quoteArray and display it 
function addQuote() {
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

  //clean input field after add button is clicked
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Add click event to the show new quote button
showQuoteButton.addEventListener('click', showRandomQuote)