let axios = require("axios");

class HttpRequest {
    constructor() {
        this._host = '';
        this._endpoint = '';
        this._method = 'GET';
        this._data = {};
        this._params = {};
        this._headers = {};
        this._port = null;
    }

    static make() {
        return new HttpRequest();
    }

    host(host) {
        this._host = host.replace(/\/+$/, '');
        return this;
    }

    port(port) {
        this._port = Number(port);
        return this;
    }

    endpoint(endpoint) {
        this._endpoint = endpoint.replace(/^\/+/, '');
        return this;
    }

    method(method) {
        this._method = method.toUpperCase();
        return this;
    }

    data(data, value = null) {
        if (value === null) {
            // Set the whole object
            this._data = data;
        } else {
            // Use data var as key
            this._data[data] = value;
        }
        return this;
    }

    params(params, value = null) {
        if (value === null) {
            this._params = params;
        } else {
            this._params[params] = value;
        }

        return this;
    }

    appendParams(params) {
        this._params = {...this._params, ...params};
        return this;
    }

    appendData(data) {
        this._data = {...this._data, ...data};
        return this;
    }

    header(key, value) {
        this._headers[key] = value;
        return this;
    }

    when(statement, callback, elseCallback = null) {
        if (statement) {
            callback(this);
        } else if (elseCallback !== null) {
            elseCallback(this);
        }
        return this;
    }

    async send() {
        let data = this._data;
        if (this._headers.hasOwnProperty('Content-Type') && this._headers["Content-Type"] === 'multipart/form-data') {
            data = objectToFormData(this._data);
        }

        let endpoint = this._host.length > 0 ? '/' + this._endpoint : this._endpoint;

        let url = this._host;
        if(this._port) {
            url += ':' + this._port
        }
        url += endpoint;

        return await axios.request({
            method: this._method,
            url,
            data,
            params: this._params,
            headers: this._headers,
            validateStatus: (status) => {
                return true; // axios will throw an error otherwise
            }
        });
    }
}


function objectToFormData(obj, rootName, ignoreList) {
    var formData = new FormData();

    function appendFormData(data, root) {
        if (!ignore(root)) {
            root = root || '';
            if (data instanceof File) {
                formData.append(root, data);
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    appendFormData(data[i], root + '[' + i + ']');
                }
            } else if (typeof data === 'object' && data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (root === '') {
                            appendFormData(data[key], key);
                        } else {
                            appendFormData(data[key], root + '[' + key + ']');
                        }
                    }
                }
            } else {
                if (data !== null && typeof data !== 'undefined') {
                    formData.append(root, data);
                }
            }
        }
    }

    function ignore(root) {
        return Array.isArray(ignoreList)
            && ignoreList.some(function (x) {
                return x === root;
            });
    }

    appendFormData(obj, rootName);

    return formData;
}

module.exports = HttpRequest;
