import request from '@/utils/request'

export default {
  getList(current, pageSize, teacherQuery) {
    return request({
      url: `/eduservice/teacher/${current}/${pageSize}`,
      method: 'POST',
      data: teacherQuery
    })
  },
  deleteTeacher(id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: 'DELETE'
    })
  },
  saveTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/`,
      method: 'POST',
      data: teacher
    })
  },
  getById(id) {
    return request({
      url: `/eduservice/teacher/${id}`,
      method: 'GET'
    })
  },
  updateTeacher(teacher) {
    return request({
      url: `/eduservice/teacher/`,
      method: 'PUT',
      data: teacher
    })
  },
  getAll() {
    return request({
      url: `/eduservice/teacher`,
      method: 'GET'
    })
  }
}
