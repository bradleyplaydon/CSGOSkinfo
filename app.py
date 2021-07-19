import os
import dateutil
from flask import (Flask, render_template,
                   request, redirect, url_for, flash, session)
from flask_pymongo import PyMongo
from flask_paginate import Pagination, get_page_args
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from dateutil import parser
import json
if os.path.exists("env.py"):
    import env


app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")

mongo = PyMongo(app)

skinColl = mongo.db.skins


@app.route('/')
def index():
    latest_skins = skinColl.find().sort(
        ([("release_date", -1), ("rarity_precedence", -1)])).limit(17)
    print(session["user"]["skins_liked"])
    return render_template(
        "pages/index.html", page_title="Latest Skins", skins=latest_skins)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        existing_user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})

        if existing_user:
            flash("Username already exists")
            return redirect(url_for("signup"))

        if request.form.get("password") != request.form.get("confirmpassword"):
            flash("Passwords doesn't match")
            return redirect(url_for("signup"))

        register = {
            "first_name": request.form.get("firstName").capitalize(),
            "last_name": request.form.get("lastName").capitalize(),
            "username": request.form.get("username").lower(),
            "email_address": request.form.get("email"),
            "password": generate_password_hash(request.form.get("password")),
            "is_admin": False,
            "skins_liked": list(),
            "skins_disliked": list()
        }

        mongo.db.users.insert_one(register)

        user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})

        skins_liked = list(map(str, user["skins_liked"]))
        skins_disliked = list(map(str, user["skins_disliked"]))

        session["user"] = {
                        "username": user["username"],
                        "is_admin": user["is_admin"],
                        "skins_liked": skins_liked,
                        "skins_disliked": skins_disliked}
        flash("Registration Succesful")
        return redirect(url_for("account", user=session["user"]))

    return render_template(
        "components/auth.html", login=False, page_title="Sign Up")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        existing_user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})

        skins_liked = list(map(str, existing_user["skins_liked"]))
        skins_disliked = list(map(str, existing_user["skins_disliked"]))
        if existing_user:
            if check_password_hash(existing_user["password"],
                                   request.form.get("password")):
                    session["user"] = {
                        "username": existing_user["username"],
                        "is_admin": existing_user["is_admin"],
                        "skins_liked": skins_liked,
                        "skins_disliked": skins_disliked}

                    flash("Welcome, {}".format(
                        request.form.get("username")))

                    return redirect(url_for(
                            "account", username=session["user"]["username"]))
            else:
                flash("Incorrect Username and/or Password")
                return redirect(url_for("login"))

        else:
            flash("Incorrect Username and/or Password")
            return redirect(url_for("login"))

    return render_template(
        "components/auth.html", login=True, page_title="Login")


@app.route("/logout")
def logout():
    flash("You have been logged out.")
    session.pop("user")
    return redirect(url_for("login"))


@app.route("/account/<username>", methods=["POST", "GET"])
def account(username):
    if session:
        return render_template("pages/account.html", username=username)

    return redirect(url_for("index"))


@app.route("/admin")
def admin():
    if session and session["user"]["is_admin"]:
        totalUsers = mongo.db.users.find().count()
        totalSkins = skinColl.count()
        totalAdmins = mongo.db.users.find({"is_admin": True}).count()
        skinUpVotes = skinColl.find({"up_votes": {"$gt": 0}})
        skinDownVotes = skinColl.find({"down_votes": {"$gt": 0}})
        totSkinUpVotes = 0
        totSkinDownVotes = 0
        highestLikes = skinColl.find_one(sort=[("up_votes", -1)])["up_votes"]
        mostLikedSkin = skinColl.find({"up_votes": highestLikes})
        for skin in skinUpVotes:
            totSkinUpVotes = totSkinUpVotes + skin["up_votes"]

        for skin in skinDownVotes:
            totSkinDownVotes = totSkinDownVotes + skin["down_votes"]

        return render_template(
            "pages/dashboard.html", page_title="Admin Dashboard",
            totalUsers=totalUsers, totalSkins=totalSkins,
            totalAdmins=totalAdmins, skinUpVotes=totSkinUpVotes,
            skinDownVotes=totSkinDownVotes, mostLikedSkin=mostLikedSkin)

    return render_template(
        "error-pages/404.html", page_title="404 Page Not Found")


@app.route('/view/skins', methods=["GET", "POST"])
def view_skins():
    if session and session["user"]["is_admin"]:
        return render_template("pages/view-skins.html", page_title="View Skins")
    return render_template("error-pages/404.html")

@app.route('/add/skin', methods=["GET", "POST"])
def add_skin():
    if session and session["user"]["is_admin"]:
        weaponTypes = skinColl.distinct('weapon_type')
        knifeTypes = skinColl.distinct('knife_type')
        weapons = {
            "pistol": skinColl.distinct("weapon_name",
                                        {"weapon_type": "Pistol"}),
            "rifle": skinColl.distinct("weapon_name",
                                       {"weapon_type": "Rifle"}),
            "heavy": skinColl.distinct("weapon_name",
                                       {"weapon_type": "Machinegun"}),
            "smg": skinColl.distinct("weapon_name",
                                     {"weapon_type": "SMG"}),
            "shotgun": skinColl.distinct("weapon_name",
                                         {"weapon_type": "Shotgun"}),
            "sniper rifle": skinColl.distinct("weapon_name",
                                              {"weapon_type": "Sniper Rifle"})
        }
        weaponRarities = skinColl.distinct('rarity')
        return render_template(
            "components/add-skin.html", page_title="Add A Skin",
            weaponTypes=weaponTypes, weapons=json.dumps(weapons),
            weaponRarities=weaponRarities, knifeTypes=knifeTypes)
    return render_template("error-pages/404.html")


@app.route('/insert/weapon', methods=["GET", "POST"])
def insert_weapon_skin():
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
            reqJson = request.json
            reqJson["release_date"] = parser.parse(reqJson["release_date"])
            skinColl.insert_one(reqJson)
            return redirect(url_for('add_skin'))


@app.route('/edit/skin', methods=["GET", "POST"])
def edit_skin():
    if session and session["user"]["is_admin"]:
        skins = list(skinColl.find( { "weapon_type": { "$ne": "Knife" }, "type": { "$ne": "Gloves"} }))
        return render_template(
            "components/edit-skin.html", page_title="Edit A Skin",
            skins=skins)
    return render_template("error-pages/404.html")


@app.route('/edit/skin/<skin_id>', methods=["GET", "POST"])
def edit_selected_skin(skin_id):
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
            rarity = request.form.get("rarity") 
            rarity_precedence = (
                5 if rarity == "Covert" 
                else 4 if rarity == "Classified"
                else 3 if rarity == "Restricted" 
                else 2 if rarity == "Mil-Spec Grade" 
                else 1 if rarity == "Industrial Grade" 
                else 0 if rarity == "Consumer Grade" 
                else "")
            
            submit = {
                "name": request.form.get("name"),
                "skin_description": request.form.get("skin_description"),
                "type": "Weapon",
                "weapon_type": request.form.get("weapon_type"),
                "weapon_name": request.form.get("weapon_name"),
                "rarity": rarity,
                "rarity_precedence": rarity_precedence, 
                "souvenir_available": True if request.form.get("souvenir") else False,
                "stattrak_available": True if request.form.get("stattrak") else False,
                "stattrak_conditions": {
                    "factory_new": True if request.form.get("fn") and request.form.get("stattrak") else False,
                    "min_wear": True if request.form.get("mw") and request.form.get("stattrak") else False,
                    "field_tested": True if request.form.get("ft") and request.form.get("stattrak") else False,
                    "well_worn": True if request.form.get("ww") and request.form.get("stattrak") else False,
                    "battle_scarred": True if request.form.get("bs") and request.form.get("stattrak") else False
                },
                "conditions": {
                    "factory_new": True if request.form.get("fn") else False,
                    "min_wear": True if request.form.get("mw") else False,
                    "field_tested": True if request.form.get("ft") else False,
                    "well_worn": True if request.form.get("ww") else False,
                    "battle_scarred": True if request.form.get("bs") else False
                },
                "image_urls": {
                    "factory_new": "https://community.cloudflare.steamstatic.com/economy/image/" + request.form.get("fnimage") if request.form.get("fnimage") else None,
                    "min_wear": "https://community.cloudflare.steamstatic.com/economy/image/" + request.form.get("mwimage") if request.form.get("mwimage") else None,
                    "field_tested": "https://community.cloudflare.steamstatic.com/economy/image/" + request.form.get("ftimage") if request.form.get("ftimage") else None,
                    "well_worn": "https://community.cloudflare.steamstatic.com/economy/image/" + request.form.get("ftimage") if request.form.get("wwimage") else None,
                    "battle_scarred": "https://community.cloudflare.steamstatic.com/economy/image/" + request.form.get("bsimage") if request.form.get("bsimage") else None
                },
                "up_votes": 0,
                "down_votes": 0
            }
            submit["release_date"] = parser.parse(request.form.get("release-date"))
         
            skinColl.update({"_id": ObjectId(skin_id)}, submit)
            flash("The {} has been successfully updated".format(
                        request.form.get("name")))

        weaponTypes = skinColl.distinct('weapon_type')
        weaponRarities = skinColl.distinct('rarity')
        weapons = {
            "pistol": skinColl.distinct("weapon_name",
                                        {"weapon_type": "Pistol"}),
            "rifle": skinColl.distinct("weapon_name",
                                       {"weapon_type": "Rifle"}),
            "heavy": skinColl.distinct("weapon_name",
                                       {"weapon_type": "Machinegun"}),
            "smg": skinColl.distinct("weapon_name",
                                     {"weapon_type": "SMG"}),
            "shotgun": skinColl.distinct("weapon_name",
                                         {"weapon_type": "Shotgun"}),
            "sniper rifle": skinColl.distinct("weapon_name",
                                              {"weapon_type": "Sniper Rifle"})
        }
        skin = skinColl.find_one({"_id": ObjectId(skin_id)})
        return render_template("components/edit-selected-skin.html", skin=skin, weaponTypes=weaponTypes, weapons=weapons, jsonweapons=json.dumps(weapons), weaponRarities=weaponRarities)
    return render_template("error-pages/404.html")


@app.route('/delete/skin', methods=["GET", "POST"])
def delete_skin():
    if session and session["user"]["is_admin"]:
        skins = list(skinColl.find( { "weapon_type": { "$ne": "Knife" }, "type": { "$ne": "Gloves"} }))
        return render_template(
            "components/delete-skin.html", page_title="Delete A Skin",
            skins=skins)
    return render_template("error-pages/404.html")


@app.route('/delete/skin/<skin_id>', methods=["GET", "POST"])
def delete_selected_skin(skin_id):
    if session and session["user"]["is_admin"]:
        skinColl.remove({"_id": ObjectId(skin_id)}) if skinColl.find_one({"_id": ObjectId(skin_id)}) != None else False
        mongo.db.cases.remove({"_id": ObjectId(skin_id)}) if mongo.db.cases.find_one({"_id": ObjectId(skin_id)}) != None else False
        mongo.db.stickers.remove({"_id": ObjectId(skin_id)}) if mongo.db.stickers.find_one({"_id": ObjectId(skin_id)}) != None else False

        return redirect(url_for("view_skins"))
    return render_template("error-pages/404.html")
    

@app.route('/insert/knife', methods=["GET", "POST"])
def insert_knife_skin():
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
            print(request.data)
            return render_template("components/add_skin.html")


@app.route('/insert/gloves', methods=["GET", "POST"])
def insert_gloves_skin():
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
            return render_template("components/add_skin.html")


@app.route('/insert/sticker', methods=["GET", "POST"])
def insert_sticker_skin():
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
            return render_template("components/add_skin.html")


@app.route('/insert/case', methods=["GET", "POST"])
def insert_case_skin():
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
            return render_template("components/add_skin.html")


@app.route('/get/skin', methods=["GET", "POST"])
def get_skin_by_name():
    if session and session["user"]["is_admin"]:  
        if request.method == "POST":
            reqJson = request.json
            skin_name = str(f'{reqJson["name"]} ')

            skinExists = skinColl.find({"name": skin_name}).count()
            if skinExists > 0:
                return "True"
            else: 
                return "False"

        if request.method == "GET":
            searchOptions = {}
            if "searchweaponskin" in request.args and request.values["searchweaponskin"] != None and request.values["searchweaponskin"] != '':
                searchOptions = { "weapon_type": { "$ne": "Knife" }, "type": { "$ne": "Gloves"} }
                searchOptions["name"] = { "$regex": request.values["searchweaponskin"], "$options": "i" }
                foundSkins = skinColl.find(searchOptions).sort("rarity_precedence", -1)
                return render_template("components/edit-skin.html", foundSkins=foundSkins)


            if "deleteweaponskins" in request.args and request.values["deleteweaponskins"] != None and request.values["deleteweaponskins"] != '':
                searchOptions = { "weapon_type": { "$ne": "Knife" }, "type": { "$ne": "Gloves"} }
                searchOptions["name"] = { "$regex": request.values["deleteweaponskins"], "$options": "i" }
                foundSkins = skinColl.find(searchOptions).sort("rarity_precedence", -1)
                return render_template("components/delete-skin.html", foundSkins=foundSkins)


            if "searchknifes" in request.args and request.values["searchknifes"] != None and request.values["searchknifes"] != '':
                searchOptions = { "weapon_type": { "$eq": "Knife" } }
                searchOptions["name"] = { "$regex": request.values["searchknifes"], "$options": "i" }
                foundKnifes = skinColl.find(searchOptions).sort("rarity_precedence", -1)
                return render_template("components/edit-skin.html", foundKnifes=foundKnifes)


            if "searchallskins" in request.args and request.values["searchallskins"] != None and request.values["searchallskins"] != '':
                searchOptions["name"] = { "$regex": request.values["searchallskins"], "$options": "i" }
                foundSkins = skinColl.find(searchOptions).sort("rarity_precedence", -1)
                cases = mongo.db.cases.find(searchOptions).sort("rarity_precedence", -1)
                stickers = mongo.db.stickers.find(searchOptions).sort("rarity_precedence", -1)
                return render_template("pages/view-skins.html", foundSkins=foundSkins, cases=cases, stickers=stickers)

                  
@app.route("/pistols")
def pistols():
    page, per_page, offset = get_page_args(page_parameter='page', per_page_parameter='per_page', offset_parameter='offset')
    per_page = 20
    offset = (page - 1) * per_page

    total = skinColl.find({"weapon_type": "Pistol"}).sort("rarity_precedence", -1).count()
    pistols = skinColl.find({"weapon_type": "Pistol"}).sort("rarity_precedence", -1)

    pistols_paginated = pistols[offset: offset + per_page]

    pagination = Pagination(page=page, per_page=per_page, total=total, css_framework='bootstrap4')

    return render_template("pages/pistols.html", page_title="Pistols",  pistols=pistols_paginated, pagination=pagination)



@app.route("/rifles")
def rifles():
    return render_template("pages/rifles.html")


@app.route("/sniper-rifles")
def sniper_rifles():
    return render_template("pages/sniper-rifles.html")


@app.route("/smgs")
def smgs():
    return render_template("pages/smgs.html")


@app.route("/shotguns")
def shotguns():
    return render_template("pages/shotguns.html")


@app.route("/heavies")
def heavies():
    return render_template("pages/heavies.html")


@app.route("/knives")
def knives():
    return render_template("pages/knives.html")


@app.route("/gloves")
def gloves():
    return render_template("pages/gloves.html")


@app.route("/stickers")
def stickers():
    return render_template("pages/stickers.html")


@app.route("/cases")
def cases():
    return render_template("pages/cases.html")


@app.route("/api/like-skin", methods=["POST", "GET"])
def like():
    if request.method == "POST":
        reqJson = request.json
        collection = str(reqJson["collection"])

        mongo.db.users.update(
        {"username": session["user"]["username"]}, {"$push": {"skins_liked": ObjectId(reqJson["_id"])}})

        existing_user = mongo.db.users.find_one(
                 {"username": session["user"]["username"]})

        skins_liked = list(map(str, existing_user["skins_liked"]))
        skins_disliked = list(map(str, existing_user["skins_disliked"]))
        
        session["user"] = {
                        "username": existing_user["username"],
                        "is_admin": existing_user["is_admin"],
                        "skins_liked": skins_liked,
                        "skins_disliked": skins_disliked}

        skin_upvotes = mongo.db[collection].find_one({"_id": ObjectId(reqJson["_id"])})["up_votes"] + 1

        mongo.db[collection].update(
            {"_id": ObjectId(reqJson["_id"])}, {"$set": {"up_votes": skin_upvotes}})

        return "liked"
    if request.method == "GET":
        return render_template("error-pages/404.html")


@app.route("/api/dislike-skin", methods=["POST", "GET"])
def dislike():
    if request.method == "POST":
        return "disliked"
    if request.method == "GET":
        return render_template("error-pages/404.html")


@app.route("/api/unlike-skin", methods=["POST", "GET"])
def unlike():
    if request.method == "POST":
        reqJson = request.json
        return "unliked"


@app.route("/api/undislike-skin", methods=["POST", "GET"])
def undislike():
    if request.method == "POST":
        reqJson = request.json
        return "undisliked"


if __name__ == '__main__':
    app.run(
        host=os.environ.get("IP", "0.0.0.0"),
        port=int(os.environ.get("PORT", "5000")),
        debug=True
    )
