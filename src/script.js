// import $ from 'jquery';

let matches = 0;
let guesses = 0;
let gamesPlayed = 0;
let firstCardFlipped = null;
let secondCardFlipped = null;

const cardImgs = {
  pair1: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717898/inventory-memory-match/pair1.png',
  pair2: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717903/inventory-memory-match/pair2.png',
  pair3: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717901/inventory-memory-match/pair3.png',
  pair4: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717906/inventory-memory-match/pair4.png',
  pair5: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717902/inventory-memory-match/pair5.png',
  pair6: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717908/inventory-memory-match/pair6.png',
  pair7: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717906/inventory-memory-match/pair7.png',
  pair8: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717915/inventory-memory-match/pair8.png',
  pair9: 'http://res.cloudinary.com/sorebear/image/upload/c_scale,w_150/v1520717914/inventory-memory-match/pair9.png',
};

// Function to Shuffle Hex Cards Upon Init and Game Reset
function randomizeCards() {
  const cards = ['pair1', 'pair1', 'pair2', 'pair2', 'pair3', 'pair3',
    'pair4', 'pair4', 'pair5', 'pair5', 'pair6', 'pair6', 'pair7',
    'pair7', 'pair8', 'pair8', 'pair9', 'pair9'];
  const randomCards = [];
  while (cards.length > 0) {
    const i = Math.floor(Math.random() * cards.length);
    randomCards.push(cards[i]);
    cards.splice(i, 1);
  }
  for (let j = 0; j < randomCards.length; j += 1) {
    $(`#hex${j}`).attr('src', cardImgs[randomCards[j]]);
  }
}

// This function adds a subtle animation whenever the bottom display message is changed
function animateDisplayMessage() {
  setTimeout(() => {
    $('.message_prompt > h2').addClass('highlightAnimation');
  }, 100);

  setTimeout(() => {
    $('.message_prompt > h2').removeClass('highlightAnimation');
  }, 400);
}

// This function fired after every guess to update stats and check if win conditions are met
function updateStats() {
  guesses += 1;
  $('.display_matches').html(matches);
  $('.display_guesses').html(guesses);
  if (matches > 0) {
    $('.display_accuracy').html(`${Math.floor((matches / guesses) * 100)}%`);
  }
  if (matches >= 9) {
    $('.no-rotate-button > img').css('display', 'none');
    $('.message_prompt > h2').text('-YOU WIN!-');
    animateDisplayMessage();
  }
}

// Remove the current rotation class and add the next rotation class moving clockwise
function rotateHexClockwise(selectedCard) {
  selectedCard.css('transition', '1s');
  if (selectedCard.hasClass('deg-60')) {
    selectedCard.addClass('deg-120').removeClass('deg-60');
  } else if (selectedCard.hasClass('deg-120')) {
    selectedCard.addClass('deg-180').removeClass('deg-120');
  } else if (selectedCard.hasClass('deg-180')) {
    selectedCard.addClass('deg-240').removeClass('deg-180');
  } else if (selectedCard.hasClass('deg-240')) {
    selectedCard.addClass('deg-300').removeClass('deg-240');
  } else if (selectedCard.hasClass('deg-300')) {
    selectedCard.addClass('deg-360').removeClass('deg-300');
  }
  setTimeout(() => { selectedCard.css('transition', '0s'); }, 1000);
}

// Remove the current rotation class and add the next rotation class moving counter-clockwise
function rotateHexCounterClockwise(selectedCard) {
  selectedCard.css('transition', '1s');
  if (selectedCard.hasClass('deg-60')) {
    selectedCard.addClass('deg-0').removeClass('deg-60');
  } else if (selectedCard.hasClass('deg-120')) {
    selectedCard.addClass('deg-60').removeClass('deg-120');
  } else if (selectedCard.hasClass('deg-180')) {
    selectedCard.addClass('deg-120').removeClass('deg-180');
  } else if (selectedCard.hasClass('deg-240')) {
    selectedCard.addClass('deg-180').removeClass('deg-240');
  } else if (selectedCard.hasClass('deg-300')) {
    selectedCard.addClass('deg-240').removeClass('deg-300');
  }
  setTimeout(() => { selectedCard.css('transition', '0s'); }, 1000);
}

// Rest the rotation from 360 or 0 to 180. This helps manage infite rotation in one direction
function resetRotate(selectedCard) {
  if (selectedCard.hasClass('deg-360') || selectedCard.hasClass('deg-0')) {
    selectedCard.addClass('deg-180').removeClass('deg-360').removeClass('deg-0');
  }
}

// When the two cards from a guess do not match, they will flip back over
function resetFlippedVariables() {
  firstCardFlipped = null;
  secondCardFlipped = null;
}

// When a user makes a successful match, they have the choice of rotating a remaining card
// This function displays the buttons for rotating on all remaining cards
function showRotators() {
  $('.card:not(.locked)').find('.clockwise-icon > img, .counterclockwise-icon > img').css('display', 'inline-block');
  $('.no-rotate-button > img').css('display', 'block');
  $('.message_prompt > h2').text('-Choose A Hex To Rotate-');
  animateDisplayMessage();
}

// Handles rotation of the player's chosen hex, then hides all of the rotation buttons
function chooseRotate() {
  let notClicked = true;
  $('.clockwise-icon > img').click((e) => {
    if (notClicked) {
      notClicked = false;
      const currentHexFront = $(e.currentTarget).parent().parent().find('.front img');
      const currentHexBack = $(e.currentTarget).parent().parent().find('.back img');
      $('.clockwise-icon > img').css('display', 'none');
      $('.counterclockwise-icon > img').css('display', 'none');
      $('.no-rotate-button > img').css('display', 'none');
      rotateHexClockwise(currentHexFront);
      rotateHexClockwise(currentHexBack);
      setTimeout(() => {
        resetRotate(currentHexFront);
        resetRotate(currentHexBack);
        resetFlippedVariables();
        $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
        animateDisplayMessage();
        notClicked = true;
      }, 1000);
    }
  });
  $('.counterclockwise-icon > img').click((e) => {
    if (notClicked) {
      notClicked = false;
      const currentHexFront = $(e.currentTarget).parent().parent().find('.front img');
      const currentHexBack = $(e.currentTarget).parent().parent().find('.back img');
      $('.clockwise-icon > img').css('display', 'none');
      $('.counterclockwise-icon > img').css('display', 'none');
      $('.no-rotate-button > img').css('display', 'none');
      rotateHexCounterClockwise(currentHexFront);
      rotateHexCounterClockwise(currentHexBack);
      setTimeout(() => {
        resetRotate(currentHexFront);
        resetRotate(currentHexBack);
        resetFlippedVariables();
        $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
        animateDisplayMessage();
        notClicked = true;
      }, 1000);
    }
  });
  $('.no-rotate-button > img').click(() => {
    $('.clockwise-icon > img').css('display', 'none');
    $('.counterclockwise-icon > img').css('display', 'none');
    $('.no-rotate-button > img').css('display', 'none');
    $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
    animateDisplayMessage();
    setTimeout(resetFlippedVariables, 100);
  });
}

// When a player does not get a match, the card hex is flipped back and is rotated
function noMatch() {
  $(firstCardFlipped).find('.back img').removeClass('hidden');
  $(firstCardFlipped).removeClass('locked');
  $(secondCardFlipped).find('.back img').removeClass('hidden');
  $(secondCardFlipped).removeClass('locked');
  rotateHexClockwise($(firstCardFlipped).find('.back img'));
  rotateHexClockwise($(firstCardFlipped).find('.front img'));
  rotateHexCounterClockwise($(secondCardFlipped).find('.back img'));
  rotateHexCounterClockwise($(secondCardFlipped).find('.front img'));
  setTimeout(() => {
    resetRotate($(secondCardFlipped).find('.back img'));
    resetRotate($(secondCardFlipped).find('.front img'));
    resetRotate($(firstCardFlipped).find('.back img'));
    resetRotate($(firstCardFlipped).find('.front img'));
    resetFlippedVariables();
  }, 1000);
}

// A function that fires whenever the user clicks on a hex card
// If it's the second card flipped it then evaluated if it is a match in picture and orientation
function handleFirstFlippedHex(e) {
  firstCardFlipped = e.currentTarget;
  $('.message_prompt > h2').text('-Choose A Second Hex To Reveal-');
  animateDisplayMessage();
}

function handleSecondFlippedHex(e) {
  if ($(firstCardFlipped).find('.front img').attr('src') === $(e.currentTarget).find('.front img').attr('src')) {
    secondCardFlipped = e.currentTarget;
    if (($(firstCardFlipped).find('.front img').hasClass('deg-180') && $(secondCardFlipped).find('.front img').hasClass('deg-180')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-60') && $(secondCardFlipped).find('.front img').hasClass('deg-60')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-60') && $(secondCardFlipped).find('.front img').hasClass('deg-240')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-120') && $(secondCardFlipped).find('.front img').hasClass('deg-120')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-120') && $(secondCardFlipped).find('.front img').hasClass('deg-300')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-240') && $(secondCardFlipped).find('.front img').hasClass('deg-240')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-240') && $(secondCardFlipped).find('.front img').hasClass('deg-60')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-300') && $(secondCardFlipped).find('.front img').hasClass('deg-300')) ||
      ($(firstCardFlipped).find('.front img').hasClass('deg-300') && $(secondCardFlipped).find('.front img').hasClass('deg-120'))
    ) {
      matches += 1;
      updateStats();
      if (matches < 9) {
        showRotators();
      }
    } else {
      $('.message_prompt > h2').text('-The Orientations Do Not Match-');
      animateDisplayMessage();
      updateStats();
      setTimeout(noMatch, 800);
    }
  } else {
    secondCardFlipped = e.currentTarget;
    updateStats();
    $('.message_prompt > h2').text('-The Inventors Do Not Match-');
    animateDisplayMessage();
    setTimeout(noMatch, 800);
  }
}

function flipHex() {
  $('.card').click((e) => {
    if ($(e.currentTarget).hasClass('locked')) {
      return;
    } else if (secondCardFlipped !== null) {
      return;
    }
    $(e.currentTarget).find('.back img').css('transition', '1s');
    $(e.currentTarget).find('.back > img').addClass('hidden');
    $(e.currentTarget).addClass('locked');
    if (firstCardFlipped === null) {
      handleFirstFlippedHex(e);
    } else {
      handleSecondFlippedHex(e);
    }
  });
}

// Function to Reset the Game
function restartGame(e) {
  $('.stat-bar button').click(() => {
    $('.card').addClass('locked');
    $('.card .back img').removeClass('hidden');
    $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
    animateDisplayMessage(e);
    matches = 0;
    guesses = 0;
    gamesPlayed += 1;
    $('.display_matches').html(matches);
    $('.display_guesses').html(guesses);
    $('.display_games_played').html(gamesPlayed);
    $('.display_accuracy').html('--');
    $('.clockwise-icon > img').css('display', 'none');
    $('.counterclockwise-icon > img').css('display', 'none');
    $('.no-rotate-button > img').css('display', 'none');
    resetFlippedVariables();
    setTimeout(() => {
      $('.hexagon').css('transition', '1s').addClass('deg-180').removeClass('deg-0 deg-60 deg-120 deg-240 deg-300 deg-360');
      randomizeCards();
      $('.card').removeClass('locked');
    }, 1000);
  });
}

$(document).ready(() => {
  flipHex();
  chooseRotate();
  randomizeCards();
  restartGame();
});
