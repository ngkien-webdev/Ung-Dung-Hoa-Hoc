
# Chemistry Explorer - Offline Installation Guide

This document provides instructions for installing and running the Chemistry Explorer application in Windows without requiring an internet connection.

## Prerequisites

1. **Windows PC** (Windows 10/11 recommended)
2. **Node.js** (version 16 or higher)
3. **Git** (optional, for version control)

## Installation Steps

### Method 1: Using the Installation Package

1. **Download the Installation Package**
   - Download the `chemistry-explorer-offline-setup.zip` from our website
   - Extract the ZIP file to a location of your choice

2. **Run the Setup Script**
   - Navigate to the extracted folder
   - Double-click on `setup.bat`
   - This will install all necessary dependencies and configure the app for offline use

3. **Launch the Application**
   - After installation completes, a shortcut will be created on your desktop
   - Double-click the shortcut to launch the application
   - The app will open in your default browser

### Method 2: Manual Installation

1. **Clone or Download the Repository**
   ```
   git clone https://github.com/chemistry-explorer/app.git
   ```
   Or download and extract the ZIP file from our repository

2. **Install Dependencies**
   - Open Command Prompt in the project directory
   - Run the following commands:
   ```
   npm install
   ```

3. **Build the Application**
   ```
   npm run build
   ```

4. **Install the Local Server**
   ```
   npm install -g serve
   ```

5. **Run the Application Locally**
   ```
   serve -s build
   ```

6. **Access the Application**
   - Open your browser and go to: `http://localhost:5000`

## Offline Data Synchronization

To ensure you have all data available offline:

1. **Initial Data Download**
   - While connected to the internet, go to Settings > Offline Data
   - Click "Download All Data for Offline Use"
   - Wait for the download to complete

2. **Language Data**
   - Go to Settings > Language
   - Click "Export Language Data" to save all translations

3. **Periodic Table and Element Data**
   - The data for the periodic table and elements is included in the offline package

## Troubleshooting

### Application Won't Start

1. Ensure Node.js is properly installed:
   ```
   node --version
   ```

2. Verify the build was successful:
   - Check if the `build` folder exists and contains files

3. Try running with administrative privileges:
   - Right-click on `start.bat` and select "Run as administrator"

### Missing Data

If some data appears missing:

1. Check offline storage status:
   - Go to Settings > Offline Data > Storage Status

2. Manually import language data:
   - Go to Settings > Language > Import
   - Select the previously exported language file

## Creating a Windows Desktop Shortcut

1. **Create a Batch File**
   - Create a file named `start-chemistry-app.bat` with the following content:
   ```batch
   @echo off
   cd /d %~dp0
   start http://localhost:5000
   serve -s build
   ```

2. **Create a Shortcut**
   - Right-click on the batch file and select "Create shortcut"
   - Move the shortcut to your desktop or preferred location

3. **Customize the Shortcut**
   - Right-click on the shortcut and select "Properties"
   - In the "Start in" field, enter the full path to your project directory
   - Click "Change Icon" and select a suitable icon
   - Click "OK" to save changes

## Regular Offline Updates

To get the latest data when you have internet access:

1. Go to Settings > Offline Data
2. Click "Check for Updates"
3. If updates are available, click "Download Updates"

## Technical Details

The Chemistry Explorer application uses:

- **IndexedDB**: For storing offline data
- **Service Workers**: For caching application resources
- **Local Storage**: For application settings
- **Manifest**: For installable PWA capabilities

## Need Help?

If you encounter issues during installation or while using the application offline:

1. Check our FAQ at: [https://chemistry-explorer.org/faq](https://chemistry-explorer.org/faq)
2. Email our support team at: support@chemistry-explorer.org
3. Include your system information and the error details for faster assistance

---

Thank you for using Chemistry Explorer! We hope this application helps make learning chemistry more interactive and accessible.
