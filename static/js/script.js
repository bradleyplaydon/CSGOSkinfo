$(document).ready(function () {
    let weaponTypeSelectEl = $("select[name='weapon_type']");
    let weaponNameSelectEl = $("select[name='weapon_name']");
    var pistols = $("#weapons").attr("data-weapons");
    setWeaponSelectOptions(weaponTypeSelectEl.val())    
    $(weaponTypeSelectEl).change(function(){
        setWeaponSelectOptions(weaponTypeSelectEl.val())
    })
    function setWeaponSelectOptions(selectVal){
        for(var p in pistols){
            var o = new Option(p, p.toLowerCase());
            $(o).html(p);
            $(weaponNameSelectEl).append(o);            
        }
    }
})

