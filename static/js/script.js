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
            thisObj.find("strong").text(thisObj.find("strong").val() + 1)
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
            thisObj.find("strong").text(thisObj.find("strong").val() + 1)
            thisObj.attr("already-liked", true)
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
        }).then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

function undislike(thisObj) {

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