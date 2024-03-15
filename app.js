// RANDOM QUOTE API URL
const randomQuoteAPI = "https://api.quotable.io/random";

// DOM ELEMENTS SELECTION
const quoteButton = document.querySelector(".new-quote"); // Button to fetch new quote
const quotes = document.querySelector(".quotes"); // Element to display quote
const tags = document.querySelector(".tags"); // Element to display tags
const author = document.querySelector(".author"); // Element to display author
const copyIcon = document.querySelector(".copy-icon"); // Icon for copying
const iconSpan = document.querySelector(".icon"); // Span to indicate copy status

// FUNCTION TO FETCH A RANDOM QUOTE
async function fetchRandomQuote() {
  try {
    const response = await axios.get(randomQuoteAPI);
    const { content, author: quoteAuthor, tags: quoteTags } = response.data;
    return { content, quoteAuthor, quoteTags };
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
}

// FUNCTION TO DISPLAY QUOTE AND RELATED INFO
function displayQuote({ content, quoteAuthor, quoteTags }) {
  quotes.textContent = content;
  author.textContent = `Author: ${quoteAuthor}`;
  tags.textContent = `Tags: ${quoteTags.join(", ")}`;
}

// FUNCTION TO COPY QUOTE TO CLIPBOARD
function copyQuoteToClipboard() {
  navigator.clipboard.writeText(quotes.textContent);
  iconSpan.innerText = "check"; // Change icon to indicate successful copy
  if (iconSpan.innerText === "check") {
    iconSpan.title = "Quote Copied"; // Add tooltip
  }
  setTimeout(() => {
    iconSpan.innerText = "content_copy"; // Revert icon after 2 seconds
    iconSpan.title = "";
  }, 2000);
}

// EVENT LISTENERS
quoteButton.addEventListener("click", async () => {
  const quoteData = await fetchRandomQuote();
  if (quoteData) {
    displayQuote(quoteData);
    localStorage.setItem("quoteContent", quoteData.content);
    localStorage.setItem("quoteAuthor", quoteData.quoteAuthor);
    localStorage.setItem("quoteTags", quoteData.quoteTags.join(", "));
  }
});

copyIcon.addEventListener("click", copyQuoteToClipboard);

// INITIALIZATION
window.addEventListener("load", () => {
  const storedContent = localStorage.getItem("quoteContent");
  const storedAuthor = localStorage.getItem("quoteAuthor");
  const storedTags = localStorage.getItem("quoteTags");

  if (storedContent && storedAuthor && storedTags) {
    displayQuote({
      content: storedContent,
      quoteAuthor: storedAuthor,
      quoteTags: storedTags.split(", "),
    });
  } else {
    quoteButton.click(); // Fetch a new quote on page load if no stored quote is available
  }
});
