import { test, expect } from "@playwright/test";
test("breakpoints and keyboard narrative", async ({ page }) => {
  await page.goto("http://127.0.0.1:5188");
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    ).toBeTruthy();
  }
  await page.getByRole("button", { name: "Tenho lugar", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Tenho lugar", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".trust-details").scrollIntoViewIfNeeded();
  expect(
    (await page.locator(".pass-footer > svg").boundingBox())!.width,
  ).toBeLessThanOrEqual(20);
});
test("WebGL unavailable keeps narrative usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto("http://127.0.0.1:5188");
  await page.locator("#conexoes").scrollIntoViewIfNeeded();
  await expect(page.locator(".car-model--fallback")).toBeVisible({
    timeout: 15000,
  });
  await page.getByRole("button", { name: "Tenho lugar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Seu caminho cabe mais gente." }),
  ).toBeVisible();
});
