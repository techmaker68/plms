/*
***********************************
@author Mohanned Hassan
@create_date 1st April 2023

A wrapper on axios functions, should be removed 

***********************************
*/
import { isObject } from "lodash-es";
import axios from "./http-common";
class ApiService {
  async post(url, data = {}, config = {}) {
    return await axios.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    if (data instanceof FormData) {
      data.append("_method", "PUT");
    } else if (isObject(data)) {
      data = {
        ...data,
        _method: "PUT",
      };
    }
    return await axios.post(url, data, config);
  }

  async patch(url, data = {}, config = {}) {
    if (data instanceof FormData) {
      data.append("_method", "PATCH");
    }
    return await axios.post(url, data, config);
  }

  async get(url, config = {}) {
    return await axios.get(url, config);
  }

  async delete(url, config = {}) {
    return await axios.delete(url, config);
  }
}

export default new ApiService();
