# Manual extraction from workout PDF images
# Each session extracted directly by Claude vision (no API credits)

sets = []

def add(date, day, exercise, variation, sets_data, notes=""):
    """Add sets for one exercise. sets_data = [(reps, weight), ...]"""
    abbrev_map = {
        "Incline Press": "IP", "Bench Press": "BP", "Decline Press": "DP",
        "Tricep Pushdowns": "TPD", "Overhead Tricep Ext": "OTE",
        "Incline Fly": "IF", "High Cable Fly": "HCF", "Cable Cross Overs": "CCO",
        "Lat Pulldown": "LPD", "Bent Over Rows": "BOR", "Cable Rows": "CR",
        "Face Pulls": "FP", "Rear Delt Raises": "RDR", "Bicep Curls - Preacher": "BCP",
        "Hammer Curls": "HC", "Cable Shrugs": "CS", "Cable Curls": "CCU",
        "Barbell Shrugs": "BS", "Lateral Raises": "LR", "Seated Shoulder Press": "SSP",
        "Wrist Twist": "WT", "Leg Press": "LP", "Leg Extensions": "LE",
        "Leg Curls": "LC", "Hip Thrust": "HT", "Nordic Curl": "NC",
        "Reverse Hyper": "RH", "DB Calf Raises": "DCR", "Smith Mach Calf Raises": "SCR",
        "Back Extension": "BE", "Forward Back Stretch": "FBS",
        "Cable Press": "CP", "Low Cable Fly": "LCF", "Incline Curls": "IC",
        "Overhead Tricep Press": "OTP", "Curls (Standing)": "CST",
        "Tricep Ext Down": "TED", "Tricep Ext Up": "TEU", "Forearm Raise - Cable": "FRC",
    }
    abbrev = abbrev_map.get(exercise, exercise[:3].upper())
    session = f"{date} {day}"
    for i, (reps, weight) in enumerate(sets_data, 1):
        sets.append({
            "set_id": f"{date}-{abbrev}-{i}",
            "date": date, "session": session, "day": day,
            "exercise": exercise, "variation": variation,
            "set_number": i, "reps": reps, "weight": weight, "notes": notes
        })

# ═══════════════════════════════════════════════════════
# PAGE 1 (2024_2025/1.jpeg) - Header: "1 - Oct 28"
# ═══════════════════════════════════════════════════════

# MON 1 - 2024-10-28 - Push
add("2024-10-28","Push","Incline Press","DBs",[(20,35),(20,40),(12,50)])
add("2024-10-28","Push","Tricep Pushdowns","V-Bar",[(20,50),(20,60)])
add("2024-10-28","Push","Incline Fly","DBs",[(20,40),(20,50),(15,60)])
add("2024-10-28","Push","Tricep Pushdowns","Rope",[(20,30),(20,35),(15,40)])
add("2024-10-28","Push","Incline Press","Cables",[(20,70),(12,80),(10,90)])
add("2024-10-28","Push","High Cable Fly","",[(20,30),(20,40),(12,50)])
add("2024-10-28","Push","Overhead Tricep Ext","",[(20,15),(12,20),(10,25)])
add("2024-10-28","Push","Decline Press","Cables",[(25,60),(18,80),(12,90)])
add("2024-10-28","Push","Bench Press","Cables",[(12,90),(10,100),(8,110)])
add("2024-10-28","Push","Incline Press","Cables",[(12,40),(12,50),(10,60)],"2nd cable incline")
add("2024-10-28","Push","Tricep Pushdowns","Bar",[(20,40),(18,45),(12,50)])
add("2024-10-28","Push","Wrist Twist","DBs",[(25,40),(25,40)])

# THURS 1 - 2024-10-31 - Shoulders
add("2024-10-31","Shoulders","Seated Shoulder Press","Cables",[(20,60),(12,50),(10,90)])
add("2024-10-31","Shoulders","Seated Shoulder Press","DBs",[(20,25),(20,30),(16,35)])
add("2024-10-31","Shoulders","Lateral Raises","Cables",[(15,15),(12,20),(12,25)])
add("2024-10-31","Shoulders","High Cable Fly","",[(18,40),(18,50),(20,60)])
add("2024-10-31","Shoulders","Face Pulls","",[(20,40),(20,50),(20,60)])
add("2024-10-31","Shoulders","Lateral Raises","Cables",[(15,15),(18,20),(15,25)],"cable raise up")
add("2024-10-31","Shoulders","Lat Pulldown","Cables",[(20,35),(18,45),(12,55)],"wide cable pulldown")
add("2024-10-31","Shoulders","Lateral Raises","DBs",[(20,15),(16,15),(12,15)])

# ═══════════════════════════════════════════════════════
# PAGE 2 (2024_2025/2.jpeg)
# ═══════════════════════════════════════════════════════

# TUES 1 - 2024-10-29 - Pull
add("2024-10-29","Pull","Lat Pulldown","Cables",[(20,90),(20,100),(15,110)],"wide grip")
add("2024-10-29","Pull","Bicep Curls - Preacher","DBs",[(15,25),(10,30),(6,35)])
add("2024-10-29","Pull","Lat Pulldown","Cables",[(20,30),(20,40),(15,50)],"long bar")
add("2024-10-29","Pull","Lat Pulldown","Cables",[(20,80),(18,90),(15,100)],"close grip")
add("2024-10-29","Pull","Hammer Curls","DBs",[(15,35),(10,40),(6,45)])
add("2024-10-29","Pull","Lat Pulldown","Cables",[(20,100),(20,110),(15,120)],"V pulldown")
add("2024-10-29","Pull","Cable Rows","",[(20,60),(15,80),(10,100)],"mid row")
add("2024-10-29","Pull","Cable Curls","",[(15,35),(12,40),(10,45)],"bar")
add("2024-10-29","Pull","Forearm Raise - Cable","",[(20,20),(20,25),(20,30)],"forearm curl")
add("2024-10-29","Pull","Cable Curls","",[(10,25),(8,25),(11,25)],"double cable curls each")

# WED 1 - 2024-10-30 - Legs
add("2024-10-30","Legs","Leg Extensions","Cables",[(20,15),(20,20),(18,25)],"outer thigh, leg side extension in front")
add("2024-10-30","Legs","Leg Extensions","Cables",[(20,25),(20,35),(15,45)],"leg kickback")
add("2024-10-30","Legs","Leg Extensions","Cables",[(20,15),(20,25),(10,35)],"leg inner ext")
add("2024-10-30","Legs","Leg Curls","Cables",[(20,30),(20,40),(15,50)])
add("2024-10-30","Legs","Leg Press","",[(20,90),(20,90),(20,90)],"reg width")
add("2024-10-30","Legs","DB Calf Raises","DBs",[(60,45),(60,50),(60,52.5)])
add("2024-10-30","Legs","Leg Press","",[(20,90),(20,90),(20,90)],"wide width")
add("2024-10-30","Legs","Smith Mach Calf Raises","",[(35,50),(35,60),(35,70)],"cable calf raise")

# ═══════════════════════════════════════════════════════
# PAGE 3 (2024_2025/3.jpeg) - Header: "2 - Nov 4"
# ═══════════════════════════════════════════════════════

# MON 2 - 2024-11-04 - Push
add("2024-11-04","Push","Incline Press","DBs",[(20,40),(20,45),(13,50)])
add("2024-11-04","Push","Tricep Pushdowns","V-Bar",[(20,50),(15,65),(10,70)])
add("2024-11-04","Push","Incline Fly","DBs",[(20,50),(20,60),(15,70)])
add("2024-11-04","Push","Tricep Pushdowns","Rope",[(20,35),(20,40),(13,45)])
add("2024-11-04","Push","Incline Press","Cables",[(20,80),(11,90),(10,100)],"incline cable bench")
add("2024-11-04","Push","High Cable Fly","",[(15,40),(15,50),(12,60)])
add("2024-11-04","Push","Overhead Tricep Ext","",[(15,20),(10,25),(12,25)],"1 hand tricep - upper")
add("2024-11-04","Push","Decline Press","Cables",[(20,70),(20,90),(12,100)])
add("2024-11-04","Push","Bench Press","Cables",[(12,100),(10,110),(8,120)])
add("2024-11-04","Push","Incline Press","Cables",[(15,50),(12,60),(12,60)],"cable incline press")
add("2024-11-04","Push","Tricep Pushdowns","Bar",[(20,40),(20,45),(20,50),(8,60)],"tricep straight bar - 4 sets")
add("2024-11-04","Push","Wrist Twist","",[(25,40),(25,40)])

# TUES 2 - 2024-11-05 - Pull
add("2024-11-05","Pull","Lat Pulldown","Cables",[(20,100),(20,110),(15,120)],"wide grip pulldown")
add("2024-11-05","Pull","Bicep Curls - Preacher","DBs",[(15,25),(10,30),(5,35)])
add("2024-11-05","Pull","Lat Pulldown","Cables",[(20,60),(20,80),(20,100)],"seated 2 handle pulldown")
add("2024-11-05","Pull","Lat Pulldown","Cables",[(20,90),(20,100),(15,120)],"close grip pulldown")
add("2024-11-05","Pull","Hammer Curls","DBs",[(10,40),(9,35),(10,30)])
add("2024-11-05","Pull","Lat Pulldown","Cables",[(20,110),(20,120),(15,130)],"V pulldown")
add("2024-11-05","Pull","Cable Rows","",[(20,80),(15,100),(10,120)],"cable mid row bar")
add("2024-11-05","Pull","Cable Curls","",[(15,40),(15,45),(11,50)],"bar")
add("2024-11-05","Pull","Forearm Raise - Cable","",[(16,30),(15,35),(15,40)])
add("2024-11-05","Pull","Cable Curls","",[(9,25),(12,25),(12,25)],"2 handle each")

# ═══════════════════════════════════════════════════════
# PAGE 4 (2024_2025/4.jpeg)
# ═══════════════════════════════════════════════════════

# WED 2 - 2024-11-06 - Legs
add("2024-11-06","Legs","Leg Extensions","Cables",[(20,15),(20,20),(20,25)],"outer leg ext in front")
add("2024-11-06","Legs","Leg Extensions","Cables",[(20,25),(20,35),(20,45)],"leg kick back")
add("2024-11-06","Legs","Leg Extensions","Cables",[(20,15),(20,25),(10,35)],"inner leg ext behind")
add("2024-11-06","Legs","Leg Curls","Cables",[(20,30),(20,40),(18,50)])

# Note: "Urologist Appt" written on page - session may have been cut short

# THURS 2 - 2024-11-07 - Shoulders
add("2024-11-07","Shoulders","Seated Shoulder Press","Cables",[(20,70),(15,80),(10,90)])
add("2024-11-07","Shoulders","Seated Shoulder Press","DBs",[(15,30),(12,35),(12,35)])
add("2024-11-07","Shoulders","Lateral Raises","Cables",[(15,15),(15,20),(12,25)],"cable single arm raise")
add("2024-11-07","Shoulders","High Cable Fly","",[(20,15),(20,20),(15,30)],"high cable crossover each")
add("2024-11-07","Shoulders","Face Pulls","",[(20,40),(20,40),(20,70)])
add("2024-11-07","Shoulders","Lateral Raises","Cables",[(20,15),(20,20),(15,25)],"cable raise up")
add("2024-11-07","Shoulders","Lat Pulldown","Cables",[(20,40),(18,50),(12,60)],"cable pulldown")
add("2024-11-07","Shoulders","Lateral Raises","DBs",[(12,15),(12,12.5),(10,10),(10,10)],"each")
add("2024-11-07","Shoulders","Barbell Shrugs","DBs",[(25,45),(25,50),(25,52.5)],"DB shoulder shrug each")
add("2024-11-07","Shoulders","Cable Shrugs","",[(30,70),(30,80),(30,90)],"cable shoulder shrug")

# ═══════════════════════════════════════════════════════
# PAGE 5 (2024_2025/5.jpeg) - "3 - Nov 11 - Jail" - BLANK
# ═══════════════════════════════════════════════════════
# No sets to extract

# ═══════════════════════════════════════════════════════
# PAGE 6 (2024_2025/6.jpeg) - Header: "4 - Nov 18"
# Note at top: "Cable Actual lb but 2-1 Ratio"
# ═══════════════════════════════════════════════════════

# MON 3 - 2024-11-18 - Push
# Note: "ea" = each arm, Cable weights shown with corrections above (2:1 applied)
add("2024-11-18","Push","Incline Press","DBs",[(20,40),(20,45),(10,50)],"ea")
add("2024-11-18","Push","Tricep Pushdowns","V-Bar",[(20,50),(15,55),(12,60)],"cable: 100→50, 110→55, 120→60")
add("2024-11-18","Push","Incline Fly","DBs",[(15,30),(15,25),(15,20)],"ea")
add("2024-11-18","Push","Tricep Pushdowns","Rope",[(20,30),(20,35),(8,40)],"cable: 60→30, 70→35, 80→40")
add("2024-11-18","Push","Bench Press","Cables",[(20,30),(15,35),(8,40)],"cable: 60→30, 70→35, 80→40 ea")
add("2024-11-18","Push","High Cable Fly","",[(15,20),(10,25),(15,30)],"cable: 40→20, 50→25, 60→30")
add("2024-11-18","Push","Overhead Tricep Ext","",[(20,20),(15,30),(10,40)])
add("2024-11-18","Push","Decline Press","Cables",[(20,35),(20,40),(10,45)],"ea: 70→35, 80→40, 90→45")
add("2024-11-18","Push","Bench Press","Cables",[(15,30),(12,35),(20,30)],"ea: 60→30, 70→35, 60→30")
add("2024-11-18","Push","Incline Press","Cables",[(15,20),(15,15),(20,10)],"ea: 40→20, 30→15, 20→10")
add("2024-11-18","Push","Tricep Pushdowns","Bar",[(20,40),(20,45),(18,50)],"cable: 80→40, 90→45, 100→50")
add("2024-11-18","Push","Wrist Twist","DBs",[(20,40),(20,40)])

# TUES 3 - 2024-11-19 - Pull
add("2024-11-19","Pull","Lat Pulldown","Cables",[(20,45),(20,55),(12,60)],"wide grip: 90→45, 110→55, 120→60 ea")
add("2024-11-19","Pull","Bicep Curls - Preacher","DBs",[(15,20),(10,25),(7,30)],"ea")
add("2024-11-19","Pull","Lat Pulldown","Cables",[(20,30),(20,40),(20,45)],"seated 2handle: 60→30, 80→40, 90→45 ea")
add("2024-11-19","Pull","Lat Pulldown","Cables",[(20,45),(18,50),(12,60)],"close grip: 90→45, 100→50, 120→60")
add("2024-11-19","Pull","Hammer Curls","DBs",[(15,30),(10,35),(8,40)],"ea")
add("2024-11-19","Pull","Lat Pulldown","Cables",[(20,40),(20,50),(18,55)],"V pulldown: 40→40? or 80→40, 100→50, 110→55")
add("2024-11-19","Pull","Cable Rows","",[(20,40),(15,45),(12,50)],"mid row bar: 80ea→40, 90→45, 100→50")
add("2024-11-19","Pull","Cable Curls","",[(15,35),(12,40),(10,45)],"bar: 70→35, 80→40, 90→45")
add("2024-11-19","Pull","Forearm Raise - Cable","",[(20,15),(20,20),(20,25)],"forearm curl")
add("2024-11-19","Pull","Cable Curls","",[(12,20),(15,15),(20,10)],"2 handle each")

# ═══════════════════════════════════════════════════════
# PAGE 7 (2024_2025/7.jpeg) - Thurs (3) - Legs
# Note: "Probation meeting" - session cut short
# ═══════════════════════════════════════════════════════

# THURS 3 - 2024-11-21 - Legs
add("2024-11-21","Legs","Leg Extensions","Cables",[(20,30),(20,40),(20,40)],"1 leg outer")
add("2024-11-21","Legs","Leg Extensions","Cables",[(20,25),(20,50),(20,60),(20,70)],"leg kick: 25x? + 50/60/70 - 4 sets")
add("2024-11-21","Legs","Leg Extensions","Cables",[(20,30),(20,40),(20,50)],"1 leg inner")
add("2024-11-21","Legs","Leg Curls","Cables",[(20,20),(15,30),(10,40)],"lat cable")
add("2024-11-21","Legs","Leg Extensions","",[(25,40),(25,60),(20,80)],"leg ext lat cable")
add("2024-11-21","Legs","DB Calf Raises","DBs",[(60,45),(60,50),(60,52.5)])
add("2024-11-21","Legs","Smith Mach Calf Raises","",[(25,100),(35,120),(35,140)],"cable calf raise")

# ═══════════════════════════════════════════════════════
# PAGE 8 (2024_2025/8.jpeg) - Header: "5 - Nov 25"
# ═══════════════════════════════════════════════════════

# MON 4 - 2024-11-25 - Push (Afternoon)
add("2024-11-25","Push","Incline Press","DBs",[(20,40),(20,45),(10,50)])
add("2024-11-25","Push","Tricep Pushdowns","V-Bar",[(20,50),(15,55),(12,60)],"cable: 100→50, 110→55, 120→60")
add("2024-11-25","Push","Incline Fly","DBs",[(15,25),(15,20),(15,20)])
add("2024-11-25","Push","Tricep Pushdowns","Rope",[(20,30),(20,35),(12,40)],"cable: 60→30, 70→35, 80→40")
add("2024-11-25","Push","Bench Press","Cables",[(20,30),(15,35),(10,40)],"cable: 60ea→30, 70→35, 80→40")
add("2024-11-25","Push","High Cable Fly","",[(15,20),(15,15),(15,10)],"cable: 40ea→20, 30→15, 20→10")
add("2024-11-25","Push","Overhead Tricep Ext","",[(20,20),(15,25),(10,30)],"1 hand tricep")
add("2024-11-25","Push","Decline Press","Cables",[(20,35),(20,40),(15,45)],"cable: 70ea→35, 80→40, 90→45")
add("2024-11-25","Push","Bench Press","Cables",[(12,40),(12,35),(20,30)],"cable press: 80→40, 70→35, 60→30")
add("2024-11-25","Push","Incline Press","Cables",[(20,10),(20,15),(15,20)],"cable: 20→10, 30→15, 40→20")
add("2024-11-25","Push","Tricep Pushdowns","Bar",[(20,30),(20,45),(12,50)],"cable: 60→30, 90→45, 100→50")
add("2024-11-25","Push","Wrist Twist","DBs",[(30,40),(30,40)])

# TUES 4 - 2024-11-26 - Pull (Back Sore note)
add("2024-11-26","Pull","Lat Pulldown","Cables",[(20,45),(20,55),(15,60)],"wide grip: 90→45, 110→55, 120→60 ea")
add("2024-11-26","Pull","Bicep Curls - Preacher","DBs",[(12,25),(8,35),(8,35)],"ea")
add("2024-11-26","Pull","Lat Pulldown","Cables",[(20,30),(20,40),(12,50)],"seated 2handle: 60ea→30, 80→40, 100→50")
add("2024-11-26","Pull","Lat Pulldown","Cables",[(20,45),(20,45),(20,50)],"close grip: 90→45, 90→45, 100→50")
add("2024-11-26","Pull","Hammer Curls","DBs",[(12,30),(10,35),(8,40)],"ea")
add("2024-11-26","Pull","Lat Pulldown","Cables",[(20,20),(20,50),(15,55)],"V pulldown: 40→20?, 100→50, 110→55")
add("2024-11-26","Pull","Cable Rows","",[(20,40),(15,45),(12,50)],"mid row bar: 80ea→40, 90→45, 100→50")
add("2024-11-26","Pull","Cable Curls","",[(15,35),(12,40),(11,45)],"bar: 70→35, 80→40, 90→45")
add("2024-11-26","Pull","Forearm Raise - Cable","",[(20,15),(20,20),(18,25)],"forearm curl")
add("2024-11-26","Pull","Cable Curls","",[(15,20),(20,15),(25,10)],"2 handle each: 40ea→20, 30→15, 20→10")

import json
print(f"Total sets so far: {len(sets)}")
# Save to file
with open("/home/claude/extracted_manual.json", "w") as f:
    json.dump(sets, f, indent=2)
print("Saved to extracted_manual.json")

# ═══════════════════════════════════════════════════════
# PAGE 9 - Wed 4 (2024-11-27) + Thurs 4 (2024-11-28 Thanksgiving)
# ═══════════════════════════════════════════════════════
add("2024-11-27","Legs","Leg Extensions","Cables",[(20,30),(20,40),(20,50)],"1 leg outer")
add("2024-11-27","Legs","Leg Extensions","Cables",[(20,50),(20,60),(20,70)],"leg kick")
add("2024-11-27","Legs","Leg Extensions","Cables",[(20,30),(20,40),(20,50)],"1 leg inner")
add("2024-11-27","Legs","Leg Curls","Cables",[(20,30),(10,40),(8,40)],"lat cable")
add("2024-11-27","Legs","Leg Extensions","",[(25,40),(25,40),(20,60)],"leg ext lat cable")
add("2024-11-27","Legs","Leg Press","",[(20,90),(20,90),(20,90)])
add("2024-11-27","Legs","DB Calf Raises","DBs",[(60,45),(60,50),(60,52.5)])
add("2024-11-27","Legs","Smith Mach Calf Raises","",[(40,120),(40,140),(40,160)],"cable calf raise")

add("2024-11-28","Shoulders","Seated Shoulder Press","DBs",[(20,30),(20,35),(10,40)],"Thanksgiving wkt")
add("2024-11-28","Shoulders","Lat Pulldown","Cables",[(25,40),(25,60),(25,60)],"wide push down")
add("2024-11-28","Shoulders","High Cable Fly","",[(20,30),(20,40),(15,50)],"2 hand crossover ea")
add("2024-11-28","Shoulders","Seated Shoulder Press","Cables",[(20,35),(15,40),(10,45)],"ea: 70→35, 80→40, 90→45")
add("2024-11-28","Shoulders","Face Pulls","",[(25,50),(25,40),(25,60)],"face pull bar")
add("2024-11-28","Shoulders","Lateral Raises","Cables",[(15,30),(15,40),(20,20)],"single arm raise")
add("2024-11-28","Shoulders","Lateral Raises","Cables",[(20,30),(20,40),(20,50)],"raise up bar")
add("2024-11-28","Shoulders","Barbell Shrugs","DBs",[(40,45),(40,50),(40,52.5)],"ea")
add("2024-11-28","Shoulders","Cable Shrugs","",[(50,80),(50,100),(50,120),(50,140)],"4 sets")

# ═══════════════════════════════════════════════════════
# PAGE 10 - Header "6 - Dec 2"
# Mon 5 (2024-12-02) - Sore Back + Tues 5 (2024-12-03) - Sore Back
# ═══════════════════════════════════════════════════════
add("2024-12-02","Push","Incline Press","DBs",[(25,35),(25,40),(19,45),(15,45)],"sore back - 4 sets")
add("2024-12-02","Push","Tricep Pushdowns","V-Bar",[(25,40),(20,45),(20,50)])
add("2024-12-02","Push","Incline Fly","DBs",[(20,20),(20,25),(15,30)])
add("2024-12-02","Push","Tricep Pushdowns","Rope",[(25,30),(18,35),(15,40)])
add("2024-12-02","Push","High Cable Fly","",[(20,40),(18,30),(20,20)])
add("2024-12-02","Push","Bench Press","Cables",[(20,50),(20,60),(15,70)])
add("2024-12-02","Push","Overhead Tricep Ext","",[(15,20),(15,30),(15,40)],"1 hand")
add("2024-12-02","Push","Decline Press","Cables",[(25,60),(20,70),(18,80)])
add("2024-12-02","Push","Bench Press","Cables",[(12,70),(20,60),(15,90)])
add("2024-12-02","Push","Incline Press","Cables",[(25,20),(20,30),(20,40)])
add("2024-12-02","Push","Tricep Pushdowns","Bar",[(25,70),(25,80),(20,90)])
add("2024-12-02","Push","Wrist Twist","DBs",[(30,40),(30,40)])

add("2024-12-03","Pull","Lat Pulldown","Cables",[(20,45),(20,55),(15,65)],"wide grip")
add("2024-12-03","Pull","Bicep Curls - Preacher","DBs",[(15,25),(13,30),(6,35)])
add("2024-12-03","Pull","Lat Pulldown","Cables",[(25,30),(25,40),(20,50)],"2 handle")
add("2024-12-03","Pull","Lat Pulldown","Cables",[(20,45),(20,55),(12,60)],"close grip")
add("2024-12-03","Pull","Hammer Curls","DBs",[(20,25),(20,30),(12,35)])
add("2024-12-03","Pull","Lat Pulldown","Cables",[(25,45),(20,55),(15,60)],"V pull lat")
add("2024-12-03","Pull","Cable Rows","",[(20,40),(15,45),(12,50)],"mid row ea")
add("2024-12-03","Pull","Cable Curls","",[(20,35),(15,40),(15,45)],"EZ curl 15lb wgt")
add("2024-12-03","Pull","Forearm Raise - Cable","",[(25,30),(25,40),(20,50)])
add("2024-12-03","Pull","Cable Curls","",[(15,20),(20,15),(25,10)],"2 handle each")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")

# PAGE 11 - Wed 5 (2024-12-04) + Thurs 5 (2024-12-05) - Sore Back, No Sleep
add("2024-12-04","Legs","Leg Extensions","Cables",[(25,20),(20,40),(20,50)],"1 leg outer")
add("2024-12-04","Legs","Leg Extensions","Cables",[(25,50),(20,60),(20,70)],"leg kick")
add("2024-12-04","Legs","Leg Extensions","Cables",[(20,50),(20,60),(20,70)],"1 leg inner")
add("2024-12-04","Legs","Leg Curls","Cables",[(20,20),(20,25),(20,25)],"lat cable")
add("2024-12-04","Legs","Leg Extensions","",[(25,40),(25,60),(25,80)],"leg ext lat cable")
add("2024-12-04","Legs","Leg Press","",[(20,90),(20,90),(20,90)])
add("2024-12-04","Legs","DB Calf Raises","DBs",[(60,45),(60,50),(60,52.5)])
add("2024-12-04","Legs","Smith Mach Calf Raises","",[(50,60),(50,75),(50,85)],"cable calf raise")

add("2024-12-05","Shoulders","Seated Shoulder Press","DBs",[(20,30),(18,35),(12,40)])
add("2024-12-05","Shoulders","Lat Pulldown","Cables",[(25,35),(20,45),(15,55)],"wide push down")
add("2024-12-05","Shoulders","High Cable Fly","",[(25,15),(20,20),(20,25)],"2 hand crossover ea")
add("2024-12-05","Shoulders","Seated Shoulder Press","Cables",[(20,35),(12,40),(10,45)],"lower ea")
add("2024-12-05","Shoulders","Face Pulls","",[(25,40),(25,50),(25,60)],"bar")
add("2024-12-05","Shoulders","Lateral Raises","Cables",[(15,20),(20,15),(25,10)],"single arm raise")
add("2024-12-05","Shoulders","Lateral Raises","Cables",[(25,20),(25,25),(25,30)],"raise up bar")
add("2024-12-05","Shoulders","Barbell Shrugs","DBs",[(50,20),(50,25),(50,26.5)],"ea")
add("2024-12-05","Shoulders","Cable Shrugs","",[(50,50),(50,70),(50,90)])
add("2024-12-05","Shoulders","Lateral Raises","DBs",[(15,7.5),(20,12.5),(20,10)],"ea raise")

# PAGE 12 - Header "7 - Dec 9" - Mon 6 Sick + Tues 6 Sick
# Right column shows stack weights in parens; left column = actual lb stored
add("2024-12-09","Push","Incline Press","DBs",[(25,35),(20,40),(14,45)])
add("2024-12-09","Push","Tricep Pushdowns","V-Bar",[(25,40),(20,50),(12,60)])
add("2024-12-09","Push","Incline Fly","DBs",[(20,20),(20,25),(20,30)])
add("2024-12-09","Push","Tricep Pushdowns","Rope",[(25,30),(15,35),(12,40)])
add("2024-12-09","Push","High Cable Fly","",[(20,20),(20,15),(20,15)],"ea")
add("2024-12-09","Push","Bench Press","Cables",[(20,25),(20,30),(18,35)],"ea")
add("2024-12-09","Push","Overhead Tricep Ext","",[(25,10),(20,15),(15,20)],"1 hand")
add("2024-12-09","Push","Decline Press","Cables",[(25,30),(20,35),(20,40)],"ea")
add("2024-12-09","Push","Bench Press","Cables",[(20,35),(15,40),(12,45)],"ea press")
add("2024-12-09","Push","Incline Press","Cables",[(25,15),(25,20),(15,25)])
add("2024-12-09","Push","Tricep Pushdowns","Bar",[(30,35),(20,45),(15,50)])
add("2024-12-09","Push","Wrist Twist","DBs",[(50,40),(30,40)])

add("2024-12-10","Pull","Lat Pulldown","Cables",[(25,45),(20,55),(15,65)],"wide")
add("2024-12-10","Pull","Bicep Curls - Preacher","DBs",[(20,20),(15,22.5),(12,25)],"ea")
add("2024-12-10","Pull","Lat Pulldown","Cables",[(25,30),(25,40),(20,50)],"2 handle ea")
add("2024-12-10","Pull","Lat Pulldown","Cables",[(25,45),(20,50),(12,60)],"close grip")
add("2024-12-10","Pull","Hammer Curls","DBs",[(20,25),(12,30),(10,35)])
add("2024-12-10","Pull","Lat Pulldown","Cables",[(20,50),(20,55),(15,62.5)],"V pull lat")
add("2024-12-10","Pull","Cable Rows","",[(18,40),(18,35),(20,30)],"mid row")
add("2024-12-10","Pull","Bicep Curls - Preacher","EZ-Bar",[(20,35),(15,45),(12,55)],"EZ curl")
add("2024-12-10","Pull","Lat Pulldown","Cables",[(20,35),(20,35),(20,35)],"clean back bar")
add("2024-12-10","Pull","Cable Curls","",[(20,35),(15,40),(12,45)],"bar")
add("2024-12-10","Pull","Forearm Raise - Cable","",[(25,15),(20,25),(20,30)])
add("2024-12-10","Pull","Cable Curls","",[(15,20),(20,15),(25,10)],"2 handle ea")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")

# PAGE 13 - Wed 6 (2024-12-11) + Thurs 6 (2024-12-12)
add("2024-12-11","Legs","Leg Extensions","Cables",[(25,15),(25,20),(25,25)],"1 leg outer - testosterone appt day")
add("2024-12-11","Legs","Leg Extensions","Cables",[(25,25),(25,30),(25,35)],"leg kick")
add("2024-12-11","Legs","Leg Extensions","Cables",[(25,25),(25,30),(20,35)],"1 leg inner")
add("2024-12-11","Legs","Leg Curls","Cables",[(25,20),(20,20),(20,20)],"lat cable")
add("2024-12-11","Legs","Leg Extensions","",[(25,50),(25,70),(20,90)],"lat cable leg ext")

add("2024-12-12","Shoulders","Seated Shoulder Press","DBs",[(25,30),(20,35),(11,40)])
add("2024-12-12","Shoulders","Lat Pulldown","Cables",[(25,35),(25,45),(18,55)],"wide push down")
add("2024-12-12","Shoulders","High Cable Fly","",[(25,15),(25,20),(15,25)],"2 hand cross ea")
add("2024-12-12","Shoulders","Bent Over Rows","DBs",[(25,10),(25,15),(20,17.5)],"forward back")
add("2024-12-12","Shoulders","Seated Shoulder Press","Cables",[(25,25),(23,35),(15,40)],"ea")
add("2024-12-12","Shoulders","Face Pulls","",[(25,50),(25,60),(20,70)],"bar ea")
add("2024-12-12","Shoulders","Lateral Raises","Cables",[(20,10),(15,15),(15,20)],"1 arm raise")
add("2024-12-12","Shoulders","Lateral Raises","Cables",[(25,25),(25,30),(15,35)],"raise up bar")
add("2024-12-12","Shoulders","Barbell Shrugs","DBs",[(50,52.5),(50,52.5),(50,52.5)])
add("2024-12-12","Shoulders","Cable Shrugs","",[(50,70),(50,90),(50,100)])
add("2024-12-12","Shoulders","Lateral Raises","DBs",[(20,10),(15,12.5),(15,15)],"ea raise")

# PAGE 14 - Header "8 - Dec 16" - Mon 7 + Tues 7
add("2024-12-16","Push","Incline Press","DBs",[(25,40),(15,45),(9,50)])
add("2024-12-16","Push","Tricep Pushdowns","V-Bar",[(25,50),(15,60),(8,70)])
add("2024-12-16","Push","Incline Fly","DBs",[(15,30),(12,35),(10,40)])
add("2024-12-16","Push","Tricep Pushdowns","Rope",[(18,35),(15,40),(10,45)])
add("2024-12-16","Push","High Cable Fly","",[(20,20),(15,25),(12,30)])
add("2024-12-16","Push","Bench Press","Cables",[(25,30),(18,35),(12,40)])
add("2024-12-16","Push","Overhead Tricep Ext","",[(20,15),(15,20),(10,25)],"1 hand")
add("2024-12-16","Push","Decline Press","Cables",[(25,35),(25,40),(12,45)])
add("2024-12-16","Push","Bench Press","Cables",[(10,35),(10,40),(8,45)],"press")
add("2024-12-16","Push","Incline Press","Cables",[(20,20),(20,25),(15,30)])
add("2024-12-16","Push","Tricep Pushdowns","Bar",[(30,40),(20,45),(15,50)])
add("2024-12-16","Push","Wrist Twist","DBs",[(50,40),(30,40)])

add("2024-12-17","Pull","Lat Pulldown","Cables",[(25,50),(18,60),(10,70)],"wide - stack 100/120/140")
add("2024-12-17","Pull","Bicep Curls - Preacher","DBs",[(20,20),(14,22.5),(9,25)])
add("2024-12-17","Pull","Lat Pulldown","Cables",[(25,40),(25,50),(15,60)],"2 handle")
add("2024-12-17","Pull","Lat Pulldown","Cables",[(20,50),(15,60),(10,65)],"close grip")
add("2024-12-17","Pull","Hammer Curls","DBs",[(25,25),(12,30),(8,35)])
add("2024-12-17","Pull","Lat Pulldown","Cables",[(25,50),(18,60),(12,65)],"V pull")
add("2024-12-17","Pull","Cable Rows","",[(20,30),(20,35),(20,40)],"mid row")
add("2024-12-17","Pull","Bicep Curls - Preacher","EZ-Bar",[(25,35),(20,45),(15,55)],"EZ curl")
add("2024-12-17","Pull","Bicep Curls - Preacher","EZ-Bar",[(20,45),(20,45),(20,45)],"EZ back cast")
add("2024-12-17","Pull","Cable Curls","",[(20,40),(12,45),(10,50)],"bar")
add("2024-12-17","Pull","Forearm Raise - Cable","",[(25,20),(20,25),(18,30)])
add("2024-12-17","Pull","Cable Curls","",[(13,20),(18,15),(25,10)],"2 hand")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")

# PAGE 15 - Wed 7 (2024-12-18) + Thurs 7 (2024-12-19)
add("2024-12-18","Legs","Leg Extensions","Cables",[(25,20),(25,25),(20,30)],"1 leg outer")
add("2024-12-18","Legs","Leg Extensions","Cables",[(30,30),(25,40),(25,45)],"leg kick")
add("2024-12-18","Legs","Leg Extensions","Cables",[(25,30),(25,35),(15,40)],"1 leg inner")
add("2024-12-18","Legs","Leg Press","",[(20,35),(20,35),(20,35)],"squats 15lb bar")
add("2024-12-18","Legs","Leg Curls","Cables",[(25,20),(25,20),(25,20)],"lat cable")
add("2024-12-18","Legs","Leg Extensions","",[(25,60),(22,80),(15,90)],"leg ext lat cable")

add("2024-12-19","Shoulders","Seated Shoulder Press","DBs",[(25,35),(18,40),(8,45)])
add("2024-12-19","Shoulders","Lat Pulldown","Cables",[(25,45),(20,55),(10,65)],"wide press down")
add("2024-12-19","Shoulders","High Cable Fly","",[(25,20),(25,25),(15,30)],"2 hand cross ea")
add("2024-12-19","Shoulders","Bent Over Rows","DBs",[(25,15),(25,17.5),(20,20)],"forward back")
add("2024-12-19","Shoulders","Seated Shoulder Press","Cables",[(25,35),(25,40),(20,45)])
add("2024-12-19","Shoulders","Face Pulls","",[(25,60),(25,80),(18,90)])
add("2024-12-19","Shoulders","Lateral Raises","Cables",[(15,10),(15,10),(15,10)],"1 arm raise")
add("2024-12-19","Shoulders","Lateral Raises","Cables",[(20,30),(15,35),(15,40)],"raise up bar")
add("2024-12-19","Shoulders","Barbell Shrugs","DBs",[(50,52.5),(50,52.5),(50,52.5)])
add("2024-12-19","Shoulders","Cable Shrugs","",[(50,90),(50,105),(50,115),(50,115)],"4 sets")

# PAGE 16 - Header "9 - Dec 23" - Mon 8 (2024-12-23) + Tues 8 (2024-12-24)
add("2024-12-23","Push","Incline Press","DBs",[(25,40),(18,45),(10,50)])
add("2024-12-23","Push","Tricep Pushdowns","V-Bar",[(20,60),(15,65),(11,70)])
add("2024-12-23","Push","Incline Fly","DBs",[(20,30),(15,35),(12,40)])
add("2024-12-23","Push","Tricep Pushdowns","Rope",[(25,35),(18,40),(12,45)])
add("2024-12-23","Push","High Cable Fly","",[(25,20),(15,25),(8,30)],"ea")
add("2024-12-23","Push","Bench Press","Cables",[(18,35),(10,40),(6,45)])
add("2024-12-23","Push","Overhead Tricep Ext","",[(25,15),(17,20),(11,25)],"1 hand")
add("2024-12-23","Push","Decline Press","Cables",[(25,40),(20,45),(12,50)])
add("2024-12-23","Push","Bench Press","Cables",[(25,35),(20,40),(15,45)],"press")
add("2024-12-23","Push","Incline Press","Cables",[(15,25),(18,20),(20,15)])
add("2024-12-23","Push","Wrist Twist","DBs",[(35,40),(35,40)])

add("2024-12-24","Pull","Lat Pulldown","Cables",[(25,60),(18,65),(10,70)],"wide")
add("2024-12-24","Pull","Bicep Curls - Preacher","DBs",[(20,20),(18,22.5),(11,25)])
add("2024-12-24","Pull","Lat Pulldown","Cables",[(25,50),(19,60),(10,70)],"2 handle")
add("2024-12-24","Pull","Lat Pulldown","Cables",[(25,50),(15,60),(10,65)],"close grip")
add("2024-12-24","Pull","Hammer Curls","DBs",[(20,25),(12,30),(9,35)])
add("2024-12-24","Pull","Lat Pulldown","Cables",[(20,60),(15,65),(10,70)],"V pull")
add("2024-12-24","Pull","Cable Rows","",[(25,35),(25,45),(25,55)],"mid row")
add("2024-12-24","Pull","Bicep Curls - Preacher","EZ-Bar",[(25,35),(20,45),(12,55)],"EZ curl")
add("2024-12-24","Pull","Bicep Curls - Preacher","EZ-Bar",[(20,45),(20,45),(20,45)],"EZ back cast")
add("2024-12-24","Pull","Cable Curls","",[(25,40),(15,45),(10,55)],"bar")
add("2024-12-24","Pull","Forearm Raise - Cable","",[(25,25),(20,30),(15,35)])
add("2024-12-24","Pull","Cable Curls","",[(15,20),(20,15),(25,15)],"2 handle")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")

# PAGE 17 - Wed Xmas (2024-12-25) + Thurs 8 (2024-12-26)
add("2024-12-25","Legs","Leg Extensions","Cables",[(25,25),(25,25),(25,40)],"1 leg outer")
add("2024-12-25","Legs","Leg Extensions","Cables",[(25,35),(25,45),(25,50)],"leg kick")
add("2024-12-25","Legs","Leg Extensions","Cables",[(25,40),(25,35),(25,30)],"1 leg inner")
add("2024-12-25","Legs","Leg Press","",[(25,35),(25,55),(25,55),(25,55)],"squats bar 35lb")
add("2024-12-25","Legs","Leg Curls","Cables",[(25,20),(25,20),(25,20)],"lat cable")
add("2024-12-25","Legs","Leg Extensions","",[(25,70),(25,80),(25,90)],"lat cable leg ext")
add("2024-12-25","Legs","Leg Press","",[(20,125),(20,125),(20,125)],"35lb plates")
add("2024-12-25","Legs","DB Calf Raises","DBs",[(60,52.5),(60,52.5),(60,52.5)])
add("2024-12-25","Legs","Smith Mach Calf Raises","",[(50,75),(50,90),(50,100)],"cable calf raise")

add("2024-12-26","Shoulders","Seated Shoulder Press","DBs",[(20,40),(20,40),(10,45)])
add("2024-12-26","Shoulders","Lat Pulldown","Cables",[(25,50),(15,60),(8,70)],"wide grip press down")
add("2024-12-26","Shoulders","High Cable Fly","",[(25,25),(20,30),(15,35)],"2 hand cross")
add("2024-12-26","Shoulders","Bent Over Rows","DBs",[(20,12.5),(20,20),(20,22.5)],"forward n back")
add("2024-12-26","Shoulders","Seated Shoulder Press","Cables",[(25,40),(20,45),(12,50)])
add("2024-12-26","Shoulders","Face Pulls","",[(25,70),(20,90),(18,100)])
add("2024-12-26","Shoulders","Lateral Raises","Cables",[(20,10),(20,10),(20,10)],"1 arm")
add("2024-12-26","Shoulders","Bicep Curls - Preacher","EZ-Bar",[(25,45),(25,45),(25,45)],"EZ raise 15lb")
add("2024-12-26","Shoulders","Barbell Shrugs","DBs",[(50,52.5),(50,52.5),(50,52.5)])
add("2024-12-26","Shoulders","Lateral Raises","Cables",[(20,25),(20,25),(20,25)],"raise up bar")
add("2024-12-26","Shoulders","Cable Shrugs","",[(50,100),(50,109),(50,119)])

# PAGE 18 - Header "10 - Dec 30" - Mon 9 + Tues 12/31
add("2024-12-30","Push","Incline Press","DBs",[(25,40),(20,45),(12,50)])
add("2024-12-30","Push","Tricep Pushdowns","V-Bar",[(25,60),(15,65),(12,70)])
add("2024-12-30","Push","Incline Fly","DBs",[(20,30),(20,35),(15,40)])
add("2024-12-30","Push","Tricep Pushdowns","Rope",[(25,35),(20,40),(20,45)])
add("2024-12-30","Push","High Cable Fly","",[(25,20),(20,25),(15,30)],"ea")
add("2024-12-30","Push","Bench Press","Cables",[(25,35),(20,40),(18,45)])
add("2024-12-30","Push","Overhead Tricep Ext","",[(25,15),(25,20),(18,25)],"1 hand")
add("2024-12-30","Push","Decline Press","Cables",[(25,45),(19,50),(15,55)])
add("2024-12-30","Push","Incline Press","Cables",[(20,25),(25,20),(25,15)])
add("2024-12-30","Push","Tricep Pushdowns","Rope",[(25,30),(20,35),(15,40)],"tricep rope press")
add("2024-12-30","Push","Wrist Twist","DBs",[(40,40),(40,40)])

add("2024-12-31","Pull","Lat Pulldown","Cables",[(25,65),(15,70),(10,75)],"wide - court day")
add("2024-12-31","Pull","Bicep Curls - Preacher","DBs",[(20,20),(15,22.5),(12,25)])
add("2024-12-31","Pull","Lat Pulldown","Cables",[(25,50),(20,60),(15,70)],"2 hand")
add("2024-12-31","Pull","Lat Pulldown","Cables",[(25,55),(15,65),(10,75)],"close pull")
add("2024-12-31","Pull","Hammer Curls","DBs",[(25,25),(14,30),(12,35)])
add("2024-12-31","Pull","Lat Pulldown","Cables",[(20,65),(18,70),(12,75)],"V pull")
add("2024-12-31","Pull","Cable Rows","",[(25,45),(18,55),(12,60)],"mid row")
add("2024-12-31","Pull","Bicep Curls - Preacher","EZ-Bar",[(20,45),(14,55),(9,60)],"EZ curl")
add("2024-12-31","Pull","Bicep Curls - Preacher","EZ-Bar",[(25,60),(25,60),(25,60)],"EZ back cast")
add("2024-12-31","Pull","Cable Curls","",[(15,45),(12,50),(10,55)],"bar")
add("2024-12-31","Pull","Forearm Raise - Cable","",[(25,25),(20,30),(18,35)])
add("2024-12-31","Pull","Cable Curls","",[(15,20),(20,15),(17,15)],"2 hand")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")

# PAGE 19 - Wed 1/1/2025 (sore glutes) + Thurs 1/2
add("2025-01-01","Legs","Leg Extensions","Cables",[(25,25),(25,25),(25,25)],"1 leg outer")
add("2025-01-01","Legs","Leg Extensions","Cables",[(25,40),(25,45),(25,50)],"leg kick")
add("2025-01-01","Legs","Leg Extensions","Cables",[(25,30),(25,30),(25,30)],"1 leg inner")
add("2025-01-01","Legs","Leg Press","",[(25,55),(25,55),(25,55)],"squats 35lb")
add("2025-01-01","Legs","Leg Curls","Cables",[(25,30),(20,30),(15,30)],"lat cable")
add("2025-01-01","Legs","Leg Extensions","",[(25,70),(25,80),(25,90)],"lat cable")
add("2025-01-01","Legs","Leg Press","",[(25,105),(25,105),(25,105)],"35lb plates")
add("2025-01-01","Legs","DB Calf Raises","DBs",[(60,52.5),(60,52.5),(60,52.5)])
add("2025-01-01","Legs","Smith Mach Calf Raises","",[(50,75),(50,90),(50,100)])

add("2025-01-02","Shoulders","Seated Shoulder Press","DBs",[(25,40),(25,35),(13,35)])
add("2025-01-02","Shoulders","Lat Pulldown","Cables",[(25,50),(15,60),(8,70)],"wide")
add("2025-01-02","Shoulders","High Cable Fly","",[(25,25),(20,30),(20,35)],"2 hand cross")
add("2025-01-02","Shoulders","Bent Over Rows","DBs",[(25,12.5),(25,20),(20,22.5)],"forward n back")
add("2025-01-02","Shoulders","Seated Shoulder Press","Cables",[(25,40),(18,45),(12,50)],"ea")
add("2025-01-02","Shoulders","Face Pulls","",[(25,70),(25,90),(18,100)])
add("2025-01-02","Shoulders","Lateral Raises","Cables",[(25,10),(20,10),(20,10)],"1 arm")
add("2025-01-02","Shoulders","Bicep Curls - Preacher","EZ-Bar",[(25,45),(25,45),(25,45)],"EZ raise 15lb 25lb plates")
add("2025-01-02","Shoulders","Barbell Shrugs","DBs",[(50,52.5),(50,52.5),(50,52.5)])
add("2025-01-02","Shoulders","Lateral Raises","Cables",[(20,25),(20,20),(25,18)],"raise up")
add("2025-01-02","Shoulders","Cable Shrugs","",[(50,100),(50,119),(50,139)])

# PAGE 20 - Header "11 - Jan 6" - Mon 10 (2025-01-06) + Tues (2025-01-07)
add("2025-01-06","Push","Incline Press","DBs",[(25,40),(20,45),(18,50)])
add("2025-01-06","Push","Tricep Pushdowns","V-Bar",[(25,60),(17,65),(14,70)])
add("2025-01-06","Push","Incline Fly","DBs",[(25,30),(20,35),(15,40)])
add("2025-01-06","Push","Tricep Pushdowns","Rope",[(25,35),(25,40),(20,45)])
add("2025-01-06","Push","High Cable Fly","",[(25,20),(20,25),(15,30)],"ea")
add("2025-01-06","Push","Bench Press","Cables",[(25,35),(25,40),(18,45)])
add("2025-01-06","Push","Overhead Tricep Ext","",[(25,15),(25,20),(18,25)],"1 hand")
add("2025-01-06","Push","Decline Press","Cables",[(25,40),(15,50),(15,55)])
add("2025-01-06","Push","Low Cable Fly","",[(20,20),(20,20),(20,20)],"decline fly ea")
add("2025-01-06","Push","Lateral Raises","Cables",[(25,15),(20,20),(18,25)],"incline raise")
add("2025-01-06","Push","Incline Fly","Cables",[(15,15),(15,15),(15,15)],"incline fly cable")
add("2025-01-06","Push","Tricep Pushdowns","Rope",[(25,30),(20,35),(12,40)],"press down rope")
add("2025-01-06","Push","Wrist Twist","DBs",[(40,40),(40,40)])

add("2025-01-07","Pull","Lat Pulldown","Cables",[(25,65),(15,70),(10,75)],"wide")
add("2025-01-07","Pull","Bicep Curls - Preacher","DBs",[(20,20),(15,25),(8,25)])
add("2025-01-07","Pull","Lat Pulldown","Cables",[(25,50),(20,60),(12,70)],"2 hand")
add("2025-01-07","Pull","Lat Pulldown","Cables",[(20,55),(15,65),(9,75)],"close grip")
add("2025-01-07","Pull","Hammer Curls","DBs",[(23,25),(15,30),(10,35)])
add("2025-01-07","Pull","Lat Pulldown","Cables",[(25,65),(15,70),(12,75)],"V pull")
add("2025-01-07","Pull","Cable Rows","",[(25,45),(19,50),(15,55)],"mid row")
add("2025-01-07","Pull","Bicep Curls - Preacher","EZ-Bar",[(20,45),(15,55),(12,60)])
add("2025-01-07","Pull","Cable Curls","",[(15,45),(12,50),(10,55)],"bar")
add("2025-01-07","Pull","Forearm Raise - Cable","",[(25,25),(22,30),(18,35)])
add("2025-01-07","Pull","Cable Curls","",[(18,15),(15,15),(15,15)],"2 hand")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")

# PAGE 21 - Wed 1/8 (2025-01-08) + Thurs (2025-01-09)
add("2025-01-08","Legs","Leg Extensions","Cables",[(25,25),(25,25),(25,25)],"1 leg outer")
add("2025-01-08","Legs","Leg Extensions","Cables",[(25,40),(25,45),(25,50)],"leg kick")
add("2025-01-08","Legs","Leg Extensions","Cables",[(25,30),(25,30),(25,30)],"1 leg inner")
add("2025-01-08","Legs","Leg Press","",[(25,55),(25,55),(25,55)],"squats 35lb")
add("2025-01-08","Legs","Leg Curls","Cables",[(25,30),(25,30),(25,30)],"lat cable")
add("2025-01-08","Legs","Leg Extensions","",[(25,70),(25,80),(25,90)],"lat cable")
add("2025-01-08","Legs","Leg Press","",[(25,105),(25,105),(25,105)],"35lb plates")
add("2025-01-08","Legs","DB Calf Raises","DBs",[(60,50),(60,50),(60,50)])
add("2025-01-08","Legs","Bicep Curls - Preacher","EZ-Bar",[(25,45),(25,45),(25,45)],"EZ raise 15lb bar")
add("2025-01-08","Legs","Smith Mach Calf Raises","",[(50,90),(50,100),(50,109)])

add("2025-01-09","Shoulders","Seated Shoulder Press","DBs",[(25,35),(18,35),(18,35)])
add("2025-01-09","Shoulders","Lat Pulldown","Cables",[(25,50),(18,60),(5,70)],"wide press down")
add("2025-01-09","Shoulders","High Cable Fly","",[(25,20),(20,30),(25,35)],"2 hand cross")
add("2025-01-09","Shoulders","Bent Over Rows","DBs",[(25,15),(25,20),(20,25)],"back n forth")
add("2025-01-09","Shoulders","Seated Shoulder Press","Cables",[(25,40),(25,45),(15,50)],"ea")
add("2025-01-09","Shoulders","Face Pulls","",[(25,70),(25,90),(20,100)])
add("2025-01-09","Shoulders","Lateral Raises","Cables",[(25,10),(25,10),(25,10)],"1 arm")
add("2025-01-09","Shoulders","Bicep Curls - Preacher","EZ-Bar",[(25,45),(25,45),(25,45)],"EZ raise 15lb")
add("2025-01-09","Shoulders","Barbell Shrugs","DBs",[(50,52.5),(50,50),(50,50)])
add("2025-01-09","Shoulders","Lateral Raises","Cables",[(20,15),(20,15),(20,15)],"raise up bar")
add("2025-01-09","Shoulders","Cable Shrugs","",[(50,100),(50,119),(50,129)])

# PAGE 22 - Header "12 - Jan 13" - Mon 1/13 + Tues 1/14
add("2025-01-13","Push","Incline Press","DBs",[(25,40),(15,45),(10,50)])
add("2025-01-13","Push","Tricep Pushdowns","V-Bar",[(25,60),(15,65),(12,70)])
add("2025-01-13","Push","Incline Fly","DBs",[(20,30),(20,30),(20,30)])
add("2025-01-13","Push","Tricep Pushdowns","Rope",[(25,35),(25,40),(20,45)])
add("2025-01-13","Push","High Cable Fly","",[(25,20),(25,25),(15,30)])
add("2025-01-13","Push","Bench Press","Cables",[(20,35),(18,40),(15,45)])
add("2025-01-13","Push","Overhead Tricep Ext","",[(25,15),(25,20),(20,25)],"1 hand")
add("2025-01-13","Push","Decline Press","Cables",[(25,40),(22,50),(11,55)])
add("2025-01-13","Push","Low Cable Fly","",[(25,20),(25,20),(25,20)],"decline fly")
add("2025-01-13","Push","Tricep Pushdowns","Rope",[(25,30),(18,35),(12,40)],"rope press")
add("2025-01-13","Push","Incline Press","Cables",[(25,15),(20,20),(15,25)])
add("2025-01-13","Push","Incline Fly","Cables",[(20,15),(15,15),(15,15)])
add("2025-01-13","Push","Overhead Tricep Ext","DBs",[(25,15),(25,10),(25,5)],"drop set")
add("2025-01-13","Push","Wrist Twist","DBs",[(50,40),(50,40)])

add("2025-01-14","Pull","Lat Pulldown","Cables",[(25,65),(15,70),(10,75)],"wide")
add("2025-01-14","Pull","Bicep Curls - Preacher","DBs",[(20,20),(15,20),(12,20)])
add("2025-01-14","Pull","Lat Pulldown","Cables",[(25,50),(20,60),(15,70)],"2 hand")
add("2025-01-14","Pull","Lat Pulldown","Cables",[(18,55),(18,50),(18,45)],"close grip going down")
add("2025-01-14","Pull","Hammer Curls","DBs",[(22,25),(12,30),(10,35)])
add("2025-01-14","Pull","Lat Pulldown","Cables",[(20,60),(20,60),(20,60)],"V pull")
add("2025-01-14","Pull","Cable Rows","",[(20,45),(18,45),(15,45)],"mid row")
add("2025-01-14","Pull","Bicep Curls - Preacher","EZ-Bar",[(20,48),(12,55),(10,60)])
add("2025-01-14","Pull","Cable Curls","",[(15,45),(12,50),(9,55)],"bar")
add("2025-01-14","Pull","Forearm Raise - Cable","",[(25,20),(22,25),(18,30)])
add("2025-01-14","Pull","Cable Curls","",[(15,15),(10,15),(5,15)],"DB drop set")
add("2025-01-14","Pull","Cable Curls","",[(20,15),(20,15),(20,15)],"2 hand")

import json
with open("/home/claude/extracted_manual.json","w") as f: json.dump(sets,f,indent=2)
print(f"Total sets: {len(sets)}")
