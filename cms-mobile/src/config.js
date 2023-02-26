const config = {
  dev: {
    domain: 'http://localhost:8080'
  },
  product: {
    domain: 'http://192.168.1.241'
  }
}
export default process.env.NODE_ENV === 'development' ? config.dev : config.product
