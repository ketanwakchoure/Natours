class APIFeatures {
  constructor(query,queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    let queryObj = { ...this.queryStr }
    const excludeField = ['limit', 'sort', 'fields', 'page']
    excludeField.forEach(el => delete queryObj[el])
    let queryString = JSON.stringify(queryObj) 
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => {
      return `$${match}`
    });
    this.query = this.query.find(JSON.parse(queryString))
    return this
  }

  sort() {
    if(this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ')
      this.query = this.query.sort(this.queryStr.sort)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  limitFields() {
    if(this.queryStr.fields) {
      const field = this.queryStr.fields.split(',').join(' ')
      this.query = this.query.select(field)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1
    const limit = this.queryStr.limit * 1 || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)
  }
}

module.exports = APIFeatures
