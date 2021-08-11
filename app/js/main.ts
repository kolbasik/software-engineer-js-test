// NOTE: you can use CommonJS here, for instance:
// var foo = require("npm-dependency");
// var bar = require("./path/to/local/file_without_extension");
// module.exports = someVariable;

// grab DOM elements inside index.html

const fileSelector = document.querySelector('#fileSelector');
const imageContainer = document.querySelector('#imageContainer');
const debugContainer = document.querySelector('#debugContainer');
const generateButton = document.querySelector('#generateButton');

// Some functions to get you started !!

function log(message) {
	// Show debug/state message on screen
	debugContainer.innerHTML += '<p>' + message + '</p>';
}

fileSelector.addEventListener('change', (e) => {
	// Get all selected Files
	const files = e.target.files;
	let file;
	for (const file_ of files) {
		file = file_;
		// Check if file is valid Image (just a MIME check)
		switch (file.type) {
			case 'image/jpeg':
			case 'image/png':
			case 'image/gif':
				// Read Image contents from file
				var reader = new FileReader();
				reader.addEventListener('load', (e) => {
					// Create HTMLImageElement holding image data
					const img = new Image();
					img.src = reader.result;

					// Remove existing images from ImageContainer
					while (imageContainer.childNodes.length > 0)
						imageContainer.childNodes[0].remove();

					// Add image to container
					imageContainer.append(img);

					img.addEventListener('load', () => {
						// Grab some data from the image
						const imageData = {
							width: img.naturalWidth,
							height: img.naturalHeight,
						};
						log(
							'Loaded Image w/dimensions ' +
								imageData.width +
								' x ' +
								imageData.height,
						);
					});
					// Do your magic here...
				});

				reader.readAsDataURL(file);
				// Process just one file.
				return;

			default:
				log('not a valid Image file :' + file.name);
		}
	}
});

generateButton.addEventListener('click', (e) => {
	log('GENERATE BUTTON CLICKED!! Should this do something else?');
});

log('Test application ready');
