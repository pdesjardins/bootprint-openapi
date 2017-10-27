/*!
 * bootprint-swagger <https://github.com/nknapp/bootprint-swagger>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */
const expect = require('chai').expect
const tester = require('bootprint-unit-testing')

describe('OpenAPI 2.0: The paths spec', function () {
  this.timeout(10000)
  const bptest = tester(require('../../..'), __dirname, './swagger.yaml')
  before(bptest.run)

  it('should render panels for all operations', function () {
    expect(bptest.textIn('.openapi--panel-operation .panel-title')).to.equal('GET /deprecated/resource DELETE /user/{id} GET /user/{id} HEAD /user/{id} OPTIONS /user/{id} PATCH /user/{id} POST /user/{id} PUT /user/{id} GET /user/{id}/bag/{bagId}/item/{itemId} GET /without/params POST /without/params')
  })

  it('should render the operation summary', function () {
    expect(bptest.textIn('#operation--user--id--post [data-oai-keywords="summary"]')).to.equal('Add a user')
  })

  it('should render the deprecation notice to deprecated operations', function () {
    expect(bptest.textIn('#operation--deprecated-resource-get [data-oai-keywords="deprecated"]')).to.match(/deprecated/)
  })

  it('should not add the deprecation notice to other operations', function () {
    expect(bptest.$('#operation--user--id--post').length).to.equal(1)
    expect(bptest.$('#operation--user--id--post [data-oai-keywords="deprecated"]').length).to.equal(0)
  })

  it('should render the "consumes"-property', function () {
    expect(classAndContents('#operation--user--id--post [data-oai-keywords="consumes"]')).to.deep.equal({
      contents: 'Consumes application/json, application/xml',
      classes: undefined
    })
  })

  it('should render the global "consumes"-property if none is explicitly specified, but mark it as fallback value', function () {
    expect(classAndContents('#operation--user--id--get [data-oai-keywords="consumes"]')).to.deep.equal({
      contents: 'Consumes application/json',
      classes: 'openapi--fallback-value'
    })
  })

  it('should render the "produces"-property', function () {
    expect(classAndContents('#operation--user--id--post [data-oai-keywords="produces"]')).to.deep.equal({
      contents: 'Produces application/json, application/xml',
      classes: undefined
    })
  })

  it('should render the global "consumes"-property if none is explicitly specified, but mark it as fallback value', function () {
    expect(classAndContents('#operation--user--id--get [data-oai-keywords="produces"]')).to.deep.equal({
      contents: 'Produces application/xml',
      classes: 'openapi--fallback-value'
    })
  })

  it('should render the "schemes"-property', function () {
    expect(classAndContents('#operation--user--id--post [data-oai-keywords="schemes"]')).to.deep.equal({
      contents: 'Schemes http, https, ws, wss',
      classes: undefined
    })
  })

  it('should render the global "schemes"-property if none is explicitly specified, but mark it as fallback value', function () {
    expect(classAndContents('#operation--user--id--get [data-oai-keywords="schemes"]')).to.deep.equal({
      contents: 'Schemes https',
      classes: 'openapi--fallback-value'
    })
  })

  it('should render the "operationId"-property', function () {
    expect(bptest.textIn('#operation--user--id--post [data-oai-keywords="operationId"]')).to.equal('Operation ID 1123402313')
  })

  it('should render no operationId, if none is explicitly specified', function () {
    expect(bptest.$('#operation--user--id--get [data-oai-keywords="operationId"]').length).to.equal(0)
  })

  it('should render a "parameters"-section if there are any parameters', function () {
    expect(bptest.$('#operation--user--id--get [data-oai-keywords="parameters"]').length).to.equal(1)
  })

  it('should render parameters that are explicitly defined in the operations Parameters Object', function () {
    expect(bptest.$('#operation--user--id--get [data-oai-keywords="parameters"]')).to.match(/levelOfDetail/)
  })

  it('should render parameters, that are defined in the Path Item Object', function () {
    expect(bptest.$('#operation--user--id--delete [data-oai-keywords="parameters"]').length, 'Parameters-section must exist').to.equal(1)
    expect(bptest.$('#operation--user--id--delete [data-oai-keywords="parameters"]'), 'Checking implicit parameter').to.match(/The ID of the user/)
  })

  it('should render the explicit version of a parameter if it is defined both at the Path Item Object and (explicitly) in the Operation)', function () {
    expect(bptest.$('#operation--user--id--get [data-oai-keywords="parameters"]')).to.match(/Override of the id-parameter/)
  })

  it('should not render a "parameters"-section if there are no parameters', function () {
    expect(bptest.$('#operation--without-params-get').length).to.equal(1)
    expect(bptest.$('#operation--without-params-get [data-oai-keywords="parameters"]').length).to.equal(0)
  })

  it('should not render a "parameters"-section if there are is only a "body"-parameters', function () {
    expect(bptest.$('#operation--without-params-post').length).to.equal(1)
    expect(bptest.$('#operation--without-params-post [data-oai-keywords="parameters"]').length).to.equal(0)
  })

  it('should always render a "response"-section', function () {
    expect(bptest.$('#operation--user--id--post').length).to.equal(1)
    expect(bptest.$('#operation--user--id--post [data-oai-keywords="responses"]').length).to.equal(1)
  })

  it('should render a "response"-panel for each response-code, with the correct operations', function () {
    expect(bptest.$('#operation--user--id--get').length).to.equal(1)
    let responsePanelHeaders = bptest.$('#operation--user--id--get [data-oai-keywords="responses"] > .utils-cards > .utils-card > .header')
    expect(responsePanelHeaders.length).to.equal(2)
    expect(responsePanelHeaders.eq(0).text()).to.match(/200.*OK/)
    expect(responsePanelHeaders.eq(1).text()).to.match(/404.*Not Found/)
  })

  it('should render an "externalDocs"-link with description, if provided', function () {
    expect(bptest.$('#operation--user--id--get [data-oai-keywords="externalDocs"]').html().trim()).to.equal('An <strong>external</strong> documentation')
    expect(bptest.$('#operation--user--id--get [data-oai-keywords="externalDocs"]').attr('href')).to.equal('http://example.com/get-user')
  })

  it('should render an "externalDocs"-link with the url as link-text, if no description is given', function () {
    expect(bptest.$('#operation--user--id--post [data-oai-keywords="externalDocs"]').html().trim()).to.equal('http://example.com/post-user')
    expect(bptest.$('#operation--user--id--post [data-oai-keywords="externalDocs"]').attr('href')).to.equal('http://example.com/post-user')
  })

  /**
   * Return the classes and the text of a html-element
   * @param {string} selector the selector identifying the element
   * @returns {{contents: string, classes}}
   */
  function classAndContents (selector) {
    return {
      'contents': bptest.textIn(selector),
      'classes': bptest.$(selector).attr('class')
    }
  }
})