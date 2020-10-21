const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const expect				= require('chai').expect;
const fetch				= require('node-fetch');

const { server, client }		= require('../../src/index.js');

const PORT				= 34_567;

async function run_server_test ( test, port ) {
    const test_server			= new server();

    log.info("Listening on port: %s", port );
    await test_server.listen( port );

    try {
	await test.call( test_server );
    } finally {
	await test_server.close();
    }
}

function basic_tests () {
    it("should serve local asset", async () => {
	await run_server_test(async function () {
	    this.serve_local_assets( path.resolve( __dirname, "../html/" ) );

	    const req			= await fetch(`http://localhost:${PORT}/index.html`);
	    const resp			= await req.text();
	    log.silly("Result: %s", resp );

	    expect( resp		).to.have.string("Hello World");
	}, PORT );
    });

    it("should start server and get dynamic override response", async () => {
	await run_server_test(async function () {
	    this.serve_local_assets( ".", function ( request_path, default_path ) {
		log.info("Serving %-50.50s (default response %s)", request_path, default_path );
		if ( request_path === "/hello" ) {
		    this.contentType("text/html");
		    return JSON.stringify({ "hello": "World" });
		}
	    });

	    const api			= client.create(`http://localhost:${PORT}`);
	    const resp			= await api.get("/hello");
	    log.silly("Result: %s", JSON.stringify(resp,null,4) );

	    expect( resp.hello		).to.equal("World");
	}, PORT );
    });
}

describe("HTTP Utils Unit Tests", () => {

    describe("Basic", basic_tests );

});
