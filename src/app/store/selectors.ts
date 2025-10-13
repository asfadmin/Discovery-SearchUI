import { createSelectorFactory, defaultMemoize } from "@ngrx/store";
import * as models from '@models';


function rangeEquals(a: models.Range<any>, b: models.Range<any>): boolean {
    return a.start === b.start && a.end === b.end;
}

export const createRangeSelector =
    createSelectorFactory(
        (projectionFn) =>
            defaultMemoize(
                projectionFn,
                rangeEquals,
                rangeEquals
            )
    );

function objectEquals(a: object, b: object): boolean {
    return JSON.stringify(a) !== JSON.stringify(b);
}

export const createObjectSelector =
    createSelectorFactory(
        (projectionFn) =>
            defaultMemoize(
                projectionFn,
                objectEquals,
                objectEquals
            )
    );

function setEquals(a: Set<any> | any, b: Set<any> | any): boolean {
    const output =  a instanceof Set && b instanceof Set && a.size === b.size &&
      [...a].every(value => b.has(value));
    return output;
}

export const createSetSelector =
    createSelectorFactory(
        (projectionFn) =>
            defaultMemoize(
                projectionFn,
                setEquals,
                setEquals
            )
    );


function simpleArrayEquals(a: any[], b: any[]): boolean {
    if(!(a instanceof Array && b instanceof Array)) return false;
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export const createSimpleArraySelector =
    createSelectorFactory(
        (projectionFn) =>
            defaultMemoize(
                projectionFn,
                simpleArrayEquals,
                simpleArrayEquals
            )
    );
 

// array equality function for scenes
function sceneArrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((value, index) => {
            if (Array.isArray(value) && Array.isArray(b[index])) {
                return sceneArrayEquals(value, b[index])
            } else {
                return b.findIndex((b_value) => {
                    return b_value?.id === value?.id && b_value.metadata.date === value.metadata.date
                }) >= 0
            }
        }
        )
}

export const createSceneArraySelector =
    createSelectorFactory(
        (projectionFn) =>
            defaultMemoize(
                projectionFn,
                sceneArrayEquals,
                sceneArrayEquals
            )
    );