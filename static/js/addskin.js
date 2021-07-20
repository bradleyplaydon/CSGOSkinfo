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
        if (checkedCount >= 2) {
            $('[type=submit]').removeAttr("disabled");
            $('[name=stat_or_souv]').each(function (index, element) {
                $(element).attr("required", "required")
                $(element).on("input", function () {
                    $("#release-date").attr("required", "required")
                })
            })
        } else {
            $('[type=submit]').attr("disabled", "disabled");
            $('[name=stat_or_souv]').each(function (index, element) {
                $(element).removeAttr("required")
            })
        }
    });

    conditionEls.on('input', function () {
        conditionEls.not(this).prop('required', !$(this).val().length);
    });

    const weaponDatePicker = MCDatepicker.create({
        el: '#release-date',
        dateFormat: 'YYYY-MM-DD'
    })
});