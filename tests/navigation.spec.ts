import { test, expect } from "@playwright/test";
test("navbar mobile closes with Escape, outside click and section links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:5188");
  const nav = page.getByRole("navigation", { name: "Principal" });
  const toggle = page.getByRole("button", { name: "Abrir navegação" });
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(nav).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "artifacts/navbar-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(nav).toBeHidden();
  await toggle.click();
  await page.mouse.click(5, 650);
  await expect(nav).toBeHidden();
  await toggle.click();
  await nav.getByRole("link", { name: "Nossa comunidade" }).click();
  await expect(nav).toBeHidden();
  await expect(page.locator('a[href="#confianca"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(nav).toBeVisible();
  await page.screenshot({ path: "artifacts/navbar-desktop.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
test("auth diagram has connected labeled stages and field icons", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5188/entrar");
  await expect(
    page.getByRole("img", {
      name: "Você e quem dirige se encontram e seguem juntos até o campus",
    }),
  ).toBeVisible();
  await expect(page.locator(".auth-field-icon")).toHaveCount(2);
  await expect(page.locator(".auth-journey animateMotion")).toHaveCount(3);
  await page
    .locator(".auth-journey")
    .screenshot({ path: "artifacts/auth-journey.png" });
});
