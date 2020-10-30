if (this.window.innerWidth < 769) {
  $(".intro").slideUp(5000);
}

const localhost = "http://localhost:3000/";
const foreignhost = "http://tonteitweetdemo.herokuapp.com/";
const tweetButton = $(".tweet-button");

function addRowData(name, tweet) {
  return `<tr class='col-lg-4'><td class='full-tweet'><div class='tweet-writer'><span>${name}</span></div><div class='tweet-text'><span>${tweet}</span></div></td></tr>`;
}

function addRow(table, row) {
  return table.prepend(row);
}

function loadTweets() {
  const table = $(".tweet-table");

  fetch(`${localhost}getTweets`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach(function (element) {
        addRow(table, addRowData(element.writer, element.tweet));
      });
    });
}

function addTweet() {
  const table = $(".tweet-table");
  const tweetQuery = $("#tweet");
  const tweetValue = tweetQuery.val().replace(/</g, "&lt").replace(/>/g, "&gt");
  tweetQuery.val("");
  const obj = { tweet: tweetValue };

  fetch(`${localhost}home`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((data) => addRow(table, addRowData(data.writer, data.tweet)));
}

tweetButton.on("click", function () {
  addTweet();
});

$(loadTweets());
