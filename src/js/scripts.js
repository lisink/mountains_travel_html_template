$('.journal-grid').masonry({
  itemSelector: '.journal-item',
  columnWidth: 380
});

$('.gallery-grid').masonry({
  itemSelector: '.gallery__tile',
  columnWidth: 68,
  gutter: 30,
  originLeft: true
});