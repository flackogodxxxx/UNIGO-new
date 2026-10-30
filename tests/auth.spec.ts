import { test, expect } from "@playwright/test";
for (const width of [390, 1280])
  test(`frontend authentication ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const sent: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") sent.push(r.url());
    });
    await page.goto("http://127.0.0.1:5188/entrar");
    await page.getByRole("button", { name: "Simular entrada" }).click();
    await expect(
      page.getByLabel("R.A. ou matrícula", { exact: true }),
    ).toBeFocused();
    await expect(
      page.getByText("Informe seu R.A. ou matrícula institucional."),
    ).toBeVisible();
    await page.getByRole("link", { name: "Criar conta", exact: true }).click();
    await expect(page).toHaveURL(/cadastro$/);
    await page.getByRole("button", { name: "Simular cadastro" }).click();
    await expect(page.getByLabel("Nome completo")).toBeFocused();
    await page.getByLabel("Nome completo").fill("Pessoa Exemplo");
    await page
      .getByLabel("R.A. ou matrícula", { exact: true })
      .fill("DEMO-123");
    await page.getByLabel("E-mail", { exact: true }).fill("demo@example.test");
    await page.getByLabel("Senha", { exact: true }).fill("somente-teste-123");
    await page.getByLabel("Confirmar senha").fill("diferente");
    await page.getByRole("button", { name: "Simular cadastro" }).click();
    await expect(
      page.getByText("As senhas precisam ser iguais."),
    ).toBeVisible();
    await page.getByLabel("Confirmar senha").fill("somente-teste-123");
    await page.getByRole("button", { name: "Mostrar senha" }).click();
    await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
      "type",
      "text",
    );
    await page.getByRole("button", { name: "Ocultar senha" }).click();
    await page.screenshot({
      path: `artifacts/register-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Simular cadastro" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Nenhuma conta foi criada",
    );
    expect(await page.evaluate(() => localStorage.length)).toBe(0);
    expect(sent).toEqual([]);
    await page.goto("http://127.0.0.1:5188/entrar");
    await page.screenshot({
      path: `artifacts/login-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("link", { name: "Esqueci minha senha" }).click();
    await page.getByLabel("E-mail", { exact: true }).fill("demo@example.test");
    await page.getByRole("button", { name: "Simular recuperação" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Nenhum e-mail foi enviado",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
test("3D stops drawing when settled and resumes after role change", async ({
  page,
}) => {
  await page.addInitScript({
    content: `window.__draws=0; const original=WebGL2RenderingContext.prototype.drawElements; WebGL2RenderingContext.prototype.drawElements=function(...args){window.__draws++;return original.apply(this,args)};`,
  });
  await page.goto("http://127.0.0.1:5188");
  await page.locator("#conexoes").scrollIntoViewIfNeeded();
  await expect(page.locator(".car-model--ready")).toBeVisible({
    timeout: 20000,
  });
  await page.waitForTimeout(3500);
  const before = await page.evaluate("window.__draws");
  await page.waitForTimeout(600);
  expect(await page.evaluate("window.__draws")).toBe(before);
  await page.getByRole("button", { name: "Tenho lugar", exact: true }).click();
  await page.waitForTimeout(500);
  expect(await page.evaluate("window.__draws")).toBeGreaterThan(before);
});
