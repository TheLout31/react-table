import { MenuItem, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { parseCSV } from "./utils/Parsecsv";
import useDebounce from "./utils/useDebounce";

export default function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [genre, setGenre] = useState("");
  const [popularityRange, setPopularityRange] = useState([0, 100]);

  const getDataset = async () => {
    setError(null);

    try {
      const data = await parseCSV("/spotify_songs.csv");

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("CSV file is empty");
      }

      const formattedRows = data.map((row, i) => {
        const popularity = Number(row.popularity);

        if (Number.isNaN(popularity)) {
          throw new Error("Invalid popularity value in dataset");
        }

        return {
          id: i,
          ...row,
          popularity,
        };
      });

      setRows(formattedRows);
      console.log(formattedRows);

      setColumns([
        { field: "track_name", headerName: "Track", width: 200 },
        { field: "artists", headerName: "Artist", width: 200 },
        { field: "track_genre", headerName: "Genre", width: 150 },
        {
          field: "popularity",
          headerName: "Popularity",
          type: "number",
          width: 150,
        },
        { field: "album_name", headerName: "Album", width: 300 },
        { field: "tempo", headerName: "Tempo", type: "number", width: 150 },
        { field: "energy", headerName: "Energy", type: "number", width: 150 },
        {
          field: "danceability",
          headerName: "Danceability",
          type: "number",
          width: 150,
        },
        {
          field: "duration_ms",
          headerName: "Duration (ms)",
          type: "number",
          width: 150,
        },
        { field: "explicit", headerName: "Explicit", width: 150 },
      ]);
    } catch (err) {
      setError(err.message || "Failed to load CSV");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      if (!filteredRows.length) {
        toast.error("No data to export");
        return;
      }

      const exportData = filteredRows.map(({ id, ...rest }) => rest);

      const csv = Papa.unparse(exportData, {
        quotes: true,
        delimiter: ",",
        header: true,
        skipEmptyLines: true,
      });

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "spotify_filtered_data.csv");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  useEffect(() => {
    getDataset();
  }, []);

  const genres = useMemo(
    () => [...new Set(rows.map((r) => r.track_genre))],
    [rows]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        !debouncedSearch ||
        row.track_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        row.artists?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesGenre = !genre || row.track_genre === genre;

      const matchesPopularity =
        row.popularity >= popularityRange[0] &&
        row.popularity <= popularityRange[1];

      return matchesSearch && matchesGenre && matchesPopularity;
    });
  }, [rows, debouncedSearch, genre, popularityRange]);

  {
    error && toast.error(error);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <ToastContainer />
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
        <h1 className="text-3xl font-bold">Spotify Dashboard 🎧</h1>
        <p className="text-green-100 mt-1">Search, sort & filter songs</p>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* FILTER BAR */}
        <div className="bg-white rounded-xl shadow p-4 grid gap-4 md:grid-cols-4">
          {/* GLOBAL SEARCH */}
          <TextField
            label="Search Track / Artist"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          {/* GENRE FILTER */}
          <TextField
            select
            label="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>

          {/* POPULARITY FILTER */}
          <TextField
            type="number"
            label="Min Popularity"
            value={popularityRange[0]}
            onChange={(e) =>
              setPopularityRange([+e.target.value, popularityRange[1]])
            }
          />

          <TextField
            type="number"
            label="Max Popularity"
            value={popularityRange[1]}
            onChange={(e) =>
              setPopularityRange([popularityRange[0], +e.target.value])
            }
          />
        </div>

        {/* SEARCH ACTIVE INDICATOR */}
        {debouncedSearch && (
          <div className="text-sm text-gray-600">
            🔍 Searching for: <strong>{debouncedSearch}</strong>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            ⬇ Export CSV
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="h-[560px]">
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              slots={{
                loadingOverlay: () => (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading data...
                  </div>
                ),
              }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                sorting: {
                  sortModel: [{ field: "popularity", sort: "desc" }],
                },
              }}
              disableRowSelectionOnClick
              density="compact"
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  fontWeight: 600,
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
