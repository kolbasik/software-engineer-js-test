import {
	PhotoEditorState,
	photoEditorStateReducer,
	addProjects,
	deleteProject,
	updateProject,
	setActiveProject,
} from './index';

describe('PhotoEditor', () => {
	// Arrange
	const previousState: PhotoEditorState = {
		projects: [
			{
				id: 'TEST',
				canvas: {width: 5, height: 10},
				image: {src: 'none', width: 50, height: 100},
				matrix: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
			},
		],
		activeProjectId: undefined,
	};

	describe('addProjects', () => {
		it('should be handled', () => {
			// Arrange
			const project = {
				id: 'TEST2',
				canvas: {width: 5, height: 10},
				image: {src: 'none', width: 50, height: 100},
				matrix: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
			};

			// Act
			const nextState = photoEditorStateReducer(
				previousState,
				addProjects({
					projects: [project],
				}),
			);

			// Assert
			expect(nextState).not.toBe(previousState);
			expect(nextState.projects[1]).toBe(project);
			expect(nextState).toMatchSnapshot();
		});
	});

	describe('deleteProject', () => {
		it('should be handled', () => {
			// Arrange
			const project = previousState.projects[0];

			// Act
			const nextState = photoEditorStateReducer(
				previousState,
				deleteProject({
					projectId: project.id,
				}),
			);

			// Assert
			expect(nextState).not.toBe(previousState);
			expect(nextState.projects.length).toBe(0);
			expect(nextState).toMatchSnapshot();
		});
	});

	describe('updateProject', () => {
		it('should be handled', () => {
			// Arrange
			const project = {...previousState.projects[0]};

			// Act
			const nextState = photoEditorStateReducer(
				previousState,
				updateProject({
					project,
				}),
			);

			// Assert
			expect(nextState).not.toBe(previousState);
			expect(nextState.projects[0]).toBe(project);
			expect(nextState).toMatchSnapshot();
		});
	});

	describe('setActiveProject', () => {
		it('should be handled', () => {
			// Arrange
			const project = previousState.projects[0];

			// Act
			const nextState = photoEditorStateReducer(
				previousState,
				setActiveProject({
					activeProjectId: project.id,
				}),
			);

			// Assert
			expect(nextState).not.toBe(previousState);
			expect(nextState.activeProjectId).toBe(project.id);
			expect(nextState).toMatchSnapshot();
		});
	});
});
