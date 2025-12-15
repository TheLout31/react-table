import Papa from "papaparse";

export const parseCSV = (filePath) =>
  new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors?.length) {
          reject(results.errors);
          toast.error(err.message || "Failed to load CSV");
        } else {
          resolve(results.data);
        }
      },
      error: (err) => (
        reject(err), toast.error(err.message || "Failed to load CSV")
      ),
    });
  });
