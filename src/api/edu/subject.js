import request from '@/utils/request'

export default {
  getList() {
    return request({
      url: `/eduservice/subject/`,
      method: 'GET'
    })
  }
}
