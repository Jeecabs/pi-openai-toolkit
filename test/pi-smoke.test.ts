import { describe, expect, test } from "bun:test";
import { runSmokeRunner } from "./pi-smoke-subprocess";

const targets = [
	["native post-tool compaction", "native_threshold"],
	["Pi-disabled compaction", "native_disabled"],
	["below-threshold continuation", "native_under"],
	["manual compaction with auto disabled", "native_manual"],
	["manual compaction with an open completed stream", "native_manual-open"],
	["cooperative compaction cancellation", "native_cancel"],
	["remote failure and native fallback", "native_failure"],
	["complete package", "package"],
] as const;

describe("pi smoke", () => {
	for (const [name, target] of targets) {
		test(
			`loads the ${name} with the local official Pi runtime`,
			() => {
				const native = target.startsWith("native_");
				const runner = native ? "pi-native-compaction-runner.ts" : "pi-smoke-runner.ts";
				const argument = native ? target.slice(7) : target;
				const result = runSmokeRunner(runner, [argument]);
				expect(result.status, result.stderr).toBe(0);
				expect(result.stdout.trim()).toBe("OK");
			},
			180000,
		);
	}
});
