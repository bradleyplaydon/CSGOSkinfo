$(document).ready(function () {
    let weaponTypeSelectEl = $("#skin-weapon-type");
    let weaponNameSelectEl = $("#skin-weapon-name");
    var weapons = JSON.parse($("#weapons").attr("data-weapons"));
    var checkedCount = 0;

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

    $('body').delegate('.radio', 'click', function (e) {
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


    preReleaseDate = new Date($("#release-date").val());
    const editSkinDp = MCDatepicker.create({
        el: '#release-date',
        dateFormat: 'YYYY-MM-DD',
        selectedDate: preReleaseDate
    });
    preForm = $("#edit-skin-form").serialize();
    
    $("#edit-skin-form").on("change", function () {
        if ($(this).serialize() === preForm) {
            $(this).find("#edit-skin").attr("disabled", "disabled")
            if(checkedCount >= 2){
                $('#invalid-error').hide();
            } 
        } else {
            if(checkedCount >= 2){
                $(this).find("#edit-skin").removeAttr("disabled")
                $('#invalid-error').hide();
            } else {
                $("#invalid-error").text("Please tick 2 conditions in order to add the skin and add atleast 2 Steam icon URLs");
                $('#invalid-error').show();
            }
        }
    });
    editSkinDp.onSelect((date, formatedDate) => {
        if(date.getTime() === preReleaseDate.getTime()){
            $(this).find("#edit-skin").attr("disabled", "disabled")
        } else {
            $(this).find("#edit-skin").removeAttr("disabled")
        }
    });

    var conditionEls = $('#factory_new, #min_wear, #field_tested, #well_worn, #battle_scarred');
    var imageEls = $('input[name=fnimage], input[name=mwimage], input[name=ftimage], input[name=wwimage], input[name=bsimage]');
    
    conditionEls.each(function (i) {
        if (conditionEls[i].checked) {
            checkedCount += 1;
        }
    });

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
    })
});