function easyhttp() {
  this.http = new XMLHttpRequest();
}

easyhttp.prototype.get = function (uri, callback) {
  this.http.open('GET', uri, true);
  let self = this;
  this.http.onload = function () {
    if (self.http.status === 200) {
      callback(null, self.http.response);
    } else {
      callback(`Error: ${self.http.status}-${self.http.statusText}`);
    }
  }
  this.http.send();
}

easyhttp.prototype.post = function (uri, data, callback) {
  this.http.open('POST', uri, true);
  this.http.setRequestHeader('Content-type', 'application/json');
  let self = this;
  this.http.onload = function () {
    if (self.http.status === 201) {
      callback(null, self.http.response);
    } else {
      callback(`Error: ${self.http.status}-${self.http.statusText}`);
    }
  }
  this.http.send(JSON.stringify(data));
}

easyhttp.prototype.put = function (uri, data, callback) {
  this.http.open('PUT', uri, true);
  this.http.setRequestHeader('Content-type', 'application/json');
  let self = this;
  this.http.onload = function () {
    if (self.http.status === 200) {
      callback(null, self.http.response);
    } else {
      callback(`Error: ${self.http.status}-${self.http.statusText}`);
    }
  }
  this.http.send(JSON.stringify(data));
}

easyhttp.prototype.delete = function (uri, callback) {
  this.http.open('DELETE', uri, true);
  let self = this;
  this.http.onload = function () {
    if (self.http.status === 200) {
      callback(null, 'post deleted');
    } else {
      callback(`Error: ${self.http.status}-${self.http.statusText}`);
    }
  }
  this.http.send();
}