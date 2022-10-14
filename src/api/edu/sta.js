import request from '@/utils/request'

export default {
  create(day) {
    return request({
      url: `/statisticsservice/statistics-daily/${day}`,
      method: 'POST'
    })
  }
}
