if (this.window.innerWidth < 769) {
  $(".intro").slideUp(5000);
}

const tweetButton = $(".tweet-button");


function addRowData(name, tweet) {
  return `<tr class='col-lg-4'><td class='full-tweet'><div class='tweet-writer'><span>${name}</span></div><div class='tweet-text'><span>${tweet}</span></div></td></tr>`;
}


function addRow(table, row) {
  return table.prepend(row);
}


function loadTweets() {
  const table = $(".tweet-table");

  fetch("http://tonteitweetdemo.herokuapp.com/getTweets")
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
  const tweetValue = tweetQuery.val();
  tweetQuery.val("");
  const obj = { tweet: tweetValue };

  if (tweetValue.includes("<")) {
    alert("injections are not allowed");
  } else {
    fetch("http://tonteitweetdemo.herokuapp.com/home", {
    headers: {
      "Content-type" : "application/json"
    },
    method: "POST",
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(data => addRow(table, addRowData(data.writer, data.tweet)));
  }

  
}




tweetButton.on("click", function() {
  addTweet();
});

$(
  loadTweets()
)
