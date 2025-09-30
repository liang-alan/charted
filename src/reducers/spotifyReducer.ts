export type SpotifyState = {
    accessToken: string | null;
    refreshToken: string | null;
    tracks: any[];
    error: string | null;
    loading: boolean;
};

export type SpotifyAction =
    | { type: "SET_TOKENS"; payload: { accessToken: string; refreshToken?: string } }
    | { type: "SET_TRACKS"; payload: any[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "RESET" };

export const initialState: SpotifyState = {
    accessToken: null,
    refreshToken: null,
    tracks: [],
    error: null,
    loading: false,
};

export function spotifyReducer(state: SpotifyState, action: SpotifyAction): SpotifyState {
    switch (action.type) {
        case "SET_TOKENS":
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken ?? state.refreshToken,
            };
        case "SET_TRACKS":
            return { ...state, tracks: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}
