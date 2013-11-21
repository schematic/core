module.exports = TypeContainer

function TypeContainer() {
	var map = {}
	function types(name, type) {
		if (type === undefined) {
			name = name.toLowerCase()
			return map.hasOwnProperty(name)
				? map[name]
				: undefined
		} else {
			map[name.toLowerCase()] = type
			type.Types[typeCase(name)] = type
			return type
		}
	}
	types.Types = {}
	return types
}


function typeCase(name) {
	return name.substr(0,1).toUpperCase() + name.substr(1)
}


