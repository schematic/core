exports.map = 
function map(obj, target , fn){
	if(typeof target == 'function'){
		fn = target
		target = {}
	}
	target = target || {}
	Object
		.keys(obj)
		.forEach(function(key){
			target[key] = fn(key, obj[key], target)
		})
	return target
}