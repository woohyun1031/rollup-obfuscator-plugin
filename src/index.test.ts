import { describe, it, expect, vi } from "vitest";
import javascriptObfuscator from "./index.js";
import type { ObfuscatorOptions } from "javascript-obfuscator";

// Helper function to call renderChunk regardless of whether it's a function or ObjectHook
function callRenderChunk(
  plugin: ReturnType<typeof javascriptObfuscator>,
  code: string,
  chunk: any,
  options: any
) {
  const renderChunk = plugin.renderChunk;
  if (!renderChunk) return undefined;

  // Check if it's an ObjectHook (has a handler property) or a direct function
  if (typeof renderChunk === "function") {
    return (renderChunk as any).call(plugin, code, chunk, options);
  } else if (typeof renderChunk === "object" && "handler" in renderChunk) {
    return (renderChunk.handler as any).call(plugin, code, chunk, options);
  }
  return undefined;
}

describe("rollup-obfuscator-plugin", () => {
  it("should return a plugin object with correct name", () => {
    const plugin = javascriptObfuscator();
    expect(plugin.name).toBe("javascript-obfuscator");
  });

  it("should have enforce set to post", () => {
    const plugin = javascriptObfuscator();
    expect(plugin.enforce).toBe("post");
  });

  it("should obfuscate code in renderChunk", () => {
    const plugin = javascriptObfuscator({
      compact: true,
      controlFlowFlattening: false,
    });

    const inputCode = `
      function hello() {
        const message = "Hello World";
        console.log(message);
      }
      hello();
    `;

    const result = callRenderChunk(plugin, inputCode, {} as any, {} as any);

    expect(result).toBeDefined();
    if (result && typeof result === "object" && "code" in result) {
      expect(result.code).toBeDefined();
      expect(result.code).not.toBe(inputCode);
      expect(result.code.length).toBeGreaterThan(0);
    }
  });

  it("should handle obfuscation with sourceMap option", () => {
    const plugin = javascriptObfuscator({
      sourceMap: true,
      sourceMapMode: "separate",
    } as ObfuscatorOptions);

    const inputCode = "function test() { return 42; }";
    const result = callRenderChunk(plugin, inputCode, {} as any, {} as any);

    expect(result).toBeDefined();
    if (result && typeof result === "object" && "code" in result) {
      expect(result.code).toBeDefined();
      expect(result.map).toBeDefined();
    }
  });

  it("should not include map when sourceMapMode is inline", () => {
    const plugin = javascriptObfuscator({
      sourceMap: true,
      sourceMapMode: "inline",
    } as ObfuscatorOptions);

    const inputCode = "function test() { return 42; }";
    const result = callRenderChunk(plugin, inputCode, {} as any, {} as any);

    expect(result).toBeDefined();
    if (result && typeof result === "object" && "code" in result) {
      expect(result.code).toBeDefined();
      expect(result.map).toBeUndefined();
    }
  });

  it("should handle errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const plugin = javascriptObfuscator();

    // Pass invalid code that might cause obfuscation to fail
    const invalidCode = "";
    const result = callRenderChunk(plugin, invalidCode, {} as any, {} as any);

    // Should return null on error or handle gracefully
    expect(result).toBeDefined();

    consoleSpy.mockRestore();
  });

  it("should accept custom obfuscator options", () => {
    const customOptions: ObfuscatorOptions = {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      stringArray: true,
      stringArrayThreshold: 0.75,
    };

    const plugin = javascriptObfuscator(customOptions);
    expect(plugin.name).toBe("javascript-obfuscator");

    const inputCode = "const x = 10; console.log(x);";
    const result = callRenderChunk(plugin, inputCode, {} as any, {} as any);

    expect(result).toBeDefined();
    if (result && typeof result === "object" && "code" in result) {
      expect(result.code).toBeDefined();
      expect(result.code).not.toBe(inputCode);
    }
  });

  it("should work with empty options object", () => {
    const plugin = javascriptObfuscator({});
    expect(plugin.name).toBe("javascript-obfuscator");

    const inputCode = "const test = 123;";
    const result = callRenderChunk(plugin, inputCode, {} as any, {} as any);

    expect(result).toBeDefined();
    if (result && typeof result === "object" && "code" in result) {
      expect(result.code).toBeDefined();
    }
  });
});
