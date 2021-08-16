const express = require("express");
const volleyball = require("volleyball");
const postBank = require("./postBank");

const app = express();
app.use(volleyball);
app.use(express.static("public"));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${posts
          .map(
            (post) => `
      <div class='news-item'>
          <p>
          <span class="news-position">${post.id}. ▲ <a href="/posts/${post.id}">${post.title}</a></span>
          <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
      </div>`
          )
          .join("")}
      </div>
  </body>
</html>`;
  res.send(html);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    res.status(404);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel=“stylesheet” href=“/style.css” />
    </head>
    <body>
    <div class="news-list">
      <header><img src="/logo.png" />Wizard News</header>
    <class="news-item"
    <div class=“not-found”>
        <p>Page Not Found</p>
      </div>
      </div>
      </div>
    </body>
    </html>`;
    res.send(html);
  } else {
    res.send(
      `<!DOCTYPE html>
  <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
           <header><img src="/logo.png" />Wizard News</header>
        <div class="news-item">
      <p>
          <span class=""news-position>${post.id}. ▲</span>${post.title}
          <small>(by ${post.name})</small>
      </p>
    <small class="news-info">
      ${post.upvotes} upvotes | ${post.date}
    </small>
    </div>
    </body>
  </html>`
    );
  }
});

app.use(function (req, res) {
  res
    .status(404)
    .send("Sorry can't find the content you need! Please check link.");
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
