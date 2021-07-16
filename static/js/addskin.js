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

    $("#weapon-skin-form").submit(function (e) {
        e.preventDefault();
        var data = $(this).serializeArray();
    })

});