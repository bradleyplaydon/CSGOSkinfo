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
        if (checkedCount < 3) {
            $("#invalid-error").text("Please tick 3 conditions in order to add the skin and add images");
            $("#invalid-error").addClass("d-block");
        } else {
            $("#invalid-error").addClass("d-none");
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
        dateFormat: 'YYYY-MM-DD', 
    })

    $("#weapon-skin-form").on("change", function(){
        console.log($("#weapon-skin-form").find("[name=name]").val())
    })

    $("#weapon-skin-form").submit(function (e) {
        e.preventDefault();
        var data = $(this).serializeArray();
        insertSkin($(this))
    })

});


function insertSkin(thisObj){
    
    var rarity = thisObj.find("[name=rarity]").val();
        var rariryPrecedence = rarity == "Contraband" ? 6 
                             : rarity == "Covert" ? 5 
                             : rarity == "Classified" ? 4 
                             : rarity == "Restricted" ? 3 
                             : rarity == "Mil-Spec Grade" ? 2
                             : rarity == "Industrial Grade" ? 1 
                             : "Consumer Grade"
                             
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
                    }
                })
            }).then(res => {
                thisObj.find("strong").text(thisObj.find("strong").val() + 1)
                thisObj.attr("already-liked", true)
            })
            .catch(err => console.log(err))
}