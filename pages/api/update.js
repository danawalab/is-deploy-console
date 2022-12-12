import axios from "axios";
import * as cheerio from "cheerio";

export default function handler(req, res) {
    const URL = 'https://github.com/danawalab/is-deploy-agent'

    axios.get(URL)
        .then((resp) => {
            const html = cheerio.load(resp.data);

            return {
                tag: html('#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-sidebar > div > div:nth-child(2) > div > a > div > div.d-flex > span.css-truncate.css-truncate-target.text-bold.mr-2').text(),
            };
        })
        .then((resp) => {
            return res.status(200).json(resp.tag);
        });
}