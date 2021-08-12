import {
	PhotoEditingState,
	photoEditingReducer,
	movePhoto,
	scalePhoto,
} from './index';

describe('PhotoEditing', () => {
	// Arrange
	const previousState: PhotoEditingState = {
		project: {
			id: 'TEST',
			canvas: {width: 5, height: 10},
			image: {src: 'none', width: 50, height: 100},
			matrix: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
		},
	};

	describe('movePhoto', () => {
		it('should be handled', () => {
			// Act
			const nextState = photoEditingReducer(
				previousState,
				movePhoto({dx: -5, dy: -3}),
			);

			// Assert
			expect(nextState).not.toBe(previousState);
			expect(nextState).toMatchSnapshot();
		});
	});

	describe('scalePhoto', () => {
		it('should be handled', () => {
			// Act
			const nextState = photoEditingReducer(
				previousState,
				scalePhoto({scale: 2}),
			);

			// Assert
			expect(nextState).not.toBe(previousState);
			expect(nextState).toMatchSnapshot();
		});
	});
});
