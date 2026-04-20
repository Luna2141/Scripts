function generateFullSchoolRepairSummary() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Data Source page and settings
    var sourceSheetName = "25-26 VILS";
    var summarySheetName = "Admin Repair Dashboard";

    var sourceSheet = ss.getSheetByName(sourceSheetName);
    var data = sourceSheet.getDataRange().getValues();

    // 2. Setup the Admin Page
    var reportSheet = ss.getSheetByName(summarySheetName);
    if (reportSheet) {
        reportSheet.clear();
    } else {
        reportSheet = ss.insertSheet(summarySheetName);
    }

    // Maps Grad Year to Grade level for 25-26 school year
    var gradeMap = {
        2026: "12th Grade (Sr High)",
        2027: "11th Grade (Sr High)",
        2028: "10th Grade (Sr High)",
        2029: "9th Grade (Sr High)",
        2030: "8th Grade (Jr High)",
        2031: "7th Grade (Jr High)",
        2032: "6th Grade (Jr High)"
    };

    // Setup storage for each grade group
    var schoolData = {};
    Object.values(gradeMap).forEach(function(label) { schoolData[label] = {}; });

    var partCounts = {
        "Screen": 0, "Top Cover": 0, "Bottom Cover":0, "Motherboard":0, "Daughter board":0, "Keyboard Assembly": 0, "Keys": 0,
        "Left Hinge": 0, "Right Hinge": 0, "Camera": 0, "Handle": 0, "Battery": 0, "Screen Cable":0, "Hinge screws":0,
        "Bezel":0, "Glitch":0, "Biohazard":0
    };

    // 3. Data Processing Logic
    for (var i = 1; i < data.length; i++) {
        var date = data[i][0];    // Col A
        var gradYear = data[i][2]; // Col C
        var name = data[i][4];    // Col E
        var damage = data[i][7].toString(); // Col H - Ensure it's a string

        if (!name || !damage || !gradeMap[gradYear]) continue;

        var gradeLabel = gradeMap[gradYear];
        var targetGroup = schoolData[gradeLabel];

        // ---- Part Counting ----
        // Sorts for damaged part name
        var rowPartCount = 0;
        Object.keys(partCounts).forEach(function(partName) {
            var regex = new RegExp(partName, 'gi');
            var matches = damage.match(regex);
            if (matches) {
                partCounts[partName] += matches.length;
                rowPartCount += matches.length;
            }
        });

        // --- STUDENT AGGREGATION ---
        if (!targetGroup[name]) {
            targetGroup[name] = {
                damages: [damage],
                dates: [Utilities.formatDate(new Date(date), ss.getSpreadsheetTimeZone(), "MM/dd/yy")],
                repairEvents: 1,
                totalParts: rowPartCount
            };
        } else {
            targetGroup[name].damages.push(damage);
            targetGroup[name].dates.push(Utilities.formatDate(new Date(date), ss.getSpreadsheetTimeZone(), "MM/dd/yy"));
            targetGroup[name].repairEvents += 1;
            targetGroup[name].totalParts += rowPartCount;
        }
    }

    // 4. Create the Row Data and write to Dashboard
    var currentRow = 1;

    // Adds a timestamp for administration
    var timestamp = "Dashboard Last Updated: " + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "MMMM dd, yyyy - HH:mm");
    reportSheet.getRange(currentRow, 1).setValue(timestamp).setFontStyle("italic");
    currentRow += 2;

    // Sorting list to ensure 12th grade shows first down to 6th
    var sortedGrades = ["12th Grade (Sr High)", "11th Grade (Sr High)", "10th Grade (Sr High)",
        "9th Grade (Sr High)", "8th Grade (Jr High)", "7th Grade (Jr High)", "6th Grade (Jr High)"];

    sortedGrades.forEach(function(gradeLabel) {
        var groupObj = schoolData[gradeLabel];
        var studentNames = Object.keys(groupObj).sort();

        if (studentNames.length === 0) return; // Skips grades with no data

        // Header Color (Blue for Sr High, Green for Jr High)
        var sectionColor = gradeLabel.includes("Sr High") ? "#0b5394" : "#38761d";

        // Section Header formatting
        reportSheet.getRange(currentRow, 1, 1, 5).merge()
            .setValue(gradeLabel.toUpperCase()).setBackground(sectionColor).setFontColor("white")
            .setFontWeight("bold").setHorizontalAlignment("center");
        currentRow++;

        // Headers for the Admin view
        var headers = [["Student Name", "History of Damage", "Log Dates", "Repair Count", "Total Parts"]];
        reportSheet.getRange(currentRow, 1, 1, 5).setValues(headers).setFontWeight("bold").setBackground("#f3f3f3");
        currentRow++;

        var rows = studentNames.map(function(name) {
            return [
                name,
                groupObj[name].damages.join(" | "),
                groupObj[name].dates.join(", "),
                groupObj[name].repairEvents,
                groupObj[name].totalParts
            ];
        });

        // 5. Create new section to write output to
        reportSheet.getRange(currentRow, 1, rows.length, 5).setValues(rows);
        // Adds stripes for better readability
        reportSheet.getRange(currentRow, 1, rows.length, 5).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

        currentRow += rows.length + 2;
    });

    // 6. Append the Part Inventory at the bottom
    reportSheet.getRange(currentRow, 1).setValue("REPAIRED PART TOTALS").setFontWeight("bold").setFontSize(12).setFontColor("red");

    var inventoryData = [];
    Object.keys(partCounts).forEach(function(key) {
        inventoryData.push([key, partCounts[key]]);
    });

    reportSheet.getRange(currentRow + 1, 1, inventoryData.length, 2)
        .setValues(inventoryData)
        .setBorder(true, true, true, true, true, true);

    reportSheet.autoResizeColumns(1, 5);
}