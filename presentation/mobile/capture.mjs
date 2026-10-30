import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {refine} from './refine.mjs';

const out='presentation/mobile';
await mkdir(`${out}/prints`,{recursive:true});

const browser=await chromium.launch();
const context=await browser.newContext({
  viewport:{width:430,height:932},
  deviceScaleFactor:3,
  isMobile:true,
  hasTouch:true,
  locale:'pt-BR'
});
const page=await context.newPage();
const root='http://127.0.0.1:5188/app';

await page.goto(root);
await page.locator('.ua-ride').first().waitFor();

// Preparar estado demo com conversa e histórico
await page.getByRole('button',{name:'Ver carona',exact:true}).first().click();
await page.getByRole('button',{name:'Solicitar vaga na demo'}).click();
await page.getByLabel('Perfil de demonstração').selectOption('driver');
await page.getByRole('button',{name:'Simular aceite'}).click();
await page.getByRole('button',{name:'Abrir conversa'}).click();

for(const [role,text] of [
  ['passenger','Oi, Lucas! Podemos nos encontrar na praça do centro?'],
  ['driver','Claro! Passo às 18h20, perto da banca.'],
  ['passenger','Perfeito. Minha aula começa às 19h. Até já!'],
  ['driver','Combinado! A gente vai junto.']
]){
  await page.getByLabel('Perfil de demonstração').selectOption(role);
  await page.getByLabel('Mensagem',{exact:true}).fill(text);
  await page.getByRole('button',{name:'Enviar mensagem'}).click();
}

await page.evaluate(()=>{
  const d=JSON.parse(localStorage.getItem('unigo-app-demo-v1'));
  for(let i=1;i<=3;i++){
    const day=new Date();
    day.setDate(day.getDate()-i);
    d.requests.push({
      id:`presentation-history-${i}`,
      rideId:'demo-1',
      date:new Date(day-day.getTimezoneOffset()*60000).toISOString().slice(0,10),
      status:'completed',
      messages:[],
      feedback:'Tudo certo'
    });
  }
  localStorage.setItem('unigo-app-demo-v1',JSON.stringify(d));
});

const prepared = await page.evaluate(()=>localStorage.getItem('unigo-app-demo-v1'));

// Limpar requests ativos para a tela de descoberta ficar limpa
await page.evaluate(()=>{
  const d=JSON.parse(localStorage.getItem('unigo-app-demo-v1'));
  d.requests=[];
  localStorage.setItem('unigo-app-demo-v1',JSON.stringify(d));
});

await page.reload();
await page.locator('.ua-ride').first().waitFor();
await page.addStyleTag({content:await readFile(`${out}/polish.css`,'utf8')});

const manifest=[];

async function snap(id,mode,title){
  await refine(page,mode);
  await page.evaluate(mode=>{
    document.body.dataset.capture=mode;
    window.scrollTo(0,0);
    if(document.activeElement instanceof HTMLElement) document.activeElement.blur();
  },mode);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(600);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow) throw Error(`Horizontal overflow: ${id}`);

  if(mode==='discover'){
    const cta=await page.getByRole('button',{name:'Ver carona',exact:true}).first().boundingBox();
    const nav=await page.locator('.ua-sidebar').boundingBox();
    if(cta.y+cta.height>nav.y-3) throw Error('Discovery CTA overlaps bottom navigation');
  }

  await page.screenshot({path:`${out}/prints/${id}.png`,fullPage:false});
  manifest.push({id,title,width:1290,height:2796,mode});
  await writeFile(`${out}/manifest.json`,JSON.stringify(manifest,null,2));
}

// 1 — Descobrir carona
await page.evaluate(()=>document.body.dataset.capture='discover');
await page.getByLabel('Filtrar origem').selectOption('Centro de Ourinhos');
await page.locator('.leaflet-tile-loaded').first().waitFor({timeout:25000});
await page.waitForTimeout(1000);
await snap('01-encontrar-carona','discover','Encontre quem já vai pelo seu caminho.');

// 2 — Detalhes do motorista
await page.getByRole('button',{name:'Ver carona',exact:true}).first().click();
await snap('02-conhecer-motorista','details','Conheça a pessoa antes de combinar.');
await page.keyboard.press('Escape');

// Restaurar estado com conversa + histórico para as telas seguintes
await page.evaluate(value=>localStorage.setItem('unigo-app-demo-v1',value),prepared);
await page.reload();
await page.locator('.ua-ride').first().waitFor();
await page.addStyleTag({content:await readFile(`${out}/polish.css`,'utf8')});

// 3 — Minhas caronas
await page.getByRole('button',{name:/Minhas caronas/}).click();
await snap('03-minhas-caronas','trips','Do pedido ao encontro, tudo no mesmo lugar.');

// 4 — Conversa
await page.getByRole('button',{name:'Abrir conversa',exact:true}).first().click();
await snap('04-conversa','chat','Menos desencontro. Mais conversa.');

// 5 — Oferecer carona
await page.getByRole('button',{name:'Oferecer carona',exact:true}).click();
await page.getByLabel('Contribuição (R$)',{exact:true}).fill('12');
await page.getByLabel('Repetir nos dias úteis').check();
await snap('05-oferecer-carona','publish','Já vai para o campus? Leve alguém.');
await page.keyboard.press('Escape');

// 6 — Perfil
await page.getByRole('button',{name:'Meu perfil',exact:true}).click();
await snap('06-perfil-confianca','profile','A confiança cresce no caminho.');

if(manifest.length!==6) throw Error(`Expected six captures, got ${manifest.length}`);
console.log(JSON.stringify({captured:manifest.length,files:manifest.map(x=>x.id)},null,2));
await browser.close();