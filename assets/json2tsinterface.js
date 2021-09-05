// variable JSON 数据
function toInterface (variable) {
	var interfaceNames = ['IUnknown'];
	var extra_interface = '';

	function getVariableType (variable, name) {
		if (variable === undefined) {
			return 'void /* undefined */';
		}
		
		var type = typeof variable;
		if (type == 'object') {
			if (!variable)
				return 'void /* 未知类型 */';
			
			if (name.slice(-2) == 'es') {
				name = name.slice(0, -2);
			} else if (name.slice(-1) == 's') {
				name = name.slice(0, -1);
			}
			if (variable.constructor.name == 'Array') {
				return getVariableType(variable[0], name) + '[]';
			}

			if (name) {
				name = name[0].toUpperCase() + name.slice(1);
			} else {
				name = 'Unknown';
			}
			var ifName = 'I' + name;

			if (interfaceNames.indexOf(ifName) != -1) {
				var i = 1;
				while (interfaceNames.indexOf(ifName + '_' + i) != -1) {
					i++;
				}

				ifName = ifName + '_' + i;
			}
			interfaceNames.push(ifName);
			var extra = generateInterface(ifName, variable, '');
			extra_interface = extra + extra_interface;
			return ifName;
		}

		return type;
	}

	function formatKey (key) {
		if (!/^[a-z][a-z\d]*$/i.test(key))
			return JSON.stringify(key);

		return key;
	}

	function generateInterface (pref_name, variable, indent) {
		var r = '\n' + indent + 'interface ' + pref_name + ' {\n';
		var sub_indent = '\t' + indent;

		r += Object.keys(variable).map(function(k){
			return sub_indent + formatKey(k) + ': ' + getVariableType(variable[k], k);
		}).join(';\n') + ';\n';

		r += indent + '}\n\n';

		return r;
	}


	var interface = generateInterface('IUnknown', variable, '');
	return (interface + '\n/* 自动生成的 Interface */\n' + extra_interface).trim();
};


