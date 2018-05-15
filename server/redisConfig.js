var settings = {};

var node_env = process.env.node_env || 'development';

settings.getRedisCredentials = function() {
	var vcaps = JSON.parse(process.env.VCAP_SERVICES || '{}');
	var creds;
	Object.keys(vcaps).forEach(function(vcap) {
		if (vcap.indexOf('redis') > -1) {
			creds = vcaps[vcap][0].credentials;
		}
	});
	return creds;
}

module.exports = settings;
