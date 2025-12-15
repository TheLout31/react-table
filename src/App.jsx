import { Alert, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";

// debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [genre, setGenre] = useState("");
  const [popularityRange, setPopularityRange] = useState([0, 100]);

  const getDataset = async () => {
    setLoading(true);
    Papa.parse("/spotify_songs.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setError("Failed to parse CSV");
          setLoading(false);
          return;
        }

        const formattedRows = results.data.map((row, i) => ({
          id: i,
          ...row,
          popularity: Number(row.popularity),
        }));

        setRows(formattedRows);

        setColumns([
          { field: "track_name", headerName: "Track", flex: 1 },
          { field: "artists", headerName: "Artist", flex: 1 },
          { field: "track_genre", headerName: "Genre", width: 150 },
          {
            field: "popularity",
            headerName: "Popularity",
            type: "number",
            width: 130,
          },
        ]);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    getDataset();
  }, []);

  // GENRE OPTIONS
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

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
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

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="h-[560px]">
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
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
