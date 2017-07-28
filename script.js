/**
 * Created by sorenbaird on 7/28/17.
 */

var matches = 0;
var guesses = 0;
var first_card_flipped = null;
var second_card_flipped = null;

//        var bg_images = ['photo1.jpg', 'photo2.jpg', 'photo4.jpg'];
//
function randomize_cards() {
    var cards = ['pair1.png', 'pair1.png', 'pair2.png', 'pair2.png', 'pair3.png', 'pair3.png', 'pair4.png', 'pair4.png', 'pair5.png', 'pair5.png', 'pair6.png', 'pair6.png', 'pair7.png', 'pair7.png', 'pair8.png', 'pair8.png', 'pair9.png', 'pair9.png'];
    var randomCards = [];
    while (cards.length > 0) {
        var i = Math.floor(Math.random() * cards.length);
        randomCards.push(cards[i]);
        cards.splice(i, 1);
    }
    for (var j = 0; j < randomCards.length; j++) {
        $('#hex' + j).attr('src','images/' + randomCards[j]);
    }
    console.log(randomCards);
}

function restart_game() {
    $('.stat-bar button').click(function(){
        $('.card').addClass('locked');
        $('.card .back img').removeClass('hidden');
        $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
        matches = 0;
        guesses = 0;
        $('.display_matches').html(matches);
        $('.display_guesses').html(guesses);
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
    }
}

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

function reset_rotate(selected_card) {
    if (selected_card.hasClass('deg-360') || selected_card.hasClass('deg-0')) {
        console.log('tile reset');
        selected_card.addClass('deg-180').removeClass('deg-360').removeClass('deg-0');
    }
}

function reset_flipped_variables() {
    first_card_flipped = null;
    second_card_flipped = null;
}

function show_rotators() {
    $(".card:not(.locked)").find('.clockwise-icon > img, .counterclockwise-icon > img').css("display", "inline-block");
    $(".no-rotate-button > img").css("display", "block");
    $(".message_prompt > h2").text("-Choose A Hex To Rotate-");
}

function choose_rotate() {
    var notClicked = true;
    $('.clockwise-icon > img').click(function() {
        if (notClicked) {
            notClicked = false;
            var currentHexFront = $(this).parent().parent().find('.front img');
            var currentHexBack = $(this).parent().parent().find('.back img');
            console.log('Rotator has been clicked');
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
                notClicked = true;
            }, 1000);
        }
    });
    $('.no-rotate-button > img').click(function() {
        $('.clockwise-icon > img').css("display", "none");
        $('.counterclockwise-icon > img').css("display", "none");
        $('.no-rotate-button > img').css("display","none");
        $('.message_prompt > h2').text('-Choose A Hex To Reveal-');
        setTimeout(reset_flipped_variables, 100);
    });
}

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

function flip_hex() {
    $('.card').click(function () {
        if ($(this).hasClass('locked')) {
            console.log('This tile is locked');
            return;
        } else if (second_card_flipped !== null) {
            console.log('Please rotate a tile first');
            return;
        }
        $(this).find('.back img').css('transition','1s');
        $(this).find(".back > img").addClass('hidden');
        $(this).addClass('locked');
        if (first_card_flipped === null) {
            first_card_flipped = this;
            $(".message_prompt > h2").text("-Choose A Second Hex To Reveal-");
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
                    updateStats();
                    setTimeout(no_match, 800);
                }
            } else {
                second_card_flipped = this;
                updateStats();
                $('.message_prompt > h2').text('-The Inventors Do Not Match-');
                setTimeout(no_match, 800);
            }
        }
    });
}

$(document).ready(function(){
    flip_hex();
    choose_rotate();
    randomize_cards();
    restart_game();
});