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

function unlike(thisObj){

}

function dislike(thisObj){
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