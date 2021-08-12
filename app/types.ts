import {Matrix, identity, transform, scale, translate} from 'transformation-matrix';

export type {Matrix} from 'transformation-matrix';

export type Size = {
	width: number;
	height: number;
};

export type Project = {
	id: string;
	canvas: Size;
	image: {src: string} & Size;
	matrix: Matrix;
};

export const generateId = (): string =>
	Math.random().toString(16).slice(2).padStart(12, '0');

export const mapImageToProject = (image: HTMLImageElement, canvas: Size): Project => {
	const widthRatio = canvas.width / image.width;
	const heightRatio = canvas.height / image.height;
	const reScale = Math.max(widthRatio, heightRatio);
	const matrix = transform(
		translate((canvas.width - (reScale * image.width)) / 2, (canvas.height - (reScale * image.height)) / 2),
		scale(reScale, reScale),
		identity(),
	);
	return ({
		id: generateId(),
		canvas,
		image: {
			src: image.src,
			width: image.naturalWidth,
			height: image.naturalHeight,
		},
		matrix,
	});
};
