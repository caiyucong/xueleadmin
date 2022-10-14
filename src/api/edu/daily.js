import request from '@/utils/request'
export default {
  showChart(searchObj) {
    return request({
      url: `/statisticsservice/statistics-daily/${searchObj.type}/${
        searchObj.begin
      }/${searchObj.end}`,
      method: 'GET'
    })
  }
}
