sc = {};

sc.test = function () {
	console.log('Hello from sc.test');
	return 'test';
};

sc.test_object = function () {
	this.msg = function() { console.log('Hello from sc.test_object');
	return 'test_object';
};

};
