/*	截斷字元
	function(擷取字數)*/
String.prototype.truncate = function(num){
	var txt = this.toString();
	return txt.substring(0,num);
};

String.prototype.fill = function(type, num, direction){
	var txt = this.toString();
	switch(direction)
	{
		case 'left':
			for(var i = 1; i <= num; i++)
			{
				txt = getCharType(type) + txt;
			}
			break;
		case 'right':
			for(var i = 1; i <= num; i++)
			{
				txt += getCharType(type);
			}
			break;
		default:
			for(var i = 1; i <= Math.ceil(num / 2); i++)
			{
				txt = getCharType(type) + txt;
			}
			for(var i = 1; i <= num - Math.ceil(num / 2); i++)
			{
				txt += getCharType(type);
			}
			break;
	}

	return txt;

	function getCharType(type)
	{
		switch(type)
		{
			case 'half':
				return ' ';
			case 'full':
				return '　';
			default:
				return '';
		}

	}
};