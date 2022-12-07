const url = 'https://github.com/danawalab/is-deploy-agent'
const axios = require('axios')
const cheerio = require('cheerio')

describe('cheerio ', function () {

    const getHtml = () => {
        try {
            return axios.get(url);
        } catch (error) {
            console.error(error)
        }
    };

    getHtml()
        .then((html) => {
            const $ = cheerio.load(html.data);

            const data = {
                mainContents: $('#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-sidebar > div > div:nth-child(2) > div > a > div > div.d-flex > span.css-truncate.css-truncate-target.text-bold.mr-2').text(),
            };

            return data;
        })
        .then((resp) => console.log(resp))
});
