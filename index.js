const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const port = 3000;
app.use(cors());

app.set('view engine','ejs');
// Static
app.use(express.static(__dirname + '/public'));
app.use("/favicon.ico", express.static("images/favicon.ico"))

app.get('/get-content', async (req, res) => {
  try {
    const response = await fetch('https://fortics.statuspage.io/');
    const html = await response.text();

    // Use cheerio para carregar o HTML e manipulá-lo no lado do servidor
    const $ = cheerio.load(html);

    // Isola as divs com a classe 'component-container border-color is-group'
    const isolatedDivs = $('div.component-container.border-color.is-group').clone();

    // Remove as divs com a classe 'component-container border-color'
    $('div.component-container.border-color').remove();

    // Remove dados do site
    $('h4.font-largest').remove();

    $('div.page-status.status-none').attr('class', 'alert alert-success');

    // Adicione a classe "text-center" para centralizar o texto dentro do alerta
    $('.alert.alert-success').addClass('text-center');

    $('.components-section.font-regular').addClass('text-center');

    // Adiciona as divs isoladas de volta ao documento
    $('div.components-container.one-column').append(isolatedDivs);

    // Remove os hiperlinks dentro da classe incidents-list com a classe format-expanded
    $('div.components-uptime-link.history-footer-link a').remove();
    // Remove os hiperlinks dentro da classe incidents-list com a classe format-expanded
    $('div.incidents-list.format-expanded a').contents().unwrap();

    // $('div.spacer').remove();
    $('div.legend-item.light.legend-item-date-range').remove();
    $('div.legend-item.legend-item-uptime-value.legend-item').remove();
    $('div.legend-item').remove();
    $('div.outages').remove();
    $('div.page-footer.border-color.font-small').remove();

    // Formate o HTML, se necessário
    const formattedHTML = $.html();

    res.send(formattedHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter conteúdo da página.');
  }
});

app.get('/', async (req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});