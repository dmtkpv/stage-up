import { spawn } from 'child_process';
const [ nodePath, scriptPath, script, ...args ] = process.argv;
const { pm_id, restart_time } = process.env;

if (script && (!pm_id || +restart_time)) {
    spawn('node', [`./scripts/${script}.js`, ...args], { stdio: 'inherit' });
}