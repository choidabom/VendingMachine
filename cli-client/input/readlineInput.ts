import * as readline from "readline";
import process from "process";

// create interface for input and output
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
