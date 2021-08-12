import {h} from 'preact';
import {
	useReducer,
	useCallback,
	useRef,
	useEffect,
	useState,
} from 'preact/hooks';
import {transform, scale, translate, applyToPoint} from 'transformation-matrix';
import type {Project, Matrix} from '../../types';
import type {Payload} from '../redux';
import {createAction, createReducer} from '../redux';
import {mapDataURLToImage} from '../files/images';

const isPhotoOnCanvas = ({canvas, image}: Project, matrix: Matrix): boolean => {
	const tl = applyToPoint(matrix, {x: 0, y: 0});
	if (tl.x > 0 || tl.y > 0) {
		return false;
	}

	const br = applyToPoint(matrix, {x: image.width, y: image.height});
	if (br.x < canvas.width || br.y < canvas.height) {
		return false;
	}

	return true;
};

export type PhotoEditingState = {
	project: Project;
};

export const scalePhoto = createAction<{scale: number}>('SCALE_PHOTO');
export const movePhoto = createAction<{dx: number; dy: number}>('MOVE_PHOTO');

export const photoEditingReducer = createReducer<PhotoEditingState>(
	{
		[scalePhoto.type]: (state, props: Payload<typeof scalePhoto>) => {
			const {project} = state;
			const matrix = transform(
				scale(
					props.scale,
					props.scale,
					project.canvas.width / 2,
					project.canvas.height / 2,
				),
				project.matrix,
			);
			if (isPhotoOnCanvas(project, matrix)) {
				return {...state, project: {...project, matrix}};
			}

			return state;
		},
		[movePhoto.type]: (state, props: Payload<typeof movePhoto>) => {
			const {project} = state;
			const matrix = transform(translate(props.dx, props.dy), project.matrix);
			if (isPhotoOnCanvas(project, matrix)) {
				return {...state, project: {...project, matrix}};
			}

			return state;
		},
	},
	{} as unknown as PhotoEditingState,
);

export const PhotoEditing = (props: {
	project: Project;
	onSave: (project: Project) => void;
}) => {
	const [{project}, dispatch] = useReducer(photoEditingReducer, {
		project: props.project,
	});
	const $canvas = useRef<HTMLCanvasElement>(null);
	const [$image, setImage] = useState<HTMLImageElement>();
	const [$context, setContext] = useState<CanvasRenderingContext2D>();

	useEffect(() => {
		mapDataURLToImage(project.image.src)
			.then((image) => {
				setImage(image);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [project.image.src]);
	useEffect(() => {
		if ($canvas.current) {
			const context = $canvas.current.getContext('2d');
			if (context) {
				setContext(context);
			}
		}
	}, [$canvas.current]);
	useEffect(() => {
		if ($image && $context) {
			const {canvas} = $context;
			const deviceScale =
				(devicePixelRatio * canvas.clientWidth) / project.canvas.width;
			canvas.width = deviceScale * project.canvas.width;
			canvas.height = deviceScale * project.canvas.height;
			$context.scale(deviceScale, deviceScale);
			const {a, b, c, d, e, f} = project.matrix;
			$context.transform(a, b, c, d, e, f);
			$context.drawImage($image, 0, 0);
		}
	}, [$image, $context, project]);

	const handleSave = useCallback(() => {
		props.onSave(project);
	}, [props, project]);
	const handleScalePhoto50 = useCallback(() => {
		dispatch(scalePhoto({scale: 0.5}));
	}, [dispatch]);
	const handleScalePhoto200 = useCallback(() => {
		dispatch(scalePhoto({scale: 2}));
	}, [dispatch]);
	const handleMovePhotoLeft = useCallback(() => {
		dispatch(movePhoto({dx: -1 / 2.54, dy: 0}));
	}, [dispatch]);
	const handleMovePhotoRight = useCallback(() => {
		dispatch(movePhoto({dx: 1 / 2.54, dy: 0}));
	}, [dispatch]);

	return (
		<section>
			<header>
				<h1>Editing {project.id}</h1>
				<button onClick={handleSave}>Save</button>
				<button onClick={handleScalePhoto50}>Scale 50%</button>
				<button onClick={handleScalePhoto200}>Scale 200%</button>
				<button onClick={handleMovePhotoLeft}>Move Left</button>
				<button onClick={handleMovePhotoRight}>Move Right</button>
			</header>
			<canvas ref={$canvas} style={{width: '100%'}} />
		</section>
	);
};
