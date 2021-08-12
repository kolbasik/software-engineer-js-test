export const isImageFile = (file: File): boolean => {
	switch (file.type.toLowerCase()) {
		case 'image/jpeg':
		case 'image/png':
		case 'image/gif':
			return true;
		default:
			return false;
	}
};

export const mapImageBitmapToDataURL = (imageBitmap: ImageBitmap): string => {
	const canvas = document.createElement('canvas');
	canvas.width = imageBitmap.width;
	canvas.height = imageBitmap.height;
	const ctx = canvas.getContext('2d');
	ctx?.drawImage(imageBitmap, 0, 0);
	return canvas.toDataURL('image/jpeg');
};

export const mapDataURLToImage = async (
	dataURL: string,
): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.addEventListener('load', () => {
			resolve(img);
		});
		img.addEventListener('error', () => {
			reject(new Error('Unable to load image from file.'));
		});
		img.src = dataURL;
	});
