const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const fetch				= require('node-fetch');
const { URL, URLSearchParams }		= require('url');


function create ( host, defaults = {} ) {
    if ( host.slice(-1) !== "/" )
	host			       += "/";

    return {
	async method ( method, url_path, { query = null, data = null, headers = {}, ...config } = {}) {
	    url_path			= url_path[0] === "/"
		? url_path.slice(1)
		: url_path;
	    query			= typeof query === "object" && query !== null
		? "?" + (new URLSearchParams(query)).toString()
		: "";
	    let json			= data === null ? undefined : JSON.stringify( data );

	    return fetch(`${host}${url_path}${query}`, {
		"method":	method,
		"body":		json,
		"headers":	Object.assign({}, defaults.headers, headers ),
		"timeout":	config.timeout || defaults.timeout || 1_000,
	    }).then(async res => {
		if ( config.response === true )
		    return res;
		else {
		    let body		= await res.text();
		    try {
			return JSON.parse( body );
		    } catch ( err ) {
			log.silly("Response body: %s", body );
			return err;
		    }
		}
	    });
	},
	async get ( url_path, query, config = {} ) {
	    return await this.method( "get", url_path, { query, ...config } );
	},
	async head ( url_path, config = {} ) {
	    return await this.method( "head", url_path, { "response": true, ...config } );
	},
	async post ( url_path, data = {}, config = {} ) {
	    return await this.method( "post", url_path, { data, ...config } );
	},
	async put ( url_path, data = {}, config = {} ) {
	    return await this.method( "put", url_path, { data, ...config } );
	},
	async patch ( url_path, data = {}, config = {} ) {
	    return await this.method( "patch", url_path, { data, ...config } );
	},
	async del ( url_path, config = {} ) {
	    return await this.method( "delete", url_path, config );
	},
    };
};


module.exports				= {
    create,
};
