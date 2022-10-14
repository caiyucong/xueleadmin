import request from '@/utils/request'

export default {
  save(vdieo) {
    return request({
      url: `/eduservice/video/`,
      method: 'POST',
      data: vdieo
    })
  },
  getById(id) {
    return request({
      url: `/eduservice/video/${id}`,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: `/eduservice/video/${id}`,
      method: 'DELETE'
    })
  },
  update(vdieo) {
    return request({
      url: `/eduservice/video/`,
      method: 'put',
      data: vdieo
    })
  },
  deleteVideo(id) {
    return request({
      url: `/eduvod/vod/${id}`,
      method: 'DELETE'
    })
  }
}
