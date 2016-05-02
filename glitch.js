var glitch = function(){ "use strict";

	var support = /[jpeg|png|gif]+/i;
	var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	// Public methods
	// A) Initiate a new glitch() image
	function glitch(source, callback, strength, attempts){
		
		if (typeof source !== "string") return error("An image source is required");
		if (typeof callback !== "function") return error("A callback Function is required");
		
		strength = limit(strength, 5, 100) || 25;
		attempts = limit(attempts, 5, 100) || 50;
									
		var isBase64 = /data:[\w\/\w]+;base64,/i.test(source);		
		if (isBase64) manipulate(prepare(this, source, callback, strength), attempts);
		else get(this, source, callback, strength, attempts);

	}	
	return glitch;
	
	// Private methods
	// A) Preparation
	// 1) Load a raw image file using xhr, base64-encode it and start over
	function get(context, source, callback, strength, attempts){
					
		var request = new XMLHttpRequest();
		request.open('GET', source);
		request.overrideMimeType('text/plain;charset=x-user-defined');
		request.onload = function(){
						
			var response = request.response;
			var match = response.substring(0,24).match(/[JFIF|GIF|PNG]+/i);
			if (match){
				var type = /JFIF/i.test(match[0]) ?	"jpeg" : match[0].toLowerCase();
				var file = encode(response, "image/" + type);
				glitch.call(context, file, callback, strength, attempts);
			}
			
		};
		request.onerror = function(){ error("The image could not be loaded") };
		request.send();
	
	}
	
	// 2) Return an Object from a base64-encoded string that will be used later on
	function prepare(context, source, callback, strength){
	
		var split = source.split(",");
		var data = distribute(split[1], strength);
		
		return {
			
			context: context,
			source: source,
			callback: callback,
			strength: strength,
			attempts: 0,
			
			header: split[0] + ",",
			data: data,
			slice: data[data.length - 1].length
			
		};
		
		// Return an Array with an even distribution of the image data
		function distribute(data){
			var bytes = data.length;
			var slice = Math.sqrt(bytes * (parseFloat("1e" + bytes.toString().length) / strength));
			var count = bytes / slice;											
			return data.match(new RegExp('.{1,' + Math.ceil(bytes / count) + '}', 'g'));
		}
		
	}
	
	// B) Manipulation
	// 1)
	function manipulate(object, attempts){
										
		var data = object.data;
		var result = [ object.header ];
				
		if (++object.attempts < attempts){
			for (var i = 0, length = data.length; i < length; ++i){
				result.push(alter(data[i], object.slice, attempts));	
			}
			validate(result.join(""), object, attempts);
		}
		else delegate(object.source, false, object);
		
		function alter(string, length, attempts){
			
			var amount = limit(0|attempts / 10, 1, 10);
			while (amount--){
				var index = Math.random() * length|0;
				var replacement = charset.charAt(Math.random() * 64|0);
				string = string.substring(0, index) + replacement + string.substring(++index);
			}
			return string;
		}
			
	}
		
	// 2) Check the image integrety, manipulate again when its broken, otherwise run the callback
	function validate(result, object, attempts){
			
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var	image = new Image();
		
		image.onload = function(){
		
			context.drawImage(image, 0, 0, 2, 3);
			var sample = context.getImageData(0, 0, 2, 3).data;
			
			for (var i = 0, length = sample.length, broken = false, previous; i < length;){
				
				var r = sample[i++], g = sample[i++], b = sample[i++], a = sample[i++];
				var average = 0|(r + g + b) / 3;
				
				if (previous === average){ 
					broken = true;
					break;
				}
				
				previous = average;
				
			}
			if (broken) manipulate(object, attempts);
			else delegate(result, true, object);
			
		};
		image.onerror = function(){ manipulate(object, attempts) };
		image.src = result;
			
	}
	
	// C) Callback
	function delegate(result, succes, object){
				
		object.callback.call(object.context, result, succes, {
			source: object.source,
			strength: object.strength,
			attempts: object.attempts,
		});
		
	}
	
	// C) Utilities
	function error(message){ console.error(message) }
	
	function limit(number, min, max){
		return number < min ? min : number > max ? max : number;
	}
	
	// base64-encode a binary representation of an image file
	function encode(blob, type) {
					
		var data = [ "data:" + type + ";base64," ];
		var i = 0, length = blob.length;
		var	A, B, C;
	
		while (i < length){
			A = blob.charCodeAt(i++) & 0xff;
			if (i === length){
				data.push(charset.charAt(A >> 2));
				data.push(charset.charAt((A & 0x3) << 4));
				data.push("==");
				break;
			}
			B = blob.charCodeAt(i++);
			if (i === length){
				data.push(charset.charAt(A >> 2));
				data.push(charset.charAt(((A & 0x3)<< 4) | ((B & 0xF0) >> 4)));
				data.push(charset.charAt((B & 0xF) << 2));
				data.push("=");
				break;
			}
			C = blob.charCodeAt(i++);
				data.push(charset.charAt(A >> 2));
				data.push(charset.charAt(((A & 0x3) << 4) | ((B & 0xF0) >> 4)));
				data.push(charset.charAt(((B & 0xF) << 2) | ((C & 0xC0) >> 6)));
				data.push(charset.charAt(C & 0x3F));
		}
		
		return data.join("");
		
	}
	
}();