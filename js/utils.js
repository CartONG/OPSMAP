/* getUniqueValues(s, f) : returns object with list and count of unique values for a given field.
 * @param s Array : Array of objects (source).
 * @param f String : Objects property to watch (field).
 */
function getUniqueValues(s, f){
	var result = {};
	var l = result.list = [];
	var c = result.count = {};
	$.each(s, function(i, v){
		if(l.indexOf(v[f]) === -1){
			l.push(v[f]);
			c[v[f]] = 1
		} else {
			c[v[f]] += 1;					
		}
	});
	return result;
}

/* toProperCase(s) : returns "propercased" string.
 * @param s String
 */
function toProperCase(s) {
		return s.toLowerCase().replace(/^(.)|\s(.)|\u002D(.)|\u0027(.)/g, 
		function($1){ return $1.toUpperCase(); });
};

/* getJsDateFromExcel(d) : returns converted data from EXCEL to javascript format.
 * @param d Integer : date value in EXCEL format (may vary, by default number of days since 01/01/1900).
 */
function getJsDateFromExcel(d) {
	var date = new Date((d - (25567 + 2))*86400*1000);
	// return format : "DD/MM/YYYY"
	var DD = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var MM = date.getMonth() > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
	var YYYY = date.getFullYear();
	return DD + '/' + MM + '/' + YYYY;
}