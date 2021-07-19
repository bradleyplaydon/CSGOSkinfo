$(".like-btn").on("click", function (e) {
    e.preventDefault();
    if (!$(this).attr("already-liked")) {
        like($(this));
    } else {
        unlike($(this));
    }
});


$(".dislike-btn").on("click", function (e) {
    e.preventDefault();
    if ($(this).attr("already-liked")) {
        unlike($(this));
        dislike($(this));
    } else {
        dislike($(this));
    }
});


function like(thisObj){

}

function unlike(thisObj){

}

function dislike(thisObj){

}

function undislike(thisObj){

}


$('.most-popular').slick({
    autoplay: true,
    autoplaySpeed: 1800,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1
});


$("#copyright").text(new Date().getFullYear())