// ATTRIBUTION: https://github.com/dougmoscrop/serverless-http

function isContentEncodingBinary ({ headers, binaryEncodingTypes }) {
  const contentEncoding = headers['content-encoding']

  if (typeof contentEncoding !== 'string') return false

  return contentEncoding
    .split(',')
    .some(value => binaryEncodingTypes.some(binaryEncoding => value.includes(binaryEncoding)))
}

function getContentType ({ headers }) {
  const contentTypeHeader = headers['content-type'] || ''

  // only compare mime type; ignore encoding part
  return contentTypeHeader.split(';')[0]
}

function isContentTypeBinary ({ headers, binaryContentTypes }) {
  if (!binaryContentTypes || !Array.isArray(binaryContentTypes)) return false

  const binaryContentTypesRegexes = binaryContentTypes.map(binaryContentType => new RegExp(`^${binaryContentType.replace(/\*/g, '.*')}$`))
  const contentType = getContentType({ headers })

  if (!contentType) return false

  return binaryContentTypesRegexes.some(binaryContentType => binaryContentType.test(contentType))
}

module.exports = function isBinary ({ headers, binarySettings }) {
  if (binarySettings.isBinary === false) {
    return false
  }

  if (typeof binarySettings.isBinary === 'function') {
    return binarySettings.isBinary({ headers })
  }

  return isContentEncodingBinary({ headers, binaryEncodingTypes: binarySettings.contentEncodings }) ||
    isContentTypeBinary({ headers, binaryContentTypes: binarySettings.contentTypes })
}
