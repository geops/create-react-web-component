/**
 * This script is cleaning up all files that are not used for development.
 * Use this command to whipe all of the following files:
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.white(' ✓ Removing old dependencies'));

execSync('rm -rf node_modules');
execSync('rm -rf dist');
execSync('rm -f yarn.lock');
execSync('rm -f package-lock.json');