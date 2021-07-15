$(document).ready(function() {
    let weaponTypeSelectEl = $("select[name='weapon_type']");
    let weaponNameSelectEl = $("select[name='weapon_name']");
    var weapons = JSON.parse($("#weapons").attr("data-weapons"));
    setWeaponSelectOptions(weaponTypeSelectEl.val().toLowerCase());    
    $(weaponTypeSelectEl).change(function(){
        $(weaponNameSelectEl).empty()
        setWeaponSelectOptions(weaponTypeSelectEl.val().toLowerCase());
    });
    function setWeaponSelectOptions(selectVal){
        weapons[selectVal].map((w, index) => { 
           o = new Option(w, w);
           $(o).html(w);
           $(weaponNameSelectEl).append(o);
        });
    }
});

