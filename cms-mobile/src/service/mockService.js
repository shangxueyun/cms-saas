import pathToRegexp from 'path-to-regexp'
import mockData from './mockData.json'
class MockService {
  constructor () {
    this.mocks = []
  }

  add ({url, data, method = 'get'}) {
    let keys = []
    let re = pathToRegexp(url, keys)
    this.mocks.push({keys, re, method, data})
  }

  execute (httpMethod, url) {
    let found = this.mocks.find(({re, method}) => {
      return (httpMethod === method) && re.exec(url) !== null
    })
    if (found) {
      return found.data
    }
  }
}

const mockService = new MockService()
export default mockService

mockData.forEach(item => mockService.add(item))
