# Older Code Provenance Archive

Created: 2026-09-20
Repository: G:\AEGIS FAMILY-HUB-CONNECT

## Purpose

This archive preserves older Family Hub Connect code bundles that were present beside the active root Vite React app.

The active implementation source remains the repository root `src/` tree. These archived bundles are preserved for provenance, reference, and selective future extraction only.

## Archived Items

| Original path | Archived path | Notes |
| --- | --- | --- |
| `FHC-ALL-MODULES/` | `archive/provenance/2026-09-20-older-code/FHC-ALL-MODULES/` | Older module collection. Root package metadata: `family-hub-connect--main`, version `0.0.0`, React/Vite/TypeScript, includes `@google/genai`. Contains nested source and dependency material. |
| `OLD_FAMILY_HUB_CONNECT_FULL/` | `archive/provenance/2026-09-20-older-code/OLD_FAMILY_HUB_CONNECT_FULL/` | Older full app tree. Root package metadata: `family-hub-connect`, version `1.0.0`, React/Vite/TypeScript, includes Supabase client dependency. Contains older page/component/type/style structure and dependency material. |
| `Family-Hub-Connect (2).zip` | `archive/provenance/2026-09-20-older-code/Family-Hub-Connect (2).zip` | Zip snapshot preserved unchanged. Original file size observed as `20,380,351` bytes. |

## Observed Pre-Archive Counts

- `FHC-ALL-MODULES/`: 5,929 files observed, total file bytes `161,478,374`.
- `OLD_FAMILY_HUB_CONNECT_FULL/`: 3,302 files observed, total file bytes `79,542,278`.

## Boundaries

- No older code was deleted.
- The active app under root `src/` was not moved into this archive.
- The Family POD scaffold under root `src/pod/` remains active implementation work.
- The archived bundles should not be treated as active runtime code unless a future task explicitly restores or selectively imports a reviewed file.
