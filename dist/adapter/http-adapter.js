var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "aurelia-http-client", "./adapter"], function (require, exports, aurelia_http_client_1, adapter_1) {
    "use strict";
    var HttpAdapter = (function (_super) {
        __extends(HttpAdapter, _super);
        function HttpAdapter(config) {
            _super.call(this, config);
            this.httpClient = config.httpClient;
            this.api = config.api;
        }
        HttpAdapter.prototype.create = function (models) {
            var _this = this;
            var data = this.serializeModelData(models);
            return new Promise(function (resolve) {
                var promise = _this.getHttpClient().createRequest(_this.api.create)
                    .withContent(data).send();
                promise.then(function (response) {
                    resolve({
                        type: 'create',
                        success: true,
                        data: _this.getReader().read(response.content).data
                    });
                });
                promise.catch(function () {
                    resolve({
                        type: 'create',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.read = function (options) {
            var _this = this;
            return new Promise(function (resolve) {
                var requestPromise = _this.httpClient.createRequest(_this.api.read)
                    .withParams(options.params || {})
                    .send();
                requestPromise.then(function (response) {
                    var result = _this.getReader().read(response.content);
                    resolve({
                        type: 'read',
                        success: true,
                        data: result.data,
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        offset: result.offset
                    });
                });
                requestPromise.catch(function () {
                    resolve({
                        type: 'read',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.update = function (models) {
            var _this = this;
            return new Promise(function (resolve) {
                var requestPromise = _this.httpClient.createRequest(_this.api.update)
                    .withContent(_this.serializeModelData(models))
                    .send();
                requestPromise.then(function (response) {
                    resolve({
                        type: 'update',
                        success: true,
                        data: _this.getReader().read(response.content).data
                    });
                });
                requestPromise.catch(function () {
                    resolve({
                        type: 'update',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.delete = function (models) {
            var _this = this;
            return new Promise(function (resolve) {
                var requestPromise = _this.httpClient.createRequest(_this.api.update)
                    .withContent(_this.serializeModelData(models))
                    .send();
                requestPromise.then(function (response) {
                    resolve({
                        type: 'delete',
                        success: true,
                        data: _this.getReader().read(response.content).data
                    });
                });
                requestPromise.catch(function () {
                    resolve({
                        type: 'delete',
                        success: false
                    });
                });
            });
        };
        HttpAdapter.prototype.sync = function (batch) {
            var _this = this;
            return new Promise(function (resolve) {
                var inProgress = 3;
                var result = {};
                function attemptResolve() {
                    if (inProgress === 0) {
                        resolve(result);
                    }
                }
                _this.update(batch.forUpdate).then(function (update) {
                    result.update = update;
                    inProgress--;
                    attemptResolve();
                });
                _this.create(batch.forDeletion).then(function (deletion) {
                    result.delete = deletion;
                    inProgress--;
                    attemptResolve();
                });
                _this.create(batch.forInsertion).then(function (insertion) {
                    result.create = insertion;
                    inProgress--;
                    attemptResolve();
                });
            });
        };
        HttpAdapter.prototype.getHttpClient = function () {
            if (!this.httpClient) {
                this.httpClient = new aurelia_http_client_1.HttpClient();
            }
            return this.httpClient;
        };
        return HttpAdapter;
    }(adapter_1.AbstractAdapter));
    exports.HttpAdapter = HttpAdapter;
});
//# sourceMappingURL=http-adapter.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci9odHRwLWFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiL3NyYyIsInNvdXJjZXMiOlsiYWRhcHRlci9odHRwLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQWlCQTtRQUFpQywrQkFBZTtRQWdCOUMscUJBQWEsTUFBd0I7WUFDbkMsa0JBQU0sTUFBTSxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3hCLENBQUM7UUFNRCw0QkFBTSxHQUFOLFVBQU8sTUFBaUI7WUFBeEIsaUJBc0JDO1lBckJDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUzQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQWtCLFVBQUMsT0FBTztnQkFDMUMsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztxQkFDOUQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUU1QixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtvQkFDbkIsT0FBTyxDQUFDO3dCQUNOLElBQUksRUFBRSxRQUFRO3dCQUNkLE9BQU8sRUFBRSxJQUFJO3dCQUNiLElBQUksRUFBRSxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJO3FCQUNuRCxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDWixPQUFPLENBQUM7d0JBQ04sSUFBSSxFQUFFLFFBQVE7d0JBQ2QsT0FBTyxFQUFFLEtBQUs7cUJBQ2YsQ0FBQyxDQUFDO2dCQUNMLENBQUMs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
