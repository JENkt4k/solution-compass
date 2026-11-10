# Merit concurrency reference workloads

This catalog captures the previously discussed concurrency models, algorithms, data structures, actor failure/benchmark cases, and financial/accounting workloads. It is an evaluation specification, not an assertion of implemented Merit features. The ambiguous request to include “1 and 2” is interpreted here as covering execution and consistency dimensions; the original numbered referents were unavailable.

Open **Merit concurrency test cases** in the app. Search locally within the panel; the main problem-tree search is separate. Each case has:

| View | Purpose |
| --- | --- |
| Documentation | Readable problem, execution model, consistency scope |
| Safe / precise | Correctness invariant, ownership, faults, oracle and measurements |
| Verbose / input validation | Same valid-input semantics plus explicit boundary validation |

These are specification views. Executable implementations must be generated and tested against the current Merit compiler. Use **Copy Codex prompt** for an individual case. This explicitly requires a capability audit and blocks unsupported cases instead of inventing syntax or changing the language spec. RM0 acceptance remains governed by the approved minimum; deferred mutable/aggregate/escaping borrows are not implicitly approved here.

## Implementation and evidence workflow

1. Generate the implementations in the Merit checkout using a case's copied prompt. Inspect current semantics, library support and FFI before coding.
2. Keep documentation examples, safe implementations and hardened variants together. Validate that all variants agree for valid inputs. For invalid inputs, specify structured rejection before mutation; never silently change money, currency, identifiers or sequence numbers.
3. Include positive/runtime tests, compile-rejection tests where applicable, deterministic seeds and schedules, oracle/history checks, resource accounting, fault injection and bounded termination. Record which guarantees are compiler, runtime, protocol or storage responsibilities. A reproducible stress test is evidence, not proof.
4. Export a JSON bundle using `src/data/merit-concurrency.json` as the exact schema. Preserve case IDs; include only changed cases if desired. Status is `specified`, `blocked`, `implemented` or `verified`. Non-specified statuses require commit-pinned evidence URLs. Statuses are reviewed claims, never automatically certified by import.
5. Commit source, test results and JSON to GitHub. Send the commit-pinned blob/raw JSON URL to the assistant, or run:

   ```sh
   npm run import:merit -- https://raw.githubusercontent.com/OWNER/REPO/COMMIT_SHA/path/cases.json
   npm run validate
   npm run build
   git diff
   ```

   Replace COMMIT_SHA with a full 40-character lowercase commit hash. GitHub blob URLs are also accepted. Branch URLs are intentionally rejected because they change underneath a review. No public live URL is required before preparing the cases; implementation can happen first in Codex.
6. Review the diff and evidence before committing the Solution Compass update. Import is a development-time operation; the deployed static app does not fetch arbitrary URLs or execute imported source. Imported cases are bundled at build time and available offline.

Imports are limited to HTTPS GitHub file hosts, no credentials/ports/query/fragment, no redirects, a 15-second timeout, 1 MiB, 200 cases, 16,000 characters per text field and 20 evidence links per case. Unknown fields, duplicate IDs, malformed UTF-8 and invalid status/evidence are rejected before the catalog is replaced. Existing matching IDs are replaced; absent IDs are retained. The URL is printed for provenance; preserve it in the reviewing PR. Importing code-looking text never executes it; the app renders strings through React.

## Coverage and evidence requirements

Every case must state the operation-level execution model and ordering/isolation boundary before implementation. Financial correctness, durability and cross-owner atomicity are independent of data-race freedom. Financial cases balance independently per currency using exact amounts and explicit rounding/overflow policies. Crash-recovery claims require durable storage tests, not an in-memory restart simulation.

Actor lifecycle covers creation, ping-pong, fan-out/fan-in, idle actors, varied message sizes, overload, fairness, restart and mixed CPU/I/O (the latter also has a dedicated async case). Benchmark reports should record hardware, compiler/build flags, runtime version, workload size, warm-up, repetitions, p50/p99 latency, throughput, allocations, live resources and baseline. Avoid universal performance rankings; contention and message size can reverse them.

The machine-readable source of truth is `src/data/merit-concurrency.json`. Run `npm run validate:merit` to validate the catalog and rejection cases.
