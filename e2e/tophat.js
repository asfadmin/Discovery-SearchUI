const tophat = document.createElement('div');
tophat.innerHTML = '<img src="/assets/NASA_comic_sans.png"> | EARTH<b>DATA</b>';
Object.assign(tophat.style, {
  height: '32px',
  paddingLeft: '20px',
  backgroundColor: '#000',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontFamily: '"Comic Relief"',
});

document.body.prepend(tophat);

document.head.insertAdjacentHTML(
  'beforeend',
  `
<style>
@import url('https://fonts.googleapis.com/css2?family=Comic+Relief:wght@400;700&display=swap');
</style>
  `,
);
