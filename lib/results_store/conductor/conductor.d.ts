import { ResultsStoreAction } from "../action_types/actions_types";
declare type Consolidate = (action: ResultsStoreAction) => void;
declare const dispatch: Consolidate;
export { dispatch };
