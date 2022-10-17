import request from '@/utils/request'

export default {
  // 带条件的分页查询
  getPageList(current, limit, commentQuery) {
    return request({
      url: `/eduservice/comment/getCommentPageList/${current}/${limit}`,
      method: 'post',
      data: commentQuery
    })
  },
  // 删除评论信息
  deleteCommentById(commentId) {
    return request({
      url: `/eduservice/comment/deleteCommentById/${commentId}`,
      method: 'delete'
    })
  }
}
