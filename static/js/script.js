$(".like-btn").on("click", function (e) {
    e.preventDefault();
    if ($(this).attr("already-liked")) {
        unlike($(this));
    } else {
        if (!$(this).next().attr("disliked")) {
            like($(this))
        } else {
            undislike($(this))
            like($(this))
        }
    }
});


$(".dislike-btn").on("click", function (e) {
    e.preventDefault();
    if ($(this).attr("disliked")) {
        undislike($(this))
    } else {
        if (!$(this).prev().attr("already-liked")) {
            dislike($(this))
        } else {
            unlike($(this));
            dislike($(this))
        }
    }
});


function like(thisObj) {
    fetch("/api/like-skin", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                _id: thisObj[0].id,
                "collection": thisObj.attr("data-collection")
            })
        }).then(res => {
            let currentUpVotes = parseInt(thisObj.parent().find("#up_votes").text());
            currentUpVotes++;
            thisObj.parent().find("#up_votes").text(currentUpVotes)
            thisObj.attr("already-liked", true)
        })
        .catch(err => console.log(err))
}

function unlike(thisObj) {
    fetch("/api/unlike-skin", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                _id: thisObj[0].id,
                "collection": thisObj.attr("data-collection")
            })
        }).then(res => {
            let currentUpVotes = parseInt(thisObj.parent().find("#up_votes").text());
            currentUpVotes--;
            thisObj.parent().find("#up_votes").text(currentUpVotes)
            thisObj.parent().find(".like-btn").removeAttr("already-liked")
        })
        .catch(err => console.log(err))
}

function dislike(thisObj) {
    fetch("/api/dislike-skin", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                _id: thisObj[0].id,
                "collection": thisObj.attr("data-collection")
            })
        }).then(res => {
            let currentDownVotes = parseInt(thisObj.parent().find("#down_votes").text());
            currentDownVotes++;
            thisObj.find("strong").text(currentDownVotes)
            thisObj.attr("disliked", true)
        })
        .catch(err => console.log(err))
}

function undislike(thisObj) {
    fetch("/api/undislike-skin", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                _id: thisObj[0].id,
                "collection": thisObj.attr("data-collection")
            })
        }).then(res => {
            let currentDownVotes = parseInt(thisObj.parent().find("#down_votes").text());
            currentDownVotes--;
            thisObj.parent().find("#down_votes").text(currentDownVotes)
            thisObj.parent().find(".dislike-btn").removeAttr("disliked")
        })
        .catch(err => console.log(err))
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

$('.slider').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: false,
                arrows: false
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                arrows: false
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                arrows: false
            }
        }
    ]
});

var btn = $('#btt');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.removeClass('d-none');
  } else {
    btn.addClass('d-none');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '500');
});

$("#copyright").text(new Date().getFullYear())