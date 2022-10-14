import request from '@/utils/request'

export default {
  getList(id) {
    return request({
      url: `/eduservice/chapter/${id}`,
      method: 'GET'
    })
  },
  save(chapter) {
    return request({
      url: `/eduservice/chapter/`,
      method: 'POST',
      data: chapter
    })
  },
  getById(id) {
    return request({
      url: `/eduservice/chapter/chapter/${id}`,
      method: 'GET'
    })
  },
  update(chapter) {
    return request({
      url: `/eduservice/chapter/`,
      method: 'PUT',
      data: chapter
    })
  },
  delete(id) {
    return request({
      url: `/eduservice/chapter/${id}`,
      method: 'DELETE'
    })
  }
}
