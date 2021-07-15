import os
from flask import (Flask, render_template,
                   request, redirect, url_for, flash, session)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import json
if os.path.exists("env.py"):
    import env


app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")

mongo = PyMongo(app)

skinColl = mongo.db.skins
skins = skinColl.find()


@app.route('/')
def index():
    latest_skins = skinColl.find().sort(
        ([("release_date", -1), ("rarity_precedence", -1)])).limit(17)
    return render_template(
        "pages/index.html", page_title="Latest Skins", skins=latest_skins)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        existing_user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})

        if existing_user:
            flash("Username already exists")
            return redirect(url_for("register"))

        if request.form.get("password") != request.form.get("confirmpassword"):
            flash("Passwords doesn't match")
            return redirect(url_for("register"))

        register = {
            "first_name": request.form.get("firstName").capitalize(),
            "last_name": request.form.get("lastName").capitalize(),
            "username": request.form.get("username").lower(),
            "email_address": request.form.get("email"),
            "password": generate_password_hash(request.form.get("password")),
            "is_admin": "false",
            "skins_liked": list(),
            "skins_disliked": list()
        }

        mongo.db.users.insert_one(register)
        user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})
        session["user"] = user
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
                            "account", username="test"))
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
            "sniper-rifle": skinColl.distinct("weapon_name",
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
            print(request.form)
            return render_template("components/add_skin.html")


@app.route('/insert/knife', methods=["GET", "POST"])
def insert_knife_skin():
    if session and session["user"]["is_admin"]:
        if request.method == "POST":
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


@app.route('/add/user', methods=["GET", "POST"])
def add_user():
    return render_template("components/add-user.html")


@app.route("/pistols")
def pistols():
    return render_template("pages/pistols.html")


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


if __name__ == '__main__':
    app.run(
        host=os.environ.get("IP", "0.0.0.0"),
        port=int(os.environ.get("PORT", "5000")),
        debug=True
    )
