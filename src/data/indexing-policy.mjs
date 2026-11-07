// Production becomes indexable when this change is released from dev.
// PUBLIC_ALLOW_INDEXING=false remains an explicit production kill switch.
// Preview deployments are always blocked, even with PUBLIC_ALLOW_INDEXING=true.
export function isIndexingAllowed(environment, setting) {
  if (environment === 'preview') return false;
  if (environment === 'production') return setting !== 'false';
  return setting === 'true';
}
