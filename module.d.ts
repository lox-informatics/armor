declare module "@lox-informatics/armor/lib/ask" {
  export default function ask(query: string): Promise<string>;
}

declare module "@lox-informatics/armor/lib/run" {
  export declare function ensureExecutable(scriptPath: string): Promise<void>;
  export declare function getBashCommand(scriptPath: string): Promise<string>;
  export default function run(
    scriptPath: string,
    args?: string[]
  ): Promise<string>;
}
