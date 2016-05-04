Glitch JS is a small and dependency free script that manipulates images by making a random edits causing visual glitches to appear. Supported file types are jpeg, png, and (animated) gif.

# Demo
Open this [demo hosted at CloudApp](http://f.cl.ly/items/3M321D100S0w2G360r0z/index.html) or index.html locally.

# Usage
## Examples
```
// Using a URL...
glitch("/image.jpg", callback);

// ...or base64-encoded string.
glitch(base64, callback);

// An (optional) strength can be set with the third parameter...
glitch(base64, callback, 10);

// ...and the (optional) maximum amount of manipulations before the effect fails with the fourth.   
glitch(base64, callback, 10, 25);
```

The callback arguments are a base64-encoded image string, a boolean indicating whether the manipulation was successful, and a data-object.
```
function callback(image, succes, object){
	// image {string}: a base64-encoded image string.
	// succes {boolean}: true if the manipulation was successful, otherwise false
	// object {object}: {
	//	source {string}: the base64-encoded unaffected source image.
	//	attempts {number}: the amount of iterations the glitch has taken.
	//	strength {number}: the strength of the glitch effect.
	// }
}
```
When glitch fails to create a valid manipulated image, the source image will be passed instead.

## Parameters 
- source {string}: a valid image URL or base64-encoded string is required for image manipulations to be made. Supported file types are jpeg, png, and gif.
- callback {function}: a Function that will run upon completion.
- strength {number}: a number between 5 and 100 to set the strength of the effect, defaults to 25.
- attempts {number}: an integer between 5 and 100 that limits the manipulation attempts, defaults to 50.

# Support
Should work on IE9 and above aside from cross domain requests which is currently supported in IE10 and above.
Tested using Chrome 50, Firefox 46 and Safari 9.1 on Mac OS X.
