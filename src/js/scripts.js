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

$('a').click(function (event) {
  if (this.getAttribute('href') == "#")
    event.preventDefault();
});

$('.companies-list').slick({
  infinite: true,
  slidesToShow: 6,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 1000,
  arrows: false
});

$('.testimonials-list').slick({
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
  speed: 1000,
  cssEase: 'ease-in-out',
});