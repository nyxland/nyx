import IModule from '../interfaces/Module.js';

export const http: IModule = {
  async get(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    return { data };
  }
};
