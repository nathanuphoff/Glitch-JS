Glitch JS is a small and dependency free script that manipulates images by making a random edits causing visual glitches to appear. Supported file types are jpeg, png, and (animated) gif.

# Demo
*coming soon...*

# Usage
## Examples
```
// Using a URL...
glitch("/image.jpg", callback);

// ...or base64-encoded string.
glitch(base64, callback);
```

The callback arguments are a base64-encoded image string and a boolean indicating whether the manipulation was successful.
```
function callback(image, succes){
	// do whatever...  
}
```
When glitch fails to create a valid manipulated image, the original image will be passed instead.

## Parameters 
- source {string}: a valid image URL or base64-encoded string is required for image manipulations to be made. Supported file types are jpeg, png, and gif.
- callback {function}: a Function that will run upon completion.
- strength {number}: a number between 5 and 100 to set the strength of the effect, defaults to 25.
- attempts {number}: an integer between 5 and 100 that limits the manipulation attempts, defaults to 50.

# Support
Should work on IE9 and above aside from cross domain requests which is currently supported in IE10 and above.
Tested using Chrome 50, Firefox 46 and Safari 9.1 on Mac OS X.
