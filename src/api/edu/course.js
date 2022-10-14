import request from '@/utils/request'

export default {
  add(course) {
    return request({
      url: `/eduservice/course/`,
      method: 'POST',
      data: course
    })
  },
  getById(id) {
    return request({
      url: `/eduservice/course/${id}`,
      method: 'GET'
    })
  },
  update(course) {
    return request({
      url: `/eduservice/course/`,
      method: 'PUT',
      data: course
    })
  },
  getPublish(id) {
    return request({
      url: `/eduservice/course/publish/${id}`,
      method: 'GET'
    })
  },
  publish(id) {
    return request({
      url: `/eduservice/course/publish`,
      method: 'POST',
      data: {
        id
      }
    })
  },
  page(current, pageSize, courseQuery) {
    return request({
      url: `/eduservice/course/page/${current}/${pageSize}`,
      method: 'POST',
      data: courseQuery
    })
  },
  // 逻辑删除
  logicDelete(id) {
    return request({
      url: `/eduservice/course/logic/${id}`,
      method: 'DELETE'
    })
  },
  // 永久删除
  delete(id) {
    return request({
      url: `/eduservice/course/${id}`,
      method: 'DELETE'
    })
  }
}
