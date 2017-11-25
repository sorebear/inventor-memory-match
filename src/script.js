var matches = 0;
var guesses = 0;
var games_played = 0;
var first_card_flipped = null;
var second_card_flipped = null;

//Function to Shuffle Hex Cards Upon Init and Game Reset
function randomize_cards() {
    var cards = ['pair1.png', 'pair1.png', 'pair2.png', 'pair2.png', 'pair3.png', 'pair3.png', 'pair4.png', 'pair4.png', 'pair5.png', 'pair5.png', 'pair6.png', 'pair6.png', 'pair7.png', 'pair7.png', 'pair8.png', 'pair8.png', 'pair9.png', 'pair9.png'];
    var randomCards = [];
    while (cards.length > 0) {
        var i = Math.floor(Math.random() * cards.length);
        randomCards.push(cards[i]);
        cards.splice(i, 1);
    }
    for (var j = 0; j < randomCards.length; j++) {
        $('#hex' + j).attr('src','dist/images/' + randomCards[j]);
    }
}

//Function to Reset the Game
function restart_game(e) {
    $('.stat-bar button').click(function(){
        $('.card').addClass('locked');
        $('.card .back img').removeClass('hidden');
        $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
        animateDisplayMessage(e);
        matches = 0;
        guesses = 0;
        games_played += 1;
        $('.display_matches').html(matches);
        $('.display_guesses').html(guesses);
        $('.display_games_played').html(games_played);
        $('.display_accuracy').html("--");
        $('.clockwise-icon > img').css("display", "none");
        $('.counterclockwise-icon > img').css("display", "none");
        $('.no-rotate-button > img').css("display","none");
        reset_flipped_variables();
        setTimeout(function() {
            $('.hexagon').css('transition','1s').addClass('deg-180').removeClass('deg-0 deg-60 deg-120 deg-240 deg-300 deg-360');
            randomize_cards();
            $('.card').removeClass('locked');
        }, 1000);
    });
}

//This function fired after every guess to update stats and check if win conditions are met
function updateStats() {
    guesses++;
    $('.display_matches').html(matches);
    $('.display_guesses').html(guesses);
    if (matches > 0) {
        $('.display_accuracy').html(Math.floor(matches / guesses * 100) + "%");
    }
    if (matches >= 9) {
        $('.no-rotate-button > img').css("display","none");
        $('.message_prompt > h2').text('-YOU WIN!-');
        animateDisplayMessage();
    }
}

//This function removes the current rotation class and adds the next rotation class moving clockwise
function rotate_hex_clockwise(selected_card) {
    selected_card.css('transition','1s');
    if (selected_card.hasClass('deg-60')) {
        selected_card.addClass('deg-120').removeClass('deg-60');
    }
    else if (selected_card.hasClass('deg-120')) {
        selected_card.addClass('deg-180').removeClass('deg-120');
    }
    else if (selected_card.hasClass('deg-180')) {
        selected_card.addClass('deg-240').removeClass('deg-180');
    }
    else if (selected_card.hasClass('deg-240')) {
        selected_card.addClass('deg-300').removeClass('deg-240');
    }
    else if (selected_card.hasClass('deg-300')) {
        selected_card.addClass('deg-360').removeClass('deg-300');
    }
    setTimeout(function(){selected_card.css('transition','0s')},1000);
}

//This function removes the current rotation class and adds the next rotation class moving counter-clockwise
function rotate_hex_counterclockwise(selected_card) {
    selected_card.css('transition','1s');
    if (selected_card.hasClass('deg-60')) {
        selected_card.addClass('deg-0').removeClass('deg-60');
    }
    else if (selected_card.hasClass('deg-120')) {
        selected_card.addClass('deg-60').removeClass('deg-120');
    }
    else if (selected_card.hasClass('deg-180')) {
        selected_card.addClass('deg-120').removeClass('deg-180');
    }
    else if (selected_card.hasClass('deg-240')) {
        selected_card.addClass('deg-180').removeClass('deg-240');
    }
    else if (selected_card.hasClass('deg-300')) {
        selected_card.addClass('deg-240').removeClass('deg-300');
    }
    setTimeout(function(){selected_card.css('transition','0s');},1000);
}

//This function resets the rotation from 360 or 0 to 180. This helps manage infite rotation in one direction
function reset_rotate(selected_card) {
    if (selected_card.hasClass('deg-360') || selected_card.hasClass('deg-0')) {
        // console.log('tile reset');
        selected_card.addClass('deg-180').removeClass('deg-360').removeClass('deg-0');
    }
}

//When the two cards from a guess do not match, they will flip back over
function reset_flipped_variables() {
    first_card_flipped = null;
    second_card_flipped = null;
}

//When a user makes a successful match, they have the choice of rotating a remaining card
//This function displays the buttons for rotating on all remaining cards
function show_rotators() {
    $(".card:not(.locked)").find('.clockwise-icon > img, .counterclockwise-icon > img').css("display", "inline-block");
    $(".no-rotate-button > img").css("display", "block");
    $(".message_prompt > h2").text("-Choose A Hex To Rotate-");
    animateDisplayMessage();
}

//This function handles rotating the hex card of the player's choosing, then hides all of the rotation buttons
function choose_rotate() {
    var notClicked = true;
    $('.clockwise-icon > img').click(function() {
        if (notClicked) {
            notClicked = false;
            var currentHexFront = $(this).parent().parent().find('.front img');
            var currentHexBack = $(this).parent().parent().find('.back img');
            // console.log('Rotator has been clicked');
            $('.clockwise-icon > img').css("display", "none");
            $('.counterclockwise-icon > img').css("display", "none");
            $('.no-rotate-button > img').css("display","none");
            rotate_hex_clockwise(currentHexFront);
            rotate_hex_clockwise(currentHexBack);
            setTimeout(function() {
                reset_rotate(currentHexFront);
                reset_rotate(currentHexBack);
                reset_flipped_variables();
                $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
                animateDisplayMessage();
                notClicked = true;
            }, 1000);
        }
    });
    $('.counterclockwise-icon > img').click(function() {
        if (notClicked) {
            notClicked = false;
            var currentHexFront = $(this).parent().parent().find('.front img');
            var currentHexBack = $(this).parent().parent().find('.back img');
            $('.clockwise-icon > img').css("display", "none");
            $('.counterclockwise-icon > img').css("display", "none");
            $('.no-rotate-button > img').css("display","none");
            rotate_hex_counterclockwise(currentHexFront);
            rotate_hex_counterclockwise(currentHexBack);
            setTimeout(function() {
                reset_rotate(currentHexFront);
                reset_rotate(currentHexBack);
                reset_flipped_variables();
                $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
                animateDisplayMessage();
                notClicked = true;
            }, 1000);
        }
    });
    $('.no-rotate-button > img').click(function() {
        $('.clockwise-icon > img').css("display", "none");
        $('.counterclockwise-icon > img').css("display", "none");
        $('.no-rotate-button > img').css("display","none");
        $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
        animateDisplayMessage();
        setTimeout(reset_flipped_variables, 100);
    });
}

//When a player does not get a match, the card hex is flipped back and is rotated
function no_match() {
    $(first_card_flipped).find('.back img').removeClass('hidden');
    $(first_card_flipped).removeClass('locked');
    $(second_card_flipped).find('.back img').removeClass('hidden');
    $(second_card_flipped).removeClass('locked');
    rotate_hex_clockwise($(first_card_flipped).find('.back img'));
    rotate_hex_clockwise($(first_card_flipped).find('.front img'));
    rotate_hex_counterclockwise($(second_card_flipped).find('.back img'));
    rotate_hex_counterclockwise($(second_card_flipped).find('.front img'));
    setTimeout(function() {
        reset_rotate($(second_card_flipped).find('.back img'));
        reset_rotate($(second_card_flipped).find('.front img'));
        reset_rotate($(first_card_flipped).find('.back img'));
        reset_rotate($(first_card_flipped).find('.front img'));
        reset_flipped_variables();
    }, 1000);
}

//A function that fires whenever the user clicks on a hex card
//If it's the second card flipped it then evaluated if it is a match in picture and orientation
function flip_hex() {
    $('.card').click(function () {
        if ($(this).hasClass('locked')) {
            // console.log('This tile is locked');
            return;
        } else if (second_card_flipped !== null) {
            // console.log('Please rotate a tile first');
            return;
        }
        $(this).find('.back img').css('transition','1s');
        $(this).find(".back > img").addClass('hidden');
        $(this).addClass('locked');
        if (first_card_flipped === null) {
            first_card_flipped = this;
            $(".message_prompt > h2").text("-Choose A Second Hex To Reveal-");
            animateDisplayMessage();
        }
        else {
            if ($(first_card_flipped).find('.front img').attr('src') === $(this).find('.front img').attr('src')) {
                second_card_flipped = this;
                if (($(first_card_flipped).find('.front img').hasClass('deg-180') && $(second_card_flipped).find('.front img').hasClass('deg-180')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-60') && $(second_card_flipped).find('.front img').hasClass('deg-60')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-60') && $(second_card_flipped).find('.front img').hasClass('deg-240')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-120') && $(second_card_flipped).find('.front img').hasClass('deg-120')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-120') && $(second_card_flipped).find('.front img').hasClass('deg-300')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-240') && $(second_card_flipped).find('.front img').hasClass('deg-240')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-240') && $(second_card_flipped).find('.front img').hasClass('deg-60')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-300') && $(second_card_flipped).find('.front img').hasClass('deg-300')) ||
                    ($(first_card_flipped).find('.front img').hasClass('deg-300') && $(second_card_flipped).find('.front img').hasClass('deg-120'))
                ) {
                    matches++;
                    updateStats();
                    if (matches < 9) {
                        show_rotators();
                    }
                } else {
                    $('.message_prompt > h2').text('-The Orientations Do Not Match-');
                    animateDisplayMessage();
                    updateStats();
                    setTimeout(no_match, 800);
                }
            } else {
                second_card_flipped = this;
                updateStats();
                $('.message_prompt > h2').text('-The Inventors Do Not Match-');
                animateDisplayMessage();
                setTimeout(no_match, 800);
            }
        }
    });
}

//This function adds a subtle animation whenever the bottom display message is changed
function animateDisplayMessage() {
    setTimeout(function() {
        $('.message_prompt > h2').addClass('highlightAnimation');
    }, 100);

    setTimeout(function() {
        $('.message_prompt > h2').removeClass('highlightAnimation');
    }, 400);
}

//The Document Ready function to assign all event listeners and run the initial randomize cards function
$(document).ready(function(){
    flip_hex();
    choose_rotate();
    randomize_cards();
    restart_game();
});