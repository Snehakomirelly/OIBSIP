from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Create Flask App
app = Flask(__name__)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bmi_history.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize Database
db = SQLAlchemy(app)


# DATABASE TABLE
class BMIRecord(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100))

    age = db.Column(db.Integer)

    gender = db.Column(db.String(20))

    weight = db.Column(db.Float)

    height = db.Column(db.Float)

    bmi = db.Column(db.Float)

    category = db.Column(db.String(50))

    date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


# CREATE TABLE
with app.app_context():

    db.create_all()


# HOME ROUTE
@app.route("/")
def home():

    return render_template("index.html")


# BMI API ROUTE
@app.route("/calculate_bmi", methods=["POST"])
def calculate_bmi():

    try:

        data = request.get_json()

        # User Inputs
        name = data["name"]

        age = int(data["age"])

        gender = data["gender"]

        weight = float(data["weight"])

        height = float(data["height"])

        # Validation
        if (
            name == "" or
            gender == "" or
            weight <= 0 or
            height <= 0 or
            age <= 0
        ):

            return jsonify({
                "error": "Please enter valid details"
            }), 400

        # Height Conversion
        height_in_meter = height / 100

        # BMI Formula
        bmi = round(
            weight / (height_in_meter ** 2),
            2
        )

        # Healthy BMI Range
        min_normal_bmi = 18.5

        max_normal_bmi = 24.9

        min_weight = round(
            min_normal_bmi * (height_in_meter ** 2),
            1
        )

        max_weight = round(
            max_normal_bmi * (height_in_meter ** 2),
            1
        )

        # Water Intake
        water_intake = round(
            (weight * 35) / 1000,
            2
        )

        # Age Suggestions
        if age < 18:

            age_suggestion = (
                "Teenagers should focus on balanced nutrition and exercise."
            )

        elif age <= 40:

            age_suggestion = (
                "Maintain exercise and balanced diet."
            )

        else:

            age_suggestion = (
                "Focus on heart health and regular checkups."
            )

        # Gender Suggestions
        if gender == "Male":

            health_suggestion = (
                "Protein-rich foods and strength training help fitness."
            )

        else:

            health_suggestion = (
                "Maintain iron and balanced nutrition."
            )

        # BMI Categories
        if bmi < 18.5:

            category = "Underweight"

            color = "#3498db"

            message = "You need to gain healthy weight."

            tip = "Eat nutritious foods."

            suggestion = (
                f"Gain approx "
                f"{round(min_weight - weight,1)} kg."
            )

        elif bmi < 25:

            category = "Normal"

            color = "#2ecc71"

            message = "Healthy weight!"

            tip = "Keep it up."

            suggestion = (
                "You are in healthy range."
            )

        elif bmi < 30:

            category = "Overweight"

            color = "#f39c12"

            message = "Reduce some weight."

            tip = "Exercise more."

            suggestion = (
                f"Lose approx "
                f"{round(weight - max_weight,1)} kg."
            )

        else:

            category = "Obese"

            color = "#e74c3c"

            message = "High health risk."

            tip = "Consult doctor."

            suggestion = (
                f"Lose approx "
                f"{round(weight - max_weight,1)} kg."
            )

        # SAVE TO DATABASE
        record = BMIRecord(

            name=name,

            age=age,

            gender=gender,

            weight=weight,

            height=height,

            bmi=bmi,

            category=category
        )

        db.session.add(record)

        db.session.commit()

        # RETURN RESPONSE
        return jsonify({

            "bmi": bmi,

            "category": category,

            "water_intake": water_intake,

            "color": color,

            "message": message,

            "tip": tip,

            "suggestion": suggestion,

            "min_weight": min_weight,

            "max_weight": max_weight,

            "age_suggestion": age_suggestion,

            "health_suggestion": health_suggestion
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# HISTORY ROUTE
@app.route("/history")
def history():

    records = BMIRecord.query.order_by(
        BMIRecord.id.desc()
    ).all()

    return render_template(
        "history.html",
        records=records
    )


# DELETE SELECTED RECORDS ROUTE
@app.route("/delete_selected", methods=["POST"])
def delete_selected():

    data = request.get_json()

    ids = data["ids"]

    for record_id in ids:

        record = BMIRecord.query.get(record_id)

        if record:

            db.session.delete(record)

    db.session.commit()

    return jsonify({

        "message":
        "Selected records deleted successfully"
    })


# DASHBOARD ROUTE
@app.route("/dashboard")
def dashboard():

    records = BMIRecord.query.all()

    total_users = len(records)

    # Average BMI
    if total_users > 0:

        avg_bmi = round(

            sum(r.bmi for r in records)
            / total_users,

            2
        )

    else:

        avg_bmi = 0

    # BMI Counts
    underweight = BMIRecord.query.filter_by(
        category="Underweight"
    ).count()

    normal = BMIRecord.query.filter_by(
        category="Normal"
    ).count()

    overweight = BMIRecord.query.filter_by(
        category="Overweight"
    ).count()

    obese = BMIRecord.query.filter_by(
        category="Obese"
    ).count()

    return render_template(

        "dashboard.html",

        total_users=total_users,

        avg_bmi=avg_bmi,

        underweight=underweight,

        normal=normal,

        overweight=overweight,

        obese=obese
    )


# RUN FLASK APP
if __name__ == "__main__":

    app.run(debug=True)  