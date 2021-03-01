import {Router} from 'express';
import {apiStatus} from '../../../lib/util';
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config }) => {
  let api = Router();
  api.get('/ves/menu/items/:storeId', (req, res) => {
    const client = Magento2Client(config.magento2.api);
    let url = '/ves/menu/items/' +
        '?searchCriteria[filter_groups][0][filters][0][field]=alias' +
        '&searchCriteria[filter_groups][0][filters][0][value]=menu-top' +
        '&searchCriteria[filter_groups][0][filters][0][condition_type]=in' +
        '&searchCriteria[filter_groups][0][filters][1][field]=store_id' +
        '&searchCriteria[filter_groups][0][filters][1][value]=' + req.params.storeId;

    client.addMethods('sendMenu', (restClient) => {
      let module = {};
      module.getBlock = function () {
        return restClient.get(url);
      }
      return module;
    })
    client.sendMenu.getBlock().then((result) => {
      apiStatus(res, result, 200); // just dump it to the browser, result = JSON object
    }).catch(err => {
      apiStatus(res, err, 500);
    });
  });
  return api;
};
