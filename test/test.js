// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { describe, it } = require('mocha')
const todomvcApi = require('todomvc-api')
const { api } = require('../server')

describe(__filename, () => {
  it('should validate the server', (done) => {
    const server = api.listen(8080, function () {
      todomvcApi.validate(function (err, stats) {
        server.close(function () {
          if (stats && (stats.errors || stats.failures)) {
            done(new Error('api validation failed'))
            return
          }
          done(err)
        })
      })
    })
  })
})
