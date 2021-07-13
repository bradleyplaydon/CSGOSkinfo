import os
from flask import (Flask, render_template, 
    request, redirect, url_for)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

if os.path.exists("env.py"):
    import env


app = Flask(__name__)

app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

mongo = PyMongo(app)

skinColl = mongo.db.skins
skins = skinColl.find()

@app.route('/')
def index():
    return render_template("pages/index.html", page_title="Latest Skins", skins=skins)


@app.route('/add/skin')
def add_skin():
    skinColl.insert_one(request.form.to_dict())
    return render_template("components/add-skin.html", page_title="Latest Skins")

if __name__ == '__main__':
    app.run(
        host=os.environ.get("IP", "0.0.0.0"),
        port=int(os.environ.get("PORT", "5000")),
        debug=True
    )  