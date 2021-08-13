export type Action<TPayload = unknown> = {type: string; payload: TPayload};

export type ActionCreator<TPayload> = {
	(payload: TPayload): Action<TPayload>;
	type: Readonly<string>;
	match(action: Action): action is Action<TPayload>;
};

export type Payload<TActionCreator extends ActionCreator<any>> =
	TActionCreator extends ActionCreator<infer TPayload> ? TPayload : unknown;

export const createAction = function <TPayload>(
	type: string,
): ActionCreator<TPayload> {
	const factory: ActionCreator<TPayload> = (
		payload: TPayload,
	): Action<TPayload> => ({
		type,
		payload,
	});
	factory.type = type;
	factory.toString = () => type;
	factory.match = (it: Action): it is Action<TPayload> => it.type === type;

	return factory;
};

export type Reducer<TState, TAction> = (
	previousState: TState,
	action: TAction,
) => TState;

export const createReducer =
	<TState>(
		handlers: Record<string, (state: TState, payload: any) => TState>,
		initialValue: TState,
	): Reducer<TState, Action> =>
	(state: TState = initialValue, action?: Action) =>
		(action && handlers[action.type]?.(state, action.payload)) || state;
