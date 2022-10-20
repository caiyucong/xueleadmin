import request from '@/utils/request'

export default {
  // 讲师和分页查询
  BannerQueryPage(page, limit) {
    return request({
      // url: '/table/list',
      url: `/servicecms/banneradmin/${page}/${limit}`,
      // url: '/eduorder/order/orderQueryGet/' + page + '/' + +limit,
      method: 'get'
    })
  },
  // 添加
  saveBanner(crmBanner) {
    return request({
      // url: '/table/list',
      url: '/servicecms/banneradmin/save',
      method: 'post',
      data: crmBanner
    })
  },
  // 删除
  deleteBanner(id) {
    return request({
      // url: '/table/list',
      url: '/servicecms/banneradmin/remove/' + id,
      method: 'delete'
    })
  },
  // 根据id查询
  getBannerInfo(id) {
    return request({
      // url: '/table/list',
      url: '/servicecms/banneradmin/get/' + id,
      method: 'get'
    })
  },
  // 修改
  updateBannerInfo(crmBanner) {
    return request({
      // url: '/table/list',
      url: '/servicecms/banneradmin/update',
      method: 'put',
      data: crmBanner
    })
  }
}
