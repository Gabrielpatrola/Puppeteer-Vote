const puppeteer = require('puppeteer');

const amount = process.argv[2]

if (!amount || isNaN(parseFloat(amount))) {
    console.error('Please enter a numeric amount as an argument')
    process.exit(1)
}

function randomiza(n) {
    var ranNum = Math.round(Math.random() * n);
    return ranNum;
}

function mod(dividendo, divisor) {
    return Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
}

function gerarCPF() {
    comPontos = false; // TRUE para ativar e FALSE para desativar a pontuação.
    var n = 9;
    var n1 = randomiza(n);
    var n2 = randomiza(n);
    var n3 = randomiza(n);
    var n4 = randomiza(n);
    var n5 = randomiza(n);
    var n6 = randomiza(n);
    var n7 = randomiza(n);
    var n8 = randomiza(n);
    var n9 = randomiza(n);
    var d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;
    var d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;
    retorno = '';
    if (comPontos) cpf = '' + n1 + n2 + n3 + '.' + n4 + n5 + n6 + '.' + n7 + n8 + n9 + '-' + d1 + d2;
    else cpf = '' + n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8 + n9 + d1 + d2;
    return cpf;
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://www.arduinobrasil.cc/univag/challenge2019/votacaopublicologin.asp');

    await page.type('#cpf', gerarCPF())

    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        page.click('input[name="Submit"]') // Clicking the link will indirectly cause a navigation
    ]);

    const rainInput = await page.$('#fcadastro1')
    await rainInput.click({ clickCount: 3 })
    await rainInput.type(amount);

    await page.type('#nome', 'TESTE2');
    await page.type('#email', 'TESTE2@TESTE2.COM');
    await page.type('#celular', '222222222');

    await page.click('input[name="Submit"]');
    await page.screenshot({ path: 'example.png' });
    const query = "CLIQUE AQUI";

    page.evaluate(query => {
        const elements = [...document.querySelectorAll('a')];
        const targetElement = elements.find(e => e.innerText.includes(query));
        targetElement && targetElement.click();
    }, query)

    const selectElem = await page.$('select[name="f1"]');
    await selectElem.type('SISTEMA DE IRRIGAÇÃO (Happy Code)');
    await page.click('input[name="Submit"]');


    /*  console.log('Rainfall Submitted!'); */

    //  await browser.close();
})();