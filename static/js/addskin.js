$(document).ready(function () {
    let weaponTypeSelectEl = $("#skin-weapon-type");
    let weaponNameSelectEl = $("#skin-weapon-name");
    var weapons = JSON.parse($("#weapons").attr("data-weapons"));
    setWeaponSelectOptions(weaponTypeSelectEl.val().toLowerCase());
    $(weaponTypeSelectEl).change(function () {
        $(weaponNameSelectEl).empty();
        setWeaponSelectOptions(weaponTypeSelectEl.val().toLowerCase());
    });

    function setWeaponSelectOptions(selectVal) {
        weapons[selectVal].map((w, index) => {
            o = new Option(w, w);
            $(o).html(w);
            $(weaponNameSelectEl).append(o);
        });
    }

    var conditionEls = $('#factory_new, #min_wear, #field_tested, #well_worn, #battle_scarred');
    var imageEls = $('input[name=fnimage], input[name=mwimage], input[name=ftimage], input[name=wwimage], input[name=bsimage]');
    var checkedCount = 0;
    conditionEls.on('input', function () {
        if (this.checked == true) {
            checkedCount += 1;
        } else {
            checkedCount -= 1;
        }
        conditionEls.each(function (i) {
            if (conditionEls[i].checked) {
                $(imageEls[i]).removeAttr("disabled");
                $(imageEls[i]).removeClass("input-bg-disabled");
                $(imageEls[i]).attr("required", "required");
            } else {
                $(imageEls[i]).removeAttr("required");
                $(imageEls[i]).addClass("input-bg-disabled");
                $(imageEls[i]).attr("disabled", "disabled");
            }
        });
    });

    conditionEls.on('input', function () {
        conditionEls.not(this).prop('required', !$(this).val().length);
    });

    const myDatePicker = MCDatepicker.create({
        el: '#release-date',
        dateFormat: 'YYYY-MM-DD'
    })

    $("#weapon-skin-form").on("change", function () {
        console.log($("#weapon-skin-form").find("[name=name]").val())
    })

    $("#weapon-skin-form").submit(function (e) {
        e.preventDefault();

        if (checkedCount < 3) {
            $("#invalid-error").text("Please tick 3 conditions in order to add the skin and add atleast 3 Steam icon URLs");
            $('#invalid-error').fadeIn('slow', function () {
                $('#invalid-error').delay(2000).fadeOut();
            });
        } else {
            $("#invalid-error").addClass("d-none");
            myDatePicker.getFullDate();
            checkSkinInsert($(this))
        }
        var data = $(this).serializeArray();
    })

});

function checkSkinInsert(thisObj) {
    var skinName = thisObj.find("[name=name]").val()
    fetch("/get/skin", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                name: skinName
            })
        }).then(res => res.text())
        .then(data => {
            if (data == "False") {
                insertSkin(thisObj)
            } else {
                alert("Sorry this couldn't be added as a search was made and this skin has already been added.")
            }
        })

        .catch(err => console.log(err))
}



function insertSkin(thisObj) {

    var rarity = thisObj.find("[name=rarity]").val();
    var rariryPrecedence = rarity == "Contraband" ? 6 :
        rarity == "Covert" ? 5 :
        rarity == "Classified" ? 4 :
        rarity == "Restricted" ? 3 :
        rarity == "Mil-Spec Grade" ? 2 :
        rarity == "Industrial Grade" ? 1 :
        "Consumer Grade"

    fetch("/insert/weapon", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                name: thisObj.find("[name=name]").val(),
                skin_description: thisObj.find("[name=skin_description]").val(),
                type: thisObj.find("[name=type]").val(),
                weapon_type: thisObj.find("[name=weapon_type]").val(),
                weapon_name: thisObj.find("[name=weapon_name]").val(),
                rarity: rarity,
                rarity_precedence: rariryPrecedence,
                souvenir_available: thisObj.find("[name=stat_or_souv]").val() == "Souvenir" ? true : false,
                stattrak_available: thisObj.find("[name=stat_or_souv]").val() == "StatTrak" ? true : false,
                statrak_conditions: {
                    factory_new: thisObj.find("[name=factory_new]").checked == true ? true : false,
                    min_wear: thisObj.find("[name=min_wear]").checked == true ? true : false,
                    field_tested: thisObj.find("[name=field_tested]").checked == true ? true : false,
                    well_worn: thisObj.find("[name=well_worn]").checked == true ? true : false,
                    battle_scarred: thisObj.find("[name=battle_scarred]").checked == true ? true : false
                },
                conditions: {
                    factory_new: thisObj.find("[name=factory_new]").checked == true ? true : false,
                    min_wear: thisObj.find("[name=min_wear]").checked == true ? true : false,
                    field_tested: thisObj.find("[name=field_tested]").checked == true ? true : false,
                    well_worn: thisObj.find("[name=well_worn]").checked == true ? true : false,
                    battle_scarred: thisObj.find("[name=battle_scarred]").checked == true ? true : false
                },
                image_urls: {
                    factory_new: thisObj.find('input[name=fnimage]').val() == "" ? null : "https://community.cloudflare.steamstatic.com/economy/image/" + thisObj.find('input[name=fnimage]').val(),
                    min_wear: thisObj.find('input[name=mwimage]').val() == "" ? null : "https://community.cloudflare.steamstatic.com/economy/image/" + thisObj.find('input[name=mwimage]').val(),
                    field_tested: thisObj.find('input[name=ftimage]').val() == "" ? null : "https://community.cloudflare.steamstatic.com/economy/image/" + thisObj.find('input[name=ftimage]').val(),
                    well_worn: thisObj.find('input[name=wwimage]').val() == "" ? null : "https://community.cloudflare.steamstatic.com/economy/image/" + thisObj.find('input[name=wwimage]').val(),
                    battle_scarred: thisObj.find('input[name=bsimage]').val() == "" ? null : "https://community.cloudflare.steamstatic.com/economy/image/" + thisObj.find('input[name=bsimage]').val()
                },
                up_votes: 0,
                down_votes: 0
            })
        }).then(res => {
            var formSubmitted = thisObj;
            formSubmitted.prev(`<h4 class='text-center bg-success p-3'>The ${thisObj.find("[name=name]").val()} has been succesfully added }}'</h4><button class='btn btn-orange'>Add Another</button>`)
            formSubmitted.remove();

        })
        .catch(err => console.log(err))
}