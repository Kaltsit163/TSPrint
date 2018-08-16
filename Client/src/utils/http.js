import axios from 'axios'
let axiosConf = {
  baseURL: `/`,
  withCredentials: true,
  headers: {}
}

export default axios.create(axiosConf)
