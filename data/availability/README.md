# Availability Data Directory

This directory contains the property availability spreadsheets and raw source files.

## Directory Structure

* **`projects/`**: Contains standard project-level Excel sheets structured for the PropTrack database.
  * These spreadsheets are organized in subdirectories by developer slug (e.g. `projects/al-marasem/fifth-square.xlsx`).
  * If you add a new project, simply place its `.xlsx` file inside the corresponding developer folder (or in the root of `projects/`) and run `npm run import-availability`.
* **`raw_source_files/`**: Contains raw, non-standard Excel sheets, brochures, PDFs, and images provided directly by developers. Kept for reference.

## Adding New Projects or Updating Availability

1. **Update existing project**: Edit the spreadsheet for that project under `projects/<developer-slug>/<project-slug>.xlsx` and run:
   ```bash
   npm run import-availability
   ```
2. **Add a new project**:
   - Create a spreadsheet with the sheets `Projects`, `Breakdown`, and `Units`.
   - Name the file `<project-slug>.xlsx` (the slug must match the compound slug in `src/data/compounds.ts`).
   - Place the file inside `projects/<developer-slug>/`.
   - Run `npm run import-availability`.
