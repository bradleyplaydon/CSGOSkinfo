$(document).ready(function () {
    let weaponTypeSelectEl = $("select[name='weapon_type']");
    let weaponNameSelectEl = $("select[name='weapon_name']");
    let weaponNames = {{ weaponTypes }};
    setWeaponSelectOptions(selectEl.val())    
    $(selectEl).change(function(){
        setWeaponSelectOptions(selectEl.val())
    })
    function setWeaponSelectOptions(selectVal){
        console.log(selectVal)

    }
})

