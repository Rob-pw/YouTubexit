module.exports = function indexView(title) {
  return `
    <html>
      <head>
        <title>Herein is my ${title} page</title>
      </head>
      <body>
        <div id="app">
          ${this.layout.content}
        </div>
      </body>
    </html>
  `;
}