$(document).ready(function ($) {
    let weaponTypeSelectEl = $("#skin-weapon-type");
    let weaponNameSelectEl = $("#skin-weapon-name");
    let checkRadioOptions = $("#neither, #stattrak, #souvenir")
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

    $('body').delegate('.myradio', 'click', function (e) {
        var $element = $(this)[0];
    
        if ($(this).prop('checked') == false) {
            $(this).prop('checked', true);
            return;
        }
    
        $('.radio').each(function () {
            if ($(this)[0] !== $element)
                $(this).prop('checked', false);
        });
    });
});