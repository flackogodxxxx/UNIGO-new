import { test, expect } from "@playwright/test";
const demoDay = new Date();
while ([0, 6].includes(demoDay.getDay()))
  demoDay.setDate(demoDay.getDate() + 1);
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(demoDay);
});
for (const width of [390, 1440])
  test(`workspace complete ride lifecycle ${width}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:5188/app");
    await expect(page.locator(".ua-ride")).toHaveCount(3);
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `artifacts/app-${width}.png`,
      fullPage: true,
    });
    await page.getByLabel("Filtrar origem").selectOption("Centro de Ourinhos");
    await expect(page.locator(".ua-ride")).toHaveCount(1);
    await page.getByLabel("Horário mínimo").fill("23:00");
    await expect(
      page.getByText("Ainda não há uma rota para esse filtro."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Limpar filtros" }).click();
    await page
      .getByRole("button", { name: "Ver carona", exact: true })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toContainText("Lucas Martins");
    await page.getByRole("button", { name: "Solicitar vaga na demo" }).click();
    await expect(page.locator(".ua-trip")).toContainText("Aguardando aceite");
    await page.getByRole("button", { name: "Mensagens", exact: true }).click();
    await expect(
      page.getByText("Ainda não há conversas liberadas."),
    ).toBeVisible();
    await page.getByRole("button", { name: /Minhas caronas/ }).click();
    await page.getByLabel("Perfil de demonstração").selectOption("driver");
    await page.getByRole("button", { name: "Simular aceite" }).click();
    await page.getByRole("button", { name: "Abrir conversa" }).click();
    await page.getByLabel("Perfil de demonstração").selectOption("passenger");
    await page
      .getByLabel("Mensagem", { exact: true })
      .fill("Podemos nos encontrar na praça?");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator(".ua-bubble")).toContainText(
      "Podemos nos encontrar",
    );
    await page.getByLabel("Perfil de demonstração").selectOption("driver");
    await page
      .getByLabel("Mensagem", { exact: true })
      .fill("Combinado, às 18:20.");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator(".ua-bubble")).toHaveCount(2);
    await page.screenshot({
      path: `artifacts/app-chat-${width}.png`,
      fullPage: true,
    });
    await page.reload();
    await page.getByRole("button", { name: "Mensagens", exact: true }).click();
    await expect(page.locator(".ua-bubble")).toHaveCount(2);
    await page.getByRole("button", { name: /Minhas caronas/ }).click();
    await page.getByRole("button", { name: "Concluir demo" }).click();
    await page.getByRole("button", { name: "Rolou tranquilo" }).click();
    await expect(page.locator(".ua-feedback")).toContainText("Tudo certo");
    await page.getByRole("button", { name: "Meu perfil", exact: true }).click();
    await expect(page.locator(".ua-profile-card")).toContainText("Alex Lima");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(errors).toEqual([]);
  });
test("publish persists; cancelling accepted request returns seat; offline map works", async ({
  page,
}) => {
  await page.route("**/tile.openstreetmap.org/**", (r) => r.abort());
  await page.goto("http://127.0.0.1:5188/app");
  await expect(
    page.getByText("O mapa externo está indisponível.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Ver carona", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Solicitar vaga na demo" }).click();
  await page.getByLabel("Perfil de demonstração").selectOption("driver");
  await page.getByRole("button", { name: "Simular aceite" }).click();
  await page
    .getByRole("button", { name: "Encontrar carona", exact: true })
    .click();
  await expect(page.locator(".ua-ride").first()).toContainText("1 lugar");
  await page.getByRole("button", { name: /Minhas caronas/ }).click();
  await page.getByRole("button", { name: "Cancelar solicitação" }).click();
  await page
    .getByRole("button", { name: "Encontrar carona", exact: true })
    .click();
  await expect(page.locator(".ua-ride").first()).toContainText("2 lugares");
  await page.getByRole("button", { name: "Oferecer carona" }).click();
  await page.getByLabel("Lugares", { exact: true }).fill("3");
  await page.getByLabel("Contribuição (R$)", { exact: true }).fill("14");
  await page
    .getByRole("button", { name: "Publicar carona de exemplo" })
    .click();
  await expect(page.locator(".ua-ride").first()).toContainText("Alex Lima");
  await page.reload();
  await expect(page.locator(".ua-ride").first()).toContainText("Alex Lima");
  await page
    .getByRole("button", { name: "Ver carona", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Sua carona", exact: true }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("invalid local data recovers without crashing", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "unigo-app-demo-v1",
      '{"version":1,"rides":[null],"requests":[]}',
    ),
  );
  await page.goto("http://127.0.0.1:5188/app");
  await expect(page.locator(".ua-ride")).toHaveCount(3);
});
test("recurring seats are per date and shared-route badge follows completed trips", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5188/app");
  const day = new Date(demoDay);
  for (let i = 0; i < 3; i++) {
    while ([0, 6].includes(day.getDay())) day.setDate(day.getDate() + 1);
    const date = new Date(day.getTime() - day.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    await page
      .getByRole("button", { name: "Encontrar carona", exact: true })
      .click();
    await page.getByLabel("Filtrar origem").selectOption("Vila Margarida");
    await page.getByLabel("Dia da carona").fill(date);
    await expect(page.locator(".ua-ride").first()).toContainText("3 lugares");
    await page
      .getByRole("button", { name: "Ver carona", exact: true })
      .first()
      .click();
    await page.getByRole("button", { name: "Solicitar vaga na demo" }).click();
    await page.getByLabel("Perfil de demonstração").selectOption("driver");
    await page.getByRole("button", { name: "Simular aceite" }).click();
    await page.getByRole("button", { name: "Concluir demo" }).click();
    day.setDate(day.getDate() + 1);
  }
  await page.getByRole("button", { name: "Meu perfil", exact: true }).click();
  await expect(
    page.getByText("Rota compartilhada com Beatriz Costa", { exact: true }),
  ).toBeVisible();
});
test("price reference is explicit and login success opens the app", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5188/app");
  await page.getByRole("button", { name: "Oferecer carona" }).click();
  await expect(page.locator(".ua-price-reference")).toContainText(
    "em linha reta",
  );
  await page.getByRole("button", { name: /Usar referência/ }).click();
  expect(
    Number(
      await page.getByLabel("Contribuição (R$)", { exact: true }).inputValue(),
    ),
  ).toBeGreaterThan(0);
  await page.screenshot({ path: "artifacts/app-publish.png", fullPage: true });
  await page.keyboard.press("Escape");
  await page.goto("http://127.0.0.1:5188/entrar");
  await page.getByLabel("R.A. ou matrícula").fill("20260001");
  await page.getByLabel("Senha", { exact: true }).fill("Exemplo123");
  await page
    .getByRole("button", { name: "Simular entrada", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Entrar no app de demonstração" })
    .click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole("heading", { name: "Tem alguém indo pelo seu caminho." }),
  ).toBeVisible();
});
