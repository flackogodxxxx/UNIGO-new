import { test, expect } from "@playwright/test";
for (const width of [390, 1280]) {
  test(`interactive product walkthrough ${width}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://127.0.0.1:5188");
    await page.locator(".product-device").scrollIntoViewIfNeeded();
    await page.getByLabel("Ponto de saída do exemplo").selectOption("Centro");
    await page.getByLabel("Horário do exemplo").selectOption("18:40");
    await expect(page.locator(".ride-route")).toContainText("Centro");
    await expect(page.locator(".ride-route")).toContainText("18:40");
    await page
      .locator(".product-walkthrough")
      .screenshot({ path: `artifacts/product-${width}.png` });
    await page
      .getByRole("button", { name: "Conhecer o perfil", exact: true })
      .click();
    await expect(page.locator(".verification-strip")).toContainText(
      "Vínculo acadêmico verificado",
    );
    await page
      .getByRole("button", { name: "Ver como seria o encontro" })
      .click();
    await expect(page.locator(".meeting-ticket")).toContainText("Centro");
    await expect(page.locator(".meeting-ticket")).toContainText("18:40");
    await page.getByRole("button", { name: "Simular combinado" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Nenhuma carona foi reservada",
    );
    await page
      .locator(".product-device")
      .screenshot({ path: `artifacts/chat-${width}.png` });
    await page.getByRole("button", { name: "Etapa anterior" }).click();
    await expect(page.locator(".profile-heading")).toContainText(
      "Lucas Martins",
    );
    await page.locator(".chapter").first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Ponto de saída do exemplo")).toHaveValue(
      "Centro",
    );
    await page.locator(".trust-details").scrollIntoViewIfNeeded();
    await page
      .locator(".trust-details")
      .screenshot({ path: `artifacts/trust-${width}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(errors).toEqual([]);
  });
}
