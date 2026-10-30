import { test, expect } from "@playwright/test";
test("campus routes stay on roads and clear all buildings and vegetation", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5188");
  await expect(page.locator("[data-route]")).toHaveCount(2);
  const result = await page.evaluate(() => {
    const routes = Array.from(
      document.querySelectorAll<SVGPathElement>("[data-route]"),
    );
    const roads = Array.from(
      document.querySelectorAll<SVGPathElement>("[data-road]"),
    );
    const obstacles = Array.from(
      document.querySelectorAll<SVGGraphicsElement>("[data-obstacle]"),
    ).map((el) => ({
      type: el.dataset.obstacle,
      box: el.getBBox(),
      inverse: el.getScreenCTM()!.inverse(),
    }));
    const failures: string[] = [];
    let sampled = 0;
    for (const route of routes) {
      const n = route.getTotalLength();
      for (let d = 0; d <= n; d += 2) {
        const p = route.getPointAtLength(d);
        const screen = new DOMPoint(p.x, p.y).matrixTransform(
          route.getScreenCTM()!,
        );
        sampled++;
        if (
          !roads.some((road) =>
            road.isPointInStroke(
              screen.matrixTransform(road.getScreenCTM()!.inverse()),
            ),
          )
        )
          failures.push(`off road at ${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        for (const o of obstacles) {
          const q = screen.matrixTransform(o.inverse),
            b = o.box;
          const margin = 6;
          if (
            q.x > b.x - margin &&
            q.x < b.x + b.width + margin &&
            q.y > b.y - margin &&
            q.y < b.y + b.height + margin
          )
            failures.push(`${o.type} at ${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }
      }
    }
    return { sampled, routeCount: routes.length, failures };
  });
  expect(result.routeCount).toBe(2);
  expect(result.sampled).toBeGreaterThan(400);
  expect(result.failures).toEqual([]);
  await page.waitForTimeout(2500);
  await page
    .locator(".campus-scene")
    .screenshot({ path: "artifacts/campus-routes.png" });
});
test("story has a connected opening, turning point and institutional payoff", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5188");
  await expect(
    page.getByRole("heading", { name: "A mochila está pronta. E a carona?" }),
  ).toHaveCount(1);
  await expect(page.locator(".story-turn")).toContainText(
    "A gente se encontra onde?",
  );
  await expect(
    page.getByRole("heading", {
      name: "Uma cadeira vazia nem sempre é falta de vontade.",
    }),
  ).toHaveCount(1);
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 650
  ) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: "artifacts/story-full.png", fullPage: true });
});
