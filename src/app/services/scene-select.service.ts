import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SceneSelectService {

  constructor() { }

  public nextId = (scenes, scene) => {
    if (!scenes[0]) {
      return;
    }

    if (!scene) {
      const firstScene = scenes[0];

      return firstScene.id;
    }

    const currentSelected = scenes
      .filter(g => g.name === scene.name)
      .pop();

    const nextIdx = Math.min(
      scenes.indexOf(currentSelected) + 1,
      scenes.length - 1
    );

    const nextScene = scenes[nextIdx];

    return nextScene.id;
  }

  public previousId = (scenes, scene) => {
    if (!scenes[0]) {
      return;
    }

    if (!scene) {
      const lastScene = scenes[scenes.length - 1];

      return lastScene.id;
    }

    const currentSelected = scenes
      .filter(g => g.name === scene.name)
      .pop();

    const previousIdx = Math.max(scenes.indexOf(currentSelected) - 1, 0);
    const previousScene = scenes[previousIdx];

    return previousScene.id;
  }
}
