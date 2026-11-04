import { spawnSync } from 'node:child_process';

const APPROVED_REPOSITORY = 'snowolf001/factory-phase7-pilot-js';
const APPROVED_REMOTE = 'https://github.com/snowolf001/factory-phase7-pilot-js';

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', shell: false });
  if (result.status !== 0) fail(`git ${args[0]} inspection failed`);
  return result.stdout.trim();
}

function normalizeRemote(value) {
  return value.trim().replace(/\.git$/i, '').replace(/\/$/, '').toLowerCase();
}

let request;
try {
  request = JSON.parse(process.env.FACTORY_WORKER_VERIFY_REQUEST_JSON ?? '');
} catch {
  fail('Factory Worker verification request is missing or invalid');
}

if (request.repository !== APPROVED_REPOSITORY) fail('verification repository mismatch');
if (typeof request.expectedHeadSha !== 'string' || !/^[0-9a-f]{40}$/i.test(request.expectedHeadSha)) fail('expected head SHA is invalid');
if (git(['rev-parse', 'HEAD']) !== request.expectedHeadSha) fail('verification HEAD mismatch');
if (normalizeRemote(git(['remote', 'get-url', 'origin'])) !== APPROVED_REMOTE) fail('verification remote mismatch');
if (git(['status', '--porcelain', '--untracked-files=all']) !== '') fail('verification workspace is not clean');

const testRun = spawnSync(process.execPath, ['--test', 'test/clamp.test.js'], {
  encoding: 'utf8',
  shell: false,
  stdio: ['ignore', 'pipe', 'pipe']
});
const passed = testRun.status === 0;
const result = {
  runId: `phase7-local-${request.expectedHeadSha.slice(0, 12)}-${Date.now()}`,
  repository: APPROVED_REPOSITORY,
  headSha: request.expectedHeadSha,
  current: true,
  complete: true,
  status: passed ? 'PASS' : 'FAIL',
  finishedAt: new Date().toISOString(),
  checks: [{ id: 'node-test', status: passed ? 'PASS' : 'FAIL', required: true }]
};
process.stdout.write(`${JSON.stringify(result)}\n`);
process.exitCode = passed ? 0 : 1;
