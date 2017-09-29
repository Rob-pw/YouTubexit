module.exports = function playerView(sources) {
  const sourceEntries = sources.map(({ url, type }) => `<source src="${url}" type="${type}">`);

  return `
    <video class="player" autoplay>
      ${sourceEntries}
    </video>
  `;
}