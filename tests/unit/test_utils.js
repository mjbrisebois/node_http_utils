const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const expect				= require('chai').expect;

const { server, client }		= require('../../src/index.js');

let test_server;

function basic_tests () {
    it("should start server and get response", async () => {
	const PORT			= 34_567;

	test_server.serve_local_assets( ".", function ( request_path, default_path ) {
	    log.info("Serving %-50.50s (default response %s)", request_path, default_path );
	    if ( request_path === "/hello" ) {
		this.contentType("text/html");
		return JSON.stringify({ "hello": "World" });
	    }
	});

	log.info("Listening on port: %s", PORT );
	test_server.listen( PORT );

	const fetch			= client.create(`http://localhost:${PORT}`);
	const resp			= await fetch.get("/hello");
	log.silly("Result: %s", JSON.stringify(resp,null,4) );

	expect( resp.hello		).to.equal("World");
    });
}

describe("HTTP Utils Unit Tests", () => {

    before("Create server", async () => {
	test_server			= new server();
    });
    after("Close server", async () => {
	await test_server.close();
    });

    describe("Basic", basic_tests );

});
