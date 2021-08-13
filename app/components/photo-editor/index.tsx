import {h} from 'preact';
import {useReducer, useCallback, useMemo} from 'preact/hooks';
import {
	isImageFile,
	mapDataURLToImage,
	mapImageBitmapToDataURL,
} from '../files/images';
import {importPhotos, importJson} from '../files/import';
import type {Payload} from '../redux';
import {createAction, createReducer} from '../redux';
import {mapImageToProject, Project} from '../../types';
import {PhotoEditing} from '../photo-editing';

export type PhotoEditorState = {
	projects: Project[];
	activeProjectId?: string;
};

export const photoEditorInitialState: PhotoEditorState = Object.freeze({
	projects: [],
	activeProjectId: undefined,
});

export const addProjects = createAction<{projects: Project[]}>('ADD_PROJECTS');
export const updateProject = createAction<{project: Project}>('UPDATE_PROJECT');
export const deleteProject =
	createAction<{projectId: string}>('REMOVE_PROJECT');
export const setActiveProject =
	createAction<{activeProjectId: string}>('SET_ACTIVE_PROJECT');

export const photoEditorStateReducer = createReducer<PhotoEditorState>(
	{
		[addProjects.type]: (state, props: Payload<typeof addProjects>) => {
			const projects = [
				...new Map<string, Project>([
					...state.projects.map((it) => [it.id, it]),
					...props.projects.map((it) => [it.id, it]),
				] as Array<[string, Project]>).values(),
			];
			return {
				...state,
				projects,
				activeProjectId: state.activeProjectId ?? projects[0]?.id,
			};
		},
		[updateProject.type]: (
			state,
			{project}: Payload<typeof updateProject>,
		) => ({
			...state,
			projects: state.projects.map((it) =>
				it.id === project.id ? project : it,
			),
		}),
		[deleteProject.type]: (
			state,
			{projectId}: Payload<typeof deleteProject>,
		) => ({
			...state,
			projects: state.projects.filter((it) => it.id !== projectId),
		}),
		[setActiveProject.type]: (
			state,
			{activeProjectId}: Payload<typeof setActiveProject>,
		) => ({...state, activeProjectId}),
	},
	photoEditorInitialState,
);

export const PhotoEditor = (preloadedState: Partial<PhotoEditorState> = {}) => {
	const [{projects, activeProjectId}, dispatch] = useReducer(
		photoEditorStateReducer,
		{...photoEditorInitialState, ...preloadedState},
	);
	const activeProject = useMemo(
		() => projects.find((it) => it.id === activeProjectId),
		[projects, activeProjectId],
	);

	const handleImportProjects = useCallback(async () => {
		const file = await importJson();
		if (file) {
			const projects = JSON.parse(await file.text()) as Project[];
			dispatch(addProjects({projects}));
		}
	}, [projects]);

	const handleExportProjects = useCallback(() => {
		const downloadURL = URL.createObjectURL(
			new Blob([JSON.stringify(projects, null, 2)], {type: 'application/json'}),
		);
		const a = document.createElement('a');
		a.href = downloadURL;
		a.download = `projects-${Date.now()}.json`;
		a.click();
		setTimeout(() => {
			URL.revokeObjectURL(downloadURL);
		}, 5000);
	}, [projects]);

	const handleUploadImages = useCallback(async () => {
		const files = await importPhotos();
		const projects = await Promise.all(
			files
				.filter((file) => isImageFile(file))
				.map(async (file) => {
					const imageBitmap = await createImageBitmap(file, {resizeWidth: 600});
					const image = await mapDataURLToImage(
						mapImageBitmapToDataURL(imageBitmap),
					);
					return mapImageToProject(image, {width: 15, height: 10});
				}),
		);
		if (projects.length > 0) {
			dispatch(addProjects({projects}));
		}
	}, [projects]);

	const handleOnEditingSave = useCallback(
		async (project: Project) => {
			dispatch(updateProject({project}));
		},
		[dispatch],
	);

	return (
		<section>
			<header>
				<h1>Photo Editor</h1>
				<button onClick={handleUploadImages}>Upload Images</button>
				<button onClick={handleExportProjects}>Export Projects</button>
				<button onClick={handleImportProjects}>Import Projects</button>
			</header>
			<aside>
				<div class="projects">
					{projects.map((project) => (
						<div
							key={project.id}
							class="project"
							onClick={() => {
								dispatch(setActiveProject({activeProjectId: project.id}));
							}}
						>
							<img
								src={project.image.src}
								alt={project.id}
								crossOrigin="anonymous"
							/>
						</div>
					))}
				</div>
			</aside>
			<main>
				{activeProject && (
					<PhotoEditing
						key={activeProjectId}
						project={activeProject}
						onSave={handleOnEditingSave}
					/>
				)}
			</main>
		</section>
	);
};
