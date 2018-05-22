import axios from 'axios';

export default class Service {
	constructor() {
		this.axios = axios.create({
			baseURL: `http://localhost:8080/`,
			responseType: 'application/json'
		});
	}

  /**
	 * Call a service action via REST API
	 *
	 * @param {string} apiUrl	url of request API
	 * @param {string} method GET, POST, PUT, FETCH, DELETE
	 * @param {any} params	parameters to request
	 * @returns	{Promise}
	 *
	 * @memberOf Service
	 */
	rest(apiUrl, method, params) {
		return new Promise((resolve, reject) => {
			this.axios.request(apiUrl, {
				method,
				data: params
			}).then(response => {
				if (response && response.data) { resolve(response.data); }
				else { reject(response); }
			})
.catch(error => {
				if (error.response && error.response.data && error.response.data.error) {
					console.error('REST request error!', error.response.data.error);
					reject(error.response.data.error);
				}
 else { reject(error); }
			});
		});
	}
}