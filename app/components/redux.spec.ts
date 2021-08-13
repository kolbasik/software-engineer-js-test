import {createAction, createReducer, Payload} from './redux';

describe('redux', () => {
	describe('createAction', () => {
		it('should create an action factory', () => {
			// Arrange
			const actionType = 'TEST_ACTION';

			// Act
			const actionFactory = createAction<{n: number}>(actionType);

			// Assert
			expect(actionFactory).toBeDefined();
			expect(actionFactory.type).toBe(actionType);
			expect(String(actionFactory)).toBe(actionType);
			const action = actionFactory({n: 123});
			if (actionFactory.match(action)) {
				expect(action.payload.n).toBe(123);
			}
		});
	});

	describe('createReducer', () => {
		it('should create a reducer', () => {
			// Arrange
			const testAction = createAction<{dn: number}>('TEST_ACTION');

			// Act
			const reducer = createReducer<{n: number}>(
				{
					[testAction.type]: (
						{n, ...state},
						{dn}: Payload<typeof testAction>,
					) => ({...state, n: n + dn}),
				},
				{n: 12},
			);

			// Assert
			expect(reducer).toBeDefined();
			expect(reducer({n: 50}, testAction({dn: 5}))).toEqual({n: 55});
		});
	});
});
