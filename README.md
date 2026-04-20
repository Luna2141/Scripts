# IT Workflow Scripts

This repository is a collection of scripts and programs developed to automate hardware intake and data management. While originally built for school environments, these tools are open-source and can be adapted for various inventory or repair workflows.

## Project Structure
* Every script is organized in its own directory.
* Tools include documentation and commented code explaining the underlying logic.
* You are encouraged to fork the repo and modify the variables to fit your specific data headers and part categories.

---

## Admin Repair Dashboard (Google Apps Script)

This script parses a raw hardware intake log and generates a formatted dashboard for administrators. It automates the process of grouping data by specific categories (such as grade levels) and tracking recurring repair trends.

### Core Logic
* **Data Mapping:** Automatically maps numerical identifiers (like graduation years) to custom labels.
* **Keyword Detection:** Scans damage descriptions for specific keywords to provide a total count of parts replaced or repaired.
* **Individual Aggregation:** Combines multiple entries for a single user into one row, displaying their full history, event dates, and total part counts.
* **Dynamic Formatting:** Clears and rebuilds a dashboard sheet with color-coded headers, row banding, and automated column resizing for readability.

### Requirements
The script expects a source sheet containing raw data. To function correctly, your sheet should include the following data points:
* **Date:** The date the repair was logged.
* **Grad Year:** Used for mapping students to their respective grade levels.
* **Student Name:** The full name of the individual associated with the device.
* **Damage Description:** A text field where the script scans for specific hardware keywords (e.g., Screen, Keyboard).

### Setup and Usage
1. Open your Google Sheet and navigate to **Extensions > Apps Script**.
2. Create a new script file and paste the code from this repository.
3. Update the configuration variables at the top of the script to match your specific sheet names and column indices.
4. Run the main function to generate the dashboard.
5. Optional: Assign the script to a button (Insert > Drawing) to refresh the dashboard on demand.
