import { test, expect } from "@playwright/test";
test("desktop story, radial campus, original 3D compact, dialog and FAQ", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5188");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "O futuro é seu.",
  );
  await expect(page.locator(".calculator")).toHaveCount(0);
  await expect(page.getByRole("slider")).toHaveCount(0);
  await expect(page.locator(".campus-svg text")).toHaveCount(0);
  await expect(page.locator('[data-campus-part="radial-wing"]')).toHaveCount(5);
  await expect(page.locator('[data-campus-part="open-courtyard"]')).toHaveCount(
    1,
  );
  await expect(page.locator('[data-campus-part="roundabouts"]')).toHaveCount(1);
  await expect(page.locator('[data-campus-part="courts"]')).toHaveCount(1);
  await expect(page.locator(".route-story-svg text")).toHaveCount(0);
  await expect(page.locator(".campus-scene")).not.toContainText(
    /Ribeirão|Ourinhos|Salto Grande/,
  );
  await page
    .getByRole("button", { name: "Rever animação dos caminhos" })
    .click();
  await page.getByRole("button", { name: "Explorar a ideia" }).first().click();
  await page.getByLabel("De onde você sairia?").selectOption("Ourinhos");
  await page.getByRole("button", { name: "Ver meu exemplo" }).click();
  await expect(page.getByRole("status")).toContainText("Ourinhos → UniFio");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator("#conexoes").scrollIntoViewIfNeeded();
  await expect(page.locator(".car-model--ready")).toBeVisible({
    timeout: 25000,
  });
  await expect(page.locator(".car-canvas canvas")).toBeVisible();
  await page.getByRole("button", { name: "Tenho lugar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Seu caminho cabe mais gente." }),
  ).toBeVisible();
  await page.waitForTimeout(700);
  await page
    .locator("#conexoes")
    .screenshot({ path: "artifacts/connections-3d.png" });
  await page
    .getByRole("button", { name: "Quero ir junto", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Um lugar para você." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Conhecer a proposta" }).click();
  await expect(page.getByRole("dialog")).toContainText("Mensalidade por aluno");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Preciso pagar para usar a UNIGO?" })
    .click();
  await expect(
    page.getByText("O acesso à plataforma é um benefício", { exact: false }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "artifacts/desktop.png" });
  expect(errors).toEqual([]);
});
test("mobile navigation and role toggle", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:5188");
  await page.getByRole("button", { name: "Abrir navegação" }).click();
  await page.getByRole("link", { name: "Nossa comunidade" }).click();
  await expect(page.locator("nav")).not.toHaveClass("open");
  await page.locator("#conexoes").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Tenho lugar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Seu caminho cabe mais gente." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.waitForTimeout(1500);
  await page
    .locator("#conexoes")
    .screenshot({ path: "artifacts/connections-mobile.png" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "artifacts/mobile.png" });
});
