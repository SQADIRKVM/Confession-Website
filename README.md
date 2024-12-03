# Confession-Website  

A modern platform for anonymous confessions, built using **HTML**, **CSS**, **JavaScript**, **Bootstrap**, and **Google Sheets** as the database. This website leverages **Google Apps Script** to handle data submission and retrieval. It also provides features like sharing, downloading confessions, and live updates on the total number of confessions.  

---

## Features  

- **Anonymous Confessions**: Users can submit confessions securely and anonymously.  
- **Google Sheets Integration**: Confessions are stored and retrieved using Google Sheets.  
- **Display Confessions**: Submitted confessions are displayed dynamically on the website.  
- **Total Confession Count**: Shows the total number of confessions submitted.  
- **Share & Download Confessions**: Users can share individual confessions or download them as a file.  
- **SweetAlert.js Popups**: Provides interactive and visually appealing popups for confirmations and alerts.  
- **Responsive Design**: Built with Bootstrap to ensure compatibility across devices.  

---

## Technologies Used  

- **Frontend**:  
  - HTML, CSS, JavaScript  
  - Bootstrap for responsive design  
  - SweetAlert.js for popups  

- **Backend**:  
  - Google Sheets as the database  
  - Google Apps Script for handling form submissions and data retrieval  

---

## Setup Instructions  

1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/yourusername/Confession-Website.git  
   cd Confession-Website  
   ```  

2. **Set Up Google Sheets**:  
   - Create a new Google Sheet for storing confessions.  
   - Open **Extensions > Apps Script** in the sheet.  
   - Copy and paste the provided Google Apps Script code (found in `gscript.js`) into the editor.  
   - Deploy the script as a web app and note the generated URL.  

3. **Update the Web App URL**:  
   - In `script.js`, locate the following line:  
     ```javascript
     fetch('your url', {
     ```
   - Replace the URL with your own Google Apps Script web app URL.  

4. **Open the Website**:  
   Open `index.html` in your browser to start using the website.  

---

## Usage  

- **Submit a Confession**: Enter your confession and click submit. A popup will confirm successful submission.  
- **View Confessions**: The website dynamically displays confessions fetched from Google Sheets.  
- **Total Confessions**: A live counter updates with the total number of confessions.  
- **Share Confessions**: Use the "Share" button to share individual confessions.  
- **Download Confessions**: Click "Download" to save all confessions to a file.  

---

## Contribution  

We welcome contributions!  
1. Fork the repository.  
2. Create a new branch:  
   ```bash  
   git checkout -b feature/YourFeatureName  
   ```  
3. Commit your changes:  
   ```bash  
   git commit -m "Add your feature description"  
   ```  
4. Push to the branch:  
   ```bash  
   git push origin feature/YourFeatureName  
   ```  
5. Submit a pull request.  

---

## License  
This project is licensed under the [MIT License](LICENSE).  

---

## Contact  
For questions or suggestions, feel free to open an issue or contact the maintainer: [yourusername](https://github.com/sqadirkvm).  

