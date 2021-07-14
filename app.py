import os
from flask import (Flask, render_template, 
    request, redirect, url_for, flash, session)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
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
    latest_skins = skinColl.find().sort(([("release_date", -1), ("rarity_precedence", -1)])).limit(17)
    return render_template("pages/index.html", page_title="Latest Skins", skins=latest_skins)


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
        user = mongo.db.users.find_one({"username": request.form.get("username").lower()})
        session["user"] = user
        flash("Registration Succesful")
        return redirect(url_for("account", user=session["user"]))

    return render_template("components/signup.html", login=False, page_title="Sign Up")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        existing_user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})

        skins_liked = list(map(str, existing_user["skins_liked"]))
        skins_disliked = list(map(str, existing_user["skins_disliked"]))
       
        if existing_user:
            if check_password_hash(
                existing_user["password"], request.form.get("password")):
                    session["user"] = { "username": existing_user["username"],
                                        "is_admin": existing_user["is_admin"],
                                        "skins_liked": skins_liked,
                                        "skins_disliked": skins_disliked
                                      }

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

    return render_template("components/login.html", page_title="Login")


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
        return render_template("pages/dashboard.html", page_title="Admin Dashboard")
       
    return render_template("error-pages/404.html", page_title="404 Page Not Found")


@app.route('/add/skin', methods=["GET", "POST"])
def add_skin():
    skinColl.insert_one(request.form.to_dict())
    return render_template("components/add-skin.html", page_title="Latest Skins")

if __name__ == '__main__':
    app.run(
        host=os.environ.get("IP", "0.0.0.0"),
        port=int(os.environ.get("PORT", "5000")),
        debug=True
    )  