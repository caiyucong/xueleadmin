import request from '@/utils/request'
const api_name = '/orderservice/order'

export default {
  // 分页查询
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  }
}
