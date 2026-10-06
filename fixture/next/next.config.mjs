// The fixture is its own project: keep Next's workspace root here, not at the repository's lockfile.
export default {
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
}
