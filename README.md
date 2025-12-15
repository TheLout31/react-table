### 📊 Spotify Songs Dashboard

A modern React.js dashboard that loads and visualizes a large Spotify songs dataset from a CSV file.
The app provides searching, sorting, filtering, and pagination using MUI X DataGrid, with CSV parsing handled by PapaParse and a responsive UI styled with Tailwind CSS.

## 🚀 Features

📁 CSV Data Handling

Loads Spotify dataset from a local CSV file

Parses data using PapaParse

Strong error handling for:

Empty files

Invalid values

Parsing errors

Displays loading state using DataGrid’s built-in loader

## 🔍 Search & Filtering

Global search across track name and artist

Debounced search (300ms) for better performance

Genre filter (dropdown)

Popularity range filter (min & max)

Filters work together using AND logic

## 🔃 Sorting

Single-column sorting

Default sort by popularity (descending)

Supports numeric & string sorting

Visual indicators via DataGrid headers

## 📑 Data Table

Built with MUI X DataGrid

Pagination with selectable page sizes

Responsive layout

Compact density for large datasets

Styled headers and modern UI

## 🎨 UI & UX

Tailwind CSS for layout and responsiveness

Gradient header

Clean filter bar layout

Search activity indicator

Error and success alerts using MUI

## 🛠 Tech Stack

React.js

MUI X DataGrid

PapaParse

Tailwind CSS

Toastify

JavaScript (ES6+)

## ⚙️ Installation & Setup

1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/spotify-dashboard.git
cd spotify-dashboard
```

2️⃣ Install dependencies

```bash
npm install
```

3️⃣ Add the CSV file

Place spotify_songs.csv inside the public folder.

4️⃣ Start the app

```bash
npm run dev
```

## 📄 CSV Dataset

Dataset source:
30,000 Spotify Songs Dataset (Kaggle)
